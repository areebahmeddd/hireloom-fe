'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { CandidateTable } from '@/components/candidate-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download } from 'lucide-react';

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            All Candidates
          </h1>
          <p className="text-slate-600">
            Manage and track all candidates across all job postings
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 gap-6">
          {/* Left side: Search bar + filters */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search candidates..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-48 flex-shrink-0">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="backend">Backend Developer</SelectItem>
                <SelectItem value="designer">Product Designer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 flex-shrink-0">
                <SelectValue placeholder="Contact status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-contacted">Not Contacted</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex-shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Right side: Export button */}
          <Button variant="outline" className="flex-shrink-0">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Candidate Table */}
        <CandidateTable 
          showAllJobs 
          searchTerm={searchTerm}
          jobFilter={jobFilter}
          statusFilter={statusFilter}
        />
      </main>
    </div>
  );
}