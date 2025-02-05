import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Template } from "@shared/schema";

interface TemplatesProps {
  onSelect: (template: Template) => void;
  selected?: Template;
}

export default function Templates({ onSelect, selected }: TemplatesProps) {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates?.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-colors ${
            selected?.id === template.id ? "border-[#0366D6]" : ""
          }`}
          onClick={() => onSelect(template)}
        >
          <CardHeader>
            <CardTitle className="text-lg font-inter">{template.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {template.description}
            </p>
            <Button
              variant={selected?.id === template.id ? "default" : "outline"}
              className="w-full"
            >
              {selected?.id === template.id ? "Selected" : "Select Template"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
