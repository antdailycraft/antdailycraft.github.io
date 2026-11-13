import { cpSync, mkdirSync } from 'node:fs';
mkdirSync('public', { recursive: true });
cpSync('assets', 'public/assets', { recursive: true });
for (const file of ['favicon.ico', 'google572cf39cbfa59b58.html']) cpSync(file, `public/${file}`);
