"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function ProfileDetailsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    course: '',
    rollNumber: '',
    email: 'aarav.sharma@university.edu', // Kept as value since this comes pre-filled from auth
    contactNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting profile:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] font-sans p-4">
      
      <Card className="w-full max-w-[560px] bg-[#131720] border-[#232935] shadow-2xl">
        
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#6366F1] rounded-md flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <span className="text-[#E6E9EF] text-lg font-semibold tracking-wide">Placemate</span>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-[#E6E9EF] text-lg font-semibold">
              Complete your student profile
            </CardTitle>
            <CardDescription className="text-[#8B93A7] text-xs">
              This helps our agents match you to the right roles.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* BASIC DETAILS SECTION */}
            <div className="space-y-3">
              <h3 className="text-[#8B93A7] text-[10px] font-semibold uppercase tracking-wider">
                Basic Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[#E6E9EF] text-xs font-normal">Full Name</Label>
                  <Input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nikhil Thorat"
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7]/50 text-sm h-9 focus-visible:ring-[#6366F1]"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-[#E6E9EF] text-xs font-normal">Course</Label>
                  <Input 
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="MCA"
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7]/50 text-sm h-9 focus-visible:ring-[#6366F1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#E6E9EF] text-xs font-normal">Roll Number</Label>
                  <Input 
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="25112001"
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7]/50 text-sm h-9 focus-visible:ring-[#6366F1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#E6E9EF] text-xs font-normal">Email</Label>
                  <Input 
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-[#0B0E14] border-[#232935] text-[#8B93A7] text-sm h-9 opacity-70 cursor-not-allowed focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Label className="text-[#E6E9EF] text-xs font-normal">Contact Number</Label>
                <Input 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7]/50 text-sm h-9 focus-visible:ring-[#6366F1]"
                />
              </div>
            </div>

            {/* RESUME SECTION */}
            <div className="space-y-3 pt-1">
              <h3 className="text-[#8B93A7] text-[10px] font-semibold uppercase tracking-wider">
                Resume
              </h3>
              
              <div className="border-2 border-dashed border-[#232935] rounded-xl bg-[#0B0E14]/50 hover:bg-[#0B0E14] transition-colors p-6 flex flex-col items-center justify-center text-center cursor-pointer group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#8B93A7] group-hover:text-[#E6E9EF] transition-colors mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <p className="text-[#E6E9EF] text-xs mb-1">
                  Drag & drop your resume, or <span className="text-[#22D3EE]">browse</span>
                </p>
                <p className="text-[#8B93A7] text-[10px]">
                  PDF or DOCX, up to 5MB
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-[#232935] gap-4">
              <span className="text-[#8B93A7] text-xs text-center sm:text-left">
                Your account is pending approval by the Placement Cell.
              </span>
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-[#6366F1] hover:bg-indigo-500 text-white px-6 h-9 text-xs"
              >
                Save & Submit
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}