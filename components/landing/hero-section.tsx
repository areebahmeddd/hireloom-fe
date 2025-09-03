"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";
import {
  ArrowRight,
  Play,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: "10,000+", label: "Candidates Matched" },
    { number: "500+", label: "Companies Trust Us" },
    { number: "95%", label: "Success Rate" },
    { number: "24h", label: "Average Time to Match" },
  ];

  const companies = [
    "Google",
    "Microsoft",
    "Stripe",
    "Airbnb",
    "Netflix",
    "Tesla",
    "Meta",
    "Amazon",
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Talent @ TechCorp",
      content:
        "Hireloom reduced our time-to-hire by 60%. The AI matching is incredibly accurate.",
      avatar: "SC",
    },
    {
      name: "Raj Patel",
      role: "Recruiting Manager @ InnovateLabs",
      content:
        "Best hiring platform we've used. The candidate quality is outstanding.",
      avatar: "RP",
    },
    {
      name: "Emily Johnson",
      role: "HR Director @ StartupXYZ",
      content:
        "Game-changer for our recruiting process. Highly recommend to any growing team.",
      avatar: "EJ",
    },
    {
      name: "Michael Brown",
      role: "Talent Acquisition @ BigTech",
      content:
        "The automated screening saves us hours every week. Fantastic tool!",
      avatar: "MB",
    },
    {
      name: "Priya Sharma",
      role: "People Operations @ ScaleUp",
      content:
        "Finally found the perfect hiring solution. The analytics are incredible.",
      avatar: "PS",
    },
  ];

  const features = [
    "AI-powered candidate matching",
    "Automated screening process",
    "Real-time collaboration tools",
    "Advanced analytics dashboard",
  ];

  useEffect(() => {
    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => {
      clearInterval(statInterval);
    };
  }, [stats.length]);

  return (
    <div className="relative overflow-hidden gradient-bg">
      {/* Full-width top banner image */}
      <div className="w-full">
        <Image
          src="/landing-top-left.png"
          alt="Hireloom banner"
          width={2400}
          height={800}
          priority
          className="w-full h-auto object-cover"
        />
      </div>
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
                Find the perfect{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
                  talent
                </span>{" "}
                for your team
              </h1>

              <p
                className="text-xl text-white/90 leading-relaxed fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                Streamline your hiring process with AI-powered matching,
                automated workflows, and intelligent candidate insights. Build
                your dream team faster than ever.
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
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl component-transition"
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

            {/* Trust Indicators - Small version like before */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm text-white/70 mb-4">
                Trusted by leading companies
              </p>
              <Marquee pauseOnHover className="[--duration:20s]">
                {companies.map((company, index) => (
                  <div key={index} className="px-4">
                    <span className="text-xl font-semibold text-white/80">
                      {company}
                    </span>
                  </div>
                ))}
              </Marquee>
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
                  <h3 className="text-lg font-semibold text-slate-900">
                    Hiring Dashboard
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm text-slate-600">
                      24 Active Jobs
                    </span>
                  </div>
                </div>

                {/* Animated Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg transition-all duration-500 component-transition ${
                        index === currentStat
                          ? "bg-white border-2 border-white scale-105"
                          : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <div
                        className={`text-2xl font-bold ${
                          index === currentStat
                            ? "text-primary"
                            : "text-slate-900"
                        }`}
                      >
                        {stat.number}
                      </div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mock Candidate Cards */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700">
                    Top Candidates
                  </h4>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg component-transition"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                        {String.fromCharCode(64 + i)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          Candidate {i}
                        </div>
                        <div className="text-xs text-slate-500">
                          Frontend Developer
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          9{i}% Match
                        </div>
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

      {/* HR Testimonials - Final Section */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-900 py-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-teal-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-slate-700/50 backdrop-blur-sm rounded-full border border-slate-500/30 text-slate-200 text-sm font-medium mb-8">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
              Real Customer Stories
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Loved by <span className="text-emerald-400">HR teams</span>{" "}
              worldwide
            </h2>
            <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. See what recruiting professionals
              around the globe are saying about their experience with Hireloom.
            </p>
          </div>

          <div className="relative">
            {/* Gradient overlays for seamless scrolling effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

            <Marquee pauseOnHover className="[--duration:45s] py-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="mx-6">
                  <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/10 hover:bg-white/15 hover:border-emerald-400/30 transition-all duration-500 w-96 shadow-2xl hover:shadow-emerald-500/10">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div className="ml-6">
                        <h4 className="font-bold text-white text-lg group-hover:text-emerald-100 transition-colors">
                          {testimonial.name}
                        </h4>
                        <p className="text-slate-400 text-sm font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <blockquote className="text-slate-200 leading-relaxed text-lg italic">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex justify-end mt-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-emerald-400 rounded-full"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
}
