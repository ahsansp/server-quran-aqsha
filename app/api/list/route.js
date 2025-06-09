export async function GET(request) {
  let result = {};
  const getGithubRepo = await fetch(
    `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
    { next: { revalidate: 60 } }
  );
  const gitRepo = await getGithubRepo.json();
  console.log(gitRepo);
  result = gitRepo
    .map((item) => item.name)
    .reduce((acc, name) => {
      acc[name] = {};
      return acc;
    }, {});
  for (const qoriName of Object.keys(result)) {
    try {
      const url = `https://api.github.com/repos/quranAqshaQori/${qoriName}/releases/tags/qori`;
      console.log(url);
      const reqRepoInfo = await fetch(url);
      const repoInfo = await reqRepoInfo.json();
      let size = 0;
      repoInfo.assets.forEach((value) => {
        size += value.size || 0;
      });
      const repoLength = repoInfo.assets.length - 1;
      console.log("length", repoLength);
      result[qoriName] = { totalBytes: size, count: repoLength };
    } catch (err) {}
  }

  return new Response(
    JSON.stringify({
      map: { qori: result },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
