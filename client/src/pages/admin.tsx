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
import { Users, Mail, Calendar, Search, Download, Eye, User, Building2, MapPin, Globe, Star, DollarSign, Link } from "lucide-react";
import type { Waitlist } from "@shared/schema";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Waitlist | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const filteredEntries = waitlistEntries?.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const exportToCSV = () => {
    if (!waitlistEntries) return;
    
    const headers = ['Name', 'Email', 'Interest', 'Date Joined'];
    const csvContent = [
      headers.join(','),
      ...waitlistEntries.map(entry => [
        entry.name,
        entry.email,
        entry.interest || 'Not specified',
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          {/* Search and Export */}
          <Card className="mb-6">
            <CardContent className="p-6">
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
            </CardContent>
          </Card>

          {/* Waitlist Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Waitlist Entries ({filteredEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.name}</TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>
                          {entry.interest ? (
                            <Badge variant="secondary">{entry.interest}</Badge>
                          ) : (
                            <span className="text-gray-400">Not specified</span>
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
                    ))}
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
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User size={20} />
                  Waitlist Entry Details
                </DialogTitle>
              </DialogHeader>
              
              {selectedEntry && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Name</Label>
                      <p className="text-sm text-gray-900">{selectedEntry.name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <p className="text-sm text-gray-900">{selectedEntry.email}</p>
                    </div>
                  </div>

                  {/* Interest and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Interest</Label>
                      <p className="text-sm text-gray-900">
                        {selectedEntry.interest ? (
                          <Badge variant="secondary">{selectedEntry.interest}</Badge>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Date Joined</Label>
                      <p className="text-sm text-gray-900">
                        {selectedEntry.createdAt ? new Date(selectedEntry.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
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
                            <Label className="text-sm font-medium text-gray-700">Creator Preference</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.creatorPreference}</p>
                          </div>
                        )}
                        {selectedEntry.budget && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Budget</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.budget}</p>
                          </div>
                        )}
                        {selectedEntry.campaignTiming && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Campaign Timing</Label>
                            <p className="text-sm text-gray-900">{selectedEntry.campaignTiming}</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedEntry.instagram && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Instagram</Label>
                              <p className="text-sm text-gray-900">{selectedEntry.instagram}</p>
                              {selectedEntry.instagramFollowers && (
                                <p className="text-xs text-gray-500">{selectedEntry.instagramFollowers} followers</p>
                              )}
                            </div>
                          )}
                          {selectedEntry.tiktok && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">TikTok</Label>
                              <p className="text-sm text-gray-900">{selectedEntry.tiktok}</p>
                              {selectedEntry.tiktokFollowers && (
                                <p className="text-xs text-gray-500">{selectedEntry.tiktokFollowers} followers</p>
                              )}
                            </div>
                          )}
                          {selectedEntry.youtube && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">YouTube</Label>
                              <p className="text-sm text-gray-900">{selectedEntry.youtube}</p>
                              {selectedEntry.youtubeSubs && (
                                <p className="text-xs text-gray-500">{selectedEntry.youtubeSubs} subscribers</p>
                              )}
                            </div>
                          )}
                          {selectedEntry.twitter && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Twitter</Label>
                              <p className="text-sm text-gray-900">{selectedEntry.twitter}</p>
                            </div>
                          )}
                          {selectedEntry.facebook && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Facebook</Label>
                              <p className="text-sm text-gray-900">{selectedEntry.facebook}</p>
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
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
}