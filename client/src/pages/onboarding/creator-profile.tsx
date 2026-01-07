import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { HiverWordmark } from "@/components/hiver-logo";
import { Image } from "lucide-react";

export default function CreatorProfile() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('onboarding_path', '/onboarding/creator');
  }, []);
  
  const [formData, setFormData] = useState({
    displayName: "",
    profileImage: null as File | null,
    bio: "",
    niche: "",
    primaryPlatform: "",
    followerCount: "",
    howDidYouFindUs: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    sessionStorage.setItem('creatorOnboardingData', JSON.stringify(formData));
    setLocation("/onboarding/creator/welcome");
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
      <div className="max-w-lg mx-auto relative z-10">
        <div className="text-center mb-8">
          <HiverWordmark className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome {user?.firstName || 'Creator'}!
          </h1>
          <p className="text-gray-600">Let's set up your creator profile</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div>
              <Label htmlFor="displayName" className="text-base font-semibold">
                Display Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="displayName"
                placeholder="Your creator name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="mt-2 h-12 text-base"
                data-testid="input-display-name"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Profile Photo</p>
                <p className="text-sm text-gray-500">Recommended 200x200</p>
              </div>
              <Button 
                type="button" 
                size="sm"
                className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-upload-photo"
              >
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-base font-semibold">
                Bio<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell brands about yourself and your content style..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-2 text-base min-h-[100px]"
                data-testid="input-bio"
                required
              />
            </div>

            <div>
              <Label htmlFor="niche" className="text-base font-semibold">
                Content Niche<span className="text-red-500">*</span>
              </Label>
              <Input
                id="niche"
                placeholder="e.g., Fashion, Beauty, Tech, Lifestyle"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                className="mt-2 h-12 text-base"
                data-testid="input-niche"
                required
              />
            </div>

            <div>
              <Label htmlFor="platform" className="text-base font-semibold">
                Primary Platform<span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.primaryPlatform} 
                onValueChange={(value) => setFormData({ ...formData, primaryPlatform: value })}
              >
                <SelectTrigger className="mt-2 h-12" data-testid="select-platform">
                  <SelectValue placeholder="Select your main platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="followerCount" className="text-base font-semibold">
                Total Followers<span className="text-red-500">*</span>
              </Label>
              <Input
                id="followerCount"
                placeholder="e.g., 10000"
                value={formData.followerCount}
                onChange={(e) => setFormData({ ...formData, followerCount: e.target.value })}
                className="mt-2 h-12 text-base"
                data-testid="input-followers"
                required
              />
            </div>

            <div>
              <Label htmlFor="howFound" className="text-base font-semibold">
                How did you find us?<span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.howDidYouFindUs} 
                onValueChange={(value) => setFormData({ ...formData, howDidYouFindUs: value })}
              >
                <SelectTrigger className="mt-2 h-12" data-testid="select-how-found">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="referral">Friend/Creator Referral</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="blog">Blog/Article</SelectItem>
                  <SelectItem value="brand">Brand Invitation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleContinue}
                disabled={!formData.displayName || !formData.bio || !formData.niche || !formData.primaryPlatform || !formData.followerCount || !formData.howDidYouFindUs}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 h-12"
                data-testid="button-continue"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
