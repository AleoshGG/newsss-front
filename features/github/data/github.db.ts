import { gqlFetch } from '@/lib/graphql-client';
import { GET_RECENT_GITHUB_REPOS } from '@/lib/graphql-queries';
import { GitHubData } from './github.entity';

export async function getGithubRepos(limit = 50): Promise<GitHubData[]> {
  const data = await gqlFetch<{ getRecentGithubRepos: GitHubData[] }>(
    GET_RECENT_GITHUB_REPOS,
    { limit }
  );
  return data.getRecentGithubRepos.map(
    (r) =>
      new GitHubData(
        r.id,
        r.name,
        r.fullName,
        r.htmlUrl,
        r.description,
        r.stargazersCount,
        r.language,
        r.updatedAt,
        r.topics,
        r.readme,
        r.ownerAvatarUrl,
        r.forksCount,
        r.openIssuesCount,
        r.license
      )
  );
}
