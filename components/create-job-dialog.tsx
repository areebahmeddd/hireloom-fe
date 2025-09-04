"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Job } from "@/lib/jobs-context";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobCreate: (
    job: Omit<
      Job,
      | "id"
      | "createdAt"
      | "candidates"
      | "contacted"
      | "scheduled"
      | "status"
      | "statusColor"
      | "resumes"
      | "progress"
    >,
  ) => void;
  onJobUpdate?: (job: Job) => void;
  editJob?: Job; // Job to edit (if provided, dialog is in edit mode)
}

export function CreateJobDialog({
  open,
  onOpenChange,
  onJobCreate,
  onJobUpdate,
  editJob,
}: CreateJobDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
    skills: [] as string[],
    type: "Full-time",
    jobPortals: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");

  const jobPortals = [
    "LinkedIn Jobs",
    "Naukri.com",
    "Glassdoor",
    "FoundIt",
    "Google Jobs",
  ];

  const isEditMode = !!editJob;

  // Populate form data when editing
  useEffect(() => {
    if (editJob) {
      setFormData({
        title: editJob.title || "",
        location: editJob.location || "",
        salary: editJob.salary || "",
        description: editJob.description || "",
        skills: editJob.skills || [],
        type: editJob.type || "Full-time",
        jobPortals: editJob.jobPortals || [],
      });
    } else {
      resetForm();
    }
    setCurrentStep(1);
  }, [editJob, open]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.location ||
      !formData.salary ||
      !formData.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setCurrentStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && editJob && onJobUpdate) {
      // Update existing job
      const updatedJob = {
        ...editJob,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary: formData.salary,
        type: formData.type,
        skills: formData.skills,
        jobPortals: formData.jobPortals,
      };
      onJobUpdate(updatedJob);
    } else {
      // Create new job - only pass required fields
      const newJob = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary: formData.salary,
        type: formData.type,
        skills: formData.skills,
        jobPortals: formData.jobPortals,
      };
      onJobCreate(newJob);
    }

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      salary: "",
      description: "",
      skills: [],
      type: "Full-time",
      jobPortals: [],
    });
    setSkillInput("");
    setCurrentStep(1);
  };

  const toggleJobPortal = (portal: string) => {
    setFormData((prev) => ({
      ...prev,
      jobPortals: prev.jobPortals.includes(portal)
        ? prev.jobPortals.filter((p) => p !== portal)
        : [...prev.jobPortals, portal],
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Job" : "Create New Job"}
          </DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div
              className={`h-0.5 w-8 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {currentStep === 1 ? "Job Details" : "Job Portals"}
            </span>
          </div>
        </DialogHeader>

        {currentStep === 1 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Frontend Developer"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Mumbai, Maharashtra or Remote"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary/Stipend *</Label>
                <Input
                  id="salary"
                  placeholder="e.g. ₹12L - ₹18L or ₹50,000/month"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, salary: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  placeholder="Enter a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Next
              </Button>
            </DialogFooter>
          </form>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Job Portals</h3>
              <p className="text-sm text-muted-foreground">
                Choose which job portals you want to post this job to:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {jobPortals.map((portal) => (
                  <div
                    key={portal}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      formData.jobPortals.includes(portal)
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => toggleJobPortal(portal)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{portal}</span>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.jobPortals.includes(portal)
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {formData.jobPortals.includes(portal) && (
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.jobPortals.length > 0 && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Selected portals:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.jobPortals.map((portal) => (
                      <Badge key={portal} variant="secondary">
                        {portal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-primary hover:bg-primary/90"
                onClick={handleSubmit}
              >
                {isEditMode ? "Update Job" : "Create Job"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
