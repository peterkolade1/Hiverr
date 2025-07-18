import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreatorProfileModal } from "./creator-profile-modal";
import { ComingSoonBanner } from "./coming-soon-banner";
import { Check, Star, Eye, Filter, Search } from "lucide-react";
import type { Creator } from "@shared/schema";

// Import creator images
import photographerImage from "@assets/beautiful-young-smiling-photographer-girl-taking-photos-using-her-retro-camera_1752546339462.jpg";
import fitnessImage from "@assets/fit-young-woman-doing-stretching-exercise-yoga-mat_1752546339467.jpg";
import smartphoneImage from "@assets/portrait-woman-using-smartphone-with-pop-socket-outdoors_1752546751339.jpg";
import musicImage from "@assets/teenage-boy-recording-music-with-his-guitar-his-home-studio_1752546751339.jpg";
import youngFriendsImage from "@assets/young-friends-posing-together-low-angle_1752547296035.jpg";
import beautyVloggerImage from "@assets/woman-beauty-vlogger-filming-vlog-about-creams_1752547296036.jpg";
import foodPhotoImage from "@assets/woman-taking-photo-her-food_1752547296036.jpg";
import gymImage from "@assets/tired-young-woman-resting-while-sitting-after-working-out-gym_1752547296037.jpg";

// Import new niche images
import fashionImage from "@assets/back-view-woman-with-blue-background_1752553805026.jpg";
import cookingImage from "@assets/medium-shot-women-cooking-together_1752874250110.jpg";
import musicStudioImage from "@assets/teenage-boy-recording-music-with-his-guitar-his-home-studio_1752874250109.jpg";
import fitnessGymImage from "@assets/tired-young-woman-resting-while-sitting-after-working-out-gym_1752874250110.jpg";
import beautyContentImage from "@assets/woman-beauty-vlogger-filming-vlog-about-creams_1752553805031.jpg";
import foodContentImage from "@assets/woman-taking-photo-her-food_1752874250111.jpg";
import lifestyleImage from "@assets/young-friends-posing-together-low-angle_1752874250111.jpg";
import photographyTravelImage from "@assets/medium-shot-smiley-woman-sitting-bench_1752874293836.jpg";

export function CreatorShowcase() {
  const [selectedNiche, setSelectedNiche] = useState<string>("All");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: creators, isLoading } = useQuery<Creator[]>({
    queryKey: ["/api/creators"],
  });

  const handleViewProfile = (creator: Creator) => {
    setSelectedCreator(creator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCreator(null);
  };

  const niches = [
    "All",
    "Beauty & Skincare", 
    "Fitness & Health",
    "Food & Cooking", 
    "Fashion & Lifestyle",
    "Technology",
    "Photography",
    "Music & Audio",
    "Travel"
  ];

  const filteredCreators = creators?.filter(creator => {
    if (selectedNiche === "All") return true;
    return creator.category === selectedNiche || creator.skills?.some(skill => 
      skill.toLowerCase().includes(selectedNiche.toLowerCase().split(' ')[0])
    );
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
      <section id="creators" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
    <section id="creators" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            Top Creators on Hiver{" "}
            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg ml-2">
              <Star className="text-white text-sm" size={16} fill="currentColor" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-base sm:text-lg"
          >
            Discover influencers with proven track records and high Hive Scores.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-2"
          >
            <p className="text-xs text-gray-400 italic">
              Demo profiles shown for illustration purposes
            </p>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search creators by name, niche, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-sm border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
            <Button
              onClick={() => setShowComingSoon(true)}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-6 py-3 text-sm font-medium hover:from-purple-700 hover:to-cyan-600 transition-all duration-300"
            >
              <Search size={16} className="mr-2" />
              Search
            </Button>
          </div>

          {/* Niche Filter */}
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by niche:</span>
            <span className="text-sm text-gray-500">
              {filteredCreators?.length || 0} creators found
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {niches.map((niche) => (
              <Button
                key={niche}
                variant={selectedNiche === niche ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedNiche(niche)}
                className={`transition-all duration-300 text-xs sm:text-sm ${
                  selectedNiche === niche 
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-0 shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                }`}
              >
                {niche}
                {selectedNiche === niche && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1"
                  >
                    <Check size={14} />
                  </motion.span>
                )}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredCreators?.map((creator, index) => (
            <motion.div 
              key={creator.id} 
              variants={cardVariants}
              className="relative"
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative group border-gray-100">
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
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    {creator.category}
                  </Badge>
                </div>
                
                <div className="relative overflow-hidden">
                  <img
                    src={
                      creator.category === "Photography" ? photographyTravelImage :
                      creator.category === "Technology" ? smartphoneImage :
                      creator.category === "Fitness & Health" ? fitnessGymImage :
                      creator.category === "Music & Audio" ? musicStudioImage :
                      creator.category === "Fashion & Lifestyle" ? fashionImage :
                      creator.category === "Beauty & Skincare" ? beautyContentImage :
                      creator.category === "Food & Cooking" ? foodContentImage :
                      creator.category === "Travel" ? photographyTravelImage :
                      index === 0 ? photographyTravelImage : 
                      index === 1 ? smartphoneImage :
                      index === 2 ? fitnessGymImage :
                      index === 3 ? musicStudioImage :
                      index === 4 ? lifestyleImage :
                      index === 5 ? beautyContentImage :
                      index === 6 ? foodContentImage :
                      index === 7 ? fashionImage :
                      creator.profileImage
                    }
                    alt={`${creator.name} - ${creator.category}`}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                    decoding="async"
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
                        <span className="text-purple-600 font-medium">Hive Score: {Math.floor(Math.random() * 20) + 80}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProfile(creator)}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                    >
                      <Eye className="mr-1" size={14} />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <CreatorProfileModal 
          creator={selectedCreator}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
        
        <ComingSoonBanner
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      </div>
    </section>
  );
}
