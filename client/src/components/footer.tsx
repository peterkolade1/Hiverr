import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* CTA Section */}
      <section className="py-20 gradient-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Launch Your Next{" "}
            <span className="text-brand-orange">UGC Campaign?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of brands that trust CreatorLink to connect with authentic content creators and drive meaningful engagement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button size="lg" className="bg-brand-orange text-white px-8 py-4 text-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-105">
              🚀 Start Your Campaign
            </Button>
            <Button variant="outline" size="lg" className="border-gray-400 text-gray-300 px-8 py-4 text-lg hover:bg-gray-800">
              Browse Creators
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>24/7 support</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                  <Zap className="text-white text-sm" size={16} />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">CreatorLink</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Connecting brands with authentic content creators for impactful UGC campaigns.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                  <FaTwitter size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                  <FaLinkedin size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                  <FaInstagram size={16} />
                </Button>
              </div>
            </div>

            {/* For Brands */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">For Brands</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Find Creators</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Campaign Management</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Analytics & Reporting</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Success Stories</a></li>
              </ul>
            </div>

            {/* For Creators */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">For Creators</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Join as Creator</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Creator Resources</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Payment & Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Creator Community</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">© {currentYear} CreatorLink. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
