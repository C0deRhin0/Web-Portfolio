export interface SystemSnapshot {
  cpu: number;
  memory: number;
  processes: number;
  uptime: string;
}

const pad = (value: number) => value.toString().padStart(2, '0');

const formatUptime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${pad(hours)}:${pad(minutes)}`;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const createSystemSnapshot = (seed: number): SystemSnapshot => {
  const cpuBase = 22 + (seed % 30);
  const memoryBase = 38 + (seed % 40);
  const cpu = clamp(cpuBase + (seed % 6), 8, 92);
  const memory = clamp(memoryBase + (seed % 9), 18, 88);
  const processes = 92 + (seed % 48);
  const uptimeSeconds = 3600 + (seed % 5400);

  return {
    cpu,
    memory,
    processes,
    uptime: formatUptime(uptimeSeconds)
  };
};

export const buildSystemMonitorLines = (snapshot: SystemSnapshot) => [
  'top - 14:22:31 up ' + snapshot.uptime + ',  3 users,  load average: 0.41, 0.38, 0.29',
  `Tasks: ${snapshot.processes} total,   1 running, ${snapshot.processes - 65} sleeping,   0 stopped,   0 zombie`,
  `%Cpu(s): ${snapshot.cpu.toFixed(1)} us,  3.2 sy,  0.0 ni, ${(100 - snapshot.cpu).toFixed(1)} id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st`,
  `MiB Mem :  8192.0 total,  ${(8192 * (1 - snapshot.memory / 100)).toFixed(1)} free,  ${(8192 * (snapshot.memory / 100)).toFixed(1)} used,  512.0 buff/cache`,
  'MiB Swap:  2048.0 total,  2048.0 free,     0.0 used.  6144.0 avail Mem',
  '',
  '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND',
  ` 1024 visitor   20   0  512000  66320  23120 S  ${Math.min(snapshot.cpu, 24).toFixed(1)}  2.6   0:12.31 rhino-shell`,
  ` 2048 visitor   20   0  628000  82312  28410 S  ${(snapshot.cpu / 2).toFixed(1)}  3.9   0:08.12 node`,
  ' 3072 visitor   20   0  311200  45120  18224 S   2.1  1.2   0:05.03 sshd',
  ' 4096 visitor   20   0  128900  26412  11004 S   1.2  0.8   0:01.88 vim'
];
