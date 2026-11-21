# Support

## Fix it in under a minute

| You see | Do this |
| :-- | :-- |
| **Connect Cursor usage** in the status bar | Run **AI Spend Monitor: Connect Account**. Pick *Detect automatically* if you're signed into cursor.com in Chrome/Edge/Brave/Chromium/Vivaldi/Arc, or *Use what I copied* after copying the cookie or a DevTools "Copy as cURL" from cursor.com. |
| **Cursor session expired** | Sign in at cursor.com again, then **Connect Account**. Auto-detect usually renews by itself. |
| *"…your OS keyring could not be read"* (Linux) | Make sure your desktop keyring (GNOME Keyring, KWallet's Secret Service bridge, KeePassXC) is unlocked, or use *Use what I copied*. No extra software is needed. |
| Auto-detect fails on **Windows** with recent Chrome | Chrome's App-Bound Encryption blocks all third-party tools. Use Edge/Brave, or *Use what I copied*. |
| **Firefox** (incl. LibreWolf, Zen) | Supported automatically — Firefox cookies need no keyring. |
| **Safari** | Auto-detect isn't supported — use *Use what I copied*. |
| Numbers look stale | Click the status bar → **Refresh now**. Polling pauses while the window is unfocused (setting: *Pause when window unfocused*). |
| *"Some usage pages could not be loaded"* | Temporary cursor.com error; totals fix themselves on the next refresh. |
| Claude Code usage missing | It is read from `~/.claude/projects` (or `$CLAUDE_CONFIG_DIR`). Check **Settings → Include Claude Code usage**. |
| Copilot shows "unavailable" | The GitHub billing API is experimental and may not be available for every account type. |
| Team tab shows "key rejected" | Admin API keys require team-admin rights. Create a new one under cursor.com → Settings → Advanced. |
| Project shows as *Unattributed* | Requests made while no project window was focused (e.g. background agents) can't be attributed. |
| Using **Remote-SSH / WSL / Dev Containers** | The extension runs on your local machine (UI side) so it can see your browser. Nothing to configure. |

## Ubuntu & other Linux

| Situation | What happens / what to do |
| :-- | :-- |
| Default **Firefox snap** | Detected automatically (`~/snap/firefox`). Nothing to install. |
| **Chromium snap** / Brave snap / Flatpak browsers | Detected automatically. |
| *"keyring is locked"* after **automatic login** | Ubuntu leaves the login keyring locked when you log in automatically. Click **Connect Account → Detect automatically**: the standard GNOME unlock prompt appears once. Or open **Passwords and Keys** and unlock "Login". |
| **Kubuntu / KDE Plasma** | KWallet is supported; when the wallet is closed, KDE asks to open it during **Connect Account**. |
| Headless / no keyring | Chromium falls back to its built-in key automatically; otherwise use *Use what I copied*. |

Background refreshes never show prompts; unlock prompts appear only when you click **Connect Account**.

## Still stuck?

1. Run **AI Spend Monitor: Export Debug Report**. It collects recent logs, API calls (endpoint, status and timing only), state and settings, with tokens, cookies, emails, account IDs, webhook URLs, API keys and amounts removed. Open it in an editor to review, save it as a file, or copy it.
1. Or open **Output → AI Spend Monitor** for the live log.
2. Run **AI Spend Monitor: Report an Issue**. It opens [GitHub issues](https://github.com/sp23011986/cursor-cycle-monitor/issues) and copies safe diagnostics (versions, OS and state, never tokens or amounts) to your clipboard to paste in.
3. Ideas and feature requests: [open a feature request](https://github.com/sp23011986/cursor-cycle-monitor/issues).

Response target: issues are triaged within 3 working days.
