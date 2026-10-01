// ── YouTube ────────────────────────────────────────────────────────────────

export const GET_RECENT_YOUTUBE_VIDEOS = `
  query GetRecentYoutubeVideos($limit: Int, $offset: Int) {
    getRecentYoutubeVideos(limit: $limit, offset: $offset) {
      id
      title
      channel
      publishedAt
      url
      thumbnailUrl
      transcript
      metrics {
        views
        likes
        comments
      }
    }
  }
`;

export const GET_YOUTUBE_CONFIG = `
  query {
    getYoutubeConfig {
      id
      keywords
      channelIds
      languages
      maxResults
      lastSearchAt
    }
  }
`;

// ── GitHub ─────────────────────────────────────────────────────────────────

export const GET_RECENT_GITHUB_REPOS = `
  query GetRecentGithubRepos($limit: Int, $offset: Int) {
    getRecentGithubRepos(limit: $limit, offset: $offset) {
      id
      name
      fullName
      htmlUrl
      description
      stargazersCount
      language
      updatedAt
      topics
      readme
      ownerAvatarUrl
      forksCount
      openIssuesCount
      license
    }
  }
`;

export const GET_GITHUB_CONFIG = `
  query {
    getGithubConfig {
      id
      keywords
      daysActive
      minStars
      minForks
      requireLicense
      selectedTopics
      selectedLanguages
      maxResults
      lastSearchAt
    }
  }
`;

// ── Google News ────────────────────────────────────────────────────────────

export const GET_RECENT_NEWS_ARTICLES = `
  query GetRecentNewsArticles($limit: Int, $offset: Int) {
    getRecentNewsArticles(limit: $limit, offset: $offset) {
      id
      title
      link
      pubDate
      sourceName
      sourceUrl
      fetchedAt
      imageUrl
      content
    }
  }
`;

export const GET_GOOGLE_NEWS_CONFIG = `
  query {
    getGoogleNewsConfig {
      id
      q
      hl
      gl
      ceid
      when
      site
      intitle
      maxResults
      lastSearchAt
    }
  }
`;

export const UPDATE_YOUTUBE_CONFIG = `
  mutation UpdateYoutubeConfig($config: YouTubeSearchConfigInput!) {
    updateYoutubeConfig(config: $config) {
      id
      keywords
      channelIds
      languages
      maxResults
      lastSearchAt
    }
  }
`;

export const UPDATE_GITHUB_CONFIG = `
  mutation UpdateGithubConfig($config: GitHubSearchConfigInput!) {
    updateGithubConfig(config: $config) {
      id
      keywords
      daysActive
      minStars
      minForks
      requireLicense
      selectedTopics
      selectedLanguages
      maxResults
      lastSearchAt
    }
  }
`;

export const UPDATE_GOOGLE_NEWS_CONFIG = `
  mutation UpdateGoogleNewsConfig($config: GoogleNewsConfigInput!) {
    updateGoogleNewsConfig(config: $config) {
      id
      q
      hl
      gl
      ceid
      when
      site
      intitle
      maxResults
      lastSearchAt
    }
  }
`;

export const FETCH_AND_SAVE_YOUTUBE_VIDEOS = `
  mutation {
    fetchAndSaveYoutubeVideos {
      id
    }
  }
`;

export const FETCH_AND_SAVE_GITHUB_REPOS = `
  mutation {
    fetchAndSaveGithubRepos {
      id
    }
  }
`;

export const FETCH_AND_SAVE_NEWS_ARTICLES = `
  mutation {
    fetchAndSaveNewsArticles {
      id
    }
  }
`;
