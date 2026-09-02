import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../utils/audioManager', () => ({
  playKeyboardSound: jest.fn()
}));

import PortfolioDossier from '../PortfolioDossier';

describe('PortfolioDossier accessibility and project filters', () => {
  it('filters projects by discipline and announces the result count', () => {
    render(<PortfolioDossier onReturnToTerminal={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    fireEvent.click(screen.getByRole('button', { name: /projects\.txt/i }));
    fireEvent.click(screen.getByRole('button', { name: 'AI & Agent Systems' }));

    expect(screen.getByText('Showing 12 of 28 projects')).toBeInTheDocument();
    expect(screen.getByText('Agent-to-Agent Coordination Lobby Platform')).toBeInTheDocument();
    expect(screen.queryByText('AWS Cloud DevSecOps Pipeline')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AI & Agent Systems' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('dismisses the welcome dialog with Escape', () => {
    render(<PortfolioDossier onReturnToTerminal={jest.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Welcome to Portfolio.exe' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog', { name: 'Welcome to Portfolio.exe' })).not.toBeInTheDocument();
  });

  it('blocks direct resume access and offers official contact channels', () => {
    render(<PortfolioDossier onReturnToTerminal={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));

    fireEvent.click(screen.getByRole('button', { name: /resume\.pdf/i }));

    const dialog = screen.getByRole('dialog', { name: 'Resume Access' });
    expect(dialog).toHaveTextContent('No free data for you. Nice try.');
    expect(screen.getByRole('link', { name: 'Email owner' })).toHaveAttribute('href', expect.stringContaining('mailto:pauloperez9754@gmail.com'));
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://linkedin.com/in/wppereziii');
    expect(document.querySelector('a[href="/resume.pdf"]')).not.toBeInTheDocument();
  });
});
