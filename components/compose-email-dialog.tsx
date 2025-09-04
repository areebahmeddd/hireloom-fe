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
import { Send, User, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComposeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate?: {
    id: string;
    name: string;
    email: string;
  };
  jobTitle?: string;
}

export function ComposeEmailDialog({
  open,
  onOpenChange,
  candidate,
  jobTitle,
}: ComposeEmailDialogProps) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState({
    to: candidate?.email || "",
    subject: `Regarding ${jobTitle || "Position"} - Follow up`,
    message: `Hi ${candidate?.name || "there"},

I hope this message finds you well. I wanted to reach out regarding your application for the ${jobTitle || "position"} role.

We were impressed with your background and would like to discuss next steps in the process.

Please let me know your availability for a brief conversation this week.

Best regards,
Hiring Team`,
  });

  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      toast({
        title: "❌ Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      console.log("📧 Sending custom email...");

      const response = await fetch("/api/send-custom-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          candidateName: candidate?.name,
          jobTitle: jobTitle,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to send email: ${response.status} - ${errorText}`,
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to send email");
      }

      toast({
        title: "✅ Email sent successfully!",
        description: `Your message was sent to ${candidate?.name || emailData.to}`,
      });

      // Reset and close dialog
      onOpenChange(false);
      setEmailData({
        to: candidate?.email || "",
        subject: `Regarding ${jobTitle || "Position"} - Follow up`,
        message: `Hi ${candidate?.name || "there"},

I hope this message finds you well. I wanted to reach out regarding your application for the ${jobTitle || "position"} role.

We were impressed with your background and would like to discuss next steps in the process.

Please let me know your availability for a brief conversation this week.

Best regards,
Hiring Team`,
      });
    } catch (error) {
      console.error("❌ Error sending email:", error);
      toast({
        title: "❌ Failed to send email",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Candidate Info */}
          {candidate && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{candidate.name}</p>
                <p className="text-sm text-muted-foreground">
                  {candidate.email}
                </p>
              </div>
            </div>
          )}

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="email"
                value={emailData.to}
                onChange={(e) =>
                  setEmailData({ ...emailData, to: e.target.value })
                }
                placeholder="recipient@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                placeholder="Email subject"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailData.message}
                onChange={(e) =>
                  setEmailData({ ...emailData, message: e.target.value })
                }
                placeholder="Write your message here..."
                className="min-h-[200px]"
                required
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending}
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
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
