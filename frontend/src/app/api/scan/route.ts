import { NextResponse } from "next/server";

function generateReasoning(
  stars: number,
  forks: number,
  downloads: number | null,
  impactScore: number,
  language: string | null
): string {
  const parts: string[] = [];

  if (stars > 50000) {
    parts.push(`This repository has ${stars.toLocaleString()} GitHub stars — placing it among the most widely adopted open-source projects globally.`);
  } else if (stars > 5000) {
    parts.push(`With ${stars.toLocaleString()} GitHub stars, this project has strong community adoption across the ecosystem.`);
  } else {
    parts.push(`This repository has ${stars.toLocaleString()} GitHub stars, indicating meaningful early traction.`);
  }

  if (forks > 5000) {
    parts.push(`${forks.toLocaleString()} forks indicate active downstream usage and derivative projects.`);
  } else if (forks > 500) {
    parts.push(`${forks.toLocaleString()} forks demonstrate active community contribution.`);
  }

  if (downloads && downloads > 1_000_000) {
    parts.push(`The package receives ${downloads.toLocaleString()} weekly npm downloads — meaning it is bundled into production applications at massive scale.`);
  } else if (downloads && downloads > 100_000) {
    parts.push(`With ${downloads.toLocaleString()} weekly npm downloads, this package is critical infrastructure for thousands of production deployments.`);
  } else if (downloads && downloads > 10_000) {
    parts.push(`${downloads.toLocaleString()} weekly npm downloads confirm consistent production usage.`);
  }

  if (language) {
    parts.push(`Primary language: ${language}.`);
  }

  if (impactScore >= 80) {
    parts.push(
      `Agent verdict: HIGH IMPACT ✓ — This project qualifies for retroactive funding under the Critical OSS Infrastructure criteria. Kaspa Covenant will lock funds pending ownership verification.`
    );
  } else if (impactScore >= 40) {
    parts.push(
      `Agent verdict: MODERATE IMPACT ✓ — This project qualifies for community utility retroactive pools. Estimated reward based on usage-weighted scoring.`
    );
  } else {
    parts.push(
      `Agent verdict: DEVELOPING — This project shows early traction. It may qualify for emerging project pools once adoption metrics improve.`
    );
  }

  return parts.join(" ");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoParam = searchParams.get("repo");

  if (!repoParam) {
    return NextResponse.json({ error: "repo parameter required (e.g. ?repo=owner/repo)" }, { status: 400 });
  }

  const match = repoParam.replace(/^https?:\/\/github\.com\//, "").match(/^([^/]+)\/([^/\s]+)/);
  if (!match) {
    return NextResponse.json({ error: "Invalid GitHub repo format. Use owner/repo or full GitHub URL." }, { status: 400 });
  }

  const [, owner, repo] = match;

  const ghHeaders: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "RetroFund/1.0",
  };
  if (process.env.GITHUB_TOKEN) ghHeaders["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;

  const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: ghHeaders,
    next: { revalidate: 60 },
  });

  if (!ghRes.ok) {
    return NextResponse.json({ error: "Repository not found or GitHub API rate limited." }, { status: 404 });
  }

  const gh = await ghRes.json() as {
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    description: string | null;
    license?: { spdx_id: string } | null;
  };

  let weeklyDownloads: number | null = null;
  try {
    const npmRes = await fetch(`https://api.npmjs.org/downloads/point/last-week/${repo}`, {
      next: { revalidate: 3600 },
    });
    if (npmRes.ok) {
      const npm = await npmRes.json() as { downloads?: number };
      weeklyDownloads = npm.downloads ?? null;
    }
  } catch {
    // npm lookup is best-effort
  }

  const stars = gh.stargazers_count ?? 0;
  const forks = gh.forks_count ?? 0;
  const downloads = weeklyDownloads ?? 0;

  // Impact score: stars (0-40), forks (0-20), downloads (0-40)
  const starScore = Math.min((stars / 10000) * 40, 40);
  const forkScore = Math.min((forks / 2000) * 20, 20);
  const dlScore = Math.min((downloads / 500000) * 40, 40);
  const impactScore = Math.round(starScore + forkScore + dlScore);

  // 100 KAS per impact point, min 500 KAS if any traction
  const estimatedRewardKas = impactScore > 0 ? Math.max(Math.round(impactScore * 100), 500) : 0;

  return NextResponse.json({
    owner,
    repo,
    description: gh.description,
    stars,
    forks,
    language: gh.language,
    license: gh.license?.spdx_id ?? null,
    weeklyDownloads,
    impactScore,
    estimatedRewardKas,
    agentReasoning: generateReasoning(stars, forks, weeklyDownloads, impactScore, gh.language),
    url: `https://github.com/${owner}/${repo}`,
  });
}
