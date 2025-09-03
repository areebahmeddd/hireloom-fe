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
import { AptitudeTestResults } from "@/components/aptitude-test-results";
import { useJobs } from "@/lib/jobs-context";

const metrics = [
  { label: "Resumes Parsed", value: "156", icon: FileText, change: "+12%" },
  { label: "Candidates Contacted", value: "89", icon: Users, change: "+8%" },
  { label: "Meetings Scheduled", value: "23", icon: Calendar, change: "+15%" },
  { label: "Offers Sent", value: "7", icon: Send, change: "+3%" },
];

export default function Dashboard() {
  const [showCreateJobDialog, setShowCreateJobDialog] = useState(false);
  const { jobs, addJob, loading, error } = useJobs();

  const handleJobCreate = async (newJob: any) => {
    try {
      await addJob(newJob);
      setShowCreateJobDialog(false);
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  // Format current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = now.toLocaleDateString("en-US", options);
    const time = now.toLocaleTimeString("en-US", timeOptions);

    return `${date} | ${time}`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome, Shivansh
            </h1>
            <p className="text-muted-foreground">{getCurrentDateTime()}</p>
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
                      <p className="text-sm text-muted-foreground mb-1">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {metric.value}
                      </p>
                      <p className="text-sm text-success mt-1">
                        {metric.change}
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <metric.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Job Postings */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Active Job Postings
              </h2>
              <Button
                className="bg-primary hover:bg-primary/90"
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
                      <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        <Link
                          href="/jobs"
                          className="hover:text-primary transition-colors cursor-pointer"
                        >
                          {job.title}
                        </Link>
                      </CardTitle>
                      <Badge className={job.statusColor}>{job.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {job.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="w-4 h-4 mr-1" />
                          {job.resumes} resumes
                        </div>
                        <Link
                          href="/jobs"
                          className="text-primary hover:text-primary/80 text-sm font-medium"
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

          {/* Aptitude Test Results */}
          <div className="mb-8">
            <AptitudeTestResults showAllJobs={true} />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Interview scheduled with Areeb Ahmed
                    </p>
                    <p className="text-xs text-slate-500">
                      Frontend Developer • 2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
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
