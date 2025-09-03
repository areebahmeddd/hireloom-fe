'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/navigation';
import { CandidateTable } from '@/components/candidate-table';
import { JobAnalytics } from '@/components/job-analytics';
import { ContactProgress } from '@/components/contact-progress';
import { CreateJobDialog } from '@/components/create-job-dialog';
import { Edit3, Users, BarChart3, Clock, MapPin, DollarSign } from 'lucide-react';

// Utility function to format time ago
const formatTimeAgo = (date: Date) => {
  const now = new Date();
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

const initialJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    description: 'We are looking for a skilled Frontend Developer to join our growing team. The ideal candidate will have strong experience with React, TypeScript, and modern web development practices.',
    location: 'Bangalore, Karnataka',
    salary: '₹12L - ₹18L',
    type: 'Full-time',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    candidates: 20,
    contacted: 8,
    scheduled: 3,
  },
  {
    id: 2,
    title: 'Backend Developer',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    description: 'Join our backend team to build scalable APIs and services. Experience with Node.js, PostgreSQL, and cloud platforms required.',
    location: 'Hyderabad, Telangana',
    salary: '₹15L - ₹22L',
    type: 'Full-time',
    skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    candidates: 15,
    contacted: 12,
    scheduled: 5,
  },
  {
    id: 3,
    title: 'Product Designer',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    description: 'Creative Product Designer to lead user experience and interface design. Strong portfolio and user research experience required.',
    location: 'Mumbai, Maharashtra',
    salary: '₹10L - ₹16L',
    type: 'Full-time',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    candidates: 8,
    contacted: 8,
    scheduled: 5,
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    description: 'Experienced DevOps Engineer to manage our cloud infrastructure and deployment pipelines. Strong expertise in AWS, Kubernetes, and CI/CD required.',
    location: 'Pune, Maharashtra',
    salary: '₹18L - ₹25L',
    type: 'Full-time',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'Terraform'],
    candidates: 12,
    contacted: 6,
    scheduled: 2,
  },
];

export default function JobManagement() {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(initialJobs[0]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleJobCreate = (newJob: any) => {
    setJobs(prev => [newJob, ...prev]);
    setSelectedJob(newJob);
  };

  const handleJobUpdate = (updatedJob: any) => {
    setJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job));
    setSelectedJob(updatedJob);
  };

  const handleEditJob = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Job List */}
        <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Jobs</h2>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
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
                  selectedJob.id === job.id ? 'ring-2 ring-blue-500 shadow-md' : ''
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-slate-900">{job.title}</h3>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(job.createdAt)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center text-xs text-slate-500">
                    <Users className="w-3 h-3 mr-1" />
                    {job.candidates} candidates
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Job Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Job Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {selectedJob.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
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
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Created {formatTimeAgo(selectedJob.createdAt)}
                </div>
                <Button variant="outline" onClick={handleEditJob}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Job
                </Button>
              </div>
            </div>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{selectedJob.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
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