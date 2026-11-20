const vscode = require('vscode');
const https = require('https');

const SECRET_KEY = 'cursorCycleMonitor.sessionToken';
const BASE_URL = 'https://cursor.com';
const SUMMARY_URL = BASE_URL + '/api/usage-summary';
const EVENTS_URL = BASE_URL + '/api/dashboard/get-filtered-usage-events';

function requestJson(url, method, bodyStr, token) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Cookie': `WorkosCursorSessionToken=${token}`,
      'Accept': 'application/json',
      'Origin': BASE_URL,
      'Referer': BASE_URL
    };
    if (bodyStr) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }
    const req = https.request(url, { method, headers }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, text: data }));
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function activate(context) {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  item.show();

  async function promptForToken() {
    const raw = await vscode.window.showInputBox({
      title: 'Set Cursor Session Token',
      prompt: 'Paste your WorkosCursorSessionToken cookie value from cursor.com DevTools',
      password: true,
      ignoreFocusOut: true
    });
    if (!raw) return;
    const cleaned = raw.trim().replace(/%3A%3A/gi, '::');
    await context.secrets.store(SECRET_KEY, cleaned);
    vscode.window.showInformationMessage('Cursor session token saved securely.');
    await update();
  }

  async function update() {
    const token = await context.secrets.get(SECRET_KEY);
    if (!token) {
      item.text = '$(key) Cursor Monthly: Click to Set Token';
      item.tooltip = 'Click to paste your WorkosCursorSessionToken cookie from cursor.com';
      item.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      item.command = 'cursorCycleMonitor.setToken';
      return;
    }

    const config = vscode.workspace.getConfiguration('cursorCycleMonitor');
    const defaultLimit = config.get('defaultLimitDollars', 200);
    const tzOffsetHours = config.get('timezoneOffsetHours', 5.5);

    try {
      const sumRes = await requestJson(SUMMARY_URL, 'GET', null, token);
      if (sumRes.status === 401) {
        item.text = '$(warning) Cursor Monthly: Session Expired (Click to Renew)';
        item.tooltip = 'HTTP 401: Your 60-day session cookie expired. Click to paste a fresh cookie.';
        item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        item.command = 'cursorCycleMonitor.setToken';
        return;
      }
      if (sumRes.status !== 200) {
        item.text = `$(warning) Cursor Monthly: HTTP ${sumRes.status}`;
        item.tooltip = `HTTP ${sumRes.status}: ${sumRes.text.slice(0, 200)}`;
        item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        item.command = 'cursorCycleMonitor.refresh';
        return;
      }

      const summary = JSON.parse(sumRes.text);
      const startMs = Date.parse(summary.billingCycleStart);
      const endMs = Date.parse(summary.billingCycleEnd);
      const daysLeft = Math.max(0, Math.ceil((endMs - Date.now()) / (1000 * 60 * 60 * 24)));

      const overall = summary.individualUsage?.overall || {};
      const adminLimitCents = overall.limit;
      const isAdminSet = typeof adminLimitCents === 'number' && adminLimitCents > 0;
      const limitDollars = isAdminSet ? (adminLimitCents / 100) : defaultLimit;

      let page = 1;
      let events = [];
      while (true) {
        const payload = JSON.stringify({ startDate: startMs, endDate: Date.now(), page, pageSize: 1000 });
        const evRes = await requestJson(EVENTS_URL, 'POST', payload, token);
        if (evRes.status !== 200) break;
        const json = JSON.parse(evRes.text);
        const batch = json.usageEventsDisplay || [];
        const totalCount = json.totalUsageEventsCount || batch.length;
        events.push(...batch);
        if (events.length >= totalCount || batch.length === 0 || page >= 10) break;
        page++;
      }

      const tzOffsetMs = tzOffsetHours * 3600 * 1000;
      const localNow = new Date(Date.now() + tzOffsetMs);
      const todayStartMs = Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate()) - tzOffsetMs;

      let eventsCents = 0;
      let todayCents = 0;
      let todayEvents = 0;

      for (const e of events) {
        const c = (typeof e.chargedCents === 'number') ? e.chargedCents : (e.tokenUsage?.totalCents || 0);
        eventsCents += c;
        if (Number(e.timestamp) >= todayStartMs) {
          todayCents += c;
          todayEvents++;
        }
      }

      const usedCents = (typeof overall.used === 'number') ? overall.used : eventsCents;
      const usedDollars = usedCents / 100;
      const todayDollars = todayCents / 100;
      const leftDollars = Math.max(0, limitDollars - usedDollars);
      const pctNum = limitDollars > 0 ? (usedDollars / limitDollars) * 100 : 0;
      const pctUsed = pctNum.toFixed(0);

      if (pctNum >= 90) {
        item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
      } else if (pctNum >= 70) {
        item.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      } else {
        item.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
      }
      item.color = undefined;
      item.command = 'cursorCycleMonitor.refresh';

      item.text = `$(sparkle) Cursor Monthly: Used $${usedDollars.toFixed(2)} of $${limitDollars} · Today $${todayDollars.toFixed(2)} · $${leftDollars.toFixed(2)} left (${daysLeft}d) $(sparkle)`;
      item.tooltip = [
        `Cursor Billing Cycle Summary`,
        `• Limit Source: ${isAdminSet ? 'Admin Cap' : 'Default Fallback ($' + defaultLimit + ')'}`,
        `• Month Used: $${usedDollars.toFixed(2)} of $${limitDollars.toFixed(2)} (${pctUsed}%)`,
        `• Month Left: $${leftDollars.toFixed(2)}`,
        `• Today Spend: $${todayDollars.toFixed(2)} (${todayEvents} prompts)`,
        `• Cycle Ends: ${summary.billingCycleEnd.slice(0, 10)} (${daysLeft}d left)`,
        ``,
        `Click to refresh · Run "Cursor Monthly: Set Session Token" to update cookie`
      ].join('\n');
    } catch (err) {
      item.text = '$(warning) Cursor Monthly: Network Error';
      item.tooltip = String(err.message || err);
      item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
      item.command = 'cursorCycleMonitor.refresh';
    }
  }

  context.subscriptions.push(
    item,
    vscode.commands.registerCommand('cursorCycleMonitor.setToken', promptForToken),
    vscode.commands.registerCommand('cursorCycleMonitor.refresh', update)
  );

  update();
  const intervalSec = Math.max(5, vscode.workspace.getConfiguration('cursorCycleMonitor').get('refreshIntervalSeconds', 15));
  const timer = setInterval(update, intervalSec * 1000);
  context.subscriptions.push({ dispose: () => clearInterval(timer) });
}

exports.activate = activate;
