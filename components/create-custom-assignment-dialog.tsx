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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  X,
  FileText,
  Clock,
  Target,
  CheckCircle,
  Link,
  Lightbulb,
} from "lucide-react";
import { Question } from "@/lib/aptitude-test";
import { useToast } from "@/hooks/use-toast";

interface CreateCustomAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentCreated: (assignment: Question) => void;
  jobData?: {
    id: string;
    title: string;
    skills: string[];
  };
}

export function CreateCustomAssignmentDialog({
  open,
  onOpenChange,
  onAssignmentCreated,
  jobData,
}: CreateCustomAssignmentDialogProps) {
  const { toast } = useToast();
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    skill: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    timeLimit: 60, // in minutes
    requirements: [""],
    deliverables: [""],
    resources: [""],
    evaluationCriteria: [""],
  });

  const addListItem = (
    field: keyof typeof assignmentData,
    value: string = "",
  ) => {
    if (
      field === "requirements" ||
      field === "deliverables" ||
      field === "resources" ||
      field === "evaluationCriteria"
    ) {
      setAssignmentData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
    }
  };

  const removeListItem = (
    field: keyof typeof assignmentData,
    index: number,
  ) => {
    if (
      field === "requirements" ||
      field === "deliverables" ||
      field === "resources" ||
      field === "evaluationCriteria"
    ) {
      setAssignmentData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const updateListItem = (
    field: keyof typeof assignmentData,
    index: number,
    value: string,
  ) => {
    if (
      field === "requirements" ||
      field === "deliverables" ||
      field === "resources" ||
      field === "evaluationCriteria"
    ) {
      setAssignmentData((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === index ? value : item)),
      }));
    }
  };

  const handleCreateAssignment = () => {
    if (!assignmentData.title.trim() || !assignmentData.description.trim()) {
      toast({
        title: "❌ Missing Information",
        description: "Please provide both assignment title and description.",
        variant: "destructive",
      });
      return;
    }

    const assignment: Question = {
      id: `assignment_${Date.now()}`,
      type: "assignment",
      question: assignmentData.title,
      assignmentTitle: assignmentData.title,
      assignmentDescription: assignmentData.description,
      skill: assignmentData.skill || (jobData?.skills[0] ?? "General"),
      difficulty: assignmentData.difficulty,
      timeLimit: assignmentData.timeLimit,
      assignmentRequirements: assignmentData.requirements.filter(
        (req) => req.trim() !== "",
      ),
      deliverables: assignmentData.deliverables.filter(
        (del) => del.trim() !== "",
      ),
      resources: assignmentData.resources.filter((res) => res.trim() !== ""),
      evaluationCriteria: assignmentData.evaluationCriteria.filter(
        (crit) => crit.trim() !== "",
      ),
    };

    onAssignmentCreated(assignment);
    handleClose();

    toast({
      title: "✅ Custom Assignment Created!",
      description: `Assignment "${assignmentData.title}" has been created successfully.`,
    });
  };

  const handleClose = () => {
    setAssignmentData({
      title: "",
      description: "",
      skill: "",
      difficulty: "medium",
      timeLimit: 60,
      requirements: [""],
      deliverables: [""],
      resources: [""],
      evaluationCriteria: [""],
    });
    onOpenChange(false);
  };

  const ListSection = ({
    title,
    icon,
    field,
    placeholder,
    items,
  }: {
    title: string;
    icon: React.ReactNode;
    field: keyof typeof assignmentData;
    placeholder: string;
    items: string[];
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateListItem(field, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeListItem(field, index)}
              disabled={items.length === 1}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addListItem(field)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {title.slice(0, -1)}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create Custom Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    value={assignmentData.title}
                    onChange={(e) =>
                      setAssignmentData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g., Build a React Todo App"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill">Primary Skill</Label>
                  <Select
                    value={assignmentData.skill}
                    onValueChange={(value) =>
                      setAssignmentData((prev) => ({ ...prev, skill: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobData?.skills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={assignmentData.difficulty}
                    onValueChange={(value: "easy" | "medium" | "hard") =>
                      setAssignmentData((prev) => ({
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
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={assignmentData.timeLimit}
                    onChange={(e) =>
                      setAssignmentData((prev) => ({
                        ...prev,
                        timeLimit: parseInt(e.target.value) || 60,
                      }))
                    }
                    min={15}
                    max={480}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Assignment Description *</Label>
                <Textarea
                  id="description"
                  value={assignmentData.description}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Provide a detailed description of what the candidate needs to do..."
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Assignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ListSection
              title="Requirements"
              icon={<CheckCircle className="w-4 h-4" />}
              field="requirements"
              placeholder="e.g., Use React hooks"
              items={assignmentData.requirements}
            />

            <ListSection
              title="Deliverables"
              icon={<Target className="w-4 h-4" />}
              field="deliverables"
              placeholder="e.g., Working application with source code"
              items={assignmentData.deliverables}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ListSection
              title="Resources"
              icon={<Link className="w-4 h-4" />}
              field="resources"
              placeholder="e.g., https://docs.example.com"
              items={assignmentData.resources}
            />

            <ListSection
              title="Evaluation Criteria"
              icon={<Lightbulb className="w-4 h-4" />}
              field="evaluationCriteria"
              placeholder="e.g., Code quality and functionality"
              items={assignmentData.evaluationCriteria}
            />
          </div>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Assignment Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    {assignmentData.title || "Assignment Title"}
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {assignmentData.skill || "General"}
                    </Badge>
                    <Badge variant="secondary">
                      {assignmentData.difficulty}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      {assignmentData.timeLimit}m
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {assignmentData.description ||
                    "Assignment description will appear here..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateAssignment}>Create Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
