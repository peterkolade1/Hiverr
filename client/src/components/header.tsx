import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HiverWordmark } from "./hiver-logo";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const NavLinks = () => (
    <>
      <a href="#creators" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
        Browse Creators
      </a>
      <a href={location === '/creators' ? "#start-earning" : "#how-it-works"} className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
        How It Works
      </a>
    </>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="group">
              <HiverWordmark className="transition-all duration-300 group-hover:scale-105" />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <NavLinks />
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center text-sm text-gray-600">
                  Welcome, {user?.firstName || 'User'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                  data-testid="button-sign-out"
                >
                  Sign Out
                </Button>
              </>
            ) : null}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                  <div className="border-t pt-4 mt-6">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
                    ) : isAuthenticated ? (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                          Welcome, {user?.firstName || 'User'}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleLogout}
                          className="w-full"
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
