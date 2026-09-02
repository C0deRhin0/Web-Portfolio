import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GitHubActivity from '../GitHubActivity';

describe('GitHubActivity', () => {
  it('shows the exact date and contribution count for a hovered tile', () => {
    const { container } = render(<GitHubActivity />);
    const busiestDay = container.querySelector<HTMLElement>('[data-date="2026-06-07"]');

    expect(busiestDay).not.toBeNull();
    fireEvent.mouseEnter(busiestDay as HTMLElement, { clientX: 120, clientY: 70 });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Sunday, June 7, 2026 · 54 contributions');
  });

  it('provides a keyboard-focusable summary for the contribution calendar', () => {
    render(<GitHubActivity />);

    expect(screen.getByRole('img')).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('img')).toHaveAccessibleName(/\d[\d,]* public GitHub contributions across \d+ active days in \d{4}/i);
  });
});
