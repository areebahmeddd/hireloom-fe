// AI Question Generation Service using OpenAI-compatible API

export interface Question {
  id: string;
  type:
    | "multiple_choice"
    | "short_answer"
    | "coding"
    | "scenario"
    | "assignment";
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string | number; // For multiple choice (index) or short answer
  difficulty: "easy" | "medium" | "hard";
  skill: string;
  timeLimit?: number; // in minutes
  // Custom assignment fields
  assignmentTitle?: string; // For assignment type
  assignmentDescription?: string; // Detailed assignment instructions
  assignmentRequirements?: string[]; // List of requirements
  deliverables?: string[]; // Expected deliverables
  resources?: string[]; // Links or resources provided
  evaluationCriteria?: string[]; // How the assignment will be evaluated
}

export interface AptitudeTest {
  id: string;
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  questions: Question[];
  duration: number; // in minutes
  passingScore: number;
  createdAt: Date;
  createdBy: string;
}

export interface TestResponse {
  id: string;
  testId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  answers: { questionId: string; answer: string | number }[];
  score: number;
  percentage: number;
  status: "pending" | "completed" | "expired";
  startedAt?: Date;
  completedAt?: Date;
  timeSpent?: number; // in minutes
}

// Simulated AI question generation (replace with actual OpenAI API call)
export const generateQuestionsFromJobDescription = async (
  jobTitle: string,
  jobDescription: string,
  skills: string[],
  difficulty: "easy" | "medium" | "hard" = "medium",
  questionCount: number = 10,
): Promise<Question[]> => {
  // In a real implementation, this would call OpenAI API
  // For now, we'll return mock questions based on the job

  const mockQuestions: Question[] = [];

  // Generate questions based on skills
  const timestamp = Date.now();

  skills.forEach((skill, index) => {
    if (mockQuestions.length < questionCount) {
      // Technical multiple choice question
      mockQuestions.push({
        id: `q${timestamp}-${index + 1}`,
        type: "multiple_choice",
        question: `What is the primary advantage of using ${skill} in modern web development?`,
        options: [
          `${skill} provides better performance optimization`,
          `${skill} has a smaller learning curve`,
          `${skill} is only suitable for small projects`,
          `${skill} doesn't require any configuration`,
        ],
        correctAnswer: 0,
        difficulty,
        skill,
        timeLimit: 3,
      });
    }

    if (mockQuestions.length < questionCount) {
      // Scenario-based question
      mockQuestions.push({
        id: `q${timestamp}-${index + 2}`,
        type: "scenario",
        question: `You're working on a project that requires ${skill}. Describe how you would approach implementing a complex feature that needs to scale for 100,000+ users.`,
        difficulty,
        skill,
        timeLimit: 10,
      });
    }
  });

  // Add general questions based on job title
  if (
    jobTitle.toLowerCase().includes("developer") ||
    jobTitle.toLowerCase().includes("engineer")
  ) {
    mockQuestions.push({
      id: `general-${timestamp}-1`,
      type: "multiple_choice",
      question: "What is the most important principle in software development?",
      options: [
        "Writing code as fast as possible",
        "Creating maintainable and readable code",
        "Using the latest technologies",
        "Working alone without team input",
      ],
      correctAnswer: 1,
      difficulty: "easy",
      skill: "General Programming",
      timeLimit: 2,
    });
  }

  return mockQuestions.slice(0, questionCount);
};

// Calculate test score
export const calculateTestScore = (
  test: AptitudeTest,
  responses: { questionId: string; answer: string | number }[],
): { score: number; percentage: number; breakdown: any[] } => {
  let correctAnswers = 0;
  const breakdown: any[] = [];

  test.questions.forEach((question) => {
    const response = responses.find((r) => r.questionId === question.id);
    const isCorrect =
      response &&
      (question.type === "multiple_choice"
        ? response.answer === question.correctAnswer
        : true); // For open-ended questions, manual review needed

    if (isCorrect) correctAnswers++;

    breakdown.push({
      questionId: question.id,
      question: question.question,
      userAnswer: response?.answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      skill: question.skill,
    });
  });

  const percentage = Math.round((correctAnswers / test.questions.length) * 100);

  return {
    score: correctAnswers,
    percentage,
    breakdown,
  };
};

// Send test to candidate via email
export const sendTestToCandidate = async (
  test: AptitudeTest,
  candidateEmail: string,
  candidateName: string,
): Promise<string> => {
  try {
    const testLink = `${window.location.origin}/take-test/${test.id}?candidate=${encodeURIComponent(candidateEmail)}`;

    // Send email using our API
    const response = await fetch("/api/send-test-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: candidateEmail,
        subject: `Aptitude Test Invitation - ${test.jobTitle} Position`,
        testId: test.id,
        jobTitle: test.jobTitle,
        candidateName: candidateName,
        questions: test.questions,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API response error:", errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to send email");
    }

    return testLink;
  } catch (error) {
    console.error("Error sending test email:", error);
    throw new Error("Failed to send test invitation email");
  }
};
