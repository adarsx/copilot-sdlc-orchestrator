# Architecture: KAN-2

**Issue:** [KAN-2 — Build a simple browser Todo app](https://adarsh0628.atlassian.net/browse/KAN-2)

**Status:** Awaiting Approval

## Overview

Build a static, client-only application. The browser owns the UI and task state; `localStorage` is the only persistence mechanism. Use native HTML, CSS, browser APIs, and Node.js built-ins. There is no backend, framework, or runtime dependency.

## Components

| Component | Responsibility |
| --- | --- |
| `index.html` | Semantic page shell, task-entry form, task list, and accessible status area. Loads the application module. |
| `styles.css` | Minimal responsive layout and visible completed-task styling. |
| `src/tasks.mjs` | Browser-independent task operations: trim and reject blank text, create tasks, toggle completion, and delete tasks. Operations return updated task data and accept an ID generator so tests can use deterministic IDs. |
| `src/app.mjs` | Connects form and list interactions to task operations, renders tasks, and reads/writes browser storage. Uses text-safe DOM APIs for task content. |
| `test/tasks.test.mjs` | Offline `node:test` coverage of add, blank input, toggle, and delete behavior. |
| `scripts/serve.mjs` | Optional small static preview server using Node.js built-ins for a stable browser origin during the real application smoke check. |

## Data and interaction flow

Each task is `{ id, text, completed }`. The app stores the task array as JSON under a namespaced, versioned key (`kan-2:tasks:v1`).

On startup, the app reads and parses the stored array, then renders it. Submitting the form trims the input; blank text is rejected without adding a task. Add, completion-toggle, and delete actions each update task data, persist the resulting array, and render the current state. Native form controls and buttons provide keyboard-operable interactions.

If storage cannot be read or written, the app surfaces an error in the status area rather than reporting a successful save or silently replacing stored data. Task text is inserted as text, not interpreted as markup.

## Verification approach

- Run the focused suite with `node --test`.
- Start the optional static server and use a browser for the real application smoke check: add a whitespace-padded task, confirm its trimmed display, reject blank input, toggle completion, delete a task, refresh and verify persisted text/state, and inspect usability at narrow and wide viewport sizes.
- Record only commands actually run and observed outcomes in the Verification deliverable.
- Keep tests and fixtures local; no network calls or external runtime dependencies.

## Scope boundary

No filters, editing, due dates, accounts, remote services, or additional task features are introduced.
