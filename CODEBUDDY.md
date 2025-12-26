# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

**WebUtils** - A collection of single-file web tools inspired by Simon Willison's approach. Each tool is a standalone HTML file with inline CSS and JavaScript - no build step required.

**Live site**: https://chicogong.github.io/html-tools/

## Commands

```bash
# Install dependencies (for linting only)
npm install

# Run all linters
npm run lint

# Individual linters
npm run lint:html    # HTMLHint
npm run lint:css     # Stylelint (CSS in HTML files)
npm run lint:js      # ESLint (JS in HTML files)

# Auto-fix CSS issues
npm run lint:fix

# Sync tools list (tools.json → index.html)
npm run sync:tools

# Local development - just open in browser
open index.html              # macOS
python3 -m http.server 8080  # For tools requiring HTTP
```

## Architecture

```
html-tools/
├── index.html              # Tool directory with search and category filtering
├── tools/                  # Individual tool pages (organized by category)
│   ├── dev/                # Developer tools (7 tools)
│   │   ├── json-formatter.html
│   │   ├── json-yaml.html
│   │   ├── jwt-decoder.html
│   │   ├── base64.html
│   │   ├── url-codec.html
│   │   ├── regex-tester.html
│   │   └── clipboard-viewer.html
│   ├── text/               # Text processing tools (3 tools)
│   │   ├── text-diff.html
│   │   ├── markdown-preview.html
│   │   └── word-counter.html
│   ├── time/               # Time & date tools (4 tools)
│   │   ├── timestamp.html
│   │   ├── timestamp-converter.html
│   │   ├── timezone-converter.html
│   │   └── date-calculator.html
│   ├── generator/          # Generators (2 tools)
│   │   ├── uuid-generator.html
│   │   └── qrcode-generator.html
│   ├── privacy/            # Privacy tools (1 tool)
│   │   └── log-masker.html
│   └── media/              # Media tools (4 tools)
│       ├── image-compressor.html
│       ├── image-resize.html
│       ├── svg-render.html
│       └── camera-demo.html
├── package.json            # Lint dependencies only
├── vercel.json             # Vercel deployment config
├── netlify.toml            # Netlify deployment config
└── _headers, _redirects    # Cloudflare Pages config
```

## Tool Structure Pattern

Each tool in `tools/` follows this pattern:

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>[Tool Name] - HTML Tools</title>
  <!-- Google Fonts: JetBrains Mono + Space Grotesk -->
  <style>
    /* CSS Variables for theming (dark theme) */
    :root {
      --bg-deep: #0a0a0f;
      --accent-cyan: #00f5d4;
      /* ... */
    }
    /* All styles inline */
  </style>
</head>
<body>
  <!-- Background grid effect -->
  <div class="bg-grid"></div>
  
  <div class="container">
    <!-- Back link to index -->
    <a href="../../index.html" class="back-link">← 返回</a>
    
    <!-- Tool UI -->
    
    <!-- Footer with GitHub link -->
  </div>

  <script>
    /* All JavaScript inline */
    
    // Common patterns:
    // 1. localStorage persistence (LS_KEY)
    // 2. URL hash state sharing (loadFromUrl/saveToUrl)
    // 3. Clipboard API integration
  </script>
</body>
</html>
```

## Design System

The project uses a **Neo-Brutalist Tech** dark theme:

- **Colors**: `--bg-deep: #0a0a0f`, `--accent-cyan: #00f5d4`, `--accent-magenta: #f72585`
- **Fonts**: JetBrains Mono (code), Space Grotesk (UI)
- **Category accent colors**: dev=cyan, text=blue, time=yellow, generator=magenta, privacy=purple, media=red

## Adding a New Tool

1. Create `tools/[category]/[tool-name].html` following the pattern above
   - Categories: `dev`, `text`, `time`, `generator`, `privacy`, `media`, `security`, `network`, `calculator`, `extractor`, `ai`
2. Add tool metadata to `tools.json`:
   ```json
   {
     "path": "tools/[category]/[tool-name].html",
     "name": "Tool Name",
     "category": "[category]",
     "keywords": "keyword1 keyword2 关键词"
   }
   ```
3. Run `npm run sync:tools` to update index.html
4. Update `README.md` tool list
5. Commit and push (CI will verify sync status)

**Tools Sync Mechanism**:
- `tools.json` is the single source of truth for all tools
- `npm run sync:tools` generates tool cards in index.html from tools.json
- CI checks sync status - build fails if out of sync

## Common Tool Features

Each tool should implement:
- **Paste button**: Read from clipboard
- **Copy button**: Write output to clipboard  
- **Share button**: Encode state to URL hash (`btoa(encodeURIComponent(input))`)
- **Clear button**: Reset state and localStorage
- **Auto-save**: Save to localStorage on input change

## CDN Dependencies

Only use CDN when necessary. Current dependencies:
- `js-yaml` - JSON-YAML conversion
- `jsdiff` - Text diff comparison
- `marked` + `DOMPurify` - Markdown preview
- `QRCode.js` - QR code generation

## CI/CD

- **Lint**: PR triggers HTMLHint + Stylelint + ESLint
- **Tools Sync Check**: CI verifies tools.json and index.html are in sync
- **Deploy**: Push to master auto-deploys to GitHub Pages
- **Release**: Push tag creates GitHub Release
