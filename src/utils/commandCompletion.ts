export const getCompletionCandidates = (commands: string[], input: string) => {
  const trimmed = input.trim();
  if (!trimmed) {
    return [] as string[];
  }

  const loweredInput = trimmed.toLowerCase();
  const candidates = commands
    .filter((cmd) => cmd.toLowerCase().startsWith(loweredInput))
    .sort();

  return candidates;
};

export const getCommonPrefix = (candidates: string[]) => {
  if (!candidates.length) {
    return '';
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  const [firstCandidate] = candidates;
  if (!firstCandidate) {
    return '';
  }

  let prefix = '';
  for (let index = 0; index < firstCandidate.length; index += 1) {
    const char = firstCandidate[index];
    const matchesAll = candidates.every((candidate) => candidate[index] === char);
    if (!matchesAll) {
      break;
    }
    prefix += char;
  }

  return prefix;
};
