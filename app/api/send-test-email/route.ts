import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, testId, jobTitle, candidateName, questions } =
      await req.json();

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate test URL
    const testUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/take-test/${testId}?candidate=${encodeURIComponent(to)}`;

    // Create email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Aptitude Test Invitation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #065f46; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #065f46; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .questions { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #065f46; }
            .question { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
            .question:last-child { border-bottom: none; }
            .question-title { font-weight: bold; color: #065f46; margin-bottom: 5px; }
            .question-text { margin-bottom: 10px; }
            .question-meta { font-size: 12px; color: #666; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧠 Aptitude Test Invitation</h1>
              <p>You've been invited to take an aptitude test</p>
            </div>
            
            <div class="content">
              <h2>Hello ${candidateName || "Candidate"},</h2>
              
              <p>You have been invited to take an aptitude test for the <strong>${jobTitle}</strong> position.</p>
              
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>Number of Questions: ${questions.length}</li>
                <li>Estimated Duration: ${Math.max(...questions.map((q: any) => q.timeLimit || 5))} minutes per question</li>
                <li>Difficulty: Mixed levels</li>
              </ul>

              <div class="questions">
                <h3>📝 Preview of Questions:</h3>
                ${questions
                  .slice(0, 3)
                  .map(
                    (question: any, index: number) => `
                  <div class="question">
                    <div class="question-title">${index + 1}. ${question.type.replace("_", " ").toUpperCase()} - ${question.skill}</div>
                    <div class="question-text">${question.question}</div>
                    <div class="question-meta">Time: ${question.timeLimit || 5} minutes | Difficulty: ${question.difficulty}</div>
                  </div>
                `,
                  )
                  .join("")}
                ${questions.length > 3 ? `<p><em>...and ${questions.length - 3} more questions</em></p>` : ""}
              </div>
              
              <p><strong>Instructions:</strong></p>
              <ul>
                <li>Click the button below to start the test</li>
                <li>Make sure you have a stable internet connection</li>
                <li>You cannot pause or go back once started</li>
                <li>Answer all questions to the best of your ability</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${testUrl}" class="button">🚀 Start Test</a>
              </div>
              
              <p><em>This link is unique to you and should not be shared with others.</em></p>
            </div>
            
            <div class="footer">
              <p>Best of luck with your test!</p>
              <p>If you have any technical issues, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: `"Hireloom Hiring Team" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
