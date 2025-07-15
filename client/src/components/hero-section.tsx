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
            className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            UGC That Converts.{" "}
            <br />
            Influencers Who Fit.{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
              Campaigns That Just Flow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Hiver helps brands submit briefs, discover top-fit creators, and generate UGC content — all in one simple platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gray-900 text-white px-8 py-4 text-lg hover:bg-gray-800 transition-all duration-300 transform hover:shadow-2xl group"
              >
                <Plus className="mr-2 transition-transform duration-300 group-hover:rotate-90" size={20} />
                Start a Campaign
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-lg"
              >
                Browse Creators
              </Button>
            </motion.div>
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
            {["Nike", "Glossier", "Shopify", "Notion", "Airbnb"].map((brand, index) => (
              <motion.div
                key={brand}
                className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer"
                whileHover={{ 
                  scale: 1.1,
                  y: -2,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 10,
                  delay: index * 0.1 
                }}
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
