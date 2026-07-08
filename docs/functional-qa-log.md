# Functional QA Log

This log tracks category-by-category functional validation for all tools. Page load/runtime smoke is not counted as full functional QA unless the tool's primary workflow was exercised.

## 2026-07-06

### calculator

- Scope: 54 tools in `tools/calculator/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-safe.cjs calculator`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-calculator-safe.json`.
- Result: 54 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/calculator/scientific.html`: clicked `2`, `+`, `3`, `=`, then `x²`; verified display changed to `5` then `25` with no page/console errors.
- `tools/calculator/programmer.html`: switched to hexadecimal, clicked `A`, `+`, `5`, `=`; verified HEX `F`, DEC `15`, BIN `1111` with no page/console errors.
- Fixes made during QA:
- `tools/calculator/discount-calculator.html`: guarded missing `#theme-icon` access so saved light theme no longer throws during startup.
- `tools/calculator/programmer.html`: exposed `inputDigit` and `inputOperator` on `window` so inline calculator buttons work.
- `tools/calculator/scientific.html`: exposed `inputDigit` and `inputOperator` on `window` so inline calculator buttons work.
- `tools/calculator/function-plotter.html`: retained coordinate range guards to avoid invalid/equal axis ranges causing pathological plotting loops.
- Verification after fixes:
- `npm run lint`
- `npm test`
- `git diff --check`

### converter

- Scope: 38 tools in `tools/converter/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-safe.cjs converter`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-converter-safe.json`.
- Result: 38 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/converter/binary-translator.html`: entered `Hi` in text and verified binary `01001000 01101001`, decimal `72 105`, hex `48 69`; entered binary `01001000 01101001` and verified text `Hi`; clicked load sample and verified `Hello, World!` with no page/console errors.
- Fixes made during QA:
- `tools/converter/binary-translator.html`: exposed `clearAll`, `loadSample`, and `copyValue` on `window` so inline buttons work.
- Verification after fixes:
- Re-ran converter functional QA: 38 passed, 0 failed.

### generator

- Scope: 59 tools in `tools/generator/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-safe.cjs generator`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-generator-safe.json`.
- Result: 59 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/generator/qrcode-scanner.html`: mocked `jsQR`, uploaded a PNG through the file input, verified result `https://example.com/qr` and scan history with no page/console errors.
- `tools/generator/gitignore-generator.html`: selected the Python template and verified output includes both Node.js and Python ignore patterns with no page/console errors.
- `tools/generator/htaccess-generator.html`: enabled HTTPS and Gzip options and verified generated output includes both `Force HTTPS` and `Gzip Compression` sections with no page/console errors.
- `tools/generator/wifi-qr.html`: entered SSID/password, toggled hidden network, changed color and size, verified local 300x300 canvas generation and no external QR API request.
- Fixes made during QA:
- `tools/generator/gitignore-generator.html`: exposed `toggle` and `copy` on `window`; guarded missing `#theme-icon` access.
- `tools/generator/htaccess-generator.html`: exposed `toggleOption`, `generate`, and `copyCode` on `window`; guarded missing `#theme-icon` access.
- `tools/generator/wifi-qr.html`: removed dependency on `api.qrserver.com`, generated QR-style canvas locally, and exposed `generateQR` / `updateSizeDisplay` for inline handlers.
- Verification after fixes:
- Re-ran generator functional QA: 59 passed, 0 failed.

### text

- Scope: 65 tools in `tools/text/`.
- Automated functional pass: enhanced textarea-aware runner based on `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-safe.cjs`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-text-safe.json`.
- Result: 65 passed, 0 failed, 0 no-action warnings.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/text/text-randomizer.html`: set light theme, entered `one two three`, selected word mode, clicked reverse and verified `three two one`, then clicked randomize and verified non-empty output with no page/console errors.
- Fixes made during QA:
- `tools/text/text-randomizer.html`: guarded missing `#theme-icon` access and made copy feedback safe when called outside a direct click event.
- QA runner improvement:
- Added textarea input coverage and skipped readonly textareas so text tools exercise their primary workflows without overwriting output fields.
- Verification after fixes:
- Re-ran text functional QA: 65 passed, 0 failed, 0 no-action warnings.

### media

- Scope: 57 tools in `tools/media/` plus registered photography paths in the media category.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs media`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-media-safe.json`.
- Supplemental upload/device pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/media-upload-supplemental.json`.
- Result: 57 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- 31 upload/device-focused no-action tools were exercised with local PNG/GIF/ICO/WAV/PDF samples or a mocked camera stream.
- `tools/media/camera-demo.html`: mocked `getUserMedia`, started camera, captured a photo, and verified one gallery item with no page/console errors.
- `tools/media/screen-recorder.html`: clicked start in unsupported Playwright environment and verified user-facing error toast with no page/console errors.
- `tools/media/pdf-compress.html`: uploaded a PDF sample, verified page count, clicked compress, and verified a user-facing error message without page/console errors for unsupported sample compression.
- Fixes made during QA:
- `tools/media/screen-recorder.html`: added missing toast container, guarded toast lookup, exposed `stopRecording`, and avoided logging expected unsupported-recording failures as console errors.
- `tools/media/image-compressor.html`: added the hidden canvas required by the compression pipeline.
- `tools/media/gif-maker.html`: wrapped the GIF worker in a same-origin Blob worker script to avoid cross-origin Worker construction failures.
- `tools/media/pdf-compress.html`: replaced console/alert compression failure handling with an in-page error box.
- Verification after fixes:
- Re-ran media functional QA: 57 passed, 0 failed.
- Re-ran media supplemental upload/device QA: 31 passed, 0 failed.

### dev

- Scope: 205 tools in `tools/dev/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs dev`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-dev-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/dev-supplemental.json` plus targeted rechecks for `docker-compose-generator.html` and `keycode.html`.
- Result: 205 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- 12 no-action tools were exercised with keyboard events, clipboard paste events, local HAR/PO/XLSX/PNG samples, or generator-specific template flows.
- `tools/dev/svg-path-editor.html`: verified with a valid SVG path sample instead of generic text input.
- `tools/dev/geojson-viewer.html`: loaded the built-in GeoJSON example, verified feature/point stats, and treated map tile network failures as non-functional external resource noise.
- `tools/dev/clipboard-viewer.html`: dispatched a paste event with `text/plain` content and verified rendered clipboard content.
- `tools/dev/docker-compose-generator.html`: added the Nginx template, saved the service, and verified generated `docker-compose.yml`.
- `tools/dev/keycode.html`: sent `A` and `Enter` keyboard events and verified key data plus history entries.
- Fixes made during QA:
- `tools/dev/docker-compose-generator.html`: restored the missing service edit modal required by template editing/saving.
- `tools/dev/keycode.html`: renamed local key history storage to avoid colliding with browser `window.history`, and guarded the optional theme button.
- QA runner fixes:
- SVG/path textareas now receive valid path data.
- GeoJSON/JSON textareas now receive valid JSON data.
- External map tile load failures are ignored as resource noise.
- Verification after fixes:
- Re-ran dev functional QA: 205 passed, 0 failed.

### life

- Scope: 67 tools in `tools/life/` plus registered life-category paths under `tools/social/`, `tools/gardening/`, `tools/lifestyle/`, `tools/music/`, `tools/astronomy/`, `tools/weather/`, `tools/parenting/`, `tools/diy/`, and `tools/shopping/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs life`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-life-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/life-supplemental.json`.
- Result: 67 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- 6 no-action tools were exercised with targeted input/select/button flows or content assertions.
- `tools/social/event-countdown.html`: verified countdown form path and page state.
- `tools/gardening/plant-watering.html`: verified plant form options and reminder UI.
- `tools/lifestyle/daily-affirmation.html`: verified generated affirmation content and category UI.
- `tools/music/chord-finder.html`: verified chord lookup content.
- `tools/gardening/plant-care-guide.html`: verified plant care entries.
- `tools/astronomy/stargazing-tonight.html`: verified stargazing and moon-phase content.
- Fixes made during QA:
- `tools/life/color-picker.html`: split malformed JSON-LD/business script block so inline handlers execute, and guarded optional theme icon updates.
- `tools/life/password-generator.html`: split malformed JSON-LD/business script block so generation handlers execute, and guarded optional theme icon updates.
- `tools/life/word-counter.html`: split malformed JSON-LD/business script block so text analysis handlers execute, and guarded optional theme icon updates.
- `tools/weather/uv-index-guide.html`: clamped/validated UV display input and added a level fallback for out-of-range values.
- Verification after fixes:
- Re-ran life functional QA: 67 passed, 0 failed.
- Re-ran life supplemental QA: 6 passed, 0 failed.

### design

- Scope: 48 tools in `tools/design/` plus registered design-category paths under `tools/art/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs design`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-design-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/design-supplemental.json`.
- Result: 48 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/art/color-wheel.html`: exercised color inputs/options and verified palette/content updates.
- `tools/design/css-clip-path-generator.html`: exercised shape controls and verified clip-path/CSS content.
- Fixes made during QA:
- 19 design generator pages had business JS accidentally embedded inside a trailing `application/ld+json` block. Split the JSON-LD and business script blocks so inline handlers execute.
- Affected pages included color palette, contrast checker, animation/color/font/spacing generators, clip-path/transform/transition/cursor/scrollbar/triangle/blob/pattern/loader/button/card/text-gradient generators.
- Verification after fixes:
- Re-ran design functional QA: 48 passed, 0 failed.
- Re-ran design supplemental QA: 2 passed, 0 failed.

### ai

- Scope: 43 tools/pages in `tools/ai/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs ai`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-ai-safe.json`.
- Supplemental static/content pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/ai-supplemental.json`.
- Result: 43 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- 38 no-action pages were validated as static guide/resource pages with title, H1, body size, headings, links, cards/tables, and domain-specific content assertions.
- `tools/ai/ai-models.html`: verified model comparison table rows and filter controls.
- `tools/ai/prompt-templates.html`: verified prompt template cards and category content.
- Interactions covered by automated QA included `ai-pricing`, `claude-code-ecosystem`, `cursor-shortcuts`, `deepseek-guide`, and `token-counter`.
- Fixes made during QA:
- No product code changes were required for `ai`.
- Verification after fixes:
- Re-ran ai functional QA: 43 passed, 0 failed.
- Re-ran ai supplemental content QA: 38 passed, 0 failed.

### travel

- Scope: 39 tools in `tools/travel/` plus registered travel-category paths under `tools/automotive/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs travel`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-travel-safe.json`.
- Supplemental upload pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/travel-supplemental.json`.
- Result: 39 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/travel/gpx-track-viewer.html`: uploaded a local GPX track, verified track name, distance, climb/descent, point count, and map/chart rendering.
- Fixes made during QA:
- `tools/travel/packing-list.html`: split malformed JSON-LD/business script block so `generateList` and related handlers execute.
- `tools/travel/luggage-calculator.html`: split malformed JSON-LD/business script block and moved `LS_KEY` into the executable script.
- `tools/travel/toll-calculator.html`: split malformed JSON-LD/business script block and added the missing toast status container used by `showToast`.
- Verification after fixes:
- Re-ran travel functional QA: 39 passed, 0 failed.
- Re-ran travel supplemental QA: 1 passed, 0 failed.

### office

- Scope: 34 tools in `tools/office/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs office`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-office-safe.json`.
- Result: 34 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had at least one safe primary interaction.
- Fixes made during QA:
- `tools/office/meeting-timer.html`: split malformed JSON-LD/business script block so timer controls execute.
- Verification after fixes:
- Re-ran office functional QA: 34 passed, 0 failed.

### health

- Scope: 30 tools in `tools/health/` plus registered health-category paths under `tools/sports/` and `tools/fitness/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs health`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-health-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/health-supplemental.json`.
- Result: 30 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/health/medication-reminder.html`: added a medication with two reminders and verified totals plus today's schedule.
- `tools/health/symptom-checker.html`: selected symptom/body-area UI and verified symptom guidance content.
- `tools/sports/score-keeper.html`: incremented scores and verified scoreboard changes.
- Fixes made during QA:
- `tools/health/heart-rate-zone.html`: split malformed JSON-LD/business script block so calculator handlers execute.
- `tools/health/medication-reminder.html`: restored the missing add/edit medication modal expected by `showAddModal`.
- Verification after fixes:
- Re-ran health functional QA: 30 passed, 0 failed.
- Re-ran health supplemental QA: 3 passed, 0 failed.

### data

- Scope: 30 tools in `tools/data/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs data`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-data-safe.json`.
- Result: 30 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- Split malformed JSON-LD/business script blocks across data chart and transform/validator pages so inline handlers execute.
- Added missing `#toast` status containers to data chart/export/transform pages that call `showToast`.
- Verification after fixes:
- Re-ran data functional QA: 30 passed, 0 failed.

### fun

- Scope: 22 tools in `tools/fun/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs fun`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-fun-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/fun-supplemental.json`.
- Result: 22 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- 8 no-action tools were exercised with targeted click/keyboard flows for coin flip, dice roller, reaction tests, fortune teller, click counter, and color-blind test.
- Fixes made during QA:
- No product code changes were required for `fun`.
- Verification after fixes:
- Re-ran fun functional QA: 22 passed, 0 failed.
- Re-ran fun supplemental QA: 8 passed, 0 failed.

### game

- Scope: 22 tools in `tools/game/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs game`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-game-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/game-supplemental.json`.
- Result: 22 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- 8 no-action game tools were exercised with targeted board/card/cell clicks, direction keys, number entry, and start/reset flows for 2048, minesweeper, sudoku, gomoku, memory cards, color match, reaction game, and tic-tac-toe.
- Fixes made during QA:
- No product code changes were required for `game`.
- Verification after fixes:
- Re-ran game functional QA: 22 passed, 0 failed.
- Re-ran game supplemental QA: 8 passed, 0 failed.

### network

- Scope: 22 tools in `tools/network/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs network`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-network-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/network-supplemental.json`.
- Result: 22 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/network/device-info.html`: verified rendered screen/browser/system/network/hardware capability data and refresh path.
- `tools/network/port-scanner.html`: clicked simulated scan, verified checking/final port statuses and Web-service filter behavior.
- Fixes made during QA:
- No product code changes were required for `network`.
- Verification after fixes:
- Re-ran network functional QA: 22 passed, 0 failed.
- Re-ran network supplemental QA: 2 passed, 0 failed.

### finance

- Scope: 21 tools in `tools/finance/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs finance`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-finance-safe.json`.
- Result: 21 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `finance`.
- Verification after fixes:
- Re-ran finance functional QA: 21 passed, 0 failed.

### education

- Scope: 20 tools in `tools/education/` plus registered language-category paths.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs education`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-education-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/education-supplemental.json`.
- Result: 20 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/education/reading-tracker.html`: exercised visible form inputs/add flow and verified reading tracker UI content.
- `tools/education/multiplication-table.html`: exercised practice/table controls and verified multiplication content.
- `tools/education/solar-system-explorer.html`: selected solar-system content and verified planet detail rendering.
- Fixes made during QA:
- No product code changes were required for `education`.
- Verification after fixes:
- Re-ran education functional QA: 20 passed, 0 failed.
- Re-ran education supplemental QA: 3 passed, 0 failed.

### math

- Scope: 19 tools in `tools/math/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs math`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-math-safe.json`.
- Result: 19 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `math`.
- Verification after fixes:
- Re-ran math functional QA: 19 passed, 0 failed.

### food

- Scope: 18 tools in `tools/food/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs food`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-food-safe.json`.
- Result: 18 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- `tools/food/meal-planner.html`: handled clipboard write rejection for export/shopping-list copy flows so denied clipboard permission no longer creates an unhandled page error.
- Verification after fixes:
- Re-ran food functional QA: 18 passed, 0 failed.

### business

- Scope: 17 tools in `tools/business/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs business`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-business-safe.json`.
- Result: 17 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `business`.
- Verification after fixes:
- Re-ran business functional QA: 17 passed, 0 failed.

### realestate

- Scope: 16 tools in `tools/realestate/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs realestate`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-realestate-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/realestate-supplemental.json`.
- Result: 16 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/realestate/loan-compare.html`: added a new loan plan through the modal and verified plan cards, monthly/interest charts, and summary cards update.
- Fixes made during QA:
- `tools/realestate/loan-compare.html`: restored the missing add/edit plan modal required by the plan comparison workflow and guarded optional legacy theme icon updates.
- Verification after fixes:
- Re-ran realestate functional QA: 16 passed, 0 failed.
- Re-ran realestate supplemental QA: 1 passed, 0 failed.

### chinese

- Scope: 15 tools in `tools/chinese/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs chinese`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-chinese-safe.json`.
- Result: 15 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `chinese`.
- Verification after fixes:
- Re-ran chinese functional QA: 15 passed, 0 failed.

### crypto

- Scope: 15 tools in `tools/crypto/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs crypto`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-crypto-safe.json`.
- Result: 15 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `crypto`.
- Verification after fixes:
- Re-ran crypto functional QA: 15 passed, 0 failed.

### privacy

- Scope: 14 tools in `tools/privacy/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs privacy`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-privacy-safe.json`.
- Supplemental upload pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/privacy-supplemental.json`.
- Result: 14 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/privacy/metadata-viewer.html`: uploaded a local PNG and verified file, image, and JSON metadata rendering.
- Fixes made during QA:
- No product code changes were required for `privacy`.
- Verification after fixes:
- Re-ran privacy functional QA: 14 passed, 0 failed.
- Re-ran privacy supplemental QA: 1 passed, 0 failed.

### time

- Scope: 14 tools in `tools/time/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs time`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-time-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/time-supplemental.json`.
- Result: 14 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/time/chinese-calendar.html`: verified lunar calendar rendering, month navigation, selected-date details, and absence of `undefined` lunar fields.
- `tools/time/countdown-event.html`: verified empty-state/event countdown page structure and primary add-event entry point.
- Fixes made during QA:
- `tools/time/chinese-calendar.html`: corrected lunar-year day calculation and added safe lunar month/day fallbacks so calendar cells and detail panel no longer render `undefined`.
- Verification after fixes:
- Re-ran time functional QA: 14 passed, 0 failed.
- Re-ran time supplemental QA: 2 passed, 0 failed.

### security

- Scope: 13 tools in `tools/security/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs security`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-security-safe.json`.
- Result: 13 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- `tools/security/hash-generator.html`: split business JS out of a malformed `application/ld+json` block, exposed inline handler functions on `window`, and guarded clipboard/toast feedback.
- Verification after fixes:
- Re-ran security functional QA: 13 passed, 0 failed.

### legal

- Scope: 13 tools in `tools/legal/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs legal`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-legal-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/legal-supplemental.json`.
- Result: 13 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/legal/gdpr-checklist.html`: checked GDPR checklist items and verified progress/score updates.
- Fixes made during QA:
- No product code changes were required for `legal`.
- Verification after fixes:
- Re-ran legal functional QA: 13 passed, 0 failed.
- Re-ran legal supplemental QA: 1 passed, 0 failed.

### social-media

- Scope: 13 tools in `tools/social-media/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs social-media`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-social-media-safe.json`.
- Result: 13 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `social-media`.
- Verification after fixes:
- Re-ran social-media functional QA: 13 passed, 0 failed.

### team-tools

- Scope: 12 tools in `tools/team-tools/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs team-tools`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-team-tools-safe.json`.
- Result: 12 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `team-tools`.
- Verification after fixes:
- Re-ran team-tools functional QA: 12 passed, 0 failed.

### seo

- Scope: 9 tools in `tools/seo/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs seo`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-seo-safe.json`.
- Result: 9 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `seo`.
- Verification after fixes:
- Re-ran seo functional QA: 9 passed, 0 failed.

### productivity

- Scope: 7 tools in `tools/productivity/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs productivity`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-productivity-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/productivity-supplemental.json`.
- Result: 7 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/productivity/pomodoro-plus.html`: verified timer controls and productivity stats UI.
- `tools/productivity/habit-tracker.html`: added a habit and verified habit list/calendar UI updates.
- Fixes made during QA:
- No product code changes were required for `productivity`.
- Verification after fixes:
- Re-ran productivity functional QA: 7 passed, 0 failed.
- Re-ran productivity supplemental QA: 2 passed, 0 failed.

### pets

- Scope: 6 tools in `tools/pets/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs pets`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-pets-safe.json`.
- Supplemental no-action pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/pets-supplemental.json`.
- Result: 6 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- `tools/pets/feeding-schedule.html`: verified feeding reminder/schedule page content and primary status controls.
- Fixes made during QA:
- No product code changes were required for `pets`.
- Verification after fixes:
- Re-ran pets functional QA: 6 passed, 0 failed.
- Re-ran pets supplemental QA: 1 passed, 0 failed.

### ai-coding

- Scope: 5 registered tools/pages in `tools/ai-coding/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs ai-coding`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-ai-coding-safe.json`.
- Supplemental static/content pass: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/ai-coding-supplemental.json`.
- Result: 5 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- 4 wiki pages were validated as static guide pages with H1, multiple headings, links, structured content blocks, body length, and AI-coding domain content assertions.
- Fixes made during QA:
- No product code changes were required for `ai-coding`.
- Verification after fixes:
- Re-ran ai-coding functional QA: 5 passed, 0 failed.
- Re-ran ai-coding supplemental content QA: 4 passed, 0 failed.

### extractor

- Scope: 5 tools in `tools/extractor/`.
- Automated functional pass: `node /var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-runner-resilient.cjs extractor`.
- Result file: `/var/folders/31/q_1h7glx59ddh7xk1yg35vr80000gn/T/opencode/functional-qa-extractor-safe.json`.
- Result: 5 passed, 0 failed.
- Runtime errors: 0 page errors, 0 console errors, 0 failed scripts.
- Manual-style supplemental checks:
- No no-action tools remained after automated QA; every page had safe primary interactions.
- Fixes made during QA:
- No product code changes were required for `extractor`.
- Verification after fixes:
- Re-ran extractor functional QA: 5 passed, 0 failed.

## Full Functional QA Summary

- Registered tools covered: 1087/1087.
- Category functional QA result: all categories passed with 0 remaining failures.
- Supplemental no-action/upload/device/static/game checks: completed for every category that needed them.
- Final verification commands:
- `npm run lint`
- `npm test`
- `git diff --check`
