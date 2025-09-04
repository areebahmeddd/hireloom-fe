// Job interface based on backend API response
export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  skills: string[];
  candidates: number;
  contacted: number;
  scheduled: number;
  createdAt: string;
  status?: string;
  statusColor?: string;
  resumes?: number;
  progress?: number;
  jobPortals?: string[];
}

// API Response interface
interface JobsResponse {
  items: Job[];
  total_count: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get all jobs
export async function fetchJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/jobs`);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }
    const data: JobsResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

// Create a new job
export async function createJob(
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
): Promise<Job> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.statusText}`);
    }

    const newJob: Job = await response.json();
    return newJob;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

// Update a job
export async function updateJob(
  id: number,
  updates: Partial<Job>,
): Promise<Job> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update job: ${response.statusText}`);
    }

    const updatedJob: Job = await response.json();
    return updatedJob;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}

// Delete a job
export async function deleteJob(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete job: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
}

// Legacy exports for backward compatibility
export const getAllJobs = fetchJobs;
