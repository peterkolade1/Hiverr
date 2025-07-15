import { db } from "./db";
import { creators, campaigns } from "@shared/schema";

// Sample creators data
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
    name: "Sophia Chen",
    email: "sophia@example.com",
    bio: "Beauty content creator and makeup artist with expertise in skin-positive content and inclusive beauty tutorials.",
    location: "New York",
    hourlyRate: 550,
    category: "Beauty & Skincare",
    platforms: ["Instagram", "TikTok", "YouTube"],
    followerCount: 2100000,
    engagementRate: "92%",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    isAvailable: true,
    isVerified: true,
  },
];

// Sample campaigns data
const sampleCampaigns = [
  {
    brandName: "TechFlow",
    title: "TechFlow App Launch",
    description: "Mobile app showcase campaign featuring authentic user testimonials and product demonstrations",
    budget: 15000,
    platform: "TikTok",
    category: "Technology",
    metrics: {
      engagement: "2.8M",
      reach: "12M",
      conversions: "15%",
      downloads: "45K"
    },
    testimonial: "TechFlow transformed how we connect with users. The authentic creator content drove incredible engagement and real downloads.",
    clientName: "Sarah Kim",
    clientTitle: "Marketing Director",
    campaignImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 5,
  },
  {
    brandName: "FitLife",
    title: "Summer Fitness Challenge",
    description: "Fitness campaign promoting healthy lifestyle through authentic workout content and nutrition tips",
    budget: 20000,
    platform: "Instagram",
    category: "Fitness & Health",
    metrics: {
      engagement: "3.2M",
      reach: "18M",
      conversions: "22%"
    },
    testimonial: "The creators delivered authentic fitness content that resonated with our target audience perfectly.",
    clientName: "Mike Johnson",
    clientTitle: "Brand Manager",
    campaignImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 5,
  },
];

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingCreators = await db.select().from(creators).limit(1);
    if (existingCreators.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // Insert creators
    await db.insert(creators).values(sampleCreators);
    console.log("Creators seeded successfully");

    // Insert campaigns
    await db.insert(campaigns).values(sampleCampaigns);
    console.log("Campaigns seeded successfully");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}