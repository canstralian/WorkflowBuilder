import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { SiGithubactions } from "react-icons/si";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077B6] via-[#00A8E8] to-[#00D2B2] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <SiGithubactions className="w-8 h-8 text-[#0077B6]" />
            <CardTitle className="text-2xl font-inter">Workflow Wizard</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[#24292E] mb-6">
            Create and configure GitHub Actions workflows with an intuitive wizard interface.
          </p>
          <Link href="/wizard">
            <Button className="w-full bg-[#0077B6] hover:bg-[#0096D6] text-white">
              Create New Workflow
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}