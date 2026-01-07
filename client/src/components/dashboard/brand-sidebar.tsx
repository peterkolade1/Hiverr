import { Link, useLocation } from "wouter";
import { 
  FileText, 
  Trophy, 
  Users, 
  Building2, 
  BookOpen, 
  HelpCircle, 
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ThumbsUp,
  ArrowRight,
  Star,
  Lightbulb,
  AlertCircle,
  Frown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HiverWordmark } from "@/components/hiver-logo";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, createContext, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { label: "Briefs", icon: FileText, href: "/brand/dashboard/briefs" },
  { label: "Find Creators", icon: Users, href: "/brand/dashboard" },
  { label: "Hive Leaderboard", icon: Trophy, href: "/brand/dashboard/leaderboard" },
];

const accountNavItems: NavItem[] = [
  { label: "My Brand", icon: Building2, href: "/brand/dashboard/my-brand" },
  { label: "Learn", icon: BookOpen, href: "/brand/dashboard/learn" },
  { label: "Support & Guides", icon: HelpCircle, href: "/brand/dashboard/support" },
  { label: "Account Settings", icon: Settings, href: "/brand/dashboard/settings" },
];

const taskLabels: Record<string, string> = {
  complete_profile: "Complete your brand profile",
  create_first_brief: "Create your first brief",
};

const feedbackCategories = [
  { id: "general", label: "General Experience", icon: Star },
  { id: "bug", label: "Report a Bug", icon: AlertCircle },
  { id: "feature", label: "Feature Request", icon: Lightbulb },
  { id: "other", label: "Something Felt Off", icon: Frown },
];

function FeedbackCard({ onOpenFeedback }: { onOpenFeedback: () => void }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="mb-3">
        <ThumbsUp className="w-8 h-8 text-[#8B5CF6]" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">Tell us what's working and what's not</h3>
      <p className="text-sm text-gray-500 mb-4">We're building Hiverr for you.</p>
      <Button 
        variant="outline"
        className="w-full justify-center text-sm bg-gray-100 hover:bg-gray-200 border-0"
        onClick={onOpenFeedback}
        data-testid="button-give-feedback"
      >
        Give Feedback
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const submitFeedback = useMutation({
    mutationFn: async (data: { rating: number; category: string | null; note: string }) => {
      return apiRequest("/api/feedback", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Thanks for your feedback!",
        description: "We appreciate you taking the time to help us improve.",
      });
      setRating(0);
      setSelectedCategory(null);
      setNote("");
      onClose();
    },
    onError: () => {
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Tell us how satisfied you are with Hiverr.",
        variant: "destructive",
      });
      return;
    }
    submitFeedback.mutate({ rating, category: selectedCategory, note });
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">How's your Hiverr Experience?</DialogTitle>
          <p className="text-gray-500 text-sm">Are you satisfied with the service?</p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                data-testid={`star-${star}`}
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= displayRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-amber-400"
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <p className="font-medium text-gray-900 mb-3">Tell us what can be improved:</p>
            <div className="flex flex-wrap gap-2">
              {feedbackCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  data-testid={`category-${category.id}`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-900 block mb-2">Add a note</label>
            <Textarea
              placeholder="Write your note here"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[120px] bg-gray-50 border-gray-200 resize-none"
              data-testid="textarea-feedback-note"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitFeedback.isPending}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-6"
            data-testid="button-submit-feedback"
          >
            {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    return { isOpen: false, setIsOpen: () => {} };
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface OnboardingTask {
  id: number;
  userId: number;
  taskKey: string;
  completed: boolean;
  completedAt: string | null;
}

function SidebarContent({ onNavigate, onOpenFeedback }: { onNavigate?: () => void; onOpenFeedback: () => void }) {
  const [location] = useLocation();
  const [showTasks, setShowTasks] = useState(true);
  
  const { data: onboardingTasks = [] } = useQuery<OnboardingTask[]>({
    queryKey: ["/api/onboarding/progress"],
  });
  
  const completedTasks = onboardingTasks.filter(t => t.completed).length;
  const totalTasks = onboardingTasks.length || 2;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const isActive = (href: string) => {
    if (href === "/brand/dashboard") {
      return location === "/brand/dashboard" || location === "/brand/dashboard/";
    }
    return location.startsWith(href);
  };

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <>
      <div className="p-4 border-b border-gray-100">
        <Link href="/" onClick={handleClick}>
          <HiverWordmark className="h-8" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</p>
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={handleClick}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      isActive(item.href)
                        ? "bg-[#8B5CF6] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</p>
          <ul className="space-y-1">
            {accountNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={handleClick}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      isActive(item.href)
                        ? "bg-[#8B5CF6] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-[#8B5CF6] rounded-xl p-4 text-white mb-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowTasks(!showTasks)}
          >
            <span className="font-semibold">Get Started</span>
            {showTasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          
          {showTasks && (
            <>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{completedTasks}/{totalTasks} tasks</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/30" />
              </div>
              <ul className="mt-3 space-y-2">
                {onboardingTasks.map((task) => (
                  <li key={task.taskKey} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      task.completed ? "bg-white border-white" : "border-white/50"
                    }`}>
                      {task.completed && (
                        <svg className="w-2.5 h-2.5 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={task.completed ? "line-through opacity-70" : ""}>
                      {taskLabels[task.taskKey] || task.taskKey}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <FeedbackCard onOpenFeedback={onOpenFeedback} />
      </div>
    </>
  );
}

export function BrandSidebar() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  return (
    <>
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-screen fixed left-0 top-0 z-40">
        <SidebarContent onOpenFeedback={() => setFeedbackOpen(true)} />
      </div>
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}

export function MobileSidebar() {
  const { isOpen, setIsOpen } = useSidebarContext();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-80 p-0 flex flex-col">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent onNavigate={() => setIsOpen(false)} onOpenFeedback={() => { setIsOpen(false); setFeedbackOpen(true); }} />
        </SheetContent>
      </Sheet>
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}

export function MobileMenuTrigger() {
  const { setIsOpen } = useSidebarContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={() => setIsOpen(true)}
      data-testid="button-mobile-menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}
