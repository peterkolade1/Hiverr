import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HiverLogo } from "./hiver-logo";
import { Star, Plus, Video, Search } from "lucide-react";
import { useImagePreloader } from "@/hooks/useImagePreloader";

// Import creator images
import smartphoneImage from "@assets/portrait-woman-using-smartphone-with-pop-socket-outdoors_1752546751339.jpg";
import musicImage from "@assets/teenage-boy-recording-music-with-his-guitar-his-home-studio_1752546751339.jpg";
import photographerImage from "@assets/beautiful-young-smiling-photographer-girl-taking-photos-using-her-retro-camera_1752546339462.jpg";
import fitnessImage from "@assets/fit-young-woman-doing-stretching-exercise-yoga-mat_1752546339467.jpg";
// Import new creator images
import youngFriendsImage from "@assets/young-friends-posing-together-low-angle_1752547296035.jpg";
import beautyVloggerImage from "@assets/woman-beauty-vlogger-filming-vlog-about-creams_1752547296036.jpg";
import foodPhotoImage from "@assets/woman-taking-photo-her-food_1752547296036.jpg";
import gymImage from "@assets/tired-young-woman-resting-while-sitting-after-working-out-gym_1752547296037.jpg";
// Import brand logos
import binanceLogo from "@assets/1391309_1752552346373.png";
import shopifyLogo from "@assets/image_1752551752354.png";
import amplifyLogo from "@assets/Logo Main_1752551931487.png";
import newBrandLogo from "@assets/image_1752552551607.png";

export function HeroSection() {
  // Preload critical images for better performance
  useImagePreloader({
    images: [smartphoneImage, youngFriendsImage, beautyVloggerImage, foodPhotoImage],
    priority: true
  });

  return (
    <section className="relative gradient-hero py-20 lg:py-32 overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1"></div>
      <div className="floating-orb floating-orb-2"></div>
      <div className="floating-orb floating-orb-3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
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
            className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Hiverr helps brands submit briefs, discover top-fit creators, and generate UGC content — all in one simple platform.
          </motion.p>

          {/* Dual Audience CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center space-y-4 px-4 max-w-2xl mx-auto"
          >
            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 rounded-full w-full sm:w-auto"
                  onClick={() => {
                    document.getElementById('creators')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Browse Creators
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 rounded-full w-full sm:w-auto"
                  onClick={() => {
                    // For now, scroll to creators section - can be updated to campaign section later
                    document.getElementById('creators')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Find Campaign
                </Button>
              </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative w-full max-w-lg"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder='Try "skincare creator" or "tech reviewer"'
                  className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 pr-14"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-2.5 rounded-full hover:from-purple-700 hover:to-cyan-700 transition-all duration-300"
                  onClick={() => {
                    document.getElementById('creators')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Search size={20} />
                </motion.button>
              </div>
            </motion.div>

            {/* Helper Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-sm text-gray-500 text-center"
            >
              Popular: Beauty Creators, Tech Reviewers, Fitness Influencers
            </motion.p>
          </motion.div>
        </div>

        {/* Creator Image Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 sm:mt-16 relative max-w-5xl mx-auto px-4"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div 
              className="relative"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transform rotate-2 hover:rotate-4 transition-transform">
                <img 
                  src={smartphoneImage} 
                  alt="Content Creator"
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>Social Media</span>
                    <div className="flex items-center">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative mt-8"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transform -rotate-1 hover:-rotate-3 transition-transform">
                <img 
                  src={youngFriendsImage} 
                  alt="Lifestyle Creators"
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>Lifestyle & Fashion</span>
                    <div className="flex items-center">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative mt-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transform rotate-1 hover:rotate-2 transition-transform">
                <img 
                  src={beautyVloggerImage} 
                  alt="Beauty Vlogger"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>Beauty & Skincare</span>
                    <div className="flex items-center">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative mt-12"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transform -rotate-2 hover:-rotate-4 transition-transform">
                <img 
                  src={foodPhotoImage} 
                  alt="Food Content Creator"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>Food & Lifestyle</span>
                    <div className="flex items-center">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Additional Creator Gallery Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div 
              className="relative"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transform -rotate-1 hover:-rotate-3 transition-transform">
                <img 
                  src={gymImage} 
                  alt="Fitness Creator"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>Fitness & Wellness</span>
                    <div className="flex items-center">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1">4.7</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative mt-6"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transform rotate-2 hover:rotate-4 transition-transform">
                <img 
                  src={musicImage} 
                  alt="Music Creator"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>Music & Audio</span>
                    <div className="flex items-center">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1">5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative mt-2"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transform -rotate-2 hover:-rotate-4 transition-transform">
                <img 
                  src={photographerImage} 
                  alt="Photography Creator"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>Photography</span>
                    <div className="flex items-center">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative mt-10"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 2.6 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transform rotate-1 hover:rotate-3 transition-transform">
                <img 
                  src={fitnessImage} 
                  alt="Yoga Creator"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>Yoga & Mindfulness</span>
                    <div className="flex items-center">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-16"
        >
          <p className="text-center text-gray-500 text-sm mb-8">Trusted by</p>
          <div className="flex justify-center items-center space-x-6 sm:space-x-10 opacity-70">
            <motion.img
              src={binanceLogo}
              alt="Binance"
              className="h-6 sm:h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              loading="lazy"
              decoding="async"
              whileHover={{ 
                scale: 1.1,
                y: -2,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 10
              }}
            />
            <motion.img
              src={shopifyLogo}
              alt="Shopify"
              className="h-6 sm:h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              loading="lazy"
              decoding="async"
              whileHover={{ 
                scale: 1.1,
                y: -2,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 10,
                delay: 0.1
              }}
            />
            <motion.img
              src={amplifyLogo}
              alt="Amplify"
              className="h-6 sm:h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              loading="lazy"
              decoding="async"
              whileHover={{ 
                scale: 1.1,
                y: -2,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 10,
                delay: 0.2
              }}
            />
            <motion.img
              src={newBrandLogo}
              alt="Enterprise Partner"
              className="h-6 sm:h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              loading="lazy"
              decoding="async"
              whileHover={{ 
                scale: 1.1,
                y: -2,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 10,
                delay: 0.3
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
