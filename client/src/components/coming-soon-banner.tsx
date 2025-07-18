import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, X } from "lucide-react";

interface ComingSoonBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComingSoonBanner({ isOpen, onClose }: ComingSoonBannerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 text-center">
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
                className="text-2xl lg:text-3xl font-bold mb-4 leading-tight"
              >
                Search Feature{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Coming Soon
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-gray-300 mb-6 leading-relaxed"
              >
                We're working hard to bring you advanced search capabilities to find the perfect creators for your campaigns.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-2 transition-all duration-300 hover:scale-105"
                >
                  Got it!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}