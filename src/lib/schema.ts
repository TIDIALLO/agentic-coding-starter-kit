import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  role: text("role", { enum: ["admin", "agent", "visitor"] })
    .notNull()
    .default("visitor"),
  phone: text("phone"),
  credits: integer("credits").notNull().default(3),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const property = pgTable("property", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  address: text("address").notNull(),
  type: text("type", { enum: ["rent", "sale"] }).notNull(),
  surfaceArea: integer("surface_area").notNull(),
  rooms: integer("rooms").notNull(),
  agentId: text("agent_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["available", "reserved", "sold", "rented"] })
    .notNull()
    .default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyImage = pgTable("property_image", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  originalUrl: text("original_url").notNull(),
  enhancedUrl: text("enhanced_url"),
  isEnhanced: boolean("is_enhanced").notNull().default(false),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const prospect = pgTable("prospect", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status", { enum: ["new", "contacted", "interested", "closed"] })
    .notNull()
    .default("new"),
  notes: text("notes"),
  agentId: text("agent_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const visit = pgTable("visit", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  prospectId: uuid("prospect_id")
    .notNull()
    .references(() => prospect.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  scheduledDate: timestamp("scheduled_date").notNull(),
  status: text("status", {
    enum: ["scheduled", "completed", "cancelled", "no_show"],
  })
    .notNull()
    .default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contract = pgTable("contract", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  prospectId: uuid("prospect_id")
    .notNull()
    .references(() => prospect.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["rental", "sale"] }).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  pdfUrl: text("pdf_url"),
  status: text("status", { enum: ["draft", "signed", "cancelled"] })
    .notNull()
    .default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Track credit movements (grants, spends, refunds)
export const credits = pgTable("credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // positive = grant/refund, negative = spend
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Social media integrations
export const socialAccount = pgTable("social_account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  platform: text("platform", {
    enum: ["facebook", "instagram", "linkedin", "x", "tiktok"],
  }).notNull(),
  handle: text("handle"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialPost = pgTable("social_post", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  contentText: text("content_text").notNull(),
  mediaUrl: text("media_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const socialSchedule = pgTable("social_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => socialPost.id, { onDelete: "cascade" }),
  platform: text("platform", {
    enum: ["facebook", "instagram", "linkedin", "x", "tiktok"],
  }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status", {
    enum: ["scheduled", "published", "failed"],
  })
    .notNull()
    .default("scheduled"),
  publishResult: text("publish_result"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialLog = pgTable("social_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  scheduleId: uuid("schedule_id")
    .notNull()
    .references(() => socialSchedule.id, { onDelete: "cascade" }),
  level: text("level", { enum: ["info", "error"] })
    .notNull()
    .default("info"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payments
export const payment = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  provider: text("provider").notNull().default("bictorys"),
  externalId: text("external_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("XOF"),
  status: text("status", { enum: ["created", "succeeded", "failed"] })
    .notNull()
    .default("created"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
