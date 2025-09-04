import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    console.log("📧 Custom Email API called");

    const { to, subject, message, candidateName, jobTitle } = await req.json();

    console.log("📋 Email request data:", {
      to,
      subject,
      candidateName,
      jobTitle,
      messageLength: message?.length,
    });

    console.log("🔑 Email config:", {
      user: process.env.EMAIL_USER,
      passLength: process.env.EMAIL_PASS?.length,
    });

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📤 Transporter created");

    // Create email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              background: #065f46; 
              color: white; 
              padding: 20px; 
              text-align: center; 
              border-radius: 8px 8px 0 0; 
            }
            .content { 
              background: #f9f9f9; 
              padding: 30px; 
              border-radius: 0 0 8px 8px; 
              white-space: pre-wrap;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              color: #666; 
              font-size: 14px; 
            }
            .company-info {
              margin-top: 20px;
              padding: 15px;
              background: #e5e7eb;
              border-radius: 8px;
              border-left: 4px solid #065f46;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>💼 Hireloom</h1>
            <p>Professional Communication</p>
          </div>
          
          <div class="content">
            ${message}
          </div>
          
          <div class="company-info">
            <p><strong>Hireloom Hiring Team</strong></p>
            <p>Email: ${process.env.EMAIL_USER}</p>
            <p>This email was sent regarding the ${jobTitle || "position"} role.</p>
          </div>
          
          <div class="footer">
            <p>This email was sent from the Hireloom recruitment platform.</p>
            <p>If you have any questions, please reply to this email.</p>
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
      text: message, // Plain text fallback
    };

    console.log("📧 Preparing to send email...");
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

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
