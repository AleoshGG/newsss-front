export class GitHubData {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly fullName: string,
        public readonly htmlUrl: string,
        public readonly description: string,
        public readonly stargazersCount: number,
        public readonly language: string,
        public readonly updatedAt: string,
        public readonly topics: string[],
        public readonly readme: string,
        public readonly ownerAvatarUrl?: string,
        public readonly forksCount?: number,
        public readonly openIssuesCount?: number,
        public readonly license?: string
    ) {}
}