import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { BrandSidebar, MobileSidebar, SidebarProvider } from "@/components/dashboard/brand-sidebar";
import { BrandHeader } from "@/components/dashboard/brand-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Bell, Trash2, Play, Pause, Eye, Edit, FileText, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Brief } from "@shared/schema";

type BriefStatus = 'all' | 'draft' | 'active' | 'paused' | 'closed';

interface BriefCounts {
  all: number;
  draft: number;
  active: number;
  paused: number;
  closed: number;
}

export default function BrandBriefs() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<BriefStatus>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [briefToDelete, setBriefToDelete] = useState<Brief | null>(null);

  const { data: briefs = [], isLoading: briefsLoading } = useQuery<Brief[]>({
    queryKey: ['/api/briefs'],
  });

  const { data: counts = { all: 0, draft: 0, active: 0, paused: 0, closed: 0 } } = useQuery<BriefCounts>({
    queryKey: ['/api/briefs/counts'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (briefId: number) => {
      await apiRequest(`/api/briefs/${briefId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/briefs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/briefs/counts'] });
      toast({
        title: "Brief deleted",
        description: "The brief has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setBriefToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete brief",
        variant: "destructive",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ briefId, status }: { briefId: number; status: string }) => {
      await apiRequest(`/api/briefs/${briefId}/status`, 'PATCH', { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/briefs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/briefs/counts'] });
      toast({
        title: "Status updated",
        description: "Brief status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const filteredBriefs = briefs.filter(brief => {
    if (activeTab === 'all') return true;
    return brief.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700 border-gray-200",
      active: "bg-green-100 text-green-700 border-green-200",
      paused: "bg-yellow-100 text-yellow-700 border-yellow-200",
      closed: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      <Badge variant="outline" className={`capitalize ${styles[status] || styles.draft}`}>
        {status}
      </Badge>
    );
  };

  const handleDelete = (brief: Brief) => {
    setBriefToDelete(brief);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (briefToDelete) {
      deleteMutation.mutate(briefToDelete.id);
    }
  };

  const handleStatusChange = (briefId: number, newStatus: string) => {
    statusMutation.mutate({ briefId, status: newStatus });
  };

  const renderBriefActions = (brief: Brief) => {
    switch (brief.status) {
      case 'draft':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => handleDelete(brief)}
              data-testid={`button-delete-brief-${brief.id}`}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
              size="sm"
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
              onClick={() => setLocation(`/brand/dashboard/briefs/${brief.id}/edit`)}
              data-testid={`button-finish-setup-${brief.id}`}
            >
              Finish Setup
            </Button>
          </>
        );
      case 'active':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(brief.id, 'paused')}
              data-testid={`button-pause-${brief.id}`}
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation(`/brand/dashboard/briefs/${brief.id}`)}
              data-testid={`button-view-${brief.id}`}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation(`/brand/dashboard/briefs/${brief.id}/edit`)}
              data-testid={`button-edit-${brief.id}`}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </>
        );
      case 'paused':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => handleStatusChange(brief.id, 'active')}
              data-testid={`button-resume-${brief.id}`}
            >
              <Play className="w-4 h-4 mr-1" />
              Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation(`/brand/dashboard/briefs/${brief.id}`)}
              data-testid={`button-view-${brief.id}`}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => handleStatusChange(brief.id, 'closed')}
              data-testid={`button-close-${brief.id}`}
            >
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </>
        );
      case 'closed':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation(`/brand/dashboard/briefs/${brief.id}`)}
            data-testid={`button-view-${brief.id}`}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <BrandSidebar />
        <MobileSidebar />
        
        <div className="lg:ml-64">
          <BrandHeader title="Briefs" breadcrumb={["Briefs"]} />
          
          <main className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/brand/dashboard" className="hover:text-[#8B5CF6]">Dashboard</Link>
              <span>›</span>
              <span className="text-gray-900">Briefs</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900" data-testid="text-briefs-title">Briefs</h1>
            <Button 
              className="bg-pink-500 hover:bg-pink-600 w-full sm:w-auto"
              onClick={() => setLocation('/brand/dashboard/briefs/create')}
              data-testid="button-new-brief"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Brief
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BriefStatus)} className="mb-6">
            <TabsList className="bg-white border flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-gray-100" data-testid="tab-all">
                All
                <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">{counts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:bg-gray-100" data-testid="tab-draft">
                Draft
                <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">{counts.draft}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-gray-100" data-testid="tab-active">
                Active
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">{counts.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="paused" className="data-[state=active]:bg-gray-100" data-testid="tab-paused">
                Paused
                <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">{counts.paused}</Badge>
              </TabsTrigger>
              <TabsTrigger value="closed" className="data-[state=active]:bg-gray-100" data-testid="tab-closed">
                Closed
                <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">{counts.closed}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {briefsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/6" />
                        <div className="flex gap-8">
                          <div className="h-4 bg-gray-200 rounded w-16" />
                          <div className="h-4 bg-gray-200 rounded w-16" />
                          <div className="h-4 bg-gray-200 rounded w-16" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBriefs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No briefs yet</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'all' 
                    ? "Create your first brief to start connecting with creators."
                    : `No briefs with "${activeTab}" status.`}
                </p>
                {activeTab === 'all' && (
                  <Button 
                    className="bg-pink-500 hover:bg-pink-600"
                    onClick={() => setLocation('/brand/dashboard/briefs/create')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Brief
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBriefs.map((brief) => (
                <Card key={brief.id} className="hover:shadow-md transition-shadow" data-testid={`card-brief-${brief.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {brief.thumbnailUrl ? (
                          <img 
                            src={brief.thumbnailUrl} 
                            alt={brief.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-gray-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate" data-testid={`text-brief-title-${brief.id}`}>
                            {brief.title}
                          </h3>
                          {getStatusBadge(brief.status)}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <Bell className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">0 Notifications</span>
                        </div>
                        
                        <div className="flex items-center gap-8 text-sm">
                          <div>
                            <span className="text-gray-500">Proposals</span>
                            <p className="font-semibold text-gray-900">{brief.proposalCount || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Accepted</span>
                            <p className="font-semibold text-gray-900">{brief.acceptedCount || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Declined</span>
                            <p className="font-semibold text-gray-900">{brief.declinedCount || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Pending</span>
                            <p className="font-semibold text-gray-900">{brief.pendingCount || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Spend</span>
                            <p className="font-semibold text-gray-900">${((brief.totalSpend || 0) / 100).toFixed(0)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {renderBriefActions(brief)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
          </main>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Brief</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{briefToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarProvider>
  );
}
