# KAN-2 Verification Run Log

## Runtime

- The environment did not have `node` on `PATH`; an initial `node --test` attempt failed with “The term 'node' is not recognized”.
- For validation, a portable Node.js v22.23.5 executable was downloaded from the official Node.js distribution to session-local storage. `Get-AuthenticodeSignature` reported `Valid`; no dependency manifest or repository runtime dependency was added.
- In the commands below, `$nodePath` was set to that session-local executable.

## Automated checks

Command:

```powershell
& $nodePath --test
```

Result: 5 tests passed, 0 failed. Covered trimmed add, blank rejection, completion toggle, deletion, and malformed/duplicate persisted data.

Commands:

```powershell
& $nodePath --check src\app.mjs
& $nodePath --check src\tasks.mjs
& $nodePath --check scripts\serve.mjs
& $nodePath --check test\tasks.test.mjs
git --no-pager diff --check
```

Result: all syntax checks exited successfully; `git diff --check` reported no whitespace errors.

## Local server checks

Command:

```powershell
& $nodePath scripts\serve.mjs
```

Observed startup message: `Todo app available at http://127.0.0.1:4173`.

Requests made with `Invoke-WebRequest -UseBasicParsing` returned:

| URL | Status | Content type |
| --- | --- | --- |
| `http://127.0.0.1:4173/` | 200 | `text/html; charset=utf-8` |
| `http://127.0.0.1:4173/src/app.mjs` | 200 | `text/javascript; charset=utf-8` |
| `http://127.0.0.1:4173/styles.css` | 200 | `text/css; charset=utf-8` |

## Browser smoke check

Opened `http://127.0.0.1:4173/` in the integrated browser and performed these interactions:

1. Submitted `  Browser smoke task  `; the list displayed `Browser smoke task`.
2. Submitted whitespace-only input; the status displayed `Enter a task before adding it.` and the list still contained one task.
3. Toggled completion; the checkbox was checked and the status displayed `Task updated.`.
4. Reloaded the page; the task remained present and checked.
5. Deleted the task; the status displayed `Task deleted.` and the list showed `No tasks yet.`. Reloading retained the empty list.
6. Inspected responsive layout at 320px and 1280px. At 320px the app measured 288px, the document remained 320px wide, and the form stacked vertically. At 1280px the app measured 672px, the document remained 1280px wide, and the form was horizontal. Both screenshots were visually inspected without visible clipping or overflow.

The preview server was stopped after verification; no listener remained on port 4173.
