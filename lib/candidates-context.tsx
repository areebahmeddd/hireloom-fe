"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Candidate,
  getCandidatesForJob,
  getAllCandidates,
  formatCandidateForDisplay,
} from "./candidates-api";

interface CandidatesContextType {
  candidates: any[];
  loading: boolean;
  error: string | null;
  getCandidatesForJob: (jobId: string) => Promise<any[]>;
  refreshCandidates: () => Promise<void>;
}

const CandidatesContext = createContext<CandidatesContextType | undefined>(
  undefined,
);

export function CandidatesProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCandidates = await getAllCandidates();
      const formattedCandidates = fetchedCandidates.map(
        formatCandidateForDisplay,
      );
      setCandidates(formattedCandidates);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load candidates",
      );
      console.error("Error loading candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCandidatesForJobId = async (jobId: string) => {
    try {
      setError(null);
      const jobCandidates = await getCandidatesForJob(jobId);
      return jobCandidates.map(formatCandidateForDisplay);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load candidates for job",
      );
      console.error("Error loading candidates for job:", err);
      return [];
    }
  };

  useEffect(() => {
    loadAllCandidates();
  }, []);

  const value = {
    candidates,
    loading,
    error,
    getCandidatesForJob: getCandidatesForJobId,
    refreshCandidates: loadAllCandidates,
  };

  return (
    <CandidatesContext.Provider value={value}>
      {children}
    </CandidatesContext.Provider>
  );
}

export function useCandidates() {
  const context = useContext(CandidatesContext);
  if (context === undefined) {
    throw new Error("useCandidates must be used within a CandidatesProvider");
  }
  return context;
}
