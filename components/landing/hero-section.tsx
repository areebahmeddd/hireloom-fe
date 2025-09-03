'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { number: '10,000+', label: 'Candidates Matched' },
    { number: '500+', label: 'Companies Trust Us' },
    { number: '95%', label: 'Success Rate' },
    { number: '24h', label: 'Average Time to Match' }
  ];

  const features = [
    'AI-powered candidate matching',
    'Automated screening process',
    'Real-time collaboration tools',
    'Advanced analytics dashboard'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="relative overflow-hidden gradient-bg">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium float-animation">
                <TrendingUp className="w-4 h-4 mr-2" />
                #1 Hiring Platform
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight fade-in-up">
                Find the perfect{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  talent
                </span>{' '}
                for your team
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed fade-in-up" style={{animationDelay: '0.2s'}}>
                Streamline your hiring process with AI-powered matching, automated workflows, 
                and intelligent candidate insights. Build your dream team faster than ever.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 text-lg border border-white/30 backdrop-blur-sm component-transition"
                onClick={onGetStarted}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg border-white/50 text-white hover:bg-white/20 backdrop-blur-sm component-transition bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm text-white/70 mb-4">Trusted by leading companies</p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-2xl font-bold text-white/60">Google</div>
                <div className="text-2xl font-bold text-white/60">Microsoft</div>
                <div className="text-2xl font-bold text-white/60">Stripe</div>
                <div className="text-2xl font-bold text-white/60">Airbnb</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Dashboard Preview */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 overflow-hidden component-transition float-animation">
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Hiring Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-slate-600">24 Active Jobs</span>
                  </div>
                </div>

                {/* Animated Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg transition-all duration-500 component-transition ${
                        index === currentStat 
                          ? 'bg-white border-2 border-white scale-105' 
                          : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className={`text-2xl font-bold ${
                        index === currentStat ? 'text-blue-600' : 'text-slate-900'
                      }`}>
                        {stat.number}
                      </div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mock Candidate Cards */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700">Top Candidates</h4>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg component-transition" style={{animationDelay: `${i * 0.1}s`}}>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                        {String.fromCharCode(64 + i)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">Candidate {i}</div>
                        <div className="text-xs text-slate-500">Frontend Developer</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">9{i}% Match</div>
                        <div className="text-xs text-slate-500">Available</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
              <Briefcase className="w-6 h-6" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white text-black p-3 rounded-full shadow-lg animate-pulse">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
