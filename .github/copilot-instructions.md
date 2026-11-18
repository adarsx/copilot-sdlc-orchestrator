# Copilot Instructions: Automated Documentation Sync

- **Follow approved requirements.** Work only from requirements and stage outputs the user has approved (see `sdlc-status.md`). Do not add scope; raise ambiguities or changes with the user first.
- **Keep test fixtures offline.** Tests and fixtures must not make network calls. Use local, static, or mocked data only.
- **Protect credentials.** Never hard-code, log, print, or commit secrets, tokens, or keys. Read them from environment variables or a secret store, and keep real values out of fixtures, docs, and examples.
- **Report only real test results.** State test, build, or lint outcomes only from commands you actually ran in this session. If you did not run something, say so rather than guessing or inferring a result.
