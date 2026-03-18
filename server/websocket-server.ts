import { createServer } from 'http';
// @ts-ignore
import { WebSocketServer, WebSocket } from 'ws';
import { parse } from 'url';
import { EventEmitter } from 'events';

interface WebSocketClient {
  id: string;
  userId: string;
  ws: WebSocket;
  connectedAt: number;
  lastHeartbeat: number;
  subscriptions: Set<string>;
}

interface LocationUpdate {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface RouteUpdate {
  routeId: string;
  collectorId: string;
  currentWaypoint: { latitude: number; longitude: number };
  waypointIndex: number;
  totalWaypoints: number;
  distanceTraveled: number;
  estimatedTimeRemaining: number;
  timestamp: number;
}

interface GeofenceEvent {
  eventType: 'entry' | 'exit';
  zoneId: string;
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export class WebSocketServerManager extends EventEmitter {
  private wss: any; // WebSocketServer
  private clients: Map<string, WebSocketClient> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageQueue: Array<{ clientId: string; message: any }> = [];
  private maxClients: number = 1000;
  private heartbeatTimeout: number = 30000; // 30 seconds

  constructor(port: number = 3001) {
    super();
    const server = createServer();
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.setupWebSocketServer();
    this.startHeartbeat();

    server.listen(port, () => {
      console.log(`WebSocket server listening on port ${port}`);
      this.emit('server-started', { port });
    });
  }

  private setupWebSocketServer(): void {
    (this.wss as any).on('connection', (ws: WebSocket, req: any) => {
      const clientId = this.generateClientId();
      const query = parse(req.url || '', true).query;
      const userId = query.userId as string;

      if (!userId) {
        ws.close(1008, 'Missing userId');
        return;
      }

      if (this.clients.size >= this.maxClients) {
        ws.close(1008, 'Server at capacity');
        return;
      }

      const client: WebSocketClient = {
        id: clientId,
        userId,
        ws,
        connectedAt: Date.now(),
        lastHeartbeat: Date.now(),
        subscriptions: new Set(),
      };

      this.clients.set(clientId, client);
      this.emit('client-connected', { clientId, userId });

      ws.on('message', (data: Buffer) => this.handleMessage(clientId, data));
      ws.on('close', () => this.handleClientDisconnect(clientId));
      ws.on('error', (error: any) => this.handleClientError(clientId, error));

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection',
        status: 'connected',
        clientId,
        timestamp: Date.now(),
      });
    });
  }

  private handleMessage(clientId: string, data: Buffer): void {
    try {
      const client = this.clients.get(clientId);
      if (!client) return;

      const message = JSON.parse(data.toString());
      client.lastHeartbeat = Date.now();

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(clientId, message.channel);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, message.channel);
          break;
        case 'location':
          this.broadcastLocationUpdate(message.data);
          break;
        case 'route':
          this.broadcastRouteUpdate(message.data);
          break;
        case 'geofence':
          this.broadcastGeofenceEvent(message.data);
          break;
        case 'ping':
          this.sendToClient(clientId, { type: 'pong', timestamp: Date.now() });
          break;
        default:
          this.emit('unknown-message', { clientId, message });
      }
    } catch (error) {
      console.error(`Error handling message from ${clientId}:`, error);
    }
  }

  private handleSubscribe(clientId: string, channel: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.add(channel);

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)!.add(clientId);

    this.sendToClient(clientId, {
      type: 'subscribed',
      channel,
      timestamp: Date.now(),
    });

    this.emit('client-subscribed', { clientId, channel });
  }

  private handleUnsubscribe(clientId: string, channel: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.delete(channel);

    const subscribers = this.subscriptions.get(channel);
    if (subscribers) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.subscriptions.delete(channel);
      }
    }

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      channel,
      timestamp: Date.now(),
    });

    this.emit('client-unsubscribed', { clientId, channel });
  }

  private handleClientDisconnect(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Clean up subscriptions
    client.subscriptions.forEach((channel) => {
      const subscribers = this.subscriptions.get(channel);
      if (subscribers) {
        subscribers.delete(clientId);
        if (subscribers.size === 0) {
          this.subscriptions.delete(channel);
        }
      }
    });

    this.clients.delete(clientId);
    this.emit('client-disconnected', { clientId, userId: client.userId });
  }

  private handleClientError(clientId: string, error: Error): void {
    console.error(`WebSocket error for client ${clientId}:`, error);
    this.emit('client-error', { clientId, error: error.message });
  }

  private broadcastLocationUpdate(location: LocationUpdate): void {
    const channel = `location:${location.userId}`;
    const subscribers = this.subscriptions.get(channel);

    if (subscribers) {
      const message = {
        type: 'location',
        data: location,
        timestamp: Date.now(),
      };

      subscribers.forEach((clientId) => {
        this.sendToClient(clientId, message);
      });
    }

    this.emit('location-broadcast', { location, subscriberCount: subscribers?.size || 0 });
  }

  private broadcastRouteUpdate(route: RouteUpdate): void {
    const channel = `route:${route.collectorId}`;
    const subscribers = this.subscriptions.get(channel);

    if (subscribers) {
      const message = {
        type: 'route',
        data: route,
        timestamp: Date.now(),
      };

      subscribers.forEach((clientId) => {
        this.sendToClient(clientId, message);
      });
    }

    this.emit('route-broadcast', { route, subscriberCount: subscribers?.size || 0 });
  }

  private broadcastGeofenceEvent(event: GeofenceEvent): void {
    const channel = `geofence:${event.zoneId}`;
    const subscribers = this.subscriptions.get(channel);

    if (subscribers) {
      const message = {
        type: 'geofence',
        data: event,
        timestamp: Date.now(),
      };

      subscribers.forEach((clientId) => {
        this.sendToClient(clientId, message);
      });
    }

    this.emit('geofence-broadcast', { event, subscriberCount: subscribers?.size || 0 });
  }

  private sendToClient(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (!client) {
      this.messageQueue.push({ clientId, message });
      return;
    }

    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push({ clientId, message });
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval((): void => {
      const now = Date.now();
      const deadClients: string[] = [];

      this.clients.forEach((client, clientId) => {
        if (now - client.lastHeartbeat > this.heartbeatTimeout) {
          deadClients.push(clientId);
        } else {
          this.sendToClient(clientId, {
            type: 'heartbeat',
            timestamp: now,
          });
        }
      });

      // Close dead connections
      deadClients.forEach((clientId) => {
        const client = this.clients.get(clientId);
        if (client) {
          client.ws.close(1000, 'Heartbeat timeout');
          this.handleClientDisconnect(clientId);
        }
      });
    }, 10000) as unknown as NodeJS.Timeout; // Check every 10 seconds
  }

  private generateClientId(): string {
    return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public getStatistics() {
    return {
      connectedClients: this.clients.size,
      activeChannels: this.subscriptions.size,
      messageQueueSize: this.messageQueue.length,
      maxClients: this.maxClients,
      clients: Array.from(this.clients.values()).map((c) => ({
        id: c.id,
        userId: c.userId,
        connectedAt: c.connectedAt,
        subscriptions: Array.from(c.subscriptions),
      })),
    };
  }

  public broadcast(channel: string, message: any): void {
    const subscribers = this.subscriptions.get(channel);
    if (subscribers) {
      subscribers.forEach((clientId) => {
        this.sendToClient(clientId, {
          type: 'broadcast',
          channel,
          data: message,
          timestamp: Date.now(),
        });
      });
    }
  }

  public close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.wss.close();
    this.emit('server-closed');
  }
}

// Export singleton instance
let wsServerInstance: WebSocketServerManager | null = null;

export function getWebSocketServer(port?: number): WebSocketServerManager {
  if (!wsServerInstance) {
    wsServerInstance = new WebSocketServerManager(port || 3001);
  }
  return wsServerInstance;
}
