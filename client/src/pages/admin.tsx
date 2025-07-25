import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LazyImage } from "@/components/lazy-image";
import { Users, Mail, Calendar, Search, Download, Eye, User, Building2, MapPin, Globe, Star, DollarSign, Link, Filter, UserCheck, Briefcase, Instagram, Youtube, Twitter, Facebook } from "lucide-react";
import type { Waitlist } from "@shared/schema";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Waitlist | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<"all" | "brands" | "creators">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "custom">("all");
  const [customDateFrom, setCustomDateFrom] = useState<string>("");
  const [customDateTo, setCustomDateTo] = useState<string>("");

  const { data: waitlistEntries, isLoading } = useQuery<Waitlist[]>({
    queryKey: ["/api/admin/waitlist"],
    enabled: isAuthenticated,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  // Helper function to determine if entry is a brand or creator
  const getUserType = (entry: Waitlist): "brand" | "creator" => {
    // Check for creator-specific fields first (more specific indicators)
    if (entry.niches || entry.selectedPlatforms || entry.profilePicture || 
        entry.instagram || entry.tiktok || entry.youtube || entry.location) {
      return "creator";
    }
    // Check for brand-specific fields
    if (entry.companyName) {
      return "brand";
    }
    // Default fallback - if no specific indicators, assume creator
    return "creator";
  };

  // Helper function to check if entry matches date filter
  const matchesDateFilter = (entry: Waitlist): boolean => {
    if (!entry.createdAt || dateFilter === "all") return true;
    
    const entryDate = new Date(entry.createdAt);
    const now = new Date();
    
    switch (dateFilter) {
      case "today":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return entryDate >= today && entryDate < tomorrow;
        
      case "week":
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate >= weekAgo;
        
      case "month":
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return entryDate >= monthAgo;
        
      case "custom":
        if (!customDateFrom && !customDateTo) return true;
        const fromDate = customDateFrom ? new Date(customDateFrom) : new Date("1900-01-01");
        const toDate = customDateTo ? new Date(customDateTo) : new Date("2100-01-01");
        toDate.setHours(23, 59, 59, 999); // Include the entire end date
        return entryDate >= fromDate && entryDate <= toDate;
        
      default:
        return true;
    }
  };

  // Enhanced filtering logic
  const filteredEntries = waitlistEntries?.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userType = getUserType(entry);
    const matchesUserType = userTypeFilter === "all" || 
      (userTypeFilter === "brands" && userType === "brand") ||
      (userTypeFilter === "creators" && userType === "creator");
    
    const matchesDate = matchesDateFilter(entry);
    
    return matchesSearch && matchesUserType && matchesDate;
  }) || [];

  // Statistics calculations
  const brandEntries = waitlistEntries?.filter(entry => getUserType(entry) === "brand") || [];
  const creatorEntries = waitlistEntries?.filter(entry => getUserType(entry) === "creator") || [];

  const exportToCSV = () => {
    if (!waitlistEntries) return;
    
    const headers = ['Name', 'Email', 'User Type', 'Date Joined'];
    const csvContent = [
      headers.join(','),
      ...waitlistEntries.map(entry => [
        entry.name,
        entry.email,
        entry.companyName ? 'Brand' : 'Creator',
        new Date(entry.createdAt!).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hiverr-waitlist.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
            <p className="text-gray-600">Enter password to access waitlist data</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Waitlist Admin</h1>
              <p className="text-gray-600 mt-2">Manage Hiverr platform waitlist entries</p>
            </div>
            <Button onClick={() => setIsAuthenticated(false)} variant="outline">
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Signups</p>
                    <p className="text-3xl font-bold text-gray-900">{waitlistEntries?.length || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Brands</p>
                    <p className="text-3xl font-bold text-gray-900">{brandEntries.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Creators</p>
                    <p className="text-3xl font-bold text-gray-900">{creatorEntries.length}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {waitlistEntries?.filter(entry => {
                        const entryDate = new Date(entry.createdAt!);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return entryDate > weekAgo;
                      }).length || 0}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-cyan-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {waitlistEntries?.length ? Math.round((waitlistEntries.length / 1000) * 100) : 0}%
                    </p>
                  </div>
                  <Mail className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={exportToCSV} variant="outline" className="gap-2">
                    <Download size={16} />
                    Export CSV
                  </Button>
                </div>
                
                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Filters:</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="user-type-filter" className="text-sm">User Type</Label>
                      <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="brands">
                            <div className="flex items-center gap-2">
                              <Building2 size={14} />
                              Brands
                            </div>
                          </SelectItem>
                          <SelectItem value="creators">
                            <div className="flex items-center gap-2">
                              <UserCheck size={14} />
                              Creators
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="date-filter" className="text-sm">Date Range</Label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              Today
                            </div>
                          </SelectItem>
                          <SelectItem value="week">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              Last 7 Days
                            </div>
                          </SelectItem>
                          <SelectItem value="month">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              Last 30 Days
                            </div>
                          </SelectItem>
                          <SelectItem value="custom">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              Custom Range
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Custom Date Range Inputs */}
                  {dateFilter === "custom" && (
                    <div className="flex gap-4 items-end mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="date-from" className="text-sm">From Date</Label>
                        <Input
                          id="date-from"
                          type="date"
                          value={customDateFrom}
                          onChange={(e) => setCustomDateFrom(e.target.value)}
                          className="w-40"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="date-to" className="text-sm">To Date</Label>
                        <Input
                          id="date-to"
                          type="date"
                          value={customDateTo}
                          onChange={(e) => setCustomDateTo(e.target.value)}
                          className="w-40"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCustomDateFrom("");
                          setCustomDateTo("");
                        }}
                        className="mb-0"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                  
                  {/* Quick filter badges */}
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-medium text-gray-500 mr-1">User Type:</span>
                      <Badge variant={userTypeFilter === "all" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setUserTypeFilter("all")}>
                        All ({waitlistEntries?.length || 0})
                      </Badge>
                      <Badge variant={userTypeFilter === "brands" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setUserTypeFilter("brands")}>
                        <Building2 size={12} className="mr-1" />
                        Brands ({brandEntries.length})
                      </Badge>
                      <Badge variant={userTypeFilter === "creators" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setUserTypeFilter("creators")}>
                        <UserCheck size={12} className="mr-1" />
                        Creators ({creatorEntries.length})
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-medium text-gray-500 mr-1">Date:</span>
                      <Badge variant={dateFilter === "all" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setDateFilter("all")}>
                        All Time
                      </Badge>
                      <Badge variant={dateFilter === "today" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setDateFilter("today")}>
                        <Calendar size={12} className="mr-1" />
                        Today
                      </Badge>
                      <Badge variant={dateFilter === "week" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setDateFilter("week")}>
                        <Calendar size={12} className="mr-1" />
                        7 Days
                      </Badge>
                      <Badge variant={dateFilter === "month" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setDateFilter("month")}>
                        <Calendar size={12} className="mr-1" />
                        30 Days
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waitlist Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  Waitlist Entries ({filteredEntries.length})
                </div>
                {(userTypeFilter !== "all" || dateFilter !== "all" || searchTerm.trim() !== "") && (
                  <div className="text-sm text-gray-500 font-normal">
                    Showing filtered results
                    {dateFilter !== "all" && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {dateFilter === "today" && "Today"}
                        {dateFilter === "week" && "Last 7 days"}
                        {dateFilter === "month" && "Last 30 days"}
                        {dateFilter === "custom" && `${customDateFrom || "Start"} to ${customDateTo || "End"}`}
                      </span>
                    )}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => {
                      const userType = getUserType(entry);
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.name}</TableCell>
                          <TableCell>{entry.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={userType === "brand" ? "default" : "secondary"}
                              className={`gap-1 ${userType === "brand" 
                                ? "bg-orange-100 text-orange-800 border-orange-300" 
                                : "bg-green-100 text-green-800 border-green-300"
                              }`}
                            >
                              {userType === "brand" ? <Building2 size={12} /> : <UserCheck size={12} />}
                              {userType === "brand" ? "Brand" : "Creator"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-48">
                            {userType === "brand" ? (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{entry.companyName || "N/A"}</div>
                                <div className="text-gray-500">{entry.role || "N/A"}</div>
                              </div>
                            ) : (
                              <div className="text-sm">
                                <div className="text-gray-900">{entry.location || "Location not specified"}</div>
                                <div className="text-gray-500">
                                  {entry.selectedPlatforms ? 
                                    JSON.parse(entry.selectedPlatforms).slice(0, 2).join(", ") + 
                                    (JSON.parse(entry.selectedPlatforms).length > 2 ? "..." : "")
                                    : "No platforms"
                                  }
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedEntry(entry);
                                setDetailsOpen(true);
                              }}
                              className="gap-1"
                            >
                              <Eye size={14} />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {filteredEntries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? "No entries match your search." : "No waitlist entries yet."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Waitlist Entry Details Modal */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" aria-describedby="waitlist-entry-description">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User size={20} />
                  Waitlist Entry Details
                </DialogTitle>
                <p id="waitlist-entry-description" className="text-sm text-gray-600">
                  View detailed information about this waitlist entry including all submitted form data.
                </p>
              </DialogHeader>
              
              {selectedEntry && (
                <ScrollArea className="max-h-[70vh]">
                  <div className="space-y-6 pr-4">
                    {/* User Type Badge and Basic Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge 
                            variant={getUserType(selectedEntry) === "brand" ? "default" : "secondary"}
                            className={`gap-2 px-3 py-1 text-sm ${getUserType(selectedEntry) === "brand" 
                              ? "bg-orange-100 text-orange-800 border-orange-300" 
                              : "bg-green-100 text-green-800 border-green-300"
                            }`}
                          >
                            {getUserType(selectedEntry) === "brand" ? <Building2 size={14} /> : <UserCheck size={14} />}
                            {getUserType(selectedEntry) === "brand" ? "Brand Account" : "Creator Account"}
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        </div>
                        
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                            <p className="text-base font-medium text-gray-900">{selectedEntry.name}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                            <p className="text-base text-gray-900">{selectedEntry.email}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Registration Date</Label>
                            <p className="text-base text-gray-900">
                              {selectedEntry.createdAt ? new Date(selectedEntry.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>


                  {/* Brand-specific fields */}
                  {selectedEntry.companyName && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Building2 size={18} />
                        Brand Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                          <p className="text-sm text-gray-900">{selectedEntry.companyName}</p>
                        </div>
                        {selectedEntry.role && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Role</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.role}</p>
                          </div>
                        )}
                        {selectedEntry.creatorPreference && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">What kind of creators are you looking for</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.creatorPreference}</p>
                          </div>
                        )}
                        {selectedEntry.budget && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Campaign budget range</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.budget}</p>
                          </div>
                        )}
                        {selectedEntry.campaignTiming && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">How soon do you plan to start next campaign</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.campaignTiming}</p>
                          </div>
                        )}
                        {selectedEntry.campaignReady && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Do you already have a campaign in mind?</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.campaignReady}</p>
                          </div>
                        )}
                        {selectedEntry.companyWebsite && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Company Website</Label>
                            <p className="text-sm text-gray-900">
                              <a href={selectedEntry.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                {selectedEntry.companyWebsite}
                              </a>
                            </p>
                          </div>
                        )}
                        {selectedEntry.companyHandle && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Company Handle</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.companyHandle}</p>
                          </div>
                        )}
                        {selectedEntry.brandLogo && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Brand Logo</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.brandLogo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Creator-specific fields */}
                  {selectedEntry.niches && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Star size={18} />
                        Creator Information
                      </h3>
                      <div className="space-y-4">
                        {selectedEntry.niches && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Niches</Label>
                            <div className="flex flex-wrap gap-2">
                              {JSON.parse(selectedEntry.niches).map((niche: string, index: number) => (
                                <Badge key={index} variant="outline">{niche}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedEntry.profilePicture && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Profile Picture</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.profilePicture}</p>
                          </div>
                        )}

                        {/* Social Media Platforms */}
                        <div className="grid grid-cols-1 gap-6">
                          {selectedEntry.instagram && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-2 mb-3">
                                <Instagram size={20} className="text-pink-600" />
                                <Label className="text-base font-medium text-gray-900">Instagram</Label>
                              </div>
                              <div className="space-y-2 mb-3">
                                <p className="text-sm"><strong>Handle:</strong> {selectedEntry.instagram}</p>
                                {selectedEntry.instagramFollowers && (
                                  <p className="text-sm"><strong>Followers:</strong> {selectedEntry.instagramFollowers}</p>
                                )}
                              </div>
                              {selectedEntry.instagramImage && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">Analytics Screenshot</Label>
                                  <LazyImage
                                    src={selectedEntry.instagramImage} 
                                    alt="Instagram Analytics" 
                                    className="max-w-full h-48 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => window.open(selectedEntry.instagramImage, '_blank')}
                                  />
                                  <p className="text-xs text-gray-500">Click to view full size</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {selectedEntry.tiktok && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">T</span>
                                </div>
                                <Label className="text-base font-medium text-gray-900">TikTok</Label>
                              </div>
                              <div className="space-y-2 mb-3">
                                <p className="text-sm"><strong>Handle:</strong> {selectedEntry.tiktok}</p>
                                {selectedEntry.tiktokFollowers && (
                                  <p className="text-sm"><strong>Followers:</strong> {selectedEntry.tiktokFollowers}</p>
                                )}
                              </div>
                              {selectedEntry.tiktokImage && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">Analytics Screenshot</Label>
                                  <LazyImage
                                    src={selectedEntry.tiktokImage} 
                                    alt="TikTok Analytics" 
                                    className="max-w-full h-48 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => window.open(selectedEntry.tiktokImage, '_blank')}
                                  />
                                  <p className="text-xs text-gray-500">Click to view full size</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {selectedEntry.youtube && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-2 mb-3">
                                <Youtube size={20} className="text-red-600" />
                                <Label className="text-base font-medium text-gray-900">YouTube</Label>
                              </div>
                              <div className="space-y-2 mb-3">
                                <p className="text-sm"><strong>Channel:</strong> {selectedEntry.youtube}</p>
                                {selectedEntry.youtubeSubs && (
                                  <p className="text-sm"><strong>Subscribers:</strong> {selectedEntry.youtubeSubs}</p>
                                )}
                              </div>
                              {selectedEntry.youtubeImage && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">Analytics Screenshot</Label>
                                  <LazyImage
                                    src={selectedEntry.youtubeImage} 
                                    alt="YouTube Analytics" 
                                    className="max-w-full h-48 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => window.open(selectedEntry.youtubeImage, '_blank')}
                                  />
                                  <p className="text-xs text-gray-500">Click to view full size</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {selectedEntry.twitter && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-2 mb-3">
                                <Twitter size={20} className="text-blue-500" />
                                <Label className="text-base font-medium text-gray-900">X (Twitter)</Label>
                              </div>
                              <div className="space-y-2 mb-3">
                                <p className="text-sm"><strong>Handle:</strong> {selectedEntry.twitter}</p>
                              </div>
                              {selectedEntry.twitterImage && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">Analytics Screenshot</Label>
                                  <LazyImage
                                    src={selectedEntry.twitterImage} 
                                    alt="Twitter Analytics" 
                                    className="max-w-full h-48 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => window.open(selectedEntry.twitterImage, '_blank')}
                                  />
                                  <p className="text-xs text-gray-500">Click to view full size</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {selectedEntry.facebook && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-2 mb-3">
                                <Facebook size={20} className="text-blue-600" />
                                <Label className="text-base font-medium text-gray-900">Facebook</Label>
                              </div>
                              <div className="space-y-2 mb-3">
                                <p className="text-sm"><strong>Profile:</strong> {selectedEntry.facebook}</p>
                              </div>
                              {selectedEntry.facebookImage && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">Analytics Screenshot</Label>
                                  <LazyImage
                                    src={selectedEntry.facebookImage} 
                                    alt="Facebook Analytics" 
                                    className="max-w-full h-48 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => window.open(selectedEntry.facebookImage, '_blank')}
                                  />
                                  <p className="text-xs text-gray-500">Click to view full size</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Location and Languages */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedEntry.location && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <MapPin size={14} />
                                Location
                              </Label>
                              <p className="text-sm text-gray-900">{selectedEntry.location}</p>
                            </div>
                          )}
                          {selectedEntry.languages && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Globe size={14} />
                                Languages
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {JSON.parse(selectedEntry.languages).map((language: string, index: number) => (
                                  <Badge key={index} variant="outline">{language}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* AI Content and Rate */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedEntry.aiContent !== null && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">AI Content</Label>
                              <div className="flex items-center gap-2">
                                <Switch 
                                  checked={selectedEntry.aiContent || false} 
                                  disabled 
                                />
                                <span className="text-sm text-gray-900">
                                  {selectedEntry.aiContent ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                            </div>
                          )}
                          {selectedEntry.rateRange && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <DollarSign size={14} />
                                Rate Range
                              </Label>
                              <p className="text-sm text-gray-900">{selectedEntry.rateRange}</p>
                            </div>
                          )}
                        </div>

                        {/* Portfolio */}
                        {selectedEntry.portfolio && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <Link size={14} />
                              Portfolio
                            </Label>
                            <p className="text-sm text-gray-900">{selectedEntry.portfolio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  </div>
                </ScrollArea>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
}