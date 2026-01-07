import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { HiverWordmark } from "@/components/hiver-logo";
import { CheckCircle, Sparkles, ArrowRight, Trophy } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const features = [
  {
    title: "Full access to Challenges & Briefs",
    description: "Participate in structured brand challenges and respond to clear briefs to showcase your skills."
  },
  {
    title: "100% Free for Creators",
    description: "No subscription fees, no hidden costs. Earn money by creating great content for brands."
  },
  {
    title: "Get discovered by top brands",
    description: "Brands actively search for creators like you. Build your portfolio and get noticed."
  },
  {
    title: "Hive Leaderboard (Creator Rankings)",
    description: "Earn points by completing challenges and rewards. Top-ranked creators unlock higher earning potential and premium visibility."
  },
  {
    title: "Flexible pricing you control",
    description: "Set your own rates and negotiate directly with brands — you decide your value."
  },
  {
    title: "Keep rights to your content",
    description: "You maintain ownership of your creative work unless otherwise agreed with the brand."
  },
  {
    title: "Build your creator portfolio",
    description: "Showcase your best work and grow your reputation in the creator economy."
  },
];

export default function CreatorWelcome() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [creatorData, setCreatorData] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('onboarding_path', '/onboarding/creator/welcome');
    const stored = sessionStorage.getItem('creatorOnboardingData');
    if (stored) {
      setCreatorData(JSON.parse(stored));
    } else {
      setLocation("/onboarding/creator");
    }
  }, [setLocation]);

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      if (!creatorData) return;
      const response = await apiRequest("/api/creator/profile", "POST", {
        bio: creatorData.bio,
        niches: creatorData.niche.split(",").map((n: string) => n.trim()).filter(Boolean),
        platforms: [creatorData.primaryPlatform],
        averageReach: parseInt(creatorData.followerCount.replace(/\D/g, '')) || 0,
      });
      return response.json();
    },
    onSuccess: () => {
      sessionStorage.removeItem('creatorOnboardingData');
      localStorage.removeItem('onboarding_path');
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/creator/dashboard"] });
      setLocation("/dashboard");
    },
    onError: (error) => {
      console.error("Failed to create creator profile:", error);
    },
  });

  const handleGetStarted = () => {
    createProfileMutation.mutate();
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please sign in to continue.</p>
            <Button onClick={() => setLocation("/login")} className="w-full mt-4 bg-[#8B5CF6] hover:bg-[#7C3AED]">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero py-8 px-4">
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <HiverWordmark className="mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Welcome to Hiverr!
          </h1>
          <p className="text-lg text-gray-600">
            Start earning by creating content for top brands
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-[#D97706]" />
              <h2 className="text-xl font-bold text-gray-900">
                Here's what you get as a creator
              </h2>
            </div>

            <div className="space-y-5 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">{feature.title}</span>
                    <p className="text-sm text-gray-600 mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                <strong>Ready to start earning?</strong> Complete your profile and start applying to brand challenges today!
              </p>
            </div>

            <Button 
              onClick={handleGetStarted}
              disabled={createProfileMutation.isPending}
              className="w-full h-14 text-lg font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED]"
              data-testid="button-get-started"
            >
              {createProfileMutation.isPending ? (
                "Setting up your profile..."
              ) : (
                <>
                  Get Started - It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 mt-8">
          Join 2,500+ creators already on Hiverr
        </p>
      </div>
    </div>
  );
}
