# Changelog

## [3.0.0] — 2026-11-21

### Fixed: slow first load after updating
- After a reload, the new window waited about 2 minutes for the previous (already closed) window's poller lease to expire. Leases now record the holder's process ID: a dead or older-version holder is taken over **immediately**.
- Installs from before multi-account support showed **zeros** until a fresh sync finished, because their history file wasn't migrated. The account ID is now recovered from the stored session **before** the first render, and the old history is moved into place.
- Two-phase loading: cached numbers are shown instantly, the current cycle is fetched first (about 2–3 s), and the 130-day history, Claude Code and other tools load in the background.

### Budgets come from your account; alerts at 60% → 80% → 100%
- **No budget to set up.** Alerts use the limit Cursor's API reports for you: a spend limit (yours, or one set for you by your team admin), the team's shared on-demand pool, or your included usage when on-demand is turned off. The personal budget setting now applies **only** when your account has no limit, and an account or admin limit always takes priority.
- **Alert ladder: 60% (yellow, heads-up), 80% (red, act now), 100% (limit reached).** Each level fires once per cycle; only the highest level crossed fires. If an admin raises or lowers your limit, alerts re-arm against the new amount. The levels are configurable under *Configure Settings → Alert levels* (`warnAtPercent` / `criticalAtPercent`, defaults 60 / 80); the status bar colours follow the same levels.
- **Fixed:** alerts now also cover a per-member on-demand cap and the team pool. Before, only the overall limit triggered alerts.
- Near the limit (above the first level), usage is checked every 20 s, so the next alert arrives within about a minute.
- **Fixed: dashboard buttons jumped between the top right and below the title when toggling the privacy mask.** Their position depended on how long your name and email addresses are, and masking shortens them. The title area now wraps its own text, so the buttons keep their place; they move below the title only in a narrow window.
- **Fixed: the dashboard and sidebar no longer reload (flash and shift) on every update.** Refreshes, the privacy mask, currency and range changes are now applied in place, so the layout stays still and your scroll position and open tab are kept. A full reload happens only when the page is first opened or shown again after being hidden.
- **Fixed: dashboard buttons jumped when toggling the privacy mask.** The button switched between "Privacy mask" and "Show amounts", and the width change moved the buttons next to it by 8 px. It now keeps one label and shows its on/off state with highlighting (and `aria-pressed` for screen readers), in the dashboard and the sidebar.
- **Privacy mask no longer makes the status bar jump:** amounts are masked as `$∙∙.∙∙` instead of `$•••`. This mask character is as wide as a digit in the status bar font (37.2 px vs 37.5 px for a real amount, measured in Chromium), so the item keeps its width and position when you toggle the mask (the old mask was about 17 px narrower per amount). The mask is fixed and never reveals how many digits an amount has.
- **Clear spending-limit wording everywhere:** "$100 cap · set by your team admin", "$1,000 team pool cap", "No $ cap set", or "No $ cap set · included usage only" with "You can't be charged extra…", so it's obvious whether a dollar cap exists.
- **Your limit at the top of the status-bar menu:** what applies, how much is used, who set it and when alerts fire (for example, "Spending limit: Included usage only · 0% of included usage used · set by your team admin · Alerts at 60% · 80% · 100%"). The dashboard card and the tooltip show the alert levels too.
- **Focus sessions start instantly**, with no prompt; your limit alerts still apply. A session budget is optional (*Set a session budget…*) and uses the same alert levels.
- **Refresh Usage Now** gives clear feedback: a spinner, then "✓ AI usage refreshed · N new request(s)", or the reason it failed with *Show logs* / *Debug report*. If a background sync is running, the refresh waits for it and then fetches fresh data.

### License change
- From 3.0.0 the project is **source-available** (see `LICENSE`). **Official builds** on Open VSX and the VS Code Marketplace stay **free for everyone**, including commercial use. Building or running from source, modifying or redistributing requires a license key. Earlier versions remain MIT.
- Official builds carry a signed distribution license (Ed25519). Builds from source start in a locked mode with **Enter License Key**. Keys are tied to the extension ID and can't be forged without the author's private key.

### New name: AI Spend Monitor — Cursor & Claude Code Usage
- The extension now covers Cursor, Claude Code and Copilot, so it has a tool-neutral name. The extension ID (`subashpatra.cursor-cycle-monitor`) and all `cursorCycleMonitor.*` settings are unchanged, so existing installs update normally and keep their configuration. Commands now appear under **AI Spend Monitor:**.
- One package is published to both Open VSX and the VS Code Marketplace (the separate "AI Coding Spend Monitor" listing was dropped, so ratings and reviews aren't split).

### Uses your existing login, never prompts
- **Automatic session renewal, ahead of expiry.** The newer browser session is adopted silently (checked daily, and within 3 days of expiry). The tooltip shows "Session: Edge browser session · valid until … · renews automatically".
- Usage is read with the cursor.com sign-in you already have, found silently in your browser. Background refreshes never show login, keyring or keychain prompts.
- Cursor's in-app login API (`vscode.cursor`) is tried safely and used if Cursor allows this extension. Cursor currently restricts it to its own allowlist.
- **Fixed:** activation failed with "CANNOT use API proposal: cursor", leaving the status bar on "loading" and commands "not found". Every `vscode.cursor` access is now guarded, and a fail-safe entry point keeps the commands working and explains any startup error.
- New setting `useCursorLogin` (on by default).

### Zero dependencies & Ubuntu
- **No Python, no `secret-tool`, no npm packages.** A built-in D-Bus client reads the Linux keyring (GNOME Keyring / Secret Service and **KWallet**).
- **Firefox support** (plus LibreWolf and Zen). Firefox cookies need no keyring.
- **Ubuntu:** Firefox and Chromium **snaps**, Brave snap and **Flatpak** browsers are detected, as are Chrome/Edge beta and dev channels.
- **Locked keyring after automatic login** is unlocked through the normal GNOME prompt, only when you click *Connect Account*.

### Insight & savings (Phase 2)
- **Savings insights:** lighter-model suggestions with estimated monthly savings, prompt-cache reuse, included-usage run-out date, background-agent and Max-mode share, spike days.
- **Plan fit:** the cheapest Cursor plan for your projected usage, with the break-even point.
- **Cost per project & git branch**, attributed from the focused window. Claude Code logs carry the project directly.
- **History:** this cycle, 7 / 30 / 90 days and last cycle, each with the change vs the previous period. One-time 90-day backfill.
- **Hour×weekday heatmap**, token and cache-hit breakdown, and background-agent spend.
- **Budgets:** per-project budgets and **focus sessions** with their own budget and a live status bar item.
- **Alert webhooks:** Slack, Discord, Teams or any https endpoint, with a test button.
- **Exports:** CSV / JSON of every request (formula-injection safe) and an **invoice by project**.

### Teams & multi-tool (Phase 3)
- **Team dashboard** through the official Cursor Admin API: spend per member, active days, agent requests, top model, outliers, CSV export.
- **Claude Code** usage from local logs (incremental, API-equivalent cost), and **GitHub Copilot** premium requests (experimental).
- Works in VS Code without a Cursor account, where it shows your other AI tools.
- **Weekly recap** and a **shareable PNG card** for this week so far (vs the same days last week), last week, this month so far (vs the same days last month), last month (vs the month before), or the last 12 weeks (weekly bars). Comparisons are shown only when the earlier period is fully covered by real history. Amounts can be hidden.
- History now defaults to 120 days (`historyDays`).
- **Report an Issue** opens the GitHub issues page and copies safe diagnostics to the clipboard.
- **Every ISO currency** via live rates. **Localization** infrastructure with a German UI.

### Support & growth
- **Recommend to my team** command (in the menu, sidebar, Team tab and after rating): copies a Slack/Teams message, the install command or the store link.
- **Install link** on share cards, copied share text and weekly digests (`includeInstallLink`, on by default).
- **First-run message** with your own numbers right after connecting; **what's new** once after each update (never on a fresh install).
- **Ctrl+Alt+U / ⌥⌘U** opens the dashboard; the shortcut is shown in the tooltip.
- **Export Debug Report**: recent logs, API call traces (host, path, status and timing only), state and settings, with tokens, cookies, emails, account IDs and UUIDs, webhook URLs, API keys and amounts removed. Open, save or copy it; **Report an Issue** offers to include it. Links appear in error states.
- **Days until your limit** (estimate) in the tooltip, dashboard and `{daysToLimit}` template token, with an alert 3 days ahead. Computed only against a real ceiling; weekly-pool plans are skipped.
- **Weekly digest** to your Slack, Discord or Teams webhook (opt-in, Mondays). No names or emails, amounts follow the privacy mask, and a team summary is included for admins.
- **Rating prompt**: asked once, only after ≥7 days and ≥5 active days of use; "Later" snoozes 14 days.
- The release workflow also publishes to the **VS Code Marketplace** when `VSCE_PAT` is set.
- README hero **demo GIF** rendered from the real UI with synthetic data (zero-dependency encoder).
- Fixed: the share card and digest showed "Claude Code $0.00" when Claude Code doesn't report cost; they now show the request count.

### Accounts & identity
- The dashboard header, sidebar and tooltip show **who is signed in**: Cursor (name, email and plan from `/api/auth/me` and the usage summary) and Claude Code (from `.claude.json`). Emails follow the privacy mask, and logs record only account IDs.
- **Multiple accounts:** every browser profile signed into cursor.com is a separate account with its own history and snapshot. Claude Code accounts come from separate config folders (`claudeConfigDirs`), and empty folders are ignored. **Switch account** picker; **enterprise/team accounts are selected by default**. Renewal always stays on the same account.
- **View selector:** All tools · Cursor · Claude Code, applied to all tabs. Status-bar cycle figures always reflect the active Cursor account.

### Spending limit & ranges
- **Yellow / red indicators** with one rule everywhere: yellow at 70% and red at 90% of what actually limits you (Cursor cap → team pool → included usage when on-demand is off → personal budget). Configurable via `warnAtPercent` / `criticalAtPercent`.
- **Quarter review & forecast:** the last 3 billing cycles (real spend, requests, change), the actual average per cycle, and the next-cycle forecast (an estimate = that average) vs your limit. Cycles before first use or outside history are excluded, never counted as $0. History is now 130 days.
- **Spending limit** card, tooltip line and sidebar row, exactly as Cursor reports it: an admin-set or personal cap with what's left, a shared team on-demand pool, unlimited, or on-demand turned off (included usage only).
- Date ranges grouped as **Billing** (this cycle, last cycle) and **Rolling** (7, **15**, 30, **60**, 90 days). Period-over-period changes are hidden when the earlier period isn't fully covered by history (e.g. 90 days vs the previous 90).
- The redundant "Renews in" card was removed (it's already in the header); the cycle-budget bar now shows only for the extension's personal budget.

### Real data only
- Every amount comes from an API (Cursor, GitHub, the Cursor Admin API, live FX) or from Claude Code's own logs. **The projected cycle-end spend is the only estimate**, and it is labelled as one everywhere.
- Removed the built-in model price and plan tables, savings estimates and plan recommendations. Insights now compare actual costs from your own data.
- Claude Code shows requests and tokens, plus cost only when Claude Code records it. Nothing is priced from a table.
- Currency uses live ECB reference rates (with the rate date shown) or your own rate. Built-in rates were removed; without a live rate, amounts stay in USD.
- Cost-per-project for Cursor uses a 2-minute window after focus and is labelled as window-based; Claude Code projects are exact.

### Localization
- Full UI in German, Spanish, Portuguese (Brazil), Japanese, Chinese (Simplified) and Hindi (337 strings each, plus command titles).

### Changed
- Dashboard rebuilt with tabs (Overview, Insights, Models, Projects, Tools, Team), range chips and keyboard-navigable tabs.
- Usage data moved from `globalState` into atomic files in the extension's storage folder; partial fetches never drop cached data.
- New command **Delete Local Usage Data**.

## [2.1.0] — 2026-11-21

### Zero-setup connect
- **No Python needed.** Browser sessions are read in pure Node (Chrome, Edge, Brave, Chromium, Vivaldi, Arc) on Linux, macOS and Windows; the Python helper is now only an optional fallback.
- New **Connect Account** flow: auto-detect, *Use what I copied* (cookie value, Cookie header or DevTools "Copy as cURL"), or manual paste. Sessions are verified before saving.
- **Disconnect Account** command.

### New
- **Included-usage meter** (Auto and API pools) in the status bar, tooltip, sidebar and dashboard, with 80% / 100% alerts.
- **Usage sidebar** in the activity bar.
- **Status bar template** (`cursorCycleMonitor.statusBarTemplate`) with 12 tokens.
- Rich tooltip with clickable actions (Dashboard, Refresh, Mask, Export, Settings).
- Dashboard: plan badge, "how requests were billed" (included / on-demand / free / background agents), token totals, cache-hit rate, input/output/cache tokens per model.
- 100% budget alert.
- **Show Logs** and **Report an Issue** (pre-filled, privacy-safe diagnostics).
- Walkthrough rebuilt with 4 steps and auto-completion when connected.

### Fixed
- Extension host could freeze for seconds on every poll when no session was found (synchronous Python call). Auth is now async with backoff.
- Spend alerts re-fired after every reload and in every window. Alert state is now persisted and shared.
- Included requests were reported as "billed". Requests are now classified using Cursor's `usageType` / `kind`.
- Heavy users were silently capped at 10,000 events. Pagination now goes up to 100 pages, with a "partial data" notice.
- Python helper used the wrong key derivation on macOS, and wrote its temp file to the home directory.
- Network requests had no timeout.

### Changed
- **Only one window polls** cursor.com; other windows reuse the shared result.
- Adaptive polling: default 60 s, faster right after new usage and slower when idle.
- Dashboards use a strict Content-Security-Policy with nonce-locked scripts and no inline handlers.
- Runs on the local (UI) side in Remote-SSH / WSL / containers; supported in restricted mode.
- Commands are grouped under **Cursor Usage:**. The old *Set Session Token* still works.
- Marketplace listing: new display name, description, AI category and search keywords.
- Tests now cover auth parsing, cookie decryption, API schema, alerts, scheduling and presentation (8 suites), and CI runs them on Linux, macOS and Windows.

## [2.0.0] — 2026-11-21

### Architecture
- Modular `src/` layout: `auth`, `api`, `domain`, `presentation`, `config`
- Domain unit tests (`npm test`)
- Thin `extension.js` entrypoint

### Added
- **P0** Refresh interval applies immediately without window reload
- **P1** 7-day Unicode sparkline on status bar (`showSparkline`)
- **P1** Safe daily pace alert with **Snooze 24h**
- **P2** Export formats: Markdown, Slack snippet, email snippet
- **P2** Optional live FX (`liveFxEnabled`, Frankfurter + optional API key)
- **P3** Firefox/Safari manual token guidance in README

### Changed
- Settings quick-pick includes sparkline and live FX toggles

## [1.2.0] — 2026-11-21

### Added
- Cycle Spend summary card on analytics dashboard
- Dashboard actions: currency switcher and privacy mask
- Quick menu entries for currency and Markdown export
- All palette commands registered in `package.json`
- Architecture and changelog documentation for publishers

### Fixed
- Missing `openBillingWeb` (billing page link from menu and dashboard)
- Dashboard layout: proper 4-card grid (was broken HTML)
- Privacy mask persists to settings and reacts to configuration changes
- Quick menu parity with README feature list

### Changed
- Marketplace description and categories (`Visualization`)
- README badges, command table, and section structure

## [1.1.0] — prior release

- Visual analytics dashboard, incremental event cache, multi-currency, spend alerts, walkthrough, browser auto-auth.