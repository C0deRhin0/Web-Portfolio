import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it('opens repeated cards and restores focus to the accessible strip', () => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.setAttribute('open', ''); } });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.removeAttribute('open'); } });
    const { container } = render(<ProjectShowcase projectSlug="a2a-lobby" />);
    const repeat = container.querySelector('[data-copy="repeat"]')!;
    expect(repeat).not.toHaveAttribute('inert');
    const cards = repeat.querySelectorAll('button');
    for (const card of Array.from(cards)) {
      fireEvent.click(card);
      expect(screen.getByRole('dialog', { name: 'A2A Lobby' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Close screenshot preview' }));
      expect(screen.getByRole('group', { name: 'Scroll project screenshots' })).toHaveFocus();
    }
  });
});
