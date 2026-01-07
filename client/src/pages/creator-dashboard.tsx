import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  Users, 
  Star, 
  Eye,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Camera,
  Video,
  Image,
  Target,
  Award,
  Plus,
  Instagram,
  Music
} from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";

interface CreatorDashboardData {
  profile: {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      profileImageUrl?: string;
      isVerified: boolean;
    };
    profile: {
      id: number;
      bio?: string;
      location?: string;
      niches: string[];
      platforms: string[];
      languages: string[];
      hiveScore?: number;
      engagementRate?: number;
      averageReach?: number;
      isAvailable: boolean;
    } | null;
    socialAccounts: {
      platform: string;
      handle: string;
      followerCount: number;
      isVerified: boolean;
    }[];
  };
  stats: {
    totalApplications: number;
    activeAssignments: number;
    completedCampaigns: number;
    totalEarnings: number;
    recommendationCount: number;
  };
  campaigns: any[];
  applications: any[];
  assignments: any[];
}

export default function CreatorDashboard() {
  const { user, isCreator } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/creator/dashboard'],
  });

  const handleConnectSocial = (platform: string) => {
    // Redirect to OAuth endpoint for the specific platform
    window.location.href = `/api/auth/connect/${platform}`;
  };

  // If user is authenticated but not a creator, redirect to onboarding
  if (user && !isCreator) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Complete Your Setup</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            To access the creator dashboard, please complete your creator profile setup.
          </p>
          <a 
            href="/onboarding/creator" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Complete Creator Setup
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="dashboard-loading">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="dashboard-error">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">Unable to Load Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error.message || "There was an error loading your dashboard. Please try again."}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const dashboardData = data as CreatorDashboardData;
  const { profile, stats, campaigns, applications, assignments } = dashboardData;
  const profileUser = profile.user;
  const creatorProfile = profile.profile;

  // If no creator profile exists, show onboarding prompt
  if (!creatorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="dashboard-onboarding">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">Complete Your Creator Profile</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  To access your dashboard and start receiving campaign opportunities, please complete your creator onboarding.
                </p>
                <Button asChild>
                  <a href="/onboarding/creator">Complete Profile Setup</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" data-testid="creator-dashboard">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100" data-testid="dashboard-welcome">
                Welcome back, {profileUser.firstName || "Creator"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {creatorProfile?.bio || "Content Creator"}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {profileUser.isVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {creatorProfile?.hiveScore && (
                  <Badge variant="outline">
                    <Star className="h-3 w-3 mr-1" />
                    Hive Score: {creatorProfile.hiveScore}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" data-testid="button-edit-profile">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button size="sm" data-testid="button-browse-campaigns">
              <Eye className="h-4 w-4 mr-2" />
              Browse Campaigns
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-earnings">
                {formatCurrency(stats.totalEarnings)}
              </div>
              <p className="text-xs text-muted-foreground">
                From completed campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-active-projects">
                {stats.activeAssignments}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Campaigns</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-completed">
                {stats.completedCampaigns}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-applications">
                {stats.totalApplications}
              </div>
              <p className="text-xs text-muted-foreground">
                Campaign applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Social Accounts & Profile Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Social Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Social Accounts
              </CardTitle>
              <CardDescription>
                Connect your social media accounts to showcase your reach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Connected Accounts */}
              {profile.socialAccounts.length > 0 && (
                <div className="space-y-3">
                  {profile.socialAccounts.map((account, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {account.platform === 'instagram' && <SiInstagram className="h-6 w-6 text-pink-500" />}
                          {account.platform === 'tiktok' && <SiTiktok className="h-6 w-6 text-black dark:text-white" />}
                          {!['instagram', 'tiktok'].includes(account.platform) && (
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {account.platform[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">@{account.handle}</div>
                          <div className="text-sm text-gray-500 capitalize">{account.platform}</div>
                        </div>
                        {account.isVerified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatNumber(account.followerCount)}</div>
                        <div className="text-sm text-gray-500">followers</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Connection Buttons */}
              <div className="space-y-3">
                {/* Instagram Connection */}
                {!profile.socialAccounts.find(acc => acc.platform === 'instagram') && (
                  <Button 
                    className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => handleConnectSocial('instagram')}
                    data-testid="button-connect-instagram"
                  >
                    <SiInstagram className="h-4 w-4 mr-2" />
                    Connect Instagram
                  </Button>
                )}
                
                {/* TikTok Connection */}
                {!profile.socialAccounts.find(acc => acc.platform === 'tiktok') && (
                  <Button 
                    className="w-full justify-start bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    onClick={() => handleConnectSocial('tiktok')}
                    data-testid="button-connect-tiktok"
                  >
                    <SiTiktok className="h-4 w-4 mr-2" />
                    Connect TikTok
                  </Button>
                )}
              </div>
              
              {/* All connected message */}
              {profile.socialAccounts.find(acc => acc.platform === 'instagram') && 
               profile.socialAccounts.find(acc => acc.platform === 'tiktok') && (
                <div className="text-center py-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5 mx-auto mb-1" />
                  <p className="text-sm font-medium">All platforms connected!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {creatorProfile.engagementRate && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Engagement Rate</span>
                    <span className="text-sm text-gray-500">{creatorProfile.engagementRate}%</span>
                  </div>
                  <Progress value={parseFloat(creatorProfile.engagementRate.toString())} className="h-2" />
                </div>
              )}
              
              {creatorProfile.averageReach && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Average Reach</span>
                    <span className="text-sm text-gray-500">{formatNumber(creatorProfile.averageReach)}</span>
                  </div>
                </div>
              )}

              {creatorProfile.hiveScore && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Hive Score</span>
                    <span className="text-sm text-gray-500">{creatorProfile.hiveScore}/100</span>
                  </div>
                  <Progress value={parseFloat(creatorProfile.hiveScore.toString())} className="h-2" />
                </div>
              )}

              <div className="pt-2">
                <Badge variant={creatorProfile.isAvailable ? "default" : "secondary"} className="w-full justify-center">
                  {creatorProfile.isAvailable ? "Available for Work" : "Currently Unavailable"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" data-testid="button-browse-opportunities">
                <Eye className="h-4 w-4 mr-2" />
                Browse Campaign Opportunities
              </Button>
              
              <Button className="w-full justify-start" variant="outline" data-testid="button-view-applications">
                <Calendar className="h-4 w-4 mr-2" />
                View My Applications
              </Button>
              
              <Button className="w-full justify-start" variant="outline" data-testid="button-update-portfolio">
                <Camera className="h-4 w-4 mr-2" />
                Update Portfolio
              </Button>
              
              <Button className="w-full justify-start" variant="outline" data-testid="button-analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns & Applications Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Your Activity</CardTitle>
            <CardDescription>
              Track your campaigns, applications, and assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="campaigns" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="campaigns" data-testid="tab-campaigns">
                  Available Campaigns ({campaigns.length})
                </TabsTrigger>
                <TabsTrigger value="applications" data-testid="tab-applications">
                  My Applications ({applications.length})
                </TabsTrigger>
                <TabsTrigger value="assignments" data-testid="tab-assignments">
                  Active Work ({assignments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="space-y-4">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{campaign.title}</CardTitle>
                            <CardDescription>{campaign.briefDescription}</CardDescription>
                          </div>
                          <Badge>{formatCurrency(campaign.budget)}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {campaign.platforms?.map((platform: string) => (
                            <Badge key={platform} variant="secondary">{platform}</Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Category: {campaign.category}
                          </div>
                          <Button size="sm" data-testid={`button-apply-${campaign.id}`}>
                            Apply Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No Active Campaigns</h3>
                    <p>New campaign opportunities will appear here when available.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Application #{application.id}</CardTitle>
                            <CardDescription>
                              Applied on {new Date(application.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge variant={
                            application.status === 'accepted' ? 'default' :
                            application.status === 'rejected' ? 'destructive' :
                            'secondary'
                          }>
                            {application.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {application.proposedFee && (
                          <div className="text-sm text-gray-600">
                            Proposed Fee: {formatCurrency(application.proposedFee)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No Applications Yet</h3>
                    <p>Your campaign applications will appear here once you start applying.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="assignments" className="space-y-4">
                {assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Assignment #{assignment.id}</CardTitle>
                            <CardDescription>
                              Deadline: {assignment.deliveryDeadline ? 
                                new Date(assignment.deliveryDeadline).toLocaleDateString() : 
                                'No deadline set'
                              }
                            </CardDescription>
                          </div>
                          <Badge variant={
                            assignment.status === 'completed' ? 'default' :
                            assignment.status === 'cancelled' ? 'destructive' :
                            'secondary'
                          }>
                            {assignment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Fee: {formatCurrency(assignment.agreedBaseFee)}
                          </div>
                          {assignment.status === 'active' && (
                            <Button size="sm" variant="outline" data-testid={`button-work-${assignment.id}`}>
                              <Video className="h-4 w-4 mr-2" />
                              Upload Content
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No Active Assignments</h3>
                    <p>Accepted campaign assignments will appear here for you to work on.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}