import { db } from "./db";
import { creators, campaigns, inquiries, waitlist, type Creator, type Campaign, type Inquiry, type Waitlist } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Creator operations
  getCreators(): Promise<Creator[]>;
  getCreator(id: number): Promise<Creator | undefined>;
  
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  
  // Inquiry operations
  createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt">): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  
  // Waitlist operations
  addToWaitlist(entry: Omit<Waitlist, "id" | "createdAt">): Promise<Waitlist>;
  getWaitlistEntries(): Promise<Waitlist[]>;
}

export class MemStorage implements IStorage {
  private creators: Map<number, Creator>;
  private campaigns: Map<number, Campaign>;
  private inquiries: Map<number, Inquiry>;
  private waitlistEntries: Map<number, Waitlist>;
  private currentCreatorId: number;
  private currentCampaignId: number;
  private currentInquiryId: number;
  private currentWaitlistId: number;

  constructor() {
    this.creators = new Map();
    this.campaigns = new Map();
    this.inquiries = new Map();
    this.waitlistEntries = new Map();
    this.currentCreatorId = 1;
    this.currentCampaignId = 1;
    this.currentInquiryId = 1;
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
        hourlyRate: 450,
        category: "Fashion & Lifestyle",
        platforms: ["Instagram", "TikTok"],
        followerCount: 1200000,
        engagementRate: "95%",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b332c3eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
      },
      {
        name: "Marcus Thompson",
        email: "marcus@example.com",
        bio: "Tech content creator specializing in authentic product reviews and app demonstrations for mobile and web platforms.",
        location: "San Francisco",
        hourlyRate: 650,
        category: "Technology",
        platforms: ["TikTok", "YouTube"],
        followerCount: 850000,
        engagementRate: "88%",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
      },
      {
        name: "Sophia Martinez",
        email: "sophia@example.com",
        bio: "Fitness & wellness creator focused on authentic workout content and health product reviews.",
        location: "Miami",
        hourlyRate: 380,
        category: "Fitness & Health",
        platforms: ["YouTube", "Instagram"],
        followerCount: 850000,
        engagementRate: "92%",
        profileImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
      },
      {
        name: "Isabella Beauty",
        email: "isabella@example.com",
        bio: "Beauty & skincare expert creating authentic product reviews and makeup tutorials.",
        location: "New York",
        hourlyRate: 420,
        category: "Beauty & Skincare",
        platforms: ["Instagram", "YouTube"],
        followerCount: 950000,
        engagementRate: "91%",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
      },
      {
        name: "Chef Maria",
        email: "maria@example.com",
        bio: "Professional chef sharing authentic cooking tutorials and recipe development content.",
        location: "Chicago",
        hourlyRate: 380,
        category: "Food & Cooking",
        platforms: ["YouTube", "Instagram"],
        followerCount: 720000,
        engagementRate: "89%",
        profileImage: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
      },
      {
        name: "Jake Music",
        email: "jake@example.com",
        bio: "Music producer and audio content creator specializing in music reviews and production tutorials.",
        location: "Nashville",
        hourlyRate: 500,
        category: "Music & Audio",
        platforms: ["YouTube", "Spotify"],
        followerCount: 650000,
        engagementRate: "87%",
        profileImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
      },
      {
        name: "Travel Sam",
        email: "sam@example.com",
        bio: "Adventure traveler documenting authentic destination experiences and travel gear reviews.",
        location: "Austin",
        hourlyRate: 450,
        category: "Travel",
        platforms: ["Instagram", "YouTube"],
        followerCount: 880000,
        engagementRate: "86%",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
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

  async getCreators(): Promise<Creator[]> {
    return Array.from(this.creators.values());
  }

  async getCreator(id: number): Promise<Creator | undefined> {
    return this.creators.get(id);
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
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
}

export class DatabaseStorage implements IStorage {
  async getCreators(): Promise<Creator[]> {
    return await db.select().from(creators);
  }

  async getCreator(id: number): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.id, id));
    return creator || undefined;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
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
}

export const storage = new MemStorage();