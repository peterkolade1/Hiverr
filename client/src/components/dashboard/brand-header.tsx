import { Bell, Gift, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MobileMenuTrigger } from "./brand-sidebar";

interface BrandHeaderProps {
  title: string;
  breadcrumb?: string[];
}

export function BrandHeader({ title, breadcrumb }: BrandHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MobileMenuTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hidden sm:inline">Dashboard</span>
            {breadcrumb?.map((item, index) => (
              <span key={index} className="hidden sm:flex items-center gap-2">
                <span>›</span>
                <span className={index === breadcrumb.length - 1 ? "text-gray-900 font-medium" : ""}>
                  {item}
                </span>
              </span>
            ))}
            <span className="sm:hidden text-gray-900 font-medium">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            data-testid="button-invites-mobile"
          >
            <Bell className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            className="hidden md:flex items-center gap-2 text-gray-700"
            data-testid="button-invites"
          >
            <Bell className="w-5 h-5" />
            <span>Invites</span>
          </Button>

          <Button 
            className="hidden sm:flex bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs md:text-sm"
            data-testid="button-refer"
          >
            <Gift className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Refer & Earn up to $1800</span>
            <span className="md:hidden">Refer</span>
          </Button>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white font-semibold text-sm md:text-base">
              {user?.firstName?.charAt(0) || "B"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
