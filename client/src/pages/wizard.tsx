import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RepoSelector from "@/components/repo-selector";
import Templates from "@/components/templates";
import YamlEditor from "@/components/yaml-editor";
import type { GitHubRepo } from "@/lib/github";
import type { Template } from "@shared/schema";

export default function Wizard() {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo>();
  const [selectedTemplate, setSelectedTemplate] = useState<Template>();
  const [yaml, setYaml] = useState("");

  return (
    <div className="min-h-screen bg-[#F6F8FA] p-4">
      <Card className="max-w-4xl mx-auto">
        <Tabs defaultValue="repo" className="p-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="repo">1. Select Repository</TabsTrigger>
            <TabsTrigger value="template" disabled={!selectedRepo}>
              2. Choose Template
            </TabsTrigger>
            <TabsTrigger value="configure" disabled={!selectedTemplate}>
              3. Configure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repo">
            <RepoSelector onSelect={setSelectedRepo} selected={selectedRepo} />
          </TabsContent>

          <TabsContent value="template">
            <Templates onSelect={setSelectedTemplate} selected={selectedTemplate} />
          </TabsContent>

          <TabsContent value="configure">
            <YamlEditor
              initialValue={selectedTemplate?.yaml || ""}
              value={yaml}
              onChange={setYaml}
              repo={selectedRepo!}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
