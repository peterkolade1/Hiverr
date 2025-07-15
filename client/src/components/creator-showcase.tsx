import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Crown, Heart, Eye, Star } from "lucide-react";
import type { Creator } from "@shared/schema";

// Import images
import photographerImage from "@assets/beautiful-young-smiling-photographer-girl-taking-photos-using-her-retro-camera_1752546339462.jpg";
import fitnessImage from "@assets/fit-young-woman-doing-stretching-exercise-yoga-mat_1752546339467.jpg";
import smartphoneImage from "@assets/portrait-woman-using-smartphone-with-pop-socket-outdoors_1752546751339.jpg";
import musicImage from "@assets/teenage-boy-recording-music-with-his-guitar-his-home-studio_1752546751339.jpg";

export function CreatorShowcase() {
  const { data: creators, isLoading } = useQuery<Creator[]>({
    queryKey: ["/api/creators"],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="creators" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Top Creators on Hiver{" "}
              <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg ml-2">
                <Crown className="text-white text-sm" size={16} />
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg"
            >
              Discover influencers with proven track records and high Aura Scores.
            </motion.p>
          </div>
          <div className="hidden lg:flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft size={16} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {creators?.map((creator, index) => (
            <motion.div 
              key={creator.id} 
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 relative group cursor-pointer border-transparent hover:border-purple-200">
                <div className="absolute top-4 left-4 z-10">
                  <motion.div 
                    className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="text-white text-xs" size={12} />
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:bg-purple-100 group-hover:text-purple-700">
                    {creator.category}
                  </Badge>
                </div>
                
                <div className="relative overflow-hidden">
                  <img
                    src={index === 0 ? photographerImage : 
                         index === 1 ? smartphoneImage :
                         index === 2 ? fitnessImage :
                         index === 3 ? musicImage :
                         creator.profileImage}
                    alt={`${creator.name} - ${creator.category}`}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Testimonial overlay for featured creator */}
                  {index === 1 && (
                    <div className="absolute inset-x-4 bottom-4 bg-gray-900 text-white p-4 rounded-xl shadow-lg">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">
                        "Marcus delivered exceptional TikTok content that increased our app downloads by 340%. His authentic tech reviews resonated perfectly with our target audience."
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs text-gray-300">Sarah Chen, Marketing Director at TechFlow</p>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{creator.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm font-medium text-gray-600">${creator.hourlyRate}/hr</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{creator.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">
                        {creator.isAvailable ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {creator.platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant="secondary"
                        className={`${
                          platform === "Instagram"
                            ? "bg-pink-100 text-pink-700"
                            : platform === "TikTok"
                            ? "bg-purple-100 text-purple-700"
                            : platform === "YouTube"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {platform}
                      </Badge>
                    ))}
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {(creator.followerCount / 1000000).toFixed(1)}M followers
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{creator.bio}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 flex items-center">
                      <div className="flex items-center bg-gradient-to-r from-purple-100 to-cyan-100 px-2 py-1 rounded-full">
                        <Star className="mr-1 text-purple-600" size={12} fill="currentColor" />
                        <span className="text-purple-600 font-medium">Aura Score: {Math.floor(Math.random() * 20) + 80}</span>
                      </div>
                    </div>
                    <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0 h-auto">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View Leaderboard Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
          >
            View Leaderboard
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
