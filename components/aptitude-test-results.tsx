"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
} from "lucide-react";

interface TestResult {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent: number; // in minutes
  status: "passed" | "failed";
}

const mockTestResults: TestResult[] = [
  {
    id: "1",
    candidateName: "Priya Sharma",
    candidateEmail: "priya.sharma@email.com",
    jobTitle: "Frontend Developer",
    score: 8,
    percentage: 80,
    totalQuestions: 10,
    completedAt: new Date("2024-01-15T10:30:00"),
    timeSpent: 25,
    status: "passed",
  },
  {
    id: "2",
    candidateName: "Karthik Reddy",
    candidateEmail: "karthik.reddy@email.com",
    jobTitle: "Backend Developer",
    score: 6,
    percentage: 60,
    totalQuestions: 10,
    completedAt: new Date("2024-01-14T14:20:00"),
    timeSpent: 30,
    status: "failed",
  },
  {
    id: "3",
    candidateName: "Deepika Agarwal",
    candidateEmail: "deepika.agarwal@email.com",
    jobTitle: "Backend Developer",
    score: 9,
    percentage: 90,
    totalQuestions: 10,
    completedAt: new Date("2024-01-14T16:45:00"),
    timeSpent: 22,
    status: "passed",
  },
];

interface AptitudeTestResultsProps {
  jobId?: number;
  showAllJobs?: boolean;
}

export function AptitudeTestResults({
  jobId,
  showAllJobs = false,
}: AptitudeTestResultsProps) {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const selectedTestResult = mockTestResults.find(
    (result) => result.id === selectedTestId,
  );

  const handleViewDetails = (testId: string) => {
    setSelectedTestId(testId);
    setIsDetailsDialogOpen(true);
  };

  const handleScheduleInterview = (candidateEmail: string) => {
    console.log("Schedule interview for:", candidateEmail);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Aptitude Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTestResults.map((result) => (
              <div
                key={result.id}
                className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {result.candidateName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.candidateEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        result.status === "passed" ? "default" : "destructive"
                      }
                    >
                      {result.status.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.jobTitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {result.percentage}%
                      </span>
                    </div>
                    <Progress value={result.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {result.score}/{result.totalQuestions} questions correct
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Time Spent</span>
                    </div>
                    <p className="text-xl font-semibold">
                      {result.timeSpent} min
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Completed on {result.completedAt.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {result.status === "passed" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <p className="text-xl font-semibold capitalize">
                      {result.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.status === "passed"
                        ? "Ready for interview"
                        : "Needs improvement"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(result.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  {result.status === "passed" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleScheduleInterview(result.candidateEmail)
                      }
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Interview
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {mockTestResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No aptitude test results yet.</p>
                <p className="text-sm">
                  Send tests to candidates to see results here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Test Details - {selectedTestResult?.candidateName}
            </DialogTitle>
          </DialogHeader>

          {selectedTestResult && (
            <div className="space-y-6">
              {/* Test Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Final Score
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedTestResult.percentage}%
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedTestResult.score}/
                    {selectedTestResult.totalQuestions} correct
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Time Spent
                  </p>
                  <p className="text-2xl font-bold">
                    {selectedTestResult.timeSpent}m
                  </p>
                  <p className="text-xs text-slate-500">
                    Completed{" "}
                    {selectedTestResult.completedAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <Badge
                    variant={
                      selectedTestResult.status === "passed"
                        ? "default"
                        : "destructive"
                    }
                    className="text-lg"
                  >
                    {selectedTestResult.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Candidate Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Candidate Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Name</p>
                    <p className="text-sm">
                      {selectedTestResult.candidateName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Email</p>
                    <p className="text-sm">
                      {selectedTestResult.candidateEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Position
                    </p>
                    <p className="text-sm">{selectedTestResult.jobTitle}</p>
                  </div>
                </div>
              </div>

              {/* Mock Question Breakdown */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Question Breakdown</h3>
                <div className="space-y-3">
                  {/* Mock questions for demo */}
                  {[1, 2, 3, 4, 5].map((questionNum) => (
                    <div key={questionNum} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">
                          Question {questionNum}: React Component Lifecycle
                        </p>
                        <Badge
                          variant={
                            questionNum <= selectedTestResult.score
                              ? "default"
                              : "destructive"
                          }
                        >
                          {questionNum <= selectedTestResult.score
                            ? "Correct"
                            : "Incorrect"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        Which lifecycle method is called after a component is
                        mounted?
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div
                          className={`p-2 rounded ${questionNum <= selectedTestResult.score ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                        >
                          <p className="font-medium">Candidate Answer:</p>
                          <p>
                            {questionNum <= selectedTestResult.score
                              ? "componentDidMount()"
                              : "componentWillMount()"}
                          </p>
                        </div>
                        <div className="p-2 rounded bg-green-50 border border-green-200">
                          <p className="font-medium">Correct Answer:</p>
                          <p>componentDidMount()</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedTestResult.status === "passed" && (
                  <Button
                    onClick={() =>
                      handleScheduleInterview(selectedTestResult.candidateEmail)
                    }
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
