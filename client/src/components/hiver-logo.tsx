interface HiverLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function HiverLogo({ className = "", size = "md" }: HiverLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="hiverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        
        {/* Hexagon base */}
        <path
          d="M16 2L26 8v16l-10 6L6 24V8l10-6z"
          fill="url(#hiverGradient)"
          className="drop-shadow-sm"
        />
        
        {/* Honeycomb pattern */}
        <g fill="white" fillOpacity="0.2">
          <path d="M16 6L22 10v8l-6 4-6-4v-8l6-4z" />
          <path d="M12 12L16 14v4l-4 2-4-2v-4l4-2z" />
          <path d="M20 12L24 14v4l-4 2-4-2v-4l4-2z" />
        </g>
        
        {/* Center highlight */}
        <circle cx="16" cy="16" r="3" fill="white" fillOpacity="0.3" />
        
        {/* "H" letter overlay */}
        <path
          d="M12 12v8M12 16h8M20 12v8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

interface HiverWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function HiverWordmark({ className = "", size = "md" }: HiverWordmarkProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <HiverLogo size={size} className="mr-2" />
      <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
        Hiverr
      </span>
    </div>
  );
}