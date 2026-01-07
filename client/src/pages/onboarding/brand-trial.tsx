import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { HiverWordmark } from "@/components/hiver-logo";
import { CheckCircle, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const features = [
  {
    title: "Full access to Challenges & Briefs",
    description: "Launch structured creator challenges and clear brand briefs instead of generic contests."
  },
  {
    title: "Free platform access for 25 days",
    description: "Explore, post briefs, review submissions, and engage creators with zero upfront cost."
  },
  {
    title: "Access a vetted creator network",
    description: "Work with creators who are ranked, reviewed, and incentivized to perform."
  },
  {
    title: "Hive Leaderboard (Creator Rankings)",
    description: "Creators earn points by completing challenges and rewards. Top-ranked creators unlock higher earning potential and premium visibility."
  },
  {
    title: "Flexible creator pricing",
    description: "Negotiate creator fees directly — brands and creators agree on value, not fixed rates."
  },
  {
    title: "Lifetime access to winning submissions",
    description: "Reuse high-performing content across ads, social, and landing pages."
  },
  {
    title: "Validate content organically",
    description: "See what performs before you scale with paid spend."
  },
];

export default function BrandTrial() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [brandData, setBrandData] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('onboarding_path', '/onboarding/brand/trial');
    const stored = sessionStorage.getItem('brandOnboardingData');
    if (stored) {
      setBrandData(JSON.parse(stored));
    } else {
      setLocation("/onboarding/brand");
    }
  }, [setLocation]);

  const createBrandMutation = useMutation({
    mutationFn: async () => {
      if (!brandData) return;
      const response = await apiRequest("/api/brand/profile", "POST", {
        companyName: brandData.brandName,
        website: brandData.website,
        phone: brandData.phone,
        referralSource: brandData.howDidYouFindUs,
      });
      return response.json();
    },
    onSuccess: () => {
      sessionStorage.removeItem('brandOnboardingData');
      localStorage.removeItem('onboarding_path');
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/brand/dashboard");
    },
    onError: (error) => {
      console.error("Failed to create brand profile:", error);
    },
  });

  const handleStartTrial = () => {
    createBrandMutation.mutate();
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
            Try Hiverr Free for 25 Days
          </h1>
          <p className="text-lg text-gray-600">
            25 days free, then just $90/month
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Here's what you get
            </h2>

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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-[#8B5CF6]">$0.00</span>
                <span className="text-xl text-gray-400 line-through">$90</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 bg-purple-50 px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-[#8B5CF6]" />
                <span>No money down. Cancel anytime</span>
              </div>
            </div>

            <Button 
              onClick={handleStartTrial}
              disabled={createBrandMutation.isPending}
              className="w-full h-14 text-lg font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED]"
              data-testid="button-start-trial"
            >
              {createBrandMutation.isPending ? (
                "Setting up your account..."
              ) : (
                "Try 25 Days for $0"
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 mt-8">
          Trusted by over 100 companies
        </p>
      </div>
    </div>
  );
}
