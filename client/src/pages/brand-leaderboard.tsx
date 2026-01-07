import { Trophy, Crown, Medal, Target, TrendingUp, Award, Users } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandSidebar } from "@/components/dashboard/brand-sidebar";
import { BrandHeader } from "@/components/dashboard/brand-header";
import { useAuth } from "@/hooks/useAuth";
import { getTopCreators, type MockCreator } from "@/lib/mock-creators";
import { SiTiktok, SiInstagram, SiYoutube } from "react-icons/si";

const platformIcons: Record<string, React.ElementType> = {
  tiktok: SiTiktok,
  instagram: SiInstagram,
  youtube: SiYoutube,
};

function LeaderboardRow({ creator, rank }: { creator: MockCreator; rank: number }) {
  const PlatformIcon = platformIcons[creator.platform.toLowerCase()] || SiTiktok;
  
  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankBgColor = () => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200";
      default:
        return "bg-white border-gray-100";
    }
  };

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-xl border ${getRankBgColor()} transition-all hover:shadow-md`}
      data-testid={`leaderboard-row-${rank}`}
    >
      <div className="flex-shrink-0 w-10 flex justify-center">
        {getRankIcon()}
      </div>
      
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
            {creator.name.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
            <PlatformIcon className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{creator.name}</span>
            {creator.verified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="flex items-center gap-1">
              <span>{creator.hiveScore.rankEmoji}</span>
              <span 
                className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${creator.hiveScore.rankColor} text-white text-xs font-medium`}
              >
                {creator.hiveScore.rank}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-0.5">
            <span className="flex items-center gap-1">
              <PlatformIcon className="w-3.5 h-3.5" />
              {creator.followers}
            </span>
            <span>{creator.categories.slice(0, 2).join(" • ")}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Briefs</p>
          <p className="font-semibold text-gray-900">{creator.stats.briefsCompleted}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Challenges</p>
          <p className="font-semibold text-gray-900">{creator.stats.challengesCompleted}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Referrals</p>
          <p className="font-semibold text-gray-900">{creator.stats.referralsCompleted}</p>
        </div>
        <div className="text-center min-w-[80px]">
          <div 
            className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${creator.hiveScore.rankColor} text-white font-bold flex items-center justify-center gap-1`}
          >
            <span>🐝</span>
            <span>{creator.hiveScore.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBreakdownCard() {
  return (
    <Card className="bg-gradient-to-br from-[#8B5CF6] to-purple-700 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          How Hive Score Works
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-purple-100 text-sm">
          Creators earn Hive Score (0–1000) based on their platform activity:
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-sm">Briefs Completed</span>
            </div>
            <span className="font-bold">40%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: "40%" }} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Earnings from Briefs</span>
            </div>
            <span className="font-bold">30%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: "30%" }} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="text-sm">Challenges Completed</span>
            </div>
            <span className="font-bold">15%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: "15%" }} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Referrals Completed</span>
            </div>
            <span className="font-bold">15%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: "15%" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BrandLeaderboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const topCreators = getTopCreators(10);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please sign in to continue.</p>
            <Button onClick={() => setLocation("/login")} className="w-full mt-4 bg-[#8B5CF6] hover:bg-[#7C3AED]">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BrandSidebar />
      
      <div className="ml-64">
        <BrandHeader title="Hive Leaderboard" breadcrumb={["Hive Leaderboard"]} />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span>🐝</span> Hive Leaderboard
              </h1>
              <p className="text-gray-500 mt-1">Discover top-performing creators ranked by their Hive Score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Top Creators by Hive Score</h2>
                <span className="text-sm text-gray-500">Updated in real-time</span>
              </div>
              {topCreators.map((creator, index) => (
                <LeaderboardRow 
                  key={creator.id} 
                  creator={creator} 
                  rank={index + 1} 
                />
              ))}
            </div>
            
            <div className="space-y-6">
              <ScoreBreakdownCard />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>🐝</span> Hive Score Tiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🟣</span>
                      <span className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs font-bold">Hive Leader</span>
                    </div>
                    <span className="text-sm text-gray-500">850-1000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🔵</span>
                      <span className="px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold">Elite Bee</span>
                    </div>
                    <span className="text-sm text-gray-500">650-849</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🟢</span>
                      <span className="px-2 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold">Power Bee</span>
                    </div>
                    <span className="text-sm text-gray-500">400-649</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🟡</span>
                      <span className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold">Active Bee</span>
                    </div>
                    <span className="text-sm text-gray-500">200-399</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🟠</span>
                      <span className="px-2 py-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-600 text-white text-xs font-bold">Newbie</span>
                    </div>
                    <span className="text-sm text-gray-500">0-199</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
