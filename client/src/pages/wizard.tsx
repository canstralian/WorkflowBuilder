import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RepoSelector from "@/components/repo-selector";
import Templates from "@/components/templates";
import YamlEditor from "@/components/yaml-editor";
import type { GitHubRepo } from "@/lib/github";
import type { Template } from "@shared/schema";

export default function Wizard() {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo>();
  const [selectedTemplate, setSelectedTemplate] = useState<Template>();
  const [yaml, setYaml] = useState("");
  const [activeTab, setActiveTab] = useState("repo");

  const handleNext = () => {
    if (activeTab === "repo" && selectedRepo) {
      setActiveTab("template");
    } else if (activeTab === "template" && selectedTemplate) {
      setActiveTab("configure");
    }
  };

  const handleBack = () => {
    if (activeTab === "template") {
      setActiveTab("repo");
    } else if (activeTab === "configure") {
      setActiveTab("template");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077B6] via-[#00A8E8] to-[#00D2B2] p-4">
      <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur shadow-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#F8FAFC]">
            <TabsTrigger 
              value="repo" 
              className="data-[state=active]:bg-[#0077B6] data-[state=active]:text-white"
            >
              1. Select Repository
            </TabsTrigger>
            <TabsTrigger 
              value="template" 
              disabled={!selectedRepo}
              className="data-[state=active]:bg-[#0077B6] data-[state=active]:text-white"
            >
              2. Choose Template
            </TabsTrigger>
            <TabsTrigger 
              value="configure" 
              disabled={!selectedTemplate}
              className="data-[state=active]:bg-[#0077B6] data-[state=active]:text-white"
            >
              3. Configure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repo" className="space-y-4">
            <RepoSelector onSelect={setSelectedRepo} selected={selectedRepo} />
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!selectedRepo}
                className="bg-[#0077B6] hover:bg-[#0096D6] text-white"
              >
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-4">
            <Templates onSelect={setSelectedTemplate} selected={selectedTemplate} />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/10"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedTemplate}
                className="bg-[#0077B6] hover:bg-[#0096D6] text-white"
              >
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="configure" className="space-y-4">
            <YamlEditor
              initialValue={selectedTemplate?.yaml || ""}
              value={yaml}
              onChange={setYaml}
              repo={selectedRepo!}
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/10"
              >
                Back
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}