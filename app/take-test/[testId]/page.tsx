"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle, Brain } from "lucide-react";
import {
  AptitudeTest,
  Question,
  TestResponse,
  calculateTestScore,
} from "@/lib/aptitude-test";
import { toast } from "sonner";

export default function TakeTestPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const testId = params.testId as string;
  const candidateEmail = searchParams.get("candidate");

  const [test, setTest] = useState<AptitudeTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: string; answer: string | number }[]
  >([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStatus, setTestStatus] = useState<
    "loading" | "ready" | "in_progress" | "completed" | "error"
  >("loading");
  const [candidateName, setCandidateName] = useState("");
  const [testResults, setTestResults] = useState<any>(null);

  // Mock test data - in real app, this would be fetched from API
  useEffect(() => {
    const mockTest: AptitudeTest = {
      id: testId,
      jobId: "1",
      jobTitle: "Frontend Developer",
      jobDescription:
        "Frontend Developer role requiring React, TypeScript, and Next.js skills",
      questions: [
        {
          id: "q1",
          type: "multiple_choice",
          question:
            "What is the primary advantage of using React in modern web development?",
          options: [
            "React provides better performance optimization",
            "React has a smaller learning curve",
            "React is only suitable for small projects",
            "React doesn't require any configuration",
          ],
          correctAnswer: 0,
          difficulty: "medium",
          skill: "React",
          timeLimit: 3,
        },
        {
          id: "q2",
          type: "multiple_choice",
          question:
            "Which TypeScript feature helps catch errors at compile time?",
          options: [
            "Dynamic typing",
            "Static type checking",
            "Runtime validation",
            "Loose type coercion",
          ],
          correctAnswer: 1,
          difficulty: "medium",
          skill: "TypeScript",
          timeLimit: 3,
        },
        {
          id: "q3",
          type: "scenario",
          question:
            "You're working on a project that requires React. Describe how you would approach implementing a complex feature that needs to scale for 100,000+ users.",
          difficulty: "hard",
          skill: "React Architecture",
          timeLimit: 10,
        },
        {
          id: "q4",
          type: "short_answer",
          question:
            "Describe how you would optimize a React application for better performance. Mention at least 3 techniques.",
          difficulty: "hard",
          skill: "React Performance",
          timeLimit: 10,
        },
      ],
      duration: 30,
      passingScore: 70,
      createdAt: new Date(),
      createdBy: "recruiter1",
    };

    setTest(mockTest);
    setTimeRemaining(mockTest.duration * 60); // Convert to seconds
    setTestStatus("ready");
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (testStatus === "in_progress" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStatus, timeRemaining]);

  const startTest = () => {
    if (!candidateName.trim()) {
      toast.error("Please enter your name to start the test");
      return;
    }
    setTestStatus("in_progress");
  };

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, answer } : a,
        );
      }
      return [...prev, { questionId, answer }];
    });
  };

  const nextQuestion = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = () => {
    if (!test) return;

    const results = calculateTestScore(test, answers);
    setTestResults(results);
    setTestStatus("completed");

    // In real app, this would submit to API
    toast.success("Test submitted successfully!");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (testStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Test Not Found</h2>
            <p className="text-muted-foreground">
              The test link may be invalid or expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Hireloom Aptitude Test</h1>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {test.jobTitle}
          </Badge>
        </div>

        {testStatus === "ready" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Test Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>
                    <strong>Duration:</strong> {test.duration} minutes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>
                    <strong>Questions:</strong> {test.questions.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span>
                    <strong>Passing Score:</strong> {test.passingScore}%
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Important Guidelines:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• You cannot go back to previous questions</li>
                  <li>• The test will auto-submit when time expires</li>
                  <li>• Ensure stable internet connection</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Label htmlFor="candidateName">Your Full Name</Label>
                <Input
                  id="candidateName"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>

              <Button onClick={startTest} className="w-full" size="lg">
                Start Test
              </Button>
            </CardContent>
          </Card>
        )}

        {testStatus === "in_progress" && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Question {currentQuestionIndex + 1} of{" "}
                    {test.questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-mono">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
                <Progress
                  value={
                    ((currentQuestionIndex + 1) / test.questions.length) * 100
                  }
                  className="h-2"
                />
              </CardContent>
            </Card>

            {/* Current Question */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {test.questions[currentQuestionIndex].skill}
                  </Badge>
                  <Badge variant="outline">
                    {test.questions[currentQuestionIndex].difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <h2 className="text-xl font-semibold">
                  {test.questions[currentQuestionIndex].question}
                </h2>

                {test.questions[currentQuestionIndex].type ===
                  "multiple_choice" && (
                  <RadioGroup
                    value={
                      answers
                        .find(
                          (a) =>
                            a.questionId ===
                            test.questions[currentQuestionIndex].id,
                        )
                        ?.answer?.toString() || ""
                    }
                    onValueChange={(value) =>
                      handleAnswer(
                        test.questions[currentQuestionIndex].id,
                        parseInt(value),
                      )
                    }
                  >
                    {test.questions[currentQuestionIndex].options?.map(
                      (option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`option-${index}`}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ),
                    )}
                  </RadioGroup>
                )}

                {test.questions[currentQuestionIndex].type ===
                  "short_answer" && (
                  <Textarea
                    value={
                      answers
                        .find(
                          (a) =>
                            a.questionId ===
                            test.questions[currentQuestionIndex].id,
                        )
                        ?.answer?.toString() || ""
                    }
                    onChange={(e) =>
                      handleAnswer(
                        test.questions[currentQuestionIndex].id,
                        e.target.value,
                      )
                    }
                    placeholder="Type your answer here..."
                    className="min-h-32"
                  />
                )}

                {test.questions[currentQuestionIndex].type === "scenario" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Please describe your approach in detail:
                    </Label>
                    <Textarea
                      value={
                        answers
                          .find(
                            (a) =>
                              a.questionId ===
                              test.questions[currentQuestionIndex].id,
                          )
                          ?.answer?.toString() || ""
                      }
                      onChange={(e) =>
                        handleAnswer(
                          test.questions[currentQuestionIndex].id,
                          e.target.value,
                        )
                      }
                      placeholder="Describe your approach, methodology, tools you would use, considerations for scale, potential challenges, and how you would address them..."
                      className="min-h-40"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Include specific examples and demonstrate your
                      problem-solving process.
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {test.questions[currentQuestionIndex].timeLimit && (
                      <>
                        Recommended time:{" "}
                        {test.questions[currentQuestionIndex].timeLimit} minutes
                      </>
                    )}
                  </div>
                  <Button onClick={nextQuestion}>
                    {currentQuestionIndex < test.questions.length - 1
                      ? "Next Question"
                      : "Submit Test"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {testStatus === "completed" && testResults && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Test Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-4">
                <div className="text-6xl font-bold text-blue-600">
                  {testResults.percentage}%
                </div>
                <div className="text-lg">
                  {testResults.score} out of {test.questions.length} questions
                  correct
                </div>
                <Badge
                  variant={
                    testResults.percentage >= test.passingScore
                      ? "default"
                      : "destructive"
                  }
                  className="text-lg px-4 py-2"
                >
                  {testResults.percentage >= test.passingScore
                    ? "PASSED"
                    : "NEEDS IMPROVEMENT"}
                </Badge>
              </div>

              <div className="border-t pt-6">
                <p className="text-muted-foreground">
                  Thank you for completing the aptitude test for the{" "}
                  <strong>{test.jobTitle}</strong> position. Our team will
                  review your results and get back to you soon.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
