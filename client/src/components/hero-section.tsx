import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Plus, Video } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative gradient-hero py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">Rated 5/5 from over 2,500 campaigns</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Connect Brands with{" "}
            <span className="relative">
              <Video className="inline-block brand-purple mr-2" size={48} />
              Content Creators
            </span>
            <br />
            for Authentic UGC Campaigns
            <span className="inline-flex items-center justify-center w-12 h-8 bg-brand-orange rounded-lg ml-2">
              <span className="text-white text-sm font-bold">Pro</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Discover vetted content creators across Instagram, TikTok, and YouTube. Launch campaigns that drive engagement and authentic brand connections.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gray-900 text-white px-8 py-4 text-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="mr-2" size={20} />
              Find Creators
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Explore Campaigns
            </Button>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <p className="text-center text-gray-500 text-sm mb-8">Trusted by</p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Nike</div>
            <div className="text-2xl font-bold text-gray-400">Spotify</div>
            <div className="text-2xl font-bold text-gray-400">Airbnb</div>
            <div className="text-2xl font-bold text-gray-400">Slack</div>
            <div className="text-2xl font-bold text-gray-400">Shopify</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
