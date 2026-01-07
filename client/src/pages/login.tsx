import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { customLoginSchema, type CustomLoginUser } from "@shared/schema";
import neonImage from "@assets/back-view-woman-with-blue-background_1752548501236.jpg";

// Use the shared login schema from backend
const loginSchema = customLoginSchema;

type LoginForm = CustomLoginUser;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: CustomLoginUser) => {
      const response = await apiRequest('/api/auth/login', 'POST', data);
      return await response.json();
    },
    onSuccess: (response) => {
      setIsSuccess(true);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in to your account.",
      });
      
      // Redirect based on user role
      const userRole = response.user?.role;
      const savedOnboardingPath = localStorage.getItem('onboarding_path');
      
      setTimeout(() => {
        if (savedOnboardingPath) {
          localStorage.removeItem('onboarding_path');
          window.location.href = savedOnboardingPath;
        } else if (userRole === 'brand') {
          // Redirect brands to their briefs page
          window.location.href = '/brand/dashboard/briefs';
        } else if (userRole === 'creator') {
          // Redirect creators to their dashboard
          window.location.href = '/creator/dashboard';
        } else {
          window.location.href = '/';
        }
      }, 1500);
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Welcome to Hiver
                </CardTitle>
                <CardDescription className="text-white/80 mt-2">
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-white/90">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                        data-testid="input-email"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white/90">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                        data-testid="input-password"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-white/60 hover:text-white"
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300" data-testid="link-forgot-password">
                      Forgot password?
                    </Link>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium py-3 transition-all duration-300"
                      disabled={loginMutation.isPending || isSuccess}
                      data-testid="button-sign-in"
                    >
                      {loginMutation.isPending ? (
                        "Signing in..."
                      ) : isSuccess ? (
                        <>
                          Signed In!
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="text-center pt-4">
                  <p className="text-white/80">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium" data-testid="link-sign-up">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Neon Image (hidden on mobile) */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={neonImage}
              alt="Neon aesthetic"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-900/20 to-purple-900/40"></div>
          </div>
          
          {/* Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-md p-8">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Connect with Creators
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Join thousands of brands and creators building authentic partnerships
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">1.2M+</div>
                  <div className="text-sm text-white/80">Active Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">50K+</div>
                  <div className="text-sm text-white/80">Successful Campaigns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}