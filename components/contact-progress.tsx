"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, CheckCircle, AlertCircle, Calendar, Mail } from "lucide-react";

interface Job {
  id: number;
  title: string;
  contacted: number;
  scheduled: number;
}

interface ContactProgressProps {
  job: Job;
}

const contactActivities = [
  {
    id: 1,
    candidate: "Alice Johnson",
    avatar: "AJ",
    action: "Initial contact sent",
    status: "Responded",
    timestamp: "2 hours ago",
    statusColor: "bg-green-100 text-green-700",
    icon: Mail,
  },
  {
    id: 2,
    candidate: "Bob Chen",
    avatar: "BC",
    action: "Follow-up message",
    status: "Pending",
    timestamp: "4 hours ago",
    statusColor: "bg-orange-100 text-orange-700",
    icon: Clock,
  },
  {
    id: 3,
    candidate: "Carol Smith",
    avatar: "CS",
    action: "Interview scheduled",
    status: "Confirmed",
    timestamp: "1 day ago",
    statusColor: "bg-blue-100 text-blue-700",
    icon: Calendar,
  },
  {
    id: 4,
    candidate: "David Wilson",
    avatar: "DW",
    action: "Initial contact sent",
    status: "No response",
    timestamp: "3 days ago",
    statusColor: "bg-slate-100 text-slate-700",
    icon: AlertCircle,
  },
];

export function ContactProgress({ job }: ContactProgressProps) {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Contacted</p>
                <p className="text-xl font-bold text-slate-900">
                  {job.contacted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Responded</p>
                <p className="text-xl font-bold text-slate-900">6</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Scheduled</p>
                <p className="text-xl font-bold text-slate-900">
                  {job.scheduled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contact Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">
                      {activity.candidate}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <activity.icon className="w-3 h-3 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        {activity.action}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <Badge className={activity.statusColor}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewActivity(activity)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Activity Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Activity Details</DialogTitle>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-6">
              {/* Candidate Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {selectedActivity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedActivity.candidate}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {job.title} Candidate
                  </p>
                </div>
              </div>

              {/* Activity Details */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Activity</h4>
                  <Badge className={selectedActivity.statusColor}>
                    {selectedActivity.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      Action:
                    </span>
                    <p className="text-sm text-slate-600">
                      {selectedActivity.action}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      Time:
                    </span>
                    <p className="text-sm text-slate-600">
                      {selectedActivity.timestamp}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      Status:
                    </span>
                    <p className="text-sm text-slate-600">
                      {selectedActivity.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mock Additional Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Contact History</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email sent:</span>
                    <span>✓ Delivered</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email opened:</span>
                    <span>
                      {selectedActivity.status === "Responded"
                        ? "✓ Yes"
                        : "✗ No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Links clicked:</span>
                    <span>
                      {selectedActivity.status === "Responded" ? "2" : "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button size="sm">Send Follow-up</Button>
                <Button variant="outline" size="sm">
                  Schedule Interview
                </Button>
                <Button variant="ghost" size="sm">
                  Mark as No Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
