import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { SiGithubactions } from "react-icons/si";
import { common, fonts } from "@/lib/styles";

export default function Home() {
  return (
    <div className="flex items-center justify-center p-4 h-full">
      <Card className={`w-full max-w-lg ${common.card}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <SiGithubactions className="w-8 h-8 text-[#0077B6]" />
            <CardTitle className={`text-2xl ${fonts.heading}`}>Workflow Wizard</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[#24292E] mb-6">
            Create and configure GitHub Actions workflows with an intuitive wizard interface.
          </p>
          <Link href="/wizard">
            <Button className={`w-full ${common.button.primary}`}>
              Create New Workflow
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}