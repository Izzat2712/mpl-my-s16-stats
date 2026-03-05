import { getCurrentSeasonLabel, loadData } from "./data-store.js";
import { invalidateStatsCache } from "./stats.js";
import {
  refreshDataRefs,
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
  season: "season16",
  view: "teams",
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
  }
};

const ENABLED_SEASONS = new Set(["season16"]);
const VIEW_ROUTES = {
  teams: "/",
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

function normalizePathname(pathname) {
  if (!pathname) return "/";
  const trimmed = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;
  return trimmed || "/";
}

function useHashRoutes() {
  const host = window.location.hostname;
  return window.location.protocol === "file:" || host === "localhost" || host === "127.0.0.1";
}

function getViewFromPathname(pathname) {
  return ROUTE_VIEWS[normalizePathname(pathname)] || "teams";
}

function getRoutePath(view, h2hSubTab = null) {
  if (view === "h2h") {
    const path = H2H_SUBTAB_ROUTES[h2hSubTab] || H2H_SUBTAB_ROUTES.team;
    return useHashRoutes() ? `#${path}` : path;
  }
  const path = VIEW_ROUTES[view] || VIEW_ROUTES.teams;
  return useHashRoutes() ? `#${path}` : path;
}

function getRouteHref(view, h2hSubTab = null) {
  const routePath = getRoutePath(view, h2hSubTab);
  return useHashRoutes() ? `/${routePath}` : routePath;
}

function parseRoute(pathname, hash = window.location.hash) {
  if (useHashRoutes()) {
    const normalizedHash = String(hash || "").trim();
    if (!normalizedHash || normalizedHash === "#/" || normalizedHash === "#") {
      return { view: "teams", h2hSubTab: null };
    }
    if (LOCAL_H2H_SUBTAB_ROUTES[normalizedHash]) {
      return { view: "h2h", h2hSubTab: LOCAL_H2H_SUBTAB_ROUTES[normalizedHash] };
    }
    return { view: LOCAL_ROUTE_VIEWS[normalizedHash] || "teams", h2hSubTab: null };
  }
  const normalized = normalizePathname(pathname);
  if (normalized === "/h2h") {
    return { view: "h2h", h2hSubTab: "team" };
  }
  if (normalized.startsWith("/h2h/")) {
    const subTab = normalized.slice("/h2h/".length).toLowerCase();
    if (H2H_SUBTAB_ROUTES[subTab]) {
      return { view: "h2h", h2hSubTab: subTab };
    }
    return { view: "h2h", h2hSubTab: "team" };
  }
  return { view: getViewFromPathname(normalized), h2hSubTab: null };
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
    updateUrl(getRoutePath("h2h", getH2hSubTab()), options);
    return;
  }
  updateUrl(getRoutePath(view), options);
}

function navigateToView(view, options = {}) {
  const nextView = view === "h2h" || VIEW_ROUTES[view] ? view : "teams";
  if (nextView === "h2h" && options.h2hSubTab) {
    setH2hSubTab(options.h2hSubTab);
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
    applyRoute(window.location.pathname, window.location.hash);
  });
  window.addEventListener("hashchange", () => {
    if (!useHashRoutes()) return;
    applyRoute(window.location.pathname, window.location.hash);
  });
  navLinksBound = true;
}

function syncNavHrefs() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  for (const link of nav.querySelectorAll("a[data-route]")) {
    const route = link.getAttribute("data-route");
    link.setAttribute("href", getRouteHref(route === "h2h" ? "h2h" : route, route === "h2h" ? getH2hSubTab() : null));
  }
}

function applyRoute(pathname, hash = window.location.hash) {
  const route = parseRoute(pathname, hash);
  suppressRouteSync = true;
  try {
    if (route.view === "h2h") {
      setH2hSubTab(route.h2hSubTab || "team");
      appState.view = "h2h";
      renderCurrentView();
      return;
    }
    appState.view = route.view;
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

function updateSeasonMeta() {
  const seasonLabel = getCurrentSeasonLabel();
  document.title = `${seasonLabel} Stats`;
  const heading = document.getElementById("seasonHeading");
  if (heading) heading.textContent = `${seasonLabel} STATISTICS`;
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
    const active = control.textContent.trim().toLowerCase() === label.toLowerCase();
    control.classList.toggle("is-active", active);
    if (active) {
      control.setAttribute("aria-current", "page");
    } else {
      control.removeAttribute("aria-current");
    }
  }
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
    setLoading("Loading data...");
    await loadData(appState.season);
    invalidateStatsCache();
    refreshDataRefs();
    updateSeasonMeta();
    appState.loaded = true;
    applyRoute(window.location.pathname, window.location.hash);

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
    renderCurrentView();
  } catch (err) {
    showLoadError(err);
  }
}

window.appState = appState;
window.initApp = initApp;
window.onSeasonChange = onSeasonChange;
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
  updateUrl(getRoutePath("h2h", String(tab || "").toLowerCase()));
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
