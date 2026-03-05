const SEASON_DATA_FILES = {
  season16: {
    label: "MPL MY SEASON 16",
    roster: "/data/season16/roster.json",
    heroes: "/data/heroes.json",
    matches: "/data/season16/matches.json",
    teamLogos: "/data/season16/teamLogos.json",
    teamNames: "/data/season16/teamNames.json"
  },
  season17: {
    label: "MPL MY SEASON 17",
    roster: "/data/season17/roster.json",
    heroes: "/data/heroes.json",
    matches: "/data/season17/matches.json",
    teamLogos: "/data/season17/teamLogos.json",
    teamNames: "/data/season17/teamNames.json"
  }
};

const HERO_ALIASES = {
  YSS: "Yi Sun-Shin",
  Chang: "Chang'e",
  Lapu: "Lapu-Lapu"
};

let dataVersion = 0;
let roster = [];
let heroes = {};
let matches = [];
let teamLogos = {};
let teamNames = {};
let rosterMap = {};
let currentSeasonKey = "season16";

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validateRoster(list) {
  if (!Array.isArray(list)) throw new Error("roster.json must be an array");
  for (const item of list) {
    if (!item || typeof item.name !== "string" || typeof item.team !== "string" || typeof item.lane !== "string") {
      throw new Error("roster.json contains invalid player records");
    }
  }
}

function validateHeroes(map) {
  if (!map || typeof map !== "object" || Array.isArray(map)) {
    throw new Error("heroes.json must be an object map");
  }
}

function validateMatches(list) {
  if (!Array.isArray(list)) throw new Error("matches.json must be an array");

  for (const match of list) {
    if (!match || !Array.isArray(match.games)) {
      throw new Error("matches.json contains invalid match.games");
    }
    for (const game of match.games) {
      if (!game || !Array.isArray(game.players)) {
        throw new Error("matches.json contains invalid game.players");
      }
      for (const p of game.players) {
        if (!p || typeof p.name !== "string" || typeof p.hero !== "string") {
          throw new Error("matches.json player must include name and hero");
        }
        if (!isNumber(p.kills) || !isNumber(p.deaths) || !isNumber(p.assists)) {
          throw new Error("matches.json player KDA fields must be numeric");
        }
      }
    }
  }
}

function validateTeamLogos(map) {
  if (!map || typeof map !== "object" || Array.isArray(map)) {
    throw new Error("teamLogos.json must be an object map");
  }
}

function validateTeamNames(map) {
  if (!map || typeof map !== "object" || Array.isArray(map)) {
    throw new Error("teamNames.json must be an object map");
  }
}

function normalizeHeroName(name) {
  const key = String(name || "").trim();
  return HERO_ALIASES[key] || key;
}

function normalizeHeroesMap(map) {
  const out = {};
  for (const [name, img] of Object.entries(map || {})) {
    out[normalizeHeroName(name)] = img;
  }
  return out;
}

function normalizeMatchesHeroes(list) {
  return (list || []).map((match) => ({
    ...match,
    games: (match.games || []).map((game) => ({
      ...game,
      bans: Array.isArray(game.bans) ? game.bans.map((b) => normalizeHeroName(b)) : [],
      players: (game.players || []).map((p) => ({
        ...p,
        hero: normalizeHeroName(p.hero)
      }))
    }))
  }));
}

async function loadJson(path) {
  const controller = new AbortController();
  const timeoutMs = 10000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(path, { cache: "no-store", signal: controller.signal });
  } catch (err) {
    if (err && err.name === "AbortError") {
      throw new Error(`Timed out loading ${path} after ${timeoutMs / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
  if (!response.ok) {
    throw new Error(`Failed to load ${path} (${response.status})`);
  }
  const raw = await response.text();
  try {
    return JSON.parse(stripJsonComments(raw));
  } catch (err) {
    throw new Error(`Invalid JSON in ${path}: ${err.message || err}`);
  }
}

function stripJsonComments(input) {
  let out = "";
  let inString = false;
  let stringQuote = '"';
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        out += ch;
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inString) {
      out += ch;
      if (ch === "\\") {
        i += 1;
        if (i < input.length) out += input[i];
        continue;
      }
      if (ch === stringQuote) inString = false;
      continue;
    }

    if ((ch === '"' || ch === "'")) {
      inString = true;
      stringQuote = ch;
      out += ch;
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    out += ch;
  }

  return out;
}

function getSeasonConfig(seasonKey) {
  return SEASON_DATA_FILES[seasonKey] || SEASON_DATA_FILES.season16;
}

export async function loadData(seasonKey = "season16") {
  const config = getSeasonConfig(seasonKey);
  const [nextRoster, nextHeroes, nextMatches, nextTeamLogos, nextTeamNames] = await Promise.all([
    loadJson(config.roster),
    loadJson(config.heroes),
    loadJson(config.matches),
    loadJson(config.teamLogos),
    loadJson(config.teamNames)
  ]);

  validateRoster(nextRoster);
  const normalizedHeroes = normalizeHeroesMap(nextHeroes);
  const normalizedMatches = normalizeMatchesHeroes(nextMatches);

  validateHeroes(normalizedHeroes);
  validateMatches(normalizedMatches);
  validateTeamLogos(nextTeamLogos);
  validateTeamNames(nextTeamNames);

  roster = nextRoster;
  heroes = normalizedHeroes;
  matches = normalizedMatches;
  teamLogos = nextTeamLogos;
  teamNames = nextTeamNames;
  rosterMap = Object.fromEntries(roster.map((p) => [p.name, p]));
  currentSeasonKey = seasonKey in SEASON_DATA_FILES ? seasonKey : "season16";

  dataVersion += 1;
}

export function getDataVersion() {
  return dataVersion;
}

export function getCurrentSeasonKey() {
  return currentSeasonKey;
}

export function getCurrentSeasonLabel() {
  return getSeasonConfig(currentSeasonKey).label;
}

export function getRoster(name) {
  return rosterMap[name] || { name, team: "Unknown", lane: "Unknown", picture: "" };
}

export function getRosterList() {
  return roster;
}

export function getHeroesMap() {
  return heroes;
}

export function getMatches() {
  return matches;
}

export function getTeamLogosMap() {
  return teamLogos;
}

export function getTeamNamesMap() {
  return teamNames;
}

export function getTeamDisplayName(teamCode) {
  return teamNames[teamCode] || teamCode;
}

export function getHeroDisplayName(heroCodeOrName) {
  return normalizeHeroName(heroCodeOrName);
}
