import { apiRequest } from "./queryClient";

export interface GitHubRepo {
  owner: string;
  name: string;
  fullName: string;
}

export interface GitHubUser {
  login: string;
  avatarUrl: string;
}

export async function getRepos(): Promise<GitHubRepo[]> {
  // This would normally use the GitHub API, but for demo purposes we'll return mock data
  return [
    { owner: "octocat", name: "Hello-World", fullName: "octocat/Hello-World" },
    { owner: "octocat", name: "Spoon-Knife", fullName: "octocat/Spoon-Knife" },
  ];
}

export async function getCurrentUser(): Promise<GitHubUser> {
  // Mock data for demo
  return {
    login: "octocat",
    avatarUrl: "https://github.com/octocat.png",
  };
}

export async function createWorkflow(repo: GitHubRepo, yaml: string): Promise<void> {
  await apiRequest("POST", "/api/configs", {
    repoOwner: repo.owner,
    repoName: repo.name,
    yaml,
  });
}
