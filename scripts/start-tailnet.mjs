// Start the unmodified upstream snapshot on a separate loopback origin.
// Do not write the Gateway token to a file or pass it on a command line.
import { readFileSync } from 'node:fs';
import { resolve, dirname, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFileSync } from 'node:child_process';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const upstream = project;
// OpenClaw can override its config token in the running gateway's environment.
// Read the active local listener's value without emitting it or persisting it.
let token;
try {
  const pid = execFileSync('lsof', ['-nP', '-t', '-iTCP:18789', '-sTCP:LISTEN'], { encoding: 'utf8' }).trim().split('\n')[0];
  const command = execFileSync('ps', ['eww', '-p', pid, '-o', 'command='], { encoding: 'utf8' });
  token = command.match(/(?:^|\s)OPENCLAW_GATEWAY_TOKEN=([^\s]+)/)?.[1];
} catch { /* Gateway may not be running yet; use configured fallback. */ }
if (!token) token = process.env.GATEWAY_TOKEN || process.env.OPENCLAW_GATEWAY_TOKEN;
if (!token) {
  const config = JSON.parse(readFileSync(resolve(process.env.HOME, '.openclaw/openclaw.json'), 'utf8'));
  token = config.gateway?.auth?.token;
}
if (typeof token !== 'string' || !token) throw new Error('OpenClaw Gateway token unavailable; Nerve not started.');
const child = spawn(process.execPath, ['server-dist/index.js'], {
  cwd: upstream,
  env: {
    ...process.env,
    // launchd omits Homebrew; execPath may resolve into a versioned Cellar.
    PATH: [dirname(process.execPath), ...(process.platform === 'darwin' ? ['/opt/homebrew/bin', '/usr/local/bin'] : []), process.env.PATH || '/usr/bin:/bin:/usr/sbin:/sbin'].join(delimiter),
    GATEWAY_TOKEN: token,
    GATEWAY_URL: process.env.GATEWAY_URL || 'http://127.0.0.1:18789',
    HOST: '127.0.0.1',
    PORT: '3081',
    SSL_PORT: '3444',
  },
  stdio: 'inherit',
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
child.on('error', error => { console.error('Nerve failed to start:', error.message); process.exitCode = 1; });
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0); });
