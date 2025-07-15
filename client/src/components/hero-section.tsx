import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Plus, Video } from "lucide-react";

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

        {/* Creator Image Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="w-full h-48 object-cover"
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
                  className="w-full h-48 object-cover"
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
