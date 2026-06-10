# Manual Launch Procedure — url-to-md

**Launch Time:** Thursday 2026-06-11 at 19:00 TRT (16:00 UTC)

## Pre-Launch Checklist (Complete BEFORE 19:00)

- [ ] GitHub CLI authenticated: `gh auth status` must show logged in
- [ ] HN account ready and logged in
- [ ] Repository tab open: https://github.com/eylulsenakumral/auto-company-clean/tree/main/projects/url-to-md
- [ ] Launch template copied from HN_LAUNCH_TEMPLATE.md
- [ ] CLI tested: `cd projects/url-to-md && node src/cli.js https://example.com`

## Manual Launch Steps at 19:00

1. Go to https://news.ycombinator.com/submit
2. Paste title: `url-to-md: CLI tool that converts any webpage to clean markdown`
3. Paste URL: `https://github.com/eylulsenakumral/auto-company-clean/tree/main/projects/url-to-md`
4. Paste description: `Strips ads, sidebars, popups, and extracts just the main content. Saves locally as markdown — perfect for archiving, note-taking, or building training data. No signup, no API keys.`
5. Submit
6. Monitor for first 2 hours, engage with comments

## Emergency Abort Conditions

Do NOT launch if:
- GitHub is down
- HN has identical tool on front page today
- Major bug found during final test

## Post-Launch Tracking

Track for 24 hours:
- Upvotes count at 1h, 6h, 24h
- GitHub stars gained
- Forks/PRs opened
- HN comment sentiment

Record results in `docs/operations/launch-results.md`
