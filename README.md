# url-to-md

![GitHub stars](https://img.shields.io/github/stars/eylulsenakumral/auto-company-clean?style=social)
![License](https://img.shields.io/github/license/eylulsenakumral/auto-company-clean)

Convert any webpage to clean markdown. Strip ads, bloat, clutter.

**Repository:** [github.com/eylulsenakumral/auto-company-clean](https://github.com/eylulsenakumral/auto-company-clean/tree/main/projects/url-to-md)

## Installation

```bash
git clone https://github.com/eylulsenakumral/auto-company-clean.git
cd auto-company-clean/projects/url-to-md
npm install
```

Run with:
```bash
node src/cli.js https://example.com
```

Or add to your PATH (optional):
```bash
# Add this to your .bashrc/.zshrc:
export PATH="$PATH:/path/to/auto-company-clean/projects/url-to-md/src"
# Then run directly:
url2md https://example.com
```

## Usage

```bash
node src/cli.js https://example.com/article
node src/cli.js https://example.com --output=my-article.md
```

## What it does

- Removes ads, sidebars, comments, popups
- Extracts main content only
- Converts to clean markdown
- Saves locally — no cloud, no tracking

## Use cases

- Save articles for offline reading
- Strip bloat from recipe sites
- Clean up blog posts before sharing
- Archive web content in git

## License

MIT
