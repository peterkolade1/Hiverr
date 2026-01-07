import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { HiverWordmark } from "@/components/hiver-logo";
import { Image, Check } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+1", flag: "🇨🇦", label: "CA" },
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+81", flag: "🇯🇵", label: "JP" },
  { code: "+86", flag: "🇨🇳", label: "CN" },
];

export default function BrandProfile() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('onboarding_path', '/onboarding/brand');
  }, []);
  
  const [formData, setFormData] = useState({
    brandName: "",
    brandLogo: null as File | null,
    website: "",
    selectedCountry: 0,
    phoneNumber: "",
    howDidYouFindUs: "",
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, brandLogo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    sessionStorage.setItem('brandOnboardingData', JSON.stringify({
      ...formData,
      phone: `${COUNTRY_CODES[formData.selectedCountry].code}${formData.phoneNumber}`,
    }));
    setLocation("/onboarding/brand/trial");
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
            Welcome {user?.firstName || 'there'}!
          </h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div>
              <Label htmlFor="brandName" className="text-base font-semibold">
                Brand Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="brandName"
                placeholder="Your brand name"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="mt-2 h-12 text-base"
                data-testid="input-brand-name"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Brand Logo</p>
                <p className="text-sm text-gray-500">Recommended 200x200</p>
              </div>
              <Button 
                type="button" 
                size="sm"
                className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-upload-logo"
              >
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            <div>
              <Label htmlFor="website" className="text-base font-semibold">
                Brand Website<span className="text-red-500">*</span>
              </Label>
              <Input
                id="website"
                placeholder="www.yourbrand.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-2 h-12 text-base"
                data-testid="input-website"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-base font-semibold">
                Phone Number<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 mt-2">
                <Select 
                  value={String(formData.selectedCountry)} 
                  onValueChange={(value) => setFormData({ ...formData, selectedCountry: parseInt(value) })}
                >
                  <SelectTrigger className="w-28 h-12" data-testid="select-phone-code">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span>{COUNTRY_CODES[formData.selectedCountry].flag}</span>
                        <span>{COUNTRY_CODES[formData.selectedCountry].code}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((country, index) => (
                      <SelectItem key={index} value={String(index)}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                          <span className="text-gray-400">{country.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1 relative">
                  <Input
                    id="phone"
                    placeholder="Your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                    className="h-12 text-base pr-10"
                    data-testid="input-phone"
                    required
                  />
                  {formData.phoneNumber.length >= 10 && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="howFound" className="text-base font-semibold">
                How did you find us?<span className="text-red-500">*</span> <span className="text-gray-400 font-normal text-sm">Required</span>
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
                  <SelectItem value="referral">Friend/Colleague Referral</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="blog">Blog/Article</SelectItem>
                  <SelectItem value="event">Event/Conference</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleContinue}
                disabled={!formData.brandName || !formData.website || !formData.phoneNumber || !formData.howDidYouFindUs}
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
