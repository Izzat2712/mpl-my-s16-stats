import { getCurrentSeasonLabel, loadData } from "./data-store.js";
import { invalidateStatsCache } from "./stats.js";
import {
  refreshDataRefs,
  refreshScheduleCountdowns,
  onScheduleTeamChange,
  onScheduleStageChange,
  openScheduleTeamModal,
  closeScheduleTeamModal,
  openScheduleScorecard,
  closeScheduleScorecard,
  selectScheduleScorecardGame,
  openTeamRoster,
  closeTeamRoster,
  openTeamRosterProfile,
  backToTeamRoster,
  openPlayerDetailsModal,
  closePlayerDetailsModal,
  openPlayerProfileModal,
  closePlayerProfileModal,
  openHeroDetailsModal,
  closeHeroDetailsModal,
  onTeamCompareChange,
  onPlayerCompareChange,
  onHeroCompareChange,
  openH2hPoolPopup,
  closeH2hPoolPopup,
  onPlayerSearchInput,
  onHeroSearchInput,
  onHpPlayerSearchInput,
  onPpHeroSearchInput,
  onPpExcludeUnusedToggle,
  showSchedule,
  showTeams,
  sortTeams,
  showPlayers,
  sortPlayers,
  showHeroes,
  sortHeroes,
  showHeroPool,
  sortHeroPool,
  showPlayerPools,
  sortPlayerPools,
  showH2H,
  setH2hSubTab,
  getH2hSubTab,
  setSupportPos
} from "./views.js";

const appState = {
  loaded: false,
  season: "season17",
  view: "schedule",
  sort: {
    teams: { key: "matchWins", asc: false },
    players: { key: "kda", asc: false },
    heroes: { key: "pickRate", asc: false },
    heroPool: { key: "totalHeroes", asc: false },
    playerPools: { key: "totalPlayers", asc: false }
  },
  search: {
    player: { value: "", caret: 0 },
    hero: { value: "", caret: 0 },
    hpPlayer: { value: "", caret: 0 },
    ppHero: { value: "", caret: 0 }
  },
  filters: {
    ppExcludeUnused: false
  },
  scheduleStage: "regular",
  scheduleTeam: "",
  scheduleWeek: 1
};

const ENABLED_SEASONS = new Set(["season16", "season17"]);
const VIEW_ROUTES = {
  schedule: "/schedule",
  teams: "/teams",
  players: "/players",
  heroes: "/heroes",
  "hero pool": "/hero-pool",
  "player pool": "/player-pool"
};

const ROUTE_VIEWS = Object.fromEntries(
  Object.entries(VIEW_ROUTES).map(([view, route]) => [route, view])
);
const H2H_SUBTAB_ROUTES = {
  team: "/h2h/team",
  player: "/h2h/player",
  hero: "/h2h/hero"
};
const LOCAL_ROUTE_VIEWS = Object.fromEntries(
  Object.entries(VIEW_ROUTES).map(([view, route]) => [`#${route}`, view])
);
const LOCAL_H2H_SUBTAB_ROUTES = Object.fromEntries(
  Object.entries(H2H_SUBTAB_ROUTES).map(([tab, route]) => [`#${route}`, tab])
);

let navLinksBound = false;
let suppressRouteSync = false;
let countdownIntervalId = null;
let countdownDataRefreshId = null;
let countdownDataPromise = null;
const countdownData = {
  matches: [],
  teamLogos: {},
  teamNames: {}
};
const COUNTDOWN_DATA_REFRESH_MS = 15000;
const MATCH_SOURCE_UTC_OFFSET_HOURS = 8;

function normalizePathname(pathname) {
  if (!pathname) return "/";
  const trimmed = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;
  return trimmed || "/";
}

function normalizeSeasonKey(seasonKey) {
  return ENABLED_SEASONS.has(seasonKey) ? seasonKey : null;
}

function getDefaultViewForSeason(seasonKey = appState.season) {
  return seasonKey === "season17" ? "schedule" : "teams";
}

function isViewAvailableForSeason(view, seasonKey = appState.season) {
  if (view === "schedule") return true;
  return view === "h2h" || Boolean(VIEW_ROUTES[view]);
}

function useHashRoutes() {
  const host = window.location.hostname;
  return window.location.protocol === "file:" || host === "localhost" || host === "127.0.0.1";
}

function getViewFromPathname(pathname) {
  return ROUTE_VIEWS[normalizePathname(pathname)] || getDefaultViewForSeason();
}

function getSeasonRoutePrefix(seasonKey = appState.season) {
  return `/${normalizeSeasonKey(seasonKey) || appState.season}`;
}

function getRoutePath(view, h2hSubTab = null, seasonKey = appState.season) {
  const seasonPrefix = getSeasonRoutePrefix(seasonKey);
  if (view === "h2h") {
    const path = H2H_SUBTAB_ROUTES[h2hSubTab] || H2H_SUBTAB_ROUTES.team;
    return useHashRoutes() ? `#${seasonPrefix}${path}` : `${seasonPrefix}${path}`;
  }
  const path = VIEW_ROUTES[view] || VIEW_ROUTES.teams;
  return useHashRoutes() ? `#${seasonPrefix}${path}` : `${seasonPrefix}${path}`;
}

function getRouteHref(view, h2hSubTab = null, seasonKey = appState.season) {
  const routePath = getRoutePath(view, h2hSubTab, seasonKey);
  return useHashRoutes() ? `/${routePath}` : routePath;
}

function parseRoute(pathname, hash = window.location.hash) {
  if (useHashRoutes()) {
    const normalizedHash = String(hash || "").trim();
    if (!normalizedHash || normalizedHash === "#/" || normalizedHash === "#") {
      return { season: appState.season, view: getDefaultViewForSeason(), h2hSubTab: null };
    }
    const normalizedPath = normalizePathname(normalizedHash.slice(1) || "/");
    const segments = normalizedPath.split("/").filter(Boolean);
    const routeSeason = normalizeSeasonKey(segments[0]) || appState.season;
    const routePath = segments[0] && normalizeSeasonKey(segments[0])
      ? `/${segments.slice(1).join("/") || ""}`
      : normalizedPath;
    const normalizedRoutePath = normalizePathname(routePath);
    if (LOCAL_H2H_SUBTAB_ROUTES[`#${normalizedRoutePath}`]) {
      return { season: routeSeason, view: "h2h", h2hSubTab: LOCAL_H2H_SUBTAB_ROUTES[`#${normalizedRoutePath}`] };
    }
    return {
      season: routeSeason,
      view: ROUTE_VIEWS[normalizedRoutePath] || getDefaultViewForSeason(routeSeason),
      h2hSubTab: null
    };
  }
  const normalized = normalizePathname(pathname);
  const segments = normalized.split("/").filter(Boolean);
  const routeSeason = normalizeSeasonKey(segments[0]) || appState.season;
  const routePath = segments[0] && normalizeSeasonKey(segments[0])
    ? `/${segments.slice(1).join("/") || ""}`
    : normalized;
  const normalizedRoutePath = normalizePathname(routePath);
  if (normalizedRoutePath === "/") {
    return { season: routeSeason, view: getDefaultViewForSeason(routeSeason), h2hSubTab: null };
  }
  if (normalizedRoutePath === "/h2h") {
    return { season: routeSeason, view: "h2h", h2hSubTab: "team" };
  }
  if (normalizedRoutePath.startsWith("/h2h/")) {
    const subTab = normalizedRoutePath.slice("/h2h/".length).toLowerCase();
    if (H2H_SUBTAB_ROUTES[subTab]) {
      return { season: routeSeason, view: "h2h", h2hSubTab: subTab };
    }
    return { season: routeSeason, view: "h2h", h2hSubTab: "team" };
  }
  return { season: routeSeason, view: getViewFromPathname(normalizedRoutePath), h2hSubTab: null };
}

function updateUrl(nextPath, { replace = false } = {}) {
  if (suppressRouteSync) return;
  const currentPath = useHashRoutes()
    ? (window.location.hash || "#/")
    : normalizePathname(window.location.pathname);
  if (currentPath === nextPath) return;
  if (useHashRoutes()) {
    if (replace) {
      const nextUrl = `${window.location.pathname}${window.location.search}${nextPath}`;
      window.history.replaceState({}, "", nextUrl);
    } else {
      window.location.hash = nextPath.slice(1);
    }
    return;
  }
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", nextPath);
}

function updateUrlForView(view, options = {}) {
  if (view === "h2h") {
    updateUrl(getRoutePath("h2h", getH2hSubTab(), appState.season), options);
    return;
  }
  updateUrl(getRoutePath(view, null, appState.season), options);
}

function navigateToView(view, options = {}) {
  const fallbackView = getDefaultViewForSeason();
  const nextView = isViewAvailableForSeason(view)
    ? view
    : (view === "h2h" || VIEW_ROUTES[view] ? view : fallbackView);
  if (nextView === "h2h" && options.h2hSubTab) {
    setH2hSubTab(options.h2hSubTab);
    return;
  }
  if (!isViewAvailableForSeason(nextView)) {
    appState.view = fallbackView;
    renderCurrentView();
    return;
  }
  if (options.updateUrl !== false) {
    updateUrlForView(nextView, { replace: options.replace === true });
  }
  appState.view = nextView;
  renderCurrentView();
}

function bindNavLinks() {
  if (navLinksBound) return;
  syncNavHrefs();
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const routeLink = e.target.closest("a[data-route]");
    if (routeLink) {
      if (routeLink.getAttribute("aria-disabled") === "true") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      navigateToView(routeLink.dataset.route);
      return;
    }
    const h2hLink = e.target.closest("a[data-h2h-tab]");
    if (h2hLink) {
      e.preventDefault();
      setH2hSubTab(h2hLink.dataset.h2hTab);
    }
  });
  window.addEventListener("popstate", () => {
    applyRoute(window.location.pathname, window.location.hash).catch(showLoadError);
  });
  window.addEventListener("hashchange", () => {
    if (!useHashRoutes()) return;
    applyRoute(window.location.pathname, window.location.hash).catch(showLoadError);
  });
  window.addEventListener("focus", () => {
    refreshCountdownData().catch(() => {});
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshCountdownData().catch(() => {});
    }
  });
  navLinksBound = true;
}

function syncNavHrefs() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  for (const link of nav.querySelectorAll("a[data-route]")) {
    const route = link.getAttribute("data-route");
    link.hidden = false;
    link.classList.remove("is-disabled");
    link.setAttribute("aria-disabled", "false");
    link.setAttribute("tabindex", "0");
    link.setAttribute("href", getRouteHref(route === "h2h" ? "h2h" : route, route === "h2h" ? getH2hSubTab() : null, appState.season));
  }
}

async function ensureSeasonLoaded(seasonKey) {
  if (!normalizeSeasonKey(seasonKey) || seasonKey === appState.season) return;
  appState.season = seasonKey;
  setLoading("Loading data...");
  await loadData(appState.season);
  invalidateStatsCache();
  refreshDataRefs();
    updateSeasonMeta();
    await ensureCountdownDataLoaded();
    startCountdownTicker();
  const selector = document.getElementById("seasonSelect");
  if (selector) selector.value = appState.season;
}

async function applyRoute(pathname, hash = window.location.hash) {
  const route = parseRoute(pathname, hash);
  suppressRouteSync = true;
  try {
    await ensureSeasonLoaded(route.season);
    if (route.view === "h2h") {
      setH2hSubTab(route.h2hSubTab || "team");
      appState.view = "h2h";
      renderCurrentView();
      return;
    }
    appState.view = isViewAvailableForSeason(route.view) ? route.view : getDefaultViewForSeason();
    renderCurrentView();
    syncNavHrefs();
  } finally {
    suppressRouteSync = false;
  }
}

function setLoading(message) {
  const output = document.getElementById("output");
  if (!output) return;
  output.innerHTML = `<div class="panel-title">${message}</div>`;
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${path} (${response.status})`);
  }
  return response.json();
}

async function ensureCountdownDataLoaded() {
  if (countdownDataPromise) return countdownDataPromise;
  countdownDataPromise = Promise.all([
    fetchJson("/data/season17/matches.json"),
    fetchJson("/data/season17/teamLogos.json"),
    fetchJson("/data/season17/teamNames.json")
  ]).then(([matches, teamLogos, teamNames]) => {
    countdownData.matches = Array.isArray(matches) ? matches : [];
    countdownData.teamLogos = teamLogos && typeof teamLogos === "object" ? teamLogos : {};
    countdownData.teamNames = teamNames && typeof teamNames === "object" ? teamNames : {};
  }).catch((err) => {
    countdownDataPromise = null;
    throw err;
  });
  return countdownDataPromise;
}

async function refreshCountdownData() {
  countdownDataPromise = null;
  await ensureCountdownDataLoaded();
  renderNextMatchCountdown();
}

function parseMatchDateTime(dateValue, startTimeValue) {
  const dateMatch = String(dateValue || "").trim().match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  const timeMatch = String(startTimeValue || "").trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (!dateMatch || !timeMatch) return null;

  const year = Number(dateMatch[1]);
  const monthIndex = Number(dateMatch[2]) - 1;
  const day = Number(dateMatch[3]);
  let hours = Number(timeMatch[1]) % 12;
  const minutes = Number(timeMatch[2]);
  if (timeMatch[3].toUpperCase() === "PM") hours += 12;

  const utcMs = Date.UTC(year, monthIndex, day, hours - MATCH_SOURCE_UTC_OFFSET_HOURS, minutes, 0, 0);
  const parsed = new Date(utcMs);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatLocalGmtOffset(date) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  if (minutes === 0) return `GMT${sign}${hours}`;
  return `GMT${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

function formatMatchMeta(matchTime) {
  const localTime = matchTime.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
  return `${localTime} ${formatLocalGmtOffset(matchTime)}`;
}

function formatCountdown(diffMs) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function getCountdownTeamName(teamCode) {
  return countdownData.teamNames[teamCode] || teamCode || "TBD";
}

function getUpcomingMatch() {
  const now = Date.now();
  return countdownData.matches
    .map((match) => ({
      match,
      startAt: parseMatchDateTime(match.date, match.startTime)
    }))
    .filter((entry) => (
      entry.startAt
      && entry.startAt.getTime() > now
      && String(entry.match.teamA || "").trim()
      && String(entry.match.teamB || "").trim()
    ))
    .sort((a, b) => a.startAt - b.startAt)[0] || null;
}

function renderNextMatchCountdown() {
  const card = document.getElementById("nextMatchCountdown");
  const teamAEl = document.getElementById("countdownTeamA");
  const teamBEl = document.getElementById("countdownTeamB");
  const logoAEl = document.getElementById("countdownLogoA");
  const logoBEl = document.getElementById("countdownLogoB");
  const metaEl = document.getElementById("countdownMeta");
  const timerEl = document.getElementById("countdownTimer");
  if (!card || !teamAEl || !teamBEl || !logoAEl || !logoBEl || !metaEl || !timerEl) return;

  const upcoming = getUpcomingMatch();
  if (!upcoming) {
    card.classList.add("is-empty");
    teamAEl.textContent = "No upcoming";
    teamBEl.textContent = "match";
    logoAEl.hidden = true;
    logoBEl.hidden = true;
    logoAEl.removeAttribute("src");
    logoBEl.removeAttribute("src");
    metaEl.textContent = "MPL MY Season 17";
    timerEl.textContent = "--d --h --m --s";
    return;
  }

  const { match, startAt } = upcoming;
  const teamAName = getCountdownTeamName(match.teamA);
  const teamBName = getCountdownTeamName(match.teamB);
  const teamALogo = countdownData.teamLogos[match.teamA] || "";
  const teamBLogo = countdownData.teamLogos[match.teamB] || "";
  card.classList.remove("is-empty");
  teamAEl.textContent = teamAName;
  teamBEl.textContent = teamBName;
  logoAEl.hidden = !teamALogo;
  logoBEl.hidden = !teamBLogo;
  if (teamALogo) {
    logoAEl.src = teamALogo;
    logoAEl.alt = `${teamAName} logo`;
  } else {
    logoAEl.removeAttribute("src");
    logoAEl.alt = "";
  }
  if (teamBLogo) {
    logoBEl.src = teamBLogo;
    logoBEl.alt = `${teamBName} logo`;
  } else {
    logoBEl.removeAttribute("src");
    logoBEl.alt = "";
  }
  metaEl.textContent = `Season 17 | Week ${match.week} | ${formatMatchMeta(startAt)}`;
  timerEl.textContent = formatCountdown(startAt.getTime() - Date.now());
}

function startCountdownTicker() {
  renderNextMatchCountdown();
  refreshScheduleCountdowns();
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
  }
  countdownIntervalId = window.setInterval(() => {
    renderNextMatchCountdown();
    refreshScheduleCountdowns();
  }, 1000);

  if (countdownDataRefreshId) {
    clearInterval(countdownDataRefreshId);
  }
  countdownDataRefreshId = window.setInterval(() => {
    refreshCountdownData().catch(() => {});
  }, COUNTDOWN_DATA_REFRESH_MS);
}

function updateSeasonMeta() {
  const seasonLabel = getCurrentSeasonLabel();
  document.title = `${seasonLabel} Stats`;
  const heading = document.getElementById("seasonHeading");
  if (heading) heading.textContent = `${seasonLabel} STATISTICS`;
  const seasonNote = document.getElementById("seasonNote");
  if (seasonNote) {
    seasonNote.hidden = false;
    seasonNote.textContent = "Stats combine regular season and playoffs when available.";
  }
  syncNavHrefs();
  renderNextMatchCountdown();
}

function showLoadError(err) {
  const output = document.getElementById("output");
  if (!output) return;
  const protocol = window.location.protocol;
  const protocolHint = protocol === "file:"
    ? "<p><strong>Tip:</strong> You are running with file://. Start a local server (for example: <code>python -m http.server 5500</code>) and open http://localhost:5500.</p>"
    : "";
  output.innerHTML = `
    <div class="panel-title">Data Load Error</div>
    <p>${String(err.message || err)}</p>
    ${protocolHint}
    <button type="button" class="retry-btn" onclick="initApp()">Retry</button>
  `;
}

function setActiveNavByLabel(label) {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  for (const control of nav.querySelectorAll("[data-route]")) {
    if (control.hidden || control.getAttribute("aria-disabled") === "true") {
      control.classList.remove("is-active");
      control.removeAttribute("aria-current");
      continue;
    }
    const active = control.textContent.trim().toLowerCase() === label.toLowerCase();
    control.classList.toggle("is-active", active);
    if (active) {
      control.setAttribute("aria-current", "page");
    } else {
      control.removeAttribute("aria-current");
    }
  }
}

function showScheduleView(...args) {
  appState.view = "schedule";
  updateUrlForView("schedule");
  setActiveNavByLabel("Schedule");
  return showSchedule(...args);
}

function showTeamsView(...args) {
  appState.view = "teams";
  updateUrlForView("teams");
  setActiveNavByLabel("Teams");
  return showTeams(...args);
}

function showPlayersView(...args) {
  appState.view = "players";
  updateUrlForView("players");
  setActiveNavByLabel("Players");
  return showPlayers(...args);
}

function showHeroesView(...args) {
  appState.view = "heroes";
  updateUrlForView("heroes");
  setActiveNavByLabel("Heroes");
  return showHeroes(...args);
}

function showHeroPoolView(...args) {
  appState.view = "hero pool";
  updateUrlForView("hero pool");
  setActiveNavByLabel("Hero Pool");
  return showHeroPool(...args);
}

function showPlayerPoolsView(...args) {
  appState.view = "player pool";
  updateUrlForView("player pool");
  setActiveNavByLabel("Player Pool");
  return showPlayerPools(...args);
}

function showH2HView(...args) {
  appState.view = "h2h";
  updateUrlForView("h2h");
  setActiveNavByLabel("H2H");
  return showH2H(...args);
}

function renderCurrentView() {
  if (appState.view === "schedule" && isViewAvailableForSeason("schedule")) return showScheduleView();
  if (appState.view === "players") return showPlayersView();
  if (appState.view === "heroes") return showHeroesView();
  if (appState.view === "hero pool") return showHeroPoolView();
  if (appState.view === "player pool") return showPlayerPoolsView();
  if (appState.view === "h2h") return showH2HView();
  return showTeamsView();
}

export async function initApp() {
  bindNavLinks();

  const startupWatchdog = setTimeout(() => {
    const output = document.getElementById("output");
    if (!output) return;
    if (output.textContent && output.textContent.includes("Loading data")) {
      output.innerHTML = `
        <div class="panel-title">Startup Timeout</div>
        <p>Data loading took too long.</p>
        <p><strong>Tip:</strong> Run from a local server instead of opening the HTML file directly.</p>
        <button type="button" class="retry-btn" onclick="initApp()">Retry</button>
      `;
    }
  }, 12000);

  try {
    const startupRoute = parseRoute(window.location.pathname, window.location.hash);
    appState.season = normalizeSeasonKey(startupRoute.season) || appState.season;
    setLoading("Loading data...");
    await loadData(appState.season);
    invalidateStatsCache();
    refreshDataRefs();
    updateSeasonMeta();
    await ensureCountdownDataLoaded();
    startCountdownTicker();
    appState.loaded = true;
    await applyRoute(window.location.pathname, window.location.hash);

    const selector = document.getElementById("seasonSelect");
    if (selector) selector.value = appState.season;

    if (window.matchMedia && window.matchMedia("(max-width: 700px)").matches) {
      setSupportPos("topRight");
    }
  } catch (err) {
    showLoadError(err);
  } finally {
    clearTimeout(startupWatchdog);
  }
}

export async function onSeasonChange(seasonKey) {
  if (!seasonKey || seasonKey === appState.season) return;
  if (!ENABLED_SEASONS.has(seasonKey)) return;

  appState.season = seasonKey;

  try {
    setLoading("Loading data...");
    await loadData(appState.season);
    invalidateStatsCache();
    refreshDataRefs();
    updateSeasonMeta();
    await ensureCountdownDataLoaded();
    startCountdownTicker();
    if (!isViewAvailableForSeason(appState.view, seasonKey)) {
      appState.view = getDefaultViewForSeason(seasonKey);
    }
    renderCurrentView();
    updateUrlForView(appState.view, { replace: true });
  } catch (err) {
    showLoadError(err);
  }
}

window.appState = appState;
window.initApp = initApp;
window.onSeasonChange = onSeasonChange;
window.showSchedule = showScheduleView;
window.onScheduleStageChange = onScheduleStageChange;
window.onScheduleTeamChange = onScheduleTeamChange;
window.openScheduleTeamModal = openScheduleTeamModal;
window.closeScheduleTeamModal = closeScheduleTeamModal;
window.openScheduleScorecard = openScheduleScorecard;
window.closeScheduleScorecard = closeScheduleScorecard;
window.selectScheduleScorecardGame = selectScheduleScorecardGame;
window.openTeamRoster = openTeamRoster;
window.closeTeamRoster = closeTeamRoster;
window.openTeamRosterProfile = openTeamRosterProfile;
window.backToTeamRoster = backToTeamRoster;
window.openPlayerDetailsModal = openPlayerDetailsModal;
window.closePlayerDetailsModal = closePlayerDetailsModal;
window.openPlayerProfileModal = openPlayerProfileModal;
window.closePlayerProfileModal = closePlayerProfileModal;
window.openHeroDetailsModal = openHeroDetailsModal;
window.closeHeroDetailsModal = closeHeroDetailsModal;
window.showTeams = showTeamsView;
window.sortTeams = sortTeams;
window.showPlayers = showPlayersView;
window.sortPlayers = sortPlayers;
window.showHeroes = showHeroesView;
window.sortHeroes = sortHeroes;
window.showHeroPool = showHeroPoolView;
window.sortHeroPool = sortHeroPool;
window.showPlayerPools = showPlayerPoolsView;
window.sortPlayerPools = sortPlayerPools;
window.showH2H = showH2HView;
window.syncH2hRoute = (tab) => {
  updateUrl(getRoutePath("h2h", String(tab || "").toLowerCase(), appState.season));
  syncNavHrefs();
};
window.getRouteHref = getRouteHref;
window.setH2hSubTab = setH2hSubTab;
window.onPlayerSearchInput = onPlayerSearchInput;
window.onTeamCompareChange = onTeamCompareChange;
window.onPlayerCompareChange = onPlayerCompareChange;
window.onHeroCompareChange = onHeroCompareChange;
window.openH2hPoolPopup = openH2hPoolPopup;
window.closeH2hPoolPopup = closeH2hPoolPopup;
window.onHeroSearchInput = onHeroSearchInput;
window.onHpPlayerSearchInput = onHpPlayerSearchInput;
window.onPpHeroSearchInput = onPpHeroSearchInput;
window.onPpExcludeUnusedToggle = onPpExcludeUnusedToggle;
window.invalidateStatsCache = invalidateStatsCache;

window.addEventListener("DOMContentLoaded", () => {
  initApp();
});

