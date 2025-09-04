"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Code,
  Brain,
} from "lucide-react";
import { CreateAptitudeTestDialog } from "./create-aptitude-test-dialog";
import { ComposeEmailDialog } from "./compose-email-dialog";
import { useCandidates } from "@/lib/candidates-context";
import { useJobs } from "@/lib/jobs-context";
import { useToast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  score: number;
  githubScore?: number;
  resumeScore?: number;
  suitabilityScore?: number;
  skills: string[];
  experience: number;
  status: string;
  location?: string;
  linkedin?: string;
  github?: string;
  strengths?: string[];
  weaknesses?: string[];
  overallAssessment?: string;
  appliedJobs: string[];
}

interface CandidateTableProps {
  jobId?: string; // Changed to string to match Firestore job IDs
  showAllJobs?: boolean;
  searchTerm?: string;
  jobFilter?: string;
  statusFilter?: string;
}

export function CandidateTable({
  jobId,
  showAllJobs = false,
  searchTerm = "",
  jobFilter = "all",
  statusFilter = "all",
}: CandidateTableProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("score");
  const [showAptitudeTestDialog, setShowAptitudeTestDialog] = useState(false);
  const [testCandidate, setTestCandidate] = useState<Candidate | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailCandidate, setEmailCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Get contexts
  const {
    getCandidatesForJob,
    updateCandidateStatus,
    candidates: allCandidates,
    loading: contextLoading,
  } = useCandidates();
  const { getJobById, jobs } = useJobs();
  const { toast } = useToast();

  // Load candidates based on jobId or show all candidates
  useEffect(() => {
    const loadCandidates = async () => {
      if (showAllJobs) {
        // When showing all jobs, use the candidates from context
        setCandidates(allCandidates);
        setLoading(contextLoading);
      } else if (jobId) {
        setLoading(true);
        try {
          const jobCandidates = await getCandidatesForJob(jobId);
          setCandidates(jobCandidates);
        } catch (error) {
          console.error("Error loading candidates:", error);
          setCandidates([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setCandidates([]);
      }
    };

    loadCandidates();
  }, [jobId, showAllJobs, allCandidates, contextLoading, getCandidatesForJob]);

  // Get job data
  const jobData = jobId ? getJobById(parseInt(jobId)) : null;
  const jobDataForTest = {
    id: jobId || "1",
    title: jobData?.title || "Frontend Developer",
    description:
      jobData?.description ||
      "We are looking for an experienced developer to join our team...",
    skills: jobData?.skills || ["React", "TypeScript", "Next.js"],
  };

  const handleSendAptitudeTest = (candidate: Candidate) => {
    setTestCandidate(candidate);
    setShowAptitudeTestDialog(true);
  };

  const handleSendEmail = (candidate: Candidate) => {
    setEmailCandidate(candidate);
    setShowEmailDialog(true);
  };

  const handleStartConversation = async (
    candidate: Candidate,
    candidateIndex: number,
  ) => {
    try {
      const response = await fetch(
        "https://api.shivanshkaran.tech/api/v1/telegram/outreach",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target_chat_id: "8094940690",
            candidate_index: candidateIndex,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to start conversation: ${response.statusText}`);
      }

      const result = await response.json();

      // Update candidate status to "contacted" after successful conversation
      try {
        await updateCandidateStatus(candidate.id, "contacted");

        // Update local state immediately for better UX
        setCandidates((prevCandidates) =>
          prevCandidates.map((c) =>
            c.id === candidate.id ? { ...c, contact_status: "contacted" } : c,
          ),
        );
      } catch (statusError) {
        console.error("Error updating candidate status:", statusError);
        // Don't throw here - the conversation was successful even if status update failed
      }

      // Show success toast
      toast({
        title: "✅ Conversation Started!",
        description: `Message sent to ${candidate.name} via Telegram. Status updated to contacted.`,
        duration: 4000,
      });

      // Close the sheet after successful conversation
      setIsSheetOpen(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error("Error starting conversation:", error);

      // Show error toast
      toast({
        title: "❌ Failed to Start Conversation",
        description: `Could not send message to ${candidate.name}. Please try again.`,
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading candidates...</div>
        </CardContent>
      </Card>
    );
  }

  // Filter candidates based on multiple criteria
  let filteredCandidates = candidates;

  // Apply search filter
  if (searchTerm) {
    filteredCandidates = filteredCandidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase()),
        ) ||
        (candidate.location &&
          candidate.location.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }

  // Apply job filter when showing all jobs
  if (showAllJobs && jobFilter !== "all") {
    filteredCandidates = filteredCandidates.filter(
      (candidate) =>
        candidate.appliedJobs && candidate.appliedJobs.includes(jobFilter),
    );
  }

  // Apply status filter
  if (statusFilter !== "all") {
    const statusMapping: { [key: string]: string } = {
      pending: "pending",
      analyzed: "analyzed",
      contacted: "contacted",
      scheduled: "scheduled",
    };
    filteredCandidates = filteredCandidates.filter(
      (candidate) => candidate.status === statusMapping[statusFilter],
    );
  }

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {showAllJobs ? "All Candidates" : "Job Candidates"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th
                    className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                    onClick={() => setSortBy("name")}
                  >
                    Name
                  </th>
                  <th
                    className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                    onClick={() => setSortBy("score")}
                  >
                    Score
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Skills
                  </th>
                  {showAllJobs && (
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Job
                    </th>
                  )}
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Contact Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCandidates.map((candidate, index) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setIsSheetOpen(true);
                    }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">
                            {candidate.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {candidate.experience} years experience
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-slate-900">
                          {candidate.score}
                        </span>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    {showAllJobs && (
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.appliedJobs &&
                          candidate.appliedJobs.length > 0 ? (
                            candidate.appliedJobs
                              .slice(0, 2)
                              .map((jobId, index) => {
                                const job = jobs.find(
                                  (j) => j.id.toString() === jobId,
                                );
                                return (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {job?.title || `Job ${jobId}`}
                                  </Badge>
                                );
                              })
                          ) : (
                            <span className="text-sm text-slate-400">
                              No jobs
                            </span>
                          )}
                          {candidate.appliedJobs &&
                            candidate.appliedJobs.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.appliedJobs.length - 2}
                              </Badge>
                            )}
                        </div>
                      </td>
                    )}
                    <td className="py-4 px-4">
                      <Badge
                        className={
                          candidate.status === "scheduled"
                            ? "bg-green-100 text-green-700"
                            : candidate.status === "contacted"
                              ? "bg-primary/10 text-primary"
                              : "bg-slate-100 text-slate-700"
                        }
                      >
                        {candidate.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSendEmail(candidate);
                          }}
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleStartConversation(candidate, index);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendAptitudeTest(candidate);
                          }}
                          title="Send Aptitude Test"
                        >
                          <Brain className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Profile Drawer */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) {
            setSelectedCandidate(null);
          }
        }}
      >
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          {selectedCandidate && (
            <>
              <SheetHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {selectedCandidate.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">
                      {selectedCandidate.name}
                    </SheetTitle>
                    <SheetDescription className="text-slate-600">
                      {jobData?.title || "No position specified"} •{" "}
                      {selectedCandidate.location || "Location not specified"}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Score and Quick Info */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="text-2xl font-bold text-slate-900">
                          {selectedCandidate.score}
                        </span>
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                      <p className="text-sm text-slate-600">Match Score</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-slate-900 mb-1">
                        {selectedCandidate.experience}
                      </p>
                      <p className="text-sm text-slate-600">Years Exp</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Badge
                        className={
                          selectedCandidate.status === "scheduled"
                            ? "bg-green-100 text-green-700"
                            : selectedCandidate.status === "contacted"
                              ? "bg-primary/10 text-primary"
                              : "bg-slate-100 text-slate-700"
                        }
                      >
                        {selectedCandidate.status}
                      </Badge>
                      <p className="text-sm text-slate-600 mt-1">Status</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map(
                      (skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">
                        {selectedCandidate.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">
                        {selectedCandidate.phone || "No phone number"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Links */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Links</h3>
                  <div className="space-y-3">
                    {selectedCandidate.linkedin && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          const url = selectedCandidate.linkedin?.startsWith(
                            "http",
                          )
                            ? selectedCandidate.linkedin
                            : `https://${selectedCandidate.linkedin}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                        LinkedIn Profile
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                    )}
                    {selectedCandidate.github && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          const url = selectedCandidate.github?.startsWith(
                            "http",
                          )
                            ? selectedCandidate.github
                            : `https://${selectedCandidate.github}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub Profile
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                    )}
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Resume
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Summary */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Assessment Summary
                  </h3>
                  <p className="text-sm text-slate-600">
                    {selectedCandidate.overallAssessment ||
                      "No assessment available"}
                  </p>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const candidateIndex = sortedCandidates.findIndex(
                        (c) => c.id === selectedCandidate.id,
                      );
                      handleStartConversation(
                        selectedCandidate,
                        candidateIndex,
                      );
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Conversation
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Aptitude Test Dialog */}
      <CreateAptitudeTestDialog
        open={showAptitudeTestDialog}
        onOpenChange={setShowAptitudeTestDialog}
        jobData={
          jobData
            ? {
                id: jobData.id.toString(),
                title: jobData.title,
                description: jobData.description,
                skills: jobData.skills || [],
              }
            : undefined
        }
        candidate={
          testCandidate
            ? {
                id: testCandidate.id,
                name: testCandidate.name,
                email: testCandidate.email,
              }
            : undefined
        }
      />

      {/* Email Compose Dialog */}
      <ComposeEmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        candidate={
          emailCandidate
            ? {
                id: emailCandidate.id,
                name: emailCandidate.name,
                email: emailCandidate.email,
              }
            : undefined
        }
        jobTitle={jobData?.title}
      />
    </>
  );
}
