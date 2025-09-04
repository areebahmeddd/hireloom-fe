"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  FileText,
  Brain,
  Send,
  Eye,
  Plus,
  Trash2,
  Edit,
  Target,
} from "lucide-react";
import {
  generateQuestionsFromJobDescription,
  sendTestToCandidate,
  AptitudeTest,
  Question,
} from "@/lib/aptitude-test";
import { CreateCustomAssignmentDialog } from "./create-custom-assignment-dialog";
import { useToast } from "@/hooks/use-toast";

interface CreateAptitudeTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobData?: {
    id: string;
    title: string;
    description: string;
    skills: string[];
  };
  candidate?: {
    id: string;
    name: string;
    email: string;
  };
}

export function CreateAptitudeTestDialog({
  open,
  onOpenChange,
  jobData,
  candidate,
}: CreateAptitudeTestDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"setup" | "preview" | "send">("setup");
  const [testConfig, setTestConfig] = useState({
    duration: 30,
    questionCount: 10,
    difficulty: "medium" as "easy" | "medium" | "hard",
    passingScore: 70,
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [customAssignments, setCustomAssignments] = useState<Question[]>([]);
  const [showCustomAssignmentDialog, setShowCustomAssignmentDialog] =
    useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleGenerateQuestions = async () => {
    if (!jobData) return;

    setIsGenerating(true);
    try {
      const questions = await generateQuestionsFromJobDescription(
        jobData.title,
        jobData.description,
        jobData.skills,
        testConfig.difficulty,
        testConfig.questionCount,
      );
      setGeneratedQuestions(questions);
      setStep("preview");
      toast({
        title: "✅ Questions generated successfully!",
        description: `Generated ${questions.length} questions for the test.`,
      });
    } catch (error) {
      toast({
        title: "❌ Failed to generate questions",
        description: "Please try again or check your inputs.",
        variant: "destructive",
      });
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendTest = async () => {
    const allQuestions = [...generatedQuestions, ...customAssignments];

    if (!jobData || !candidate || allQuestions.length === 0) {
      toast({
        title: "❌ Cannot send test",
        description: "Missing job data, candidate information, or questions",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const test: AptitudeTest = {
        id: `test_${Date.now()}`,
        jobId: jobData.id,
        jobTitle: jobData.title,
        jobDescription: jobData.description,
        questions: allQuestions,
        duration: testConfig.duration,
        passingScore: testConfig.passingScore,
        createdAt: new Date(),
        createdBy: "current_user", // Replace with actual user ID
      };

      const testLink = await sendTestToCandidate(
        test,
        candidate.email,
        candidate.name,
      );

      toast({
        title: "✅ Test email sent successfully!",
        description: `Aptitude test invitation sent to ${candidate.name} at ${candidate.email}`,
      });

      // Reset and close dialog
      setStep("setup");
      setGeneratedQuestions([]);
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      console.error("❌ Error sending test:", error);

      toast({
        title: "❌ Failed to send test email",
        description: `Could not send test to ${candidate.email}. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setStep("setup");
    setGeneratedQuestions([]);
    setCustomAssignments([]);
    onOpenChange(false);
  };

  const handleCustomAssignmentCreated = (assignment: Question) => {
    setCustomAssignments((prev) => [...prev, assignment]);
  };

  const removeCustomAssignment = (assignmentId: string) => {
    setCustomAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
  };

  const allQuestions = [...generatedQuestions, ...customAssignments];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Create Aptitude Test
            {jobData && <Badge variant="secondary">{jobData.title}</Badge>}
          </DialogTitle>
        </DialogHeader>

        {step === "setup" && (
          <div className="space-y-6">
            {/* Job Information */}
            {jobData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Position</Label>
                    <p className="text-sm text-muted-foreground">
                      {jobData.title}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Required Skills
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {jobData.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="10"
                      max="120"
                      value={testConfig.duration}
                      onChange={(e) =>
                        setTestConfig((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value) || 30,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="questionCount">Number of Questions</Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min="5"
                      max="25"
                      value={testConfig.questionCount}
                      onChange={(e) =>
                        setTestConfig((prev) => ({
                          ...prev,
                          questionCount: parseInt(e.target.value) || 10,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Difficulty Level</Label>
                    <Select
                      value={testConfig.difficulty}
                      onValueChange={(value: "easy" | "medium" | "hard") =>
                        setTestConfig((prev) => ({
                          ...prev,
                          difficulty: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      min="50"
                      max="100"
                      value={testConfig.passingScore}
                      onChange={(e) =>
                        setTestConfig((prev) => ({
                          ...prev,
                          passingScore: parseInt(e.target.value) || 70,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidate Information */}
            {candidate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Recipient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Candidate</Label>
                      <p className="text-sm text-muted-foreground">
                        {candidate.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground">
                        {candidate.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Assignments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Custom Assignments
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomAssignmentDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customAssignments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No custom assignments created yet.</p>
                    <p className="text-sm">
                      Create custom assignments to test practical skills.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border rounded-lg p-4 bg-slate-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {assignment.assignmentTitle}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {assignment.assignmentDescription?.slice(0, 100)}
                              {assignment.assignmentDescription &&
                              assignment.assignmentDescription.length > 100
                                ? "..."
                                : ""}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {assignment.skill}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {assignment.difficulty}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs flex items-center gap-1"
                              >
                                <Clock className="w-3 h-3" />
                                {assignment.timeLimit}m
                              </Badge>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeCustomAssignment(assignment.id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Test Preview</h3>
              <Badge variant="outline">
                {allQuestions.length} total items • {testConfig.duration}{" "}
                minutes
              </Badge>
            </div>

            {/* Auto-generated Questions Section */}
            {generatedQuestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Auto-generated Questions ({generatedQuestions.length})
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {generatedQuestions.map((question, index) => (
                    <Card key={`${question.id}-${index}`}>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {question.type.replace("_", " ")} •{" "}
                              {question.skill}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {question.timeLimit || 5}m
                            </div>
                          </div>
                          <p className="text-sm font-medium">
                            Q{index + 1}. {question.question}
                          </p>
                          {question.type === "scenario" ? (
                            <div className="ml-4 space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Candidate Response Area:
                              </Label>
                              <Textarea
                                placeholder="Candidate will provide their response here..."
                                className="min-h-[100px] text-xs bg-gray-50 border-dashed"
                                disabled
                              />
                              <p className="text-xs text-muted-foreground">
                                This will be evaluated manually by the
                                interviewer.
                              </p>
                            </div>
                          ) : question.options ? (
                            <div className="ml-4 space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`text-xs p-2 rounded ${
                                    optIndex === question.correctAnswer
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Assignments Section */}
            {customAssignments.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Custom Assignments ({customAssignments.length})
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {customAssignments.map((assignment, index) => (
                    <Card key={assignment.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            Assignment {index + 1} • {assignment.skill}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {assignment.difficulty}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            {assignment.timeLimit}m
                          </Badge>
                        </div>
                      </div>
                      <h5 className="font-medium text-sm mb-2">
                        {assignment.assignmentTitle}
                      </h5>
                      <p className="text-xs text-muted-foreground mb-3">
                        {assignment.assignmentDescription}
                      </p>

                      {assignment.assignmentRequirements &&
                        assignment.assignmentRequirements.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium mb-1">
                              Requirements:
                            </p>
                            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                              {assignment.assignmentRequirements.map(
                                (req, reqIndex) => (
                                  <li key={reqIndex}>{req}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                      {assignment.deliverables &&
                        assignment.deliverables.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-1">
                              Deliverables:
                            </p>
                            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                              {assignment.deliverables.map((del, delIndex) => (
                                <li key={delIndex}>{del}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {step === "setup" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerateQuestions}
                disabled={!jobData || isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Generate Questions
                  </>
                )}
              </Button>
              {allQuestions.length > 0 && (
                <Button onClick={() => setStep("preview")}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Test ({allQuestions.length})
                </Button>
              )}
            </>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("setup")}>
                Back to Setup
              </Button>
              <Button
                onClick={handleSendTest}
                disabled={!candidate || isSending || allQuestions.length === 0}
                className="flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Test to Candidate
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Custom Assignment Dialog */}
      <CreateCustomAssignmentDialog
        open={showCustomAssignmentDialog}
        onOpenChange={setShowCustomAssignmentDialog}
        onAssignmentCreated={handleCustomAssignmentCreated}
        jobData={jobData}
      />
    </Dialog>
  );
}
