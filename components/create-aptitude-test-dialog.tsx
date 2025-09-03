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
import { Clock, FileText, Brain, Send, Eye } from "lucide-react";
import {
  generateQuestionsFromJobDescription,
  sendTestToCandidate,
  AptitudeTest,
  Question,
} from "@/lib/aptitude-test";
import { toast } from "sonner";

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
  const [step, setStep] = useState<"setup" | "preview" | "send">("setup");
  const [testConfig, setTestConfig] = useState({
    duration: 30,
    questionCount: 10,
    difficulty: "medium" as "easy" | "medium" | "hard",
    passingScore: 70,
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
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
      toast.success("Questions generated successfully!");
    } catch (error) {
      toast.error("Failed to generate questions");
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendTest = async () => {
    if (!jobData || !candidate || generatedQuestions.length === 0) return;

    setIsSending(true);
    try {
      const test: AptitudeTest = {
        id: `test_${Date.now()}`,
        jobId: jobData.id,
        jobTitle: jobData.title,
        jobDescription: jobData.description,
        questions: generatedQuestions,
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

      toast.success("✅ Test email sent successfully!", {
        description: `Aptitude test invitation sent to ${candidate.name} at ${candidate.email}`,
        duration: 5000,
      });

      // Reset and close dialog
      setStep("setup");
      setGeneratedQuestions([]);
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("❌ Failed to send test email", {
        description: `Could not send test to ${candidate.email}. ${errorMessage}`,
        duration: 7000,
      });
      console.error("Error sending test:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setStep("setup");
    setGeneratedQuestions([]);
    onOpenChange(false);
  };

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
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Generated Questions Preview
              </h3>
              <Badge variant="outline">
                {generatedQuestions.length} questions • {testConfig.duration}{" "}
                minutes
              </Badge>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {generatedQuestions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {question.type.replace("_", " ")} • {question.skill}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {question.timeLimit || 5}m
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        {index + 1}. {question.question}
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
                            This will be evaluated manually by the interviewer.
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
            </>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("setup")}>
                Back to Setup
              </Button>
              <Button
                onClick={handleSendTest}
                disabled={!candidate || isSending}
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
    </Dialog>
  );
}
