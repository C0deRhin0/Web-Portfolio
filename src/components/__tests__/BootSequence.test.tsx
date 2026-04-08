import React from 'react';
import { act, render, screen } from '@testing-library/react';

jest.mock('../../utils/bootMessages', () => ({
  BOOT_LINES: [
    {
      id: 'kernel',
      text: '[  OK  ] Loading CODERHINO Kernel 6.1.0-21-rhino...',
      variant: 'ok'
    }
  ]
}));


import BootSequence from '../BootSequence';

describe('BootSequence', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the header and first line after delay', () => {
    render(<BootSequence onComplete={jest.fn()} theme="1" baseDelay={0} instant />);

    expect(screen.getByText('CODERHINO OS Boot')).toBeInTheDocument();
    expect(screen.getByText(/Loading CODERHINO Kernel/)).toBeInTheDocument();
  });

  it('calls onComplete after completion delay', () => {
    const onComplete = jest.fn();
    render(<BootSequence onComplete={onComplete} theme="2" baseDelay={0} instant />);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('applies theme class based on theme prop', () => {
    const { container } = render(<BootSequence onComplete={jest.fn()} theme="3" baseDelay={1} />);
    expect(container.firstChild).toHaveClass('boot-sequence');
    expect(container.firstChild).toHaveClass('theme-3');
  });
});
