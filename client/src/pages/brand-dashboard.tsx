import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Filter, X, CheckCircle2, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BrandSidebar, MobileSidebar, SidebarProvider } from "@/components/dashboard/brand-sidebar";
import { BrandHeader } from "@/components/dashboard/brand-header";
import { CreatorCard } from "@/components/dashboard/creator-card";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { mockCreators } from "@/lib/mock-creators";

export default function BrandDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sortBy, setSortBy] = useState("most_briefs");
  const [showHiverrPicks, setShowHiverrPicks] = useState(false);

  const filteredCreators = mockCreators
    .filter((creator) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!creator.name.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (categoryFilter) {
        const hasCategory = creator.categories.some(
          (cat) => cat.toLowerCase().includes(categoryFilter.toLowerCase())
        );
        if (!hasCategory) return false;
      }
      if (showHiverrPicks && !creator.verified) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "hive_score":
          return b.hiveScore.total - a.hiveScore.total;
        case "most_briefs":
          return b.briefsAccepted - a.briefsAccepted;
        case "followers_high":
          const aFollowers = parseFloat(a.followers.replace(/[^\d.]/g, '')) * (a.followers.includes('K') ? 1000 : 1);
          const bFollowers = parseFloat(b.followers.replace(/[^\d.]/g, '')) * (b.followers.includes('K') ? 1000 : 1);
          return bFollowers - aFollowers;
        case "recently_active":
          const timeToMinutes = (time: string) => {
            if (time.includes('m')) return parseInt(time);
            if (time.includes('h')) return parseInt(time) * 60;
            return 999;
          };
          return timeToMinutes(a.lastActive) - timeToMinutes(b.lastActive);
        default:
          return 0;
      }
    });

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

  const handleInvite = (creatorId: number) => {
    console.log("Inviting creator:", creatorId);
  };

  const handleSave = (creatorId: number) => {
    console.log("Saving creator:", creatorId);
  };

  const clearFilters = () => {
    setCategoryFilter("");
    setCountryFilter("");
    setSortBy("most_briefs");
    setSearchQuery("");
    setShowHiverrPicks(false);
  };

  const hasActiveFilters = categoryFilter || countryFilter || searchQuery || showHiverrPicks;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <BrandSidebar />
        <MobileSidebar />
        
        <div className="lg:ml-64">
          <BrandHeader title="Creators" breadcrumb={["Creators"]} />
          
          <main className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Find Creators</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">Discover and connect with top UGC creators</p>
            </div>
            <Button 
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white w-full sm:w-auto"
              onClick={() => setLocation("/brand/dashboard/briefs/create")}
              data-testid="button-create-brief"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Brief
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-gray-100">
              <TabsTrigger 
                value="discover" 
                className="data-[state=active]:bg-white"
                data-testid="tab-discover"
              >
                Discover
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-white"
                data-testid="tab-saved"
              >
                Saved
              </TabsTrigger>
              <TabsTrigger 
                value="worked-with" 
                className="data-[state=active]:bg-white"
                data-testid="tab-worked-with"
              >
                Worked With
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="mt-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Filter by:</span>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-32" data-testid="filter-category">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-44" data-testid="filter-sort">
                      <SelectValue placeholder="Most briefs accepted" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hive_score">Hive Score</SelectItem>
                      <SelectItem value="most_briefs">Most briefs accepted</SelectItem>
                      <SelectItem value="recently_active">Recently active</SelectItem>
                      <SelectItem value="followers_high">Most followers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Country:</span>
                  <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger className="w-32" data-testid="filter-country">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={clearFilters}
                    data-testid="button-clear-filters"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <CheckCircle2 className={`w-5 h-5 ${showHiverrPicks ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-600">Only Show Hiverr Picks</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">Hiverr Picks are verified creators with a Hive Score of 400+ who have completed at least 5 briefs and maintain high quality standards.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={showHiverrPicks}
                    onChange={(e) => setShowHiverrPicks(e.target.checked)}
                    data-testid="checkbox-hiverr-picks"
                  />
                </div>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                  data-testid="input-search"
                />
              </div>

              <div className="flex items-center gap-6 mb-6 text-sm">
                <span className="text-gray-600">
                  Challenge Invites: <strong className="text-gray-900">Unlimited</strong>
                </span>
                <span className="text-gray-600">
                  Brief Invites: <strong className="text-gray-900">20</strong>
                </span>
                <span className="text-gray-600">
                  CPM Invites: <strong className="text-gray-900">20</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCreators.length > 0 ? (
                  filteredCreators.map((creator) => (
                    <CreatorCard
                      key={creator.id}
                      {...creator}
                      onInvite={handleInvite}
                      onSave={handleSave}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No creators found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved creators yet</h3>
                <p className="text-gray-500 mb-4">Save creators you're interested in to find them easily later</p>
                <Button 
                  onClick={() => setActiveTab("discover")}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                >
                  Discover Creators
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="worked-with" className="mt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No collaborations yet</h3>
                <p className="text-gray-500 mb-4">Creators you've worked with will appear here</p>
                <Button 
                  onClick={() => setActiveTab("discover")}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                >
                  Find Creators
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
