import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HiverLogo } from "./hiver-logo";
import { Sparkles, ArrowRight } from "lucide-react";

export function ComingSoonBanner() {

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center bg-purple-600/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="mr-2 text-purple-400" size={16} />
              <span className="text-purple-400 text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Early access benefits for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              brands and creators
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 max-w-3xl mx-auto"
          >
            <ul className="text-lg text-gray-300 space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>Priority access to top-performing verified creators</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>Special launch pricing with reduced commission rates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>Direct feedback line to our product team</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>Exclusive beta features and early campaign tools</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => window.location.href = '/waitlist'}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
            >
              Join the Waitlist
              <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex justify-center items-center space-x-8 opacity-50"
          >
            <div className="text-sm text-gray-400">
              <span className="font-semibold text-white">2,500+</span> creators signed up
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="text-sm text-gray-400">
              <span className="font-semibold text-white">150+</span> brands waiting
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="text-sm text-gray-400">
              <span className="font-semibold text-white">Q4 2025</span> launch
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}