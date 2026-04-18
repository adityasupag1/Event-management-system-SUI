/**
 * CRA only embeds env vars prefixed with REACT_APP_.
 * This script maps VITE_API_URL -> REACT_APP_API_URL before react-scripts runs,
 * and loads VITE_/REACT_APP_ API URLs from .env files when not already set.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');

function peelVal(v) {
  let s = String(v).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s;
}

function loadApiUrlFromEnvFiles() {
  const files = ['.env.local', '.env.development.local', '.env.development', '.env'];
  for (const f of files) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*VITE_API_URL\s*=\s*(.*)$/);
      if (m && !process.env.VITE_API_URL) process.env.VITE_API_URL = peelVal(m[1]);
      const m2 = line.match(/^\s*REACT_APP_API_URL\s*=\s*(.*)$/);
      if (m2 && !process.env.REACT_APP_API_URL) process.env.REACT_APP_API_URL = peelVal(m2[1]);
    }
  }
}

loadApiUrlFromEnvFiles();

if (!process.env.REACT_APP_API_URL && process.env.VITE_API_URL) {
  process.env.REACT_APP_API_URL = process.env.VITE_API_URL;
}

const cmd = process.argv[2];
if (!cmd || !['start', 'build', 'test'].includes(cmd)) {
  console.error('Usage: node scripts/cra-env.js <start|build|test>');
  process.exit(1);
}

const reactScriptsBin = path.join(root, 'node_modules', 'react-scripts', 'bin', 'react-scripts.js');
const extraArgs = process.argv.slice(3);
const r = spawnSync(process.execPath, [reactScriptsBin, cmd, ...extraArgs], {
  stdio: 'inherit',
  env: process.env,
  cwd: root,
});
process.exit(r.status === null ? 1 : r.status);
