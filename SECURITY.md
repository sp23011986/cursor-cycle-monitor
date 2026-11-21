# Security & Privacy

## What the extension accesses

| Data | Where it goes | Why |
| :-- | :-- | :-- |
| Cursor's in-app login (only if Cursor allows this extension to use its `vscode.cursor` API) | Kept in memory only; sent **only** to `https://cursor.com`; never written to disk | Usage without any login prompt |
| Your cursor.com session (`WorkosCursorSessionToken`) | Stored in the editor's encrypted **SecretStorage**; sent **only** to `https://cursor.com` | To read your own usage |
| Browser cookie database (Firefox or Chromium-based browsers, read-only temporary copy) | Read locally; the copy is deleted immediately | Automatic connect (can be disabled: `cursorCycleMonitor.autoFetchBrowserCookie`) |
| OS keyring entry for a Chromium browser's cookie key (Keychain / Secret Service or KWallet over D-Bus / DPAPI; not needed for Firefox) | Used locally to decrypt the one cursor.com cookie | Same as above. Background detection never prompts; on macOS it only runs from Connect Account. |
| Claude Code logs (`~/.claude/projects`, read-only) | Token counts only; message content is never stored | Multi-tool spend (`providers.claudeCode`) |
| GitHub sign-in (only if you connect Copilot) | Sent only to `api.github.com` | Copilot premium-request usage |
| Cursor Admin API key (only if you add one) | SecretStorage; sent only to `api.cursor.com` | Team dashboard |
| Alert webhook URL (only if you add one) | SecretStorage; alert text is posted to that URL | Slack / Discord / Teams alerts |
| Account identity (name, email, plan) from cursor.com `/api/auth/me` and Claude Code's `.claude.json` | Shown locally only; masked with the privacy mask; never logged (logs use account IDs) | Showing which account you are viewing |
| Focused project/branch names | Local files in the extension's storage folder (can be hashed) | Cost per project |
| Usage events (model, cost, tokens, timestamps) | Local JSON files in the extension's storage folder (delete with **Delete Local Usage Data**) | History, charts and incremental refresh |
| Exchange rates (optional, off by default) | `api.frankfurter.app` or `api.exchangerate.host` — no personal data sent | Live currency conversion |

- **No telemetry, no analytics, no third-party servers.** Zero runtime dependencies: only Node.js built-ins and OS tools.
- Run **AI Spend Monitor: Delete Local Usage Data** to wipe all cached history and tracking files.
- The extension never decrypts Cursor's own encrypted credential store.
- **Debug reports** (Export Debug Report / Report an Issue) are created only when you ask and never sent automatically. Tokens, cookies, emails, account IDs, webhook URLs, API keys and amounts are removed, and API traces keep only host, path, status and timing (no query strings, headers or bodies).
- Logs never contain tokens, cookies or amounts. "Report an Issue" diagnostics contain only versions, OS, and setting flags.
- Dashboards use a strict Content-Security-Policy (nonce-locked scripts, no remote resources).

## Licensing

- Official builds include `license.dist`, an Ed25519-signed distribution license that is verified locally with the public key embedded in the extension. No license server is contacted and nothing is sent anywhere.
- Personal license keys are stored in the editor's encrypted SecretStorage.

## Reporting a vulnerability

Please report privately via [GitHub Security Advisories](https://github.com/sp23011986/cursor-cycle-monitor/security/advisories/new). Do not open a public issue. You'll get an acknowledgement within 3 working days.
