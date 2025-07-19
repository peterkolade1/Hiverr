import { pgTable, text, varchar, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const creators = pgTable("creators", {
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

export const campaigns = pgTable("campaigns", {
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

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  userType: text("user_type").notNull(), // 'brand' or 'creator'
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCreatorSchema = createInsertSchema(creators).omit({
  id: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export type Creator = typeof creators.$inferSelect;
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

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
