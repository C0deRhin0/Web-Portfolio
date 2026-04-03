import React from 'react';
import { act, render, screen } from '@testing-library/react';
import BootSequence from '../BootSequence';

describe('BootSequence', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the header and first line after delay', () => {
    render(<BootSequence onComplete={jest.fn()} theme="1" baseDelay={0} />);

    expect(screen.getByText('CODERHINO OS Boot')).toBeInTheDocument();
    expect(screen.queryByText(/Loading CODERHINO Kernel/)).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByText(/Loading CODERHINO Kernel/)).toBeInTheDocument();
  });

  it('calls onComplete after all lines render', () => {
    const onComplete = jest.fn();
    render(<BootSequence onComplete={onComplete} theme="2" baseDelay={1} />);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('applies theme class based on theme prop', () => {
    const { container } = render(<BootSequence onComplete={jest.fn()} theme="3" baseDelay={1} />);
    expect(container.firstChild).toHaveClass('boot-sequence');
    expect(container.firstChild).toHaveClass('theme-3');
  });
});
