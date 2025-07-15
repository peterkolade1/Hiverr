import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Users, Calendar, TrendingUp, Heart, MessageSquare, Share2, Play, Eye } from "lucide-react";
import type { Creator } from "@shared/schema";

interface CreatorProfileModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorProfileModal({ creator, isOpen, onClose }: CreatorProfileModalProps) {
  if (!creator) return null;

  const engagementRate = ((Math.random() * 8) + 2).toFixed(1); // Mock engagement rate
  const avgViews = (Math.random() * 500000 + 100000).toLocaleString(); // Mock average views
  const totalPosts = Math.floor(Math.random() * 500) + 50; // Mock total posts

  const recentWork = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop",
      title: "Product Unboxing",
      views: "45.2K",
      likes: "3.1K",
      type: "video"
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=300&h=300&fit=crop",
      title: "Tutorial Review",
      views: "78.9K",
      likes: "5.7K",
      type: "video"
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
      title: "Behind the Scenes",
      views: "32.1K",
      likes: "2.4K",
      type: "image"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Creator Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={creator.profileImage}
                alt={creator.name}
                className="w-32 h-32 rounded-2xl object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      {creator.isAvailable ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{creator.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{(creator.followerCount / 1000000).toFixed(1)}M followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Joined 2022</span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{creator.bio}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {creator.platforms.map((platform) => (
                  <Badge
                    key={platform}
                    variant="secondary"
                    className={`${
                      platform === "Instagram"
                        ? "bg-pink-100 text-pink-700"
                        : platform === "TikTok"
                        ? "bg-purple-100 text-purple-700"
                        : platform === "YouTube"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                  <Star className="text-purple-600" size={20} fill="currentColor" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 20) + 80}</div>
                <div className="text-sm text-gray-600">Hive Score</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{engagementRate}%</div>
                <div className="text-sm text-gray-600">Engagement Rate</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                  <Eye className="text-green-600" size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{avgViews}</div>
                <div className="text-sm text-gray-600">Avg Views</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                  <MessageSquare className="text-orange-600" size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Recent Work */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentWork.map((work) => (
                <Card key={work.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={work.thumbnail}
                      alt={work.title}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      {work.type === "video" ? (
                        <Play className="text-white" size={24} fill="currentColor" />
                      ) : (
                        <Eye className="text-white" size={24} />
                      )}
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-gray-900 mb-2">{work.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {work.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={12} />
                          {work.likes}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white flex-1"
            >
              <MessageSquare className="mr-2" size={16} />
              Send Inquiry
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1"
            >
              <Heart className="mr-2" size={16} />
              Save Creator
            </Button>
            <Button 
              variant="outline" 
              size="lg"
            >
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}