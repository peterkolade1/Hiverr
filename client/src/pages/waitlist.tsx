import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, Building2, Upload, CheckCircle, Check, ChevronsUpDown, X, Shield, AlertCircle, Loader2 } from "lucide-react";
import facebookIcon from "@assets/2023_Facebook_icon.svg_1752884478102.webp";
import tiktokIcon from "@assets/download (18)_1752884478109.png";
import instagramIcon from "@assets/Instagram_logo_2016.svg_1752884478110.png";
import youtubeIcon from "@assets/YouTube_full-color_icon_(2017).svg_1752884478110.png";
import xIcon from "@assets/X_icon.svg_1752884478111.png";

const brandFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z.string().min(2, "Company website or IG handle is required"),
  role: z.string().min(1, "Role is required"),
  creatorsLooking: z.string().min(1, "Please select a creator type"),
  budgetRange: z.string().min(1, "Budget range is required"),
  hasCampaign: z.boolean(),
  launchTiming: z.string().min(1, "Launch timing is required"),
});

const creatorFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  profilePicture: z.string().optional(),
  selectedPlatforms: z.array(z.string()).min(1, "Select at least one platform"),
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
  languages: z.array(z.string()).min(1, "Select at least one language"),
  aiContent: z.boolean(),
});

type BrandForm = z.infer<typeof brandFormSchema>;
type CreatorForm = z.infer<typeof creatorFormSchema>;

// Country/City data
const locations = [
  "New York, USA", "Los Angeles, USA", "Chicago, USA", "Houston, USA", "Phoenix, USA",
  "London, UK", "Manchester, UK", "Birmingham, UK", "Glasgow, UK", "Edinburgh, UK",
  "Toronto, Canada", "Vancouver, Canada", "Montreal, Canada", "Calgary, Canada", "Ottawa, Canada",
  "Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia", "Perth, Australia", "Adelaide, Australia",
  "Berlin, Germany", "Munich, Germany", "Hamburg, Germany", "Frankfurt, Germany", "Stuttgart, Germany",
  "Paris, France", "Lyon, France", "Marseille, France", "Nice, France", "Toulouse, France",
  "Tokyo, Japan", "Osaka, Japan", "Kyoto, Japan", "Yokohama, Japan", "Nagoya, Japan",
  "Seoul, South Korea", "Busan, South Korea", "Incheon, South Korea", "Daegu, South Korea",
  "Mumbai, India", "Delhi, India", "Bangalore, India", "Hyderabad, India", "Chennai, India",
  "São Paulo, Brazil", "Rio de Janeiro, Brazil", "Brasília, Brazil", "Salvador, Brazil",
  "Mexico City, Mexico", "Guadalajara, Mexico", "Monterrey, Mexico", "Puebla, Mexico",
  "Amsterdam, Netherlands", "Rotterdam, Netherlands", "The Hague, Netherlands", "Utrecht, Netherlands",
  "Stockholm, Sweden", "Gothenburg, Sweden", "Malmö, Sweden", "Uppsala, Sweden",
  "Copenhagen, Denmark", "Aarhus, Denmark", "Odense, Denmark", "Aalborg, Denmark",
  "Zurich, Switzerland", "Geneva, Switzerland", "Basel, Switzerland", "Bern, Switzerland",
  "Vienna, Austria", "Graz, Austria", "Linz, Austria", "Salzburg, Austria",
  "Brussels, Belgium", "Antwerp, Belgium", "Ghent, Belgium", "Bruges, Belgium",
  "Dublin, Ireland", "Cork, Ireland", "Limerick, Ireland", "Galway, Ireland",
  "Madrid, Spain", "Barcelona, Spain", "Valencia, Spain", "Seville, Spain",
  "Rome, Italy", "Milan, Italy", "Naples, Italy", "Turin, Italy",
  "Lisbon, Portugal", "Porto, Portugal", "Braga, Portugal", "Coimbra, Portugal",
  "Oslo, Norway", "Bergen, Norway", "Trondheim, Norway", "Stavanger, Norway",
  "Helsinki, Finland", "Espoo, Finland", "Tampere, Finland", "Vantaa, Finland",
  "Warsaw, Poland", "Krakow, Poland", "Wrocław, Poland", "Poznań, Poland",
  "Prague, Czech Republic", "Brno, Czech Republic", "Ostrava, Czech Republic",
  "Budapest, Hungary", "Debrecen, Hungary", "Szeged, Hungary", "Miskolc, Hungary",
  "Bucharest, Romania", "Cluj-Napoca, Romania", "Timișoara, Romania", "Iași, Romania",
  "Sofia, Bulgaria", "Plovdiv, Bulgaria", "Varna, Bulgaria", "Burgas, Bulgaria",
  "Zagreb, Croatia", "Split, Croatia", "Rijeka, Croatia", "Osijek, Croatia",
  "Belgrade, Serbia", "Novi Sad, Serbia", "Niš, Serbia", "Kragujevac, Serbia",
  "Ljubljana, Slovenia", "Maribor, Slovenia", "Celje, Slovenia", "Koper, Slovenia",
  "Bratislava, Slovakia", "Košice, Slovakia", "Prešov, Slovakia", "Žilina, Slovakia",
  "Tallinn, Estonia", "Tartu, Estonia", "Narva, Estonia", "Pärnu, Estonia",
  "Riga, Latvia", "Daugavpils, Latvia", "Liepāja, Latvia", "Jelgava, Latvia",
  "Vilnius, Lithuania", "Kaunas, Lithuania", "Klaipėda, Lithuania", "Šiauliai, Lithuania",
  "Athens, Greece", "Thessaloniki, Greece", "Patras, Greece", "Heraklion, Greece",
  "Istanbul, Turkey", "Ankara, Turkey", "Izmir, Turkey", "Bursa, Turkey",
  "Tel Aviv, Israel", "Jerusalem, Israel", "Haifa, Israel", "Rishon LeZion, Israel",
  "Cairo, Egypt", "Alexandria, Egypt", "Giza, Egypt", "Shubra El-Kheima, Egypt",
  "Dubai, UAE", "Abu Dhabi, UAE", "Sharjah, UAE", "Al Ain, UAE",
  "Riyadh, Saudi Arabia", "Jeddah, Saudi Arabia", "Mecca, Saudi Arabia", "Medina, Saudi Arabia",
  "Doha, Qatar", "Al Rayyan, Qatar", "Umm Salal, Qatar", "Al Wakrah, Qatar",
  "Kuwait City, Kuwait", "Hawalli, Kuwait", "Salmiya, Kuwait", "Farwaniya, Kuwait",
  "Manama, Bahrain", "Riffa, Bahrain", "Muharraq, Bahrain", "Hamad Town, Bahrain",
  "Muscat, Oman", "Seeb, Oman", "Salalah, Oman", "Bawshar, Oman",
  "Amman, Jordan", "Zarqa, Jordan", "Irbid, Jordan", "Russeifa, Jordan",
  "Beirut, Lebanon", "Tripoli, Lebanon", "Sidon, Lebanon", "Tyre, Lebanon",
  "Damascus, Syria", "Aleppo, Syria", "Homs, Syria", "Lattakia, Syria",
  "Baghdad, Iraq", "Basra, Iraq", "Mosul, Iraq", "Erbil, Iraq",
  "Tehran, Iran", "Mashhad, Iran", "Isfahan, Iran", "Karaj, Iran",
  "Kabul, Afghanistan", "Kandahar, Afghanistan", "Herat, Afghanistan", "Mazar-i-Sharif, Afghanistan",
  "Karachi, Pakistan", "Lahore, Pakistan", "Faisalabad, Pakistan", "Rawalpindi, Pakistan",
  "Dhaka, Bangladesh", "Chittagong, Bangladesh", "Sylhet, Bangladesh", "Khulna, Bangladesh",
  "Colombo, Sri Lanka", "Dehiwala-Mount Lavinia, Sri Lanka", "Moratuwa, Sri Lanka", "Jaffna, Sri Lanka",
  "Kathmandu, Nepal", "Pokhara, Nepal", "Lalitpur, Nepal", "Bharatpur, Nepal",
  "Thimphu, Bhutan", "Phuentsholing, Bhutan", "Punakha, Bhutan", "Wangdue, Bhutan",
  "Malé, Maldives", "Addu City, Maldives", "Fuvahmulah, Maldives", "Kulhudhuffushi, Maldives",
  "Bangkok, Thailand", "Nonthaburi, Thailand", "Pak Kret, Thailand", "Hat Yai, Thailand",
  "Ho Chi Minh City, Vietnam", "Hanoi, Vietnam", "Haiphong, Vietnam", "Can Tho, Vietnam",
  "Phnom Penh, Cambodia", "Siem Reap, Cambodia", "Battambang, Cambodia", "Sihanoukville, Cambodia",
  "Vientiane, Laos", "Savannakhet, Laos", "Pakse, Laos", "Luang Prabang, Laos",
  "Yangon, Myanmar", "Mandalay, Myanmar", "Naypyidaw, Myanmar", "Mawlamyine, Myanmar",
  "Kuala Lumpur, Malaysia", "George Town, Malaysia", "Ipoh, Malaysia", "Johor Bahru, Malaysia",
  "Singapore", "Woodlands, Singapore", "Tampines, Singapore", "Jurong West, Singapore",
  "Jakarta, Indonesia", "Surabaya, Indonesia", "Bandung, Indonesia", "Bekasi, Indonesia",
  "Manila, Philippines", "Quezon City, Philippines", "Caloocan, Philippines", "Davao, Philippines",
  "Bandar Seri Begawan, Brunei", "Kuala Belait, Brunei", "Seria, Brunei", "Tutong, Brunei",
  "Dili, East Timor", "Baucau, East Timor", "Maliana, East Timor", "Suai, East Timor",
  "Beijing, China", "Shanghai, China", "Guangzhou, China", "Shenzhen, China",
  "Taipei, Taiwan", "Kaohsiung, Taiwan", "Taichung, Taiwan", "Tainan, Taiwan",
  "Hong Kong", "Kowloon, Hong Kong", "New Territories, Hong Kong", "Lantau Island, Hong Kong",
  "Macau", "Taipa, Macau", "Coloane, Macau", "Cotai, Macau",
  "Ulaanbaatar, Mongolia", "Erdenet, Mongolia", "Darkhan, Mongolia", "Choibalsan, Mongolia",
  "Pyongyang, North Korea", "Hamhung, North Korea", "Chongjin, North Korea", "Nampo, North Korea",
  "Almaty, Kazakhstan", "Nur-Sultan, Kazakhstan", "Shymkent, Kazakhstan", "Aktobe, Kazakhstan",
  "Bishkek, Kyrgyzstan", "Osh, Kyrgyzstan", "Jalal-Abad, Kyrgyzstan", "Karakol, Kyrgyzstan",
  "Tashkent, Uzbekistan", "Samarkand, Uzbekistan", "Namangan, Uzbekistan", "Andijan, Uzbekistan",
  "Dushanbe, Tajikistan", "Khujand, Tajikistan", "Kulob, Tajikistan", "Qurghonteppa, Tajikistan",
  "Ashgabat, Turkmenistan", "Turkmenbashi, Turkmenistan", "Dashoguz, Turkmenistan", "Mary, Turkmenistan",
  "Baku, Azerbaijan", "Ganja, Azerbaijan", "Sumqayit, Azerbaijan", "Mingachevir, Azerbaijan",
  "Yerevan, Armenia", "Gyumri, Armenia", "Vanadzor, Armenia", "Vagharshapat, Armenia",
  "Tbilisi, Georgia", "Kutaisi, Georgia", "Batumi, Georgia", "Rustavi, Georgia",
  "Moscow, Russia", "Saint Petersburg, Russia", "Novosibirsk, Russia", "Yekaterinburg, Russia",
  "Minsk, Belarus", "Gomel, Belarus", "Mogilev, Belarus", "Vitebsk, Belarus",
  "Kyiv, Ukraine", "Kharkiv, Ukraine", "Odesa, Ukraine", "Dnipro, Ukraine",
  "Chișinău, Moldova", "Tiraspol, Moldova", "Bălți, Moldova", "Bender, Moldova",
  "Other"
];

// Language data
const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Chinese (Mandarin)",
  "Chinese (Cantonese)", "Japanese", "Korean", "Arabic", "Hindi", "Bengali", "Punjabi", "Telugu",
  "Marathi", "Tamil", "Urdu", "Gujarati", "Malayalam", "Kannada", "Odia", "Assamese",
  "Maithili", "Santali", "Kashmiri", "Nepali", "Sindhi", "Konkani", "Dogri", "Manipuri",
  "Bodo", "Sanskrit", "Thai", "Vietnamese", "Indonesian", "Malay", "Tagalog", "Burmese",
  "Khmer", "Lao", "Mongolian", "Tibetan", "Dzongkha", "Sinhala", "Dari", "Pashto",
  "Persian", "Kurdish", "Turkish", "Azerbaijani", "Georgian", "Armenian", "Hebrew",
  "Amharic", "Somali", "Swahili", "Yoruba", "Igbo", "Hausa", "Zulu", "Xhosa",
  "Afrikaans", "Shona", "Ndebele", "Setswana", "Sesotho", "Tsonga", "Venda", "Siswati",
  "Malagasy", "Mauritanian Arabic", "Wolof", "Fula", "Mandinka", "Bambara", "Akan",
  "Ewe", "Ga", "Dagbani", "Twi", "Fante", "Dagaare", "Kusaal", "Mampruli",
  "Dutch", "Flemish", "Frisian", "Luxembourgish", "Walloon", "Breton", "Corsican",
  "Catalan", "Basque", "Galician", "Asturian", "Aragonese", "Mirandese", "Leonese",
  "Extremaduran", "Fala", "Sardinian", "Sicilian", "Neapolitan", "Venetian", "Lombard",
  "Piedmontese", "Ligurian", "Emilian-Romagnol", "Friulian", "Ladin", "Romansh",
  "Albanian", "Macedonian", "Bulgarian", "Serbian", "Croatian", "Bosnian", "Montenegrin",
  "Slovenian", "Slovak", "Czech", "Polish", "Hungarian", "Romanian", "Moldovan",
  "Ukrainian", "Belarusian", "Lithuanian", "Latvian", "Estonian", "Finnish", "Sami",
  "Icelandic", "Faroese", "Norwegian", "Danish", "Swedish", "Yiddish", "Ladino",
  "Romani", "Rusyn", "Silesian", "Kashubian", "Sorbian", "Maltese", "Irish", "Scottish Gaelic",
  "Welsh", "Cornish", "Manx", "Occitan", "Franco-Provençal", "Picard",
  "Norman", "Jèrriais", "Guernésiais", "Sercquiais", "Auregnais", "Other"
];

const followerRanges = [
  "1K - 5K",
  "5K - 10K", 
  "10K - 25K",
  "25K - 50K",
  "50K - 100K",
  "100K - 250K",
  "250K - 500K",
  "500K - 1M",
  "1M - 2.5M",
  "2.5M - 5M",
  "5M - 10M",
  "10M+"
];

const subscriberRanges = [
  "100 - 1K",
  "1K - 5K",
  "5K - 10K",
  "10K - 25K", 
  "25K - 50K",
  "50K - 100K",
  "100K - 250K",
  "250K - 500K",
  "500K - 1M",
  "1M - 2.5M",
  "2.5M - 5M",
  "5M - 10M",
  "10M+"
];

export default function Waitlist() {
  const [userType, setUserType] = useState<"brand" | "creator">("brand");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [platformFiles, setPlatformFiles] = useState<Record<string, File | null>>({
    instagram: null,
    tiktok: null,
    youtube: null,
    twitter: null,
    facebook: null,
  });
  const [locationOpen, setLocationOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [instagramFollowersOpen, setInstagramFollowersOpen] = useState(false);
  const [tiktokFollowersOpen, setTiktokFollowersOpen] = useState(false);
  const [youtubeSubsOpen, setYoutubeSubsOpen] = useState(false);
  const [fieldValidation, setFieldValidation] = useState<Record<string, 'idle' | 'validating' | 'valid' | 'error'>>({});
  const [formProgress, setFormProgress] = useState(0);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const platformInputRefs = useRef<Record<string, HTMLInputElement | null>>({
    instagram: null,
    tiktok: null,
    youtube: null,
    twitter: null,
    facebook: null,
  });
  const { toast } = useToast();

  // Helper function to calculate form completion progress
  const calculateProgress = (form: any, userType: string) => {
    if (userType === "brand") {
      const requiredFields = ["fullName", "email", "companyName", "companyWebsite", "role", "creatorsLooking", "budgetRange", "launchTiming"];
      const completedFields = requiredFields.filter(field => {
        const value = form.watch(field);
        return value && value.length > 0;
      });
      return Math.round((completedFields.length / requiredFields.length) * 100);
    } else {
      const requiredFields = ["fullName", "email", "selectedPlatforms", "niches", "location", "languages"];
      const completedFields = requiredFields.filter(field => {
        const value = form.watch(field);
        if (Array.isArray(value)) return value.length > 0;
        return value && value.length > 0;
      });
      return Math.round((completedFields.length / requiredFields.length) * 100);
    }
  };

  // Helper function to check if brand form is complete
  const isBrandFormComplete = () => {
    const formValues = brandForm.watch();
    return (
      formValues.fullName?.length > 1 &&
      formValues.email?.includes('@') &&
      formValues.companyName?.length > 1 &&
      formValues.companyWebsite?.length > 1 &&
      formValues.role?.length > 0 &&
      formValues.creatorsLooking?.length > 0 &&
      formValues.budgetRange?.length > 0 &&
      formValues.launchTiming?.length > 0
    );
  };

  // Helper function to validate field in real-time
  const validateField = async (fieldName: string, value: any, schema: any) => {
    setFieldValidation(prev => ({ ...prev, [fieldName]: 'validating' }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate validation delay
      schema.pick({ [fieldName]: true }).parse({ [fieldName]: value });
      setFieldValidation(prev => ({ ...prev, [fieldName]: 'valid' }));
    } catch (error) {
      setFieldValidation(prev => ({ ...prev, [fieldName]: 'error' }));
    }
  };

  // Helper function to get field validation icon
  const getValidationIcon = (fieldName: string, hasError: boolean) => {
    const state = fieldValidation[fieldName];
    if (state === 'validating') return <Loader2 size={16} className="animate-spin text-blue-500" />;
    if (state === 'valid' && !hasError) return <CheckCircle size={16} className="text-green-500" />;
    if (hasError) return <AlertCircle size={16} className="text-red-500" />;
    return null;
  };

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
    },
  });

  const creatorForm = useForm<CreatorForm>({
    resolver: zodResolver(creatorFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      profilePicture: "",
      selectedPlatforms: [],
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
      languages: [],
      aiContent: false,
    },
  });

  // Update form progress in real-time
  useEffect(() => {
    const currentForm = userType === "brand" ? brandForm : creatorForm;
    const progress = calculateProgress(currentForm, userType);
    setFormProgress(progress);
  }, [userType, brandForm.watch(), creatorForm.watch()]);

  // Real-time validation for key fields
  useEffect(() => {
    const currentForm = userType === "brand" ? brandForm : creatorForm;
    const schema = userType === "brand" ? brandFormSchema : creatorFormSchema;
    
    const subscription = currentForm.watch((value, { name }) => {
      if (name && value[name]) {
        validateField(name, value[name], schema);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [userType]);

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
    // Transform arrays to JSON strings for backend
    const transformedData = {
      ...data,
      niches: JSON.stringify(data.niches),
      selectedPlatforms: JSON.stringify(data.selectedPlatforms),
      languages: JSON.stringify(data.languages),
    };
    waitlistMutation.mutate(transformedData);
  };



  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please choose a file under 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please choose a JPG or PNG file",
          variant: "destructive",
        });
        return;
      }
      setProfilePictureFile(file);
      creatorForm.setValue("profilePicture", file.name);
    }
  };



  const removeProfilePicture = () => {
    setProfilePictureFile(null);
    creatorForm.setValue("profilePicture", "");
    if (profilePictureInputRef.current) {
      profilePictureInputRef.current.value = "";
    }
  };

  const handlePlatformImageUpload = (platform: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please choose a file under 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please choose a JPG or PNG file",
          variant: "destructive",
        });
        return;
      }
      setPlatformFiles(prev => ({ ...prev, [platform]: file }));
    }
  };

  const removePlatformImage = (platform: string) => {
    setPlatformFiles(prev => ({ ...prev, [platform]: null }));
    if (platformInputRefs.current[platform]) {
      platformInputRefs.current[platform]!.value = "";
    }
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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Be the first to know when Hiverr launches and get early access to our platform.
            </p>
            
            {/* Form Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Form Progress</span>
                <span className="text-sm font-medium text-gray-700">{formProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${formProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <AnimatePresence>
                {formProgress === 100 && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-green-600 mt-2 flex items-center justify-center gap-1"
                  >
                    <CheckCircle size={16} />
                    All required fields completed!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
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
                    <div className="relative">
                      <Input
                        id="fullName"
                        {...brandForm.register("fullName")}
                        placeholder="Enter your full name"
                        disabled={waitlistMutation.isPending}
                        className={`transition-all duration-200 pr-10 ${
                          brandForm.formState.errors.fullName 
                            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                            : brandForm.watch("fullName") 
                            ? 'border-green-500 bg-green-50' 
                            : ''
                        }`}
                        onChange={(e) => {
                          brandForm.setValue("fullName", e.target.value);
                          if (e.target.value) {
                            validateField("fullName", e.target.value, brandFormSchema);
                          }
                        }}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <AnimatePresence mode="wait">
                          {getValidationIcon("fullName", !!brandForm.formState.errors.fullName)}
                        </AnimatePresence>
                      </div>
                    </div>
                    <AnimatePresence>
                      {brandForm.formState.errors.fullName && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-sm text-red-600 mt-1 flex items-center gap-1"
                        >
                          <AlertCircle size={12} />
                          {brandForm.formState.errors.fullName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <Label htmlFor="email">Work Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        {...brandForm.register("email")}
                        placeholder="Enter your work email"
                        disabled={waitlistMutation.isPending}
                        className={`transition-all duration-200 ${
                          brandForm.formState.errors.email 
                            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                            : brandForm.watch("email") && /\S+@\S+\.\S+/.test(brandForm.watch("email"))
                            ? 'border-green-500 bg-green-50' 
                            : ''
                        }`}
                      />
                      {brandForm.watch("email") && /\S+@\S+\.\S+/.test(brandForm.watch("email")) && !brandForm.formState.errors.email && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle size={16} className="text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {brandForm.formState.errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 mt-1 flex items-center gap-1"
                      >
                        <X size={12} />
                        {brandForm.formState.errors.email.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company / Brand Name</Label>
                    <div className="relative">
                      <Input
                        id="companyName"
                        {...brandForm.register("companyName")}
                        placeholder="Enter your company name"
                        disabled={waitlistMutation.isPending}
                        className={`transition-all duration-200 ${
                          brandForm.formState.errors.companyName 
                            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                            : brandForm.watch("companyName") 
                            ? 'border-green-500 bg-green-50' 
                            : ''
                        }`}
                      />
                      {brandForm.watch("companyName") && !brandForm.formState.errors.companyName && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle size={16} className="text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {brandForm.formState.errors.companyName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 mt-1 flex items-center gap-1"
                      >
                        <X size={12} />
                        {brandForm.formState.errors.companyName.message}
                      </motion.p>
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
                    <SelectTrigger className={`transition-all duration-200 ${
                      brandForm.formState.errors.role 
                        ? 'border-red-500 bg-red-50' 
                        : brandForm.watch("role") 
                        ? 'border-green-500 bg-green-50' 
                        : ''
                    }`}>
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
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600 mt-1 flex items-center gap-1"
                    >
                      <X size={12} />
                      {brandForm.formState.errors.role.message}
                    </motion.p>
                  )}
                  {brandForm.watch("role") && !brandForm.formState.errors.role && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 mt-1 flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Role selected
                    </motion.p>
                  )}
                </div>

                <div>
                  <Label htmlFor="creatorsLooking">What kind of creators are you looking for?</Label>
                  <Select onValueChange={(value) => brandForm.setValue("creatorsLooking", value)} disabled={waitlistMutation.isPending}>
                    <SelectTrigger className={`transition-all duration-200 ${
                      brandForm.formState.errors.creatorsLooking 
                        ? 'border-red-500 bg-red-50' 
                        : brandForm.watch("creatorsLooking") 
                        ? 'border-green-500 bg-green-50' 
                        : ''
                    }`}>
                      <SelectValue placeholder="Select creator type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beauty & Skincare Creators">Beauty & Skincare Creators</SelectItem>
                      <SelectItem value="Fashion & Lifestyle Creators">Fashion & Lifestyle Creators</SelectItem>
                      <SelectItem value="Fitness & Health Creators">Fitness & Health Creators</SelectItem>
                      <SelectItem value="Food & Cooking Creators">Food & Cooking Creators</SelectItem>
                      <SelectItem value="Technology Creators">Technology Creators</SelectItem>
                      <SelectItem value="Music & Audio Creators">Music & Audio Creators</SelectItem>
                      <SelectItem value="Travel Creators">Travel Creators</SelectItem>
                      <SelectItem value="Nano Influencers (1K-10K followers)">Nano Influencers (1K-10K followers)</SelectItem>
                      <SelectItem value="Micro Influencers (10K-100K followers)">Micro Influencers (10K-100K followers)</SelectItem>
                      <SelectItem value="Macro Influencers (100K-1M followers)">Macro Influencers (100K-1M followers)</SelectItem>
                      <SelectItem value="UGC Creators">UGC Creators</SelectItem>
                      <SelectItem value="Video Content Creators">Video Content Creators</SelectItem>
                      <SelectItem value="Photography Creators">Photography Creators</SelectItem>
                      <SelectItem value="Mixed/Multiple Categories">Mixed/Multiple Categories</SelectItem>
                    </SelectContent>
                  </Select>
                  {brandForm.formState.errors.creatorsLooking && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600 mt-1 flex items-center gap-1"
                    >
                      <X size={12} />
                      {brandForm.formState.errors.creatorsLooking.message}
                    </motion.p>
                  )}
                  {brandForm.watch("creatorsLooking") && !brandForm.formState.errors.creatorsLooking && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 mt-1 flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Creator type selected
                    </motion.p>
                  )}
                </div>

                <div>
                  <Label htmlFor="budgetRange">Campaign Budget Range</Label>
                  <Select onValueChange={(value) => brandForm.setValue("budgetRange", value)} disabled={waitlistMutation.isPending}>
                    <SelectTrigger className={`transition-all duration-200 ${
                      brandForm.formState.errors.budgetRange 
                        ? 'border-red-500 bg-red-50' 
                        : brandForm.watch("budgetRange") 
                        ? 'border-green-500 bg-green-50' 
                        : ''
                    }`}>
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
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600 mt-1 flex items-center gap-1"
                    >
                      <X size={12} />
                      {brandForm.formState.errors.budgetRange.message}
                    </motion.p>
                  )}
                  {brandForm.watch("budgetRange") && !brandForm.formState.errors.budgetRange && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 mt-1 flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Budget range selected
                    </motion.p>
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
                    <SelectTrigger className={`transition-all duration-200 ${
                      brandForm.formState.errors.launchTiming 
                        ? 'border-red-500 bg-red-50' 
                        : brandForm.watch("launchTiming") 
                        ? 'border-green-500 bg-green-50' 
                        : ''
                    }`}>
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASAP">ASAP</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1 month+">1 month+</SelectItem>
                    </SelectContent>
                  </Select>
                  {brandForm.formState.errors.launchTiming && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600 mt-1 flex items-center gap-1"
                    >
                      <X size={12} />
                      {brandForm.formState.errors.launchTiming.message}
                    </motion.p>
                  )}
                  {brandForm.watch("launchTiming") && !brandForm.formState.errors.launchTiming && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 mt-1 flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Timeline selected
                    </motion.p>
                  )}
                </div>



                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700">
                    🚀 <strong>Early Access Benefits for Brands:</strong>
                  </p>
                  <ul className="text-sm text-purple-600 mt-2 space-y-1">
                    <li>• Priority access to top-performing verified creators</li>
                    <li>• Special launch pricing with reduced commission rates</li>
                    <li>• First access to AI avatar technology for scale</li>
                    <li>• Direct feedback line to our product team</li>
                    <li>• Exclusive beta features and early campaign tools</li>
                  </ul>
                </div>

                <motion.div
                  animate={{
                    scale: isBrandFormComplete() ? 1.02 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    disabled={waitlistMutation.isPending || !isBrandFormComplete()}
                    className={`w-full transition-all duration-300 ${
                      isBrandFormComplete() && !waitlistMutation.isPending
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {waitlistMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Joining...
                      </div>
                    ) : isBrandFormComplete() ? (
                      "Join Waitlist 🚀"
                    ) : (
                      (() => {
                        const formValues = brandForm.watch();
                        const requiredFields = ["fullName", "email", "companyName", "companyWebsite", "role", "creatorsLooking", "budgetRange", "launchTiming"];
                        const completedFields = requiredFields.filter(field => {
                          const value = formValues[field];
                          return value && value.length > 0;
                        });
                        const remaining = requiredFields.length - completedFields.length;
                        return `Complete ${remaining} more field${remaining > 1 ? 's' : ''}`;
                      })()
                    )}
                  </Button>
                </motion.div>
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
                    <div className="relative">
                      <Input
                        id="fullName"
                        {...creatorForm.register("fullName")}
                        placeholder="Enter your full name"
                        disabled={waitlistMutation.isPending}
                        className={`transition-all duration-200 ${
                          creatorForm.formState.errors.fullName 
                            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                            : creatorForm.watch("fullName") 
                            ? 'border-green-500 bg-green-50' 
                            : ''
                        }`}
                      />
                      {creatorForm.watch("fullName") && !creatorForm.formState.errors.fullName && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle size={16} className="text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {creatorForm.formState.errors.fullName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 mt-1 flex items-center gap-1"
                      >
                        <X size={12} />
                        {creatorForm.formState.errors.fullName.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        {...creatorForm.register("email")}
                        placeholder="Enter your email"
                        disabled={waitlistMutation.isPending}
                        className={`transition-all duration-200 ${
                          creatorForm.formState.errors.email 
                            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                            : creatorForm.watch("email") && /\S+@\S+\.\S+/.test(creatorForm.watch("email"))
                            ? 'border-green-500 bg-green-50' 
                            : ''
                        }`}
                      />
                      {creatorForm.watch("email") && /\S+@\S+\.\S+/.test(creatorForm.watch("email")) && !creatorForm.formState.errors.email && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle size={16} className="text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {creatorForm.formState.errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 mt-1 flex items-center gap-1"
                      >
                        <X size={12} />
                        {creatorForm.formState.errors.email.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Social Platform Verification</Label>
                  <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Platform Ownership Verification Required</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          To verify your social media ownership, upload a screenshot of your analytics dashboard for each platform you use. The screenshot must clearly show your username/handle in the same image.
                        </p>
                        <div className="space-y-2 text-sm text-blue-600">
                          <p><strong>Instagram:</strong> Screenshot of Insights page showing username and analytics</p>
                          <p><strong>TikTok:</strong> Screenshot of Analytics dashboard with username visible</p>
                          <p><strong>YouTube:</strong> Screenshot of YouTube Studio analytics with channel name</p>
                          <p><strong>Other platforms:</strong> Screenshot of native analytics showing your account details</p>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          Screenshots will be reviewed during our verification process. Only platforms you select below will require verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Select Your Active Social Media Platforms</Label>
                  <p className="text-sm text-gray-600 mb-3">Choose the platforms where you actively create content. Only show fields for platforms you actually use.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'instagram', label: 'Instagram' },
                      { key: 'tiktok', label: 'TikTok' },
                      { key: 'youtube', label: 'YouTube' },
                      { key: 'twitter', label: 'X (Twitter)' },
                      { key: 'facebook', label: 'Facebook' }
                    ].map((platform) => (
                      <div key={platform.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`platform-${platform.key}`}
                          checked={creatorForm.watch("selectedPlatforms")?.includes(platform.key) || false}
                          onCheckedChange={(checked) => {
                            const current = creatorForm.watch("selectedPlatforms") || [];
                            if (checked) {
                              creatorForm.setValue("selectedPlatforms", [...current, platform.key]);
                            } else {
                              creatorForm.setValue("selectedPlatforms", current.filter(p => p !== platform.key));
                              // Clear the platform fields when unchecked
                              if (platform.key === 'instagram') {
                                creatorForm.setValue("instagram", "");
                                creatorForm.setValue("instagramFollowers", "");
                              }
                              if (platform.key === 'tiktok') {
                                creatorForm.setValue("tiktok", "");
                                creatorForm.setValue("tiktokFollowers", "");
                              }
                              if (platform.key === 'youtube') {
                                creatorForm.setValue("youtube", "");
                                creatorForm.setValue("youtubeSubs", "");
                              }
                              if (platform.key === 'twitter') creatorForm.setValue("twitter", "");
                              if (platform.key === 'facebook') creatorForm.setValue("facebook", "");
                              // Clear uploaded file for this platform
                              removePlatformImage(platform.key);
                            }
                          }}
                          disabled={waitlistMutation.isPending}
                          className={`transition-all duration-200 ${
                            creatorForm.watch("selectedPlatforms")?.includes(platform.key) 
                              ? 'border-green-500 bg-green-50' 
                              : ''
                          }`}
                        />
                        <Label htmlFor={`platform-${platform.key}`} className="text-sm font-normal">
                          {platform.label}
                        </Label>
                      </div>
                    ))}
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
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600 mt-1 flex items-center gap-1"
                    >
                      <X size={12} />
                      {creatorForm.formState.errors.niches.message}
                    </motion.p>
                  )}
                  {creatorForm.watch("niches")?.length > 0 && !creatorForm.formState.errors.niches && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 mt-1 flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      {creatorForm.watch("niches").length} niche{creatorForm.watch("niches").length > 1 ? 's' : ''} selected
                    </motion.p>
                  )}
                </div>

                {creatorForm.watch("selectedPlatforms")?.length > 0 && (
                  <div className="space-y-4">
                    <Label>Platform Details - Only for Selected Platforms</Label>
                    
                    {creatorForm.watch("selectedPlatforms")?.includes('instagram') && (
                      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <img src={instagramIcon} alt="Instagram" className="w-6 h-6 rounded-lg" />
                          Instagram Verification
                        </h4>
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
                            <Popover open={instagramFollowersOpen} onOpenChange={setInstagramFollowersOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={instagramFollowersOpen}
                                  className="w-full justify-between"
                                  disabled={waitlistMutation.isPending}
                                >
                                  {creatorForm.watch("instagramFollowers") || "Select follower range..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search range..." />
                                  <CommandList>
                                    <CommandEmpty>No range found.</CommandEmpty>
                                    <CommandGroup>
                                      {followerRanges.map((range) => (
                                        <CommandItem
                                          key={range}
                                          value={range}
                                          onSelect={(currentValue) => {
                                            creatorForm.setValue("instagramFollowers", currentValue);
                                            setInstagramFollowersOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              creatorForm.watch("instagramFollowers") === range ? "opacity-100" : "opacity-0"
                                            }`}
                                          />
                                          {range}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="instagram-screenshot">Instagram Analytics Screenshot</Label>
                          <p className="text-sm text-gray-600 mb-2">Upload a screenshot of your Instagram Insights showing your username and analytics data</p>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              ref={(el) => (platformInputRefs.current.instagram = el)}
                              onChange={(e) => handlePlatformImageUpload('instagram', e)}
                              accept="image/*"
                              className="hidden"
                              id="instagram-file-upload"
                              disabled={waitlistMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => platformInputRefs.current.instagram?.click()}
                              disabled={waitlistMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Upload size={16} />
                              Choose File
                            </Button>
                            {platformFiles.instagram && (
                              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-sm text-green-700">{platformFiles.instagram.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlatformImage('instagram')}
                                  className="h-5 w-5 p-0 text-green-600 hover:text-red-600"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {creatorForm.watch("selectedPlatforms")?.includes('tiktok') && (
                      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <img src={tiktokIcon} alt="TikTok" className="w-6 h-6 rounded-lg" />
                          TikTok Verification
                        </h4>
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
                            <Popover open={tiktokFollowersOpen} onOpenChange={setTiktokFollowersOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={tiktokFollowersOpen}
                                  className="w-full justify-between"
                                  disabled={waitlistMutation.isPending}
                                >
                                  {creatorForm.watch("tiktokFollowers") || "Select follower range..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search range..." />
                                  <CommandList>
                                    <CommandEmpty>No range found.</CommandEmpty>
                                    <CommandGroup>
                                      {followerRanges.map((range) => (
                                        <CommandItem
                                          key={range}
                                          value={range}
                                          onSelect={(currentValue) => {
                                            creatorForm.setValue("tiktokFollowers", currentValue);
                                            setTiktokFollowersOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              creatorForm.watch("tiktokFollowers") === range ? "opacity-100" : "opacity-0"
                                            }`}
                                          />
                                          {range}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="tiktok-screenshot">TikTok Analytics Screenshot</Label>
                          <p className="text-sm text-gray-600 mb-2">Upload a screenshot of your TikTok Analytics showing your username and performance data</p>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              ref={(el) => (platformInputRefs.current.tiktok = el)}
                              onChange={(e) => handlePlatformImageUpload('tiktok', e)}
                              accept="image/*"
                              className="hidden"
                              id="tiktok-file-upload"
                              disabled={waitlistMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => platformInputRefs.current.tiktok?.click()}
                              disabled={waitlistMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Upload size={16} />
                              Choose File
                            </Button>
                            {platformFiles.tiktok && (
                              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-sm text-green-700">{platformFiles.tiktok.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlatformImage('tiktok')}
                                  className="h-5 w-5 p-0 text-green-600 hover:text-red-600"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {creatorForm.watch("selectedPlatforms")?.includes('youtube') && (
                      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <img src={youtubeIcon} alt="YouTube" className="w-6 h-6 rounded-lg" />
                          YouTube Verification
                        </h4>
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
                            <Popover open={youtubeSubsOpen} onOpenChange={setYoutubeSubsOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={youtubeSubsOpen}
                                  className="w-full justify-between"
                                  disabled={waitlistMutation.isPending}
                                >
                                  {creatorForm.watch("youtubeSubs") || "Select subscriber range..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search range..." />
                                  <CommandList>
                                    <CommandEmpty>No range found.</CommandEmpty>
                                    <CommandGroup>
                                      {subscriberRanges.map((range) => (
                                        <CommandItem
                                          key={range}
                                          value={range}
                                          onSelect={(currentValue) => {
                                            creatorForm.setValue("youtubeSubs", currentValue);
                                            setYoutubeSubsOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              creatorForm.watch("youtubeSubs") === range ? "opacity-100" : "opacity-0"
                                            }`}
                                          />
                                          {range}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="youtube-screenshot">YouTube Studio Analytics Screenshot</Label>
                          <p className="text-sm text-gray-600 mb-2">Upload a screenshot of your YouTube Studio Analytics showing your channel name and metrics</p>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              ref={(el) => (platformInputRefs.current.youtube = el)}
                              onChange={(e) => handlePlatformImageUpload('youtube', e)}
                              accept="image/*"
                              className="hidden"
                              id="youtube-file-upload"
                              disabled={waitlistMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => platformInputRefs.current.youtube?.click()}
                              disabled={waitlistMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Upload size={16} />
                              Choose File
                            </Button>
                            {platformFiles.youtube && (
                              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-sm text-green-700">{platformFiles.youtube.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlatformImage('youtube')}
                                  className="h-5 w-5 p-0 text-green-600 hover:text-red-600"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {creatorForm.watch("selectedPlatforms")?.includes('twitter') && (
                      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <img src={xIcon} alt="X (Twitter)" className="w-6 h-6 rounded-lg" />
                          X (Twitter) Verification
                        </h4>
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
                          <Label htmlFor="twitter-screenshot">X Analytics Screenshot</Label>
                          <p className="text-sm text-gray-600 mb-2">Upload a screenshot of your X Analytics or profile showing your handle and engagement metrics</p>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              ref={(el) => (platformInputRefs.current.twitter = el)}
                              onChange={(e) => handlePlatformImageUpload('twitter', e)}
                              accept="image/*"
                              className="hidden"
                              id="twitter-file-upload"
                              disabled={waitlistMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => platformInputRefs.current.twitter?.click()}
                              disabled={waitlistMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Upload size={16} />
                              Choose File
                            </Button>
                            {platformFiles.twitter && (
                              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-sm text-green-700">{platformFiles.twitter.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlatformImage('twitter')}
                                  className="h-5 w-5 p-0 text-green-600 hover:text-red-600"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {creatorForm.watch("selectedPlatforms")?.includes('facebook') && (
                      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <img src={facebookIcon} alt="Facebook" className="w-6 h-6 rounded-lg" />
                          Facebook Verification
                        </h4>
                        <div>
                          <Label htmlFor="facebook">Facebook Page or Profile</Label>
                          <Input
                            id="facebook"
                            {...creatorForm.register("facebook")}
                            placeholder="Facebook URL"
                            disabled={waitlistMutation.isPending}
                          />
                        </div>
                        <div>
                          <Label htmlFor="facebook-screenshot">Facebook Insights Screenshot</Label>
                          <p className="text-sm text-gray-600 mb-2">Upload a screenshot of your Facebook Page Insights showing your page name and analytics</p>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              ref={(el) => (platformInputRefs.current.facebook = el)}
                              onChange={(e) => handlePlatformImageUpload('facebook', e)}
                              accept="image/*"
                              className="hidden"
                              id="facebook-file-upload"
                              disabled={waitlistMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => platformInputRefs.current.facebook?.click()}
                              disabled={waitlistMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Upload size={16} />
                              Choose File
                            </Button>
                            {platformFiles.facebook && (
                              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-sm text-green-700">{platformFiles.facebook.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlatformImage('facebook')}
                                  className="h-5 w-5 p-0 text-green-600 hover:text-red-600"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location">Your Country / City</Label>
                    <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={locationOpen}
                          className="w-full justify-between"
                          disabled={waitlistMutation.isPending}
                        >
                          {creatorForm.watch("location") || "Select location..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search location..." />
                          <CommandList>
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup>
                              {locations.map((location) => (
                                <CommandItem
                                  key={location}
                                  value={location}
                                  onSelect={(currentValue) => {
                                    creatorForm.setValue("location", currentValue);
                                    setLocationOpen(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      creatorForm.watch("location") === location ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  {location}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {creatorForm.formState.errors.location && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 mt-1 flex items-center gap-1"
                      >
                        <X size={12} />
                        {creatorForm.formState.errors.location.message}
                      </motion.p>
                    )}
                    {creatorForm.watch("location") && !creatorForm.formState.errors.location && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600 mt-1 flex items-center gap-1"
                      >
                        <CheckCircle size={12} />
                        Location selected: {creatorForm.watch("location")}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="languages">Languages You Create In</Label>
                    <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={languageOpen}
                          className="w-full justify-between"
                          disabled={waitlistMutation.isPending}
                        >
                          {creatorForm.watch("languages").length > 0
                            ? `${creatorForm.watch("languages").length} language${
                                creatorForm.watch("languages").length > 1 ? "s" : ""
                              } selected`
                            : "Select languages..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search language..." />
                          <CommandList>
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                              {languages.map((language) => (
                                <CommandItem
                                  key={language}
                                  value={language}
                                  onSelect={(currentValue) => {
                                    const current = creatorForm.watch("languages");
                                    const updated = current.includes(currentValue)
                                      ? current.filter((lang) => lang !== currentValue)
                                      : [...current, currentValue];
                                    creatorForm.setValue("languages", updated);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      creatorForm.watch("languages").includes(language) ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  {language}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {creatorForm.watch("languages").length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {creatorForm.watch("languages").map((language) => (
                          <div
                            key={language}
                            className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
                          >
                            <span>{language}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const current = creatorForm.watch("languages");
                                const updated = current.filter((lang) => lang !== language);
                                creatorForm.setValue("languages", updated);
                              }}
                              className="h-4 w-4 p-0 hover:bg-purple-200"
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {creatorForm.formState.errors.languages && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 mt-1 flex items-center gap-1"
                      >
                        <X size={12} />
                        {creatorForm.formState.errors.languages.message}
                      </motion.p>
                    )}
                    {creatorForm.watch("languages")?.length > 0 && !creatorForm.formState.errors.languages && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600 mt-1 flex items-center gap-1"
                      >
                        <CheckCircle size={12} />
                        {creatorForm.watch("languages").length} language{creatorForm.watch("languages").length > 1 ? 's' : ''} selected
                      </motion.p>
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



                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700">
                    🚀 <strong>Early Access Benefits for Creators:</strong>
                  </p>
                  <ul className="text-sm text-purple-600 mt-2 space-y-1">
                    <li>• First access to premium brand partnerships</li>
                    <li>• Reduced platform commission rates for early adopters</li>
                    <li>• Priority verification and featured creator status</li>
                    <li>• Early access to AI avatar monetization tools</li>
                    <li>• Direct feedback line to shape the platform features</li>
                  </ul>
                </div>

                <motion.div
                  animate={{
                    scale: (() => {
                      const totalFields = ['fullName', 'email', 'selectedPlatforms', 'niches', 'location', 'languages'];
                      const completedFields = totalFields.filter(field => {
                        const value = creatorForm.watch(field);
                        return value && (Array.isArray(value) ? value.length > 0 : value.length > 0);
                      });
                      return completedFields.length === totalFields.length ? 1.02 : 1;
                    })()
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    disabled={waitlistMutation.isPending || (() => {
                      const totalFields = ['fullName', 'email', 'selectedPlatforms', 'niches', 'location', 'languages'];
                      const completedFields = totalFields.filter(field => {
                        const value = creatorForm.watch(field);
                        return value && (Array.isArray(value) ? value.length > 0 : value.length > 0);
                      });
                      return completedFields.length < totalFields.length;
                    })()}
                    className={`w-full transition-all duration-300 ${
                      (() => {
                        const totalFields = ['fullName', 'email', 'selectedPlatforms', 'niches', 'location', 'languages'];
                        const completedFields = totalFields.filter(field => {
                          const value = creatorForm.watch(field);
                          return value && (Array.isArray(value) ? value.length > 0 : value.length > 0);
                        });
                        return completedFields.length === totalFields.length 
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg'
                          : 'bg-gray-400 cursor-not-allowed';
                      })()
                    }`}
                  >
                    {waitlistMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Joining...
                      </div>
                    ) : (() => {
                      const totalFields = ['fullName', 'email', 'selectedPlatforms', 'niches', 'location', 'languages'];
                      const completedFields = totalFields.filter(field => {
                        const value = creatorForm.watch(field);
                        return value && (Array.isArray(value) ? value.length > 0 : value.length > 0);
                      });
                      return completedFields.length === totalFields.length 
                        ? "Join Waitlist 🚀" 
                        : `Complete ${totalFields.length - completedFields.length} more field${totalFields.length - completedFields.length > 1 ? 's' : ''}`;
                    })()}
                  </Button>
                </motion.div>
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