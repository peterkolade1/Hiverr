import { db } from "./db";
import { 
  inquiries, users, waitlist, creatorProfiles, brandProfiles, socialAccounts, campaigns, applications, assignments, deliverables, briefs,
  feedbackSubmissions, onboardingProgress,
  type Inquiry, type User, type UpsertUser, type Waitlist, type CustomSignupUser, type CustomLoginUser,
  type CreatorProfile, type BrandProfile, type SocialAccount, type Campaign, type Application, type Assignment, type Brief, type InsertBrief,
  type FeedbackSubmission, type InsertFeedback, type OnboardingProgress, type InsertOnboardingProgress
} from "@shared/schema";
import { eq, and, count, sum, desc } from "drizzle-orm";
import bcrypt from "bcrypt";
import { normalizeEmail } from "./authUtils";

// Local types for legacy data (kept in-memory)
interface LegacyCreator {
  id: number;
  name: string;
  email: string;
  bio: string;
  location: string;
  category: string;
  platforms: string[];
  followerCount: number;
  engagementRate: string;
}

interface LegacyCampaign {
  id: number;
  title: string;
  description: string;
  budget: number;
  timeline: string;
  requiresVideo: boolean;
  targetAudience: string;
  platforms: string[];
  successMetrics: {
    views: number;
    engagement: string;
    conversions: number;
  };
}

interface LocalWaitlist {
  id: number;
  name: string;
  email: string;
  interest?: string;
  companyName?: string;
  role?: string;
  creatorPreference?: string;
  budget?: string;
  campaignTiming?: string;
  campaignReady?: string;
  companyWebsite?: string;
  companyHandle?: string;
  niches?: string;
  selectedPlatforms?: string;
  location?: string;
  languages?: string;
  aiContent?: boolean;
  rateRange?: string;
  createdAt: Date;
}

export interface IStorage {
  // Creator operations (legacy, in-memory)
  getCreators(): Promise<LegacyCreator[]>;
  getCreator(id: number): Promise<LegacyCreator | undefined>;
  
  // Campaign operations (legacy, in-memory)
  getCampaigns(): Promise<LegacyCampaign[]>;
  getCampaign(id: number): Promise<LegacyCampaign | undefined>;
  
  // User operations (required for Replit Auth)
  getUser(id: number): Promise<User | undefined>;
  getUserByExternalId(externalId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(userData: UpsertUser): Promise<User>;
  updateUserRole(id: number, role: string): Promise<User>;
  
  // Custom auth operations (email/password)
  createCustomUser(userData: CustomSignupUser): Promise<User>;
  authenticateUser(email: string, password: string): Promise<User | null>;
  
  // Creator dashboard operations (database-backed)
  getCreatorProfile(userId: number): Promise<{
    user: User;
    profile: CreatorProfile | null;
    socialAccounts: SocialAccount[];
  }>;
  getCreatorDashboardStats(creatorId: number): Promise<{
    totalApplications: number;
    activeAssignments: number;
    completedCampaigns: number;
    totalEarnings: number;
    recommendationCount: number;
  }>;
  getCreatorCampaigns(creatorId: number, status?: string): Promise<Campaign[]>;
  getCreatorApplications(creatorId: number): Promise<Application[]>;
  getCreatorAssignments(creatorId: number): Promise<Assignment[]>;
  
  // Profile creation operations
  createCreatorProfile(profileData: { userId: number; bio: string; niches: string[]; platforms: string[]; averageReach?: number }): Promise<CreatorProfile>;
  createBrandProfile(profileData: { userId: number; companyName: string; website?: string | null; phone?: string | null; referralSource?: string | null }): Promise<BrandProfile>;
  getBrandProfile(userId: number): Promise<BrandProfile | null>;
  
  // Social account operations
  createSocialAccount(accountData: Omit<SocialAccount, "id" | "createdAt" | "lastSyncAt">): Promise<SocialAccount>;
  
  // Inquiry operations (database-backed)
  createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt">): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  
  // Waitlist operations (database-backed)
  addToWaitlist(entry: Omit<Waitlist, "id" | "createdAt">): Promise<Waitlist>;
  getWaitlistEntries(): Promise<Waitlist[]>;
  
  // Brief operations (database-backed)
  createBrief(briefData: InsertBrief): Promise<Brief>;
  getBriefsByUserId(userId: number): Promise<Brief[]>;
  getBriefById(id: number): Promise<Brief | undefined>;
  updateBriefStatus(id: number, status: string): Promise<Brief>;
  updateBrief(id: number, data: Partial<Brief>): Promise<Brief>;
  deleteBrief(id: number): Promise<void>;
  getBriefCounts(userId: number): Promise<{ all: number; draft: number; active: number; paused: number; closed: number }>;
  
  // Feedback operations
  createFeedback(feedbackData: InsertFeedback): Promise<FeedbackSubmission>;
  getFeedbackByUserId(userId: number): Promise<FeedbackSubmission[]>;
  
  // Onboarding progress operations
  getOnboardingProgress(userId: number): Promise<OnboardingProgress[]>;
  updateOnboardingTask(userId: number, taskKey: string, completed: boolean): Promise<OnboardingProgress>;
  initializeOnboardingTasks(userId: number): Promise<OnboardingProgress[]>;
}

export class MemStorage implements IStorage {
  private creators: Map<number, LegacyCreator>;
  private campaigns: Map<number, LegacyCampaign>;
  private inquiries: Map<number, Inquiry>;
  private users: Map<number, User>;
  private waitlistEntries: Map<number, Waitlist>;
  private currentCreatorId: number;
  private currentCampaignId: number;
  private currentInquiryId: number;
  private currentUserId: number;
  private currentWaitlistId: number;

  constructor() {
    this.creators = new Map();
    this.campaigns = new Map();
    this.inquiries = new Map();
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.currentCreatorId = 1;
    this.currentCampaignId = 1;
    this.currentInquiryId = 1;
    this.currentUserId = 1;
    this.currentWaitlistId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // One creator per category for clean filter display
    const sampleCreators = [
      {
        name: "Emma Rodriguez",
        email: "emma@example.com",
        bio: "Fashion & lifestyle content creator specializing in authentic brand storytelling and aesthetic flat-lay photography.",
        location: "Los Angeles",
        category: "Fashion & Lifestyle",
        platforms: ["Instagram", "TikTok"],
        followerCount: 1200000,
        engagementRate: "95%",
      },
      {
        name: "Marcus Thompson",
        email: "marcus@example.com",
        bio: "Tech content creator specializing in authentic product reviews and app demonstrations for mobile and web platforms.",
        location: "San Francisco",
        category: "Technology",
        platforms: ["TikTok", "YouTube"],
        followerCount: 850000,
        engagementRate: "88%",
      },
      {
        name: "Sophia Martinez",
        email: "sophia@example.com",
        bio: "Fitness & wellness creator focused on authentic workout content and health product reviews.",
        location: "Miami",
        category: "Fitness & Health",
        platforms: ["YouTube", "Instagram"],
        followerCount: 850000,
        engagementRate: "92%",
      },
      {
        name: "Isabella Beauty",
        email: "isabella@example.com",
        bio: "Beauty & skincare expert creating authentic product reviews and makeup tutorials.",
        location: "New York",
        category: "Beauty & Skincare",
        platforms: ["Instagram", "YouTube"],
        followerCount: 950000,
        engagementRate: "91%",
      },
      {
        name: "Chef Maria",
        email: "maria@example.com",
        bio: "Professional chef sharing authentic cooking tutorials and recipe development content.",
        location: "Chicago",
        category: "Food & Cooking",
        platforms: ["YouTube", "Instagram"],
        followerCount: 720000,
        engagementRate: "89%",
      },
      {
        name: "Jake Music",
        email: "jake@example.com",
        bio: "Music producer and audio content creator specializing in music reviews and production tutorials.",
        location: "Nashville",
        category: "Music & Audio",
        platforms: ["YouTube", "Spotify"],
        followerCount: 650000,
        engagementRate: "87%",
      },
      {
        name: "Travel Sam",
        email: "sam@example.com",
        bio: "Adventure traveler documenting authentic destination experiences and travel gear reviews.",
        location: "Austin",
        category: "Travel",
        platforms: ["Instagram", "YouTube"],
        followerCount: 880000,
        engagementRate: "86%",
      },

    ];

    // Store all creators
    const allCreators = sampleCreators;

    allCreators.forEach((creator) => {
      this.creators.set(this.currentCreatorId, { ...creator, id: this.currentCreatorId });
      this.currentCreatorId++;
    });

    // Sample campaigns
    const sampleCampaigns = [
      {
        title: "Tech Product Launch",
        description: "Innovative tech startup needs authentic product reviews and unboxing content",
        budget: 50000,
        timeline: "2 weeks",
        requiresVideo: true,
        targetAudience: "Tech-savvy millennials",
        platforms: ["YouTube", "TikTok"],
        successMetrics: {
          views: 2500000,
          engagement: "94%",
          conversions: 15000,
        },
      },
      {
        title: "Fitness Brand Campaign",
        description: "Premium fitness equipment brand seeking authentic workout demonstrations",
        budget: 35000,
        timeline: "3 weeks",
        requiresVideo: true,
        targetAudience: "Fitness enthusiasts",
        platforms: ["Instagram", "YouTube"],
        successMetrics: {
          views: 1800000,
          engagement: "91%",
          conversions: 8500,
        },
      },
      {
        title: "Beauty Product Reviews",
        description: "Luxury skincare brand needs genuine product testing and reviews",
        budget: 40000,
        timeline: "4 weeks",
        requiresVideo: false,
        targetAudience: "Beauty-conscious women 25-35",
        platforms: ["Instagram", "TikTok"],
        successMetrics: {
          views: 3200000,
          engagement: "96%",
          conversions: 12000,
        },
      },
    ];

    sampleCampaigns.forEach((campaign) => {
      this.campaigns.set(this.currentCampaignId, { ...campaign, id: this.currentCampaignId });
      this.currentCampaignId++;
    });
  }

  async getCreators(): Promise<LegacyCreator[]> {
    return Array.from(this.creators.values());
  }

  async getCreator(id: number): Promise<LegacyCreator | undefined> {
    return this.creators.get(id);
  }

  async getCampaigns(): Promise<LegacyCampaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: number): Promise<LegacyCampaign | undefined> {
    return this.campaigns.get(id);
  }

  async createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt">): Promise<Inquiry> {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: this.currentInquiryId,
      createdAt: new Date(),
    };
    this.inquiries.set(this.currentInquiryId, newInquiry);
    this.currentInquiryId++;
    return newInquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  // User operations (in-memory implementation)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByExternalId(externalId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.externalId === externalId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = normalizeEmail(email);
    return Array.from(this.users.values()).find(user => user.email === normalizedEmail);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Find existing user by externalId
    const existingUser = await this.getUserByExternalId(userData.externalId);
    
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        email: userData.email || existingUser.email,
        firstName: userData.firstName || existingUser.firstName,
        lastName: userData.lastName || existingUser.lastName,
        profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
        displayName: userData.displayName || existingUser.displayName,
        updatedAt: new Date(),
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: this.currentUserId,
        externalId: userData.externalId,
        email: userData.email || null,
        password: null, // OAuth users don't have passwords
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User',
        role: 'creator', // Default role
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(this.currentUserId, newUser);
      this.currentUserId++;
      return newUser;
    }
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser: User = {
      ...user,
      role,
      updatedAt: new Date(),
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createCustomUser(userData: CustomSignupUser): Promise<User> {
    // Normalize email
    const normalizedEmail = normalizeEmail(userData.email);

    // Check if user with email already exists
    const existingUser = await this.getUserByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create new user
    const newUser: User = {
      id: this.currentUserId,
      externalId: null, // Custom signup users don't have externalId
      email: normalizedEmail,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: null,
      displayName: `${userData.firstName} ${userData.lastName}`.trim(),
      role: userData.role,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(this.currentUserId, newUser);
    this.currentUserId++;
    return newUser;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    // Normalize email for consistent lookups
    const normalizedEmail = normalizeEmail(email);
    const user = await this.getUserByEmail(normalizedEmail);
    if (!user || !user.password) {
      return null; // User not found or has no password (OAuth user)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // Creator dashboard operations (stubs - not implemented in memory storage)
  async getCreatorProfile(userId: number): Promise<{
    user: User;
    profile: CreatorProfile | null;
    socialAccounts: SocialAccount[];
  }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      user,
      profile: null,
      socialAccounts: [],
    };
  }

  async createCreatorProfile(profileData: { userId: number; bio: string; niches: string[]; platforms: string[]; averageReach?: number }): Promise<CreatorProfile> {
    // MemStorage stub - return mock profile
    return {
      id: 1,
      userId: profileData.userId,
      location: null,
      bio: profileData.bio,
      niches: profileData.niches,
      platforms: profileData.platforms,
      languages: [],
      engagementRate: null,
      averageReach: profileData.averageReach || null,
      responseRate: null,
      contentQualityScore: null,
      hiveScore: null,
      isAvailable: true,
      createdAt: new Date(),
    };
  }

  async createBrandProfile(profileData: { userId: number; companyName: string; website?: string | null; phone?: string | null; referralSource?: string | null }): Promise<BrandProfile> {
    // MemStorage stub - return mock profile
    return {
      id: 1,
      userId: profileData.userId,
      companyName: profileData.companyName,
      website: profileData.website || null,
      handle: null,
      description: null,
      industry: null,
      size: null,
      createdAt: new Date(),
    };
  }

  async getBrandProfile(userId: number): Promise<BrandProfile | null> {
    return null; // MemStorage stub
  }

  async getCreatorDashboardStats(creatorId: number): Promise<{
    totalApplications: number;
    activeAssignments: number;
    completedCampaigns: number;
    totalEarnings: number;
    recommendationCount: number;
  }> {
    return {
      totalApplications: 0,
      activeAssignments: 0,
      completedCampaigns: 0,
      totalEarnings: 0,
      recommendationCount: 0,
    };
  }

  async getCreatorCampaigns(creatorId: number, status?: string): Promise<Campaign[]> {
    return [];
  }

  async getCreatorApplications(creatorId: number): Promise<Application[]> {
    return [];
  }

  async getCreatorAssignments(creatorId: number): Promise<Assignment[]> {
    return [];
  }

  async createSocialAccount(accountData: Omit<SocialAccount, "id" | "createdAt" | "lastSyncAt">): Promise<SocialAccount> {
    // MemStorage doesn't actually store social accounts, return a mock response
    return {
      id: 1,
      ...accountData,
      createdAt: new Date(),
      lastSyncAt: null,
    };
  }

  async addToWaitlist(entry: Omit<Waitlist, "id" | "createdAt">): Promise<Waitlist> {
    const newEntry: Waitlist = {
      ...entry,
      id: this.currentWaitlistId,
      createdAt: new Date(),
    };
    this.waitlistEntries.set(this.currentWaitlistId, newEntry);
    this.currentWaitlistId++;
    return newEntry;
  }

  async getWaitlistEntries(): Promise<Waitlist[]> {
    return Array.from(this.waitlistEntries.values());
  }

  // Brief operations (stubs for MemStorage)
  async createBrief(briefData: InsertBrief): Promise<Brief> {
    throw new Error("Brief operations require database storage");
  }

  async getBriefsByUserId(userId: number): Promise<Brief[]> {
    return [];
  }

  async getBriefById(id: number): Promise<Brief | undefined> {
    return undefined;
  }

  async updateBriefStatus(id: number, status: string): Promise<Brief> {
    throw new Error("Brief operations require database storage");
  }

  async updateBrief(id: number, data: Partial<Brief>): Promise<Brief> {
    throw new Error("Brief operations require database storage");
  }

  async deleteBrief(id: number): Promise<void> {
    throw new Error("Brief operations require database storage");
  }

  async getBriefCounts(userId: number): Promise<{ all: number; draft: number; active: number; paused: number; closed: number }> {
    return { all: 0, draft: 0, active: 0, paused: 0, closed: 0 };
  }

  // Feedback operations (stubs for MemStorage)
  async createFeedback(feedbackData: InsertFeedback): Promise<FeedbackSubmission> {
    throw new Error("Feedback operations require database storage");
  }

  async getFeedbackByUserId(userId: number): Promise<FeedbackSubmission[]> {
    return [];
  }

  // Onboarding progress operations (stubs for MemStorage)
  async getOnboardingProgress(userId: number): Promise<OnboardingProgress[]> {
    return [];
  }

  async updateOnboardingTask(userId: number, taskKey: string, completed: boolean): Promise<OnboardingProgress> {
    throw new Error("Onboarding operations require database storage");
  }

  async initializeOnboardingTasks(userId: number): Promise<OnboardingProgress[]> {
    throw new Error("Onboarding operations require database storage");
  }
}

export class DatabaseStorage implements IStorage {
  // Legacy creators and campaigns remain in-memory for now
  private memStorage = new MemStorage();

  async getCreators(): Promise<LegacyCreator[]> {
    return this.memStorage.getCreators();
  }

  async getCreator(id: number): Promise<LegacyCreator | undefined> {
    return this.memStorage.getCreator(id);
  }

  async getCampaigns(): Promise<LegacyCampaign[]> {
    return this.memStorage.getCampaigns();
  }

  async getCampaign(id: number): Promise<LegacyCampaign | undefined> {
    return this.memStorage.getCampaign(id);
  }

  async createInquiry(inquiryData: Omit<Inquiry, "id" | "createdAt">): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values({
        ...inquiryData,
        createdAt: new Date(),
      })
      .returning();
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(inquiries.createdAt);
  }

  // User operations (required for Replit Auth)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByExternalId(externalId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.externalId, externalId));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = normalizeEmail(email);
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        role: 'creator', // Default role for new users from auth
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.externalId,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          displayName: userData.displayName,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }

  async createCustomUser(userData: CustomSignupUser): Promise<User> {
    // Normalize email
    const normalizedEmail = normalizeEmail(userData.email);

    // Check if user with email already exists
    const existingUser = await this.getUserByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const [user] = await db
      .insert(users)
      .values({
        externalId: null, // Custom signup users don't have externalId
        email: normalizedEmail,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: null,
        displayName: `${userData.firstName} ${userData.lastName}`.trim(),
        role: userData.role,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return user;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    // Normalize email for consistent lookups
    const normalizedEmail = normalizeEmail(email);
    const user = await this.getUserByEmail(normalizedEmail);
    if (!user || !user.password) {
      return null; // User not found or has no password (OAuth user)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // Waitlist operations (now database-backed)
  async addToWaitlist(entryData: Omit<Waitlist, "id" | "createdAt">): Promise<Waitlist> {
    const [entry] = await db
      .insert(waitlist)
      .values({
        ...entryData,
        createdAt: new Date(),
      })
      .returning();
    return entry;
  }

  async getWaitlistEntries(): Promise<Waitlist[]> {
    return await db.select().from(waitlist).orderBy(waitlist.createdAt);
  }

  // Creator dashboard operations (real database implementations)
  async getCreatorProfile(userId: number): Promise<{
    user: User;
    profile: CreatorProfile | null;
    socialAccounts: SocialAccount[];
  }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get creator profile
    const [profile] = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, userId));

    // Get social accounts if profile exists  
    const creatorSocialAccounts = profile 
      ? await db
          .select()
          .from(socialAccounts)
          .where(eq(socialAccounts.creatorId, profile.id))
      : [];

    return {
      user,
      profile: profile || null,
      socialAccounts: creatorSocialAccounts,
    };
  }

  async createCreatorProfile(profileData: { userId: number; bio: string; niches: string[]; platforms: string[]; averageReach?: number }): Promise<CreatorProfile> {
    const [profile] = await db
      .insert(creatorProfiles)
      .values({
        userId: profileData.userId,
        bio: profileData.bio,
        niches: profileData.niches,
        platforms: profileData.platforms,
        averageReach: profileData.averageReach || 0,
        createdAt: new Date(),
      })
      .returning();
    return profile;
  }

  async createBrandProfile(profileData: { userId: number; companyName: string; website?: string | null; phone?: string | null; referralSource?: string | null }): Promise<BrandProfile> {
    const [profile] = await db
      .insert(brandProfiles)
      .values({
        userId: profileData.userId,
        companyName: profileData.companyName,
        website: profileData.website || null,
        createdAt: new Date(),
      })
      .returning();
    return profile;
  }

  async getBrandProfile(userId: number): Promise<BrandProfile | null> {
    const [profile] = await db
      .select()
      .from(brandProfiles)
      .where(eq(brandProfiles.userId, userId));
    return profile || null;
  }

  async getCreatorDashboardStats(creatorId: number): Promise<{
    totalApplications: number;
    activeAssignments: number;
    completedCampaigns: number;
    totalEarnings: number;
    recommendationCount: number;
  }> {
    const [totalApplicationsResult] = await db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.creatorId, creatorId));

    const [activeAssignmentsResult] = await db
      .select({ count: count() })
      .from(assignments)
      .where(and(
        eq(assignments.creatorId, creatorId),
        eq(assignments.status, 'active')
      ));

    const [completedCampaignsResult] = await db
      .select({ count: count() })
      .from(assignments)
      .where(and(
        eq(assignments.creatorId, creatorId),
        eq(assignments.status, 'completed')
      ));

    const [totalEarningsResult] = await db
      .select({ total: sum(assignments.agreedBaseFee) })
      .from(assignments)
      .where(and(
        eq(assignments.creatorId, creatorId),
        eq(assignments.status, 'completed')
      ));

    // Note: Recommendations don't exist yet in actual data
    const recommendationCount = 0;

    return {
      totalApplications: totalApplicationsResult?.count || 0,
      activeAssignments: activeAssignmentsResult?.count || 0,
      completedCampaigns: completedCampaignsResult?.count || 0,
      totalEarnings: parseInt(totalEarningsResult?.total?.toString() || '0'),
      recommendationCount,
    };
  }

  async getCreatorCampaigns(creatorId: number, status?: string): Promise<Campaign[]> {
    if (status) {
      return await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.status, status))
        .orderBy(campaigns.createdAt);
    } else {
      return await db
        .select()
        .from(campaigns)
        .orderBy(campaigns.createdAt);
    }
  }

  async getCreatorApplications(creatorId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.creatorId, creatorId))
      .orderBy(applications.createdAt);
  }

  async getCreatorAssignments(creatorId: number): Promise<Assignment[]> {
    return await db
      .select()
      .from(assignments)
      .where(eq(assignments.creatorId, creatorId))
      .orderBy(assignments.createdAt);
  }

  async createSocialAccount(accountData: Omit<SocialAccount, "id" | "createdAt" | "lastSyncAt">): Promise<SocialAccount> {
    const [account] = await db
      .insert(socialAccounts)
      .values({
        ...accountData,
        createdAt: new Date(),
        lastSyncAt: null,
      })
      .returning();
    return account;
  }

  // Brief operations (database-backed)
  async createBrief(briefData: InsertBrief): Promise<Brief> {
    const [brief] = await db
      .insert(briefs)
      .values(briefData as any)
      .returning();
    return brief;
  }

  async getBriefsByUserId(userId: number): Promise<Brief[]> {
    return await db
      .select()
      .from(briefs)
      .where(eq(briefs.userId, userId))
      .orderBy(desc(briefs.createdAt));
  }

  async getBriefById(id: number): Promise<Brief | undefined> {
    const [brief] = await db
      .select()
      .from(briefs)
      .where(eq(briefs.id, id));
    return brief || undefined;
  }

  async updateBriefStatus(id: number, status: string): Promise<Brief> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    // Set publishedAt when going active
    if (status === 'active') {
      updateData.publishedAt = new Date();
    }
    // Set closedAt when closing
    if (status === 'closed') {
      updateData.closedAt = new Date();
    }
    
    const [brief] = await db
      .update(briefs)
      .set(updateData)
      .where(eq(briefs.id, id))
      .returning();
    
    if (!brief) {
      throw new Error("Brief not found");
    }
    return brief;
  }

  async updateBrief(id: number, data: Partial<Brief>): Promise<Brief> {
    const [brief] = await db
      .update(briefs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(briefs.id, id))
      .returning();
    
    if (!brief) {
      throw new Error("Brief not found");
    }
    return brief;
  }

  async deleteBrief(id: number): Promise<void> {
    await db.delete(briefs).where(eq(briefs.id, id));
  }

  async getBriefCounts(userId: number): Promise<{ all: number; draft: number; active: number; paused: number; closed: number }> {
    const allBriefs = await db
      .select()
      .from(briefs)
      .where(eq(briefs.userId, userId));
    
    return {
      all: allBriefs.length,
      draft: allBriefs.filter(b => b.status === 'draft').length,
      active: allBriefs.filter(b => b.status === 'active').length,
      paused: allBriefs.filter(b => b.status === 'paused').length,
      closed: allBriefs.filter(b => b.status === 'closed').length,
    };
  }

  // Feedback operations
  async createFeedback(feedbackData: InsertFeedback): Promise<FeedbackSubmission> {
    const [feedback] = await db
      .insert(feedbackSubmissions)
      .values(feedbackData)
      .returning();
    return feedback;
  }

  async getFeedbackByUserId(userId: number): Promise<FeedbackSubmission[]> {
    return await db
      .select()
      .from(feedbackSubmissions)
      .where(eq(feedbackSubmissions.userId, userId))
      .orderBy(desc(feedbackSubmissions.createdAt));
  }

  // Onboarding progress operations
  async getOnboardingProgress(userId: number): Promise<OnboardingProgress[]> {
    return await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, userId));
  }

  async updateOnboardingTask(userId: number, taskKey: string, completed: boolean): Promise<OnboardingProgress> {
    // Try to update existing task
    const [existing] = await db
      .select()
      .from(onboardingProgress)
      .where(and(
        eq(onboardingProgress.userId, userId),
        eq(onboardingProgress.taskKey, taskKey)
      ));

    if (existing) {
      const [updated] = await db
        .update(onboardingProgress)
        .set({
          completed,
          completedAt: completed ? new Date() : null,
        })
        .where(eq(onboardingProgress.id, existing.id))
        .returning();
      return updated;
    }

    // Create new task progress entry
    const [created] = await db
      .insert(onboardingProgress)
      .values({
        userId,
        taskKey,
        completed,
        completedAt: completed ? new Date() : null,
      })
      .returning();
    return created;
  }

  async initializeOnboardingTasks(userId: number): Promise<OnboardingProgress[]> {
    const existingProgress = await this.getOnboardingProgress(userId);
    if (existingProgress.length > 0) {
      return existingProgress;
    }

    // Default onboarding tasks for brands
    const defaultTasks = [
      { taskKey: 'complete_profile', completed: false },
      { taskKey: 'create_first_brief', completed: false },
    ];

    const createdTasks: OnboardingProgress[] = [];
    for (const task of defaultTasks) {
      const [created] = await db
        .insert(onboardingProgress)
        .values({
          userId,
          taskKey: task.taskKey,
          completed: task.completed,
        })
        .returning();
      createdTasks.push(created);
    }

    return createdTasks;
  }
}

export const storage = new DatabaseStorage();