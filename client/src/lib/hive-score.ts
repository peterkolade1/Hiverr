export interface CreatorStats {
  briefsCompleted: number;
  earningsFromBriefs: number;
  challengesCompleted: number;
  referralsCompleted: number;
}

export interface HiveScoreBreakdown {
  total: number;
  briefsScore: number;
  earningsScore: number;
  challengesScore: number;
  referralsScore: number;
  rank: string;
  rankColor: string;
  rankEmoji: string;
}

const MAX_SCORES = {
  briefs: 400,
  earnings: 300,
  challenges: 150,
  referrals: 150,
};

export function calculateHiveScore(stats: CreatorStats): HiveScoreBreakdown {
  // Briefs Completed (Max 400): 1 brief = 40 pts, 10+ = 400 pts cap
  const briefsScore = Math.min(stats.briefsCompleted * 40, MAX_SCORES.briefs);
  
  // Earnings from Briefs (Max 300): min(total_earned / 1000, 1) × 300
  const earningsScore = Math.round(
    Math.min(stats.earningsFromBriefs / 1000, 1) * MAX_SCORES.earnings
  );
  
  // Challenges Completed (Max 150): min(challenges_completed / 5, 1) × 150
  const challengesScore = Math.round(
    Math.min(stats.challengesCompleted / 5, 1) * MAX_SCORES.challenges
  );
  
  // Referrals Completed (Max 150): min(referrals_completed / 3, 1) × 150
  const referralsScore = Math.round(
    Math.min(stats.referralsCompleted / 3, 1) * MAX_SCORES.referrals
  );

  const total = briefsScore + earningsScore + challengesScore + referralsScore;

  const { rank, rankColor, rankEmoji } = getHiveRank(total);

  return {
    total,
    briefsScore,
    earningsScore,
    challengesScore,
    referralsScore,
    rank,
    rankColor,
    rankEmoji,
  };
}

export function getHiveRank(score: number): { rank: string; rankColor: string; rankEmoji: string } {
  if (score >= 850) {
    return { 
      rank: "Hive Leader", 
      rankColor: "from-purple-500 to-fuchsia-500",
      rankEmoji: "🟣"
    };
  } else if (score >= 650) {
    return { 
      rank: "Elite Bee", 
      rankColor: "from-blue-500 to-cyan-500",
      rankEmoji: "🔵"
    };
  } else if (score >= 400) {
    return { 
      rank: "Power Bee", 
      rankColor: "from-green-500 to-emerald-500",
      rankEmoji: "🟢"
    };
  } else if (score >= 200) {
    return { 
      rank: "Active Bee", 
      rankColor: "from-yellow-400 to-amber-500",
      rankEmoji: "🟡"
    };
  } else {
    return { 
      rank: "Newbie", 
      rankColor: "from-orange-400 to-amber-600",
      rankEmoji: "🟠"
    };
  }
}

export function formatHiveScore(score: number): string {
  return score.toLocaleString();
}
