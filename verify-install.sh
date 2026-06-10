#!/bin/bash
# url-to-md Installation Verification Script
# Run this after npm install to verify the package works correctly

set -e

# Change to script directory
cd "$(dirname "$0")"

echo "=== url-to-md Verification ==="
echo ""

# Check we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: Could not find package.json"
    exit 1
fi

echo "1. Checking package.json dependencies..."
if grep -q '"cheerio"' package.json; then
    echo "   ✅ cheerio is declared"
else
    echo "   ❌ cheerio is MISSING from package.json"
    exit 1
fi

# Check html-to-text was removed
if grep -q '"html-to-text"' package.json; then
    echo "   ⚠️  html-to-text still declared (unused)"
else
    echo "   ✅ html-to-text removed (was unused)"
fi

echo ""
echo "2. Checking node_modules..."
if [[ -d "node_modules/cheerio" ]]; then
    echo "   ✅ cheerio is installed"
else
    echo "   ❌ cheerio not found in node_modules"
    exit 1
fi

echo ""
echo "3. Testing CLI with example.com..."
OUTPUT=$(node src/cli.js https://example.com 2>&1)
if [[ -f "page.md" ]] && grep -q "# Example Domain" page.md; then
    echo "   ✅ CLI produces expected output"
    rm -f page.md
else
    echo "   ❌ CLI test failed"
    echo "   Output: $OUTPUT"
    [[ -f "page.md" ]] && cat page.md && rm -f page.md
    exit 1
fi

echo ""
echo "=== All checks passed! ✅ ==="
echo "url-to-md is ready to use."
