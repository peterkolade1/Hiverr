import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertWaitlistSchema, type InsertWaitlist } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Check, X } from "lucide-react";

interface WaitlistFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistForm({ isOpen, onClose }: WaitlistFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertWaitlist>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: InsertWaitlist) => {
      return await apiRequest("/api/waitlist", "POST", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Welcome to the waitlist!",
        description: "We'll notify you as soon as AI Creator Avatars are available.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertWaitlist) => {
    waitlistMutation.mutate(data);
  };

  const handleClose = () => {
    if (!waitlistMutation.isPending) {
      setIsSubmitted(false);
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="text-purple-600" size={24} />
            Join the AI Creator Waitlist
          </DialogTitle>
          <DialogDescription>
            Be the first to experience AI-generated creator avatars when they launch.
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter your full name"
                    className="mt-1"
                    disabled={waitlistMutation.isPending}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="Enter your email address"
                    className="mt-1"
                    disabled={waitlistMutation.isPending}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    {...form.register("company")}
                    placeholder="Your company or brand"
                    className="mt-1"
                    disabled={waitlistMutation.isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("role", value)}
                    disabled={waitlistMutation.isPending}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brand Manager">Brand Manager</SelectItem>
                      <SelectItem value="Marketing Director">Marketing Director</SelectItem>
                      <SelectItem value="Content Creator">Content Creator</SelectItem>
                      <SelectItem value="Agency Owner">Agency Owner</SelectItem>
                      <SelectItem value="Founder/CEO">Founder/CEO</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-700">
                  🚀 <strong>Early Access Benefits:</strong>
                </p>
                <ul className="text-sm text-purple-600 mt-2 space-y-1">
                  <li>• Be the first to test AI Creator Avatars</li>
                  <li>• 50% discount on first month</li>
                  <li>• Direct feedback line to our product team</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={waitlistMutation.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={waitlistMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              You're on the list!
            </h3>
            <p className="text-gray-600 mb-6">
              We'll notify you as soon as AI Creator Avatars are ready. 
              Keep an eye on your inbox for exclusive updates.
            </p>
            <Button
              onClick={handleClose}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              Done
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}