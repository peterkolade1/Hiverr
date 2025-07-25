import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Campaign } from "@shared/schema";

// Import cooking images
import cookingImage from "@assets/medium-shot-women-cooking-together_1752546339467.jpg";
import cookingImageNew from "@assets/medium-shot-women-cooking-together_1752546751336.jpg";
// Import new creator images
import youngFriendsImage from "@assets/young-friends-posing-together-low-angle_1752547296035.jpg";
import beautyVloggerImage from "@assets/woman-beauty-vlogger-filming-vlog-about-creams_1752547296036.jpg";
import foodPhotoImage from "@assets/woman-taking-photo-her-food_1752547296036.jpg";
import gymImage from "@assets/tired-young-woman-resting-while-sitting-after-working-out-gym_1752547296037.jpg";
import smartphoneImage from "@assets/portrait-woman-using-smartphone-with-pop-socket-outdoors_1752546751339.jpg";

export function SuccessStories() {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const metrics = [
    { value: "340%", label: "Average engagement increase", color: "text-brand-purple" },
    { value: "2.5M+", label: "Content views generated", color: "text-brand-cyan" },
    { value: "89%", label: "Client satisfaction rate", color: "text-brand-orange" },
    { value: "1,200+", label: "Successful campaigns", color: "text-green-500" },
  ];

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-16"></div>
            <div className="grid grid-cols-2 gap-6 lg:w-1/2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl h-24"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featuredCampaign = campaigns?.[0];

  return (
    <section id="success-stories" className="py-20 bg-gradient-to-br from-purple-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Campaign Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Real results from brands that trust Hiver for their UGC campaigns
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Campaign */}
          {featuredCampaign && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <img
                      src={featuredCampaign.campaignImage}
                      alt={featuredCampaign.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{featuredCampaign.title}</h3>
                      <p className="text-gray-600">{featuredCampaign.description}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(featuredCampaign.rating)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{featuredCampaign.rating}.0 rating</span>
                      </div>
                    </div>
                  </div>
                  
                  {featuredCampaign.testimonial && (
                    <blockquote className="text-gray-700 mb-6 leading-relaxed">
                      "{featuredCampaign.testimonial}"
                    </blockquote>
                  )}
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(featuredCampaign.metrics).map(([key, value], index) => (
                      <div key={key} className="text-center">
                        <div className={`text-2xl font-bold ${
                          index === 0 ? "text-brand-purple" : 
                          index === 1 ? "text-brand-cyan" : "text-brand-orange"
                        }`}>
                          {value}
                        </div>
                        <div className="text-xs text-gray-600 capitalize">
                          {key === "downloads" ? "App Downloads" :
                           key === "reach" ? "Video Views" :
                           key === "conversions" ? "Conversion Rate" :
                           key}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {featuredCampaign.clientName && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600">
                        <strong>{featuredCampaign.clientName}</strong>
                        {featuredCampaign.clientTitle && ` • ${featuredCampaign.clientTitle}`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Creator Success Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {/* Beauty Vlogger Success */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <img
                src={beautyVloggerImage}
                alt="Beauty Vlogger Campaign"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2">Beauty Brand Launch</h4>
                <p className="text-sm text-gray-600 mb-3">Skincare routine content drove 300% sales increase</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">+300%</span>
                  <span className="text-xs text-gray-500">Sales Growth</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Photography Success */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <img
                src={foodPhotoImage}
                alt="Food Photography Campaign"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2">Restaurant Partnership</h4>
                <p className="text-sm text-gray-600 mb-3">Food content generated 50K+ restaurant visits</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-purple-600">50K+</span>
                  <span className="text-xs text-gray-500">New Visits</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Success */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <img
                src={gymImage}
                alt="Fitness Campaign"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2">Fitness App Launch</h4>
                <p className="text-sm text-gray-600 mb-3">Workout content drove 100K+ app downloads</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-cyan-600">100K+</span>
                  <span className="text-xs text-gray-500">Downloads</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Success */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <img
                src={youngFriendsImage}
                alt="Lifestyle Campaign"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2">Fashion Collab</h4>
                <p className="text-sm text-gray-600 mb-3">Lifestyle content reached 2M+ people</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">2M+</span>
                  <span className="text-xs text-gray-500">Reach</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {campaigns?.slice(1).map((campaign, index) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <img
                  src={index === 0 ? cookingImage : 
                       index === 1 ? smartphoneImage : 
                       campaign.campaignImage}
                  alt={campaign.title}
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
                <h4 className="font-bold text-gray-900 mb-2">{campaign.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="brand-purple font-semibold">
                    {Object.values(campaign.metrics)[0]}
                  </span>
                  <span className="text-gray-500">
                    {campaign.category} • {Math.floor(Math.random() * 20) + 5} creators
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
