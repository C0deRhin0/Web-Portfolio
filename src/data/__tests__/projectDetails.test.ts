import commands from '../commands.json';
import { findProjectDetail, PROJECT_DETAILS, PROJECT_COMMANDS } from '../projectDetails';

const normalizeProjectLine = (line: string) => (
  line
    .replace(/^•\s*/, '')
    .replace(/\s+\(fork\)$/, '')
    .toLowerCase()
);

describe('projectDetails', () => {
  it('defines a detail entry for every project listed in commands.json', () => {
    const projectsCommand = commands.find((item) => item.cmd === 'projects');
    expect(projectsCommand?.outputLines).toBeDefined();

    const missing = (projectsCommand?.outputLines || [])
      .map(normalizeProjectLine)
      .filter((projectName) => !findProjectDetail(projectName));

    expect(missing).toEqual([]);
  });

  it('exposes project completion commands for every detail entry', () => {
    expect(PROJECT_COMMANDS).toHaveLength(PROJECT_DETAILS.length);
    PROJECT_DETAILS.forEach((project) => {
      expect(PROJECT_COMMANDS).toContain(`project ${project.slug}`);
    });
  });
});
