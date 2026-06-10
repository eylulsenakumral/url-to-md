# Hacker News Launch Template — url-to-md

**Launch Date:** Friday, 2026-06-11 at 19:00 TRT
**Product:** url-to-md v0.1.0
**Repository:** https://github.com/eylulsenakumral/auto-company-clean/tree/main/projects/url-to-md

---

## PRIMARY POST OPTION (Recommended)

### Title
```
url-to-md: CLI tool that converts any webpage to clean markdown
```

### Description
```
Strips ads, sidebars, popups, and extracts just the main content. Saves locally as markdown — perfect for archiving, note-taking, or building training data. No signup, no API keys.

https://github.com/eylulsenakumral/auto-company-clean/tree/main/projects/url-to-md
```

---

## ALTERNATIVE OPTIONS

### Option 2: Privacy Angle
**Title:** `url-to-md: Convert webpages to markdown, entirely offline`

**Description:** `Runs locally, saves to your disk. Zero cloud, zero tracking, zero dependencies on external services. Strips ads, trackers, and clutter — you get clean markdown, nothing leaves your machine.`

### Option 3: Developer Angle
**Title:** `url-to-md: CLI for extracting clean markdown from any webpage`

**Description:** `Pipe URLs, get markdown. Built for scripts, bots, and automated workflows. Strips web clutter so you don't have to write extraction logic yourself.`

---

## POSTING CHECKLIST

- [ ] Verify 19:00 TRT timezone conversion to HN (usually California time)
- [ ] Check HN for similar recent posts (avoid posting same day as competitor)
- [ ] Prepare demo GIF (optional but recommended)
- [ ] Test install one more time: `git clone && cd projects/url-to-md && npm install && node src/cli.js https://example.com`
- [ ] Have GitHub tab open with repo ready to share
- [ ] Prepare to engage for first 2 hours post-launch

---

## RESPONSE STRATEGY

### Positive Comments
**Acknowledge + ask for use cases:**
> "Thanks! What would you use it for? Curious what workflows people have in mind."

### Technical Questions
**Direct answers:**
- "Uses cheerio for HTML parsing + turndown for markdown conversion"
- "MIT license, feel free to fork"
- "Currently CLI only, but web wrapper would be straightforward"

### Comparison Questions
**Honest positioning:**
- "Unlike [competitor], we focus on: local-only, zero-dependency, simple CLI"
- "Reader Mode is great but browser-only; this works in scripts/cron"

### Feature Requests
**Note them, don't promise:**
- "Good idea — added to backlog. No timeline yet but patches welcome."
- "That's interesting. Would you open an issue so we can discuss?"

### Criticism
**Acknowledge valid points:**
- "Fair point on X. We'll consider that for v0.2."
- "You're right — Y could be better. PRs welcome."

### Hostile/Negative
**Don't engage beyond:**
- "Thanks for the feedback. We're always looking to improve."

---

## COMMON QUESTIONS (Prepare Answers)

| Question | Answer |
|----------|--------|
| "Why not just use Reader Mode?" | Browser-only, can't script it. This is for automation/cron. |
| "Does it work behind paywalls?" | Only if you have cookies/auth. We don't bypass paywalls. |
| "Why not use [existing tool]?" | Different focus: local-only, simple CLI, no cloud dependency. |
| "Can I pipe URLs into it?" | Not yet — planned for v0.2. Currently single URL. |
| "What about images?" | Currently text-only. Images in v0.2 roadmap. |
| "Why MIT not AGPL?" | Want to encourage forking and integration. |
| "Can this be a library?" | Yes — `import { convertUrl } from './convert.js'` |
| "Will you add PDF support?" | In backlog. No timeline but PRs welcome. |
| "Why not npm package?" | Coming soon. Currently manual install for simplicity. |
| "What sites does it work best on?" | Blogs, news sites, documentation. Recipe sites need tuning. |

---

## SUCCESS METRICS

Track for 24 hours:
- [ ] Upvotes on launch post
- [ ] GitHub stars gained
- [ ] Forks/PRs opened
- [ ] Direct traffic to repo
- [ ] Any mention in other HN comments/posts

---

## ESCALATION TRIGGERS

**Pause launch if:**
- Major technical bug discovered during final test
- HN has identical tool on front page today
- GitHub is down/unresponsive

**Continue despite:**
- Mixed initial comments (engage constructively)
- Small number of upvotes (HN algorithm is unpredictable)
- Comparison to more established tools (honest positioning wins)

---

*Prepared by Auto Company — Autonomous AI Company*
*Cycle #280 — 2026-06-10*
