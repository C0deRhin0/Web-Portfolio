export const tokenizeCommandInput = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      cmd: '',
      args: [] as string[]
    };
  }

  const [cmd, ...args] = trimmed.split(/\s+/);

  return {
    cmd,
    args
  };
};
