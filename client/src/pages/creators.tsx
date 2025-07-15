import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HiverLogo } from "@/components/hiver-logo";
import { Star, Plus, Video, Search, DollarSign, Users, TrendingUp, Calendar, Clock, Shield, Trophy, Medal, Award } from "lucide-react";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CreatorShowcase } from "@/components/creator-showcase";

// Import creator-focused images
import smartphoneImage from "@assets/back-view-woman-with-blue-background_1752553805026.jpg";
import youngFriendsImage from "@assets/young-friends-posing-together-low-angle_1752553805032.jpg";
import beautyVloggerImage from "@assets/woman-beauty-vlogger-filming-vlog-about-creams_1752553805031.jpg";
import foodPhotoImage from "@assets/woman-taking-photo-her-food_1752553805031.jpg";
import fitnessImage from "@assets/tired-young-woman-resting-while-sitting-after-working-out-gym_1752553805030.jpg";
import musicImage from "@assets/teenage-boy-recording-music-with-his-guitar-his-home-studio_1752553805030.jpg";
import cookingImage from "@assets/medium-shot-women-cooking-together_1752553805030.jpg";

export default function Creators() {

  // Preload critical images for better performance
  useImagePreloader({
    images: [smartphoneImage, youngFriendsImage, beautyVloggerImage, foodPhotoImage],
    priority: true
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo with animated background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <HiverLogo size="lg" className="relative z-10" />
              </div>
            </motion.div>

            {/* Rating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center mb-8"
            >
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">Trusted by 10,000+ creators</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Turn Your Content Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
                Consistent Income.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Join Hiverr and get matched with brands that value your authentic voice. Create content you love while earning what you deserve.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center items-center mb-12"
            >
              <Button
                size="lg"
                onClick={() => setIsWaitlistOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold rounded-full"
              >
                Join Waitlist
              </Button>
            </motion.div>

            {/* Creator Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 sm:mt-16 relative max-w-5xl mx-auto px-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <motion.div 
                  className="relative"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg transform rotate-2 hover:rotate-4 transition-transform">
                    <img 
                      src={smartphoneImage} 
                      alt="Beauty Creator"
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span>Beauty & Lifestyle</span>
                        <div className="flex items-center">
                          <DollarSign size={12} />
                          <span className="ml-1">$2.5k/mo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="relative mt-8"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg transform -rotate-1 hover:-rotate-3 transition-transform">
                    <img 
                      src={youngFriendsImage} 
                      alt="Lifestyle Creators"
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span>Travel & Friends</span>
                        <div className="flex items-center">
                          <TrendingUp size={12} />
                          <span className="ml-1">Growing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="relative"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                    <img 
                      src={beautyVloggerImage} 
                      alt="Beauty Vlogger"
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span>Beauty Reviews</span>
                        <div className="flex items-center">
                          <Video size={12} />
                          <span className="ml-1">Video</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="relative mt-6"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg transform -rotate-2 hover:-rotate-4 transition-transform">
                    <img 
                      src={foodPhotoImage} 
                      alt="Food Creator"
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span>Food & Cooking</span>
                        <div className="flex items-center">
                          <Users size={12} />
                          <span className="ml-1">50k+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creator Showcase Section */}
      <CreatorShowcase />

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why creators choose Hiverr
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're built by creators, for creators. Get the tools and opportunities you need to turn your passion into profit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fair pricing guaranteed</h3>
              <p className="text-gray-600">
                We ensure you get paid what you're worth. Our platform enforces minimum rates and transparent pricing for all collaborations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified brands only</h3>
              <p className="text-gray-600">
                Work with legitimate companies that respect creators. All brands are verified and must follow our creator-friendly guidelines.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Flexible scheduling</h3>
              <p className="text-gray-600">
                Create on your timeline. Choose projects that fit your schedule and creative process. No pressure, no unrealistic deadlines.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Grow your audience</h3>
              <p className="text-gray-600">
                Connect with brands that align with your values and help you reach new audiences organically through authentic partnerships.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Creator community</h3>
              <p className="text-gray-600">
                Join a supportive community of creators. Share tips, collaborate on projects, and learn from each other's success stories.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick payments</h3>
              <p className="text-gray-600">
                Get paid fast with our streamlined payment system. No waiting months for compensation - receive payment upon content approval.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="start-earning" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Start earning in 3 simple steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From signup to first payment, we've made the process simple and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create your profile</h3>
              <p className="text-gray-600">
                Showcase your style, audience, and rates. Our smart matching system will connect you with relevant brands automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-cyan-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get matched with brands</h3>
              <p className="text-gray-600">
                Receive collaboration offers that match your niche, values, and pricing. Review briefs and choose projects you're excited about.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create and get paid</h3>
              <p className="text-gray-600">
                Submit your content, get feedback, and receive payment upon approval. Build long-term relationships with brands you love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Creator success stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real creators sharing their experience and growth on Hiverr.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src={beautyVloggerImage}
                  alt="Sarah M."
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                  <p className="text-sm text-gray-600">Beauty Creator</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Hiverr helped me turn my passion for skincare into a sustainable income. I've worked with amazing brands that truly value authentic reviews."
              </p>
              <div className="text-sm text-purple-600 font-medium">
                Earned $15k in first 6 months
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src={musicImage}
                  alt="Jake R."
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Jake R.</h4>
                  <p className="text-sm text-gray-600">Music Creator</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The platform connected me with music tech brands that genuinely care about creator feedback. Fair pay and creative freedom!"
              </p>
              <div className="text-sm text-purple-600 font-medium">
                3x increase in brand partnerships
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src={fitnessImage}
                  alt="Maria L."
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Maria L.</h4>
                  <p className="text-sm text-gray-600">Fitness Creator</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Finally, a platform that respects fitness creators! I can focus on creating quality content while Hiverr handles the brand matching."
              </p>
              <div className="text-sm text-purple-600 font-medium">
                Built full-time creator business
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hive Leaderboard Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hive Leaderboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your performance, compete with peers, and get recognized for your impact. Top creators get exclusive opportunities and higher rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Leaderboard Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Top Performers This Month</h3>
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Emma R.</p>
                      <p className="text-sm text-gray-600">Beauty & Lifestyle</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">98.2</p>
                    <p className="text-sm text-gray-600">Hive Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Jake M.</p>
                      <p className="text-sm text-gray-600">Tech Reviews</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">95.7</p>
                    <p className="text-sm text-gray-600">Hive Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Maria L.</p>
                      <p className="text-sm text-gray-600">Fitness & Health</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">94.1</p>
                    <p className="text-sm text-gray-600">Hive Score</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-700 text-center">
                  Your current rank: #12 (89.3 Hive Score)
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="space-y-8">
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance tracking</h3>
                <p className="text-gray-600">
                  Your Hive Score is calculated based on engagement rates, brand satisfaction, content quality, and delivery speed. Higher scores unlock premium opportunities.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Recognition rewards</h3>
                <p className="text-gray-600">
                  Top performers get featured placement, early access to premium campaigns, higher rate negotiations, and exclusive brand partnerships.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Medal className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Monthly competitions</h3>
                <p className="text-gray-600">
                  Compete in monthly challenges across different niches. Winners receive cash bonuses, featured spots, and opportunities with tier-1 brands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to monetize your creativity?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who've found their perfect brand matches on Hiverr. Your audience is waiting.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = '/waitlist'}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-full"
          >
            Start Your Creator Journey
          </Button>
        </div>
      </section>



      <Footer />
    </div>
  );
}