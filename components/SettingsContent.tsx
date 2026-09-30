"use client";

import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Shield, Upload, FileText } from "lucide-react";

export default function SettingsContent() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    // Triggers the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      // Add logic here to upload the resume to Supabase or your storage provider
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-5xl mx-auto p-6 md:p-8">
      
      {/* PAGE HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-[#E6E9EF] mb-1">Settings</h2>
        <p className="text-sm text-[#8B93A7]">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        {/* TABS HEADER */}
        <div className="border-b border-[#232935] mb-6">
          <TabsList className="bg-transparent p-0 h-12 w-full justify-start gap-8">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E6E9EF] data-[state=active]:text-[#E6E9EF] text-[#8B93A7] rounded-none px-0 h-12 font-medium flex items-center gap-2"
            >
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E6E9EF] data-[state=active]:text-[#E6E9EF] text-[#8B93A7] rounded-none px-0 h-12 font-medium flex items-center gap-2"
            >
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>
        </div>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6 outline-none">
          
          {/* RESUME UPLOAD SECTION */}
          <Card className="bg-[#131720] border-[#232935] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#E6E9EF]">Resume Upload</CardTitle>
              <CardDescription className="text-[#8B93A7]">Update your resume to be used for applications. Recommended format is PDF.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-[#0B0E14] border border-[#232935] flex items-center justify-center">
                <FileText className="h-8 w-8 text-[#8B93A7]" />
              </div>
              <div className="flex flex-col gap-2">
                
                {/* Hidden File Input configured for documents */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept=".pdf, .doc, .docx"
                  className="hidden" 
                />
                
                <Button 
                  variant="outline" 
                  onClick={handleUploadClick}
                  className="border-[#232935] bg-[#0B0E14] text-[#E6E9EF] hover:bg-[#1B212C] w-fit"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload new resume
                </Button>
                <p className="text-xs text-[#8B93A7]">PDF or DOCX. 5MB max.</p>
              </div>
            </CardContent>
          </Card>

          {/* PERSONAL INFORMATION SECTION */}
          <Card className="bg-[#131720] border-[#232935] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#E6E9EF]">Personal Information</CardTitle>
              <CardDescription className="text-[#8B93A7]">Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[#E6E9EF]">Full Name</Label>
                  <Input 
                    placeholder="Aarav Sharma" 
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7]/50 focus-visible:ring-[#6366F1]" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#E6E9EF]">Email</Label>
                  <Input 
                    placeholder="aarav.sharma@university.edu" 
                    disabled 
                    className="bg-[#0B0E14] border-[#232935] text-[#8B93A7] placeholder:text-[#8B93A7] opacity-70" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#E6E9EF]">Roll Number</Label>
                  <Input 
                    placeholder="21CS1042" 
                    disabled 
                    className="bg-[#0B0E14] border-[#232935] text-[#8B93A7] placeholder:text-[#8B93A7] opacity-70" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#E6E9EF]">Course</Label>
                  <Input 
                    placeholder="B.Tech CSE" 
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7]/50 focus-visible:ring-[#6366F1]" 
                  />
                </div>
              </div>
              <Button className="bg-[#6366F1] hover:bg-indigo-500 text-white">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-6 outline-none">
          <Card className="bg-[#131720] border-[#232935] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#E6E9EF]">Change Password</CardTitle>
              <CardDescription className="text-[#8B93A7]">Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 max-w-md">
                <Label className="text-[#E6E9EF]">Current Password</Label>
                <Input type="password" placeholder="••••••••" className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] focus-visible:ring-[#6366F1]" />
              </div>
              <div className="space-y-2 max-w-md">
                <Label className="text-[#E6E9EF]">New Password</Label>
                <Input type="password" placeholder="••••••••" className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] focus-visible:ring-[#6366F1]" />
              </div>
              <div className="space-y-2 max-w-md">
                <Label className="text-[#E6E9EF]">Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] focus-visible:ring-[#6366F1]" />
              </div>
              <Button className="bg-[#6366F1] hover:bg-indigo-500 text-white mt-2">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}