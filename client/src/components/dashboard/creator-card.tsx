import { Bookmark, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiTiktok, SiInstagram, SiYoutube } from "react-icons/si";
import { type HiveScoreBreakdown } from "@/lib/hive-score";

interface CreatorCardProps {
  id: number;
  name: string;
  avatar?: string;
  platform: string;
  followers: string;
  categories: string[];
  briefsAccepted: number;
  avgBriefSize: string;
  lastActive: string;
  verified?: boolean;
  hiveScore?: HiveScoreBreakdown;
  onInvite?: (id: number) => void;
  onSave?: (id: number) => void;
}

const platformIcons: Record<string, React.ElementType> = {
  tiktok: SiTiktok,
  instagram: SiInstagram,
  youtube: SiYoutube,
};

export function CreatorCard({
  id,
  name,
  avatar,
  platform,
  followers,
  categories,
  briefsAccepted,
  avgBriefSize,
  lastActive,
  verified,
  hiveScore,
  onInvite,
  onSave,
}: CreatorCardProps) {
  const PlatformIcon = platformIcons[platform.toLowerCase()] || SiTiktok;

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
      data-testid={`card-creator-${id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {avatar ? (
              <img 
                src={avatar} 
                alt={name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                {name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
              <PlatformIcon className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900">{name}</span>
              {verified && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <PlatformIcon className="w-3.5 h-3.5" />
              <span>{followers}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hiveScore && (
            <div 
              className={`px-2.5 py-1 rounded-full bg-gradient-to-r ${hiveScore.rankColor} text-white text-xs font-bold flex items-center gap-1`}
              title={`${hiveScore.rank} - ${hiveScore.total} pts`}
            >
              <span>🐝</span>
              <span>{hiveScore.total}</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-[#8B5CF6]"
            onClick={() => onSave?.(id)}
            data-testid={`button-save-${id}`}
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {hiveScore && (
          <Badge 
            className={`bg-gradient-to-r ${hiveScore.rankColor} text-white font-medium border-0`}
          >
            {hiveScore.rank}
          </Badge>
        )}
        {categories.slice(0, 2).map((category, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-gray-100 text-gray-700 font-normal"
          >
            {category}
          </Badge>
        ))}
        {categories.length > 2 && (
          <Badge variant="secondary" className="bg-gray-100 text-gray-500 font-normal">
            +{categories.length - 2}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-900">{briefsAccepted}</p>
          <p className="text-xs text-gray-500">Briefs Accepted</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{avgBriefSize}</p>
          <p className="text-xs text-gray-500">Avg Brief Size</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{lastActive}</p>
          <p className="text-xs text-gray-500">Last Active</p>
        </div>
      </div>

      <Button 
        className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
        onClick={() => onInvite?.(id)}
        data-testid={`button-invite-${id}`}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Invite
      </Button>
    </div>
  );
}
