import React from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronsUpDown } from "lucide-react";

export default function PCMemberContent() {
  const students = [
    { name: "Aarav Sharma", initials: "AS", color: "bg-indigo-500", course: "B.Tech CSE", roll: "21CS1042", score: 92, category: "Best", status: "Placed" },
    { name: "Diya Patel", initials: "DP", color: "bg-cyan-500", course: "B.Tech ECE", roll: "21EC2087", score: 74, category: "Average", status: "Active" },
    { name: "Kabir Nair", initials: "KN", color: "bg-emerald-500", course: "B.Tech IT", roll: "21IT3311", score: 48, category: "Poor", status: "Pending" },
    { name: "Ishita Rao", initials: "IR", color: "bg-amber-500", course: "B.Tech CSE", roll: "21CS1188", score: 88, category: "Best", status: "Active" },
    { name: "Rohan Mehta", initials: "RM", color: "bg-pink-500", course: "MCA", roll: "22MC0455", score: null, category: "Not assessed", status: "Pending" },
    { name: "Ananya Iyer", initials: "AI", color: "bg-purple-500", course: "B.Tech ECE", roll: "21EC2109", score: 81, category: "Best", status: "Placed" },
    { name: "Vivaan Gupta", initials: "VG", color: "bg-blue-500", course: "B.Tech IT", roll: "21IT3402", score: 63, category: "Average", status: "Active" },
    { name: "Saanvi Reddy", initials: "SR", color: "bg-rose-500", course: "MCA", roll: "22MC0501", score: 39, category: "Poor", status: "Pending" },
  ];

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-[#8B93A7]";
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      "Best": "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20",
      "Average": "bg-amber-400/10 text-amber-400 hover:bg-amber-400/20",
      "Poor": "bg-rose-400/10 text-rose-400 hover:bg-rose-400/20",
      "Not assessed": "bg-[#232935] text-[#8B93A7] hover:bg-[#232935]"
    };
    return styles[category] || styles["Not assessed"];
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string, dot: string }> = {
      "Placed": { bg: "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20", dot: "bg-emerald-400" },
      "Active": { bg: "bg-blue-400/10 text-blue-400 hover:bg-blue-400/20", dot: "bg-blue-400" },
      "Pending": { bg: "bg-amber-400/10 text-amber-400 hover:bg-amber-400/20", dot: "bg-amber-400" }
    };
    const style = styles[status];
    return (
      <Badge variant="outline" className={`border-transparent font-normal pl-1.5 pr-2.5 py-0.5 ${style.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${style.dot}`}></span>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#131720] border-[#232935] shadow-none">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-medium text-[#8B93A7]">Total Students</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-semibold text-[#E6E9EF]">1,284</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#131720] border-[#232935] shadow-none">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-medium text-[#8B93A7]">Active Job Postings</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-semibold text-[#E6E9EF]">36</div>
          </CardContent>
        </Card>

        <Card className="bg-[#131720] border-[#232935] shadow-none relative overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#8B93A7]">Pending Approvals</CardTitle>
            <Badge variant="outline" className="bg-amber-400/10 text-amber-400 border-amber-400/20 text-[10px] px-2 py-0 font-normal">Needs review</Badge>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-semibold text-[#E6E9EF]">8</div>
          </CardContent>
        </Card>

        <Card className="bg-[#131720] border-[#232935] shadow-none">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-medium text-[#8B93A7]">Students Placed</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-semibold text-[#E6E9EF]">742</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#E6E9EF]">Student Directory</h2>
          <p className="text-sm text-[#8B93A7]">Search and review student placement readiness.</p>
        </div>

        <div className="bg-[#131720] border border-[#232935] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#232935] flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B93A7]" />
              <Input 
                placeholder="Search students..." 
                className="w-full pl-9 bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1] h-9 text-sm"
              />
            </div>
            <span className="text-sm text-[#8B93A7]">8 students</span>
          </div>

          <Table>
            <TableHeader className="bg-[#0B0E14]/50 hover:bg-[#0B0E14]/50">
              <TableRow className="border-[#232935] hover:bg-transparent">
                <TableHead className="text-[#8B93A7] font-medium h-11"><div className="flex items-center gap-1">Name <ChevronsUpDown className="h-3 w-3" /></div></TableHead>
                <TableHead className="text-[#8B93A7] font-medium h-11"><div className="flex items-center gap-1">Course <ChevronsUpDown className="h-3 w-3" /></div></TableHead>
                <TableHead className="text-[#8B93A7] font-medium h-11"><div className="flex items-center gap-1">Roll No. <ChevronsUpDown className="h-3 w-3" /></div></TableHead>
                <TableHead className="text-[#8B93A7] font-medium h-11"><div className="flex items-center gap-1">ATS Score <ChevronsUpDown className="h-3 w-3" /></div></TableHead>
                <TableHead className="text-[#8B93A7] font-medium h-11"><div className="flex items-center gap-1">Category <ChevronsUpDown className="h-3 w-3" /></div></TableHead>
                <TableHead className="text-[#8B93A7] font-medium h-11"><div className="flex items-center gap-1">Status <ChevronsUpDown className="h-3 w-3" /></div></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index} className="border-[#232935] hover:bg-[#1B212C]/50 transition-colors cursor-pointer">
                  <TableCell className="font-medium text-[#E6E9EF]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${student.color} text-white text-xs font-medium`}>{student.initials}</AvatarFallback>
                      </Avatar>
                      {student.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#8B93A7]">{student.course}</TableCell>
                  <TableCell className="text-[#8B93A7] font-mono">{student.roll}</TableCell>
                  <TableCell className={`font-mono font-medium ${getScoreColor(student.score)}`}>{student.score !== null ? student.score : "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-transparent font-normal px-2.5 py-0.5 ${getCategoryBadge(student.category)}`}>{student.category}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}