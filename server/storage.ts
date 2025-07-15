import { creators, campaigns, inquiries, type Creator, type Campaign, type Inquiry, type InsertCreator, type InsertCampaign, type InsertInquiry } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private creators: Map<number, Creator>;
  private campaigns: Map<number, Campaign>;
  private inquiries: Map<number, Inquiry>;
  private currentCreatorId: number;
  private currentCampaignId: number;
  private currentInquiryId: number;

  constructor() {
    this.creators = new Map();
    this.campaigns = new Map();
    this.inquiries = new Map();
    this.currentCreatorId = 1;
    this.currentCampaignId = 1;
    this.currentInquiryId = 1;

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
        category: "Fashion Creator",
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
        category: "Tech Creator",
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
        category: "Fitness Creator",
        platforms: ["YouTube", "Instagram"],
        followerCount: 850000,
        engagementRate: "92%",
        profileImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isAvailable: true,
        isVerified: true,
      },
    ];

    sampleCreators.forEach(creator => {
      const id = this.currentCreatorId++;
      this.creators.set(id, { ...creator, id });
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
      this.campaigns.set(id, { ...campaign, id, createdAt: new Date() });
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
      isVerified: false 
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
      createdAt: new Date()
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id,
      createdAt: new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
}

export const storage = new MemStorage();
