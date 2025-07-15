import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Handshake, Rocket, Star, Plus, Minus } from "lucide-react";
import heroImage from "@assets/back-view-woman-with-blue-background_1752550924992.jpg";

export function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState(0);

  const steps = [
    {
      icon: <Search size={20} />,
      title: "Submit a Brief",
      description: "Structured brief form to outline goals, budget, and deliverables.",
      details: "Fill out our comprehensive brief form with campaign objectives, target audience, content requirements, and budget parameters to get started.",
    },
    {
      icon: <Handshake size={20} />,
      title: "Match with Creators",
      description: "Get matched with top influencers using our Hive Score.",
      details: "Our algorithm analyzes creator performance, audience alignment, and engagement quality to match you with the perfect creators for your brand.",
    },
    {
      icon: <Rocket size={20} />,
      title: "Collaborate & Track",
      description: "Manage UGC delivery, feedback, and status in one dashboard.",
      details: "Monitor project progress, provide feedback, approve content, and track campaign performance all from your centralized dashboard.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 neon-background overflow-hidden">
      {/* Floating orbs for How It Works */}
      <div className="floating-orb floating-orb-2" style={{ top: '20%', left: '80%', animationDelay: '1s' }}></div>
      <div className="floating-orb floating-orb-1" style={{ bottom: '30%', right: '10%', animationDelay: '3s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4"
          >
            Three simple steps to launch successful UGC campaigns with top-tier creators who match your brand perfectly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src={heroImage}
              alt="Creative content creator"
              className="rounded-2xl shadow-lg w-full object-cover h-[500px]"
            />
            
            {/* Floating Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs border border-cyan-100"
            >
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                  alt="Content creator profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Rebecca Johnson</h4>
                  <p className="text-xs text-gray-600">Fashion & Lifestyle Creator</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">$350/hr</span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-xs text-gray-500">New York</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-300">
                <Plus className="mr-1" size={12} />
                Show More
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Process Steps */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {steps.map((step, index) => (
              <Card
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <div
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    expandedStep === index 
                      ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white" 
                      : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50"
                  }`}
                  onClick={() => setExpandedStep(expandedStep === index ? -1 : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 transition-all duration-300 ${
                          expandedStep === index
                            ? "bg-white text-blue-600"
                            : "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full transition-all duration-300 ${
                        expandedStep === index
                          ? "bg-white/20 hover:bg-white/30 text-white"
                          : "bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-600"
                      }`}
                    >
                      {expandedStep === index ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </Button>
                  </div>
                  <AnimatePresence>
                    {expandedStep === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pl-12"
                      >
                        <p className="text-gray-300 mb-2">{step.description}</p>
                        <p className="text-gray-400 text-sm">{step.details}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
