'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Star, ExternalLink, Github, Linkedin, Mail, Phone, Calendar, MessageSquare, Code, Brain } from 'lucide-react';
import { CreateAptitudeTestDialog } from './create-aptitude-test-dialog';

interface Candidate {
  id: number;
  name: string;
  score: number;
  skills: string[];
  contactStatus: string;
  statusColor: string;
  experience: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  leetcode?: string;
  notes: string;
  avatar: string;
  job: string;
  jobId: number;
}

const allCandidates: Candidate[] = [
  // Frontend Developer candidates (jobId: 1)
  {
    id: 1,
    name: 'Priya Sharma',
    score: 92,
    skills: ['React', 'TypeScript', 'Next.js'],
    contactStatus: 'Scheduled',
    statusColor: 'bg-green-100 text-green-700',
    experience: '5 years',
    location: 'Bangalore, Karnataka',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/priyasharma',
    github: 'github.com/priyasharma',
    leetcode: 'leetcode.com/priyasharma',
    notes: 'Strong React background, excellent communication skills',
    avatar: 'PS',
    job: 'Frontend Developer',
    jobId: 1,
  },
  {
    id: 2,
    name: 'Rohit Patel',
    score: 89,
    skills: ['Vue.js', 'JavaScript', 'CSS'],
    contactStatus: 'Contacted',
    statusColor: 'bg-blue-100 text-blue-700',
    experience: '4 years',
    location: 'Mumbai, Maharashtra',
    email: 'rohit.patel@email.com',
    phone: '+91 98765 43211',
    linkedin: 'linkedin.com/in/rohitpatel',
    github: 'github.com/rohitpatel',
    leetcode: 'leetcode.com/rohitpatel',
    notes: 'Creative frontend developer with strong design sense',
    avatar: 'RP',
    job: 'Frontend Developer',
    jobId: 1,
  },
  {
    id: 3,
    name: 'Ryan Martinez',
    score: 87,
    skills: ['React', 'Redux', 'Webpack'],
    contactStatus: 'Not Contacted',
    statusColor: 'bg-slate-100 text-slate-700',
    experience: '6 years',
    location: 'Chicago, IL',
    email: 'ryan@email.com',
    phone: '+1 (555) 345-6789',
    linkedin: 'linkedin.com/in/ryanmartinez',
    github: 'github.com/ryanmartinez',
    leetcode: 'leetcode.com/ryanmartinez',
    notes: 'Senior frontend developer with team leadership experience',
    avatar: 'RM',
    job: 'Frontend Developer',
    jobId: 1,
  },
  // Backend Developer candidates (jobId: 2)
  {
    id: 4,
    name: 'Bob Chen',
    score: 94,
    skills: ['Node.js', 'PostgreSQL', 'AWS'],
    contactStatus: 'Interviewed',
    statusColor: 'bg-purple-100 text-purple-700',
    experience: '7 years',
    location: 'New York, NY',
    email: 'bob@email.com',
    phone: '+1 (555) 456-7890',
    linkedin: 'linkedin.com/in/bobchen',
    github: 'github.com/bobchen',
    leetcode: 'leetcode.com/bobchen',
    notes: 'Extensive backend experience, AWS certified',
    avatar: 'BC',
    job: 'Backend Developer',
    jobId: 2,
  },
  {
    id: 5,
    name: 'Sarah Kim',
    score: 91,
    skills: ['Python', 'Django', 'Redis'],
    contactStatus: 'Contacted',
    statusColor: 'bg-blue-100 text-blue-700',
    experience: '5 years',
    location: 'Seattle, WA',
    email: 'sarah@email.com',
    phone: '+1 (555) 567-8901',
    linkedin: 'linkedin.com/in/sarahkim',
    github: 'github.com/sarahkim',
    leetcode: 'leetcode.com/sarahkim',
    notes: 'Python expert with microservices architecture experience',
    avatar: 'SK',
    job: 'Backend Developer',
    jobId: 2,
  },
  {
    id: 6,
    name: 'Michael Brown',
    score: 88,
    skills: ['Java', 'Spring Boot', 'MongoDB'],
    contactStatus: 'Scheduled',
    statusColor: 'bg-green-100 text-green-700',
    experience: '8 years',
    location: 'Austin, TX',
    email: 'michael@email.com',
    phone: '+1 (555) 678-9012',
    linkedin: 'linkedin.com/in/michaelbrown',
    github: 'github.com/michaelbrown',
    leetcode: 'leetcode.com/michaelbrown',
    notes: 'Senior Java developer with enterprise application experience',
    avatar: 'MB',
    job: 'Backend Developer',
    jobId: 2,
  },
  // Product Designer candidates (jobId: 3)
  {
    id: 7,
    name: 'Carol Smith',
    score: 95,
    skills: ['Figma', 'User Research', 'Design Systems'],
    contactStatus: 'Scheduled',
    statusColor: 'bg-green-100 text-green-700',
    experience: '4 years',
    location: 'Austin, TX',
    email: 'carol@email.com',
    phone: '+1 (555) 789-0123',
    linkedin: 'linkedin.com/in/carolsmith',
    github: 'github.com/carolsmith',
    leetcode: 'leetcode.com/carolsmith',
    notes: 'Award-winning designer, strong portfolio',
    avatar: 'CS',
    job: 'Product Designer',
    jobId: 3,
  },
  {
    id: 8,
    name: 'Jessica Wong',
    score: 92,
    skills: ['Sketch', 'Prototyping', 'User Testing'],
    contactStatus: 'Contacted',
    statusColor: 'bg-blue-100 text-blue-700',
    experience: '6 years',
    location: 'San Francisco, CA',
    email: 'jessica@email.com',
    phone: '+1 (555) 890-1234',
    linkedin: 'linkedin.com/in/jessicawong',
    github: 'github.com/jessicawong',
    leetcode: 'leetcode.com/jessicawong',
    notes: 'UX/UI specialist with extensive user research background',
    avatar: 'JW',
    job: 'Product Designer',
    jobId: 3,
  },
];

interface CandidateTableProps {
  jobId?: number;
  showAllJobs?: boolean;
  searchTerm?: string;
  jobFilter?: string;
  statusFilter?: string;
}

export function CandidateTable({ 
  jobId, 
  showAllJobs = false, 
  searchTerm = '', 
  jobFilter = 'all', 
  statusFilter = 'all' 
}: CandidateTableProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sortBy, setSortBy] = useState<string>('score');
  const [showAptitudeTestDialog, setShowAptitudeTestDialog] = useState(false);
  const [testCandidate, setTestCandidate] = useState<Candidate | null>(null);

  // Mock job data - in real app, this would come from props or API
  const jobData = {
    id: jobId?.toString() || '1',
    title: 'Frontend Developer', // This should come from actual job data
    description: 'We are looking for an experienced Frontend Developer to join our team...',
    skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'JavaScript'],
  };

  const handleSendAptitudeTest = (candidate: Candidate) => {
    setTestCandidate(candidate);
    setShowAptitudeTestDialog(true);
  };

  // Filter candidates based on multiple criteria
  let filteredCandidates = jobId 
    ? allCandidates.filter(candidate => candidate.jobId === jobId)
    : allCandidates;

  // Apply search filter
  if (searchTerm) {
    filteredCandidates = filteredCandidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      candidate.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply job filter
  if (jobFilter !== 'all') {
    const jobMapping: { [key: string]: string } = {
      'frontend': 'Frontend Developer',
      'backend': 'Backend Developer',
      'designer': 'Product Designer'
    };
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.job === jobMapping[jobFilter]
    );
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    const statusMapping: { [key: string]: string } = {
      'not-contacted': 'Not Contacted',
      'contacted': 'Contacted',
      'scheduled': 'Scheduled',
      'interviewed': 'Interviewed'
    };
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.contactStatus === statusMapping[statusFilter]
    );
  }

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {showAllJobs ? 'All Candidates' : 'Job Candidates'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th 
                    className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                    onClick={() => setSortBy('name')}
                  >
                    Name
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                    onClick={() => setSortBy('score')}
                  >
                    Score
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Skills
                  </th>
                  {showAllJobs && (
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Job
                    </th>
                  )}
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Contact Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCandidates.map((candidate) => (
                  <tr 
                    key={candidate.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {candidate.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{candidate.name}</p>
                          <p className="text-sm text-slate-500">{candidate.experience} experience</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-slate-900">
                          {candidate.score}
                        </span>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    {showAllJobs && (
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">{candidate.job}</span>
                      </td>
                    )}
                    <td className="py-4 px-4">
                      <Badge className={candidate.statusColor}>
                        {candidate.contactStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendAptitudeTest(candidate);
                          }}
                          title="Send Aptitude Test"
                        >
                          <Brain className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Profile Drawer */}
      <Sheet open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          {selectedCandidate && (
            <>
              <SheetHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                      {selectedCandidate.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">{selectedCandidate.name}</SheetTitle>
                    <SheetDescription className="text-slate-600">
                      {selectedCandidate.job} • {selectedCandidate.location}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Score and Quick Info */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="text-2xl font-bold text-slate-900">
                          {selectedCandidate.score}
                        </span>
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                      <p className="text-sm text-slate-600">Match Score</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-slate-900 mb-1">
                        {selectedCandidate.experience.split(' ')[0]}
                      </p>
                      <p className="text-sm text-slate-600">Years Exp</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Badge className={selectedCandidate.statusColor}>
                        {selectedCandidate.contactStatus}
                      </Badge>
                      <p className="text-sm text-slate-600 mt-1">Status</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">{selectedCandidate.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">{selectedCandidate.phone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Links */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Links</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                      LinkedIn Profile
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub Profile
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Button>
                    {selectedCandidate.leetcode && (
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="w-4 h-4 mr-2 text-orange-600" />
                        LeetCode Profile
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                    )}
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Resume
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Summary */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Summary</h3>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                    {selectedCandidate.notes}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Conversation
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Aptitude Test Dialog */}
      <CreateAptitudeTestDialog
        open={showAptitudeTestDialog}
        onOpenChange={setShowAptitudeTestDialog}
        jobData={jobData}
        candidate={testCandidate ? {
          id: testCandidate.id.toString(),
          name: testCandidate.name,
          email: testCandidate.email,
        } : undefined}
      />
    </>
  );
}