"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { CandidateTable } from "@/components/candidate-table";
import { JobAnalytics } from "@/components/job-analytics";
import { ContactProgress } from "@/components/contact-progress";
import { CreateJobDialog } from "@/components/create-job-dialog";
import { AddResumeDialog } from "@/components/add-resume-dialog";
import { useJobs } from "@/lib/jobs-context";
import {
  Edit3,
  Users,
  BarChart3,
  Clock,
  MapPin,
  DollarSign,
  Trash2,
  Upload,
} from "lucide-react";

// Utility function to format time ago
const formatTimeAgo = (dateInput: string | Date | null | undefined) => {
  // Handle null, undefined, or invalid dates
  if (!dateInput) {
    return "Unknown";
  }

  const now = new Date();
  let date: Date;

  if (typeof dateInput === "string") {
    date = new Date(dateInput);
    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      return "Unknown";
    }
  } else {
    date = dateInput;
    // Check if the date is invalid
    if (!date || isNaN(date.getTime())) {
      return "Unknown";
    }
  }

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
};

export default function JobManagement() {
  const { jobs, addJob, updateJob, deleteJob, loading, error } = useJobs();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Update selected job when jobs change
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const handleJobCreate = async (newJob: any) => {
    try {
      await addJob(newJob);
      setSelectedJob(newJob);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  const handleJobUpdate = async (updatedJob: any) => {
    try {
      const result = await updateJob(updatedJob.id, updatedJob);
      setSelectedJob(result);
      setIsEditDialogOpen(false);
      console.log("Job updated successfully");
    } catch (error) {
      console.error("Failed to update job:", error);
      alert("Failed to update job. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(jobId);
      if (selectedJob?.id === jobId) {
        const remainingJobs = jobs.filter((j) => j.id !== jobId);
        setSelectedJob(remainingJobs.length > 0 ? remainingJobs[0] : null);
      }
      // Show success message (you can add a toast notification here)
      console.log("Job deleted successfully");
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleEditJob = () => {
    setIsEditDialogOpen(true);
  };

  const handleDeleteSelectedJob = async () => {
    if (
      confirm(
        `Are you sure you want to delete "${selectedJob?.title}"? This action cannot be undone.`,
      )
    ) {
      if (selectedJob) {
        await handleDeleteJob(selectedJob.id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Job List */}
        <div className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Active Jobs
            </h2>
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Create New Job
            </Button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedJob?.id === job.id
                    ? "ring-2 ring-primary shadow-md"
                    : ""
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-medium text-foreground">{job.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="w-3 h-3 mr-1" />
                    {job.candidates} candidates
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Job Details */}
        <div className="flex-1 p-6 overflow-y-auto bg-background">
          {selectedJob ? (
            <>
              {/* Job Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                      {selectedJob.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedJob.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {selectedJob.salary}
                      </div>
                      <Badge variant="outline">{selectedJob.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      Created {formatTimeAgo(selectedJob.createdAt)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <AddResumeDialog
                        job={{
                          id: selectedJob.id,
                          title: selectedJob.title,
                          description: selectedJob.description,
                        }}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-50 hover:text-green-700"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Add Resume
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditJob}
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelectedJob}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 mb-4">
                      {selectedJob.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-slate-900">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills &&
                        Array.isArray(selectedJob.skills) ? (
                          selectedJob.skills.map(
                            (skill: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ),
                          )
                        ) : (
                          <p className="text-sm text-slate-600">
                            No skills specified
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="candidates" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="candidates" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Candidates
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Contact Progress
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="candidates">
                  <CandidateTable jobId={selectedJob.id} />
                </TabsContent>

                <TabsContent value="analytics">
                  <JobAnalytics job={selectedJob} />
                </TabsContent>

                <TabsContent value="progress">
                  <ContactProgress job={selectedJob} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="max-w-md">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Edit3 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  No Jobs Available
                </h2>
                <p className="text-muted-foreground mb-6">
                  You don't have any job postings yet. Create your first job to
                  get started with recruiting.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Create Your First Job
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateJobDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onJobCreate={handleJobCreate}
      />

      <CreateJobDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onJobCreate={handleJobCreate}
        onJobUpdate={handleJobUpdate}
        editJob={selectedJob}
      />
    </div>
  );
}
