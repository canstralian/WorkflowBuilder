import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { validateYaml } from "@/lib/yaml";
import { createWorkflow, type GitHubRepo } from "@/lib/github";

interface YamlEditorProps {
  initialValue: string;
  value: string;
  onChange: (value: string) => void;
  repo: GitHubRepo;
}

export default function YamlEditor({
  initialValue,
  value,
  onChange,
  repo,
}: YamlEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!validateYaml(value)) {
      toast({
        title: "Invalid YAML",
        description: "Please check your workflow configuration",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createWorkflow(repo, value);
      toast({
        title: "Success",
        description: "Workflow has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workflow",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={value || initialValue}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono h-[400px]"
      />
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-[#22863A] hover:bg-[#1A7F33]"
      >
        {isSubmitting ? "Creating..." : "Create Workflow"}
      </Button>
    </div>
  );
}
