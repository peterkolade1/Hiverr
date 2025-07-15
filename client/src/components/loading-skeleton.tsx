import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "image" | "text" | "button";
}

export function LoadingSkeleton({ className = "", variant = "card" }: LoadingSkeletonProps) {
  const skeletonVariants = {
    card: "h-64 rounded-xl",
    image: "aspect-square rounded-lg", 
    text: "h-4 rounded",
    button: "h-10 rounded-lg w-24"
  };

  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${skeletonVariants[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite"
      }}
    />
  );
}