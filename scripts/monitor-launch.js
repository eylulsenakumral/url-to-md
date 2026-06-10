#!/usr/bin/env node

/**
 * url-to-md Launch Monitoring Script
 *
 * Tracks GitHub metrics during HN launch.
 * Run: node scripts/monitor-launch.js
 *
 * No authentication required - uses public GitHub API.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// ES module equivalents for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const REPO_OWNER = 'eylulsenakumral';
const REPO_NAME = 'auto-company-clean';
const PROJECT_PATH = 'projects/url-to-md';
const METRICS_FILE = path.join(__dirname, '..', 'launch-metrics.json');

// Launch targets
const TARGETS = {
  hn: {
    upvotes_1h: 10,
    upvotes_6h: 30,
    upvotes_24h: 50,
    comments_6h: 10,
    front_page: true
  },
  github: {
    stars_24h: 50,
    stars_7d: 100,
    forks_7d: 5
  }
};

/**
 * Fetch repository data from GitHub API
 * Uses public endpoint - no auth required
 */
async function fetchGitHubStats() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'url-to-md-launch-monitor'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();

    // Find the specific project's stars if it's a monorepo
    // For now we track the main repo stats
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.subscribers_count || 0,
      open_issues: data.open_issues_count || 0,
      last_updated: data.updated_at
    };
  } catch (error) {
    console.error(`[ERROR] Failed to fetch GitHub stats: ${error.message}`);
    return null;
  }
}

/**
 * Load existing metrics or create new structure
 */
function loadMetrics() {
  if (fs.existsSync(METRICS_FILE)) {
    try {
      const data = fs.readFileSync(METRICS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`[ERROR] Failed to parse metrics file: ${error.message}`);
    }
  }

  // Create new metrics structure
  return {
    launch: {
      date: new Date().toISOString(),
      status: 'pending', // pending, live, completed
      hn_post_url: null,
      baseline_stars: 0,
      baseline_forks: 0
    },
    checkpoints: [],
    targets: TARGETS
  };
}

/**
 * Save metrics to file
 */
function saveMetrics(metrics) {
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
    console.log(`[OK] Metrics saved to ${METRICS_FILE}`);
  } catch (error) {
    console.error(`[ERROR] Failed to save metrics: ${error.message}`);
  }
}

/**
 * Calculate progress percentage
 */
function calculateProgress(current, target) {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Format timestamp for display
 */
function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });
}

/**
 * Calculate time elapsed since launch
 */
function getElapsedTime(launchTime) {
  const now = new Date();
  const launch = new Date(launchTime);
  const diff = now - launch;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, totalHours: hours + (minutes / 60) };
}

/**
 * Display progress bar
 */
function displayProgressBar(label, current, target, width = 20) {
  const percentage = calculateProgress(current, target);
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const status = percentage >= 100 ? '✓' : ' ';

  console.log(`  ${status} ${label.padEnd(20)} ${bar} ${current}/${target} (${percentage}%)`);
}

/**
 * Display checkpoint summary
 */
function displayCheckpoint(checkpoint, metrics) {
  const elapsed = getElapsedTime(metrics.launch.date);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 LAUNCH CHECKPOINT #${checkpoint.checkpoint_number}`);
  console.log(`🕐 ${formatTimestamp(checkpoint.timestamp)}`);
  console.log(`⏱️  Elapsed: ${elapsed.hours}h ${elapsed.minutes}m since launch`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // GitHub Metrics
  console.log('🐙 GitHub Metrics:');
  console.log(`  Stars:      ${checkpoint.github.stars} (+${checkpoint.github.stars - metrics.launch.baseline_stars} since launch)`);
  console.log(`  Forks:      ${checkpoint.github.forks} (+${checkpoint.github.forks - metrics.launch.baseline_forks} since launch)`);
  console.log(`  Watchers:   ${checkpoint.github.watchers}`);
  console.log(`  Open Issues: ${checkpoint.github.open_issues}`);

  // Progress against targets
  console.log('\n🎯 Target Progress:');

  const hoursSinceLaunch = elapsed.totalHours;

  if (hoursSinceLaunch >= 1) {
    displayProgressBar('HN Upvotes (1h)', checkpoint.hn.upvotes_1h || 0, TARGETS.hn.upvotes_1h);
  }
  if (hoursSinceLaunch >= 6) {
    displayProgressBar('HN Upvotes (6h)', checkpoint.hn.upvotes_6h || 0, TARGETS.hn.upvotes_6h);
    displayProgressBar('HN Comments (6h)', checkpoint.hn.comments_6h || 0, TARGETS.hn.comments_6h);
  }
  if (hoursSinceLaunch >= 24) {
    displayProgressBar('HN Upvotes (24h)', checkpoint.hn.upvotes_24h || 0, TARGETS.hn.upvotes_24h);
    displayProgressBar('GitHub Stars (24h)',
      checkpoint.github.stars - metrics.launch.baseline_stars,
      TARGETS.github.stars_24h);
  }

  // HN Status
  console.log('\n📰 HN Status:');
  console.log(`  Post URL: ${checkpoint.hn.post_url || 'Not submitted yet'}`);
  console.log(`  Upvotes: ${checkpoint.hn.upvotes || 0}`);
  console.log(`  Comments: ${checkpoint.hn.comments || 0}`);
  console.log(`  Front Page: ${checkpoint.hn.front_page ? '✓ Yes' : '✗ No'}`);

  // Manual entry required
  console.log('\n⚠️  MANUAL ENTRY REQUIRED:');
  console.log('  Run: node scripts/monitor-launch.js --update-hn');
  console.log('  You will be prompted for:');
  console.log('    - Current HN upvotes');
  console.log('    - Current HN comments');
  console.log('    - Front page status');
}

/**
 * Display full launch summary
 */
function displaySummary(metrics) {
  const elapsed = getElapsedTime(metrics.launch.date);

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          url-to-md HN Launch Monitor                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`🚀 Launch Status: ${metrics.launch.status.toUpperCase()}`);
  console.log(`📅 Launched: ${formatTimestamp(metrics.launch.date)}`);
  console.log(`⏱️  Elapsed: ${elapsed.hours}h ${elapsed.minutes}m`);
  console.log(`🔗 HN Post: ${metrics.launch.hn_post_url || 'Not submitted'}`);
  console.log(`🐙 Repo: https://github.com/${REPO_OWNER}/${REPO_NAME}/${PROJECT_PATH}\n`);

  if (metrics.checkpoints.length > 0) {
    const latest = metrics.checkpoints[metrics.checkpoints.length - 1];
    displayCheckpoint(latest, metrics);
  } else {
    console.log('ℹ️  No checkpoints yet. Run this script after launch.');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Create new checkpoint
 */
async function createCheckpoint(metrics) {
  const githubStats = await fetchGitHubStats();

  if (!githubStats) {
    console.error('[ERROR] Cannot create checkpoint - GitHub API unavailable');
    return null;
  }

  const elapsed = getElapsedTime(metrics.launch.date);
  const checkpointNumber = metrics.checkpoints.length + 1;

  const checkpoint = {
    checkpoint_number: checkpointNumber,
    timestamp: new Date().toISOString(),
    elapsed_hours: Math.round(elapsed.totalHours * 10) / 10,
    github: githubStats,
    hn: {
      post_url: metrics.launch.hn_post_url,
      upvotes: null,  // Manual entry
      comments: null, // Manual entry
      front_page: null // Manual entry
    }
  };

  // Carry over previous HN data if available
  const lastCheckpoint = metrics.checkpoints[metrics.checkpoints.length - 1];
  if (lastCheckpoint && lastCheckpoint.hn) {
    checkpoint.hn.upvotes_1h = lastCheckpoint.hn.upvotes_1h;
    checkpoint.hn.upvotes_6h = lastCheckpoint.hn.upvotes_6h;
    checkpoint.hn.upvotes_24h = lastCheckpoint.hn.upvotes_24h;
    checkpoint.hn.comments_6h = lastCheckpoint.hn.comments_6h;
  }

  // Track milestones
  if (elapsed.totalHours >= 1 && !checkpoint.hn.upvotes_1h) {
    checkpoint.hn.upvotes_1h = null; // To be filled
  }
  if (elapsed.totalHours >= 6 && !checkpoint.hn.upvotes_6h) {
    checkpoint.hn.upvotes_6h = null;
    checkpoint.hn.comments_6h = null;
  }
  if (elapsed.totalHours >= 24 && !checkpoint.hn.upvotes_24h) {
    checkpoint.hn.upvotes_24h = null;
  }

  return checkpoint;
}

/**
 * Initialize launch
 */
async function initializeLaunch(hnPostUrl) {
  console.log('🚀 Initializing launch monitoring...\n');

  const githubStats = await fetchGitHubStats();

  if (!githubStats) {
    console.error('[ERROR] Cannot initialize - GitHub API unavailable');
    process.exit(1);
  }

  const metrics = {
    launch: {
      date: new Date().toISOString(),
      status: 'live',
      hn_post_url: hnPostUrl || null,
      baseline_stars: githubStats.stars,
      baseline_forks: githubStats.forks
    },
    checkpoints: [],
    targets: TARGETS
  };

  saveMetrics(metrics);

  console.log(`[OK] Launch initialized`);
  console.log(`    Baseline stars: ${metrics.launch.baseline_stars}`);
  console.log(`    Baseline forks: ${metrics.launch.baseline_forks}`);
  console.log(`    HN Post URL: ${metrics.launch.hn_post_url || 'Not set'}`);
  console.log('\n💡 Next step: After 1 hour, run: node scripts/monitor-launch.js\n');
}

/**
 * Update HN metrics manually
 */
async function updateHNMetrics(metrics) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    const elapsed = getElapsedTime(metrics.launch.date);
    const checkpoint = metrics.checkpoints[metrics.checkpoints.length - 1] || {};

    console.log('\n📝 Enter current HN metrics:');
    console.log(`   Elapsed time since launch: ${elapsed.hours}h ${elapsed.minutes}m\n`);

    const questions = [];

    // Always ask for current upvotes
    questions.push({
      key: 'upvotes',
      prompt: `Current upvotes (current: ${checkpoint.hn?.upvotes || 'N/A'}): `,
      milestone: null
    });

    // Always ask for current comments
    questions.push({
      key: 'comments',
      prompt: `Current comments (current: ${checkpoint.hn?.comments || 'N/A'}): `,
      milestone: null
    });

    // Ask front page status
    questions.push({
      key: 'front_page',
      prompt: `On front page? (y/n, current: ${checkpoint.hn?.front_page ? 'Yes' : 'No'}): `,
      milestone: null,
      boolean: true
    });

    // Milestone tracking
    if (elapsed.totalHours >= 1 && checkpoint.hn?.upvotes_1h === null || checkpoint.hn?.upvotes_1h === undefined) {
      questions.push({
        key: 'upvotes_1h',
        prompt: `Upvotes at 1h milestone: `,
        milestone: '1h'
      });
    }
    if (elapsed.totalHours >= 6 && (checkpoint.hn?.upvotes_6h === null || checkpoint.hn?.upvotes_6h === undefined)) {
      questions.push({
        key: 'upvotes_6h',
        prompt: `Upvotes at 6h milestone: `,
        milestone: '6h'
      });
      questions.push({
        key: 'comments_6h',
        prompt: `Comments at 6h milestone: `,
        milestone: '6h'
      });
    }
    if (elapsed.totalHours >= 24 && (checkpoint.hn?.upvotes_24h === null || checkpoint.hn?.upvotes_24h === undefined)) {
      questions.push({
        key: 'upvotes_24h',
        prompt: `Upvotes at 24h milestone: `,
        milestone: '24h'
      });
    }

    let index = 0;

    const askQuestion = () => {
      if (index >= questions.length) {
        rl.close();
        resolve(metrics);
        return;
      }

      const q = questions[index];

      rl.question(q.prompt, (answer) => {
        if (q.boolean) {
          checkpoint.hn = checkpoint.hn || {};
          checkpoint.hn[q.key] = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
        } else if (q.milestone) {
          checkpoint.hn = checkpoint.hn || {};
          checkpoint.hn[q.key] = parseInt(answer) || 0;
        } else {
          checkpoint.hn = checkpoint.hn || {};
          checkpoint.hn[q.key] = parseInt(answer) || 0;
        }

        // Also update current value for milestone questions
        if (q.milestone && q.key.startsWith('upvotes')) {
          checkpoint.hn.upvotes = checkpoint.hn[q.key];
        }
        if (q.milestone && q.key === 'comments_6h') {
          checkpoint.hn.comments = checkpoint.hn.comments_6h;
        }

        index++;
        askQuestion();
      });
    };

    askQuestion();
  });
}

/**
 * Mark launch as completed
 */
function completeLaunch(metrics) {
  metrics.launch.status = 'completed';
  metrics.launch.completed_at = new Date().toISOString();
  saveMetrics(metrics);
  console.log('\n[OK] Launch marked as completed');
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  // Check if metrics file exists
  let metrics = loadMetrics();

  // Handle commands
  if (args.includes('--init')) {
    const hnUrl = args.find(a => a.startsWith('--hn-url='));
    await initializeLaunch(hnUrl ? hnUrl.split('=')[1] : null);
    return;
  }

  if (args.includes('--update-hn')) {
    if (metrics.checkpoints.length === 0) {
      console.error('[ERROR] No checkpoints found. Run --init first.');
      process.exit(1);
    }
    await updateHNMetrics(metrics);
    saveMetrics(metrics);
    displaySummary(metrics);
    return;
  }

  if (args.includes('--complete')) {
    completeLaunch(metrics);
    displaySummary(metrics);
    return;
  }

  if (args.includes('--reset')) {
    console.log('[WARN] This will delete all metrics. Confirm with --reset-confirm');
    return;
  }

  if (args.includes('--reset-confirm')) {
    fs.unlinkSync(METRICS_FILE);
    console.log('[OK] Metrics file deleted');
    return;
  }

  // Default: create checkpoint and display
  if (metrics.launch.status === 'pending') {
    console.log('ℹ️  Launch not initialized. Run: node scripts/monitor-launch.js --init --hn-url=<HN_POST_URL>');
    displaySummary(metrics);
    return;
  }

  const checkpoint = await createCheckpoint(metrics);
  if (checkpoint) {
    metrics.checkpoints.push(checkpoint);
    saveMetrics(metrics);
  }

  displaySummary(metrics);
}

// Show usage help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
url-to-md Launch Monitor

Usage:
  node scripts/monitor-launch.js [command]

Commands:
  (no args)              Create checkpoint and show summary
  --init                 Initialize launch tracking
  --init --hn-url=<URL>  Initialize with HN post URL
  --update-hn            Manually update HN metrics (upvotes, comments)
  --complete             Mark launch as completed
  --reset --reset-confirm  Delete all metrics

Examples:
  node scripts/monitor-launch.js --init --hn-url=https://news.ycombinator.com/item?id=12345
  node scripts/monitor-launch.js
  node scripts/monitor-launch.js --update-hn
  node scripts/monitor-launch.js --complete

The script runs on an hourly schedule during launch:
  - Fetches GitHub stats (stars, forks, watchers)
  - Tracks progress against targets
  - Stores all data in launch-metrics.json
`);
  process.exit(0);
}

main().catch(error => {
  console.error(`[FATAL] ${error.message}`);
  process.exit(1);
});
