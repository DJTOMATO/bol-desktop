const { app, BrowserWindow, dialog, ipcMain, nativeImage, powerSaveBlocker, session, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const TARGET_URL = 'https://bol.monatium.com/';
const ALLOWED_HOST = 'bol.monatium.com';

// Maximize GPU, WebGL, WebGPU, and 3D Three.js hardware performance for FPS gaming
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('force_high_performance_gpu');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-oop-rasterization');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disk-cache-size', String(3 * 1024 * 1024 * 1024)); // 3 GB disk cache for GLB models, audio, and textures

// Uncap frame rate for high refresh rate monitors (144Hz, 240Hz, 360Hz+)
app.commandLine.appendSwitch('disable-frame-rate-limit');

// Prevent background throttling so Alt-Tabbing never freezes frames, drops audio, or desyncs network ticks
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');

// Linux Wayland & Vulkan Compatibility
if (process.platform === 'linux') {
  delete process.env.ELECTRON_OZONE_PLATFORM_HINT;

  if (!app.commandLine.hasSwitch('ozone-platform')) {
    app.commandLine.appendSwitch('ozone-platform', 'x11');
  }
  if (!app.commandLine.hasSwitch('ozone-platform-hint')) {
    app.commandLine.appendSwitch('ozone-platform-hint', 'x11');
  }

  const isExplicitWayland = app.commandLine.getSwitchValue('ozone-platform') === 'wayland';
  if (!isExplicitWayland) {
    app.commandLine.appendSwitch('enable-features', 'Vulkan');
  }
}

app.setName('BOL OF MONATIUM');
if (process.platform === 'win32') {
  app.setAppUserModelId('com.glas.boldesktop');
}

let mainWindow = null;
let powerSaveId = null;
let isClosingApp = false;

const GITHUB_REPO = 'DJTOMATO/bol-desktop';
const RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;
const API_LATEST_RELEASE = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

function isNewerVersion(remote, local) {
  const cleanRemote = String(remote || '').replace(/^v/i, '').trim();
  const cleanLocal = String(local || '').replace(/^v/i, '').trim();
  const rParts = cleanRemote.split('.').map(n => parseInt(n, 10) || 0);
  const lParts = cleanLocal.split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(rParts.length, lParts.length); i++) {
    const r = rParts[i] || 0;
    const l = lParts[i] || 0;
    if (r > l) return true;
    if (r < l) return false;
  }
  return false;
}

async function checkForUpdates(parentWindow) {
  try {
    const response = await fetch(API_LATEST_RELEASE, {
      headers: {
        'User-Agent': `bol-desktop/${app.getVersion()}`
      }
    });
    if (!response.ok) return;
    const data = await response.json();
    const latestTag = data.tag_name || data.name || '';
    if (latestTag && isNewerVersion(latestTag, app.getVersion())) {
      const { response: buttonIndex } = await dialog.showMessageBox(parentWindow || null, {
        type: 'info',
        title: 'Update Available — BOL OF MONATIUM',
        message: `A new version of BOL OF MONATIUM (${latestTag}) is available!`,
        detail: `You are currently using v${app.getVersion()}.\n\nVisit GitHub to download the latest release installer.`,
        buttons: ['Download Latest Version', 'Later'],
        defaultId: 0,
        cancelId: 1,
        noLink: true
      });
      if (buttonIndex === 0) {
        shell.openExternal(data.html_url || RELEASES_URL);
      }
    }
  } catch (_) {
    // Fail silently if offline
  }
}

// --- Dynamic Mod Engine (bolmod.js) ---
const REMOTE_MOD_URL = 'https://raw.githubusercontent.com/DJTOMATO/bol-desktop/main/bolmod.js';
let cachedModCode = null;
let lastModRpcTimestamp = 0;

async function fetchRemoteModScript() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${REMOTE_MOD_URL}?t=${Date.now()}`, {
      signal: controller.signal,
      headers: { 'User-Agent': `bol-desktop/${app.getVersion()}` }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      cachedModCode = await res.text();
      return cachedModCode;
    }
  } catch (_) {}

  // Fallback to local bundled copy if offline or fetch failed
  if (!cachedModCode) {
    try {
      const localModPath = path.join(__dirname, 'bolmod.js');
      if (fs.existsSync(localModPath)) {
        cachedModCode = fs.readFileSync(localModPath, 'utf8');
      }
    } catch (_) {}
  }

  return cachedModCode;
}

async function injectModScript(targetWindow) {
  if (!targetWindow || targetWindow.isDestroyed()) return;
  try {
    const modCode = await fetchRemoteModScript();
    if (modCode && targetWindow && !targetWindow.isDestroyed()) {
      await targetWindow.webContents.executeJavaScript(modCode).catch(() => {});
    }
  } catch (_) {}
}

// --- Discord Rich Presence (RPC) ---
const RPC = require('discord-rpc');
const DISCORD_CLIENT_ID = '1044809640241799178'; // Can be customized or updated
let rpc = null;
let rpcConnected = false;
let rpcInterval = null;
let combatStartTime = null;
let wasInCombat = false;
const clientLaunchTime = Date.now();

function getRpcClient() {
  if (!rpc) {
    rpc = new RPC.Client({ transport: 'ipc' });

    rpc.on('ready', () => {
      rpcConnected = true;
      updateDiscordPresence();
    });

    rpc.on('disconnected', () => {
      rpcConnected = false;
    });
  }
  return rpc;
}

async function initDiscordRPC() {
  try {
    const client = getRpcClient();
    await client.login({ clientId: DISCORD_CLIENT_ID });
  } catch (_) {
    rpcConnected = false;
    setTimeout(initDiscordRPC, 15000);
  }
}

async function updateDiscordPresence() {
  if (!rpcConnected || !rpc) return;

  // Let bolmod.js take precedence if it's actively broadcasting
  if (Date.now() - lastModRpcTimestamp < 15000) {
    return;
  }

  let info = null;
  if (mainWindow && !mainWindow.isDestroyed()) {
    try {
      info = await mainWindow.webContents.executeJavaScript(`
        (() => {
          const isCombat = Boolean(document.pointerLockElement);
          const hasCanvas = Boolean(document.getElementById('game')?.querySelector('canvas'));
          return { isCombat, hasCanvas };
        })()
      `).catch(() => null);
    } catch (_) {}
  }

  const isCombat = Boolean(info && info.isCombat);
  if (isCombat && !wasInCombat) {
    combatStartTime = Date.now();
    wasInCombat = true;
  } else if (!isCombat) {
    wasInCombat = false;
  }

  let details = 'In Main Menu / Lobby';
  let state = 'Deploying to Monatium';
  let startTimestamp = clientLaunchTime;
  let smallImageText = 'BOL OF MONATIUM';

  if (isCombat) {
    details = '⚔️ In Combat';
    state = 'First-Person Tactical Action';
    startTimestamp = combatStartTime || clientLaunchTime;
    smallImageText = 'Aiming & Firing';
  } else if (info?.hasCanvas) {
    details = '🎯 Weapon Loadout & Practice';
    state = 'Preparing for Battle';
    startTimestamp = clientLaunchTime;
  }

  const activity = {
    details: details.slice(0, 127),
    state: state.slice(0, 127),
    startTimestamp,
    largeImageKey: 'logo',
    largeImageText: 'BOL OF MONATIUM',
    smallImageKey: 'logo',
    smallImageText: smallImageText.slice(0, 127),
    instance: false,
    buttons: [
      { label: 'Play in Browser', url: 'https://bol.monatium.com/' },
      { label: 'Download Desktop App', url: 'https://github.com/DJTOMATO/bol-desktop/releases' }
    ]
  };

  try {
    await rpc.setActivity(activity);
  } catch (_) {}
}

ipcMain.on('discord-rpc-set-activity', (event, activity) => {
  lastModRpcTimestamp = Date.now();
  if (!rpcConnected || !rpc || !activity) return;
  rpc.setActivity(activity).catch(() => {});
});

function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png');
  const winIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : undefined;

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    title: 'BOL OF MONATIUM',
    backgroundColor: '#0b0d10',
    icon: winIcon,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      spellcheck: false
    }
  });

  // Automatically allow pointer lock and fullscreen permissions
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'pointerLock' || permission === 'fullscreen') {
      return callback(true);
    }
    callback(false);
  });

  // Open external links in default system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname === ALLOWED_HOST) {
        return { action: 'allow' };
      }
    } catch (_) {}
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname === ALLOWED_HOST || parsed.protocol === 'file:') {
        return;
      }
    } catch (_) {}
    event.preventDefault();
    shell.openExternal(url);
  });

  // Inject dynamic mod engine on successful navigation
  mainWindow.webContents.on('did-finish-load', () => {
    const currentURL = mainWindow.webContents.getURL();
    if (currentURL.includes(ALLOWED_HOST)) {
      injectModScript(mainWindow);
    }
  });

  // Handle network failure gracefully with local error page
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (errorCode === -3) return; // Ignore aborted requests
    mainWindow.loadFile(path.join(__dirname, 'index.html'), { query: { error: '1' } });
  });

  // Load the initial connecting / splash screen
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Keyboard Shortcuts
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;

    // Fullscreen toggle (F11)
    if (input.key === 'F11') {
      event.preventDefault();
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      return;
    }

    // DevTools toggle (Ctrl+Shift+I / Cmd+Option+I)
    if (
      (input.control || input.meta) &&
      input.shift &&
      input.key.toLowerCase() === 'i'
    ) {
      event.preventDefault();
      mainWindow.webContents.toggleDevTools();
      return;
    }

    // Reload (Ctrl+R / Cmd+R / F5)
    if (
      input.key === 'F5' ||
      ((input.control || input.meta) && input.key.toLowerCase() === 'r')
    ) {
      event.preventDefault();
      mainWindow.loadURL(TARGET_URL);
      return;
    }
  });

  setTimeout(() => checkForUpdates(mainWindow), 3000);
}

// IPC Handlers
ipcMain.on('load-site', (event, url) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.loadURL(url || TARGET_URL);
  }
});

ipcMain.on('retry-connection', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.loadURL(TARGET_URL);
  }
});

// App Lifecycle
app.whenReady().then(() => {
  // Prevent display sleep while the client is running
  try {
    powerSaveId = powerSaveBlocker.start('prevent-display-sleep');
  } catch (_) {}

  createWindow();
  initDiscordRPC();

  // Periodically refresh Discord status
  rpcInterval = setInterval(updateDiscordPresence, 5000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (powerSaveId !== null && powerSaveBlocker.isStarted(powerSaveId)) {
    powerSaveBlocker.stop(powerSaveId);
  }
  if (rpcInterval) {
    clearInterval(rpcInterval);
  }
  if (rpc) {
    try {
      rpc.destroy();
    } catch (_) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
