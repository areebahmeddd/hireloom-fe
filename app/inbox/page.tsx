"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Calendar, Send, Archive, Phone, Video, Clock } from "lucide-react";

const conversations = [
  {
    id: 1,
    candidate: "Aarti Mehta",
    job: "Frontend Developer",
    status: "Active",
    lastMessage: "Great! Available Tue 4PM.",
    timestamp: "2 min ago",
    unread: true,
    avatar: "AM",
  },
  {
    id: 2,
    candidate: "Sneha Jain",
    job: "Backend Developer",
    status: "Scheduled",
    lastMessage: "Looking forward to our meeting!",
    timestamp: "1 hour ago",
    unread: false,
    avatar: "SJ",
  },
  {
    id: 3,
    candidate: "Pooja Sharma",
    job: "Product Designer",
    status: "Interviewed",
    lastMessage: "Thank you for the interview!",
    timestamp: "1 day ago",
    unread: false,
    avatar: "PS",
  },
];

const messages = [
  {
    id: 1,
    sender: "ai",
    content:
      "Hi Aarti! I came across your profile and was impressed by your React and TypeScript experience. We have an exciting Frontend Developer position at our company that might be a great fit for you.",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    sender: "candidate",
    content:
      "Hey, thanks for reaching out! I'd love to learn more about the role. What kind of projects would I be working on?",
    timestamp: "11:15 AM",
  },
  {
    id: 3,
    sender: "ai",
    content:
      "Great question! You'd be working on our main product dashboard using Next.js and TypeScript. We're building innovative features for data visualization and user experience. The team is collaborative and values clean code and user-centered design.",
    timestamp: "11:20 AM",
  },
  {
    id: 4,
    sender: "candidate",
    content:
      "That sounds really interesting! I have 5 years of experience with React and have been working extensively with Next.js for the past 2 years. I'd love to schedule a time to chat more about this opportunity.",
    timestamp: "2:45 PM",
  },
  {
    id: 5,
    sender: "ai",
    content:
      "Perfect! I'd love to schedule a call with our engineering team. Are you available this Tuesday at 4 PM? I can send you a calendar invite with all the details.",
    timestamp: "3:00 PM",
  },
  {
    id: 6,
    sender: "candidate",
    content: "Great! Available Tue 4PM.",
    timestamp: "3:05 PM",
  },
];

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0],
  );
  const [messageInput, setMessageInput] = useState("");

  const handleMakeCall = async () => {
    try {
      const response = await fetch("http://localhost:8000/make_call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to make call: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error making call:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Conversations */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Conversations
            </h2>
            <div className="relative">
              <Input placeholder="Search conversations..." className="pl-3" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                  selectedConversation.id === conversation.id
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-slate-200 text-slate-700">
                      {conversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-slate-900 truncate">
                        {conversation.candidate}
                      </h3>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-1">
                      {conversation.job}
                    </p>
                    <p className="text-sm text-slate-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {conversation.timestamp}
                      </span>
                      <Badge
                        variant={
                          conversation.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {conversation.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-slate-200 text-slate-700">
                    {selectedConversation.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {selectedConversation.candidate}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {selectedConversation.job}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Send Offer
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.sender === "ai"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  } rounded-lg p-3`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === "ai"
                        ? "text-muted-foreground"
                        : "text-primary-foreground/70"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="flex justify-center">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-2">
                  Quick Actions
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={handleMakeCall}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Video className="w-3 h-3 mr-1" />
                    Video Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center space-x-3">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    // Handle send message
                    setMessageInput("");
                  }
                }}
              />
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
