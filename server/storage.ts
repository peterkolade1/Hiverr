import { creators, campaigns, inquiries, waitlist, type Creator, type Campaign, type Inquiry, type Waitlist, type InsertCreator, type InsertCampaign, type InsertInquiry, type InsertWaitlist } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Creator methods
  getAllCreators(): Promise<Creator[]>;
  getCreator(id: number): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  
  // Campaign methods
  getAllCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  
  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  
  // Waitlist methods
  createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
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
    // Sample creators
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
    ];

    // Add more creators for different niches
    const additionalCreators = [
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
      {
        name: "Photo Alex",
        email: "alex@example.com",
        bio: "Professional photographer creating stunning visual content and photography tutorials.",
        location: "Portland",
        hourlyRate: 520,
        category: "Photography",
        platforms: ["Instagram", "YouTube"],
        followerCount: 680000,
        engagementRate: "90%",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
      }
    ];

    const allCreators = [...sampleCreators, ...additionalCreators];
    
    allCreators.forEach(creator => {
      const id = this.currentCreatorId++;
      this.creators.set(id, { 
        ...creator, 
        id,
        platforms: creator.platforms as string[]
      });
    });

    // Sample campaigns
    const sampleCampaigns = [
      {
        brandName: "TechFlow",
        title: "TechFlow App Launch",
        description: "SaaS Productivity Platform",
        budget: 15000,
        platform: "TikTok",
        category: "Tech",
        metrics: {
          downloads: "50K+",
          reach: "1.8M",
          conversions: "4.2%"
        },
        testimonial: "Working with CreatorLink transformed our app launch strategy. The UGC content from tech reviewers generated over 50K app downloads in the first month and established authentic credibility in a crowded market.",
        clientName: "Sarah Chen",
        clientTitle: "Marketing Director",
        campaignImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 5,
      },
      {
        brandName: "StyleCo",
        title: "StyleCo Summer Collection",
        description: "Fashion influencers showcased new summer pieces through authentic styling content.",
        budget: 8000,
        platform: "Instagram",
        category: "Fashion",
        metrics: {
          engagement: "+425%",
          reach: "2.3M",
        },
        campaignImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 5,
      },
      {
        brandName: "FitNutrition",
        title: "FitNutrition Brand Awareness",
        description: "Fitness creators demonstrated product benefits through workout content.",
        budget: 12000,
        platform: "YouTube",
        category: "Health",
        metrics: {
          reach: "+280%",
          engagement: "92%",
        },
        campaignImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 5,
      },
    ];

    sampleCampaigns.forEach(campaign => {
      const id = this.currentCampaignId++;
      this.campaigns.set(id, { 
        ...campaign, 
        id, 
        createdAt: new Date(),
        testimonial: campaign.testimonial || null,
        clientName: campaign.clientName || null,
        clientTitle: campaign.clientTitle || null,
        metrics: campaign.metrics as { engagement?: string; reach?: string; conversions?: string; downloads?: string; }
      });
    });
  }

  async getAllCreators(): Promise<Creator[]> {
    return Array.from(this.creators.values());
  }

  async getCreator(id: number): Promise<Creator | undefined> {
    return this.creators.get(id);
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const id = this.currentCreatorId++;
    const creator: Creator = { 
      ...insertCreator, 
      id,
      isVerified: false,
      isAvailable: insertCreator.isAvailable ?? true,
      platforms: insertCreator.platforms as string[]
    };
    this.creators.set(id, creator);
    return creator;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const campaign: Campaign = { 
      ...insertCampaign, 
      id,
      createdAt: new Date(),
      testimonial: insertCampaign.testimonial || null,
      clientName: insertCampaign.clientName || null,
      clientTitle: insertCampaign.clientTitle || null,
      rating: insertCampaign.rating ?? 5,
      metrics: insertCampaign.metrics as { engagement?: string; reach?: string; conversions?: string; downloads?: string; }
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id,
      createdAt: new Date(),
      company: insertInquiry.company || null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async createWaitlistEntry(insertWaitlist: InsertWaitlist): Promise<Waitlist> {
    const id = this.currentWaitlistId++;
    const waitlistEntry: Waitlist = { 
      ...insertWaitlist, 
      id,
      createdAt: new Date(),
      company: insertWaitlist.company || null,
      role: insertWaitlist.role || null
    };
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }
}

export class DatabaseStorage implements IStorage {
  async getAllCreators(): Promise<Creator[]> {
    return await db.select().from(creators);
  }

  async getCreator(id: number): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.id, id));
    return creator || undefined;
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const [creator] = await db
      .insert(creators)
      .values([insertCreator])
      .returning();
    return creator;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values([insertCampaign])
      .returning();
    return campaign;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values([insertInquiry])
      .returning();
    return inquiry;
  }

  async createWaitlistEntry(insertWaitlist: InsertWaitlist): Promise<Waitlist> {
    const [waitlistEntry] = await db
      .insert(waitlist)
      .values([insertWaitlist])
      .returning();
    return waitlistEntry;
  }
}

export const storage = new DatabaseStorage();
