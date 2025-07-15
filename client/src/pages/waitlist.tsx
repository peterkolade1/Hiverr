import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, Building2, Upload, CheckCircle } from "lucide-react";

const brandFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z.string().min(2, "Company website or IG handle is required"),
  role: z.string().min(1, "Role is required"),
  creatorsLooking: z.string().min(2, "Please describe what creators you're looking for"),
  budgetRange: z.string().min(1, "Budget range is required"),
  hasCampaign: z.boolean(),
  launchTiming: z.string().min(1, "Launch timing is required"),
  brandLogo: z.string().optional(),
});

const creatorFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  profilePicture: z.string().optional(),
  niches: z.array(z.string()).min(1, "Select at least one niche"),
  instagram: z.string().optional(),
  instagramFollowers: z.string().optional(),
  tiktok: z.string().optional(),
  tiktokFollowers: z.string().optional(),
  youtube: z.string().optional(),
  youtubeSubs: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  languages: z.string().min(2, "Languages are required"),
  aiContent: z.boolean(),
  rateRange: z.string().optional(),
  portfolio: z.string().optional(),
});

type BrandForm = z.infer<typeof brandFormSchema>;
type CreatorForm = z.infer<typeof creatorFormSchema>;

export default function Waitlist() {
  const [userType, setUserType] = useState<"brand" | "creator">("brand");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const brandForm = useForm<BrandForm>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      companyWebsite: "",
      role: "",
      creatorsLooking: "",
      budgetRange: "",
      hasCampaign: false,
      launchTiming: "",
      brandLogo: "",
    },
  });

  const creatorForm = useForm<CreatorForm>({
    resolver: zodResolver(creatorFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      profilePicture: "",
      niches: [],
      instagram: "",
      instagramFollowers: "",
      tiktok: "",
      tiktokFollowers: "",
      youtube: "",
      youtubeSubs: "",
      twitter: "",
      facebook: "",
      location: "",
      languages: "",
      aiContent: false,
      rateRange: "",
      portfolio: "",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        name: data.fullName,
        email: data.email,
        company: userType === "brand" ? data.companyName : "Creator",
        role: userType === "brand" ? data.role : "Content Creator",
        ...data,
        userType,
      };
      return await apiRequest("/api/waitlist", "POST", payload);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Welcome to the waitlist!",
        description: "We'll let you know when we launch.",
      });
    },
    onError: (error: any) => {
      let description = "Failed to join waitlist. Please try again.";
      
      if (error.message?.includes("409") || error.message?.includes("already on the waitlist")) {
        description = "This email is already on the waitlist. Thank you for your interest!";
      }
      
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    },
  });

  const onBrandSubmit = (data: BrandForm) => {
    waitlistMutation.mutate(data);
  };

  const onCreatorSubmit = (data: CreatorForm) => {
    waitlistMutation.mutate(data);
  };

  const niches = [
    "Beauty & Skincare",
    "Fitness & Health",
    "Fashion & Lifestyle",
    "Technology",
    "Food & Cooking",
    "Parenting",
    "Travel",
    "Photography",
    "Music & Audio",
    "Gaming",
    "Business & Finance",
    "Education",
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-12"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                You're on the list!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We'll let you know when we launch. Keep an eye on your inbox for exclusive updates.
              </p>
              <Button
                onClick={() => window.location.href = "/"}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                Back to Home
              </Button>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join the Waitlist
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Be the first to know when Hiverr launches and get early access to our platform.
            </p>
          </motion.div>

          {/* User Type Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white rounded-full p-2 shadow-md">
              <div className="flex">
                <button
                  onClick={() => setUserType("brand")}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    userType === "brand"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Building2 size={16} className="inline mr-2" />
                  For Brands
                </button>
                <button
                  onClick={() => setUserType("creator")}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    userType === "creator"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Users size={16} className="inline mr-2" />
                  For Creators
                </button>
              </div>
            </div>
          </motion.div>

          {/* Brand Form */}
          {userType === "brand" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...brandForm.register("fullName")}
                      placeholder="Enter your full name"
                      disabled={waitlistMutation.isPending}
                    />
                    {brandForm.formState.errors.fullName && (
                      <p className="text-sm text-red-600 mt-1">
                        {brandForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...brandForm.register("email")}
                      placeholder="Enter your work email"
                      disabled={waitlistMutation.isPending}
                    />
                    {brandForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {brandForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company / Brand Name</Label>
                    <Input
                      id="companyName"
                      {...brandForm.register("companyName")}
                      placeholder="Enter your company name"
                      disabled={waitlistMutation.isPending}
                    />
                    {brandForm.formState.errors.companyName && (
                      <p className="text-sm text-red-600 mt-1">
                        {brandForm.formState.errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyWebsite">Company Website or IG Handle</Label>
                    <Input
                      id="companyWebsite"
                      {...brandForm.register("companyWebsite")}
                      placeholder="www.company.com or @handle"
                      disabled={waitlistMutation.isPending}
                    />
                    {brandForm.formState.errors.companyWebsite && (
                      <p className="text-sm text-red-600 mt-1">
                        {brandForm.formState.errors.companyWebsite.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Your Role</Label>
                  <Select onValueChange={(value) => brandForm.setValue("role", value)} disabled={waitlistMutation.isPending}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing Lead">Marketing Lead</SelectItem>
                      <SelectItem value="Founder">Founder</SelectItem>
                      <SelectItem value="Social Media Manager">Social Media Manager</SelectItem>
                      <SelectItem value="Brand Manager">Brand Manager</SelectItem>
                      <SelectItem value="Marketing Director">Marketing Director</SelectItem>
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {brandForm.formState.errors.role && (
                    <p className="text-sm text-red-600 mt-1">
                      {brandForm.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="creatorsLooking">What kind of creators are you looking for?</Label>
                  <Textarea
                    id="creatorsLooking"
                    {...brandForm.register("creatorsLooking")}
                    placeholder="e.g., beauty, tech, UGC, nano influencers, etc."
                    disabled={waitlistMutation.isPending}
                  />
                  {brandForm.formState.errors.creatorsLooking && (
                    <p className="text-sm text-red-600 mt-1">
                      {brandForm.formState.errors.creatorsLooking.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="budgetRange">Campaign Budget Range</Label>
                  <Select onValueChange={(value) => brandForm.setValue("budgetRange", value)} disabled={waitlistMutation.isPending}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<$500">Less than $500</SelectItem>
                      <SelectItem value="$500-$1K">$500 - $1,000</SelectItem>
                      <SelectItem value="$1K-$5K">$1,000 - $5,000</SelectItem>
                      <SelectItem value="$5K-$10K">$5,000 - $10,000</SelectItem>
                      <SelectItem value="$10K+">$10,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {brandForm.formState.errors.budgetRange && (
                    <p className="text-sm text-red-600 mt-1">
                      {brandForm.formState.errors.budgetRange.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasCampaign"
                    checked={brandForm.watch("hasCampaign")}
                    onCheckedChange={(checked) => brandForm.setValue("hasCampaign", checked)}
                    disabled={waitlistMutation.isPending}
                  />
                  <Label htmlFor="hasCampaign">Do you already have a campaign in mind?</Label>
                </div>

                <div>
                  <Label htmlFor="launchTiming">How soon do you plan to launch your next campaign?</Label>
                  <Select onValueChange={(value) => brandForm.setValue("launchTiming", value)} disabled={waitlistMutation.isPending}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASAP">ASAP</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1 month+">1 month+</SelectItem>
                    </SelectContent>
                  </Select>
                  {brandForm.formState.errors.launchTiming && (
                    <p className="text-sm text-red-600 mt-1">
                      {brandForm.formState.errors.launchTiming.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="brandLogo">Upload Brand Logo (Optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button type="button" variant="outline" size="sm" disabled={waitlistMutation.isPending}>
                      <Upload size={16} className="mr-2" />
                      Upload Logo
                    </Button>
                    <span className="text-sm text-gray-500">JPG/PNG, under 5MB</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700">
                    🚀 <strong>Early Access Benefits:</strong>
                  </p>
                  <ul className="text-sm text-purple-600 mt-2 space-y-1">
                    <li>• Priority access to top-performing creators</li>
                    <li>• Special launch pricing and discounts</li>
                    <li>• Direct feedback line to our product team</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={waitlistMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Creator Form */}
          {userType === "creator" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <form onSubmit={creatorForm.handleSubmit(onCreatorSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...creatorForm.register("fullName")}
                      placeholder="Enter your full name"
                      disabled={waitlistMutation.isPending}
                    />
                    {creatorForm.formState.errors.fullName && (
                      <p className="text-sm text-red-600 mt-1">
                        {creatorForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...creatorForm.register("email")}
                      placeholder="Enter your email"
                      disabled={waitlistMutation.isPending}
                    />
                    {creatorForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {creatorForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="profilePicture">Profile Picture / Avatar Upload (Optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button type="button" variant="outline" size="sm" disabled={waitlistMutation.isPending}>
                      <Upload size={16} className="mr-2" />
                      Upload Picture
                    </Button>
                    <span className="text-sm text-gray-500">JPG/PNG, under 5MB</span>
                  </div>
                </div>

                <div>
                  <Label>Niche(s) - Select all that apply</Label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {niches.map((niche) => (
                      <div key={niche} className="flex items-center space-x-2">
                        <Checkbox
                          id={niche}
                          checked={creatorForm.watch("niches").includes(niche)}
                          onCheckedChange={(checked) => {
                            const current = creatorForm.watch("niches");
                            if (checked) {
                              creatorForm.setValue("niches", [...current, niche]);
                            } else {
                              creatorForm.setValue("niches", current.filter(n => n !== niche));
                            }
                          }}
                          disabled={waitlistMutation.isPending}
                        />
                        <Label htmlFor={niche} className="text-sm font-normal">
                          {niche}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {creatorForm.formState.errors.niches && (
                    <p className="text-sm text-red-600 mt-1">
                      {creatorForm.formState.errors.niches.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Where do you create content? (Check all that apply)</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram">Instagram Handle</Label>
                      <Input
                        id="instagram"
                        {...creatorForm.register("instagram")}
                        placeholder="@yourhandle"
                        disabled={waitlistMutation.isPending}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagramFollowers">Instagram Followers</Label>
                      <Input
                        id="instagramFollowers"
                        {...creatorForm.register("instagramFollowers")}
                        placeholder="e.g., 10K"
                        disabled={waitlistMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tiktok">TikTok Handle</Label>
                      <Input
                        id="tiktok"
                        {...creatorForm.register("tiktok")}
                        placeholder="@yourhandle"
                        disabled={waitlistMutation.isPending}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tiktokFollowers">TikTok Followers</Label>
                      <Input
                        id="tiktokFollowers"
                        {...creatorForm.register("tiktokFollowers")}
                        placeholder="e.g., 50K"
                        disabled={waitlistMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="youtube">YouTube Channel Link</Label>
                      <Input
                        id="youtube"
                        {...creatorForm.register("youtube")}
                        placeholder="Channel URL"
                        disabled={waitlistMutation.isPending}
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtubeSubs">YouTube Subscribers</Label>
                      <Input
                        id="youtubeSubs"
                        {...creatorForm.register("youtubeSubs")}
                        placeholder="e.g., 5K"
                        disabled={waitlistMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="twitter">X (Twitter) Handle</Label>
                      <Input
                        id="twitter"
                        {...creatorForm.register("twitter")}
                        placeholder="@yourhandle"
                        disabled={waitlistMutation.isPending}
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook Page or Profile</Label>
                      <Input
                        id="facebook"
                        {...creatorForm.register("facebook")}
                        placeholder="Facebook URL"
                        disabled={waitlistMutation.isPending}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location">Your Country / City</Label>
                    <Input
                      id="location"
                      {...creatorForm.register("location")}
                      placeholder="e.g., New York, USA"
                      disabled={waitlistMutation.isPending}
                    />
                    {creatorForm.formState.errors.location && (
                      <p className="text-sm text-red-600 mt-1">
                        {creatorForm.formState.errors.location.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="languages">Languages You Create In</Label>
                    <Input
                      id="languages"
                      {...creatorForm.register("languages")}
                      placeholder="e.g., English, Spanish"
                      disabled={waitlistMutation.isPending}
                    />
                    {creatorForm.formState.errors.languages && (
                      <p className="text-sm text-red-600 mt-1">
                        {creatorForm.formState.errors.languages.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiContent"
                    checked={creatorForm.watch("aiContent")}
                    onCheckedChange={(checked) => creatorForm.setValue("aiContent", checked)}
                    disabled={waitlistMutation.isPending}
                  />
                  <Label htmlFor="aiContent">Are you open to creating AI-generated content using your avatar?</Label>
                </div>

                <div>
                  <Label htmlFor="rateRange">Your Rate Range Per Post / Campaign (Optional)</Label>
                  <Select onValueChange={(value) => creatorForm.setValue("rateRange", value)} disabled={waitlistMutation.isPending}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rate range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<$100">Less than $100</SelectItem>
                      <SelectItem value="$100-$500">$100 - $500</SelectItem>
                      <SelectItem value="$500-$1K">$500 - $1,000</SelectItem>
                      <SelectItem value="$1K-$5K">$1,000 - $5,000</SelectItem>
                      <SelectItem value="$5K+">$5,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="portfolio">Link to Portfolio / Linktree / Personal Website (Optional)</Label>
                  <Input
                    id="portfolio"
                    {...creatorForm.register("portfolio")}
                    placeholder="https://yourportfolio.com"
                    disabled={waitlistMutation.isPending}
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700">
                    🚀 <strong>Early Access Benefits:</strong>
                  </p>
                  <ul className="text-sm text-purple-600 mt-2 space-y-1">
                    <li>• Be the first to access Hiverr when we launch</li>
                    <li>• Special launch pricing and discounts</li>
                    <li>• Direct feedback line to our product team</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={waitlistMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600">
              🔒 We'll only use your info to notify you about early access and potential matches.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}