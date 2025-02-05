import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRepos, type GitHubRepo } from "@/lib/github";

interface RepoSelectorProps {
  onSelect: (repo: GitHubRepo) => void;
  selected?: GitHubRepo;
}

export default function RepoSelector({ onSelect, selected }: RepoSelectorProps) {
  const { data: repos, isLoading } = useQuery({
    queryKey: ["repos"],
    queryFn: getRepos,
  });

  if (isLoading) {
    return <div>Loading repositories...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-inter">Select Repository</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selected?.fullName}
          onValueChange={(value) => {
            const repo = repos?.find((r) => r.fullName === value);
            if (repo) onSelect(repo);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a repository" />
          </SelectTrigger>
          <SelectContent>
            {repos?.map((repo) => (
              <SelectItem key={repo.fullName} value={repo.fullName}>
                {repo.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
