import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const USERNAME = 'C0deRhin0';

const getArgument = (name) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
};

const year = Number(getArgument('--year') ?? new Date().getUTCFullYear());
const inputPath = getArgument('--input');
const outputPath = path.resolve(getArgument('--output') ?? 'src/data/githubActivity.json');

if (!Number.isInteger(year) || year < 2008 || year > 2100) {
  throw new Error(`Invalid contribution year: ${year}`);
}

const contributionUrl = `https://github.com/users/${USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`;

const html = inputPath
  ? await readFile(path.resolve(inputPath), 'utf8')
  : await fetch(contributionUrl, {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'C0deRhin0-Web-Portfolio-Activity-Updater'
      }
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status} while loading contribution data.`);
      }
      return response.text();
    });

const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in\s+(\d{4})/i);
if (!totalMatch || Number(totalMatch[2]) !== year) {
  throw new Error(`Could not find the ${year} contribution total in GitHub's response.`);
}

const days = [];
const cellPattern = /<td\b([^>]*\bContributionCalendar-day\b[^>]*)><\/td>\s*<tool-tip\b[^>]*>([^<]*)<\/tool-tip>/gi;

for (const match of html.matchAll(cellPattern)) {
  const attributes = match[1];
  const date = attributes.match(/\bdata-date="([^"]+)"/i)?.[1];
  const level = Number(attributes.match(/\bdata-level="([0-4])"/i)?.[1]);
  const countText = match[2].match(/([\d,]+)\s+contributions?/i)?.[1];

  if (date?.startsWith(`${year}-`) && Number.isInteger(level)) {
    days.push({
      date,
      count: countText ? Number(countText.replaceAll(',', '')) : 0,
      level
    });
  }
}

if (days.length < 365) {
  throw new Error(`Expected a full contribution calendar, but parsed only ${days.length} days.`);
}

days.sort((left, right) => left.date.localeCompare(right.date));

const nextActivity = {
  username: USERNAME,
  year,
  totalContributions: Number(totalMatch[1].replaceAll(',', '')),
  updatedAt: new Date().toISOString(),
  source: contributionUrl,
  days
};

let previousActivity;
try {
  previousActivity = JSON.parse(await readFile(outputPath, 'utf8'));
} catch {
  previousActivity = null;
}

const comparable = (activity) => JSON.stringify({
  username: activity?.username,
  year: activity?.year,
  totalContributions: activity?.totalContributions,
  source: activity?.source,
  days: activity?.days
});

if (comparable(previousActivity) === comparable(nextActivity)) {
  console.log(`GitHub activity is already current: ${nextActivity.totalContributions.toLocaleString('en-US')} contributions in ${year}.`);
  process.exit(0);
}

await writeFile(outputPath, `${JSON.stringify(nextActivity, null, 2)}\n`, 'utf8');
console.log(`Updated ${outputPath} with ${nextActivity.totalContributions.toLocaleString('en-US')} contributions in ${year}.`);
