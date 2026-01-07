import { pgTable, text, varchar, serial, integer, boolean, timestamp, json, decimal, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Core user system (safe approach - keep serial ID, add externalId for Replit Auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Keep existing serial ID type
  externalId: varchar("external_id").unique(), // Replit Auth sub mapping (nullable for custom signup)
  email: varchar("email").unique(),
  password: varchar("password"), // For custom email/password signup (nullable for OAuth users)
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").notNull(), // 'brand' | 'creator' | 'admin'
  displayName: text("display_name"), // Keep for compatibility
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Brand profiles
export const brandProfiles = pgTable("brand_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // Keep integer FK
  companyName: text("company_name").notNull(),
  website: text("website"),
  handle: text("handle"),
  description: text("description"),
  industry: text("industry"),
  size: text("size"), // 'startup' | 'small' | 'medium' | 'enterprise'
  createdAt: timestamp("created_at").defaultNow(),
});

// Creator profiles
export const creatorProfiles = pgTable("creator_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // Keep integer FK
  location: text("location"),
  bio: text("bio"),
  niches: json("niches").$type<string[]>().default([]),
  platforms: json("platforms").$type<string[]>().default([]),
  languages: json("languages").$type<string[]>().default([]),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  averageReach: integer("average_reach"),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }),
  contentQualityScore: decimal("content_quality_score", { precision: 3, scale: 1 }),
  hiveScore: decimal("hive_score", { precision: 5, scale: 2 }),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Social media accounts
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull().references(() => creatorProfiles.id),
  platform: text("platform").notNull(), // 'instagram' | 'tiktok' | 'youtube' | 'twitter'
  handle: text("handle").notNull(),
  externalId: text("external_id"),
  followerCount: integer("follower_count"),
  isVerified: boolean("is_verified").default(false),
  metrics: json("metrics").$type<{
    avgViews?: number;
    avgLikes?: number;
    avgComments?: number;
    avgShares?: number;
    audienceDemographics?: any;
  }>(),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Campaigns (updated structure)
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull().references(() => brandProfiles.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  briefDescription: text("brief_description"), // Short summary for cards
  platforms: json("platforms").$type<string[]>().notNull(),
  category: text("category").notNull(),
  deliverables: json("deliverables").$type<{
    type: string; // 'post' | 'story' | 'reel' | 'video'
    quantity: number;
    requirements?: string;
  }[]>().notNull(),
  baseFeeFormula: text("base_fee_formula").notNull(), // 'nano' | 'micro' | 'mid' | 'macro'
  bonusPool: integer("bonus_pool").notNull(), // in cents
  kpiMetric: text("kpi_metric").notNull(), // 'views' | 'engagement' | 'conversions'
  kpiTarget: integer("kpi_target").notNull(),
  targetAudience: json("target_audience").$type<{
    ageRange?: string;
    gender?: string;
    location?: string[];
    interests?: string[];
  }>(),
  requirements: text("requirements"),
  budget: integer("budget").notNull(), // Total budget in cents (base fees + bonus pool)
  status: text("status").notNull().default('draft'), // 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  applicationDeadline: timestamp("application_deadline"),
  deliveryDeadline: timestamp("delivery_deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  creatorId: integer("creator_id").notNull().references(() => creatorProfiles.id),
  hiveMatchScore: decimal("hive_match_score", { precision: 5, scale: 2 }).notNull(),
  estimatedBaseFee: integer("estimated_base_fee"), // in cents
  reasoningFactors: json("reasoning_factors").$type<{
    categoryMatch: number;
    platformOverlap: number;
    followerProximity: number;
    engagementBucket: number;
  }>(),
  isViewed: boolean("is_viewed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Applications
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  creatorId: integer("creator_id").notNull().references(() => creatorProfiles.id),
  status: text("status").notNull().default('applied'), // 'applied' | 'accepted' | 'rejected' | 'withdrawn'
  proposedFee: integer("proposed_fee"), // Creator's proposed fee in cents
  coverLetter: text("cover_letter"),
  portfolioSamples: json("portfolio_samples").$type<string[]>().default([]),
  notes: text("notes"), // Internal brand notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign assignments (accepted applications)
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  creatorId: integer("creator_id").notNull().references(() => creatorProfiles.id),
  applicationId: integer("application_id").notNull().references(() => applications.id),
  agreedBaseFee: integer("agreed_base_fee").notNull(), // in cents
  bonusEligible: boolean("bonus_eligible").default(true),
  status: text("status").notNull().default('active'), // 'active' | 'completed' | 'cancelled'
  deliveryDeadline: timestamp("delivery_deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Deliverables
export const deliverables = pgTable("deliverables", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  type: text("type").notNull(), // 'post' | 'story' | 'reel' | 'video'
  url: text("url").notNull(), // Link to the content
  description: text("description"),
  attachments: json("attachments").$type<string[]>().default([]), // Screenshots/files
  isApproved: boolean("is_approved").default(false),
  approvedAt: timestamp("approved_at"),
  feedback: text("feedback"), // Brand feedback
  submittedAt: timestamp("submitted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  userType: text("user_type").notNull(), // 'brand' or 'creator'
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet system
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  ownerType: text("owner_type").notNull(), // 'brand' | 'creator'
  ownerId: integer("owner_id").notNull(), // References brand_profiles.id or creator_profiles.id
  stripeAccountId: text("stripe_account_id"), // Stripe Connect account ID
  availableBalance: integer("available_balance").default(0), // in cents
  pendingBalance: integer("pending_balance").default(0), // in cents
  lifetimeEarnings: integer("lifetime_earnings").default(0), // in cents
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  type: text("type").notNull(), // 'charge' | 'transfer' | 'bonus' | 'refund' | 'withdrawal'
  amount: integer("amount").notNull(), // in cents (positive for credits, negative for debits)
  description: text("description").notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  assignmentId: integer("assignment_id").references(() => assignments.id),
  stripeReference: text("stripe_reference"), // Stripe transaction ID
  status: text("status").notNull().default('pending'), // 'pending' | 'completed' | 'failed' | 'cancelled'
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payouts
export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  creatorWalletId: integer("creator_wallet_id").notNull().references(() => wallets.id),
  amount: integer("amount").notNull(), // in cents
  stripePayoutId: text("stripe_payout_id"),
  scheduledFor: timestamp("scheduled_for"),
  status: text("status").notNull().default('pending'), // 'pending' | 'in_transit' | 'paid' | 'failed' | 'cancelled'
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Metrics snapshots for bonus calculation
export const metricsSnapshots = pgTable("metrics_snapshots", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  deliverableId: integer("deliverable_id").references(() => deliverables.id),
  capturedAt: timestamp("captured_at").notNull(),
  metrics: json("metrics").$type<{
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    clickthroughs?: number;
    conversions?: number;
  }>().notNull(),
  source: text("source").notNull(), // 'api' | 'manual' | 'screenshot'
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address").refine((email) => {
    return email.includes('@') && email.includes('.') && email.length > 5;
  }, "Please enter a valid email address").optional(),
  role: z.enum(["brand", "creator", "admin"]),
});

// Replit Auth user upsert schema (uses externalId for mapping)
export const upsertUserSchema = createInsertSchema(users).omit({
  id: true, // Auto-generated serial
  role: true, // Set by application, not auth
  isVerified: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  externalId: z.string(), // Required: Replit Auth sub
  email: z.string().email().optional(),
});

// Custom signup schema for email/password users
export const customSignupSchema = createInsertSchema(users).omit({
  id: true, // Auto-generated serial
  externalId: true, // OAuth only
  profileImageUrl: true, // Not used in custom signup
  displayName: true, // Not used in custom signup
  isVerified: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["brand", "creator"], {
    required_error: "Please select an account type",
  }),
});

// Custom login schema
export const customLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertBrandProfileSchema = createInsertSchema(brandProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertCreatorProfileSchema = createInsertSchema(creatorProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
  lastSyncAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  bonusPool: z.number().min(0, "Bonus pool must be positive"),
  kpiTarget: z.number().min(1, "KPI target must be positive"),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeliverableSchema = createInsertSchema(deliverables).omit({
  id: true,
  createdAt: true,
  submittedAt: true,
  approvedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type CustomSignupUser = z.infer<typeof customSignupSchema>;
export type CustomLoginUser = z.infer<typeof customLoginSchema>;
export type BrandProfile = typeof brandProfiles.$inferSelect;
export type InsertBrandProfile = z.infer<typeof insertBrandProfileSchema>;
export type CreatorProfile = typeof creatorProfiles.$inferSelect;
export type InsertCreatorProfile = z.infer<typeof insertCreatorProfileSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Deliverable = typeof deliverables.$inferSelect;
export type InsertDeliverable = z.infer<typeof insertDeliverableSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Payout = typeof payouts.$inferSelect;
export type MetricsSnapshot = typeof metricsSnapshots.$inferSelect;

// Briefs table for brand campaign briefs
export const briefs = pgTable("briefs", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull().references(() => brandProfiles.id),
  userId: integer("user_id").notNull().references(() => users.id),
  
  // Step 1: Project Overview
  title: text("title").notNull(),
  projectDescription: text("project_description"),
  targetPlatforms: json("target_platforms").$type<string[]>().default([]),
  contentType: text("content_type"), // 'ugc' | 'sponsored' | 'review' | etc
  brandAssets: json("brand_assets").$type<{ name: string; size: number; preview: string }[]>().default([]),
  
  // Step 2: Inspiration
  inspirationLinks: json("inspiration_links").$type<{ link: string; description: string }[]>().default([]),
  
  // Step 3: Brief Details
  deliverables: text("deliverables"),
  timeline: text("timeline"),
  budget: integer("budget"), // in cents
  targetAudience: text("target_audience"),
  requirements: text("requirements"),
  notes: text("notes"),
  
  // Lifecycle state machine
  status: text("status").notNull().default('draft'), // 'draft' | 'active' | 'paused' | 'closed'
  
  // Thumbnail for card display
  thumbnailUrl: text("thumbnail_url"),
  
  // Stats counters (denormalized for performance)
  proposalCount: integer("proposal_count").default(0),
  acceptedCount: integer("accepted_count").default(0),
  declinedCount: integer("declined_count").default(0),
  pendingCount: integer("pending_count").default(0),
  totalSpend: integer("total_spend").default(0), // in cents
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  closedAt: timestamp("closed_at"),
});

export const insertBriefSchema = createInsertSchema(briefs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  closedAt: true,
  proposalCount: true,
  acceptedCount: true,
  declinedCount: true,
  pendingCount: true,
  totalSpend: true,
});

export type Brief = typeof briefs.$inferSelect;
export type InsertBrief = z.infer<typeof insertBriefSchema>;

// Legacy creator/campaign tables for backward compatibility (will be deprecated)
export const legacyCreators = pgTable("legacy_creators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  platforms: json("platforms").$type<string[]>().notNull(),
  followerCount: integer("follower_count").notNull(),
  engagementRate: text("engagement_rate").notNull(),
});

export const legacyCampaigns = pgTable("legacy_campaigns", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  budget: integer("budget").notNull(),
  platform: text("platform").notNull(),
  category: text("category").notNull(),
  metrics: json("metrics").$type<{
    engagement?: string;
    reach?: string;
    conversions?: string;
    downloads?: string;
  }>().notNull(),
  testimonial: text("testimonial"),
  clientName: text("client_name"),
  clientTitle: text("client_title"),
  campaignImage: text("campaign_image").notNull(),
  rating: integer("rating").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow(),
});

// Waitlist table for AI feature signups
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  interest: varchar("interest", { length: 50 }),
  
  // Brand-specific fields
  companyName: varchar("company_name", { length: 255 }),
  role: varchar("role", { length: 100 }),
  creatorPreference: varchar("creator_preference", { length: 100 }),
  budget: varchar("budget", { length: 100 }),
  campaignTiming: varchar("campaign_timing", { length: 100 }),
  campaignReady: varchar("campaign_ready", { length: 50 }),
  companyWebsite: varchar("company_website", { length: 255 }),
  companyHandle: varchar("company_handle", { length: 100 }),
  brandLogo: text("brand_logo"),
  
  // Creator-specific fields
  niches: text("niches"), // JSON string array
  selectedPlatforms: text("selected_platforms"), // JSON string array
  profilePicture: text("profile_picture"),
  
  // Social media platforms
  instagram: varchar("instagram", { length: 255 }),
  instagramFollowers: varchar("instagram_followers", { length: 50 }),
  instagramImage: text("instagram_image"), // Analytics screenshot
  tiktok: varchar("tiktok", { length: 255 }),
  tiktokFollowers: varchar("tiktok_followers", { length: 50 }),
  tiktokImage: text("tiktok_image"), // Analytics screenshot
  youtube: varchar("youtube", { length: 255 }),
  youtubeSubs: varchar("youtube_subs", { length: 50 }),
  youtubeImage: text("youtube_image"), // Analytics screenshot
  twitter: varchar("twitter", { length: 255 }),
  twitterImage: text("twitter_image"), // Analytics screenshot
  facebook: varchar("facebook", { length: 255 }),
  facebookImage: text("facebook_image"), // Analytics screenshot
  
  // Additional creator fields
  location: varchar("location", { length: 255 }),
  languages: text("languages"), // JSON string array
  aiContent: boolean("ai_content"),
  rateRange: varchar("rate_range", { length: 100 }),
  portfolio: text("portfolio"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  createdAt: true,
});

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
