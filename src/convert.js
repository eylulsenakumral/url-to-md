/**
 * convert - Fetch URL and convert to markdown
 */

import fetch from 'node-fetch';
import TurndownService from 'turndown';
import * as cheerio from 'cheerio';

// Constants (was magic numbers)
const MIN_CONTENT_LENGTH = 500;
const FALLBACK_MIN_LENGTH = 200;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const BLOAT_SELECTORS = 'script, style, iframe, nav, footer, header, .ad, .advertisement, .sidebar, .comments, .newsletter, .popup, .social, .share';

const CONTENT_SELECTORS = [
  'article',
  'main',
  '.content',
  '.post-content',
  '.article-content',
  '[role="main"]'
];

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-'
});

export async function convertUrl(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove bloat
  $(BLOAT_SELECTORS).remove();

  // Get main content
  const title = $('h1').first().text().trim() || $('title').text().trim() || 'Untitled';

  let content = '';

  // Try to find main content (extracted logic, was inline loop)
  for (const selector of CONTENT_SELECTORS) {
    const $el = $(selector).first();
    if ($el.length && $el.html().length > MIN_CONTENT_LENGTH) {
      content = $el.html();
      break;
    }
  }

  // Fallback to body
  if (!content || content.length < FALLBACK_MIN_LENGTH) {
    content = $('body').html();
  }

  // Convert to markdown
  let markdown = turndown.turndown(content);

  // Add title
  markdown = `# ${title}\n\n` + markdown;

  return markdown;
}
