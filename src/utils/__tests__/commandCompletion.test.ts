import { getCommonPrefix, getCompletionCandidates } from '../commandCompletion';

describe('commandCompletion', () => {
  const commands = [
    'effects sounds on',
    'resume',
    'project vector-mind-ai',
    'project corp-mind-ai',
    'project whisper-local',
    'whoami --short'
  ];

  it('keeps trailing spaces when matching subcommands', () => {
    expect(getCompletionCandidates(commands, 'project ')).toEqual([
      'project corp-mind-ai',
      'project vector-mind-ai',
      'project whisper-local'
    ]);
  });

  it('returns a project command when enough of the argument is typed', () => {
    expect(getCompletionCandidates(commands, 'project v')).toEqual([
      'project vector-mind-ai'
    ]);
  });

  it('supports flag completions for multi-word commands', () => {
    const candidates = getCompletionCandidates(commands, 'whoami -');
    expect(candidates).toEqual(['whoami --short']);
    expect(getCommonPrefix(candidates)).toBe('whoami --short');
  });
});
