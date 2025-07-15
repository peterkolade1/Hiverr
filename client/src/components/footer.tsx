import { Button } from "@/components/ui/button";
import { HiverWordmark } from "./hiver-logo";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>


      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Left side - Logo and tagline */}
            <div>
              <HiverWordmark size="lg" className="mb-2" />
              <p className="text-gray-500 text-sm">
                Powering UGC at Scale.
              </p>
            </div>

            {/* Right side - Footer links */}
            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                For Creators
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 mt-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">© {currentYear} Hiver. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
