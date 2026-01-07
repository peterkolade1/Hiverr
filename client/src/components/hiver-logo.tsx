import hiverLogo from "@assets/Logo_1753368509696.png";

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
      <img
        src={hiverLogo}
        alt="Hiverr Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

interface HiverWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function HiverWordmark({ className = "", size = "md" }: HiverWordmarkProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8", 
    lg: "h-12"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={hiverLogo}
        alt="Hiverr"
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
}