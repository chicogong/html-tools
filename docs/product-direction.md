# WebUtils Product Direction

WebUtils is not just a website with many tools. It is a collection of local-first HTML tools that can be opened online, shared as URLs, downloaded for offline use, and improved by contributors with minimal project knowledge.

## Positioning

WebUtils should become a trusted local-first toolbox for small, high-frequency tasks.

Users should be able to solve a task without installing software, creating an account, uploading private data, or waiting for a heavy app to load.

## Product Principles

1. **Local-first by default**
   Tools should process data in the browser whenever technically possible. Text, files, images, passwords, and generated output should not be sent to a server.

2. **Standalone HTML as the unit of value**
   Each tool should be understandable and useful as an individual HTML page. A tool URL should be shareable, bookmarkable, searchable, and eventually downloadable as a standalone file.

3. **Zero-build contribution path**
   Contributors should be able to add or improve a tool by editing one HTML file and one `tools.json` entry, then running sync and tests. The contribution path should stay simple enough for non-framework contributors.

4. **Shared source, standalone distribution**
   Source files should keep using shared assets such as `assets/css/tool-base.css` and `assets/js/tool-chrome.js` to avoid duplicating the same UI shell in 1000+ files. Download/export flows can inline those shared assets into standalone HTML when needed.

5. **Quality over raw tool count**
   With 1000+ tools already available, the main opportunity is quality: better discovery, clearer results, consistent interactions, mobile usability, privacy messaging, and reliable SEO metadata.

## Product Modes

### 1. Online Toolbox

The homepage is the discovery layer:

- Search
- Categories
- Favorites
- Recent tools
- Popular tools
- Related tools

This mode is optimized for finding the right tool quickly.

### 2. Single Tool Page

Each tool page is a standalone product surface:

- Direct URL access
- SEO metadata and structured data
- Clear privacy expectation
- Local processing
- Copy/export actions
- Mobile-friendly layout

This mode is optimized for completing one task.

### 3. Downloadable Tool

Each tool should eventually be exportable as a single `.html` file that can be opened via `file://`.

The exported file should include:

- Tool HTML
- Tool-specific CSS and JavaScript
- Inlined shared base CSS
- Inlined shared chrome JavaScript where appropriate
- A short source and privacy comment

External CDN dependencies should be handled explicitly. Tools that need CDN libraries can still work online, but downloadable exports should either inline the dependency when legally and technically reasonable or clearly mark the dependency.

### 4. Community-Built Tool

The contribution model should make a tool feel like a small HTML app that anyone can improve.

A good contribution path:

1. Copy or generate a standard tool template.
2. Implement one tool in `tools/<category>/<name>.html`.
3. Register it in `tools.json`.
4. Run `npm run sync`.
5. Run `npm run lint && npm test`.

Future improvements can include a `create:tool` script that generates the template and metadata skeleton.

## Quality Baseline For Tools

Every registered tool should have:

- Valid standalone HTML structure
- Canonical URL
- Useful title and description
- `tool-base.css` for shared design foundations
- `tool-chrome.js` for the shared navigation/theme shell
- Clear local-first privacy behavior when user data is processed
- Copy/export feedback that handles failure
- Mobile layout that remains usable
- No placeholder copy, temporary scripts, or hardcoded local machine paths

## Near-Term Roadmap

1. **Stabilize new-tool quality**
   Make sure every new tool follows the quality baseline before it is registered.

2. **Improve discovery**
   Search and category navigation matter more as the tool count grows. Improve ranking, synonyms, recently used tools, and related-tool suggestions.

3. **Standalone export prototype**
   Build a small export script for one or a few representative tools. The goal is to validate true single-file downloads without changing source architecture.

4. **Contribution template**
   Create a standard new-tool template with SEO metadata, JSON-LD, shared base assets, privacy copy, and common interactions.

5. **High-value tool polish**
   Pick the highest-value tools and improve them deeply instead of adding many shallow tools.

## Non-Goals

- Do not turn WebUtils into a heavy SaaS product that requires accounts or server-side storage.
- Do not duplicate shared chrome and base CSS into every source HTML file.
- Do not optimize only for tool count.
- Do not make simple tools depend on external services unless the tool category requires it.
- Do not hide local-first behavior behind unclear privacy language.

## North Star

When users have a small task, they should trust WebUtils enough to open it first, solve the task locally, and keep or share the tool as a plain HTML page.
