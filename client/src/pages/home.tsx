import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { SiGithubactions } from "react-icons/si";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <SiGithubactions className="w-8 h-8 text-[#0366D6]" />
            <CardTitle className="text-2xl font-inter">Workflow Wizard</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[#24292E] mb-6">
            Create and configure GitHub Actions workflows with an intuitive wizard interface.
          </p>
          <Link href="/wizard">
            <Button className="w-full bg-[#0366D6] hover:bg-[#0356B6]">
              Create New Workflow
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
