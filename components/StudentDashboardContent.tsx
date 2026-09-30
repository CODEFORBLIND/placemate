import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, MapPin, ChevronDown } from "lucide-react";

export default function StudentDashboardContent() {
  const jobs = [
    { id: 1, logo: "VE", color: "bg-indigo-500", role: "Frontend Engineer", company: "Vercel", type: "Full-time", location: "Remote", ctc: "24.0 LPA", deadline: "Nov 12, 2025", daysLeft: 2, urgency: "danger" },
    { id: 2, logo: "NI", color: "bg-cyan-500", role: "Machine Learning Engineer", company: "Nimbus AI", type: "Full-time", location: "Bangalore", ctc: "32.5 LPA", deadline: "Nov 20, 2025", daysLeft: 10, urgency: "normal" },
    { id: 3, logo: "CO", color: "bg-emerald-500", role: "Backend Developer", company: "Corewave", type: "Full-time", location: "Hyderabad", ctc: "18.0 LPA", deadline: "Nov 14, 2025", daysLeft: 4, urgency: "warning" },
    { id: 4, logo: "LU", color: "bg-amber-500", role: "Product Design Intern", company: "Lumen Labs", type: "Internship", location: "Remote", ctc: "9.0 LPA", deadline: "Nov 11, 2025", daysLeft: 1, urgency: "danger" },
    { id: 5, logo: "QU", color: "bg-pink-500", role: "Data Analyst", company: "Quantel", type: "Full-time", location: "Pune", ctc: "14.5 LPA", deadline: "Nov 25, 2025", daysLeft: 15, urgency: "normal" },
    { id: 6, logo: "ST", color: "bg-purple-500", role: "DevOps Engineer", company: "Stratus Cloud", type: "Full-time", location: "Remote", ctc: "21.0 LPA", deadline: "Nov 16, 2025", daysLeft: 6, urgency: "warning" },
  ];

  const getUrgencyBadge = (days: number, type: string) => {
    if (type === 'danger') return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (type === 'warning') return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-[#232935] text-[#8B93A7] border-transparent";
  };

  return (
    <div className="animate-in fade-in duration-300 w-full max-w-7xl mx-auto">
      <Tabs defaultValue="jobs" className="w-full">
        
        {/* TABS HEADER */}
        <div className="border-b border-[#232935] mb-6">
          <TabsList className="bg-transparent p-0 h-12 w-full justify-start gap-8">
            <TabsTrigger 
              value="jobs" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E6E9EF] data-[state=active]:text-[#E6E9EF] text-[#8B93A7] rounded-none px-0 h-12 font-medium"
            >
              Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="applied" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E6E9EF] data-[state=active]:text-[#E6E9EF] text-[#8B93A7] rounded-none px-0 h-12 font-medium flex items-center gap-2"
            >
              Applied
              <Badge className="bg-[#232935] text-[#8B93A7] hover:bg-[#232935] px-1.5 py-0 text-[10px] rounded-full">3</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="jobs" className="space-y-6 outline-none">
          {/* FILTER BAR */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B93A7]" />
              <Input 
                placeholder="Search roles, companies..." 
                className="w-full pl-9 bg-[#131720] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1] h-10"
              />
            </div>
            <Button variant="outline" className="bg-[#131720] border-[#232935] text-[#8B93A7] hover:bg-[#1B212C] hover:text-[#E6E9EF] h-10 px-4 justify-between w-32 font-normal">
              Course <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
            </Button>
            <Button variant="outline" className="bg-[#131720] border-[#232935] text-[#8B93A7] hover:bg-[#1B212C] hover:text-[#E6E9EF] h-10 px-4 justify-between w-40 font-normal">
              CTC Range <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </div>

          {/* JOBS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="bg-[#131720] border-[#232935] shadow-none flex flex-col hover:border-[#6366F1]/50 transition-colors">
                <CardHeader className="p-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${job.color} flex items-center justify-center text-white font-semibold text-sm`}>
                        {job.logo}
                      </div>
                      <div>
                        <CardTitle className="text-[#E6E9EF] text-base font-semibold">{job.role}</CardTitle>
                        <p className="text-[#8B93A7] text-sm mt-0.5">{job.company}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-[#0B0E14] border-[#232935] text-[#8B93A7] font-normal text-[10px] px-2 py-0">
                      {job.type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-5 pt-0 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[#8B93A7] text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </div>
                    <div className="flex items-center font-mono">
                      ₹ {job.ctc}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-[#232935] my-2"></div>
                  
                  <div className="flex items-end justify-between mt-4 mb-5">
                    <div>
                      <p className="text-[#8B93A7] text-[10px] uppercase tracking-wider mb-1">Deadline</p>
                      <p className="text-[#E6E9EF] text-sm font-mono">{job.deadline}</p>
                    </div>
                    <Badge variant="outline" className={`font-normal text-[10px] px-2 py-0.5 ${getUrgencyBadge(job.daysLeft, job.urgency)}`}>
                      {job.daysLeft} {job.daysLeft === 1 ? 'day' : 'days'} left
                    </Badge>
                  </div>

                  <Button className="w-full bg-[#6366F1] hover:bg-indigo-500 text-white mt-auto">
                    Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applied" className="outline-none">
          <div className="text-center py-20">
            <p className="text-[#8B93A7]">Application history will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}