"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { CreateJobDialog } from "@/components/create-job-dialog";

const jobCards = [
  {
    id: 1,
    title: "Frontend Developer",
    status: "Analysis",
    statusColor: "bg-blue-100 text-blue-700",
    resumes: 20,
    description: "React, TypeScript, Next.js",
    progress: 65,
  },
  {
    id: 2,
    title: "Backend Developer",
    status: "Contacting",
    statusColor: "bg-orange-100 text-orange-700",
    resumes: 12,
    description: "Node.js, PostgreSQL, AWS",
    progress: 40,
  },
  {
    id: 3,
    title: "Product Designer",
    status: "Scheduled Meetings",
    statusColor: "bg-purple-100 text-purple-700",
    resumes: 5,
    description: "Figma, User Research, Prototyping",
    progress: 80,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    status: "Offers Sent",
    statusColor: "bg-green-100 text-green-700",
    resumes: 3,
    description: "Docker, Kubernetes, CI/CD",
    progress: 95,
  },
];

const metrics = [
  { label: "Resumes Parsed", value: "156", icon: FileText, change: "+12%" },
  { label: "Candidates Contacted", value: "89", icon: Users, change: "+8%" },
  { label: "Meetings Scheduled", value: "23", icon: Calendar, change: "+15%" },
  { label: "Offers Sent", value: "7", icon: Send, change: "+3%" },
];

export default function Dashboard() {
  const [showCreateJobDialog, setShowCreateJobDialog] = useState(false);
  const [jobs, setJobs] = useState(jobCards);

  const handleJobCreate = (newJob: any) => {
    setJobs(prev => [newJob, ...prev]);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navigation />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              AI Recruiter Dashboard
            </h1>
            <p className="text-slate-600">
              Manage your job postings and track candidate progress
            </p>
          </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {metric.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {metric.change}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <metric.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Postings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Active Job Postings
            </h2>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowCreateJobDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Job
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </CardTitle>
                    <Badge className={job.statusColor}>{job.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{job.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium text-slate-900">
                        {job.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-600">
                        <FileText className="w-4 h-4 mr-1" />
                        {job.resumes} resumes
                      </div>
                      <Link
                        href="/jobs"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Interview scheduled with Alice Johnson
                  </p>
                  <p className="text-xs text-slate-500">
                    Frontend Developer • 2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    15 new resumes analyzed for Backend Developer
                  </p>
                  <p className="text-xs text-slate-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Send className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Initial contact sent to 8 candidates
                  </p>
                  <p className="text-xs text-slate-500">
                    Product Designer • 1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </main>
      </div>

      {/* Create Job Dialog */}
      <CreateJobDialog
        open={showCreateJobDialog}
        onOpenChange={setShowCreateJobDialog}
        onJobCreate={handleJobCreate}
      />
    </ProtectedRoute>
  );
}