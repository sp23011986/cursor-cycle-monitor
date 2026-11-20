# Cursor Cycle Usage Monitor

Displays your live Cursor monthly spend, daily spend, remaining allowance, and billing cycle countdown directly in your status bar:

Cursor Monthly: Used $18.56 of $200 · Today $0.45 · $181.44 left (11d)

## Setup (30 Seconds)
1. Sign into https://cursor.com in your browser and open DevTools (F12 -> Application -> Cookies -> https://cursor.com).
2. Copy the value of WorkosCursorSessionToken.
3. Click "Cursor Monthly: Click to Set Token" in your bottom-right status bar (or run "Cursor Monthly: Set Session Token" from Ctrl+Shift+P) and paste the cookie.

## Extension Settings
- cursorCycleMonitor.defaultLimitDollars: Fallback monthly dollar allowance when no individual admin cap is set (default: 200).
- cursorCycleMonitor.timezoneOffsetHours: UTC offset for Today's spend calculation (default: 5.5 for IST).
- cursorCycleMonitor.refreshIntervalSeconds: Auto-refresh interval in seconds (default: 15).
