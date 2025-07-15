import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Users } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

export function ServicesSection() {
  const services = [
    {
      icon: <FaInstagram className="text-xl" />,
      iconBg: "bg-pink-500",
      title: "Instagram Creators",
      description: "Visual storytelling experts creating stunning feed content, Reels, and Stories that drive engagement.",
      features: ["Feed Posts & Carousels", "Instagram Reels", "Stories & Highlights", "IGTV Content"],
      price: "Starting from $250/post",
      bgColor: "bg-gray-900 text-white",
      featureBadgeStyle: "bg-white/10 text-white",
    },
    {
      icon: <FaTiktok className="text-xl text-white" />,
      iconBg: "bg-purple-500",
      title: "TikTok Creators",
      description: "Viral content specialists creating engaging short-form videos that capture trends and drive brand awareness.",
      features: ["Trending Challenges", "Product Demos", "Behind-the-Scenes", "Brand Storytelling"],
      price: "Starting from $180/video",
      bgColor: "bg-white",
      featureBadgeStyle: "bg-purple-50 text-purple-700",
    },
    {
      icon: <FaYoutube className="text-xl text-white" />,
      iconBg: "bg-red-500",
      title: "YouTube Creators",
      description: "Long-form content experts creating in-depth reviews, tutorials, and brand integrations for deeper audience connections.",
      features: ["Product Reviews", "Tutorial Videos", "Vlogs & Lifestyle", "Sponsored Integrations"],
      price: "Starting from $500/video",
      bgColor: "bg-white",
      featureBadgeStyle: "bg-red-50 text-red-700",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Explore{" "}
            <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-orange rounded-lg mx-2">
              <Lightbulb className="text-white text-sm" size={16} />
            </span>
            Our Expert Creator Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Tailored Solutions for Every Digital Marketing Campaign.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Button variant="ghost" className="group">
              <Users className="mr-2 group-hover:text-brand-purple transition-colors" size={16} />
              <span className="font-medium">Explore Creator Categories</span>
            </Button>
          </motion.div>
        </div>

        <div className="text-left mb-8">
          <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <Card
              key={index}
              className={`${service.bgColor} hover:shadow-xl transition-shadow duration-300 border-none`}
            >
              <CardContent className="p-8">
                <div className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className={`${service.bgColor === "bg-gray-900 text-white" ? "text-gray-300" : "text-gray-600"} mb-6`}>
                  {service.description}
                </p>
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <Badge
                      key={featureIndex}
                      className={`${service.featureBadgeStyle} mr-2 mb-2 inline-block`}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className={`text-sm ${service.bgColor === "bg-gray-900 text-white" ? "text-gray-400" : "text-gray-500"}`}>
                  {service.price.split("$")[0]}
                  <span className={`${service.bgColor === "bg-gray-900 text-white" ? "text-white" : "text-gray-900"} font-semibold`}>
                    ${service.price.split("$")[1]}
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
