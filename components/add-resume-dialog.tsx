"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Job {
  id: number;
  title: string;
  description: string;
}

interface AddResumeDialogProps {
  job: Job;
  trigger?: React.ReactNode;
  onUploadSuccess?: () => void;
}

export function AddResumeDialog({
  job,
  trigger,
  onUploadSuccess,
}: AddResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setUploadStatus("idle");
        setErrorMessage("");
      } else {
        setErrorMessage("Please select a PDF file");
        setUploadStatus("error");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first");
      setUploadStatus("error");
      return;
    }

    setUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("pdf_file", selectedFile);
      formData.append("job_title", job.title);
      formData.append("job_description", job.description);
      formData.append("applied_jobs", `[${job.id}]`);

      const response = await fetch(
        "http://localhost:8000/api/v1/api/pdf-analysis/analyze-simple",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setUploadStatus("success");

      // Trigger refresh to show new candidate
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedFile(null);
        setUploadStatus("idle");
        setOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setUploading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Add Resume
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Upload a resume for the <strong>{job.title}</strong> position
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Job Info */}
          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-slate-900 mb-2">{job.title}</h4>
              <p
                className="text-sm text-slate-600 overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume-file">Resume</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="resume-file"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="resume-file"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FileText className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to select PDF file"}
                </span>
              </label>
            </div>
          </div>

          {/* Status Messages */}
          {uploadStatus === "success" && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">
                Resume uploaded and analyzed successfully!
              </span>
            </div>
          )}

          {uploadStatus === "error" && errorMessage && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={
                !selectedFile || uploading || uploadStatus === "success"
              }
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : uploadStatus === "success" ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Uploaded
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
