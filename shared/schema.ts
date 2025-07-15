import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const creators = pgTable("creators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio").notNull(),
  location: text("location").notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  category: text("category").notNull(),
  platforms: json("platforms").$type<string[]>().notNull(),
  followerCount: integer("follower_count").notNull(),
  engagementRate: text("engagement_rate").notNull(),
  profileImage: text("profile_image").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  isVerified: boolean("is_verified").notNull().default(false),
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
  isVerified: true,
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
