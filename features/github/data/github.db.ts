import { GitHubData } from './github.entity';

// Mock data - no database persistence
const mockGithubRepos: Map<number, GitHubData> = new Map();

export async function getGithubRepos(limit?: number): Promise<GitHubData[]> {
  const repos = Array.from(mockGithubRepos.values());
  if (limit) {
    return repos.slice(0, limit);
  }
  return repos;
}

export async function upsertGithubRepo(repo: GitHubData) {
  mockGithubRepos.set(repo.id, repo);
  return repo;
}
