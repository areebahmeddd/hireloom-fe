import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

// Candidate interface based on your Firestore structure
export interface Candidate {
  id: string;
  candidate_name: string;
  applied_jobs: string[];
  combined_score: {
    github_score: number;
    overall_score: number;
    resume_score: number;
    suitability_score: number;
  };
  contact_info: {
    email: string;
    github?: string;
    linkedin?: string;
    phone?: string;
  };
  created_at: any; // Firestore timestamp
  current_role?: string | null;
  experience_years: number;
  location?: string | null;
  notes?: string;
  resume_analysis?: {
    education_evaluation?: any;
    experience_evaluation?: any;
    overall_assessment?: string;
    skills_match?: {
      matched_skills: string[];
      missing_skills: string[];
    };
    strengths?: string[];
    weaknesses?: string[];
  };
  status: string;
  updated_at: any; // Firestore timestamp
}

const CANDIDATES_COLLECTION = "candidates";

// Get all candidates who applied for a specific job
export async function getCandidatesForJob(jobId: string): Promise<Candidate[]> {
  try {
    const candidatesQuery = query(
      collection(db, CANDIDATES_COLLECTION),
      where("applied_jobs", "array-contains", jobId),
    );

    const querySnapshot = await getDocs(candidatesQuery);

    const candidates: Candidate[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      candidates.push({
        id: doc.id,
        candidate_name: data.candidate_name || "",
        applied_jobs: data.applied_jobs || [],
        combined_score: {
          github_score: data.combined_score?.github_score || 0,
          overall_score: data.combined_score?.overall_score || 0,
          resume_score: data.combined_score?.resume_score || 0,
          suitability_score: data.combined_score?.suitability_score || 0,
        },
        contact_info: {
          email: data.contact_info?.email || "",
          github: data.contact_info?.github || "",
          linkedin: data.contact_info?.linkedin || "",
          phone: data.contact_info?.phone || "",
        },
        created_at: data.created_at,
        current_role: data.current_role,
        experience_years: data.experience_years || 0,
        location: data.location,
        notes: data.notes || "",
        resume_analysis: data.resume_analysis,
        status: data.status || "pending",
        updated_at: data.updated_at,
      });
    });

    return candidates;
  } catch (error) {
    console.error("❌ Error fetching candidates for job:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
}

// Get all candidates (for general use)
export async function getAllCandidates(): Promise<Candidate[]> {
  try {
    const candidatesQuery = query(
      collection(db, CANDIDATES_COLLECTION),
      orderBy("created_at", "desc"),
    );

    const querySnapshot = await getDocs(candidatesQuery);

    const candidates: Candidate[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      candidates.push({
        id: doc.id,
        candidate_name: data.candidate_name || "",
        applied_jobs: data.applied_jobs || [],
        combined_score: {
          github_score: data.combined_score?.github_score || 0,
          overall_score: data.combined_score?.overall_score || 0,
          resume_score: data.combined_score?.resume_score || 0,
          suitability_score: data.combined_score?.suitability_score || 0,
        },
        contact_info: {
          email: data.contact_info?.email || "",
          github: data.contact_info?.github || "",
          linkedin: data.contact_info?.linkedin || "",
          phone: data.contact_info?.phone || "",
        },
        created_at: data.created_at,
        current_role: data.current_role,
        experience_years: data.experience_years || 0,
        location: data.location,
        notes: data.notes || "",
        resume_analysis: data.resume_analysis,
        status: data.status || "pending",
        updated_at: data.updated_at,
      });
    });

    return candidates;
  } catch (error) {
    console.error("Error fetching all candidates:", error);
    throw error;
  }
}

// Helper function to format candidate data for display
export function formatCandidateForDisplay(candidate: Candidate) {
  return {
    id: candidate.id,
    name: candidate.candidate_name,
    email: candidate.contact_info.email,
    phone: candidate.contact_info.phone,
    score: candidate.combined_score.overall_score,
    githubScore: candidate.combined_score.github_score,
    resumeScore: candidate.combined_score.resume_score,
    suitabilityScore: candidate.combined_score.suitability_score,
    skills: candidate.resume_analysis?.skills_match?.matched_skills || [],
    experience: candidate.experience_years,
    status: candidate.status,
    location: candidate.location,
    linkedin: candidate.contact_info.linkedin,
    github: candidate.contact_info.github,
    strengths: candidate.resume_analysis?.strengths || [],
    weaknesses: candidate.resume_analysis?.weaknesses || [],
    overallAssessment: candidate.resume_analysis?.overall_assessment || "",
    appliedJobs: candidate.applied_jobs,
  };
}

// Update candidate status
export async function updateCandidateStatus(
  candidateId: string,
  status: string,
): Promise<void> {
  try {
    const { doc, updateDoc } = await import("firebase/firestore");
    const candidateRef = doc(db, CANDIDATES_COLLECTION, candidateId);

    await updateDoc(candidateRef, {
      status: status,
      updated_at: new Date(),
    });
  } catch (error) {
    console.error("❌ Error updating candidate status:", error);
    throw error;
  }
}
