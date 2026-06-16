const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetches public profile data for a GitHub user.
 *
 * @param {string} username - GitHub username
 * @returns {object} Extracted profile insights
 * @throws Axios error (404 = user not found, 403/429 = rate limited)
 */
async function fetchGitHubProfile(username) {
  const headers = {
    'User-Agent': 'GitHub-Profile-Analyzer',
    Accept: 'application/vnd.github.v3+json',
  };

  // Use personal access token if available (increases rate limit 60 → 5000 req/hr)
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
    headers,
  });

  const data = response.data;

  // Extract useful insights from the GitHub API response
  return {
    username: data.login,
    name: data.name || null,
    bio: data.bio || null,
    avatar_url: data.avatar_url || null,
    html_url: data.html_url || null,
    location: data.location || null,
    company: data.company || null,
    blog: data.blog || null,
    twitter_username: data.twitter_username || null,
    public_repos: data.public_repos || 0,
    public_gists: data.public_gists || 0,
    followers: data.followers || 0,
    following: data.following || 0,
    account_created_at: data.created_at || null,
    last_updated_on_github: data.updated_at || null,
  };
}

module.exports = { fetchGitHubProfile };
