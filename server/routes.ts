import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertWaitlistSchema, customSignupSchema, customLoginSchema, insertBriefSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated, requireAdmin, requireBrand, requireCreator, requireBrandOrCreator } from "./replitAuth";
import { toPublicUser, getCurrentUser } from "./authUtils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(toPublicUser(user));
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Social Media OAuth Routes
  app.get('/api/auth/connect/:platform', isAuthenticated, requireCreator, async (req: any, res) => {
    const { platform } = req.params;
    
    if (!['instagram', 'tiktok'].includes(platform)) {
      return res.status(400).json({ message: 'Unsupported platform' });
    }

    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Store the user ID in session for the OAuth callback
      req.session.oauthUserId = user.id;
      req.session.oauthPlatform = platform;

      let authUrl = '';
      
      if (platform === 'instagram') {
        // Instagram Basic Display API OAuth
        const clientId = process.env.INSTAGRAM_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/callback/instagram`);
        const scope = 'user_profile,user_media';
        authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      } else if (platform === 'tiktok') {
        // TikTok for Business API OAuth
        const clientKey = process.env.TIKTOK_CLIENT_KEY;
        const redirectUri = encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/callback/tiktok`);
        const scope = 'user.info.basic,video.list';
        authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}`;
      }

      res.redirect(authUrl);
    } catch (error) {
      console.error(`Error initiating ${platform} OAuth:`, error);
      res.status(500).json({ message: "Failed to initiate OAuth" });
    }
  });

  // Instagram OAuth Callback
  app.get('/api/auth/callback/instagram', async (req: any, res) => {
    const { code, error } = req.query;
    const userId = req.session.oauthUserId;

    if (error || !code || !userId) {
      return res.redirect('/dashboard?error=oauth_failed');
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID!,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          redirect_uri: `${req.protocol}://${req.get('host')}/api/auth/callback/instagram`,
          code: code as string,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        throw new Error('No access token received');
      }

      // Get user profile data
      const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,media_count&access_token=${tokenData.access_token}`);
      const profileData = await profileResponse.json();

      // Get the creator profile ID from the user ID
      const creatorProfileData = await storage.getCreatorProfile(userId);
      if (!creatorProfileData.profile) {
        throw new Error('Creator profile not found');
      }

      // Store the social account in database
      await storage.createSocialAccount({
        creatorId: creatorProfileData.profile.id,
        platform: 'instagram',
        handle: profileData.username,
        externalId: profileData.id,
        followerCount: 0, // Instagram Basic Display API doesn't provide follower count
        isVerified: false,
        metrics: {
          avgViews: 0,
          avgLikes: 0,
          avgComments: 0,
        },
      });

      // Clear session data
      delete req.session.oauthUserId;
      delete req.session.oauthPlatform;

      res.redirect('/dashboard?success=instagram_connected');
    } catch (error) {
      console.error('Instagram OAuth callback error:', error);
      res.redirect('/dashboard?error=instagram_connection_failed');
    }
  });

  // TikTok OAuth Callback
  app.get('/api/auth/callback/tiktok', async (req: any, res) => {
    const { code, error } = req.query;
    const userId = req.session.oauthUserId;

    if (error || !code || !userId) {
      return res.redirect('/dashboard?error=oauth_failed');
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_key: process.env.TIKTOK_CLIENT_KEY!,
          client_secret: process.env.TIKTOK_CLIENT_SECRET!,
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: `${req.protocol}://${req.get('host')}/api/auth/callback/tiktok`,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.data?.access_token) {
        throw new Error('No access token received');
      }

      // Get user profile data
      const profileResponse = await fetch('https://open-api.tiktok.com/user/info/', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${tokenData.data.access_token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          fields: ['open_id', 'username', 'display_name', 'follower_count', 'is_verified'],
        }),
      });

      const profileData = await profileResponse.json();
      const userInfo = profileData.data?.user;

      // Get the creator profile ID from the user ID
      const creatorProfileData = await storage.getCreatorProfile(userId);
      if (!creatorProfileData.profile) {
        throw new Error('Creator profile not found');
      }

      // Store the social account in database
      await storage.createSocialAccount({
        creatorId: creatorProfileData.profile.id,
        platform: 'tiktok',
        handle: userInfo.username || userInfo.display_name,
        externalId: userInfo.open_id,
        followerCount: userInfo.follower_count || 0,
        isVerified: userInfo.is_verified || false,
        metrics: {
          avgViews: 0,
          avgLikes: 0,
          avgComments: 0,
        },
      });

      // Clear session data
      delete req.session.oauthUserId;
      delete req.session.oauthPlatform;

      res.redirect('/dashboard?success=tiktok_connected');
    } catch (error) {
      console.error('TikTok OAuth callback error:', error);
      res.redirect('/dashboard?error=tiktok_connection_failed');
    }
  });

  // Update user role during onboarding
  app.post('/api/auth/update-role', isAuthenticated, async (req: any, res) => {
    try {
      const { role } = req.body;
      
      if (!role || !['brand', 'creator'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'brand' or 'creator'" });
      }

      const user = await getCurrentUser(req.user, storage);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user role
      const updatedUser = await storage.updateUserRole(user.id, role);
      res.json(toPublicUser(updatedUser));
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Custom signup endpoint
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const result = customSignupSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: result.error.errors 
        });
      }

      const user = await storage.createCustomUser(result.data);
      res.status(201).json({ 
        message: "Account created successfully",
        user: toPublicUser(user)
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      // Handle duplicate email error
      if (error.message === "User with this email already exists") {
        return res.status(409).json({ 
          message: "An account with this email already exists",
          type: "duplicate_email"
        });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Custom login endpoint
  app.post('/api/auth/login', async (req: any, res) => {
    try {
      const result = customLoginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: result.error.errors 
        });
      }

      const user = await storage.authenticateUser(result.data.email, result.data.password);
      if (!user) {
        return res.status(401).json({ 
          message: "Invalid email or password"
        });
      }

      // Regenerate session for security and establish login session
      req.session.regenerate((sessionErr: any) => {
        if (sessionErr) {
          console.error("Error regenerating session:", sessionErr);
          return res.status(500).json({ message: "Failed to establish session" });
        }
        
        // Now establish authenticated session with sanitized user data
        req.login(user, (loginErr: any) => {
          if (loginErr) {
            console.error("Error establishing session:", loginErr);
            return res.status(500).json({ message: "Failed to establish session" });
          }
          
          res.json({ 
            message: "Login successful",
            user: toPublicUser(user)
          });
        });
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Custom logout endpoint
  app.post('/api/auth/logout', (req: any, res) => {
    req.logout((err: any) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });
  
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

  // Creator dashboard endpoints
  app.get('/api/creator/profile', isAuthenticated, requireCreator, async (req: any, res) => {
    try {
      const userId = req.user.type === 'oidc' ? req.user.id : req.user.userId;
      const profileData = await storage.getCreatorProfile(userId);
      res.json(profileData);
    } catch (error) {
      console.error("Error fetching creator profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/creator/profile - Create creator profile
  app.post('/api/creator/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.type === 'oidc' ? req.user.id : req.user.userId;
      const { bio, niches, platforms, averageReach } = req.body;

      // Validate required fields
      if (!bio || !niches || !platforms) {
        return res.status(400).json({ message: "Bio, niches, and platforms are required" });
      }

      // Create the creator profile
      const creatorProfile = await storage.createCreatorProfile({
        userId,
        bio,
        niches,
        platforms,
        averageReach: averageReach || 0,
      });

      // Update user role to 'creator' if not already set
      const user = await storage.getUser(userId);
      if (user && user.role !== 'creator') {
        await storage.updateUserRole(userId, 'creator');
      }

      res.status(201).json({
        message: "Creator profile created successfully",
        profile: creatorProfile
      });
    } catch (error) {
      console.error("Error creating creator profile:", error);
      res.status(500).json({ message: "Failed to create creator profile" });
    }
  });

  // POST /api/brand/profile - Create brand profile
  app.post('/api/brand/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.type === 'oidc' ? req.user.id : req.user.userId;
      const { companyName, website, phone, referralSource } = req.body;

      // Validate required fields
      if (!companyName || !website) {
        return res.status(400).json({ message: "Company name and website are required" });
      }

      // Create or update the brand profile
      const brandProfile = await storage.createBrandProfile({
        userId,
        companyName,
        website,
        phone: phone || null,
        referralSource: referralSource || null,
      });

      // Update user role to 'brand' if not already set
      const user = await storage.getUser(userId);
      if (user && user.role !== 'brand') {
        await storage.updateUserRole(userId, 'brand');
      }

      res.status(201).json({
        message: "Brand profile created successfully",
        profile: brandProfile
      });
    } catch (error) {
      console.error("Error creating brand profile:", error);
      res.status(500).json({ message: "Failed to create brand profile" });
    }
  });

  app.get('/api/creator/dashboard', isAuthenticated, requireCreator, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Get the creator profile - handle gracefully if not found
      let profileData;
      try {
        profileData = await storage.getCreatorProfile(user.id);
      } catch (error: any) {
        // If user doesn't exist, return error
        if (error?.message === "User not found") {
          return res.status(404).json({ message: "User not found" });
        }
        throw error; // Re-throw other errors
      }
      
      // If no creator profile exists, return profile data with empty stats
      if (!profileData.profile) {
        return res.json({
          profile: profileData, // This will have user data but null profile
          stats: {
            totalApplications: 0,
            activeAssignments: 0,
            completedCampaigns: 0,
            totalEarnings: 0,
            recommendationCount: 0,
          },
          campaigns: [],
          applications: [],
          assignments: [],
        });
      }

      // If creator profile exists, get full dashboard data
      const stats = await storage.getCreatorDashboardStats(profileData.profile.id);
      const campaigns = await storage.getCreatorCampaigns(profileData.profile.id, 'active');
      const applications = await storage.getCreatorApplications(profileData.profile.id);
      const assignments = await storage.getCreatorAssignments(profileData.profile.id);

      res.json({
        profile: profileData,
        stats,
        campaigns,
        applications,
        assignments,
      });
    } catch (error) {
      console.error("Error fetching creator dashboard:", error);
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

      // Convert undefined to null for storage compatibility
      const inquiryData = {
        ...result.data,
        company: result.data.company || null,
      };
      const inquiry = await storage.createInquiry(inquiryData);
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

      // Convert undefined to null for storage compatibility
      const waitlistData = {
        ...result.data,
        interest: result.data.interest || null,
        companyName: result.data.companyName || null,
        role: result.data.role || null,
        creatorPreference: result.data.creatorPreference || null,
        budget: result.data.budget || null,
        campaignTiming: result.data.campaignTiming || null,
        campaignReady: result.data.campaignReady || null,
        companyWebsite: result.data.companyWebsite || null,
        companyHandle: result.data.companyHandle || null,
        brandLogo: result.data.brandLogo || null,
        niches: result.data.niches || null,
        selectedPlatforms: result.data.selectedPlatforms || null,
        profilePicture: result.data.profilePicture || null,
        instagram: result.data.instagram || null,
        instagramFollowers: result.data.instagramFollowers || null,
        instagramImage: result.data.instagramImage || null,
        tiktok: result.data.tiktok || null,
        tiktokFollowers: result.data.tiktokFollowers || null,
        tiktokImage: result.data.tiktokImage || null,
        youtube: result.data.youtube || null,
        youtubeSubs: result.data.youtubeSubs || null,
        youtubeImage: result.data.youtubeImage || null,
        twitter: result.data.twitter || null,
        twitterImage: result.data.twitterImage || null,
        facebook: result.data.facebook || null,
        facebookImage: result.data.facebookImage || null,
        location: result.data.location || null,
        languages: result.data.languages || null,
        aiContent: result.data.aiContent || null,
        rateRange: result.data.rateRange || null,
        portfolio: result.data.portfolio || null,
      };
      const waitlistEntry = await storage.addToWaitlist(waitlistData);
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

  // Admin routes (protected by role-based access control)
  app.get("/api/admin/waitlist", requireAdmin, async (req, res) => {
    try {
      const waitlistEntries = await storage.getWaitlistEntries();
      res.json(waitlistEntries);
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Brief routes (brand-only)
  
  // Create a new brief
  app.post("/api/briefs", isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Get brand profile for the user
      const brandProfile = await storage.getBrandProfile(user.id);
      if (!brandProfile) {
        return res.status(400).json({ message: "Brand profile not found. Please complete onboarding first." });
      }

      const result = insertBriefSchema.safeParse({
        ...req.body,
        userId: user.id,
        brandId: brandProfile.id,
      });

      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: result.error.errors 
        });
      }

      const brief = await storage.createBrief(result.data);
      res.status(201).json(brief);
    } catch (error) {
      console.error("Error creating brief:", error);
      res.status(500).json({ message: "Failed to create brief" });
    }
  });

  // Get all briefs for the current brand user
  app.get("/api/briefs", isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const briefs = await storage.getBriefsByUserId(user.id);
      res.json(briefs);
    } catch (error) {
      console.error("Error fetching briefs:", error);
      res.status(500).json({ message: "Failed to fetch briefs" });
    }
  });

  // Get brief counts for the current brand user
  app.get("/api/briefs/counts", isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const counts = await storage.getBriefCounts(user.id);
      res.json(counts);
    } catch (error) {
      console.error("Error fetching brief counts:", error);
      res.status(500).json({ message: "Failed to fetch brief counts" });
    }
  });

  // Get a specific brief by ID
  app.get("/api/briefs/:id", isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const briefId = parseInt(req.params.id);
      if (isNaN(briefId)) {
        return res.status(400).json({ message: "Invalid brief ID" });
      }

      const brief = await storage.getBriefById(briefId);
      if (!brief) {
        return res.status(404).json({ message: "Brief not found" });
      }

      // Ensure the brief belongs to the current user
      if (brief.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(brief);
    } catch (error) {
      console.error("Error fetching brief:", error);
      res.status(500).json({ message: "Failed to fetch brief" });
    }
  });

  // Update brief status (state machine transitions)
  app.patch("/api/briefs/:id/status", isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const briefId = parseInt(req.params.id);
      if (isNaN(briefId)) {
        return res.status(400).json({ message: "Invalid brief ID" });
      }

      const { status } = req.body;
      if (!status || !['draft', 'active', 'paused', 'closed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be draft, active, paused, or closed." });
      }

      const brief = await storage.getBriefById(briefId);
      if (!brief) {
        return res.status(404).json({ message: "Brief not found" });
      }

      if (brief.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // State machine validation
      const allowedTransitions: Record<string, string[]> = {
        'draft': ['active'], // Can only publish from draft
        'active': ['paused', 'closed'], // Can pause or close from active
        'paused': ['active', 'closed'], // Can resume or close from paused
        'closed': [], // No transitions from closed
      };

      if (!allowedTransitions[brief.status]?.includes(status)) {
        return res.status(400).json({ 
          message: `Cannot transition from ${brief.status} to ${status}`,
          currentStatus: brief.status,
          allowedTransitions: allowedTransitions[brief.status]
        });
      }

      const updatedBrief = await storage.updateBriefStatus(briefId, status);
      res.json(updatedBrief);
    } catch (error) {
      console.error("Error updating brief status:", error);
      res.status(500).json({ message: "Failed to update brief status" });
    }
  });

  // Update brief data
  app.patch("/api/briefs/:id", isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const briefId = parseInt(req.params.id);
      if (isNaN(briefId)) {
        return res.status(400).json({ message: "Invalid brief ID" });
      }

      const brief = await storage.getBriefById(briefId);
      if (!brief) {
        return res.status(404).json({ message: "Brief not found" });
      }

      if (brief.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Only allow editing draft briefs
      if (brief.status !== 'draft') {
        return res.status(400).json({ message: "Can only edit briefs in draft status" });
      }

      const updatedBrief = await storage.updateBrief(briefId, req.body);
      res.json(updatedBrief);
    } catch (error) {
      console.error("Error updating brief:", error);
      res.status(500).json({ message: "Failed to update brief" });
    }
  });

  // Delete a brief (only drafts with no proposals)
  app.delete("/api/briefs/:id", isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const briefId = parseInt(req.params.id);
      if (isNaN(briefId)) {
        return res.status(400).json({ message: "Invalid brief ID" });
      }

      const brief = await storage.getBriefById(briefId);
      if (!brief) {
        return res.status(404).json({ message: "Brief not found" });
      }

      if (brief.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Only allow deleting drafts with no proposals
      if (brief.status !== 'draft') {
        return res.status(400).json({ message: "Can only delete briefs in draft status" });
      }

      if ((brief.proposalCount || 0) > 0) {
        return res.status(400).json({ message: "Cannot delete brief with existing proposals" });
      }

      await storage.deleteBrief(briefId);
      res.json({ message: "Brief deleted successfully" });
    } catch (error) {
      console.error("Error deleting brief:", error);
      res.status(500).json({ message: "Failed to delete brief" });
    }
  });

  // Feedback endpoints
  app.post("/api/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { rating, category, note } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      const feedback = await storage.createFeedback({
        userId: user.id,
        rating,
        category: category || null,
        note: note || null,
      });
      
      res.status(201).json(feedback);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  app.get("/api/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const feedback = await storage.getFeedbackByUserId(user.id);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Onboarding progress endpoints
  app.get("/api/onboarding/progress", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Initialize onboarding tasks if not already done
      const progress = await storage.initializeOnboardingTasks(user.id);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching onboarding progress:", error);
      res.status(500).json({ message: "Failed to fetch onboarding progress" });
    }
  });

  app.patch("/api/onboarding/progress/:taskKey", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.user, storage);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { taskKey } = req.params;
      const { completed } = req.body;

      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: "completed must be a boolean" });
      }

      const progress = await storage.updateOnboardingTask(user.id, taskKey, completed);
      res.json(progress);
    } catch (error) {
      console.error("Error updating onboarding progress:", error);
      res.status(500).json({ message: "Failed to update onboarding progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
