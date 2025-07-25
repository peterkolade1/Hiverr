import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all creators
  app.get("/api/creators", async (req, res) => {
    try {
      const creators = await storage.getCreators();
      res.json(creators);
    } catch (error) {
      console.error("Error fetching creators:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const result = insertInquirySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: result.error.errors 
        });
      }

      const inquiry = await storage.createInquiry(result.data);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create waitlist entry
  app.post("/api/waitlist", async (req, res) => {
    try {
      const result = insertWaitlistSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: result.error.errors 
        });
      }

      const waitlistEntry = await storage.addToWaitlist(result.data);
      res.status(201).json(waitlistEntry);
    } catch (error: any) {
      console.error("Error creating waitlist entry:", error);
      
      // Handle duplicate email error
      if (error.code === '23505' && error.constraint === 'waitlist_email_unique') {
        return res.status(409).json({ 
          message: "This email is already on the waitlist",
          type: "duplicate_email"
        });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes
  app.get("/api/admin/waitlist", async (req, res) => {
    try {
      const waitlistEntries = await storage.getWaitlistEntries();
      res.json(waitlistEntries);
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
