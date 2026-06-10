# url-to-md DevOps Setup

## Repository
- **URL**: https://github.com/eylulsenakumral/url-to-md
- **Branch**: main
- **Language**: Node.js (ESM)

## Deployment Workflow

### NPM Publish
Triggered on tag push `v*.*.*`.

To publish a new version:
```bash
git tag v0.2.0
git push origin v0.2.0
```

### Required Secrets
Add to GitHub repo settings > Secrets and variables > Actions:

- **NPM_TOKEN**: npm automation token (create at https://www.npmjs.com/settings/tokens)
  - Required for: `npm publish --access public`
  - Granularity: Repository
  - Automation: Create a new token

## Local Development

### Install
```bash
git clone https://github.com/eylulsenakumral/url-to-md.git
cd url-to-md
npm install
```

### Test
```bash
npm start -- https://example.com
```

### Build
This is a CLI tool - no build step required.

## Files Structure
```
├── src/cli.js        # CLI entry point
├── src/convert.js    # Conversion logic
├── package.json      # NPM package config
└── .github/workflows/
    └── npm-publish.yml # CI/CD for NPM
```

## Monitoring
Check workflow runs at: https://github.com/eylulsenakumral/url-to-md/actions
