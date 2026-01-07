import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Play, ArrowRight, ArrowLeft, Check, X, MapPin, Upload, Image, Trash2, Sparkles, Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, FileText, CheckCircle2, FileEdit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandSidebar, MobileSidebar, SidebarProvider } from "@/components/dashboard/brand-sidebar";
import { BrandHeader } from "@/components/dashboard/brand-header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

const industries = [
  "Beauty & Skincare",
  "Fashion & Apparel",
  "Food & Beverage",
  "Health & Fitness",
  "Technology",
  "Home & Garden",
  "Travel & Hospitality",
  "Entertainment",
  "Finance",
  "Education",
];

const regions = [
  {
    name: "North America",
    countries: [
      { code: "CA", name: "Canada", flag: "🇨🇦" },
      { code: "MX", name: "Mexico", flag: "🇲🇽" },
      { code: "US", name: "United States", flag: "🇺🇸" },
    ],
  },
  {
    name: "South America",
    countries: [
      { code: "AR", name: "Argentina", flag: "🇦🇷" },
      { code: "BR", name: "Brazil", flag: "🇧🇷" },
      { code: "CL", name: "Chile", flag: "🇨🇱" },
      { code: "CO", name: "Colombia", flag: "🇨🇴" },
      { code: "PE", name: "Peru", flag: "🇵🇪" },
    ],
  },
  {
    name: "Europe",
    countries: [
      { code: "AT", name: "Austria", flag: "🇦🇹" },
      { code: "BE", name: "Belgium", flag: "🇧🇪" },
      { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
      { code: "HR", name: "Croatia", flag: "🇭🇷" },
      { code: "DK", name: "Denmark", flag: "🇩🇰" },
      { code: "EE", name: "Estonia", flag: "🇪🇪" },
      { code: "FI", name: "Finland", flag: "🇫🇮" },
      { code: "FR", name: "France", flag: "🇫🇷" },
      { code: "DE", name: "Germany", flag: "🇩🇪" },
      { code: "GR", name: "Greece", flag: "🇬🇷" },
      { code: "HU", name: "Hungary", flag: "🇭🇺" },
      { code: "IS", name: "Iceland", flag: "🇮🇸" },
      { code: "IE", name: "Ireland", flag: "🇮🇪" },
      { code: "IT", name: "Italy", flag: "🇮🇹" },
      { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
      { code: "NL", name: "Netherlands", flag: "🇳🇱" },
      { code: "NO", name: "Norway", flag: "🇳🇴" },
      { code: "PL", name: "Poland", flag: "🇵🇱" },
      { code: "PT", name: "Portugal", flag: "🇵🇹" },
      { code: "RO", name: "Romania", flag: "🇷🇴" },
      { code: "RS", name: "Serbia", flag: "🇷🇸" },
      { code: "SK", name: "Slovakia", flag: "🇸🇰" },
      { code: "SI", name: "Slovenia", flag: "🇸🇮" },
      { code: "ES", name: "Spain", flag: "🇪🇸" },
      { code: "SE", name: "Sweden", flag: "🇸🇪" },
      { code: "CH", name: "Switzerland", flag: "🇨🇭" },
      { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    ],
  },
  {
    name: "Asia Pacific",
    countries: [
      { code: "AU", name: "Australia", flag: "🇦🇺" },
      { code: "CN", name: "China", flag: "🇨🇳" },
      { code: "IN", name: "India", flag: "🇮🇳" },
      { code: "ID", name: "Indonesia", flag: "🇮🇩" },
      { code: "JP", name: "Japan", flag: "🇯🇵" },
      { code: "MY", name: "Malaysia", flag: "🇲🇾" },
      { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
      { code: "PH", name: "Philippines", flag: "🇵🇭" },
      { code: "SG", name: "Singapore", flag: "🇸🇬" },
      { code: "KR", name: "South Korea", flag: "🇰🇷" },
      { code: "TH", name: "Thailand", flag: "🇹🇭" },
      { code: "VN", name: "Vietnam", flag: "🇻🇳" },
    ],
  },
  {
    name: "Middle East & Africa",
    countries: [
      { code: "EG", name: "Egypt", flag: "🇪🇬" },
      { code: "IL", name: "Israel", flag: "🇮🇱" },
      { code: "NG", name: "Nigeria", flag: "🇳🇬" },
      { code: "ZA", name: "South Africa", flag: "🇿🇦" },
      { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
    ],
  },
];

const allCountryCodes = regions.flatMap(r => r.countries.map(c => c.code));

const step1Schema = z.object({
  briefName: z.string().min(1, "Title is required!"),
  industry: z.string().min(1, "Topics are required!"),
  websiteUrl: z.string().url("Please enter a valid URL").or(z.literal("")),
  productDescription: z.string().min(10, "Please provide at least 10 characters"),
  targetAudience: z.array(z.string()).min(1, "Please select at least one location"),
});

const step2Schema = z.object({
  inspirationLink: z.string().optional(),
  inspirationDescription: z.string().optional(),
  projectOverview: z.string().min(10, "Project overview is required"),
  contentType: z.string().min(1, "Content type is required"),
  deliverables: z.string().min(1, "Please specify deliverables"),
  budget: z.string().min(1, "Budget is required"),
  timeline: z.string().min(1, "Timeline is required"),
});

const step3Schema = z.object({
  brandGuidelines: z.string().optional(),
  exampleContent: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

const steps = [
  { number: 1, label: "Get Started" },
  { number: 2, label: "Create Brief" },
  { number: 3, label: "Resources" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep > step.number
                  ? "bg-[#8B5CF6] text-white"
                  : currentStep === step.number
                  ? "bg-[#8B5CF6] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
            </div>
            <span className={`text-sm mt-2 ${currentStep >= step.number ? "text-gray-900" : "text-gray-400"}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-32 h-0.5 mx-4 ${
                currentStep > step.number ? "bg-[#8B5CF6]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function TutorialBanner() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setIsVideoOpen(true)}
          data-testid="tutorial-banner-click"
        >
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div className="text-white">
            <h3 className="font-semibold text-lg hover:underline">Creating a new Brief</h3>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              0:49
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-0"
          onClick={() => setIsVideoOpen(true)}
          data-testid="button-watch-tutorial"
        >
          Watch Tutorial
        </Button>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <DialogTitle className="sr-only">Tutorial Video</DialogTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setIsVideoOpen(false)}
              data-testid="button-close-video"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/UdMbWqs2h8w?autoplay=1&start=3"
                title="Creating a new Brief Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TargetAudienceField({ 
  value, 
  onChange, 
  error 
}: { 
  value: string[]; 
  onChange: (value: string[]) => void;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(value);
  const [showAllRegions, setShowAllRegions] = useState(value.length === allCountryCodes.length);

  const handleOpen = () => {
    setTempSelected(value);
    setShowAllRegions(value.length === allCountryCodes.length);
    setIsOpen(true);
  };

  const handleSave = () => {
    onChange(tempSelected);
    setIsOpen(false);
  };

  const toggleCountry = (code: string) => {
    setTempSelected(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
    setShowAllRegions(false);
  };

  const toggleRegion = (regionName: string) => {
    const region = regions.find(r => r.name === regionName);
    if (!region) return;
    
    const regionCodes = region.countries.map(c => c.code);
    const allSelected = regionCodes.every(code => tempSelected.includes(code));
    
    if (allSelected) {
      setTempSelected(prev => prev.filter(c => !regionCodes.includes(c)));
    } else {
      setTempSelected(prev => Array.from(new Set([...prev, ...regionCodes])));
    }
    setShowAllRegions(false);
  };

  const toggleShowAll = () => {
    if (showAllRegions) {
      setTempSelected([]);
      setShowAllRegions(false);
    } else {
      setTempSelected(allCountryCodes);
      setShowAllRegions(true);
    }
  };

  const isRegionSelected = (regionName: string) => {
    const region = regions.find(r => r.name === regionName);
    if (!region) return false;
    return region.countries.every(c => tempSelected.includes(c.code));
  };

  const getDisplayText = () => {
    if (value.length === allCountryCodes.length) {
      return `All ${allCountryCodes.length} countries`;
    }
    if (value.length === 0) {
      return "Select locations";
    }
    return `${value.length} countries selected`;
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-gray-600 text-sm font-medium">Target Audience</label>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between bg-white"
          onClick={handleOpen}
          data-testid="button-target-audience"
        >
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            {getDisplayText()}
          </span>
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogTitle className="text-xl font-semibold">Filter by Location</DialogTitle>
          
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-6">
              {regions.map((region) => (
                <div key={region.name} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`region-${region.name}`}
                      checked={isRegionSelected(region.name)}
                      onCheckedChange={() => toggleRegion(region.name)}
                      className="data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                    />
                    <label 
                      htmlFor={`region-${region.name}`}
                      className="font-semibold text-gray-900 cursor-pointer"
                    >
                      {region.name} (All)
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2 ml-6">
                    {region.countries.map((country) => (
                      <div key={country.code} className="flex items-center gap-2">
                        <Checkbox
                          id={`country-${country.code}`}
                          checked={tempSelected.includes(country.code)}
                          onCheckedChange={() => toggleCountry(country.code)}
                          className="data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                        />
                        <label 
                          htmlFor={`country-${country.code}`}
                          className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                        >
                          {country.name} <span>{country.flag}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center gap-2 pt-4 border-t">
            <Checkbox
              id="show-all-regions"
              checked={showAllRegions}
              onCheckedChange={toggleShowAll}
              className="data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
            />
            <label htmlFor="show-all-regions" className="text-sm text-gray-700 cursor-pointer">
              Show creators from all regions
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
              onClick={handleSave}
              data-testid="button-save-locations"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface UploadedFile {
  name: string;
  size: number;
  preview: string;
}

export default function BrandCreateBrief() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [brandAssets, setBrandAssets] = useState<UploadedFile[]>([]);
  const [inspirationLinks, setInspirationLinks] = useState<{link: string, description: string}[]>([]);
  const [createdBriefId, setCreatedBriefId] = useState<number | null>(null);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      briefName: "",
      industry: "",
      websiteUrl: "",
      productDescription: "",
      targetAudience: allCountryCodes,
    },
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      inspirationLink: "",
      inspirationDescription: "",
      projectOverview: "",
      contentType: "",
      deliverables: "",
      budget: "",
      timeline: "",
    },
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      brandGuidelines: "",
      exampleContent: "",
      additionalNotes: "",
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
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

  const handleStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const createBriefMutation = useMutation({
    mutationFn: async (briefData: any) => {
      const response = await apiRequest('/api/briefs', 'POST', briefData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/briefs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/briefs/counts'] });
      setCreatedBriefId(data.id);
      setCurrentStep(4);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create brief",
        variant: "destructive",
      });
    },
  });

  const handleStep3Submit = (data: Step3Data) => {
    const briefPayload = {
      title: step1Data?.briefName || "Untitled Brief",
      projectDescription: step1Data?.productDescription || "",
      targetPlatforms: [], // TODO: Add platforms field
      contentType: step2Data?.contentType || "",
      brandAssets: brandAssets,
      inspirationLinks: inspirationLinks,
      deliverables: step2Data?.deliverables || "",
      timeline: step2Data?.timeline || "",
      budget: step2Data?.budget ? parseInt(step2Data.budget.replace(/\D/g, '')) * 100 : 0,
      targetAudience: step1Data?.targetAudience?.join(', ') || "",
      requirements: data.brandGuidelines || "",
      notes: data.additionalNotes || "",
      status: 'draft',
    };
    
    createBriefMutation.mutate(briefPayload);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <BrandSidebar />
        <MobileSidebar />
        
        <div className="lg:ml-64">
          <BrandHeader title="Brief Details" breadcrumb={["Briefs", "Brief Details"]} />
          
          <main className="p-4 md:p-6 max-w-4xl mx-auto">
          {currentStep < 4 && <StepIndicator currentStep={currentStep} />}

          {currentStep === 1 && (
            <>
              <TutorialBanner />
              
              <Form {...step1Form}>
                <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      control={step1Form.control}
                      name="briefName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Brief name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Opportunity name" 
                              className="bg-white"
                              data-testid="input-brief-name"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step1Form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Choose Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white" data-testid="select-industry">
                                <SelectValue placeholder="Choose Industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={step1Form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-semibold">Website</FormLabel>
                        <p className="text-sm text-gray-500 mb-2">Where can creators learn more about your brand</p>
                        <FormControl>
                          <Input 
                            placeholder="Website URL" 
                            className="bg-white"
                            data-testid="input-website"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="productDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-semibold">Describe your product</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Product description" 
                            className="bg-white min-h-[120px]"
                            data-testid="input-description"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-[#8B5CF6] text-sm">
                      This description will be used by AI to help you create your brief and will not be visible to creators
                    </p>
                  </div>

                  <FormField
                    control={step1Form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <TargetAudienceField 
                        value={field.value} 
                        onChange={field.onChange}
                        error={step1Form.formState.errors.targetAudience?.message}
                      />
                    )}
                  />

                  <div className="space-y-3">
                    <label className="text-gray-900 font-semibold">Brand Assets</label>
                    <p className="text-sm text-gray-500">Upload logos, product images, or other brand materials</p>
                    
                    <div 
                      className="border-2 border-dashed border-pink-400 rounded-lg p-8 text-center hover:border-pink-500 transition-colors cursor-pointer bg-white"
                      onClick={() => document.getElementById('brand-assets-input')?.click()}
                      data-testid="upload-brand-assets"
                    >
                      <input
                        id="brand-assets-input"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files) return;
                          
                          Array.from(files).forEach(file => {
                            if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
                              toast({
                                title: "Invalid file type",
                                description: `${file.name} is not a JPG, PNG, or PDF file.`,
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            if (file.size > 20 * 1024 * 1024) {
                              toast({
                                title: "File too large",
                                description: `${file.name} exceeds 20MB limit.`,
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setBrandAssets(prev => [...prev, {
                                name: file.name,
                                size: file.size,
                                preview: file.type === 'application/pdf' ? '' : reader.result as string,
                              }]);
                            };
                            reader.readAsDataURL(file);
                          });
                          
                          e.target.value = '';
                        }}
                      />
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Drag, drop or browse <span className="text-pink-500 font-medium">file</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">Max file size: 20MB (JPG, PNG, PDF)</p>

                    {brandAssets.length > 0 && (
                      <div className="space-y-3 mt-4">
                        {brandAssets.map((file, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 flex items-center justify-center">
                              {file.name.toLowerCase().endsWith('.pdf') ? (
                                <FileText className="w-8 h-8 text-white" />
                              ) : (
                                <img 
                                  src={file.preview} 
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} · {(file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setBrandAssets(prev => prev.filter((_, i) => i !== index))}
                              className="text-pink-500 hover:text-pink-600 p-2"
                              data-testid={`button-remove-asset-${index}`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                      data-testid="button-next-step"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}

          {currentStep === 2 && (
            <>
              <TutorialBanner />
              <Form {...step2Form}>
                <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Inspiration</h2>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-orange-700 text-sm">
                          We recommend adding one TikTok, Instagram or Facebook video for inspiration so our AI can generate the best brief. Other links can still be added and will be visible to creators.
                        </p>
                      </div>

                      <FormField
                        control={step2Form.control}
                        name="inspirationLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Paste link" 
                                className="bg-white border-pink-400 focus:border-pink-500"
                                data-testid="input-inspiration-link"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={step2Form.control}
                        name="inspirationDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                placeholder="Description" 
                                className="bg-white min-h-[100px]"
                                data-testid="input-inspiration-description"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="text-gray-500 border-gray-300"
                          data-testid="button-add-link"
                          onClick={() => {
                            const link = step2Form.getValues("inspirationLink") || "";
                            const description = step2Form.getValues("inspirationDescription") || "";
                            if (link.trim()) {
                              setInspirationLinks(prev => [...prev, { link: link.trim(), description: description }]);
                              step2Form.setValue("inspirationLink", "");
                              step2Form.setValue("inspirationDescription", "");
                              toast({
                                title: "Link added",
                                description: "You can add more inspiration links.",
                              });
                            } else {
                              toast({
                                title: "Please enter a link",
                                description: "The link field cannot be empty.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Add Link
                        </Button>
                      </div>

                      {inspirationLinks.length > 0 && (
                        <div className="space-y-3 border-t pt-4">
                          <p className="text-sm font-medium text-gray-700">Added Links ({inspirationLinks.length})</p>
                          {inspirationLinks.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#8B5CF6] truncate">{item.link}</p>
                                {item.description && (
                                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setInspirationLinks(prev => prev.filter((_, i) => i !== index))}
                                className="text-pink-500 hover:text-pink-600 p-1"
                                data-testid={`button-remove-link-${index}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
                        <Button 
                          type="button"
                          variant="outline"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                          data-testid="button-generate-overview"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate with AI
                        </Button>
                      </div>

                      <FormField
                        control={step2Form.control}
                        name="projectOverview"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 border-b px-3 py-2 flex items-center gap-2 flex-wrap">
                                  <select className="text-sm border rounded px-2 py-1 bg-white">
                                    <option>Paragraph</option>
                                    <option>Heading 1</option>
                                    <option>Heading 2</option>
                                  </select>
                                  <div className="h-4 w-px bg-gray-300" />
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Bold className="w-4 h-4" /></button>
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Italic className="w-4 h-4" /></button>
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Underline className="w-4 h-4" /></button>
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Strikethrough className="w-4 h-4" /></button>
                                  <div className="h-4 w-px bg-gray-300" />
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><List className="w-4 h-4" /></button>
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><ListOrdered className="w-4 h-4" /></button>
                                  <div className="h-4 w-px bg-gray-300" />
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignLeft className="w-4 h-4" /></button>
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignCenter className="w-4 h-4" /></button>
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignRight className="w-4 h-4" /></button>
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignJustify className="w-4 h-4" /></button>
                                  <div className="h-4 w-px bg-gray-300" />
                                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><LinkIcon className="w-4 h-4" /></button>
                                </div>
                                <Textarea 
                                  placeholder="Write something awesome..." 
                                  className="border-0 min-h-[150px] rounded-none focus-visible:ring-0"
                                  data-testid="input-project-overview"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Brief Details</h2>

                      <FormField
                        control={step2Form.control}
                        name="contentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">Content Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white" data-testid="select-content-type">
                                  <SelectValue placeholder="Select content type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ugc-video">UGC Video</SelectItem>
                                <SelectItem value="photo">Photo Content</SelectItem>
                                <SelectItem value="testimonial">Testimonial</SelectItem>
                                <SelectItem value="unboxing">Unboxing</SelectItem>
                                <SelectItem value="tutorial">Tutorial/How-to</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={step2Form.control}
                        name="deliverables"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">Deliverables</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe what you expect from creators (e.g., 1 x 30-second video, 3 x photos)" 
                                className="bg-white min-h-[100px]"
                                data-testid="input-deliverables"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                          control={step2Form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-600">Budget per Creator</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white" data-testid="select-budget">
                                    <SelectValue placeholder="Select budget range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="25-50">$25 - $50</SelectItem>
                                  <SelectItem value="50-100">$50 - $100</SelectItem>
                                  <SelectItem value="100-250">$100 - $250</SelectItem>
                                  <SelectItem value="250-500">$250 - $500</SelectItem>
                                  <SelectItem value="500+">$500+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={step2Form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-600">Timeline</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white" data-testid="select-timeline">
                                    <SelectValue placeholder="Select timeline" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1-week">1 Week</SelectItem>
                                  <SelectItem value="2-weeks">2 Weeks</SelectItem>
                                  <SelectItem value="1-month">1 Month</SelectItem>
                                  <SelectItem value="ongoing">Ongoing</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleBack}
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                    data-testid="button-next-step"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
            </>
          )}

          {currentStep === 3 && (
            <Form {...step3Form}>
              <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-6">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Resources & Guidelines</h2>

                    <FormField
                      control={step3Form.control}
                      name="brandGuidelines"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Brand Guidelines (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share any brand guidelines, tone of voice, or style preferences" 
                              className="bg-white min-h-[100px]"
                              data-testid="input-guidelines"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step3Form.control}
                      name="exampleContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Example Content Links (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share links to content that inspires you or matches your vision" 
                              className="bg-white min-h-[80px]"
                              data-testid="input-examples"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step3Form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any other information creators should know" 
                              className="bg-white min-h-[80px]"
                              data-testid="input-notes"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <label className="text-gray-600 text-sm font-medium">Brand Assets (Optional)</label>
                      <p className="text-sm text-gray-500">Upload logos, product images, or other brand materials. JPG, PNG, and PDF accepted, max 20MB per file.</p>
                      
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8B5CF6] transition-colors cursor-pointer"
                        onClick={() => document.getElementById('brand-assets-input-step3')?.click()}
                        data-testid="upload-brand-assets-step3"
                      >
                        <input
                          id="brand-assets-input-step3"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (!files) return;
                            
                            Array.from(files).forEach(file => {
                              if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
                                toast({
                                  title: "Invalid file type",
                                  description: `${file.name} is not a JPG, PNG, or PDF file.`,
                                  variant: "destructive",
                                });
                                return;
                              }
                              
                              if (file.size > 20 * 1024 * 1024) {
                                toast({
                                  title: "File too large",
                                  description: `${file.name} exceeds 20MB limit.`,
                                  variant: "destructive",
                                });
                                return;
                              }
                              
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setBrandAssets(prev => [...prev, {
                                  name: file.name,
                                  size: file.size,
                                  preview: file.type === 'application/pdf' ? '' : reader.result as string,
                                }]);
                              };
                              reader.readAsDataURL(file);
                            });
                            
                            e.target.value = '';
                          }}
                        />
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF up to 20MB</p>
                      </div>

                      {brandAssets.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {brandAssets.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                                {file.name.toLowerCase().endsWith('.pdf') ? (
                                  <FileText className="w-12 h-12 text-gray-500" />
                                ) : (
                                  <img 
                                    src={file.preview} 
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setBrandAssets(prev => prev.filter((_, i) => i !== index))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                data-testid={`button-remove-asset-${index}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleBack}
                    disabled={createBriefMutation.isPending}
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                    disabled={createBriefMutation.isPending}
                    data-testid="button-create-brief"
                  >
                    {createBriefMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Create Brief
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Brief Created!</h2>
              <p className="text-gray-600 text-center max-w-md mb-8">
                Your brief has been saved as a draft. Finish setting it up to publish and start receiving proposals from creators.
              </p>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="px-6"
                  onClick={() => setLocation("/brand/dashboard/briefs")}
                  data-testid="button-view-draft"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Draft
                </Button>
                <Button
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] px-6"
                  onClick={() => {
                    if (createdBriefId) {
                      setLocation(`/brand/dashboard/briefs/${createdBriefId}/edit`);
                    } else {
                      setLocation("/brand/dashboard/briefs");
                    }
                  }}
                  data-testid="button-finish-setup"
                >
                  <FileEdit className="w-4 h-4 mr-2" />
                  Finish Setup
                </Button>
              </div>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg max-w-lg">
                <h3 className="font-semibold text-gray-900 mb-2">What's next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Review and complete all brief details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Add any additional brand assets or guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Publish to start receiving creator proposals</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
