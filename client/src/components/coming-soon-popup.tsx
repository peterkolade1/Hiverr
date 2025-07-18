import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Star, Sparkles } from "lucide-react";

interface ComingSoonPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComingSoonPopup({ open, onOpenChange }: ComingSoonPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={32} />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Clock className="text-white" size={14} />
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Search Feature Coming Soon!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            We're building an AI-powered search that will help you find the perfect creators instantly.
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-cyan-50 p-4 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-purple-700 font-medium">
              <Star className="text-yellow-500" size={16} fill="currentColor" />
              <span>Join our waitlist to get early access</span>
              <Star className="text-yellow-500" size={16} fill="currentColor" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  window.location.href = '/waitlist';
                }, 100);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              Join Waitlist
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Continue Browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}