export interface BootLine {
  id: string;
  text: string;
  variant?: 'ok' | 'wait' | 'error';
}

export const BOOT_LINES: BootLine[] = [
  {
    id: 'kernel',
    text: '[  OK  ] Loading CODERHINO Kernel 6.1.0-21-rhino...',
    variant: 'ok'
  },
  {
    id: 'mount',
    text: '[  OK  ] Mounting /dev/sdh1 on /home/guest...',
    variant: 'ok'
  },
  {
    id: 'tunnel',
    text: '[  WAIT ] Establishing encrypted tunnel...',
    variant: 'wait'
  },
  {
    id: 'neural',
    text: '[  OK  ] Initializing Neural Interface...',
    variant: 'ok'
  },
  {
    id: 'matrix',
    text: '[  OK  ] Calibrating Matrix Renderer...',
    variant: 'ok'
  },
  {
    id: 'auth',
    text: '[  OK  ] Authenticating visitor credentials...',
    variant: 'ok'
  },
  {
    id: 'ready',
    text: '[  OK  ] Boot sequence complete. Handing off to shell...',
    variant: 'ok'
  }
];
