import { Link, useLocation } from "wouter";
import { 
  FileText, 
  Trophy, 
  Users, 
  Building2, 
  BookOpen, 
  HelpCircle, 
  Settings,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HiverWordmark } from "@/components/hiver-logo";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState, createContext, useContext } from "react";

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

const onboardingTasks = [
  { id: 1, label: "Complete your brand profile", completed: true },
  { id: 2, label: "Create your first brief", completed: false },
];

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

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const [showTasks, setShowTasks] = useState(true);
  
  const completedTasks = onboardingTasks.filter(t => t.completed).length;
  const totalTasks = onboardingTasks.length;
  const progress = (completedTasks / totalTasks) * 100;

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
                  <li key={task.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      task.completed ? "bg-white border-white" : "border-white/50"
                    }`}>
                      {task.completed && (
                        <svg className="w-2.5 h-2.5 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={task.completed ? "line-through opacity-70" : ""}>{task.label}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#8B5CF6] rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900">We're here to help</p>
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-center text-sm"
              data-testid="button-chat"
            >
              Chat with Us
            </Button>
            <Button 
              className="w-full justify-center text-sm bg-gray-900 hover:bg-gray-800"
              data-testid="button-book-call"
            >
              <Phone className="w-4 h-4 mr-2" />
              Book a Call
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function BrandSidebar() {
  return (
    <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-screen fixed left-0 top-0 z-40">
      <SidebarContent />
    </div>
  );
}

export function MobileSidebar() {
  const { isOpen, setIsOpen } = useSidebarContext();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-80 p-0 flex flex-col">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SidebarContent onNavigate={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
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
