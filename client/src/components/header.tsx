import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WaitlistForm } from "./waitlist-form";
import { HiverWordmark } from "./hiver-logo";
import { Menu, Sparkles } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link href="#creators" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
        Browse Creators
      </Link>
      <Link href="#services" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
        Services
      </Link>
      <Link href="#how-it-works" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
        How It Works
      </Link>
      <Link href="#brands" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
        For Brands
      </Link>
      <Link href="#creators" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
        For Creators
      </Link>
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

          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm text-gray-600">Hamburg, 2:30pm</span>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setIsWaitlistOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              <Sparkles size={14} className="mr-1" />
              Join Waitlist
            </Button>
            
            {/* Mobile menu trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <WaitlistForm 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </header>
  );
}
