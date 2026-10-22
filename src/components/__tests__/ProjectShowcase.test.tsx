import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectShowcase from '../ProjectShowcase';
import { PROJECT_CAPTURES } from '../../data/projectScreenshots';
import { PROJECT_DETAILS } from '../../data/projectDetails';

describe('project screenshot collections', () => {
  it('shows only the selected project and all of its images', () => {
    render(<ProjectShowcase projectSlug="a2a-lobby" />);
    expect(screen.getByRole('heading', { name: 'A2A Lobby — Screenshots' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Open A2A Lobby:/ })).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /^Open Recall:/ })).not.toBeInTheDocument();
  });

  it('matches repository names without exposing unrelated projects', () => {
    render(<ProjectShowcase projectSlug="portfolio-alias" projectRepo="https://github.com/C0deRhin0/A2A-LOBBY.git" />);
    expect(screen.getAllByRole('button', { name: /^Open A2A Lobby:/ })).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /^Open Recall:/ })).not.toBeInTheDocument();
  });

  it('omits removed labels and manual playback controls', () => {
    render(<ProjectShowcase />);
    expect(screen.getByRole('heading', { name: 'Project screenshots' })).toBeInTheDocument();
    expect(screen.queryByText(/PROJECT SIGNAL|Hover to pause|Select a capture/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause|resume/i })).not.toBeInTheDocument();
  });

  it('provides at least two correctly attributed images for every case study', () => {
    for (const project of PROJECT_DETAILS) {
      const evidence = PROJECT_CAPTURES.find(capture => capture.slug === project.slug);
      expect(evidence?.screens.length).toBeGreaterThanOrEqual(2);
      expect(evidence?.screens.every(image => image.alt.length > 10)).toBe(true);
    }
  });
});
