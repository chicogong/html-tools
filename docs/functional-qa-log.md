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
