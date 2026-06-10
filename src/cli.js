#!/usr/bin/env node

/**
 * url-to-md - Convert any webpage to clean markdown
 * Usage: url2md <url> [--output=file.md]
 */

import { convertUrl } from './convert.js';
import { promises as fs } from 'fs';

// Inline args parser (3 lines not worth separate file)
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--output=')) args.output = arg.split('=')[1];
    else if (!arg.startsWith('--')) args.url = arg;
  }
  return args;
}

const args = parseArgs(process.argv);

if (!args.url) {
  console.error('Usage: url2md <url> [--output=file.md]');
  process.exit(1);
}

try {
  const markdown = await convertUrl(args.url);
  const outputPath = args.output || 'page.md';
  await fs.writeFile(outputPath, markdown, 'utf-8');
  console.log(`Saved to ${outputPath} (${markdown.length} chars)`);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
