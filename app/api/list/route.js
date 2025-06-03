export async function GET(request) {
  let result = {};
  const getGithubRepo = await fetch(
    `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`
  );
  result = (await getGithubRepo.json())
    .map((item) => item.name)
    .reduce((acc, name) => {
      acc[name] = {};
      return acc;
    }, {});
  for (const qoriName of Object.keys(result)) {
    try {
      const url = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${qoriName}`;
      console.log(url);
      const reqRepoInfo = await fetch(url);
      const repoInfo = await reqRepoInfo.json();
      result[qoriName] = { size: repoInfo.size + 50000 };
    } catch (err) {}
  }

  return new Response(
    JSON.stringify({
      map: { totalBytes: result },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
