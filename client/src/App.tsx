import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Creators from "@/pages/creators";
import Waitlist from "@/pages/waitlist";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import BrandProfile from "@/pages/onboarding/brand-profile";
import BrandTrial from "@/pages/onboarding/brand-trial";
import CreatorProfile from "@/pages/onboarding/creator-profile";
import CreatorWelcome from "@/pages/onboarding/creator-welcome";
import CreatorDashboard from "@/pages/creator-dashboard";
import BrandDashboard from "@/pages/brand-dashboard";
import BrandChallenges from "@/pages/brand-challenges";
import BrandLeaderboard from "@/pages/brand-leaderboard";
import BrandCreateBrief from "@/pages/brand-create-brief";
import BrandBriefs from "@/pages/brand-briefs";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";

function Router() {
  const { isAuthenticated, isLoading, user, isBrand, isCreator } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Unauthenticated routes
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/creators" component={Creators} />
        <Route path="/waitlist" component={Waitlist} />
        <Route path="/admin" component={Admin} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Authenticated routes
  return (
    <Switch>
      <Route path="/onboarding/brand" component={BrandProfile} />
      <Route path="/onboarding/brand/trial" component={BrandTrial} />
      <Route path="/onboarding/creator" component={CreatorProfile} />
      <Route path="/onboarding/creator/welcome" component={CreatorWelcome} />
      <Route path="/brand/dashboard/challenges" component={BrandChallenges} />
      <Route path="/brand/dashboard/leaderboard" component={BrandLeaderboard} />
      <Route path="/brand/dashboard/briefs/create" component={BrandCreateBrief} />
      <Route path="/brand/dashboard/briefs" component={BrandBriefs} />
      <Route path="/brand/dashboard/:page*" component={BrandDashboard} />
      <Route path="/brand/dashboard" component={BrandDashboard} />
      <Route path="/dashboard" component={CreatorDashboard} />
      <Route path="/" component={Home} />
      <Route path="/creators" component={Creators} />
      <Route path="/waitlist" component={Waitlist} />
      <Route path="/admin" component={Admin} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
