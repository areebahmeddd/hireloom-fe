"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createJob as apiCreateJob,
  fetchJobs as apiFetchJobs,
  updateJob as apiUpdateJob,
  deleteJob as apiDeleteJob,
  Job,
} from "./jobs-api";

// Export the Job interface
export type { Job };

// Context interface
interface JobsContextType {
  jobs: Job[];
  addJob: (
    job: Omit<
      Job,
      | "id"
      | "createdAt"
      | "candidates"
      | "contacted"
      | "scheduled"
      | "status"
      | "statusColor"
      | "resumes"
      | "progress"
    >,
  ) => Promise<void>;
  updateJob: (id: number, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
  getJobById: (id: number) => Job | undefined;
  loading: boolean;
  error: string | null;
  refreshJobs: () => Promise<void>;
}

// Create context
const JobsContext = createContext<JobsContextType | undefined>(undefined);

// Provider component
export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load jobs from API on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedJobs = await apiFetchJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (
    jobData: Omit<
      Job,
      | "id"
      | "createdAt"
      | "candidates"
      | "contacted"
      | "scheduled"
      | "status"
      | "statusColor"
      | "resumes"
      | "progress"
    >,
  ) => {
    try {
      setError(null);
      const newJob = await apiCreateJob(jobData);
      setJobs((prev) => [newJob, ...prev]);
    } catch (err) {
      console.error("Error adding job:", err);
      setError("Failed to add job");
      throw err;
    }
  };

  const updateJob = async (id: number, updates: Partial<Job>) => {
    try {
      setError(null);
      const updatedJob = await apiUpdateJob(id, updates);
      setJobs((prev) => prev.map((job) => (job.id === id ? updatedJob : job)));
    } catch (err) {
      console.error("Error updating job:", err);
      setError("Failed to update job");
      throw err;
    }
  };

  const deleteJob = async (id: number) => {
    try {
      setError(null);
      await apiDeleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job");
      throw err;
    }
  };

  const getJobById = (id: number) => {
    return jobs.find((job) => job.id === id);
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        deleteJob,
        getJobById,
        loading,
        error,
        refreshJobs: loadJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

// Custom hook to use jobs context
export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
