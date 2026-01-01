/**
 * Chainlink Functions Source Code
 * ================================
 * This code runs on the Chainlink DON to fetch GitHub productivity metrics.
 * 
 * Arguments:
 * - args[0]: GitHub username
 * - args[1]: Time period in days (default: 30)
 * 
 * Returns: Encoded (commitVelocity, totalStars, repoCount, accountAge)
 */

// Validate arguments
if (!args || args.length === 0) {
  throw Error("GitHub username is required");
}

const username = args[0];
const periodDays = args[1] ? parseInt(args[1]) : 30;

// GitHub API endpoints
const userUrl = `https://api.github.com/users/${username}`;
const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
const eventsUrl = `https://api.github.com/users/${username}/events?per_page=100`;

// Make parallel API requests
const [userResponse, reposResponse, eventsResponse] = await Promise.all([
  Functions.makeHttpRequest({
    url: userUrl,
    headers: {
      "User-Agent": "VITA-Protocol-Oracle",
      ...(secrets.githubToken ? { Authorization: `Bearer ${secrets.githubToken}` } : {}),
    },
  }),
  Functions.makeHttpRequest({
    url: reposUrl,
    headers: {
      "User-Agent": "VITA-Protocol-Oracle",
      ...(secrets.githubToken ? { Authorization: `Bearer ${secrets.githubToken}` } : {}),
    },
  }),
  Functions.makeHttpRequest({
    url: eventsUrl,
    headers: {
      "User-Agent": "VITA-Protocol-Oracle",
      ...(secrets.githubToken ? { Authorization: `Bearer ${secrets.githubToken}` } : {}),
    },
  }),
]);

// Check for errors
if (userResponse.error) {
  throw Error(`User API error: ${userResponse.error}`);
}
if (reposResponse.error) {
  throw Error(`Repos API error: ${reposResponse.error}`);
}
if (eventsResponse.error) {
  throw Error(`Events API error: ${eventsResponse.error}`);
}

const userData = userResponse.data;
const repos = reposResponse.data;
const events = eventsResponse.data;

// Calculate account age in days
const createdAt = new Date(userData.created_at);
const now = new Date();
const accountAgeDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

// Calculate total stars across all repos
const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

// Calculate commit velocity (commits in the period)
const periodStart = new Date();
periodStart.setDate(periodStart.getDate() - periodDays);

const pushEvents = events.filter((event) => {
  if (event.type !== "PushEvent") return false;
  const eventDate = new Date(event.created_at);
  return eventDate >= periodStart;
});

// Count total commits from push events
const commitCount = pushEvents.reduce((sum, event) => {
  return sum + (event.payload?.commits?.length || 0);
}, 0);

// Commit velocity = commits per day in the period
const commitVelocity = Math.round((commitCount / periodDays) * 100); // Scaled by 100 for precision

// Count active repos (updated in the period)
const activeRepos = repos.filter((repo) => {
  const updatedAt = new Date(repo.updated_at);
  return updatedAt >= periodStart;
}).length;

// Encode the result as bytes
// Format: commitVelocity (uint32), totalStars (uint32), repoCount (uint16), accountAgeDays (uint16)
const result = Functions.encodeUint256(
  (BigInt(commitVelocity) << 192n) |
    (BigInt(totalStars) << 128n) |
    (BigInt(repos.length) << 64n) |
    BigInt(accountAgeDays)
);

return result;
