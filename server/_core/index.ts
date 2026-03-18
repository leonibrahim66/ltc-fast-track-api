import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { handleMtnWebhook } from "../mtn-webhook";
import { startTransactionMonitor, stopTransactionMonitor } from "../transaction-monitor";
import { requestPayment } from "../payment-service";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  // MTN MoMo Webhook — POST /api/mtn/webhook
  // Raw body is captured above for signature validation
  app.post("/api/mtn/webhook", handleMtnWebhook);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

app.post("/api/payments/pawapay/deposit", async (req, res) => {
  try {
    const { amount, phone, network } = req.body;

    const result = await requestPayment({
      payerId: 1,
      providerId: 1,
      providerRole: "carrier_driver",
      serviceType: "carrier",
      amountTotal: amount,
      paymentMethod: "mtn_momo",
      customerPhone: phone,
    });

    res.json(result);

  } catch (error: any) {
    console.error("Deposit error:", error);
    res.status(500).json({ error: error.message || "Payment failed" });
  }
});

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
    // Start background transaction monitor
    startTransactionMonitor();
  });

  // Graceful shutdown
  const shutdown = () => {
    stopTransactionMonitor();
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer().catch(console.error);



