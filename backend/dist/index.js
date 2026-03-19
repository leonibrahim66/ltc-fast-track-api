var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminSettings: () => adminSettings,
  bookings: () => bookings,
  commissionAuditLog: () => commissionAuditLog,
  commissionRules: () => commissionRules,
  customerLinkedAccounts: () => customerLinkedAccounts,
  customerWalletTransactions: () => customerWalletTransactions,
  customerWallets: () => customerWallets,
  disputes: () => disputes,
  driverActivityLog: () => driverActivityLog,
  driverDocuments: () => driverDocuments,
  driverProfiles: () => driverProfiles,
  driverRatings: () => driverRatings,
  driverStatus: () => driverStatus,
  driverWallets: () => driverWallets,
  driverWithdrawals: () => driverWithdrawals,
  paymentTransactions: () => paymentTransactions,
  platformWallet: () => platformWallet,
  providerWallets: () => providerWallets,
  transportJobs: () => transportJobs,
  userNotifications: () => userNotifications,
  users: () => users,
  vehicles: () => vehicles,
  walletTransactions: () => walletTransactions,
  withdrawalRequests: () => withdrawalRequests,
  zoneCollectors: () => zoneCollectors,
  zones: () => zones
});
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";
var users, driverProfiles, driverDocuments, transportJobs, driverWallets, walletTransactions, driverWithdrawals, driverRatings, driverActivityLog, adminSettings, disputes, bookings, vehicles, zones, zoneCollectors, customerWallets, customerWalletTransactions, customerLinkedAccounts, paymentTransactions, platformWallet, providerWallets, withdrawalRequests, commissionRules, commissionAuditLog, driverStatus, userNotifications;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      phone: varchar("phone", { length: 20 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin", "driver", "carrier"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    driverProfiles = mysqlTable("driver_profiles", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().unique(),
      fullName: varchar("fullName", { length: 255 }).notNull(),
      phone: varchar("phone", { length: 20 }).notNull(),
      email: varchar("email", { length: 320 }),
      vehicleType: mysqlEnum("vehicleType", ["motorbike", "van", "pickup", "truck", "trailer"]).notNull(),
      plateNumber: varchar("plateNumber", { length: 50 }).notNull(),
      isOnline: boolean("isOnline").default(false).notNull(),
      isApproved: boolean("isApproved").default(false).notNull(),
      isSuspended: boolean("isSuspended").default(false).notNull(),
      averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0.00"),
      totalRatings: int("totalRatings").default(0),
      totalCompletedJobs: int("totalCompletedJobs").default(0),
      commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("10.00"),
      approvedAt: timestamp("approvedAt"),
      suspendedAt: timestamp("suspendedAt"),
      suspensionReason: text("suspensionReason"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    driverDocuments = mysqlTable("driver_documents", {
      id: int("id").autoincrement().primaryKey(),
      driverId: int("driverId").notNull(),
      documentType: mysqlEnum("documentType", ["drivers_license", "nrc_id", "passport", "vehicle_photo"]).notNull(),
      fileUrl: text("fileUrl").notNull(),
      fileName: varchar("fileName", { length: 255 }),
      isVerified: boolean("isVerified").default(false).notNull(),
      verifiedAt: timestamp("verifiedAt"),
      verifiedBy: int("verifiedBy"),
      rejectionReason: text("rejectionReason"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    transportJobs = mysqlTable("transport_jobs", {
      id: int("id").autoincrement().primaryKey(),
      customerId: int("customerId").notNull(),
      driverId: int("driverId"),
      customerName: varchar("customerName", { length: 255 }).notNull(),
      customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
      pickupLocation: text("pickupLocation").notNull(),
      pickupLatitude: decimal("pickupLatitude", { precision: 10, scale: 8 }),
      pickupLongitude: decimal("pickupLongitude", { precision: 11, scale: 8 }),
      dropoffLocation: text("dropoffLocation").notNull(),
      dropoffLatitude: decimal("dropoffLatitude", { precision: 10, scale: 8 }),
      dropoffLongitude: decimal("dropoffLongitude", { precision: 11, scale: 8 }),
      distance: decimal("distance", { precision: 10, scale: 2 }),
      cargoType: varchar("cargoType", { length: 255 }),
      cargoDescription: text("cargoDescription"),
      cargoWeight: varchar("cargoWeight", { length: 100 }),
      vehicleRequired: mysqlEnum("vehicleRequired", ["motorbike", "van", "pickup", "truck", "trailer"]),
      estimatedPrice: decimal("estimatedPrice", { precision: 10, scale: 2 }),
      finalPrice: decimal("finalPrice", { precision: 10, scale: 2 }),
      commissionAmount: decimal("commissionAmount", { precision: 10, scale: 2 }),
      driverEarnings: decimal("driverEarnings", { precision: 10, scale: 2 }),
      status: mysqlEnum("status", ["pending", "accepted", "arrived", "picked_up", "in_transit", "delivered", "completed", "cancelled", "rejected"]).default("pending").notNull(),
      scheduledTime: timestamp("scheduledTime"),
      acceptedAt: timestamp("acceptedAt"),
      arrivedAt: timestamp("arrivedAt"),
      pickedUpAt: timestamp("pickedUpAt"),
      deliveredAt: timestamp("deliveredAt"),
      completedAt: timestamp("completedAt"),
      cancelledAt: timestamp("cancelledAt"),
      cancellationReason: text("cancellationReason"),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    driverWallets = mysqlTable("driver_wallets", {
      id: int("id").autoincrement().primaryKey(),
      driverId: int("driverId").notNull().unique(),
      balance: decimal("balance", { precision: 12, scale: 2 }).default("0.00").notNull(),
      totalEarnings: decimal("totalEarnings", { precision: 12, scale: 2 }).default("0.00").notNull(),
      totalWithdrawn: decimal("totalWithdrawn", { precision: 12, scale: 2 }).default("0.00").notNull(),
      pendingWithdrawal: decimal("pendingWithdrawal", { precision: 12, scale: 2 }).default("0.00").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    walletTransactions = mysqlTable("wallet_transactions", {
      id: int("id").autoincrement().primaryKey(),
      driverId: int("driverId").notNull(),
      jobId: int("jobId"),
      type: mysqlEnum("type", ["earning", "withdrawal", "bonus", "deduction", "refund"]).notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      balanceAfter: decimal("balanceAfter", { precision: 12, scale: 2 }).notNull(),
      description: text("description"),
      reference: varchar("reference", { length: 100 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    driverWithdrawals = mysqlTable("driver_withdrawals", {
      id: int("id").autoincrement().primaryKey(),
      driverId: int("driverId").notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      withdrawalMethod: mysqlEnum("withdrawalMethod", ["mobile_money", "bank_transfer"]).notNull(),
      accountNumber: varchar("accountNumber", { length: 100 }).notNull(),
      accountName: varchar("accountName", { length: 255 }),
      bankName: varchar("bankName", { length: 255 }),
      mobileProvider: varchar("mobileProvider", { length: 100 }),
      status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "cancelled"]).default("pending").notNull(),
      processedAt: timestamp("processedAt"),
      processedBy: int("processedBy"),
      failureReason: text("failureReason"),
      transactionReference: varchar("transactionReference", { length: 100 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    driverRatings = mysqlTable("driver_ratings", {
      id: int("id").autoincrement().primaryKey(),
      driverId: int("driverId").notNull(),
      customerId: int("customerId").notNull(),
      jobId: int("jobId").notNull(),
      rating: int("rating").notNull(),
      review: text("review"),
      isPublic: boolean("isPublic").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    driverActivityLog = mysqlTable("driver_activity_log", {
      id: int("id").autoincrement().primaryKey(),
      driverId: int("driverId").notNull(),
      activityType: mysqlEnum("activityType", ["online", "offline", "job_accepted", "job_rejected", "job_completed", "job_cancelled", "withdrawal_requested", "profile_updated", "document_uploaded"]).notNull(),
      jobId: int("jobId"),
      details: text("details"),
      ipAddress: varchar("ipAddress", { length: 45 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    adminSettings = mysqlTable("admin_settings", {
      id: int("id").autoincrement().primaryKey(),
      settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
      settingValue: text("settingValue").notNull(),
      description: text("description"),
      updatedBy: int("updatedBy"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    disputes = mysqlTable("disputes", {
      id: int("id").autoincrement().primaryKey(),
      jobId: int("jobId").notNull(),
      reportedBy: int("reportedBy").notNull(),
      reportedAgainst: int("reportedAgainst").notNull(),
      reporterType: mysqlEnum("reporterType", ["customer", "driver"]).notNull(),
      reason: text("reason").notNull(),
      status: mysqlEnum("status", ["open", "investigating", "resolved", "closed"]).default("open").notNull(),
      resolution: text("resolution"),
      resolvedBy: int("resolvedBy"),
      resolvedAt: timestamp("resolvedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    bookings = mysqlTable("bookings", {
      id: int("id").autoincrement().primaryKey(),
      customerId: int("customerId").notNull(),
      driverId: int("driverId"),
      customerName: varchar("customerName", { length: 255 }).notNull(),
      customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
      pickupLocation: text("pickupLocation").notNull(),
      dropoffLocation: text("dropoffLocation").notNull(),
      cargoType: varchar("cargoType", { length: 255 }),
      cargoWeight: varchar("cargoWeight", { length: 100 }),
      estimatedPrice: decimal("estimatedPrice", { precision: 10, scale: 2 }),
      status: mysqlEnum("status", ["pending", "accepted", "in-progress", "completed", "rejected", "cancelled"]).default("pending").notNull(),
      vehicleRequired: varchar("vehicleRequired", { length: 255 }),
      scheduledTime: timestamp("scheduledTime"),
      completedAt: timestamp("completedAt"),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    vehicles = mysqlTable("vehicles", {
      id: int("id").autoincrement().primaryKey(),
      driverId: int("driverId").notNull(),
      vehicleType: varchar("vehicleType", { length: 255 }).notNull(),
      plateNumber: varchar("plateNumber", { length: 50 }).notNull(),
      capacity: varchar("capacity", { length: 100 }),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    zones = mysqlTable("zones", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      city: varchar("city", { length: 100 }).notNull(),
      description: text("description"),
      boundaries: text("boundaries"),
      // JSON string of coordinates
      status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
      householdCount: int("householdCount").default(0).notNull(),
      collectorCount: int("collectorCount").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    zoneCollectors = mysqlTable("zone_collectors", {
      id: int("id").autoincrement().primaryKey(),
      zoneId: int("zoneId").notNull(),
      collectorId: int("collectorId").notNull(),
      assignedAt: timestamp("assignedAt").defaultNow().notNull()
    });
    customerWallets = mysqlTable("customer_wallets", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      totalBalance: decimal("totalBalance", { precision: 10, scale: 2 }).default("0.00").notNull(),
      rechargedBalance: decimal("rechargedBalance", { precision: 10, scale: 2 }).default("0.00").notNull(),
      referralBalance: decimal("referralBalance", { precision: 10, scale: 2 }).default("0.00").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    customerWalletTransactions = mysqlTable("customer_wallet_transactions", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      type: mysqlEnum("type", ["recharge", "withdrawal", "referral", "payment"]).notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      status: mysqlEnum("status", ["completed", "pending", "failed"]).default("pending").notNull(),
      description: text("description"),
      referenceId: varchar("referenceId", { length: 255 }),
      // Payment gateway reference or transaction ID
      bankDetails: text("bankDetails"),
      // For withdrawals
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    customerLinkedAccounts = mysqlTable("customer_linked_accounts", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      provider: mysqlEnum("provider", ["mtn_momo", "airtel_money", "zamtel_money"]).notNull(),
      phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
      withdrawalPin: varchar("withdrawalPin", { length: 255 }).notNull(),
      // Hashed PIN
      status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    paymentTransactions = mysqlTable("payment_transactions", {
      id: int("id").autoincrement().primaryKey(),
      // Payer (customer)
      payerId: int("payerId").notNull(),
      // Provider receiving the 90% payout
      providerId: int("providerId").notNull(),
      providerRole: mysqlEnum("providerRole", ["zone_manager", "carrier_driver"]).notNull(),
      // Service type
      serviceType: mysqlEnum("serviceType", ["garbage", "carrier"]).notNull(),
      // Reference to the originating job/booking (nullable for future flexibility)
      serviceReferenceId: int("serviceReferenceId"),
      // Financial breakdown — all calculated on backend, never trusted from frontend
      amountTotal: decimal("amountTotal", { precision: 12, scale: 2 }).notNull(),
      platformCommission: decimal("platformCommission", { precision: 12, scale: 2 }).notNull(),
      // amountTotal * rate
      providerAmount: decimal("providerAmount", { precision: 12, scale: 2 }).notNull(),
      // amountTotal - commission
      // Commission tracking fields (for reporting and auditing)
      commissionAmount: decimal("commissionAmount", { precision: 12, scale: 2 }),
      // alias for platformCommission
      platformAmount: decimal("platformAmount", { precision: 12, scale: 2 }),
      // amount credited to platform wallet
      transactionSource: mysqlEnum("transactionSource", ["garbage", "carrier", "subscription"]),
      // originating service
      appliedCommissionRate: decimal("appliedCommissionRate", { precision: 5, scale: 4 }),
      // e.g. 0.1000 = 10%
      // Payment gateway fields (populated when MTN MoMo is integrated)
      paymentMethod: mysqlEnum("paymentMethod", ["mtn_momo", "airtel_money", "zamtel_money", "bank_transfer", "manual"]).default("manual").notNull(),
      referenceId: varchar("referenceId", { length: 128 }).unique(),
      // External gateway reference
      callbackPayload: text("callbackPayload"),
      // Raw callback JSON from gateway
      // Lifecycle status
      status: mysqlEnum("status", [
        "pending",
        // Payment requested, awaiting gateway confirmation
        "processing",
        // Gateway processing
        "completed",
        // Payment confirmed, provider credited
        "released",
        // Provider payout released
        "failed",
        // Payment failed
        "refunded",
        // Payment refunded to customer
        "cancelled"
        // Cancelled before processing
      ]).default("pending").notNull(),
      // Withdrawal tracking
      withdrawalRequestedAt: timestamp("withdrawalRequestedAt"),
      withdrawalCompletedAt: timestamp("withdrawalCompletedAt"),
      withdrawalReference: varchar("withdrawalReference", { length: 128 }),
      // Audit
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    platformWallet = mysqlTable("platform_wallet", {
      id: int("id").autoincrement().primaryKey(),
      totalCommissionEarned: decimal("totalCommissionEarned", { precision: 14, scale: 2 }).default("0.00").notNull(),
      availableBalance: decimal("availableBalance", { precision: 14, scale: 2 }).default("0.00").notNull(),
      totalWithdrawn: decimal("totalWithdrawn", { precision: 14, scale: 2 }).default("0.00").notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    providerWallets = mysqlTable("provider_wallets", {
      id: int("id").autoincrement().primaryKey(),
      providerId: int("providerId").notNull().unique(),
      providerRole: mysqlEnum("providerRole", ["zone_manager", "carrier_driver"]).notNull(),
      availableBalance: decimal("availableBalance", { precision: 12, scale: 2 }).default("0.00").notNull(),
      totalEarned: decimal("totalEarned", { precision: 12, scale: 2 }).default("0.00").notNull(),
      totalWithdrawn: decimal("totalWithdrawn", { precision: 12, scale: 2 }).default("0.00").notNull(),
      pendingBalance: decimal("pendingBalance", { precision: 12, scale: 2 }).default("0.00").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    withdrawalRequests = mysqlTable("withdrawal_requests", {
      id: int("id").autoincrement().primaryKey(),
      providerId: int("providerId").notNull(),
      providerRole: mysqlEnum("providerRole", ["zone_manager", "carrier_driver"]).notNull(),
      amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
      withdrawalMethod: mysqlEnum("withdrawalMethod", ["mtn_momo", "airtel_money", "zamtel_money", "bank_transfer"]).notNull(),
      accountNumber: varchar("accountNumber", { length: 64 }).notNull(),
      accountName: varchar("accountName", { length: 255 }),
      status: mysqlEnum("status", [
        "pending",
        // Awaiting admin review
        "approved",
        // Admin approved, payout queued
        "rejected",
        // Admin rejected
        "completed",
        // Payout sent successfully
        "failed"
        // Payout failed after approval
      ]).default("pending").notNull(),
      // Admin action tracking
      reviewedBy: varchar("reviewedBy", { length: 128 }),
      // Admin username
      reviewedAt: timestamp("reviewedAt"),
      adminNotes: text("adminNotes"),
      // MTN reference (populated after payout)
      withdrawalReference: varchar("withdrawalReference", { length: 128 }),
      mtnDisbursementAccepted: boolean("mtnDisbursementAccepted").default(false),
      // Audit
      requestedAt: timestamp("requestedAt").defaultNow().notNull(),
      completedAt: timestamp("completedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    commissionRules = mysqlTable("commission_rules", {
      id: int("id").autoincrement().primaryKey(),
      serviceType: mysqlEnum("serviceType", ["garbage", "carrier", "subscription"]).notNull().unique(),
      rate: decimal("rate", { precision: 5, scale: 4 }).notNull().default("0.1000"),
      // e.g. 0.1000 = 10%
      isActive: boolean("isActive").default(true).notNull(),
      description: text("description"),
      createdBy: varchar("createdBy", { length: 128 }).notNull().default("system"),
      updatedBy: varchar("updatedBy", { length: 128 }).notNull().default("system"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    commissionAuditLog = mysqlTable("commission_audit_log", {
      id: int("id").autoincrement().primaryKey(),
      serviceType: mysqlEnum("serviceType", ["garbage", "carrier", "subscription"]).notNull(),
      oldRate: decimal("oldRate", { precision: 5, scale: 4 }).notNull(),
      newRate: decimal("newRate", { precision: 5, scale: 4 }).notNull(),
      changedBy: varchar("changedBy", { length: 128 }).notNull(),
      reason: text("reason"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    driverStatus = mysqlTable("driver_status", {
      id: int("id").autoincrement().primaryKey(),
      driverId: varchar("driverId", { length: 128 }).notNull().unique(),
      driverName: varchar("driverName", { length: 255 }),
      zoneId: varchar("zoneId", { length: 128 }),
      latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
      longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
      isOnline: boolean("isOnline").default(false).notNull(),
      activePickupId: varchar("activePickupId", { length: 128 }),
      headingDegrees: decimal("headingDegrees", { precision: 6, scale: 2 }),
      speedKmh: decimal("speedKmh", { precision: 6, scale: 2 }),
      lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    userNotifications = mysqlTable("user_notifications", {
      id: int("id").autoincrement().primaryKey(),
      userId: varchar("userId", { length: 128 }).notNull(),
      type: mysqlEnum("type", [
        "pickup_update",
        "driver_accepted",
        "driver_arriving",
        "pickup_completed",
        "payment",
        "subscription",
        "system",
        "support"
      ]).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      body: text("body").notNull(),
      isRead: boolean("isRead").default(false).notNull(),
      data: text("data"),
      pickupId: varchar("pickupId", { length: 128 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
init_schema();
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
var _dbInitFailed = false;
var _lastRetryAt = 0;
var RETRY_INTERVAL_MS = 3e4;
async function getDb() {
  if (_db) return _db;
  if (!process.env.DATABASE_URL) {
    if (!_dbInitFailed) {
      console.error("[Database] DATABASE_URL is not set. Database features are disabled.");
      _dbInitFailed = true;
    }
    return null;
  }
  const now = Date.now();
  if (_lastRetryAt > 0 && now - _lastRetryAt < RETRY_INTERVAL_MS) {
    return null;
  }
  try {
    _lastRetryAt = now;
    _db = drizzle(process.env.DATABASE_URL);
    console.log("[Database] Connected successfully.");
    return _db;
  } catch (error) {
    console.error("[Database] Failed to connect:", error instanceof Error ? error.message : error);
    _db = null;
    return null;
  }
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAvailableBookings() {
  const db = await getDb();
  if (!db) return [];
  const { bookings: bookings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  return db.select().from(bookings2).where(eq(bookings2.status, "pending"));
}
async function getBookingsByDriver(driverId) {
  const db = await getDb();
  if (!db) return [];
  const { bookings: bookings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  return db.select().from(bookings2).where(and(eq(bookings2.driverId, driverId), eq(bookings2.status, "accepted")));
}
async function getBookingById(bookingId) {
  const db = await getDb();
  if (!db) return null;
  const { bookings: bookings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const result = await db.select().from(bookings2).where(eq(bookings2.id, bookingId));
  return result[0] || null;
}
async function acceptBooking(bookingId, driverId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { bookings: bookings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  await db.update(bookings2).set({ driverId, status: "accepted" }).where(eq(bookings2.id, bookingId));
}
async function rejectBooking(bookingId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { bookings: bookings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  await db.update(bookings2).set({ status: "rejected" }).where(eq(bookings2.id, bookingId));
}
async function updateBookingStatus(bookingId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { bookings: bookings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const updateData = { status };
  if (status === "completed") {
    updateData.completedAt = /* @__PURE__ */ new Date();
  }
  await db.update(bookings2).set(updateData).where(eq(bookings2.id, bookingId));
}
async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];
  const { bookings: bookings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  return db.select().from(bookings2);
}
async function getCompletedBookingsByDriver(driverId) {
  const db = await getDb();
  if (!db) return [];
  const { bookings: bookings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  return db.select().from(bookings2).where(and(eq(bookings2.driverId, driverId), eq(bookings2.status, "completed")));
}
async function getAllUsers(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).limit(limit);
}
async function getUserNotifications(userId, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  const { userNotifications: userNotifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  return db.select().from(userNotifications2).where(eq(userNotifications2.userId, userId)).orderBy(userNotifications2.createdAt).limit(limit);
}
async function createUserNotification(data) {
  const db = await getDb();
  if (!db) return null;
  const { userNotifications: userNotifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const result = await db.insert(userNotifications2).values({
    ...data,
    isRead: false
  });
  return result.insertId;
}
async function markUserNotificationRead(id) {
  const db = await getDb();
  if (!db) return;
  const { userNotifications: userNotifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  await db.update(userNotifications2).set({ isRead: true }).where(eq(userNotifications2.id, id));
}
async function markAllUserNotificationsRead(userId) {
  const db = await getDb();
  if (!db) return;
  const { userNotifications: userNotifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  await db.update(userNotifications2).set({ isRead: true }).where(eq(userNotifications2.userId, userId));
}

// server/_core/cookies.ts
var LOCAL_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
function isIpAddress(host) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getParentDomain(hostname) {
  if (LOCAL_HOSTS.has(hostname) || isIpAddress(hostname)) {
    return void 0;
  }
  const parts = hostname.split(".");
  if (parts.length < 3) {
    return void 0;
  }
  return "." + parts.slice(-2).join(".");
}
function getSessionCookieOptions(req) {
  const hostname = req.hostname;
  const domain = getParentDomain(hostname);
  return {
    domain,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(EXCHANGE_TOKEN_PATH, payload);
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(GET_USER_INFO_PATH, {
      accessToken: token.accessToken
    });
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(platforms.filter((p) => typeof p === "string"));
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length).trim();
    }
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = token || cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
async function syncUser(userInfo) {
  if (!userInfo.openId) {
    throw new Error("openId missing from user info");
  }
  const lastSignedIn = /* @__PURE__ */ new Date();
  await upsertUser({
    openId: userInfo.openId,
    name: userInfo.name || null,
    email: userInfo.email ?? null,
    loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
    lastSignedIn
  });
  const saved = await getUserByOpenId(userInfo.openId);
  return saved ?? {
    openId: userInfo.openId,
    name: userInfo.name,
    email: userInfo.email,
    loginMethod: userInfo.loginMethod ?? null,
    lastSignedIn
  };
}
function buildUserResponse(user) {
  return {
    id: user?.id ?? null,
    openId: user?.openId ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
    loginMethod: user?.loginMethod ?? null,
    lastSignedIn: (user?.lastSignedIn ?? /* @__PURE__ */ new Date()).toISOString()
  };
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      const frontendUrl = process.env.EXPO_WEB_PREVIEW_URL || process.env.EXPO_PACKAGER_PROXY_URL || "http://localhost:8081";
      res.redirect(302, frontendUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
  app.get("/api/oauth/mobile", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      const user = await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({
        app_session_id: sessionToken,
        user: buildUserResponse(user)
      });
    } catch (error) {
      console.error("[OAuth] Mobile exchange failed", error);
      res.status(500).json({ error: "OAuth mobile exchange failed" });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({ user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/me failed:", error);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });
  app.post("/api/auth/session", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({ error: "Bearer token required" });
        return;
      }
      const token = authHeader.slice("Bearer ".length).trim();
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/session failed:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });
}

// server/routers.ts
import { z as z8 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL("webdevtoken.v1.WebDevService/SendNotification", normalizedBase).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers-bookings.ts
import { z as z2 } from "zod";
var bookingsRouter = router({
  /**
   * Get all available bookings (pending status)
   * Accessible to drivers only
   */
  getAvailable: protectedProcedure.query(async () => {
    return getAvailableBookings();
  }),
  /**
   * Get bookings assigned to a specific driver
   */
  getByDriver: protectedProcedure.query(async ({ ctx }) => {
    return getBookingsByDriver(ctx.user.id);
  }),
  /**
   * Get a single booking by ID
   */
  getById: protectedProcedure.input(z2.object({ bookingId: z2.number() })).query(async ({ input }) => {
    return getBookingById(input.bookingId);
  }),
  /**
   * Accept a booking (driver accepts the job)
   */
  accept: protectedProcedure.input(z2.object({ bookingId: z2.number() })).mutation(async ({ ctx, input }) => {
    try {
      await acceptBooking(input.bookingId, ctx.user.id);
      return { success: true, message: "Booking accepted successfully" };
    } catch (error) {
      console.error("Error accepting booking:", error);
      throw new Error("Failed to accept booking");
    }
  }),
  /**
   * Reject a booking (driver rejects the job)
   */
  reject: protectedProcedure.input(z2.object({ bookingId: z2.number() })).mutation(async ({ input }) => {
    try {
      await rejectBooking(input.bookingId);
      return { success: true, message: "Booking rejected successfully" };
    } catch (error) {
      console.error("Error rejecting booking:", error);
      throw new Error("Failed to reject booking");
    }
  }),
  /**
   * Update booking status (in-progress, completed, cancelled)
   */
  updateStatus: protectedProcedure.input(
    z2.object({
      bookingId: z2.number(),
      status: z2.enum(["in-progress", "completed", "cancelled"])
    })
  ).mutation(async ({ input }) => {
    try {
      await updateBookingStatus(input.bookingId, input.status);
      return { success: true, message: `Booking status updated to ${input.status}` };
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw new Error("Failed to update booking status");
    }
  }),
  /**
   * Get completed bookings for a driver
   */
  getCompleted: protectedProcedure.query(async ({ ctx }) => {
    return getCompletedBookingsByDriver(ctx.user.id);
  }),
  /**
   * Get all bookings (admin only)
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    return getAllBookings();
  })
});

// server/routers-drivers.ts
import { z as z3 } from "zod";
init_schema();
import { eq as eq2, and as and2, desc, sql, gte } from "drizzle-orm";
var VehicleTypeEnum = z3.enum(["motorbike", "van", "pickup", "truck", "trailer"]);
var JobStatusEnum = z3.enum(["pending", "accepted", "arrived", "picked_up", "in_transit", "delivered", "completed", "cancelled", "rejected"]);
var WithdrawalMethodEnum = z3.enum(["mobile_money", "bank_transfer"]);
var driversRouter = router({
  /**
   * Register a new driver
   */
  register: publicProcedure.input(z3.object({
    fullName: z3.string().min(2),
    phone: z3.string().min(10),
    email: z3.string().email(),
    vehicleType: VehicleTypeEnum,
    plateNumber: z3.string().min(3),
    driversLicenseUrl: z3.string(),
    idDocumentUrl: z3.string(),
    vehiclePhotoUrl: z3.string()
  })).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const [profile] = await db.insert(driverProfiles).values({
      userId: ctx.user?.id || 0,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      vehicleType: input.vehicleType,
      plateNumber: input.plateNumber,
      isApproved: false,
      isOnline: false,
      isSuspended: false
    });
    const driverId = profile.insertId;
    await db.insert(driverDocuments).values([
      { driverId, documentType: "drivers_license", fileUrl: input.driversLicenseUrl },
      { driverId, documentType: "nrc_id", fileUrl: input.idDocumentUrl },
      { driverId, documentType: "vehicle_photo", fileUrl: input.vehiclePhotoUrl }
    ]);
    await db.insert(driverWallets).values({
      driverId,
      balance: "0.00",
      totalEarnings: "0.00",
      totalWithdrawn: "0.00",
      pendingWithdrawal: "0.00"
    });
    await db.insert(driverActivityLog).values({
      driverId,
      activityType: "document_uploaded",
      details: "Driver registration submitted"
    });
    return { success: true, driverId, message: "Registration submitted for review" };
  }),
  /**
   * Get driver profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) return null;
    const [wallet] = await db.select().from(driverWallets).where(eq2(driverWallets.driverId, profile.id)).limit(1);
    return { ...profile, wallet };
  }),
  /**
   * Toggle online/offline status
   */
  toggleOnline: protectedProcedure.input(z3.object({ isOnline: z3.boolean() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) throw new Error("Driver profile not found");
    if (!profile.isApproved) throw new Error("Your account is pending approval");
    if (profile.isSuspended) throw new Error("Your account has been suspended");
    await db.update(driverProfiles).set({ isOnline: input.isOnline }).where(eq2(driverProfiles.id, profile.id));
    await db.insert(driverActivityLog).values({
      driverId: profile.id,
      activityType: input.isOnline ? "online" : "offline"
    });
    return { success: true, isOnline: input.isOnline };
  }),
  /**
   * Get driver stats
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) return null;
    const [wallet] = await db.select().from(driverWallets).where(eq2(driverWallets.driverId, profile.id)).limit(1);
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todayEarnings = await db.select({ total: sql`COALESCE(SUM(amount), 0)` }).from(walletTransactions).where(and2(
      eq2(walletTransactions.driverId, profile.id),
      eq2(walletTransactions.type, "earning"),
      gte(walletTransactions.createdAt, today)
    ));
    const weekStart = /* @__PURE__ */ new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEarnings = await db.select({ total: sql`COALESCE(SUM(amount), 0)` }).from(walletTransactions).where(and2(
      eq2(walletTransactions.driverId, profile.id),
      eq2(walletTransactions.type, "earning"),
      gte(walletTransactions.createdAt, weekStart)
    ));
    const monthStart = /* @__PURE__ */ new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEarnings = await db.select({ total: sql`COALESCE(SUM(amount), 0)` }).from(walletTransactions).where(and2(
      eq2(walletTransactions.driverId, profile.id),
      eq2(walletTransactions.type, "earning"),
      gte(walletTransactions.createdAt, monthStart)
    ));
    return {
      walletBalance: wallet?.balance || "0.00",
      totalEarnings: wallet?.totalEarnings || "0.00",
      totalCompletedJobs: profile.totalCompletedJobs || 0,
      averageRating: profile.averageRating || "0.00",
      totalRatings: profile.totalRatings || 0,
      earningsToday: todayEarnings[0]?.total || "0.00",
      earningsWeek: weekEarnings[0]?.total || "0.00",
      earningsMonth: monthEarnings[0]?.total || "0.00"
    };
  }),
  /**
   * Get available jobs
   */
  getAvailableJobs: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile || !profile.isApproved || profile.isSuspended) return [];
    const jobs = await db.select().from(transportJobs).where(eq2(transportJobs.status, "pending")).orderBy(desc(transportJobs.createdAt)).limit(50);
    return jobs;
  }),
  /**
   * Accept a job
   */
  acceptJob: protectedProcedure.input(z3.object({ jobId: z3.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) throw new Error("Driver profile not found");
    if (!profile.isOnline) throw new Error("You must be online to accept jobs");
    const [job] = await db.select().from(transportJobs).where(and2(
      eq2(transportJobs.id, input.jobId),
      eq2(transportJobs.status, "pending")
    )).limit(1);
    if (!job) throw new Error("Job is no longer available");
    await db.update(transportJobs).set({
      driverId: profile.id,
      status: "accepted",
      acceptedAt: /* @__PURE__ */ new Date()
    }).where(eq2(transportJobs.id, input.jobId));
    await db.insert(driverActivityLog).values({
      driverId: profile.id,
      activityType: "job_accepted",
      jobId: input.jobId
    });
    return { success: true, message: "Job accepted successfully" };
  }),
  /**
   * Reject a job
   */
  rejectJob: protectedProcedure.input(z3.object({ jobId: z3.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) throw new Error("Driver profile not found");
    await db.insert(driverActivityLog).values({
      driverId: profile.id,
      activityType: "job_rejected",
      jobId: input.jobId
    });
    return { success: true, message: "Job rejected" };
  }),
  /**
   * Update job status
   */
  updateJobStatus: protectedProcedure.input(z3.object({
    jobId: z3.number(),
    status: JobStatusEnum
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) throw new Error("Driver profile not found");
    const updateData = { status: input.status };
    switch (input.status) {
      case "arrived":
        updateData.arrivedAt = /* @__PURE__ */ new Date();
        break;
      case "picked_up":
        updateData.pickedUpAt = /* @__PURE__ */ new Date();
        break;
      case "delivered":
        updateData.deliveredAt = /* @__PURE__ */ new Date();
        break;
      case "completed":
        updateData.completedAt = /* @__PURE__ */ new Date();
        break;
      case "cancelled":
        updateData.cancelledAt = /* @__PURE__ */ new Date();
        break;
    }
    await db.update(transportJobs).set(updateData).where(and2(
      eq2(transportJobs.id, input.jobId),
      eq2(transportJobs.driverId, profile.id)
    ));
    if (input.status === "completed") {
      const [job] = await db.select().from(transportJobs).where(eq2(transportJobs.id, input.jobId)).limit(1);
      if (job && job.driverEarnings) {
        const [wallet] = await db.select().from(driverWallets).where(eq2(driverWallets.driverId, profile.id)).limit(1);
        if (wallet) {
          const newBalance = parseFloat(wallet.balance) + parseFloat(job.driverEarnings);
          const newTotalEarnings = parseFloat(wallet.totalEarnings) + parseFloat(job.driverEarnings);
          await db.update(driverWallets).set({
            balance: newBalance.toFixed(2),
            totalEarnings: newTotalEarnings.toFixed(2)
          }).where(eq2(driverWallets.driverId, profile.id));
          await db.insert(walletTransactions).values({
            driverId: profile.id,
            jobId: input.jobId,
            type: "earning",
            amount: job.driverEarnings,
            balanceAfter: newBalance.toFixed(2),
            description: `Earnings from job #${input.jobId}`
          });
        }
        await db.update(driverProfiles).set({
          totalCompletedJobs: sql`${driverProfiles.totalCompletedJobs} + 1`
        }).where(eq2(driverProfiles.id, profile.id));
      }
      await db.insert(driverActivityLog).values({
        driverId: profile.id,
        activityType: "job_completed",
        jobId: input.jobId
      });
    }
    return { success: true, message: `Job status updated to ${input.status}` };
  }),
  /**
   * Get active job
   */
  getActiveJob: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) return null;
    const [job] = await db.select().from(transportJobs).where(and2(
      eq2(transportJobs.driverId, profile.id),
      sql`${transportJobs.status} IN ('accepted', 'arrived', 'picked_up', 'in_transit')`
    )).orderBy(desc(transportJobs.acceptedAt)).limit(1);
    return job || null;
  }),
  /**
   * Get completed jobs
   */
  getCompletedJobs: protectedProcedure.input(z3.object({
    limit: z3.number().default(20),
    offset: z3.number().default(0)
  })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return [];
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) return [];
    const jobs = await db.select().from(transportJobs).where(and2(
      eq2(transportJobs.driverId, profile.id),
      eq2(transportJobs.status, "completed")
    )).orderBy(desc(transportJobs.completedAt)).limit(input.limit).offset(input.offset);
    return jobs;
  }),
  /**
   * Get transactions
   */
  getTransactions: protectedProcedure.input(z3.object({
    limit: z3.number().default(20),
    offset: z3.number().default(0)
  })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return [];
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) return [];
    const transactions = await db.select().from(walletTransactions).where(eq2(walletTransactions.driverId, profile.id)).orderBy(desc(walletTransactions.createdAt)).limit(input.limit).offset(input.offset);
    return transactions;
  }),
  /**
   * Request withdrawal
   */
  requestWithdrawal: protectedProcedure.input(z3.object({
    amount: z3.number().positive(),
    method: WithdrawalMethodEnum,
    accountNumber: z3.string().min(5),
    accountName: z3.string().optional(),
    bankName: z3.string().optional(),
    mobileProvider: z3.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) throw new Error("Driver profile not found");
    const [wallet] = await db.select().from(driverWallets).where(eq2(driverWallets.driverId, profile.id)).limit(1);
    if (!wallet) throw new Error("Wallet not found");
    const balance = parseFloat(wallet.balance);
    if (input.amount > balance) throw new Error("Insufficient balance");
    await db.insert(driverWithdrawals).values({
      driverId: profile.id,
      amount: input.amount.toFixed(2),
      withdrawalMethod: input.method,
      accountNumber: input.accountNumber,
      accountName: input.accountName,
      bankName: input.bankName,
      mobileProvider: input.mobileProvider,
      status: "pending"
    });
    const newPending = parseFloat(wallet.pendingWithdrawal) + input.amount;
    const newBalance = balance - input.amount;
    await db.update(driverWallets).set({
      balance: newBalance.toFixed(2),
      pendingWithdrawal: newPending.toFixed(2)
    }).where(eq2(driverWallets.driverId, profile.id));
    await db.insert(walletTransactions).values({
      driverId: profile.id,
      type: "withdrawal",
      amount: (-input.amount).toFixed(2),
      balanceAfter: newBalance.toFixed(2),
      description: `Withdrawal request via ${input.method}`
    });
    await db.insert(driverActivityLog).values({
      driverId: profile.id,
      activityType: "withdrawal_requested",
      details: `Withdrawal of K${input.amount} via ${input.method}`
    });
    return { success: true, message: "Withdrawal request submitted" };
  }),
  /**
   * Get withdrawals
   */
  getWithdrawals: protectedProcedure.input(z3.object({
    limit: z3.number().default(20),
    offset: z3.number().default(0)
  })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return [];
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) return [];
    const withdrawals = await db.select().from(driverWithdrawals).where(eq2(driverWithdrawals.driverId, profile.id)).orderBy(desc(driverWithdrawals.createdAt)).limit(input.limit).offset(input.offset);
    return withdrawals;
  }),
  /**
   * Get ratings
   */
  getRatings: protectedProcedure.input(z3.object({
    limit: z3.number().default(20),
    offset: z3.number().default(0)
  })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return [];
    const [profile] = await db.select().from(driverProfiles).where(eq2(driverProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) return [];
    const ratings = await db.select().from(driverRatings).where(eq2(driverRatings.driverId, profile.id)).orderBy(desc(driverRatings.createdAt)).limit(input.limit).offset(input.offset);
    return ratings;
  }),
  /**
   * Admin: Get all driver profiles
   */
  adminGetAllDrivers: publicProcedure.input(z3.object({ limit: z3.number().int().min(1).max(500).optional().default(200) })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(driverProfiles).orderBy(desc(driverProfiles.createdAt)).limit(input.limit);
  }),
  /**
   * Admin: Get driver activity log (most recent first)
   */
  adminGetActivityLog: publicProcedure.input(z3.object({ limit: z3.number().int().min(1).max(500).optional().default(200) })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(driverActivityLog).orderBy(desc(driverActivityLog.createdAt)).limit(input.limit);
  })
});

// server/routers-collector.ts
import { z as z4 } from "zod";
init_schema();
import { eq as eq3 } from "drizzle-orm";
var collectorRouter = router({
  /**
   * Get collector's assigned zone details with boundaries
   * Returns zone information including name, boundaries (GeoJSON), and metadata
   * 
   * TODO: Replace mock data with actual database queries when zones table is implemented
   */
  getZoneDetails: publicProcedure.input(
    z4.object({
      collectorId: z4.string()
    })
  ).query(async ({ input }) => {
    try {
      const db = await getDb();
      if (!db) {
        return {
          success: false,
          assigned: false,
          message: "Database not available"
        };
      }
      const collector = await db.select({
        id: users.id,
        name: users.name,
        role: users.role
      }).from(users).where(eq3(users.id, parseInt(input.collectorId))).limit(1);
      if (!collector.length) {
        return {
          success: false,
          assigned: false,
          message: "Collector not found"
        };
      }
      const mockZones = {
        "1": {
          id: "zone_1",
          name: "Zone A - Central",
          boundaries: [
            { latitude: -15.4067, longitude: 28.2733 },
            { latitude: -15.4067, longitude: 28.2933 },
            { latitude: -15.4267, longitude: 28.2933 },
            { latitude: -15.4267, longitude: 28.2733 }
          ]
        },
        "2": {
          id: "zone_2",
          name: "Zone B - East",
          boundaries: [
            { latitude: -15.4167, longitude: 28.2833 },
            { latitude: -15.4167, longitude: 28.3033 },
            { latitude: -15.4367, longitude: 28.3033 },
            { latitude: -15.4367, longitude: 28.2833 }
          ]
        }
      };
      const zoneKey = (parseInt(input.collectorId) % 2 + 1).toString();
      const zone = mockZones[zoneKey];
      return {
        success: true,
        assigned: true,
        zone: {
          id: zone.id,
          name: zone.name,
          boundaries: zone.boundaries,
          center: {
            latitude: zone.boundaries[0].latitude + 0.01,
            longitude: zone.boundaries[0].longitude + 0.01
          }
        }
      };
    } catch (error) {
      console.error("[Collector API] Error fetching zone details:", error);
      return {
        success: false,
        assigned: false,
        message: "Failed to fetch zone details"
      };
    }
  }),
  /**
   * Get households assigned to collector's zone
   * Returns list of households with coordinates for map display
   * 
   * TODO: Replace mock data with actual subscriptions/households table query
   */
  getZoneHouseholds: publicProcedure.input(
    z4.object({
      collectorId: z4.string()
    })
  ).query(async ({ input }) => {
    try {
      const db = await getDb();
      if (!db) {
        return {
          success: false,
          households: [],
          message: "Database not available"
        };
      }
      const collector = await db.select({ id: users.id }).from(users).where(eq3(users.id, parseInt(input.collectorId))).limit(1);
      if (!collector.length) {
        return {
          success: false,
          households: [],
          message: "Collector not found"
        };
      }
      const mockHouseholds = [
        {
          id: "h1",
          name: "House 101",
          address: "Plot 101, Main Street",
          latitude: -15.4117,
          longitude: 28.2783,
          subscriptionStatus: "active",
          customerName: "John Doe",
          customerPhone: "+260 97 1234567"
        },
        {
          id: "h2",
          name: "House 102",
          address: "Plot 102, Main Street",
          latitude: -15.4147,
          longitude: 28.2813,
          subscriptionStatus: "active",
          customerName: "Jane Smith",
          customerPhone: "+260 97 2345678"
        },
        {
          id: "h3",
          name: "House 103",
          address: "Plot 103, Second Avenue",
          latitude: -15.4187,
          longitude: 28.2853,
          subscriptionStatus: "active",
          customerName: "Mike Johnson",
          customerPhone: "+260 97 3456789"
        },
        {
          id: "h4",
          name: "House 104",
          address: "Plot 104, Third Road",
          latitude: -15.4217,
          longitude: 28.2883,
          subscriptionStatus: "active",
          customerName: "Sarah Williams",
          customerPhone: "+260 97 4567890"
        }
      ];
      return {
        success: true,
        households: mockHouseholds,
        total: mockHouseholds.length
      };
    } catch (error) {
      console.error("[Collector API] Error fetching zone households:", error);
      return {
        success: false,
        households: [],
        message: "Failed to fetch households"
      };
    }
  }),
  /**
   * Get collector's document status with expiry alerts
   * Checks all documents and returns expiry warnings
   * 
   * TODO: Add document_expiry fields to collector profile table
   * TODO: Integrate with push notification service for expiry alerts
   */
  getDocumentStatus: publicProcedure.input(
    z4.object({
      collectorId: z4.string()
    })
  ).query(async ({ input }) => {
    try {
      const db = await getDb();
      if (!db) {
        return {
          success: false,
          message: "Database not available"
        };
      }
      const collector = await db.select({
        id: users.id,
        name: users.name
      }).from(users).where(eq3(users.id, parseInt(input.collectorId))).limit(1);
      if (!collector.length) {
        return {
          success: false,
          message: "Collector not found"
        };
      }
      const today = /* @__PURE__ */ new Date();
      const thirtyDaysFromNow = /* @__PURE__ */ new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      const licenseExpiry = /* @__PURE__ */ new Date();
      licenseExpiry.setDate(today.getDate() + 25);
      const registrationExpiry = /* @__PURE__ */ new Date();
      registrationExpiry.setDate(today.getDate() + 90);
      const documents = [
        {
          type: "license",
          name: "Driver's License",
          uploaded: true,
          expiry: licenseExpiry,
          status: "expiring",
          daysUntilExpiry: 25
        },
        {
          type: "registration",
          name: "Vehicle Registration",
          uploaded: true,
          expiry: registrationExpiry,
          status: "valid",
          daysUntilExpiry: 90
        },
        {
          type: "nrc",
          name: "National Registration Card",
          uploaded: true,
          expiry: null,
          // NRC typically doesn't expire
          status: "valid",
          daysUntilExpiry: 0
        }
      ];
      const alerts = documents.filter(
        (doc) => doc.status === "expiring" || doc.status === "expired" || doc.status === "missing"
      );
      return {
        success: true,
        documents,
        alerts,
        hasAlerts: alerts.length > 0
      };
    } catch (error) {
      console.error("[Collector API] Error fetching document status:", error);
      return {
        success: false,
        message: "Failed to fetch document status"
      };
    }
  })
});

// server/routers-zone.ts
import { z as z5 } from "zod";

// server/db-zones.ts
import { eq as eq4, and as and3, sql as sql2 } from "drizzle-orm";
init_schema();
async function getAllZones(statusFilter) {
  const db = await getDb();
  if (!db) return [];
  try {
    if (statusFilter === "all" || !statusFilter) {
      return await db.select().from(zones);
    }
    return await db.select().from(zones).where(eq4(zones.status, statusFilter));
  } catch (error) {
    console.error("[Database] Failed to get zones:", error);
    return [];
  }
}
async function getZoneById(zoneId) {
  const db = await getDb();
  if (!db) return void 0;
  try {
    const result = await db.select().from(zones).where(eq4(zones.id, zoneId)).limit(1);
    return result.length > 0 ? result[0] : void 0;
  } catch (error) {
    console.error("[Database] Failed to get zone by ID:", error);
    return void 0;
  }
}
async function createZone(zoneData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(zones).values(zoneData);
    return result.insertId;
  } catch (error) {
    console.error("[Database] Failed to create zone:", error);
    throw error;
  }
}
async function updateZone(zoneId, zoneData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.update(zones).set(zoneData).where(eq4(zones.id, zoneId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update zone:", error);
    throw error;
  }
}
async function deleteZone(zoneId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.delete(zoneCollectors).where(eq4(zoneCollectors.zoneId, zoneId));
    await db.delete(zones).where(eq4(zones.id, zoneId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete zone:", error);
    throw error;
  }
}
async function getZoneStats() {
  const db = await getDb();
  if (!db) return {
    totalZones: 0,
    assignedCollectors: 0,
    totalHouseholds: 0,
    unassignedHouseholds: 0
  };
  try {
    const zoneCount = await db.select({ count: sql2`count(*)` }).from(zones);
    const totalZones = zoneCount[0]?.count || 0;
    const collectorCount = await db.select({ count: sql2`count(DISTINCT ${zoneCollectors.collectorId})` }).from(zoneCollectors);
    const assignedCollectors = collectorCount[0]?.count || 0;
    const householdSum = await db.select({ total: sql2`sum(${zones.householdCount})` }).from(zones);
    const totalHouseholds = householdSum[0]?.total || 0;
    return {
      totalZones,
      assignedCollectors,
      totalHouseholds,
      unassignedHouseholds: 0
      // TODO: Calculate from households table when implemented
    };
  } catch (error) {
    console.error("[Database] Failed to get zone stats:", error);
    return {
      totalZones: 0,
      assignedCollectors: 0,
      totalHouseholds: 0,
      unassignedHouseholds: 0
    };
  }
}
async function assignCollectorToZone(collectorId, zoneId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const existing = await db.select().from(zoneCollectors).where(and3(eq4(zoneCollectors.collectorId, collectorId), eq4(zoneCollectors.zoneId, zoneId))).limit(1);
    if (existing.length > 0) {
      return false;
    }
    await db.insert(zoneCollectors).values({ collectorId, zoneId });
    await db.execute(sql2`
      UPDATE ${zones}
      SET collectorCount = (
        SELECT COUNT(*) FROM ${zoneCollectors}
        WHERE ${zoneCollectors.zoneId} = ${zoneId}
      )
      WHERE id = ${zoneId}
    `);
    return true;
  } catch (error) {
    console.error("[Database] Failed to assign collector:", error);
    throw error;
  }
}
async function unassignCollectorFromZone(collectorId, zoneId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    if (zoneId) {
      await db.delete(zoneCollectors).where(
        and3(eq4(zoneCollectors.collectorId, collectorId), eq4(zoneCollectors.zoneId, zoneId))
      );
      await db.execute(sql2`
        UPDATE ${zones}
        SET collectorCount = (
          SELECT COUNT(*) FROM ${zoneCollectors}
          WHERE ${zoneCollectors.zoneId} = ${zoneId}
        )
        WHERE id = ${zoneId}
      `);
    } else {
      const assignments = await db.select().from(zoneCollectors).where(eq4(zoneCollectors.collectorId, collectorId));
      const zoneIds = assignments.map((a) => a.zoneId);
      await db.delete(zoneCollectors).where(eq4(zoneCollectors.collectorId, collectorId));
      if (zoneIds.length > 0) {
        for (const id of zoneIds) {
          await db.execute(sql2`
            UPDATE ${zones}
            SET collectorCount = (
              SELECT COUNT(*) FROM ${zoneCollectors}
              WHERE ${zoneCollectors.zoneId} = ${id}
            )
            WHERE id = ${id}
          `);
        }
      }
    }
    return true;
  } catch (error) {
    console.error("[Database] Failed to unassign collector:", error);
    throw error;
  }
}

// server/routers-zone.ts
var ZoneStatusEnum = z5.enum(["active", "inactive"]);
var ZoneCreateSchema = z5.object({
  name: z5.string().min(1, "Zone name is required"),
  city: z5.string().min(1, "City is required"),
  description: z5.string().optional(),
  boundaries: z5.string().optional()
  // JSON string of coordinates
});
var ZoneUpdateSchema = z5.object({
  id: z5.string(),
  name: z5.string().min(1).optional(),
  city: z5.string().min(1).optional(),
  description: z5.string().optional(),
  boundaries: z5.string().optional(),
  status: ZoneStatusEnum.optional()
});
var CollectorAssignmentSchema = z5.object({
  collectorId: z5.string(),
  zoneId: z5.string()
});
var HouseholdReassignmentSchema = z5.object({
  householdIds: z5.array(z5.string()),
  targetZoneId: z5.string()
});
var zoneRouter = router({
  /**
   * Get all zones with optional status filter
   */
  list: publicProcedure.input(
    z5.object({
      status: z5.enum(["all", "active", "inactive"]).default("all")
    })
  ).query(async ({ input }) => {
    console.log("[Zone] Fetching zones with status:", input.status);
    const zones2 = await getAllZones(input.status);
    return {
      success: true,
      data: zones2.map((z9) => ({
        ...z9,
        id: z9.id.toString(),
        createdAt: z9.createdAt.toISOString().split("T")[0]
      })),
      count: zones2.length
    };
  }),
  /**
   * Get zone details by ID
   */
  getById: publicProcedure.input(z5.object({ id: z5.string() })).query(async ({ input }) => {
    console.log("[Zone] Fetching zone details:", input.id);
    const zone = await getZoneById(parseInt(input.id));
    if (!zone) {
      return {
        success: false,
        error: "Zone not found"
      };
    }
    return {
      success: true,
      data: {
        ...zone,
        id: zone.id.toString(),
        createdAt: zone.createdAt.toISOString().split("T")[0]
      }
    };
  }),
  /**
   * Create a new zone
   */
  create: publicProcedure.input(ZoneCreateSchema).mutation(async ({ input }) => {
    console.log("[Zone] Creating zone:", input.name);
    const zoneId = await createZone({
      name: input.name,
      city: input.city,
      description: input.description,
      boundaries: input.boundaries,
      status: "active",
      householdCount: 0,
      collectorCount: 0
    });
    const newZone = await getZoneById(zoneId);
    return {
      success: true,
      data: newZone ? {
        ...newZone,
        id: newZone.id.toString(),
        createdAt: newZone.createdAt.toISOString()
      } : null,
      message: "Zone created successfully"
    };
  }),
  /**
   * Update an existing zone
   */
  update: publicProcedure.input(ZoneUpdateSchema).mutation(async ({ input }) => {
    console.log("[Zone] Updating zone:", input.id);
    const { id, ...updateData } = input;
    await updateZone(parseInt(id), updateData);
    return {
      success: true,
      message: "Zone updated successfully"
    };
  }),
  /**
   * Delete a zone
   */
  delete: publicProcedure.input(z5.object({ id: z5.string() })).mutation(async ({ input }) => {
    console.log("[Zone] Deleting zone:", input.id);
    await deleteZone(parseInt(input.id));
    return {
      success: true,
      message: "Zone deleted successfully"
    };
  }),
  /**
   * Get available collectors for assignment
   */
  getAvailableCollectors: publicProcedure.query(async () => {
    console.log("[Zone] Fetching available collectors");
    const collectors = [
      {
        id: "1",
        name: "John Mwale",
        phone: "+260 97 123 4567",
        vehicleType: "Truck",
        currentZone: "Lusaka Central Zone A",
        status: "assigned"
      },
      {
        id: "2",
        name: "Mary Banda",
        phone: "+260 96 234 5678",
        vehicleType: "Light Truck",
        currentZone: null,
        status: "available"
      },
      {
        id: "3",
        name: "Peter Phiri",
        phone: "+260 95 345 6789",
        vehicleType: "Tractor",
        currentZone: "Kabulonga Residential",
        status: "assigned"
      },
      {
        id: "4",
        name: "Grace Tembo",
        phone: "+260 97 456 7890",
        vehicleType: "Foot Collector",
        currentZone: null,
        status: "available"
      }
    ];
    return {
      success: true,
      data: collectors
    };
  }),
  /**
   * Assign collector to zone
   */
  assignCollector: publicProcedure.input(CollectorAssignmentSchema).mutation(async ({ input }) => {
    console.log("[Zone] Assigning collector:", {
      collectorId: input.collectorId,
      zoneId: input.zoneId
    });
    await assignCollectorToZone(parseInt(input.collectorId), parseInt(input.zoneId));
    return {
      success: true,
      message: "Collector assigned successfully"
    };
  }),
  /**
   * Unassign collector from zone
   */
  unassignCollector: publicProcedure.input(z5.object({ collectorId: z5.string() })).mutation(async ({ input }) => {
    console.log("[Zone] Unassigning collector:", input.collectorId);
    await unassignCollectorFromZone(parseInt(input.collectorId));
    return {
      success: true,
      message: "Collector unassigned successfully"
    };
  }),
  /**
   * Get households in a zone
   */
  getHouseholds: publicProcedure.input(z5.object({ zoneId: z5.string().optional() })).query(async ({ input }) => {
    console.log("[Zone] Fetching households for zone:", input.zoneId);
    const households = [
      {
        id: "1",
        address: "Plot 123, Cairo Road",
        customerName: "James Banda",
        phone: "+260 97 111 2222",
        subscriptionType: "Commercial",
        currentZone: "Lusaka Central Zone A",
        status: "active"
      },
      {
        id: "2",
        address: "House 45, Independence Avenue",
        customerName: "Sarah Mwale",
        phone: "+260 96 222 3333",
        subscriptionType: "Residential",
        currentZone: "Lusaka Central Zone A",
        status: "active"
      },
      {
        id: "3",
        address: "Plot 78, Church Road",
        customerName: "David Phiri",
        phone: "+260 95 333 4444",
        subscriptionType: "Commercial",
        currentZone: "Lusaka Central Zone A",
        status: "active"
      },
      {
        id: "4",
        address: "House 12, Nationalist Road",
        customerName: "Grace Tembo",
        phone: "+260 97 444 5555",
        subscriptionType: "Residential",
        currentZone: "Lusaka Central Zone B",
        status: "active"
      }
    ];
    const filteredHouseholds = input.zoneId ? households.filter((h) => h.currentZone === input.zoneId) : households;
    return {
      success: true,
      data: filteredHouseholds
    };
  }),
  /**
   * Reassign households to a different zone
   */
  reassignHouseholds: publicProcedure.input(HouseholdReassignmentSchema).mutation(async ({ input }) => {
    console.log("[Zone] Reassigning households:", {
      count: input.householdIds.length,
      targetZoneId: input.targetZoneId
    });
    return {
      success: true,
      message: `${input.householdIds.length} household(s) reassigned successfully`
    };
  }),
  /**
   * Get zone statistics
   */
  getStats: publicProcedure.query(async () => {
    console.log("[Zone] Fetching zone statistics");
    const stats = await getZoneStats();
    return {
      success: true,
      data: stats
    };
  })
});

// server/routers-wallet.ts
import { z as z6 } from "zod";

// server/db-customer-wallet.ts
import { eq as eq5, desc as desc2 } from "drizzle-orm";
init_schema();
async function getCustomerWallet(userId) {
  const db = await getDb();
  if (!db) return void 0;
  try {
    const result = await db.select().from(customerWallets).where(eq5(customerWallets.userId, userId)).limit(1);
    if (result.length > 0) {
      return result[0];
    }
    await db.insert(customerWallets).values({
      userId,
      totalBalance: "0.00",
      rechargedBalance: "0.00",
      referralBalance: "0.00"
    });
    const newWallet = await db.select().from(customerWallets).where(eq5(customerWallets.userId, userId)).limit(1);
    return newWallet.length > 0 ? newWallet[0] : void 0;
  } catch (error) {
    console.error("[Database] Failed to get customer wallet:", error);
    return void 0;
  }
}
async function updateWalletBalance(userId, totalBalance, rechargedBalance, referralBalance) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.update(customerWallets).set({
      totalBalance,
      rechargedBalance,
      referralBalance
    }).where(eq5(customerWallets.userId, userId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update wallet balance:", error);
    throw error;
  }
}
async function createWalletTransaction(transactionData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(customerWalletTransactions).values(transactionData);
    return result.insertId;
  } catch (error) {
    console.error("[Database] Failed to create wallet transaction:", error);
    throw error;
  }
}
async function getWalletTransactions(userId, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  try {
    const transactions = await db.select().from(customerWalletTransactions).where(eq5(customerWalletTransactions.userId, userId)).orderBy(desc2(customerWalletTransactions.createdAt)).limit(limit);
    return transactions;
  } catch (error) {
    console.error("[Database] Failed to get wallet transactions:", error);
    return [];
  }
}
async function processRecharge(userId, amount, referenceId, description) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const wallet = await getCustomerWallet(userId);
    if (!wallet) throw new Error("Wallet not found");
    const currentTotal = parseFloat(wallet.totalBalance);
    const currentRecharged = parseFloat(wallet.rechargedBalance);
    const newTotal = currentTotal + amount;
    const newRecharged = currentRecharged + amount;
    await createWalletTransaction({
      userId,
      type: "recharge",
      amount: amount.toFixed(2),
      status: "completed",
      description,
      referenceId
    });
    await updateWalletBalance(
      userId,
      newTotal.toFixed(2),
      newRecharged.toFixed(2),
      wallet.referralBalance
    );
    return true;
  } catch (error) {
    console.error("[Database] Failed to process recharge:", error);
    throw error;
  }
}
async function processWithdrawal(userId, amount, bankDetails, description) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const wallet = await getCustomerWallet(userId);
    if (!wallet) throw new Error("Wallet not found");
    const currentTotal = parseFloat(wallet.totalBalance);
    if (currentTotal < amount) {
      throw new Error("Insufficient balance");
    }
    await createWalletTransaction({
      userId,
      type: "withdrawal",
      amount: (-amount).toFixed(2),
      status: "pending",
      description,
      bankDetails
    });
    return true;
  } catch (error) {
    console.error("[Database] Failed to process withdrawal:", error);
    throw error;
  }
}
async function addReferralBonus(userId, amount, referrerName) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const wallet = await getCustomerWallet(userId);
    if (!wallet) throw new Error("Wallet not found");
    const currentTotal = parseFloat(wallet.totalBalance);
    const currentReferral = parseFloat(wallet.referralBalance);
    const newTotal = currentTotal + amount;
    const newReferral = currentReferral + amount;
    await createWalletTransaction({
      userId,
      type: "referral",
      amount: amount.toFixed(2),
      status: "completed",
      description: `Referral bonus from ${referrerName}`
    });
    await updateWalletBalance(
      userId,
      newTotal.toFixed(2),
      wallet.rechargedBalance,
      newReferral.toFixed(2)
    );
    return true;
  } catch (error) {
    console.error("[Database] Failed to add referral bonus:", error);
    throw error;
  }
}
async function deductPayment(userId, amount, description, referenceId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const wallet = await getCustomerWallet(userId);
    if (!wallet) throw new Error("Wallet not found");
    const currentTotal = parseFloat(wallet.totalBalance);
    if (currentTotal < amount) {
      throw new Error("Insufficient balance");
    }
    const newTotal = currentTotal - amount;
    let currentRecharged = parseFloat(wallet.rechargedBalance);
    let currentReferral = parseFloat(wallet.referralBalance);
    let newRecharged = currentRecharged;
    let newReferral = currentReferral;
    if (currentRecharged >= amount) {
      newRecharged = currentRecharged - amount;
    } else {
      newRecharged = 0;
      newReferral = currentReferral - (amount - currentRecharged);
    }
    await createWalletTransaction({
      userId,
      type: "payment",
      amount: (-amount).toFixed(2),
      status: "completed",
      description,
      referenceId
    });
    await updateWalletBalance(
      userId,
      newTotal.toFixed(2),
      newRecharged.toFixed(2),
      newReferral.toFixed(2)
    );
    return true;
  } catch (error) {
    console.error("[Database] Failed to deduct payment:", error);
    throw error;
  }
}

// server/db-linked-accounts.ts
import { eq as eq6, and as and5 } from "drizzle-orm";
init_schema();
import * as crypto from "crypto";
function hashPin(pin) {
  return crypto.createHash("sha256").update(pin).digest("hex");
}
function verifyPin(pin, hashedPin) {
  return hashPin(pin) === hashedPin;
}
async function getLinkedAccount(userId) {
  const db = await getDb();
  if (!db) return void 0;
  try {
    const result = await db.select().from(customerLinkedAccounts).where(
      and5(
        eq6(customerLinkedAccounts.userId, userId),
        eq6(customerLinkedAccounts.status, "active")
      )
    ).limit(1);
    return result.length > 0 ? result[0] : void 0;
  } catch (error) {
    console.error("[Database] Failed to get linked account:", error);
    return void 0;
  }
}
async function createLinkedAccount(userId, provider, phoneNumber, withdrawalPin) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const existing = await getLinkedAccount(userId);
    if (existing) {
      throw new Error("User already has a linked account. Please unlink it first.");
    }
    const hashedPin = hashPin(withdrawalPin);
    const result = await db.insert(customerLinkedAccounts).values({
      userId,
      provider,
      phoneNumber,
      withdrawalPin: hashedPin,
      status: "active"
    });
    return result.insertId;
  } catch (error) {
    console.error("[Database] Failed to create linked account:", error);
    throw error;
  }
}
async function unlinkAccount(userId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.update(customerLinkedAccounts).set({ status: "inactive" }).where(
      and5(
        eq6(customerLinkedAccounts.userId, userId),
        eq6(customerLinkedAccounts.status, "active")
      )
    );
    return true;
  } catch (error) {
    console.error("[Database] Failed to unlink account:", error);
    throw error;
  }
}
async function verifyWithdrawalPin(userId, pin) {
  const db = await getDb();
  if (!db) return false;
  try {
    const linkedAccount = await getLinkedAccount(userId);
    if (!linkedAccount) {
      return false;
    }
    return verifyPin(pin, linkedAccount.withdrawalPin);
  } catch (error) {
    console.error("[Database] Failed to verify withdrawal PIN:", error);
    return false;
  }
}

// server/routers-wallet.ts
var RechargeSchema = z6.object({
  amount: z6.number().positive("Amount must be positive"),
  paymentMethod: z6.string().optional()
});
var WithdrawalSchema = z6.object({
  amount: z6.number().positive("Amount must be positive"),
  withdrawalPin: z6.string().min(4, "PIN must be at least 4 digits")
});
var LinkAccountSchema = z6.object({
  provider: z6.enum(["mtn_momo", "airtel_money", "zamtel_money"]),
  phoneNumber: z6.string().min(9, "Phone number must be at least 9 digits"),
  withdrawalPin: z6.string().min(4, "PIN must be at least 4 digits")
});
var ReferralCreditSchema = z6.object({
  userId: z6.number(),
  amount: z6.number().positive(),
  referrerName: z6.string()
});
var PaymentDeductionSchema = z6.object({
  userId: z6.number(),
  amount: z6.number().positive(),
  description: z6.string(),
  referenceId: z6.string().optional()
});
var walletRouter = router({
  /**
   * Get wallet balance for current user
   */
  getBalance: publicProcedure.query(async ({ ctx }) => {
    console.log("[Wallet] Fetching wallet balance");
    const userId = 1;
    const wallet = await getCustomerWallet(userId);
    if (!wallet) {
      return {
        success: false,
        error: "Wallet not found"
      };
    }
    return {
      success: true,
      data: {
        totalBalance: parseFloat(wallet.totalBalance),
        rechargedBalance: parseFloat(wallet.rechargedBalance),
        referralBalance: parseFloat(wallet.referralBalance)
      }
    };
  }),
  /**
   * Get wallet transaction history
   */
  getTransactions: publicProcedure.input(
    z6.object({
      limit: z6.number().optional().default(50)
    })
  ).query(async ({ ctx, input }) => {
    console.log("[Wallet] Fetching transaction history");
    const userId = 1;
    const transactions = await getWalletTransactions(userId, input.limit);
    return {
      success: true,
      data: transactions.map((t2) => ({
        id: t2.id.toString(),
        type: t2.type,
        amount: parseFloat(t2.amount),
        status: t2.status,
        description: t2.description || "",
        date: t2.createdAt.toISOString().split("T")[0],
        referenceId: t2.referenceId
      }))
    };
  }),
  /**
   * Initiate wallet recharge
   */
  recharge: publicProcedure.input(RechargeSchema).mutation(async ({ ctx, input }) => {
    console.log("[Wallet] Processing recharge:", input.amount);
    const userId = 1;
    const referenceId = `RECHARGE_${Date.now()}`;
    try {
      await processRecharge(
        userId,
        input.amount,
        referenceId,
        `Wallet recharge via ${input.paymentMethod || "Mobile Money"}`
      );
      return {
        success: true,
        message: "Recharge successful",
        data: {
          referenceId,
          amount: input.amount
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Recharge failed"
      };
    }
  }),
  /**
   * Request withdrawal
   */
  withdraw: publicProcedure.input(WithdrawalSchema).mutation(async ({ ctx, input }) => {
    console.log("[Wallet] Processing withdrawal:", input.amount);
    const userId = 1;
    try {
      const linkedAccount = await getLinkedAccount(userId);
      if (!linkedAccount) {
        return {
          success: false,
          error: "No linked account found. Please link your mobile money account first."
        };
      }
      const isPinValid = await verifyWithdrawalPin(userId, input.withdrawalPin);
      if (!isPinValid) {
        return {
          success: false,
          error: "Invalid withdrawal PIN. Please try again."
        };
      }
      await processWithdrawal(
        userId,
        input.amount,
        `${linkedAccount.provider}: ${linkedAccount.phoneNumber}`,
        `Withdrawal to ${linkedAccount.phoneNumber}`
      );
      return {
        success: true,
        message: "Withdrawal request submitted successfully. It will be processed within 24-48 hours."
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Withdrawal failed"
      };
    }
  }),
  /**
   * Credit referral bonus (admin only)
   */
  creditReferralBonus: publicProcedure.input(ReferralCreditSchema).mutation(async ({ ctx, input }) => {
    console.log("[Wallet] Crediting referral bonus:", input);
    try {
      await addReferralBonus(input.userId, input.amount, input.referrerName);
      return {
        success: true,
        message: "Referral bonus credited successfully"
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to credit referral bonus"
      };
    }
  }),
  /**
   * Deduct payment from wallet (for services)
   */
  deductPayment: publicProcedure.input(PaymentDeductionSchema).mutation(async ({ ctx, input }) => {
    console.log("[Wallet] Deducting payment:", input);
    try {
      await deductPayment(
        input.userId,
        input.amount,
        input.description,
        input.referenceId
      );
      return {
        success: true,
        message: "Payment deducted successfully"
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Payment deduction failed"
      };
    }
  }),
  /**
   * Get linked account for current user
   */
  getLinkedAccount: publicProcedure.query(async ({ ctx }) => {
    console.log("[Wallet] Fetching linked account");
    const userId = 1;
    const linkedAccount = await getLinkedAccount(userId);
    if (!linkedAccount) {
      return {
        success: true,
        data: null
      };
    }
    return {
      success: true,
      data: {
        provider: linkedAccount.provider,
        phoneNumber: linkedAccount.phoneNumber,
        status: linkedAccount.status
      }
    };
  }),
  /**
   * Link mobile money account
   */
  linkAccount: publicProcedure.input(LinkAccountSchema).mutation(async ({ ctx, input }) => {
    console.log("[Wallet] Linking account:", input.provider, input.phoneNumber);
    const userId = 1;
    try {
      await createLinkedAccount(
        userId,
        input.provider,
        input.phoneNumber,
        input.withdrawalPin
      );
      return {
        success: true,
        message: "Account linked successfully"
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to link account"
      };
    }
  }),
  /**
   * Unlink mobile money account
   */
  unlinkAccount: publicProcedure.mutation(async ({ ctx }) => {
    console.log("[Wallet] Unlinking account");
    const userId = 1;
    try {
      await unlinkAccount(userId);
      return {
        success: true,
        message: "Account unlinked successfully"
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to unlink account"
      };
    }
  })
});

// server/routers-payment.ts
import { z as z7 } from "zod";

// server/payment-service.ts
import { eq as eq8, and as and7, sql as sql3 } from "drizzle-orm";

// server/mtn-momo.ts
import axios2 from "axios";
function isSandbox() {
  const env = (process.env.APP_ENV ?? process.env.NODE_ENV ?? "production").toLowerCase();
  return env === "sandbox" || env === "development" || env === "test";
}
function sandboxLog(event, data) {
  if (!isSandbox()) return;
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  const payload = data ? ` ${JSON.stringify(data, null, 0)}` : "";
  console.log(`[MTN-SANDBOX][${ts}] ${event}${payload}`);
}
var SANDBOX_TEST_MSISDNS = {
  SUCCESS: "46733123450",
  FAILED: "56733123450",
  PENDING: "36733123450"
};
var _tokenCache = null;
var _disbursementTokenCache = null;
function getMtnConfig() {
  const baseUrl = process.env.MTN_BASE_URL?.trim();
  const collectionKey = process.env.MTN_COLLECTION_SUBSCRIPTION_KEY?.trim() || process.env.MTN_COLLECTION_KEY?.trim();
  const apiUser = process.env.MTN_API_USER?.trim();
  const apiKey = process.env.MTN_API_KEY?.trim();
  if (!baseUrl || !collectionKey || !apiUser || !apiKey) {
    throw new Error(
      "MTN MoMo is not configured. Set MTN_BASE_URL, MTN_COLLECTION_SUBSCRIPTION_KEY (or MTN_COLLECTION_KEY), MTN_API_USER, and MTN_API_KEY."
    );
  }
  const targetEnvironment = baseUrl.includes("sandbox") ? "sandbox" : "mtnzambia";
  return { baseUrl, collectionKey, apiUser, apiKey, targetEnvironment };
}
function isMtnConfigured() {
  return !!(process.env.MTN_BASE_URL?.trim() && (process.env.MTN_COLLECTION_SUBSCRIPTION_KEY?.trim() || process.env.MTN_COLLECTION_KEY?.trim()) && process.env.MTN_API_USER?.trim() && process.env.MTN_API_KEY?.trim());
}
function isMtnDisbursementConfigured() {
  return !!(process.env.MTN_BASE_URL?.trim() && (process.env.MTN_DISBURSEMENT_SUBSCRIPTION_KEY?.trim() || process.env.MTN_DISBURSEMENT_KEY?.trim()) && process.env.MTN_API_USER?.trim() && process.env.MTN_API_KEY?.trim());
}
function getDisbursementConfig() {
  const baseUrl = process.env.MTN_BASE_URL?.trim();
  const disbursementKey = process.env.MTN_DISBURSEMENT_SUBSCRIPTION_KEY?.trim() || process.env.MTN_DISBURSEMENT_KEY?.trim();
  const apiUser = process.env.MTN_API_USER?.trim();
  const apiKey = process.env.MTN_API_KEY?.trim();
  if (!baseUrl || !disbursementKey || !apiUser || !apiKey) {
    throw new Error(
      "MTN Disbursement is not configured. Set MTN_BASE_URL, MTN_DISBURSEMENT_SUBSCRIPTION_KEY (or MTN_DISBURSEMENT_KEY), MTN_API_USER, and MTN_API_KEY."
    );
  }
  const targetEnvironment = baseUrl.includes("sandbox") ? "sandbox" : "mtnzambia";
  return { baseUrl, disbursementKey, apiUser, apiKey, targetEnvironment };
}
async function getAccessToken() {
  const now = Date.now();
  if (_tokenCache && _tokenCache.expiresAt > now + 6e4) {
    return _tokenCache.token;
  }
  const { baseUrl, collectionKey, apiUser, apiKey } = getMtnConfig();
  const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString("base64");
  try {
    const response = await axios2.post(
      `${baseUrl}/collection/token/`,
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Ocp-Apim-Subscription-Key": collectionKey,
          "Content-Type": "application/json"
        },
        timeout: 1e4
      }
    );
    const { access_token, expires_in } = response.data;
    _tokenCache = {
      token: access_token,
      expiresAt: now + expires_in * 1e3
    };
    return access_token;
  } catch (err) {
    const axiosErr = err;
    const detail = axiosErr.response?.data ? JSON.stringify(axiosErr.response.data) : axiosErr.message;
    throw new Error(`MTN token request failed: ${detail}`);
  }
}
async function requestToPay(input) {
  const { baseUrl, collectionKey, targetEnvironment } = getMtnConfig();
  const accessToken = await getAccessToken();
  const msisdn = input.customerMsisdn.replace(/^\+/, "");
  sandboxLog("RequestToPay initiated", {
    referenceId: input.referenceId,
    amount: input.amount,
    msisdn,
    targetEnvironment,
    isSandboxMsisdn: Object.values(SANDBOX_TEST_MSISDNS).includes(msisdn)
  });
  const body = {
    amount: input.amount.toFixed(2),
    currency: "ZMW",
    externalId: input.externalId ?? input.referenceId,
    payer: {
      partyIdType: "MSISDN",
      partyId: msisdn
    },
    payerMessage: input.payerMessage ?? "LTC Fast Track Payment",
    payeeNote: input.payeeNote ?? "Waste collection service"
  };
  try {
    await axios2.post(`${baseUrl}/collection/v1_0/requesttopay`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Reference-Id": input.referenceId,
        "X-Target-Environment": targetEnvironment,
        "Ocp-Apim-Subscription-Key": collectionKey,
        "Content-Type": "application/json"
      },
      timeout: 15e3
    });
    sandboxLog("RequestToPay accepted (202)", { referenceId: input.referenceId });
    return { referenceId: input.referenceId, accepted: true };
  } catch (err) {
    const axiosErr = err;
    const status = axiosErr.response?.status;
    const detail = axiosErr.response?.data ? JSON.stringify(axiosErr.response.data) : axiosErr.message;
    if (status === 409) {
      sandboxLog("RequestToPay duplicate referenceId", { referenceId: input.referenceId, status });
      return {
        referenceId: input.referenceId,
        accepted: false,
        error: `Duplicate referenceId: ${input.referenceId}`
      };
    }
    sandboxLog("RequestToPay failed", { referenceId: input.referenceId, status, detail });
    return {
      referenceId: input.referenceId,
      accepted: false,
      error: `MTN RequestToPay failed (HTTP ${status ?? "unknown"}): ${detail}`
    };
  }
}
async function getRequestToPayStatus(referenceId) {
  const { baseUrl, collectionKey, targetEnvironment } = getMtnConfig();
  const accessToken = await getAccessToken();
  try {
    const response = await axios2.get(`${baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Target-Environment": targetEnvironment,
        "Ocp-Apim-Subscription-Key": collectionKey
      },
      timeout: 1e4
    });
    return {
      referenceId,
      status: response.data.status,
      reason: response.data.reason,
      raw: response.data
    };
  } catch (err) {
    const axiosErr = err;
    const detail = axiosErr.response?.data ? JSON.stringify(axiosErr.response.data) : axiosErr.message;
    throw new Error(`MTN status check failed for ${referenceId}: ${detail}`);
  }
}
async function getDisbursementToken() {
  const now = Date.now();
  if (_disbursementTokenCache && _disbursementTokenCache.expiresAt > now + 6e4) {
    return _disbursementTokenCache.token;
  }
  const { baseUrl, disbursementKey, apiUser, apiKey } = getDisbursementConfig();
  const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString("base64");
  try {
    const response = await axios2.post(
      `${baseUrl}/disbursement/token/`,
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Ocp-Apim-Subscription-Key": disbursementKey,
          "Content-Type": "application/json"
        },
        timeout: 1e4
      }
    );
    const { access_token, expires_in } = response.data;
    _disbursementTokenCache = {
      token: access_token,
      expiresAt: now + expires_in * 1e3
    };
    return access_token;
  } catch (err) {
    const axiosErr = err;
    const detail = axiosErr.response?.data ? JSON.stringify(axiosErr.response.data) : axiosErr.message;
    throw new Error(`MTN Disbursement token request failed: ${detail}`);
  }
}
async function disbursementTransfer(input) {
  const { baseUrl, disbursementKey, targetEnvironment } = getDisbursementConfig();
  const accessToken = await getDisbursementToken();
  const msisdn = input.providerMsisdn.replace(/^\+/, "");
  sandboxLog("Disbursement Transfer initiated", {
    referenceId: input.referenceId,
    amount: input.amount,
    msisdn,
    targetEnvironment,
    isSandboxMsisdn: Object.values(SANDBOX_TEST_MSISDNS).includes(msisdn)
  });
  const body = {
    amount: input.amount.toFixed(2),
    currency: "ZMW",
    externalId: input.externalId ?? input.referenceId,
    payee: {
      partyIdType: "MSISDN",
      partyId: msisdn
    },
    payerMessage: input.payerMessage ?? "LTC Fast Track Withdrawal",
    payeeNote: input.payeeNote ?? "Provider payout"
  };
  try {
    await axios2.post(`${baseUrl}/disbursement/v1_0/transfer`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Reference-Id": input.referenceId,
        "X-Target-Environment": targetEnvironment,
        "Ocp-Apim-Subscription-Key": disbursementKey,
        "Content-Type": "application/json"
      },
      timeout: 15e3
    });
    sandboxLog("Disbursement Transfer accepted (202)", { referenceId: input.referenceId });
    return { referenceId: input.referenceId, accepted: true };
  } catch (err) {
    const axiosErr = err;
    const status = axiosErr.response?.status;
    const detail = axiosErr.response?.data ? JSON.stringify(axiosErr.response.data) : axiosErr.message;
    if (status === 409) {
      sandboxLog("Disbursement Transfer duplicate referenceId", { referenceId: input.referenceId, status });
      return {
        referenceId: input.referenceId,
        accepted: false,
        error: `Duplicate referenceId: ${input.referenceId}`
      };
    }
    sandboxLog("Disbursement Transfer failed", { referenceId: input.referenceId, status, detail });
    return {
      referenceId: input.referenceId,
      accepted: false,
      error: `MTN Disbursement Transfer failed (HTTP ${status ?? "unknown"}): ${detail}`
    };
  }
}
async function getDisbursementStatus(referenceId) {
  const { baseUrl, disbursementKey, targetEnvironment } = getDisbursementConfig();
  const accessToken = await getDisbursementToken();
  try {
    const response = await axios2.get(`${baseUrl}/disbursement/v1_0/transfer/${referenceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Target-Environment": targetEnvironment,
        "Ocp-Apim-Subscription-Key": disbursementKey
      },
      timeout: 1e4
    });
    return {
      referenceId,
      status: response.data.status,
      reason: response.data.reason,
      financialTransactionId: response.data.financialTransactionId,
      raw: response.data
    };
  } catch (err) {
    const axiosErr = err;
    const detail = axiosErr.response?.data ? JSON.stringify(axiosErr.response.data) : axiosErr.message;
    throw new Error(`MTN Disbursement status check failed for ${referenceId}: ${detail}`);
  }
}

// server/payment-service.ts
init_schema();

// server/commission-service.ts
import { eq as eq7, desc as desc3 } from "drizzle-orm";
init_schema();
var PLATFORM_CONFIG = {
  msisdn: "0960819993",
  currency: "ZMW",
  defaultCommissionRate: 0.1
  // 10% fallback when no rule is configured
};
var rateCache = null;
var CACHE_TTL_MS = 5 * 60 * 1e3;
async function getCommissionRate(serviceType) {
  if (rateCache && Date.now() - rateCache.cachedAt < CACHE_TTL_MS) {
    return rateCache.rates[serviceType] ?? PLATFORM_CONFIG.defaultCommissionRate;
  }
  const db = await getDb();
  if (!db) {
    return PLATFORM_CONFIG.defaultCommissionRate;
  }
  const rules = await db.select().from(commissionRules).where(eq7(commissionRules.isActive, true));
  const rates = {
    garbage: PLATFORM_CONFIG.defaultCommissionRate,
    carrier: PLATFORM_CONFIG.defaultCommissionRate,
    subscription: PLATFORM_CONFIG.defaultCommissionRate
  };
  for (const rule of rules) {
    const st = rule.serviceType;
    rates[st] = parseFloat(rule.rate);
  }
  rateCache = { rates, cachedAt: Date.now() };
  return rates[serviceType] ?? PLATFORM_CONFIG.defaultCommissionRate;
}
async function calculateCommission(amountTotal, serviceType) {
  const appliedRate = await getCommissionRate(serviceType);
  const platformCommission = parseFloat((amountTotal * appliedRate).toFixed(2));
  const providerAmount = parseFloat((amountTotal - platformCommission).toFixed(2));
  return {
    amountTotal,
    serviceType,
    appliedRate,
    ratePercent: parseFloat((appliedRate * 100).toFixed(2)),
    platformCommission,
    providerAmount,
    platformAmount: platformCommission,
    transactionSource: serviceType
  };
}

// server/payment-service.ts
import crypto2 from "crypto";
var PLATFORM_COMMISSION_RATE = 0.1;
function calculateCommission2(amountTotal) {
  const platformCommission = parseFloat((amountTotal * PLATFORM_COMMISSION_RATE).toFixed(2));
  const providerAmount = parseFloat((amountTotal - platformCommission).toFixed(2));
  return { platformCommission, providerAmount };
}
async function ensurePlatformWallet(db) {
  if (!db) throw new Error("Database not available");
  const [existing] = await db.select().from(platformWallet).limit(1);
  if (!existing) {
    await db.insert(platformWallet).values({
      totalCommissionEarned: "0.00",
      availableBalance: "0.00",
      totalWithdrawn: "0.00"
    });
    const [created] = await db.select().from(platformWallet).limit(1);
    return created;
  }
  return existing;
}
async function ensureProviderWallet(db, providerId, providerRole) {
  if (!db) throw new Error("Database not available");
  const [existing] = await db.select().from(providerWallets).where(eq8(providerWallets.providerId, providerId));
  if (!existing) {
    await db.insert(providerWallets).values({
      providerId,
      providerRole,
      availableBalance: "0.00",
      totalEarned: "0.00",
      totalWithdrawn: "0.00",
      pendingBalance: "0.00"
    });
    const [created] = await db.select().from(providerWallets).where(eq8(providerWallets.providerId, providerId));
    return created;
  }
  return existing;
}
async function requestPayment(input) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const commissionCalc = await calculateCommission(
    input.amountTotal,
    input.serviceType
  );
  const { platformCommission, providerAmount, appliedRate, transactionSource } = {
    platformCommission: commissionCalc.platformCommission,
    providerAmount: commissionCalc.providerAmount,
    appliedRate: commissionCalc.appliedRate,
    transactionSource: commissionCalc.transactionSource
  };
  const referenceId = `LTC-${Date.now()}-${crypto2.randomBytes(4).toString("hex").toUpperCase()}`;
  const insertData = {
    payerId: input.payerId,
    providerId: input.providerId,
    providerRole: input.providerRole,
    serviceType: input.serviceType,
    serviceReferenceId: input.serviceReferenceId ?? null,
    amountTotal: input.amountTotal.toFixed(2),
    platformCommission: platformCommission.toFixed(2),
    providerAmount: providerAmount.toFixed(2),
    // Commission tracking fields
    commissionAmount: platformCommission.toFixed(2),
    platformAmount: platformCommission.toFixed(2),
    transactionSource,
    appliedCommissionRate: appliedRate.toFixed(4),
    paymentMethod: input.paymentMethod ?? "manual",
    referenceId,
    status: "pending",
    notes: input.notes ?? null
  };
  const result = await db.insert(paymentTransactions).values(insertData);
  const transactionId = result[0].insertId;
  if (input.paymentMethod === "mtn_momo" && isMtnConfigured()) {
    if (!input.customerPhone) {
      throw new Error("customerPhone is required for MTN MoMo payments");
    }
    const mtnResult = await requestToPay({
      referenceId,
      amount: input.amountTotal,
      customerMsisdn: input.customerPhone,
      payerMessage: `LTC Fast Track - ${input.serviceType === "garbage" ? "Waste Collection" : "Carrier Service"} Payment`,
      payeeNote: `LTC-${input.serviceType}-${transactionId}`,
      externalId: referenceId
    });
    if (!mtnResult.accepted) {
      await db.update(paymentTransactions).set({ status: "failed", notes: mtnResult.error ?? "MTN RequestToPay rejected" }).where(eq8(paymentTransactions.id, transactionId));
      throw new Error(mtnResult.error ?? "MTN RequestToPay was not accepted");
    }
    await db.update(paymentTransactions).set({ status: "processing" }).where(eq8(paymentTransactions.id, transactionId));
    return {
      transactionId,
      referenceId,
      amountTotal: input.amountTotal,
      platformCommission,
      providerAmount,
      status: "processing",
      mtnAccepted: true
    };
  }
  return {
    transactionId,
    referenceId,
    amountTotal: input.amountTotal,
    platformCommission,
    providerAmount,
    status: "pending",
    manualMode: !isMtnConfigured()
  };
}
async function releasePayment(input) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [txn] = await db.select().from(paymentTransactions).where(eq8(paymentTransactions.id, input.transactionId));
  if (!txn) throw new Error(`Transaction ${input.transactionId} not found`);
  if (txn.status === "completed" || txn.status === "released") {
    throw new Error(`Transaction ${input.transactionId} already released`);
  }
  if (txn.status === "failed" || txn.status === "cancelled") {
    throw new Error(`Cannot release transaction in status: ${txn.status}`);
  }
  const providerAmount = parseFloat(txn.providerAmount);
  const platformCommission = parseFloat(txn.platformCommission);
  await ensurePlatformWallet(db);
  const providerWallet = await ensureProviderWallet(db, txn.providerId, txn.providerRole);
  const newProviderBalance = parseFloat(providerWallet.availableBalance) + providerAmount;
  const newProviderTotal = parseFloat(providerWallet.totalEarned) + providerAmount;
  await db.update(providerWallets).set({
    availableBalance: newProviderBalance.toFixed(2),
    totalEarned: newProviderTotal.toFixed(2)
  }).where(eq8(providerWallets.providerId, txn.providerId));
  await db.update(platformWallet).set({
    totalCommissionEarned: sql3`totalCommissionEarned + ${platformCommission.toFixed(2)}`,
    availableBalance: sql3`availableBalance + ${platformCommission.toFixed(2)}`
  });
  await db.update(paymentTransactions).set({
    status: "completed",
    ...input.externalReference ? { referenceId: input.externalReference } : {}
  }).where(eq8(paymentTransactions.id, input.transactionId));
  return {
    success: true,
    transactionId: input.transactionId,
    providerAmount,
    platformCommission,
    newProviderBalance
  };
}
async function requestWithdrawal(input) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const wallet = await ensureProviderWallet(db, input.providerId, input.providerRole);
  const available = parseFloat(wallet.availableBalance);
  if (input.amount <= 0) throw new Error("Withdrawal amount must be greater than 0");
  if (input.amount > available) {
    throw new Error(
      `Insufficient balance. Available: ZMW ${available.toFixed(2)}, Requested: ZMW ${input.amount.toFixed(2)}`
    );
  }
  const withdrawalReference = `WD-${Date.now()}-${crypto2.randomBytes(4).toString("hex").toUpperCase()}`;
  const newBalance = available - input.amount;
  const newTotalWithdrawn = parseFloat(wallet.totalWithdrawn) + input.amount;
  await db.update(providerWallets).set({
    availableBalance: newBalance.toFixed(2),
    totalWithdrawn: newTotalWithdrawn.toFixed(2)
  }).where(eq8(providerWallets.providerId, input.providerId));
  const [latestTxn] = await db.select().from(paymentTransactions).where(
    and7(
      eq8(paymentTransactions.providerId, input.providerId),
      eq8(paymentTransactions.status, "completed")
    )
  ).orderBy(sql3`createdAt DESC`).limit(1);
  if (latestTxn) {
    await db.update(paymentTransactions).set({
      status: "released",
      withdrawalRequestedAt: /* @__PURE__ */ new Date(),
      withdrawalReference
    }).where(eq8(paymentTransactions.id, latestTxn.id));
  }
  let mtnDisbursementAccepted = false;
  let mtnDisbursementError;
  if (input.withdrawalMethod === "mtn_momo" && isMtnDisbursementConfigured()) {
    const mtnResult = await disbursementTransfer({
      referenceId: withdrawalReference,
      amount: input.amount,
      providerMsisdn: input.accountNumber,
      payerMessage: "LTC Fast Track Withdrawal",
      payeeNote: `Provider payout \u2014 ${input.providerRole} ID ${input.providerId}`,
      externalId: withdrawalReference
    });
    if (!mtnResult.accepted) {
      await db.update(providerWallets).set({
        availableBalance: available.toFixed(2),
        totalWithdrawn: parseFloat(wallet.totalWithdrawn).toFixed(2)
      }).where(eq8(providerWallets.providerId, input.providerId));
      if (latestTxn) {
        await db.update(paymentTransactions).set({ status: "completed", withdrawalReference: null, withdrawalRequestedAt: null }).where(eq8(paymentTransactions.id, latestTxn.id));
      }
      throw new Error(mtnResult.error ?? "MTN Disbursement Transfer was not accepted");
    }
    mtnDisbursementAccepted = true;
    if (latestTxn) {
      await db.update(paymentTransactions).set({
        status: "released",
        notes: `MTN Disbursement Transfer accepted. Reference: ${withdrawalReference}`
      }).where(eq8(paymentTransactions.id, latestTxn.id));
    }
  } else if (input.withdrawalMethod === "mtn_momo" && !isMtnDisbursementConfigured()) {
    mtnDisbursementError = "MTN Disbursement not configured \u2014 manual payout required";
  }
  return {
    success: true,
    withdrawalReference,
    amount: input.amount,
    newBalance,
    mtnDisbursementAccepted,
    ...mtnDisbursementError ? { mtnDisbursementError } : {},
    manualMode: input.withdrawalMethod !== "mtn_momo" || !isMtnDisbursementConfigured()
  };
}
async function handlePaymentCallback(input) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [txn] = await db.select().from(paymentTransactions).where(eq8(paymentTransactions.referenceId, input.referenceId));
  if (!txn) throw new Error(`No transaction found for referenceId: ${input.referenceId}`);
  await db.update(paymentTransactions).set({ callbackPayload: JSON.stringify(input.gatewayPayload) }).where(eq8(paymentTransactions.id, txn.id));
  let resolvedStatus = input.status;
  let mtnVerified = false;
  if (isMtnConfigured() && txn.paymentMethod === "mtn_momo") {
    try {
      const mtnStatus = await getRequestToPayStatus(input.referenceId);
      mtnVerified = true;
      if (mtnStatus.status === "SUCCESSFUL") {
        resolvedStatus = "completed";
      } else if (mtnStatus.status === "FAILED") {
        resolvedStatus = "failed";
      } else {
        await db.update(paymentTransactions).set({ status: "processing" }).where(eq8(paymentTransactions.id, txn.id));
        return { processed: false, transactionId: txn.id, status: "processing", mtnVerified };
      }
    } catch {
      await db.update(paymentTransactions).set({ notes: `MTN verification failed; trusting callback status: ${input.status}` }).where(eq8(paymentTransactions.id, txn.id));
    }
  }
  if (resolvedStatus === "completed") {
    await releasePayment({
      transactionId: txn.id,
      externalReference: input.gatewayPayload?.financialTransactionId ?? void 0
    });
    return { processed: true, transactionId: txn.id, status: "completed", mtnVerified };
  } else {
    await db.update(paymentTransactions).set({ status: "failed" }).where(eq8(paymentTransactions.id, txn.id));
    return { processed: true, transactionId: txn.id, status: "failed", mtnVerified };
  }
}
async function getProviderWalletBalance(providerId) {
  const db = await getDb();
  if (!db) return null;
  const [wallet] = await db.select().from(providerWallets).where(eq8(providerWallets.providerId, providerId));
  if (!wallet) return null;
  return {
    availableBalance: parseFloat(wallet.availableBalance),
    totalEarned: parseFloat(wallet.totalEarned),
    totalWithdrawn: parseFloat(wallet.totalWithdrawn),
    pendingBalance: parseFloat(wallet.pendingBalance)
  };
}
async function getTransactionsByProvider(providerId, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(paymentTransactions).where(eq8(paymentTransactions.providerId, providerId)).orderBy(sql3`createdAt DESC`).limit(limit);
}
async function getTransactionsByPayer(payerId, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(paymentTransactions).where(eq8(paymentTransactions.payerId, payerId)).orderBy(sql3`createdAt DESC`).limit(limit);
}
async function getPlatformWalletSummary() {
  const db = await getDb();
  if (!db) return null;
  const [wallet] = await db.select().from(platformWallet).limit(1);
  if (!wallet) return null;
  return {
    totalCommissionEarned: parseFloat(wallet.totalCommissionEarned),
    availableBalance: parseFloat(wallet.availableBalance),
    totalWithdrawn: parseFloat(wallet.totalWithdrawn)
  };
}
async function getAllTransactions(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(paymentTransactions).orderBy(sql3`createdAt DESC`).limit(limit);
}
async function getCommissionStats() {
  const db = await getDb();
  if (!db) {
    return {
      totalCommission: 0,
      dailyCommission: 0,
      monthlyCommission: 0,
      totalTransactions: 0,
      completedTransactions: 0,
      avgCommissionPerTransaction: 0,
      byServiceType: []
    };
  }
  const allTxns = await db.select().from(paymentTransactions).orderBy(sql3`createdAt DESC`);
  const now = /* @__PURE__ */ new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  let totalCommission = 0;
  let dailyCommission = 0;
  let monthlyCommission = 0;
  let completedCount = 0;
  const byServiceMap = {};
  for (const txn of allTxns) {
    const commission = parseFloat(txn.platformCommission ?? "0");
    const createdAt = new Date(txn.createdAt);
    const serviceType = txn.transactionSource ?? txn.serviceType ?? "unknown";
    if (txn.status === "completed" || txn.status === "released") {
      totalCommission += commission;
      completedCount++;
      if (createdAt >= todayStart) dailyCommission += commission;
      if (createdAt >= monthStart) monthlyCommission += commission;
      if (!byServiceMap[serviceType]) byServiceMap[serviceType] = { total: 0, count: 0 };
      byServiceMap[serviceType].total += commission;
      byServiceMap[serviceType].count++;
    }
  }
  const byServiceType = Object.entries(byServiceMap).map(([serviceType, data]) => ({
    serviceType,
    total: Math.round(data.total * 100) / 100,
    count: data.count
  }));
  return {
    totalCommission: Math.round(totalCommission * 100) / 100,
    dailyCommission: Math.round(dailyCommission * 100) / 100,
    monthlyCommission: Math.round(monthlyCommission * 100) / 100,
    totalTransactions: allTxns.length,
    completedTransactions: completedCount,
    avgCommissionPerTransaction: completedCount > 0 ? Math.round(totalCommission / completedCount * 100) / 100 : 0,
    byServiceType
  };
}

// server/routers-payment.ts
var ProviderRoleSchema = z7.enum(["zone_manager", "carrier_driver"]);
var ServiceTypeSchema = z7.enum(["garbage", "carrier"]);
var PaymentMethodSchema = z7.enum([
  "mtn_momo",
  "airtel_money",
  "zamtel_money",
  "bank_transfer",
  "manual"
]);
var RequestPaymentSchema = z7.object({
  payerId: z7.number().int().positive(),
  providerId: z7.number().int().positive(),
  providerRole: ProviderRoleSchema,
  serviceType: ServiceTypeSchema,
  serviceReferenceId: z7.number().int().positive().optional(),
  amountTotal: z7.number().positive("Amount must be greater than 0"),
  paymentMethod: PaymentMethodSchema.optional().default("manual"),
  notes: z7.string().max(500).optional()
});
var ReleasePaymentSchema = z7.object({
  transactionId: z7.number().int().positive(),
  externalReference: z7.string().max(128).optional()
});
var WithdrawSchema = z7.object({
  providerId: z7.number().int().positive(),
  providerRole: ProviderRoleSchema,
  amount: z7.number().positive("Withdrawal amount must be greater than 0"),
  withdrawalMethod: z7.enum(["mtn_momo", "airtel_money", "zamtel_money", "bank_transfer"]),
  accountNumber: z7.string().min(5).max(50),
  accountName: z7.string().max(255).optional()
});
var CallbackSchema = z7.object({
  referenceId: z7.string().min(1),
  status: z7.enum(["completed", "failed"]),
  gatewayPayload: z7.record(z7.string(), z7.unknown())
});
var paymentRouter = router({
  /**
   * POST /api/request-payment
   *
   * Creates a pending payment transaction with server-calculated 10% commission.
   * Transaction is logged BEFORE any payout (audit requirement).
   *
   * Returns referenceId for use with the payment gateway (MTN MoMo etc.).
   */
  requestPayment: publicProcedure.input(RequestPaymentSchema).mutation(async ({ input }) => {
    const result = await requestPayment({
      payerId: input.payerId,
      providerId: input.providerId,
      providerRole: input.providerRole,
      serviceType: input.serviceType,
      serviceReferenceId: input.serviceReferenceId,
      amountTotal: input.amountTotal,
      paymentMethod: input.paymentMethod,
      notes: input.notes
    });
    return {
      success: true,
      transactionId: result.transactionId,
      referenceId: result.referenceId,
      breakdown: {
        amountTotal: result.amountTotal,
        platformCommission: result.platformCommission,
        providerAmount: result.providerAmount,
        commissionRate: `${PLATFORM_COMMISSION_RATE * 100}%`
      },
      status: result.status,
      message: "Payment transaction created. Awaiting payment confirmation."
    };
  }),
  /**
   * POST /api/release-payment
   *
   * Confirms a payment and credits:
   *   - Provider wallet: 90% of amountTotal
   *   - Platform wallet: 10% commission
   *
   * Must be called after payment gateway confirms receipt.
   * For MTN MoMo: this will be triggered automatically by the callback endpoint.
   */
  releasePayment: publicProcedure.input(ReleasePaymentSchema).mutation(async ({ input }) => {
    const result = await releasePayment({
      transactionId: input.transactionId,
      externalReference: input.externalReference
    });
    return {
      success: result.success,
      transactionId: result.transactionId,
      breakdown: {
        providerAmount: result.providerAmount,
        platformCommission: result.platformCommission,
        newProviderBalance: result.newProviderBalance
      },
      message: `Payment released. Provider credited ZMW ${result.providerAmount.toFixed(2)}.`
    };
  }),
  /**
   * POST /api/withdraw
   *
   * Provider requests withdrawal of their available balance.
   * Validates sufficient funds before deducting.
   *
   * MTN integration: Will call MTN Disbursement API when keys are configured.
   */
  withdraw: publicProcedure.input(WithdrawSchema).mutation(async ({ input }) => {
    const result = await requestWithdrawal({
      providerId: input.providerId,
      providerRole: input.providerRole,
      amount: input.amount,
      withdrawalMethod: input.withdrawalMethod,
      accountNumber: input.accountNumber,
      accountName: input.accountName
    });
    return {
      success: result.success,
      withdrawalReference: result.withdrawalReference,
      amount: result.amount,
      newBalance: result.newBalance,
      message: `Withdrawal of ZMW ${result.amount.toFixed(2)} initiated. Reference: ${result.withdrawalReference}`
    };
  }),
  /**
   * POST /api/payment-callback
   *
   * Webhook endpoint for payment gateway callbacks (MTN MoMo, Airtel, etc.).
   * On "completed" → automatically triggers releasePayment.
   * On "failed"    → marks transaction as failed.
   *
   * MTN integration: MTN will POST to this endpoint after payment confirmation.
   * Validate callback signature using MTN_API_KEY before processing.
   */
  callback: publicProcedure.input(CallbackSchema).mutation(async ({ input }) => {
    const result = await handlePaymentCallback({
      referenceId: input.referenceId,
      status: input.status,
      gatewayPayload: input.gatewayPayload
    });
    return {
      processed: result.processed,
      transactionId: result.transactionId,
      status: result.status,
      message: `Callback processed. Transaction ${result.transactionId} is now ${result.status}.`
    };
  }),
  // ─── Query Helpers ──────────────────────────────────────────────────────────
  /**
   * Get provider wallet balance
   */
  providerBalance: publicProcedure.input(z7.object({ providerId: z7.number().int().positive() })).query(async ({ input }) => {
    const balance = await getProviderWalletBalance(input.providerId);
    if (!balance) {
      return {
        availableBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        pendingBalance: 0
      };
    }
    return balance;
  }),
  /**
   * Get transactions for a provider
   */
  providerTransactions: publicProcedure.input(z7.object({
    providerId: z7.number().int().positive(),
    limit: z7.number().int().min(1).max(200).optional().default(50)
  })).query(async ({ input }) => {
    return getTransactionsByProvider(input.providerId, input.limit);
  }),
  /**
   * Get transactions for a payer (customer)
   */
  payerTransactions: publicProcedure.input(z7.object({
    payerId: z7.number().int().positive(),
    limit: z7.number().int().min(1).max(200).optional().default(50)
  })).query(async ({ input }) => {
    return getTransactionsByPayer(input.payerId, input.limit);
  }),
  /**
   * Platform wallet summary (admin use)
   */
  platformSummary: publicProcedure.query(async () => {
    const summary = await getPlatformWalletSummary();
    return summary ?? {
      totalCommissionEarned: 0,
      availableBalance: 0,
      totalWithdrawn: 0
    };
  }),
  /**
   * Preview commission breakdown for a given amount (no DB write)
   */
  previewCommission: publicProcedure.input(z7.object({ amountTotal: z7.number().positive() })).query(({ input }) => {
    const { platformCommission, providerAmount } = calculateCommission2(input.amountTotal);
    return {
      amountTotal: input.amountTotal,
      platformCommission,
      providerAmount,
      commissionRate: `${PLATFORM_COMMISSION_RATE * 100}%`
    };
  }),
  /**
   * Get all transactions (admin use — most recent first)
   */
  adminAllTransactions: publicProcedure.input(z7.object({ limit: z7.number().int().min(1).max(500).optional().default(200) })).query(async ({ input }) => {
    return getAllTransactions(input.limit);
  }),
  /**
   * Commission statistics for the admin Commission Dashboard
   */
  adminCommissionStats: publicProcedure.query(async () => {
    return getCommissionStats();
  })
});

// server/routers.ts
var PaymentStatusEnum = z8.enum([
  "pending",
  "processing",
  "successful",
  "failed",
  "cancelled",
  "expired",
  "refunded"
]);
var PaymentProviderEnum = z8.enum([
  "mtn_momo",
  "airtel_money",
  "zamtel_money",
  "bank_transfer",
  "card"
]);
var PaymentCallbackSchema = z8.object({
  transactionId: z8.string(),
  externalId: z8.string().optional(),
  status: PaymentStatusEnum,
  amount: z8.number(),
  currency: z8.string().default("ZMW"),
  provider: PaymentProviderEnum,
  timestamp: z8.string(),
  signature: z8.string().optional(),
  // Provider-specific fields
  phoneNumber: z8.string().optional(),
  reference: z8.string().optional(),
  failureReason: z8.string().optional()
});
var PaymentRequestSchema = z8.object({
  amount: z8.number().positive(),
  currency: z8.string().default("ZMW"),
  provider: PaymentProviderEnum,
  phoneNumber: z8.string(),
  reference: z8.string(),
  description: z8.string().optional(),
  metadata: z8.record(z8.string(), z8.string()).optional()
});
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  bookings: bookingsRouter,
  drivers: driversRouter,
  collector: collectorRouter,
  zone: zoneRouter,
  wallet: walletRouter,
  paymentService: paymentRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Payment API routes
  payments: router({
    /**
     * Initiate a payment request
     * This is called from the mobile app to start a payment
     */
    initiate: publicProcedure.input(PaymentRequestSchema).mutation(async ({ input }) => {
      console.log("[Payments] Initiating payment:", {
        provider: input.provider,
        amount: input.amount,
        reference: input.reference
      });
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      return {
        success: true,
        transactionId,
        status: "pending",
        message: "Payment request initiated. Please complete payment on your phone.",
        provider: input.provider,
        amount: input.amount,
        currency: input.currency,
        reference: input.reference,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }),
    /**
     * Check payment status
     */
    status: publicProcedure.input(z8.object({
      transactionId: z8.string(),
      provider: PaymentProviderEnum
    })).query(async ({ input }) => {
      console.log("[Payments] Checking status:", input.transactionId);
      return {
        transactionId: input.transactionId,
        status: "pending",
        provider: input.provider,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }),
    /**
     * MTN MoMo webhook callback
     * Called by MTN when payment status changes
     */
    mtnCallback: publicProcedure.input(PaymentCallbackSchema).mutation(async ({ input }) => {
      console.log("[Payments] MTN MoMo callback received:", {
        transactionId: input.transactionId,
        status: input.status,
        amount: input.amount
      });
      return {
        success: true,
        message: "Callback processed",
        transactionId: input.transactionId
      };
    }),
    /**
     * Airtel Money webhook callback
     * Called by Airtel when payment status changes
     */
    airtelCallback: publicProcedure.input(PaymentCallbackSchema).mutation(async ({ input }) => {
      console.log("[Payments] Airtel Money callback received:", {
        transactionId: input.transactionId,
        status: input.status,
        amount: input.amount
      });
      return {
        success: true,
        message: "Callback processed",
        transactionId: input.transactionId
      };
    }),
    /**
     * Generic webhook callback (for other providers)
     */
    genericCallback: publicProcedure.input(PaymentCallbackSchema).mutation(async ({ input }) => {
      console.log("[Payments] Generic callback received:", {
        provider: input.provider,
        transactionId: input.transactionId,
        status: input.status
      });
      return {
        success: true,
        message: "Callback processed",
        transactionId: input.transactionId
      };
    }),
    /**
     * Get payment receiver numbers
     */
    getReceivers: publicProcedure.query(() => {
      return {
        mtn_momo: "+260960819993",
        airtel_money: "20158560",
        zamtel_money: ""
        // To be added
      };
    })
  }),
  /**
   * Notifications router — customer in-app notifications
   */
  notifications: router({
    /**
     * Fetch all notifications for a user (most recent first)
     */
    getAll: publicProcedure.input(z8.object({ userId: z8.string(), limit: z8.number().int().min(1).max(200).optional().default(100) })).query(async ({ input }) => {
      const rows = await getUserNotifications(input.userId, input.limit);
      return [...rows].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }),
    /**
     * Create a new notification for a user
     */
    create: publicProcedure.input(z8.object({
      userId: z8.string(),
      type: z8.enum(["pickup_update", "driver_accepted", "driver_arriving", "pickup_completed", "payment", "subscription", "system", "support"]),
      title: z8.string(),
      body: z8.string(),
      data: z8.string().optional(),
      pickupId: z8.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createUserNotification(input);
      return { success: true, id };
    }),
    /**
     * Mark a single notification as read
     */
    markRead: publicProcedure.input(z8.object({ id: z8.number().int() })).mutation(async ({ input }) => {
      await markUserNotificationRead(input.id);
      return { success: true };
    }),
    /**
     * Mark all notifications as read for a user
     */
    markAllRead: publicProcedure.input(z8.object({ userId: z8.string() })).mutation(async ({ input }) => {
      await markAllUserNotificationsRead(input.userId);
      return { success: true };
    })
  }),
  /**
   * Admin router — all admin-level data queries
   */
  admin: router({
    getAllUsers: publicProcedure.input(z8.object({ limit: z8.number().int().min(1).max(500).optional().default(200) })).query(async ({ input }) => getAllUsers(input.limit))
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/mtn-webhook.ts
import crypto3 from "crypto";
import { eq as eq9 } from "drizzle-orm";
init_schema();
function validateWebhookSignature(rawBody, signatureHeader) {
  const secret = process.env.MTN_WEBHOOK_SECRET?.trim();
  if (!secret) {
    if (isSandbox()) {
      sandboxLog("Webhook signature skipped (no MTN_WEBHOOK_SECRET set \u2014 sandbox mode)");
      return { valid: true };
    }
    return { valid: false, reason: "MTN_WEBHOOK_SECRET not configured" };
  }
  if (!signatureHeader) {
    return { valid: false, reason: "Missing X-Callback-Signature header" };
  }
  const expected = crypto3.createHmac("sha256", secret).update(rawBody).digest("hex");
  const sigBuffer = Buffer.from(signatureHeader.replace(/^sha256=/, ""), "hex");
  const expBuffer = Buffer.from(expected, "hex");
  if (sigBuffer.length !== expBuffer.length) {
    return { valid: false, reason: "Signature length mismatch" };
  }
  const match = crypto3.timingSafeEqual(sigBuffer, expBuffer);
  return match ? { valid: true } : { valid: false, reason: "Signature mismatch" };
}
function detectWebhookType(payload) {
  if (payload.payer) return "collection";
  if (payload.payee) return "disbursement";
  return "unknown";
}
async function findTransactionByReference(db, referenceId) {
  if (!db) return null;
  const [txn] = await db.select().from(paymentTransactions).where(eq9(paymentTransactions.referenceId, referenceId)).limit(1);
  return txn ?? null;
}
async function creditProviderWallet(db, providerId, amount) {
  const [wallet] = await db.select().from(providerWallets).where(eq9(providerWallets.providerId, providerId)).limit(1);
  if (!wallet) return;
  const newAvailable = parseFloat(wallet.availableBalance) + amount;
  const newTotal = parseFloat(wallet.totalEarned) + amount;
  await db.update(providerWallets).set({
    availableBalance: newAvailable.toFixed(2),
    totalEarned: newTotal.toFixed(2)
  }).where(eq9(providerWallets.providerId, providerId));
}
async function creditPlatformWallet(db, commission) {
  const [wallet] = await db.select().from(platformWallet).limit(1);
  if (!wallet) return;
  const newAvailable = parseFloat(wallet.availableBalance) + commission;
  const newTotal = parseFloat(wallet.totalCommissionEarned) + commission;
  await db.update(platformWallet).set({
    availableBalance: newAvailable.toFixed(2),
    totalCommissionEarned: newTotal.toFixed(2)
  }).where(eq9(platformWallet.id, wallet.id));
}
async function handleMtnWebhook(req, res) {
  const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
  const signatureHeader = req.headers["x-callback-signature"];
  const payload = req.body;
  sandboxLog("Webhook received", {
    headers: {
      "x-callback-signature": signatureHeader ? "[present]" : "[absent]",
      "content-type": req.headers["content-type"]
    },
    payload
  });
  const sigResult = validateWebhookSignature(rawBody, signatureHeader);
  if (!sigResult.valid) {
    sandboxLog("Webhook signature invalid", { reason: sigResult.reason });
    res.status(401).json({ error: "Invalid webhook signature", reason: sigResult.reason });
    return;
  }
  const referenceId = payload.referenceId ?? payload.externalId;
  if (!referenceId) {
    sandboxLog("Webhook missing referenceId");
    res.status(400).json({ error: "Missing referenceId or externalId in payload" });
    return;
  }
  const webhookType = detectWebhookType(payload);
  sandboxLog("Webhook type detected", { webhookType, referenceId });
  let verifiedStatus = "PENDING";
  let financialTransactionId;
  try {
    if (webhookType === "collection") {
      const statusResult = await getRequestToPayStatus(referenceId);
      verifiedStatus = statusResult.status;
      financialTransactionId = statusResult.financialTransactionId;
      sandboxLog("Collection status verified", { referenceId, verifiedStatus, financialTransactionId });
    } else if (webhookType === "disbursement") {
      const statusResult = await getDisbursementStatus(referenceId);
      verifiedStatus = statusResult.status;
      financialTransactionId = statusResult.financialTransactionId;
      sandboxLog("Disbursement status verified", { referenceId, verifiedStatus, financialTransactionId });
    } else {
      try {
        const statusResult = await getRequestToPayStatus(referenceId);
        verifiedStatus = statusResult.status;
        financialTransactionId = statusResult.financialTransactionId;
      } catch {
        const statusResult = await getDisbursementStatus(referenceId);
        verifiedStatus = statusResult.status;
        financialTransactionId = statusResult.financialTransactionId;
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    sandboxLog("Webhook MTN status cross-verify failed", { referenceId, error: msg });
    res.status(200).json({ received: true, warning: "MTN status verification failed \u2014 logged for review" });
    return;
  }
  const db = await getDb();
  if (!db) {
    res.status(503).json({ error: "Database unavailable" });
    return;
  }
  const txn = await findTransactionByReference(db, referenceId);
  if (!txn) {
    sandboxLog("Webhook transaction not found in DB", { referenceId });
    res.status(200).json({ received: true, warning: "Transaction not found" });
    return;
  }
  const finalStatuses = ["completed", "released", "failed", "refunded", "cancelled"];
  if (finalStatuses.includes(txn.status)) {
    sandboxLog("Webhook idempotency \u2014 transaction already finalized", { referenceId, status: txn.status });
    res.status(200).json({ received: true, idempotent: true, status: txn.status });
    return;
  }
  if (verifiedStatus === "SUCCESSFUL") {
    if (webhookType === "collection" || webhookType === "unknown") {
      const providerAmount = parseFloat(txn.providerAmount);
      const commission = parseFloat(txn.platformCommission);
      await db.update(paymentTransactions).set({
        status: "completed",
        notes: `Payment confirmed via MTN webhook. Financial Txn ID: ${financialTransactionId ?? "N/A"}`,
        callbackPayload: JSON.stringify(payload)
      }).where(eq9(paymentTransactions.id, txn.id));
      await creditProviderWallet(db, txn.providerId, providerAmount);
      await creditPlatformWallet(db, commission);
      sandboxLog("Webhook: payment completed, wallets credited", {
        referenceId,
        providerAmount,
        commission,
        providerId: txn.providerId
      });
    } else if (webhookType === "disbursement") {
      await db.update(paymentTransactions).set({
        status: "released",
        withdrawalCompletedAt: /* @__PURE__ */ new Date(),
        notes: `Disbursement confirmed via MTN webhook. Financial Txn ID: ${financialTransactionId ?? "N/A"}`,
        callbackPayload: JSON.stringify(payload)
      }).where(eq9(paymentTransactions.id, txn.id));
      sandboxLog("Webhook: disbursement released", { referenceId, financialTransactionId });
    }
  } else if (verifiedStatus === "FAILED") {
    await db.update(paymentTransactions).set({
      status: "failed",
      notes: `Payment failed via MTN webhook. Reason: ${payload.reason ?? "unknown"}`,
      callbackPayload: JSON.stringify(payload)
    }).where(eq9(paymentTransactions.id, txn.id));
    sandboxLog("Webhook: payment failed", { referenceId, reason: payload.reason });
  } else {
    await db.update(paymentTransactions).set({
      notes: `Webhook received (PENDING). Waiting for final status. Ref: ${referenceId}`,
      callbackPayload: JSON.stringify(payload)
    }).where(eq9(paymentTransactions.id, txn.id));
    sandboxLog("Webhook: payment still pending", { referenceId });
  }
  res.status(200).json({ received: true, referenceId, verifiedStatus });
}

// server/transaction-monitor.ts
import { eq as eq10, and as and8, lt, inArray as inArray2 } from "drizzle-orm";
init_schema();
var POLL_INTERVAL_MS = 6e4;
var PENDING_TIMEOUT_MINUTES = 30;
var MAX_RETRIES = 3;
var RETRY_DELAY_MS = 5e3;
var monitorInterval = null;
var isRunning = false;
var monitorStats = {
  lastRunAt: null,
  totalChecked: 0,
  totalResolved: 0,
  totalFailed: 0,
  totalRetried: 0,
  totalTimedOut: 0,
  errors: []
};
function monitorLog(event, data) {
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  const payload = data ? ` ${JSON.stringify(data)}` : "";
  console.log(`[TXN-MONITOR][${ts}] ${event}${payload}`);
  if (isSandbox()) {
    sandboxLog(`[MONITOR] ${event}`, data);
  }
}
function recordError(msg) {
  monitorStats.errors.push(`${(/* @__PURE__ */ new Date()).toISOString()}: ${msg}`);
  if (monitorStats.errors.length > 50) {
    monitorStats.errors = monitorStats.errors.slice(-50);
  }
}
async function creditProviderWallet2(db, providerId, amount) {
  const [wallet] = await db.select().from(providerWallets).where(eq10(providerWallets.providerId, providerId)).limit(1);
  if (!wallet) return;
  const newAvailable = parseFloat(wallet.availableBalance) + amount;
  const newTotal = parseFloat(wallet.totalEarned) + amount;
  await db.update(providerWallets).set({
    availableBalance: newAvailable.toFixed(2),
    totalEarned: newTotal.toFixed(2)
  }).where(eq10(providerWallets.providerId, providerId));
}
async function creditPlatformWallet2(db, commission) {
  const [wallet] = await db.select().from(platformWallet).limit(1);
  if (!wallet) return;
  const newAvailable = parseFloat(wallet.availableBalance) + commission;
  const newTotal = parseFloat(wallet.totalCommissionEarned) + commission;
  await db.update(platformWallet).set({
    availableBalance: newAvailable.toFixed(2),
    totalCommissionEarned: newTotal.toFixed(2)
  }).where(eq10(platformWallet.id, wallet.id));
}
async function checkPendingTransactions() {
  const db = await getDb();
  if (!db) {
    monitorLog("DB unavailable \u2014 skipping monitor run");
    return;
  }
  const cutoffTime = new Date(Date.now() - PENDING_TIMEOUT_MINUTES * 60 * 1e3);
  const pendingTxns = await db.select().from(paymentTransactions).where(
    and8(
      inArray2(paymentTransactions.status, ["processing", "pending"]),
      lt(paymentTransactions.createdAt, cutoffTime)
    )
  ).limit(50);
  if (pendingTxns.length === 0) {
    monitorLog("No stuck transactions found");
    return;
  }
  monitorLog(`Found ${pendingTxns.length} stuck transactions to check`);
  monitorStats.totalChecked += pendingTxns.length;
  for (const txn of pendingTxns) {
    if (!txn.referenceId) {
      await db.update(paymentTransactions).set({
        status: "failed",
        notes: "Transaction timed out: no MTN reference ID"
      }).where(eq10(paymentTransactions.id, txn.id));
      monitorStats.totalTimedOut++;
      monitorLog("Transaction timed out (no referenceId)", { txnId: txn.id });
      continue;
    }
    try {
      const isCollection = txn.serviceType === "garbage" || txn.serviceType === "carrier";
      let verifiedStatus = "PENDING";
      let financialTransactionId;
      if (isCollection) {
        const result = await getRequestToPayStatus(txn.referenceId);
        verifiedStatus = result.status;
        financialTransactionId = result.financialTransactionId;
      } else {
        const result = await getDisbursementStatus(txn.referenceId);
        verifiedStatus = result.status;
        financialTransactionId = result.financialTransactionId;
      }
      monitorLog("MTN status checked", {
        txnId: txn.id,
        referenceId: txn.referenceId,
        verifiedStatus,
        financialTransactionId
      });
      if (verifiedStatus === "SUCCESSFUL") {
        const providerAmount = parseFloat(txn.providerAmount);
        const commission = parseFloat(txn.platformCommission);
        await db.update(paymentTransactions).set({
          status: isCollection ? "completed" : "released",
          notes: `Resolved by monitor. Financial Txn ID: ${financialTransactionId ?? "N/A"}`
        }).where(eq10(paymentTransactions.id, txn.id));
        if (isCollection) {
          await creditProviderWallet2(db, txn.providerId, providerAmount);
          await creditPlatformWallet2(db, commission);
        }
        monitorStats.totalResolved++;
        monitorLog("Transaction resolved", { txnId: txn.id, status: verifiedStatus });
      } else if (verifiedStatus === "FAILED") {
        const retryMatch = txn.notes?.match(/Auto-retry attempt (\d+)\/(\d+)/);
        const retryCount = retryMatch ? parseInt(retryMatch[1], 10) : 0;
        if (isCollection && retryCount < MAX_RETRIES) {
          monitorLog("Auto-retrying failed collection", { txnId: txn.id, retryCount });
          await db.update(paymentTransactions).set({
            status: "processing",
            notes: `Auto-retry attempt ${retryCount + 1}/${MAX_RETRIES}`
          }).where(eq10(paymentTransactions.id, txn.id));
          monitorStats.totalRetried++;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          await db.update(paymentTransactions).set({
            status: "failed",
            notes: `Payment failed after ${retryCount} retries. MTN status: FAILED`
          }).where(eq10(paymentTransactions.id, txn.id));
          monitorStats.totalFailed++;
          monitorLog("Transaction marked failed", { txnId: txn.id, retryCount });
        }
      } else {
        const createdAt = new Date(txn.createdAt);
        const ageMinutes = (Date.now() - createdAt.getTime()) / 6e4;
        if (ageMinutes > PENDING_TIMEOUT_MINUTES) {
          await db.update(paymentTransactions).set({
            status: "failed",
            notes: `Transaction timed out after ${Math.round(ageMinutes)} minutes. MTN status: PENDING`
          }).where(eq10(paymentTransactions.id, txn.id));
          monitorStats.totalTimedOut++;
          monitorLog("Transaction timed out", { txnId: txn.id, ageMinutes: Math.round(ageMinutes) });
        } else {
          monitorLog("Transaction still pending \u2014 will check again", {
            txnId: txn.id,
            ageMinutes: Math.round(ageMinutes)
          });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      recordError(`Failed to check txn ${txn.id}: ${msg}`);
      monitorLog("Error checking transaction", { txnId: txn.id, error: msg });
    }
  }
}
function startTransactionMonitor() {
  if (monitorInterval) {
    monitorLog("Monitor already running \u2014 skipping start");
    return;
  }
  monitorLog("Transaction monitor starting", {
    pollIntervalMs: POLL_INTERVAL_MS,
    pendingTimeoutMinutes: PENDING_TIMEOUT_MINUTES,
    maxRetries: MAX_RETRIES,
    sandbox: isSandbox()
  });
  runMonitorCycle();
  monitorInterval = setInterval(runMonitorCycle, POLL_INTERVAL_MS);
}
function stopTransactionMonitor() {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
    monitorLog("Transaction monitor stopped");
  }
}
async function runMonitorCycle() {
  if (isRunning) {
    monitorLog("Monitor cycle already in progress \u2014 skipping");
    return;
  }
  isRunning = true;
  monitorStats.lastRunAt = /* @__PURE__ */ new Date();
  try {
    await checkPendingTransactions();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    recordError(`Monitor cycle error: ${msg}`);
    monitorLog("Monitor cycle error", { error: msg });
  } finally {
    isRunning = false;
  }
}

// server/webhooks/pawapay.ts
import { Router } from "express";
import crypto4 from "crypto";
import { eq as eq11, sql as sql4 } from "drizzle-orm";
init_schema();
function verifyContentDigest(rawBody, contentDigestHeader) {
  if (!contentDigestHeader) return true;
  try {
    const match = contentDigestHeader.match(/^(sha-256|sha-512)=:([^:]+):$/);
    if (!match) return false;
    const [, algorithm, expectedBase64] = match;
    const hashAlgo = algorithm === "sha-512" ? "sha512" : "sha256";
    const actualDigest = crypto4.createHash(hashAlgo).update(rawBody).digest("base64");
    return actualDigest === expectedBase64;
  } catch {
    return false;
  }
}
async function creditProviderWallet3(db, providerId, amount) {
  await db.update(providerWallets).set({ availableBalance: sql4`availableBalance + ${amount}` }).where(eq11(providerWallets.providerId, providerId));
}
async function creditPlatformWallet3(db, amount) {
  await db.update(platformWallet).set({ availableBalance: sql4`availableBalance + ${amount}` });
}
var router2 = Router();
router2.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "pawapay-webhooks",
    endpoints: {
      deposit: "POST /api/payments/pawapay/deposit",
      refund: "POST /api/payments/pawapay/refund",
      callback: "POST /api/payments/pawapay/callback"
    },
    correspondents: {
      mtn: "MTN_MOMO_ZMB",
      airtel: "AIRTEL_OAPI_ZMB",
      zamtel: "ZAMTEL_ZMB"
    },
    env: {
      hasPawapayApiKey: !!process.env.PAWAPAY_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
router2.post("/deposit", async (req, res) => {
  const startTime = Date.now();
  const payload = req.body;
  if (!payload?.depositId || !payload?.status) {
    console.warn("[PawaPay] Deposit callback: missing depositId or status. Body:", JSON.stringify(req.body));
    res.status(400).json({ error: "Invalid payload: depositId and status are required" });
    return;
  }
  const { depositId, status } = payload;
  console.log(
    `[PawaPay] Deposit callback received: depositId=${depositId} status=${status} correspondent=${payload.correspondent}`
  );
  try {
    let db = null;
    try {
      db = await getDb();
    } catch (dbErr) {
      console.error("[PawaPay] Deposit: DB connection error:", dbErr instanceof Error ? dbErr.stack : dbErr);
    }
    if (!db) {
      console.error(
        `[PawaPay] Deposit: database unavailable for depositId=${depositId}. DATABASE_URL is ${process.env.DATABASE_URL ? "set" : "NOT SET"}.`
      );
      res.status(503).json({ error: "Database unavailable \u2014 will retry" });
      return;
    }
    const transactions = await db.select().from(paymentTransactions).where(eq11(paymentTransactions.referenceId, depositId)).limit(1);
    if (transactions.length === 0) {
      console.warn(`[PawaPay] Deposit: no transaction found for depositId=${depositId}`);
      res.status(200).json({ received: true, depositId, note: "Transaction not found in local DB" });
      return;
    }
    const txn = transactions[0];
    const finalStatuses = ["completed", "released", "failed", "refunded", "cancelled"];
    if (finalStatuses.includes(txn.status)) {
      console.log(`[PawaPay] Deposit: already finalized (${txn.status}) for depositId=${depositId}`);
      res.status(200).json({ received: true, depositId, idempotent: true, status: txn.status });
      return;
    }
    if (status === "COMPLETED") {
      const providerAmount = parseFloat(txn.providerAmount ?? "0");
      const commission = parseFloat(txn.platformCommission ?? "0");
      await db.update(paymentTransactions).set({
        status: "completed",
        notes: `Payment confirmed via PawaPay. Correspondent: ${payload.correspondent}. Deposited: ${payload.depositedAmount ?? payload.requestedAmount} ${payload.currency}`,
        callbackPayload: JSON.stringify(payload)
      }).where(eq11(paymentTransactions.id, txn.id));
      await creditProviderWallet3(db, txn.providerId, providerAmount);
      await creditPlatformWallet3(db, commission);
      console.log(
        `[PawaPay] Deposit COMPLETED: depositId=${depositId} providerAmount=${providerAmount} commission=${commission} (${Date.now() - startTime}ms)`
      );
    } else if (status === "FAILED") {
      const failureMsg = payload.failureReason?.failureMessage ?? "Unknown failure";
      const failureCode = payload.failureReason?.failureCode ?? "UNKNOWN";
      await db.update(paymentTransactions).set({
        status: "failed",
        notes: `Payment failed via PawaPay. Code: ${failureCode}. Message: ${failureMsg}`,
        callbackPayload: JSON.stringify(payload)
      }).where(eq11(paymentTransactions.id, txn.id));
      console.log(`[PawaPay] Deposit FAILED: depositId=${depositId} code=${failureCode} msg=${failureMsg}`);
    }
    res.status(200).json({ received: true, depositId, status });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errStack = err instanceof Error ? err.stack : void 0;
    console.error(`[PawaPay] Deposit error for depositId=${depositId}: ${errMsg}`);
    if (errStack) console.error(errStack);
    res.status(500).json({ error: errMsg || "Internal server error" });
  }
});
router2.post("/refund", async (req, res) => {
  const startTime = Date.now();
  const payload = req.body;
  if (!payload?.refundId || !payload?.status) {
    console.warn("[PawaPay] Refund callback: missing refundId or status. Body:", JSON.stringify(req.body));
    res.status(400).json({ error: "Invalid payload: refundId and status are required" });
    return;
  }
  const { refundId, status } = payload;
  console.log(
    `[PawaPay] Refund callback received: refundId=${refundId} status=${status} correspondent=${payload.correspondent}`
  );
  try {
    let db = null;
    try {
      db = await getDb();
    } catch (dbErr) {
      console.error("[PawaPay] Refund: DB connection error:", dbErr instanceof Error ? dbErr.stack : dbErr);
    }
    if (!db) {
      console.error(
        `[PawaPay] Refund: database unavailable for refundId=${refundId}. DATABASE_URL is ${process.env.DATABASE_URL ? "set" : "NOT SET"}.`
      );
      res.status(503).json({ error: "Database unavailable \u2014 will retry" });
      return;
    }
    const transactions = await db.select().from(paymentTransactions).where(eq11(paymentTransactions.referenceId, refundId)).limit(1);
    if (transactions.length === 0) {
      console.warn(`[PawaPay] Refund: no transaction found for refundId=${refundId}`);
      res.status(200).json({ received: true, refundId, note: "Transaction not found in local DB" });
      return;
    }
    const txn = transactions[0];
    if (txn.status === "refunded" || txn.status === "failed") {
      console.log(`[PawaPay] Refund: already finalized (${txn.status}) for refundId=${refundId}`);
      res.status(200).json({ received: true, refundId, idempotent: true, status: txn.status });
      return;
    }
    if (status === "COMPLETED") {
      await db.update(paymentTransactions).set({
        status: "refunded",
        notes: `Refund confirmed via PawaPay. Correspondent: ${payload.correspondent}. Amount: ${payload.amount} ${payload.currency}`,
        callbackPayload: JSON.stringify(payload)
      }).where(eq11(paymentTransactions.id, txn.id));
      console.log(
        `[PawaPay] Refund COMPLETED: refundId=${refundId} amount=${payload.amount} ${payload.currency} (${Date.now() - startTime}ms)`
      );
    } else if (status === "FAILED") {
      const failureMsg = payload.failureReason?.failureMessage ?? "Unknown failure";
      const failureCode = payload.failureReason?.failureCode ?? "UNKNOWN";
      await db.update(paymentTransactions).set({
        status: "failed",
        notes: `Refund failed via PawaPay. Code: ${failureCode}. Message: ${failureMsg}`,
        callbackPayload: JSON.stringify(payload)
      }).where(eq11(paymentTransactions.id, txn.id));
      console.log(`[PawaPay] Refund FAILED: refundId=${refundId} code=${failureCode} msg=${failureMsg}`);
    }
    res.status(200).json({ received: true, refundId, status });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errStack = err instanceof Error ? err.stack : void 0;
    console.error(`[PawaPay] Refund error for refundId=${refundId}: ${errMsg}`);
    if (errStack) console.error(errStack);
    res.status(500).json({ error: errMsg || "Internal server error" });
  }
});
router2.post("/callback", async (req, res) => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body ?? "");
  const digestHeader = req.headers["content-digest"];
  if (digestHeader) {
    if (!verifyContentDigest(rawBody, digestHeader)) {
      console.error("[PawaPay] /callback: Content-Digest verification failed");
      res.status(401).json({ error: "Signature verification failed" });
      return;
    }
    console.log("[PawaPay] /callback: Content-Digest verified");
  }
  let payload = null;
  try {
    payload = JSON.parse(rawBody.toString("utf-8"));
  } catch {
    console.warn("[PawaPay] /callback: body is not valid JSON");
    res.status(400).json({ error: "Invalid JSON payload" });
    return;
  }
  if (!payload) {
    res.status(400).json({ error: "Empty payload" });
    return;
  }
  if ("depositId" in payload && payload.depositId) {
    const depositId = payload.depositId;
    const status = payload.status;
    console.log(`[PawaPay] /callback: deposit callback for depositId=${depositId}`);
    try {
      let db = null;
      try {
        db = await getDb();
      } catch {
      }
      if (!db) {
        res.status(503).json({ error: "Database unavailable \u2014 will retry" });
        return;
      }
      const txns = await db.select().from(paymentTransactions).where(eq11(paymentTransactions.referenceId, depositId)).limit(1);
      if (txns.length === 0) {
        res.status(200).json({ received: true, depositId, note: "Transaction not found" });
        return;
      }
      const txn = txns[0];
      if (["completed", "released", "failed", "refunded", "cancelled"].includes(txn.status)) {
        res.status(200).json({ received: true, depositId, idempotent: true });
        return;
      }
      if (status === "COMPLETED") {
        await db.update(paymentTransactions).set({ status: "completed", callbackPayload: JSON.stringify(payload) }).where(eq11(paymentTransactions.id, txn.id));
        await creditProviderWallet3(db, txn.providerId, parseFloat(txn.providerAmount ?? "0"));
        await creditPlatformWallet3(db, parseFloat(txn.platformCommission ?? "0"));
      } else if (status === "FAILED") {
        await db.update(paymentTransactions).set({ status: "failed", callbackPayload: JSON.stringify(payload) }).where(eq11(paymentTransactions.id, txn.id));
      }
      res.status(200).json({ received: true, depositId, status });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[PawaPay] /callback deposit error: ${errMsg}`, err instanceof Error ? err.stack : "");
      res.status(500).json({ error: errMsg });
    }
  } else if ("refundId" in payload && payload.refundId) {
    const refundId = payload.refundId;
    const status = payload.status;
    console.log(`[PawaPay] /callback: refund callback for refundId=${refundId}`);
    try {
      let db = null;
      try {
        db = await getDb();
      } catch {
      }
      if (!db) {
        res.status(503).json({ error: "Database unavailable \u2014 will retry" });
        return;
      }
      const txns = await db.select().from(paymentTransactions).where(eq11(paymentTransactions.referenceId, refundId)).limit(1);
      if (txns.length === 0) {
        res.status(200).json({ received: true, refundId, note: "Transaction not found" });
        return;
      }
      const txn = txns[0];
      if (txn.status === "refunded" || txn.status === "failed") {
        res.status(200).json({ received: true, refundId, idempotent: true });
        return;
      }
      if (status === "COMPLETED") {
        await db.update(paymentTransactions).set({ status: "refunded", callbackPayload: JSON.stringify(payload) }).where(eq11(paymentTransactions.id, txn.id));
      } else if (status === "FAILED") {
        await db.update(paymentTransactions).set({ status: "failed", callbackPayload: JSON.stringify(payload) }).where(eq11(paymentTransactions.id, txn.id));
      }
      res.status(200).json({ received: true, refundId, status });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[PawaPay] /callback refund error: ${errMsg}`, err instanceof Error ? err.stack : "");
      res.status(500).json({ error: errMsg });
    }
  } else {
    console.warn("[PawaPay] /callback: payload has neither depositId nor refundId:", JSON.stringify(payload));
    res.status(400).json({ error: "Cannot determine callback type: missing depositId or refundId" });
  }
});
var pawapay_default = router2;

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
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
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Digest"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });
  app.use(
    "/api/mtn/webhook",
    express.raw({ type: "*/*", limit: "10mb" })
  );
  app.use(
    "/api/payments/pawapay/callback",
    express.raw({ type: "*/*", limit: "10mb" })
  );
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.post("/api/mtn/webhook", handleMtnWebhook);
  app.use("/api/payments/pawapay", pawapay_default);
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  app.use(
    (err, _req, res, _next) => {
      console.error("[Express] Unhandled error:", err.stack ?? err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || "Internal server error" });
      }
    }
  );
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
    startTransactionMonitor();
  });
  const shutdown = () => {
    stopTransactionMonitor();
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
startServer().catch(console.error);
