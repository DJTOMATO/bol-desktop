/**
 * BOL OF MONATIUM Desktop Client Mod Engine (bolmod.js)
 * ------------------------------------------------------
 * Loaded dynamically on startup from GitHub (with local fallback).
 * Provides live game status updates for Discord Rich Presence, client-side
 * enhancements, in-game quality-of-life tweaks, and seamless over-the-air updates
 * without requiring client re-compilations.
 */

(() => {
  if (window.__bolmod && typeof window.__bolmod.stop === 'function') {
    try {
      window.__bolmod.stop();
    } catch (_) {}
  }

  const MOD_VERSION = '1.0.0';
  window.__bolmodLoaded = true;
  window.__bolmodVersion = MOD_VERSION;

  console.log(`%c[BOL OF MONATIUM Mod Engine v${MOD_VERSION}] Initializing...`, 'color: #38bdf8; font-weight: bold;');

  let battleStartTime = null;
  let wasInCombat = false;
  let lastActivityKey = '';
  const clientLaunchTime = Date.now();

  function getGameStatus() {
    const isPointerLocked = Boolean(document.pointerLockElement);
    const lang = window.__i18n?.getLang?.() || document.documentElement.lang || 'ko';
    
    // Check if canvas is active and rendering in #game
    const gameContainer = document.getElementById('game');
    const hasCanvas = Boolean(gameContainer && gameContainer.querySelector('canvas'));
    
    // Read audio / settings if available
    const hasAudio = Boolean(window.__audio);

    return {
      isPointerLocked,
      hasCanvas,
      hasAudio,
      lang
    };
  }

  function computeDiscordActivity(info) {
    const isCombat = Boolean(info && info.isPointerLocked);

    if (isCombat && !wasInCombat) {
      battleStartTime = Date.now();
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
      startTimestamp = battleStartTime || clientLaunchTime;
      smallImageText = 'Aiming & Firing';
    } else if (info?.hasCanvas) {
      details = '🎯 Weapon Loadout & Practice';
      state = 'Preparing for Battle';
      startTimestamp = clientLaunchTime;
    }

    return {
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
  }

  function update() {
    try {
      const status = getGameStatus();
      const activity = computeDiscordActivity(status);

      const activityKey = `${activity.details}|${activity.state}|${activity.smallImageText}`;
      if (activityKey !== lastActivityKey) {
        lastActivityKey = activityKey;
        if (window.electronAPI && typeof window.electronAPI.updateDiscordActivity === 'function') {
          window.electronAPI.updateDiscordActivity(activity);
        }
      }
    } catch (err) {
      console.warn('[bolmod] Update loop error:', err);
    }
  }

  // Poll game status every 3 seconds
  const intervalId = setInterval(update, 3000);
  update();

  window.__bolmod = {
    version: MOD_VERSION,
    getGameStatus,
    forceUpdate: update,
    stop: () => clearInterval(intervalId)
  };

  console.log(`%c[BOL OF MONATIUM Mod Engine v${MOD_VERSION}] Running.`, 'color: #38bdf8;');
})();
