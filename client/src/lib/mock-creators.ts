import { calculateHiveScore, type CreatorStats, type HiveScoreBreakdown } from "./hive-score";

export interface MockCreator {
  id: number;
  name: string;
  avatar?: string;
  platform: string;
  followers: string;
  categories: string[];
  briefsAccepted: number;
  avgBriefSize: string;
  lastActive: string;
  verified: boolean;
  stats: CreatorStats;
  hiveScore: HiveScoreBreakdown;
}

const rawCreators = [
  {
    id: 1,
    name: "Kyra Brown",
    platform: "tiktok",
    followers: "2.4K",
    categories: ["Apparel & Fashion", "Beauty", "Lifestyle"],
    briefsAccepted: 254,
    avgBriefSize: "$50",
    lastActive: "4h ago",
    verified: true,
    stats: {
      briefsCompleted: 10,
      earningsFromBriefs: 4800,
      challengesCompleted: 5,
      referralsCompleted: 4,
    },
  },
  {
    id: 2,
    name: "Kayla Krauter",
    platform: "tiktok",
    followers: "18K",
    categories: ["Pets & Animals", "Beauty", "Lifestyle"],
    briefsAccepted: 176,
    avgBriefSize: "$44",
    lastActive: "4h ago",
    verified: false,
    stats: {
      briefsCompleted: 7,
      earningsFromBriefs: 2200,
      challengesCompleted: 3,
      referralsCompleted: 2,
    },
  },
  {
    id: 3,
    name: "Eric Tyler",
    platform: "instagram",
    followers: "45K",
    categories: ["Tech", "Gaming", "Lifestyle"],
    briefsAccepted: 89,
    avgBriefSize: "$75",
    lastActive: "2h ago",
    verified: true,
    stats: {
      briefsCompleted: 8,
      earningsFromBriefs: 3500,
      challengesCompleted: 4,
      referralsCompleted: 3,
    },
  },
  {
    id: 4,
    name: "Sarah Chen",
    platform: "youtube",
    followers: "120K",
    categories: ["Beauty", "Skincare", "Wellness"],
    briefsAccepted: 312,
    avgBriefSize: "$120",
    lastActive: "1h ago",
    verified: true,
    stats: {
      briefsCompleted: 10,
      earningsFromBriefs: 5000,
      challengesCompleted: 5,
      referralsCompleted: 5,
    },
  },
  {
    id: 5,
    name: "Marcus Johnson",
    platform: "tiktok",
    followers: "8.5K",
    categories: ["Fitness", "Health", "Nutrition"],
    briefsAccepted: 67,
    avgBriefSize: "$35",
    lastActive: "6h ago",
    verified: false,
    stats: {
      briefsCompleted: 4,
      earningsFromBriefs: 1200,
      challengesCompleted: 2,
      referralsCompleted: 1,
    },
  },
  {
    id: 6,
    name: "Luna Martinez",
    platform: "instagram",
    followers: "32K",
    categories: ["Food", "Cooking", "Lifestyle"],
    briefsAccepted: 198,
    avgBriefSize: "$55",
    lastActive: "30m ago",
    verified: true,
    stats: {
      briefsCompleted: 9,
      earningsFromBriefs: 4200,
      challengesCompleted: 4,
      referralsCompleted: 3,
    },
  },
  {
    id: 7,
    name: "Jason Park",
    platform: "youtube",
    followers: "85K",
    categories: ["Tech", "Reviews", "Gadgets"],
    briefsAccepted: 145,
    avgBriefSize: "$95",
    lastActive: "3h ago",
    verified: true,
    stats: {
      briefsCompleted: 10,
      earningsFromBriefs: 4500,
      challengesCompleted: 3,
      referralsCompleted: 4,
    },
  },
  {
    id: 8,
    name: "Mia Rodriguez",
    platform: "instagram",
    followers: "56K",
    categories: ["Fashion", "Travel", "Lifestyle"],
    briefsAccepted: 223,
    avgBriefSize: "$68",
    lastActive: "45m ago",
    verified: true,
    stats: {
      briefsCompleted: 10,
      earningsFromBriefs: 3800,
      challengesCompleted: 5,
      referralsCompleted: 2,
    },
  },
  {
    id: 9,
    name: "Tyler Brooks",
    platform: "tiktok",
    followers: "290K",
    categories: ["Comedy", "Entertainment", "Lifestyle"],
    briefsAccepted: 412,
    avgBriefSize: "$150",
    lastActive: "1h ago",
    verified: true,
    stats: {
      briefsCompleted: 10,
      earningsFromBriefs: 5000,
      challengesCompleted: 5,
      referralsCompleted: 5,
    },
  },
  {
    id: 10,
    name: "Ava Williams",
    platform: "instagram",
    followers: "15K",
    categories: ["Beauty", "Makeup", "Skincare"],
    briefsAccepted: 78,
    avgBriefSize: "$40",
    lastActive: "5h ago",
    verified: false,
    stats: {
      briefsCompleted: 5,
      earningsFromBriefs: 1800,
      challengesCompleted: 2,
      referralsCompleted: 1,
    },
  },
];

export const mockCreators: MockCreator[] = rawCreators.map((creator) => ({
  ...creator,
  hiveScore: calculateHiveScore(creator.stats),
}));

export const getCreatorsByHiveScore = (): MockCreator[] => {
  return [...mockCreators].sort((a, b) => b.hiveScore.total - a.hiveScore.total);
};

export const getTopCreators = (limit: number = 10): MockCreator[] => {
  return getCreatorsByHiveScore().slice(0, limit);
};
