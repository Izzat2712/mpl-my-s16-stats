import { getCurrentSeasonLabel, getHeroesMap, getMatches, getRosterList, getTeamDisplayName, getTeamLogosMap } from "./data-store.js";
import { calculateHeroPoolStats, calculateHeroStats, calculatePlayerPoolsStats, calculatePlayerStats, calculateTeamStats } from "./stats.js";
import { getStaffList } from "./data-store.js";
import { getSeasonProfilesMap } from "./data-store.js";


let roster = [];
let staff = [];
let constHero = {};
let teamLogos = {};
let seasonProfiles = {};
const OBJECTIVE_ICONS = {
  lord: "https://static.wikia.nocookie.net/mobile-legends/images/2/27/Elemental_Lord.jpg/revision/latest?cb=20220104081726",
  turtle: "https://static.wikia.nocookie.net/mobile-legends/images/5/58/Dragon_Turtle.jpg/revision/latest?cb=20220104065903",
  tower: "https://static.wikia.nocookie.net/mobile-legends/images/3/31/IS_Base.jpg/revision/latest?cb=20200601110910"
};
const TEAM_CODE_ALIASES = {
  FL: "TF"
};

function teamLabel(teamCode) {
  return getTeamDisplayName(TEAM_CODE_ALIASES[teamCode] || teamCode);
}

function seasonLabel() {
  return getCurrentSeasonLabel();
}

const SCHEDULE_DAYS = [
  { key: "friday", label: "Friday", slots: 2 },
  { key: "saturday", label: "Saturday", slots: 3 },
  { key: "sunday", label: "Sunday", slots: 2 }
];
const SCHEDULE_STAGES = [
  { key: "regular", label: "Regular Season" },
  { key: "playoff", label: "Playoff" }
];
const MATCH_SOURCE_UTC_OFFSET_HOURS = 8;

function normalizeScheduleStage(stageValue) {
  const normalized = String(stageValue || "").trim().toLowerCase();
  return normalized === "playoff" || normalized === "playoffs" ? "playoff" : "regular";
}

function getMatchStage(match) {
  const schedule = match?.schedule && typeof match.schedule === "object" ? match.schedule : {};
  return normalizeScheduleStage(schedule.stage || match?.stage);
}

function getDefaultScheduleMeta(index) {
  const week = Math.floor(index / 7) + 1;
  const indexInWeek = index % 7;
  let offset = 0;

  for (const day of SCHEDULE_DAYS) {
    if (indexInWeek < offset + day.slots) {
      return {
        week,
        day: day.key,
        dayLabel: day.label,
        dayMatch: indexInWeek - offset + 1
      };
    }
    offset += day.slots;
  }

  return { week, day: "friday", dayLabel: "Friday", dayMatch: 1 };
}

function getMatchScheduleMeta(match, index) {
  const fallback = getDefaultScheduleMeta(index);
  const schedule = match.schedule && typeof match.schedule === "object" ? match.schedule : {};
  const dayValue = String(schedule.day || match.day || fallback.day).trim().toLowerCase();
  const dayConfig = SCHEDULE_DAYS.find((entry) => entry.key === dayValue) || SCHEDULE_DAYS[0];

  return {
    week: Number(schedule.week ?? match.week) || fallback.week,
    day: dayConfig.key,
    dayLabel: dayConfig.label,
    dayMatch: Number(schedule.dayMatch ?? match.dayMatch) || fallback.dayMatch,
    date: String(schedule.date || match.date || "").trim(),
    startTime: String(schedule.startTime || match.startTime || "").trim()
  };
}

function parseScheduleMatchDateTime(dateValue, startTimeValue) {
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

function compareScheduleEntries(a, b) {
  const aStart = parseScheduleMatchDateTime(a.meta.date, a.meta.startTime)?.getTime() ?? Number.POSITIVE_INFINITY;
  const bStart = parseScheduleMatchDateTime(b.meta.date, b.meta.startTime)?.getTime() ?? Number.POSITIVE_INFINITY;
  if (aStart !== bStart) return aStart - bStart;
  if (a.meta.date !== b.meta.date) return String(a.meta.date || "").localeCompare(String(b.meta.date || ""));
  if (a.meta.dayMatch !== b.meta.dayMatch) return a.meta.dayMatch - b.meta.dayMatch;
  return a.index - b.index;
}

function getStageSegmentData(matchEntries, stage = "regular") {
  const normalizedStage = normalizeScheduleStage(stage);
  const filteredEntries = matchEntries
    .filter((entry) => getMatchStage(entry.match) === normalizedStage)
    .map((entry) => ({ ...entry, meta: getMatchScheduleMeta(entry.match, entry.index) }));

  if (normalizedStage === "playoff") {
    const orderedEntries = [...filteredEntries].sort(compareScheduleEntries);
    const orderedKeys = [];
    const keyToIndex = new Map();

    for (const entry of orderedEntries) {
      const key = entry.meta.date || `undated-${entry.index}`;
      if (!keyToIndex.has(key)) {
        keyToIndex.set(key, orderedKeys.length + 1);
        orderedKeys.push(key);
      }
    }

    return {
      entries: filteredEntries.map((entry) => {
        const segmentKey = entry.meta.date || `undated-${entry.index}`;
        const segmentNumber = keyToIndex.get(segmentKey) || 1;
        return {
          ...entry,
          segmentKey,
          segmentNumber,
          segmentLabel: `Day ${segmentNumber}`
        };
      }),
      segmentTabs: orderedKeys.map((key, index) => ({
        key,
        value: index + 1,
        label: `Day ${index + 1}`
      })),
      segmentKind: "day"
    };
  }

  const segmentTabs = Array.from(
    new Set(filteredEntries.map((entry) => Number(entry.meta.week) || 1))
  )
    .sort((a, b) => a - b)
    .map((week) => ({
      key: week,
      value: week,
      label: `Week ${week}`
    }));

  return {
    entries: filteredEntries.map((entry) => ({
      ...entry,
      segmentKey: Number(entry.meta.week) || 1,
      segmentNumber: Number(entry.meta.week) || 1,
      segmentLabel: `Week ${Number(entry.meta.week) || 1}`
    })),
    segmentTabs,
    segmentKind: "week"
  };
}

function formatScheduleCountdown(diffMs) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function getScheduleStatusMeta(match, meta, selectedTeam = "") {
  const score = getMatchScore(match);
  if (score.played) {
    const normalizedSelectedTeam = normalizeScheduleTeamCode(selectedTeam);
    let stateClass = "is-finished";

    if (normalizedSelectedTeam) {
      if (score.teamAScore > score.teamBScore) {
        stateClass = normalizeScheduleTeamCode(match.teamA) === normalizedSelectedTeam ? "is-win" : "is-loss";
      } else if (score.teamBScore > score.teamAScore) {
        stateClass = normalizeScheduleTeamCode(match.teamB) === normalizedSelectedTeam ? "is-win" : "is-loss";
      }
    }

    return {
      label: "Finished",
      detail: "",
      stateClass
    };
  }

  const startAt = parseScheduleMatchDateTime(meta.date, meta.startTime);
  if (startAt && startAt.getTime() > Date.now()) {
    return {
      label: "Upcoming",
      detail: formatScheduleCountdown(startAt.getTime() - Date.now()),
      stateClass: "is-upcoming",
      startAtMs: startAt.getTime()
    };
  }

  return {
    label: "Upcoming",
    detail: "TBD",
    stateClass: "is-upcoming"
  };
}

function refreshScheduleCountdowns() {
  const countdownNodes = document.querySelectorAll(".scheduleTeamStatus[data-start-at]");
  if (!countdownNodes.length) return;

  const now = Date.now();
  for (const node of countdownNodes) {
    const startAtMs = Number(node.getAttribute("data-start-at"));
    const detailNode = node.querySelector(".scheduleTeamStatusDetail");
    if (!detailNode || !Number.isFinite(startAtMs)) continue;

    const diffMs = startAtMs - now;
    detailNode.textContent = diffMs > 0 ? formatScheduleCountdown(diffMs) : "0d 00h 00m 00s";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function encodeInlineString(value) {
  return encodeURIComponent(String(value ?? ""));
}

function toDisplayLabel(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getMatchScore(match) {
  let teamAScore = 0;
  let teamBScore = 0;

  for (const game of (match.games || [])) {
    if (game?.winner === match.teamA) teamAScore += 1;
    if (game?.winner === match.teamB) teamBScore += 1;
  }

  return {
    teamAScore,
    teamBScore,
    played: teamAScore > 0 || teamBScore > 0
  };
}

function hasScorecardPlayers(game) {
  return Array.isArray(game?.players) && game.players.length > 0;
}

function getAvailableScorecardGames(match) {
  return (match.games || [])
    .map((game, index) => ({ game, index }))
    .filter((entry) => hasScorecardPlayers(entry.game));
}

function normalizeScheduleTeamCode(teamCode) {
  return TEAM_CODE_ALIASES[String(teamCode || "").trim()] || String(teamCode || "").trim();
}

function getScheduleTeamLogo(teamCode) {
  const normalizedTeamCode = normalizeScheduleTeamCode(teamCode);
  return teamLogos[normalizedTeamCode] || teamLogos[teamCode] || "";
}

function renderScheduleMatchCard(match, index) {
  const meta = getMatchScheduleMeta(match, index);
  const score = getMatchScore(match);
  const availableGames = getAvailableScorecardGames(match);
  const hasScorecard = availableGames.length > 0;
  const teamALogo = getScheduleTeamLogo(match.teamA);
  const teamBLogo = getScheduleTeamLogo(match.teamB);
  const scoreLabel = score.played ? `${score.teamAScore} - ${score.teamBScore}` : "VS";

  return `
    <article class="scheduleMatchCard">
      <div class="scheduleMatchMeta">
        <span>Match ${index + 1}</span>
        <span>${meta.date || "TBD date"}</span>
        <span>${meta.startTime || "TBD time"}</span>
      </div>
      <div class="scheduleTeams">
        <button
          type="button"
          class="scheduleTeam scheduleTeamTrigger"
          onclick="openScheduleTeamModal('${match.teamA}')"
          aria-label="Open ${teamLabel(match.teamA)} team summary"
        >
          ${teamALogo ? `<img class="scheduleTeamLogo" src="${teamALogo}" alt="${teamLabel(match.teamA)} logo">` : ""}
          <span>${teamLabel(match.teamA)}</span>
        </button>
        ${hasScorecard ? `
          <button
            type="button"
            class="scheduleScore ${score.played ? "is-played" : ""} is-clickable"
            onclick="openScheduleScorecard(${index}, 0)"
            aria-label="Open scorecard for ${teamLabel(match.teamA)} versus ${teamLabel(match.teamB)}"
          >
            ${scoreLabel}
          </button>
        ` : `
          <div class="scheduleScore ${score.played ? "is-played" : ""}">
            ${scoreLabel}
          </div>
        `}
        <button
          type="button"
          class="scheduleTeam scheduleTeamTrigger"
          onclick="openScheduleTeamModal('${match.teamB}')"
          aria-label="Open ${teamLabel(match.teamB)} team summary"
        >
          ${teamBLogo ? `<img class="scheduleTeamLogo" src="${teamBLogo}" alt="${teamLabel(match.teamB)} logo">` : ""}
          <span>${teamLabel(match.teamB)}</span>
        </button>
      </div>
    </article>
  `;
}

function getScheduleTeams(matches) {
  return Array.from(new Set(
    matches.flatMap((match) => [match.teamA, match.teamB]).filter(Boolean).map((teamCode) => normalizeScheduleTeamCode(teamCode))
  )).sort((a, b) => teamLabel(a).localeCompare(teamLabel(b)));
}

function renderScheduleFilters(matches, selectedTeam = "", selectedStage = "regular") {
  const teams = getScheduleTeams(matches);
  const normalizedStage = normalizeScheduleStage(selectedStage);

  return `
    <div class="scheduleFilterBar">
      <label for="scheduleStageFilter">Stage</label>
      <select id="scheduleStageFilter" onchange="onScheduleStageChange(this.value)">
        ${SCHEDULE_STAGES.map((stage) => `
          <option value="${stage.key}" ${stage.key === normalizedStage ? "selected" : ""}>${stage.label}</option>
        `).join("")}
      </select>
      <label for="scheduleTeamFilter">Team</label>
      <select id="scheduleTeamFilter" onchange="onScheduleTeamChange(this.value)">
        <option value="" ${selectedTeam ? "" : "selected"}>All teams</option>
        ${teams.map((teamCode) => `
          <option value="${teamCode}" ${teamCode === selectedTeam ? "selected" : ""}>${teamLabel(teamCode)}</option>
        `).join("")}
      </select>
    </div>
  `;
}

function renderScheduleTeamSegmentSection(segmentLabel, entries, selectedTeam = "") {
  return `
    <section class="scheduleTeamWeekSection">
      <h3 class="scheduleTeamWeekTitle">${segmentLabel}</h3>
      <div class="scheduleTeamWeekList">
        ${entries.map(({ match, index, meta }) => {
          const score = getMatchScore(match);
          const result = score.played ? `${score.teamAScore} - ${score.teamBScore}` : "";
          const matchupLabel = score.played ? result : "vs";
          const teamALogo = getScheduleTeamLogo(match.teamA);
          const teamBLogo = getScheduleTeamLogo(match.teamB);
          const hasScorecard = getAvailableScorecardGames(match).length > 0;
          const status = getScheduleStatusMeta(match, meta, selectedTeam);

          return `
            <article class="scheduleTeamTextRow">
              <span class="scheduleTeamMatchNo">Match ${index + 1}</span>
              <span class="scheduleTeamDateTime">
                <span>${meta.dayLabel}</span>
                <span>${meta.date || "TBD date"}</span>
                <span>${meta.startTime || "TBD time"}</span>
              </span>
              <span class="scheduleTeamMatchup">
                <button
                  type="button"
                  class="scheduleTeamMatchupSide scheduleTeamMatchupTrigger"
                  onclick="openScheduleTeamModal('${match.teamA}')"
                  aria-label="Open ${teamLabel(match.teamA)} team summary"
                >
                  ${teamALogo ? `<img class="scheduleTeamInlineLogo" src="${teamALogo}" alt="${teamLabel(match.teamA)} logo">` : ""}
                  <span>${teamLabel(match.teamA)}</span>
                </button>
                ${hasScorecard ? `
                  <button
                    type="button"
                    class="scheduleTeamMatchupVs is-clickable ${score.played ? "is-played" : ""}"
                    onclick="openScheduleScorecard(${index}, 0)"
                    aria-label="Open scorecard for ${teamLabel(match.teamA)} versus ${teamLabel(match.teamB)}"
                  >
                    ${matchupLabel}
                  </button>
                ` : `
                  <span class="scheduleTeamMatchupVs ${score.played ? "is-played" : ""}">${matchupLabel}</span>
                `}
                <button
                  type="button"
                  class="scheduleTeamMatchupSide scheduleTeamMatchupTrigger"
                  onclick="openScheduleTeamModal('${match.teamB}')"
                  aria-label="Open ${teamLabel(match.teamB)} team summary"
                >
                  ${teamBLogo ? `<img class="scheduleTeamInlineLogo" src="${teamBLogo}" alt="${teamLabel(match.teamB)} logo">` : ""}
                  <span>${teamLabel(match.teamB)}</span>
                </button>
              </span>
              <span class="scheduleTeamTextScore scheduleTeamStatus ${status.stateClass}" ${status.startAtMs ? `data-start-at="${status.startAtMs}"` : ""}>
                <span class="scheduleTeamStatusLabel">${status.label}</span>
                ${status.detail ? `<span class="scheduleTeamStatusDetail">${status.detail}</span>` : ""}
              </span>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderScheduleTabs(segmentTabs, activeValue, emptyLabel = "") {
  if (!segmentTabs.length) {
    return emptyLabel ? `<div class="scheduleEmpty">${emptyLabel}</div>` : "";
  }

  return `
    <div class="nav scheduleWeekNav">
      ${segmentTabs.map((tab) => `
        <button
          type="button"
          class="${tab.value === activeValue ? "is-active" : ""}"
          onclick="showSchedule(${tab.value})"
        >
          ${tab.label}
        </button>
      `).join("")}
    </div>
  `;
}

function renderPlayoffBoard(entries) {
  if (!entries.length) {
    return `<div class="scheduleEmpty">No matches set.</div>`;
  }

  const orderedEntries = [...entries].sort(compareScheduleEntries);
  return `
    <div class="scheduleDayBody">
      ${orderedEntries.map((entry) => renderScheduleMatchCard(entry.match, entry.index)).join("")}
    </div>
  `;
}

function renderScheduleTeamView(matchEntries, selectedTeam = "", activeSegment = 1, segmentTabs = []) {
  const groupedBySegment = new Map();

  for (const entry of matchEntries) {
    const segmentEntries = groupedBySegment.get(entry.segmentKey) || [];
    segmentEntries.push(entry);
    groupedBySegment.set(entry.segmentKey, segmentEntries);
  }

  const orderedSegments = segmentTabs
    .filter((tab) => groupedBySegment.has(tab.key))
    .map((tab) => ({
      ...tab,
      entries: groupedBySegment.get(tab.key) || []
    }));

  if (!orderedSegments.length) {
    return `<div class="scheduleEmpty">No matches set for this team.</div>`;
  }

  const availableValues = new Set(orderedSegments.map((segment) => segment.value));
  const visibleValue = availableValues.has(activeSegment) ? activeSegment : orderedSegments[0].value;
  const visibleSegment = orderedSegments.find((segment) => segment.value === visibleValue) || orderedSegments[0];
  const visibleEntries = [...visibleSegment.entries].sort(compareScheduleEntries);

  return `
    ${renderScheduleTabs(orderedSegments, visibleValue)}
    <div class="scheduleTeamView">
      ${renderScheduleTeamSegmentSection(visibleSegment.label, visibleEntries, selectedTeam)}
    </div>
  `;
}

function showSchedule(week = null) {
  const matches = getMatches();
  const selectedStage = normalizeScheduleStage(window.appState?.scheduleStage || "regular");
  const matchEntries = matches.map((match, index) => ({ match, index }));
  const stageData = getStageSegmentData(matchEntries, selectedStage);
  const stageMatches = stageData.entries.map((entry) => entry.match);
  const availableTeams = getScheduleTeams(stageMatches);
  const fallbackValue = stageData.segmentTabs[0]?.value || 1;
  const activeSegment = Number(week ?? window.appState?.scheduleWeek ?? fallbackValue) || fallbackValue;
  const requestedTeam = normalizeScheduleTeamCode(window.appState?.scheduleTeam || "");
  const selectedTeam = availableTeams.includes(requestedTeam) ? requestedTeam : "";

  if (window.appState) {
    window.appState.scheduleWeek = stageData.segmentTabs.some((tab) => tab.value === activeSegment) ? activeSegment : fallbackValue;
    window.appState.scheduleTeam = selectedTeam;
    window.appState.scheduleStage = selectedStage;
  }

  const matchesForSegment = stageData.entries.filter((entry) => entry.segmentNumber === (window.appState?.scheduleWeek ?? fallbackValue));
  const matchesForTeam = selectedTeam
    ? stageData.entries.filter((entry) => {
        const teamA = normalizeScheduleTeamCode(entry.match.teamA);
        const teamB = normalizeScheduleTeamCode(entry.match.teamB);
        return teamA === selectedTeam || teamB === selectedTeam;
      })
    : [];

  const html = `
    <h2 class="panel-title">Schedule ${seasonLabel()}</h2>

    ${renderScheduleFilters(stageMatches, selectedTeam, selectedStage)}

    ${selectedTeam ? renderScheduleTeamView(matchesForTeam, selectedTeam, window.appState?.scheduleWeek ?? fallbackValue, stageData.segmentTabs) : `
      ${stageData.segmentTabs.length ? `
        ${renderScheduleTabs(stageData.segmentTabs, window.appState?.scheduleWeek ?? fallbackValue)}

        ${selectedStage === "playoff" ? renderPlayoffBoard(matchesForSegment) : `
          <div class="scheduleBoard">
            ${SCHEDULE_DAYS.map((day) => {
              const dayMatches = matchesForSegment
                .filter((entry) => entry.meta.day === day.key)
                .sort((a, b) => a.meta.dayMatch - b.meta.dayMatch);

              return `
                <section class="scheduleDayColumn">
                  <div class="scheduleDayHeader">
                    <h3>${day.label}</h3>
                  </div>
                  <div class="scheduleDayBody">
                    ${dayMatches.length
                      ? dayMatches.map((entry) => renderScheduleMatchCard(entry.match, entry.index)).join("")
                      : `<div class="scheduleEmpty">No matches set.</div>`
                    }
                  </div>
                </section>
              `;
            }).join("")}
          </div>
        `}
      ` : `
        <div class="scheduleEmpty">${selectedStage === "playoff" ? "No playoff yet." : "No matches set."}</div>
      `}
    `}

  `;

  document.getElementById("output").innerHTML = html;
  mountScheduleScorecardModal();
  mountScheduleTeamModal();
  refreshScheduleCountdowns();
}

function mountScheduleScorecardModal() {
  const modalId = "scheduleScorecardModalRoot";
  let modalRoot = document.getElementById(modalId);

  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = modalId;
    document.body.appendChild(modalRoot);
  }

  modalRoot.innerHTML = renderScheduleScorecardModal();
}

function mountScheduleTeamModal() {
  const modalId = "scheduleTeamModalRoot";
  let modalRoot = document.getElementById(modalId);

  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = modalId;
    document.body.appendChild(modalRoot);
  }

  modalRoot.innerHTML = renderScheduleTeamModal();
}

function onScheduleTeamChange(teamCode) {
  if (window.appState) {
    window.appState.scheduleTeam = normalizeScheduleTeamCode(teamCode);
  }
  showSchedule(window.appState?.scheduleWeek ?? null);
}

function onScheduleStageChange(stage) {
  if (window.appState) {
    window.appState.scheduleStage = normalizeScheduleStage(stage);
    window.appState.scheduleWeek = 1;
  }
  showSchedule(1);
}

function getEmptyTeamSummary(teamCode) {
  return {
    team: teamCode,
    matchWins: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    lord: 0,
    turtle: 0,
    tower: 0
  };
}

function getTeamSummary(teamCode) {
  const normalizedTeamCode = normalizeScheduleTeamCode(teamCode);
  const teamStats = calculateTeamStats();
  const summary = teamStats[normalizedTeamCode] || teamStats[teamCode] || getEmptyTeamSummary(normalizedTeamCode || String(teamCode || "").trim());

  return {
    teamCode: normalizedTeamCode || String(teamCode || "").trim(),
    label: teamLabel(normalizedTeamCode || teamCode),
    logo: getScheduleTeamLogo(normalizedTeamCode || teamCode),
    matchWins: Number(summary?.matchWins) || 0,
    kills: Number(summary?.kills) || 0,
    deaths: Number(summary?.deaths) || 0,
    assists: Number(summary?.assists) || 0,
    lord: Number(summary?.lord) || 0,
    turtle: Number(summary?.turtle) || 0,
    tower: Number(summary?.tower) || 0
  };
}

function openScheduleTeamModal(teamCode) {
  scheduleTeamModalState = { teamCode: normalizeScheduleTeamCode(teamCode) };
  showSchedule(window.appState?.scheduleWeek ?? null);
}

function closeScheduleTeamModal() {
  scheduleTeamModalState = { teamCode: "" };
  showSchedule(window.appState?.scheduleWeek ?? null);
}

function renderScheduleTeamModal() {
  const teamCode = String(scheduleTeamModalState.teamCode || "").trim();
  if (!teamCode) return "";

  const summary = getTeamSummary(teamCode);
  const rows = [
    { label: "Matches Won", value: summary.matchWins },
    { label: "Kills", value: summary.kills },
    { label: "Deaths", value: summary.deaths },
    { label: "Assists", value: summary.assists },
    { label: "Lord", value: summary.lord },
    { label: "Turtle", value: summary.turtle },
    { label: "Tower", value: summary.tower }
  ];

  return `
    <div class="h2hModalBackdrop" onclick="closeScheduleTeamModal()">
      <div class="scheduleTeamSummaryModal h2hModalCard" onclick="event.stopPropagation()">
        <button type="button" class="scheduleScorecardClose scheduleTeamSummaryClose" onclick="closeScheduleTeamModal()" aria-label="Close team summary">X</button>
        <div class="scheduleTeamSummaryHeader">
          <div class="scheduleTeamSummaryIdentity">
            <div class="scheduleTeamSummaryLabel">Team</div>
            ${summary.logo ? `<img class="scheduleTeamSummaryLogo" src="${summary.logo}" alt="${escapeHtml(summary.label)} logo">` : ""}
            <h3>${escapeHtml(summary.label)}</h3>
          </div>
        </div>
        <div class="scheduleTeamSummaryRows">
          ${rows.map((row) => `
            <div class="scheduleTeamSummaryRow">
              <span class="scheduleTeamSummaryRowLabel">${escapeHtml(row.label)}</span>
              <span class="scheduleTeamSummaryRowValue">${row.value}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

export function refreshDataRefs() {
  roster = getRosterList();
  staff = getStaffList();
  constHero = getHeroesMap();
  teamLogos = getTeamLogosMap();
  seasonProfiles = getSeasonProfilesMap();
}

let teamSort = {key: "matchWins", asc: false }; // false = DESC (highest matchWins first)
let playerSort = { key: "kda", asc: false };
let heroSort = { key: "pickRate", asc: false };
let heroPoolSort = { key: "totalHeroes", asc: false };
let playerPoolsSort = { key: "totalPlayers", asc: false };
let h2hSubTab = "team";
let scheduleScorecardState = { matchIndex: null, gameIndex: 0 };
let scheduleTeamModalState = { teamCode: "" };
let teamRosterModalState = { teamCode: "", memberName: "", memberType: "" };
let playerDetailsModalState = { playerName: "" };
let playerProfileModalState = { playerName: "" };
let heroDetailsModalState = { heroName: "" };

function getScheduleScorecardPositionStyle() {
  return "";
}
let teamCompareState = { left: "", right: "" };
let playerCompareState = { left: "", right: "" };
let heroCompareState = { left: "", right: "" };
let h2hPopupState = { kind: "", side: "" };



// ===== SEARCH STATE (Players) =====
let playerSearchState = { value: "", caret: 0 };

function onPlayerSearchInput(e) {
  playerSearchState.value = e.target.value;
  playerSearchState.caret = e.target.selectionStart || playerSearchState.value.length;
  showPlayers(true); // true = keep focus
}

// ===== SEARCH STATES (continuous typing) =====
let heroSearchState = { value: "", caret: 0 };          // Heroes tab (hero name)
let hpPlayerSearchState = { value: "", caret: 0 };      // Hero Pool tab (player name)
let ppHeroSearchState = { value: "", caret: 0 };        // Player Pool tab (hero name)
let ppExcludeUnused = false; // checkbox state

function onHeroSearchInput(e) {
  heroSearchState.value = e.target.value;
  heroSearchState.caret = e.target.selectionStart || heroSearchState.value.length;
  showHeroes(true);
}

// HERO POOL: search PLAYER NAME
function onHpPlayerSearchInput(e) {
  hpPlayerSearchState.value = e.target.value;
  hpPlayerSearchState.caret = e.target.selectionStart || hpPlayerSearchState.value.length;
  showHeroPool(true);
}

// PLAYER POOL: search HERO NAME
function onPpHeroSearchInput(e) {
  ppHeroSearchState.value = e.target.value;
  ppHeroSearchState.caret = e.target.selectionStart || ppHeroSearchState.value.length;
  showPlayerPools(true);
}

function onPpExcludeUnusedToggle(e) {
  ppExcludeUnused = e.target.checked;
  showPlayerPools(false);
}

const laneOrder = {
  "Gold Laner": 1,
  "Jungler": 2,
  "Midlaner": 3,
  "Exp Laner": 4,
  "Roamer": 5
};

function onTeamCompareChange(side, value) {
  if (side !== "left" && side !== "right") return;
  teamCompareState[side] = value || "";
  showH2H();
}

function onPlayerCompareChange(side, value, caret = null) {
  if (side !== "left" && side !== "right") return;
  playerCompareState[side] = value || "";
  const focusId = `h2hPlayerSearch-${side}`;
  showH2H({ focusId, caret });
}

function onHeroCompareChange(side, value, caret = null) {
  if (side !== "left" && side !== "right") return;
  heroCompareState[side] = value || "";
  const focusId = `h2hHeroSearch-${side}`;
  showH2H({ focusId, caret });
}

function openH2hPoolPopup(kind, side) {
  if (!kind || (side !== "left" && side !== "right")) return;
  h2hPopupState = { kind, side };
  showH2H();
}

function closeH2hPoolPopup() {
  h2hPopupState = { kind: "", side: "" };
  showH2H();
}

function openScheduleScorecard(matchIndex, gameIndex = 0) {
  const match = getMatches()[matchIndex];
  const availableGames = match ? getAvailableScorecardGames(match) : [];
  if (!availableGames.length) return;

  scheduleScorecardState = {
    matchIndex,
    gameIndex: Math.min(Math.max(Number(gameIndex) || 0, 0), availableGames.length - 1)
  };
  showSchedule(window.appState?.scheduleWeek ?? null);
}

function closeScheduleScorecard() {
  scheduleScorecardState = { matchIndex: null, gameIndex: 0 };
  showSchedule(window.appState?.scheduleWeek ?? null);
}

function selectScheduleScorecardGame(gameIndex) {
  if (scheduleScorecardState.matchIndex == null) return;
  scheduleScorecardState = {
    ...scheduleScorecardState,
    gameIndex: Math.max(0, Number(gameIndex) || 0)
  };
  showSchedule(window.appState?.scheduleWeek ?? null);
}

function getRosterTeamForPlayer(name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  if (!normalizedName) return "";

  const record = roster.find((item) => String(item?.name || "").trim().toLowerCase() === normalizedName);
  return record?.team || "";
}

function getRosterPlayerRecord(name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  if (!normalizedName) return null;
  return roster.find((item) => String(item?.name || "").trim().toLowerCase() === normalizedName) || null;
}

function getPlayerSummary(name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  if (!normalizedName) return null;

  const playerStats = calculatePlayerStats();
  const heroPools = calculateHeroPoolStats();
  const statName = Object.keys(playerStats).find(
    (playerName) => String(playerName || "").trim().toLowerCase() === normalizedName
  ) || "";
  const stats = statName ? playerStats[statName] : null;
  const record = getRosterPlayerRecord(statName || name);
  const pool = heroPools[statName] || heroPools[String(record?.name || "").trim()] || { heroes: {} };

  if (!stats && !record) return null;

  const games = Number(stats?.games) || 0;
  const kills = Number(stats?.kills) || 0;
  const deaths = Number(stats?.deaths) || 0;
  const assists = Number(stats?.assists) || 0;
  const kpTotal = Number(stats?.kpTotal) || 0;

  return {
    name: String(stats?.name || record?.name || statName || name).trim() || "Unknown Player",
    team: String(stats?.team || record?.team || "").trim(),
    lane: String(stats?.lane || record?.lane || "Unknown").trim() || "Unknown",
    picture: String(stats?.picture || record?.picture || "").trim(),
    games,
    heroPoolCount: Object.keys(pool.heroes || {}).length,
    kills,
    deaths,
    assists,
    avgK: games ? kills / games : 0,
    avgD: games ? deaths / games : 0,
    avgA: games ? assists / games : 0,
    kda: (kills + assists) / (deaths || 1),
    kp: games ? (kpTotal / games) * 100 : 0
  };
}

function getHeroSummary(name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  if (!normalizedName) return null;

  const heroStats = calculateHeroStats();
  const playerPools = calculatePlayerPoolsStats();
  const heroEntry = heroStats.find((hero) => String(hero?.hero || "").trim().toLowerCase() === normalizedName);
  if (!heroEntry) return null;

  let kills = 0;
  let deaths = 0;
  let assists = 0;
  for (const match of getMatches()) {
    for (const game of (match.games || [])) {
      for (const player of (game.players || [])) {
        const heroName = String(player?.hero || "").trim().toLowerCase();
        if (heroName !== normalizedName) continue;
        kills += Number(player?.kills) || 0;
        deaths += Number(player?.deaths) || 0;
        assists += Number(player?.assists) || 0;
      }
    }
  }

  const pool = playerPools[heroEntry.hero] || { players: {} };

  return {
    hero: String(heroEntry.hero || name).trim(),
    img: String(heroEntry.img || constHero[heroEntry.hero] || "").trim(),
    pick: Number(heroEntry.pick) || 0,
    pickRate: Number(heroEntry.pickRate) || 0,
    ban: Number(heroEntry.ban) || 0,
    banRate: Number(heroEntry.banRate) || 0,
    winRate: Number(heroEntry.winRate) || 0,
    kills,
    deaths,
    assists,
    kda: (kills + assists) / (deaths || 1),
    playerPoolCount: Object.keys(pool.players || {}).length
  };
}

function partitionScorecardPlayers(match, game) {
  const grouped = {
    [match.teamA]: [],
    [match.teamB]: []
  };
  const unresolved = [];

  for (const player of (game.players || [])) {
    const explicitTeam = String(player?.team || "").trim();
    const rosterTeam = getRosterTeamForPlayer(player?.name);
    const resolvedTeam = explicitTeam || rosterTeam;

    if (resolvedTeam === match.teamA || resolvedTeam === match.teamB) {
      grouped[resolvedTeam].push(player);
    } else {
      unresolved.push(player);
    }
  }

  for (const player of unresolved) {
    const nextTeam = grouped[match.teamA].length < 5 ? match.teamA : match.teamB;
    grouped[nextTeam].push(player);
  }

  return grouped;
}

function renderScorecardPlayerRow(player, isMvp = false) {
  const heroName = String(player?.hero || "").trim();
  const heroImg = constHero[heroName] || "";
  const playerRecord = getRosterPlayerRecord(player?.name);
  const playerPicture = playerRecord?.picture || "";
  const kda = `${Number(player?.kills) || 0}/${Number(player?.deaths) || 0}/${Number(player?.assists) || 0}`;

  return `
    <div class="scheduleScorecardPlayer ${isMvp ? "is-mvp topMVP" : ""}">
      ${isMvp ? `<div class="scheduleScorecardMvpBadge">MVP</div>` : ""}
      <div class="scheduleScorecardPlayerMain">
        <span class="scheduleScorecardPlayerFaceWrap">
          ${playerPicture ? `<img class="scheduleScorecardPlayerFace" src="${playerPicture}" alt="${player?.name || "Player"}">` : ""}
        </span>
        <span class="scheduleScorecardPlayerName">${player?.name || "TBD Player"}</span>
      </div>
      <div class="scheduleScorecardHero">
        ${heroImg ? `<img class="scheduleScorecardHeroImg" src="${heroImg}" alt="${heroName}">` : ""}
        <span>${heroName || "TBD Hero"}</span>
      </div>
      <div class="scheduleScorecardKda">${kda}</div>
    </div>
  `;
}

function renderScorecardTeamCard(teamCode, players) {
  const teamLogo = teamLogos[teamCode] || "";
  const activeMatch = getMatches()[scheduleScorecardState.matchIndex];
  const availableGames = activeMatch ? getAvailableScorecardGames(activeMatch) : [];
  const activeIndex = Math.min(Math.max(scheduleScorecardState.gameIndex, 0), Math.max(availableGames.length - 1, 0));
  const activeGame = availableGames[activeIndex]?.game || null;
  const mvpName = String(activeGame?.mvp || "").trim().toLowerCase();

  return `
    <section class="scheduleScorecardTeamCard">
      <div class="scheduleScorecardTeamHead">
        ${teamLogo ? `<img class="scheduleScorecardTeamLogo" src="${teamLogo}" alt="${teamLabel(teamCode)} logo">` : ""}
        <div>
          <h4>${teamLabel(teamCode) || "TBD Team"}</h4>
        </div>
      </div>
      <div class="scheduleScorecardPlayerList">
        ${players.length
          ? players.map((player) => renderScorecardPlayerRow(player, String(player?.name || "").trim().toLowerCase() === mvpName)).join("")
          : `<div class="scheduleScorecardEmpty">No player data for this team yet.</div>`
        }
      </div>
    </section>
  `;
}

function renderScorecardBans(game) {
  const bans = Array.isArray(game?.bans) ? game.bans.slice(0, 10) : [];

  return `
    <section class="scheduleScorecardBansPanel" aria-label="Banned heroes">
      <div class="scheduleScorecardBansGrid">
        ${bans.length
          ? bans.map((heroName) => {
              const heroImg = constHero[String(heroName || "").trim()] || "";
              return `
                <div class="scheduleScorecardBan" title="${heroName || "TBD Hero"}">
                  ${heroImg ? `<img class="scheduleScorecardBanImg" src="${heroImg}" alt="${heroName}">` : `<span class="scheduleScorecardBanFallback">?</span>`}
                  <span class="scheduleScorecardBanX" aria-hidden="true">X</span>
                </div>
              `;
            }).join("")
          : `<div class="scheduleScorecardEmpty">No ban data yet.</div>`
        }
      </div>
    </section>
  `;
}

function getScorecardObjectiveCount(game, objectiveKey, teamCode) {
  return Number(game?.objectives?.[objectiveKey]?.[teamCode]) || 0;
}

function renderScorecardObjectives(match, game) {
  const objectiveKeys = ["lord", "turtle", "tower"];
  const hasObjectiveData = objectiveKeys.some((key) => {
    const values = game?.objectives?.[key];
    return values && typeof values === "object";
  });

  if (!hasObjectiveData) return "";

  return `
    <section class="scheduleScorecardObjectivesPanel" aria-label="Game objectives">
      <div class="scheduleScorecardObjectivesGrid">
        ${objectiveKeys.map((key) => {
          const label = key === "tower" ? "Turret" : toDisplayLabel(key);
          const teamAValue = getScorecardObjectiveCount(game, key, match.teamA);
          const teamBValue = getScorecardObjectiveCount(game, key, match.teamB);
          const icon = OBJECTIVE_ICONS[key] || "";

          return `
            <div class="scheduleScorecardObjectiveCard">
              <div class="scheduleScorecardObjectiveHead">
                ${icon ? `<img class="scheduleScorecardObjectiveIcon" src="${icon}" alt="${label} icon">` : ""}
                <span>${label}</span>
              </div>
              <div class="scheduleScorecardObjectiveValues">
                <span class="scheduleScorecardObjectiveValue">
                  <strong>${teamAValue}</strong>
                  <span>${teamLabel(match.teamA)}</span>
                </span>
                <span class="scheduleScorecardObjectiveDivider">-</span>
                <span class="scheduleScorecardObjectiveValue">
                  <strong>${teamBValue}</strong>
                  <span>${teamLabel(match.teamB)}</span>
                </span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderScheduleScorecardModal() {
  if (scheduleScorecardState.matchIndex == null) return "";

  const match = getMatches()[scheduleScorecardState.matchIndex];
  if (!match) return "";

  const availableGames = getAvailableScorecardGames(match);
  if (!availableGames.length) return "";

  const activeIndex = Math.min(Math.max(scheduleScorecardState.gameIndex, 0), availableGames.length - 1);
  const activeEntry = availableGames[activeIndex];
  const activeGame = activeEntry.game;
  const playersByTeam = partitionScorecardPlayers(match, activeGame);
  const teamALogo = teamLogos[match.teamA] || "";
  const teamBLogo = teamLogos[match.teamB] || "";

  return `
    <div class="h2hModalBackdrop" onclick="closeScheduleScorecard()">
      <div class="scheduleScorecardModal h2hModalCard" ${getScheduleScorecardPositionStyle()} onclick="event.stopPropagation()">
        <div class="h2hModalHead scheduleScorecardModalHead">
          <button type="button" class="scheduleScorecardClose" onclick="closeScheduleScorecard()" aria-label="Close scorecard">X</button>
          <div class="scheduleScorecardTopStack">
            <div class="scheduleScorecardMatchHead">
              <div class="scheduleScorecardMatchup">
                <span class="scheduleScorecardMatchTeam">
                  ${teamALogo ? `<img class="scheduleScorecardMatchLogo" src="${teamALogo}" alt="${teamLabel(match.teamA)} logo">` : ""}
                  <span>${teamLabel(match.teamA)}</span>
                </span>
                <span class="scheduleScorecardMatchVs">vs</span>
                <span class="scheduleScorecardMatchTeam">
                  ${teamBLogo ? `<img class="scheduleScorecardMatchLogo" src="${teamBLogo}" alt="${teamLabel(match.teamB)} logo">` : ""}
                  <span>${teamLabel(match.teamB)}</span>
                </span>
              </div>
            </div>
            <div class="scheduleScorecardTabs">
              ${availableGames.map((entry, tabIndex) => `
                <button
                  type="button"
                  class="scheduleScorecardTab ${tabIndex === activeIndex ? "is-active" : ""}"
                  onclick="selectScheduleScorecardGame(${tabIndex})"
                >
                  Game ${entry.index + 1}
                </button>
              `).join("")}
            </div>
            <div class="scheduleScorecardGameMeta">
              <span>Winner: ${teamLabel(activeGame.winner) || "TBD"}</span>
            </div>
          </div>
        </div>
        ${renderScorecardObjectives(match, activeGame)}
        ${renderScorecardBans(activeGame)}
        <div class="scheduleScorecardGrid">
          ${renderScorecardTeamCard(match.teamA, playersByTeam[match.teamA] || [])}
          ${renderScorecardTeamCard(match.teamB, playersByTeam[match.teamB] || [])}
        </div>
      </div>
    </div>
  `;
}

function mountTeamRosterModal() {
  const modalId = "teamRosterModalRoot";
  let modalRoot = document.getElementById(modalId);

  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = modalId;
    document.body.appendChild(modalRoot);
  }

  modalRoot.innerHTML = renderTeamRosterModal();
}

function mountPlayerDetailsModal() {
  const modalId = "playerDetailsModalRoot";
  let modalRoot = document.getElementById(modalId);

  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = modalId;
    document.body.appendChild(modalRoot);
  }

  modalRoot.innerHTML = renderPlayerDetailsModal();
}

function mountPlayerProfileModal() {
  const modalId = "playerProfileModalRoot";
  let modalRoot = document.getElementById(modalId);

  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = modalId;
    document.body.appendChild(modalRoot);
  }

  modalRoot.innerHTML = renderPlayerProfileModal();
}

function mountHeroDetailsModal() {
  const modalId = "heroDetailsModalRoot";
  let modalRoot = document.getElementById(modalId);

  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = modalId;
    document.body.appendChild(modalRoot);
  }

  modalRoot.innerHTML = renderHeroDetailsModal();
}

function openTeamRoster(teamCode) {
  teamRosterModalState = { teamCode: String(teamCode || "").trim(), memberName: "", memberType: "" };
  mountTeamRosterModal();
}

function closeTeamRoster() {
  teamRosterModalState = { teamCode: "", memberName: "", memberType: "" };
  mountTeamRosterModal();
}

function openTeamRosterProfile(teamCode, memberName, memberType) {
  teamRosterModalState = {
    teamCode: decodeURIComponent(String(teamCode || "").trim()),
    memberName: decodeURIComponent(String(memberName || "").trim()),
    memberType: decodeURIComponent(String(memberType || "").trim()).toLowerCase()
  };
  mountTeamRosterModal();
}

function backToTeamRoster() {
  if (!teamRosterModalState.teamCode) return;
  teamRosterModalState = {
    teamCode: teamRosterModalState.teamCode,
    memberName: "",
    memberType: ""
  };
  mountTeamRosterModal();
}

function openPlayerDetailsModal(playerName) {
  playerDetailsModalState = { playerName: String(playerName || "").trim() };
  mountPlayerDetailsModal();
}

function closePlayerDetailsModal() {
  playerDetailsModalState = { playerName: "" };
  mountPlayerDetailsModal();
}

function openPlayerProfileModal(playerName) {
  playerProfileModalState = { playerName: String(playerName || "").trim() };
  mountPlayerProfileModal();
}

function closePlayerProfileModal() {
  playerProfileModalState = { playerName: "" };
  mountPlayerProfileModal();
}

function openHeroDetailsModal(heroName) {
  heroDetailsModalState = { heroName: String(heroName || "").trim() };
  mountHeroDetailsModal();
}

function closeHeroDetailsModal() {
  heroDetailsModalState = { heroName: "" };
  mountHeroDetailsModal();
}

function getTeamRosterPlayers(teamCode) {
  const roleOrder = {
    "Gold Laner": 1,
    Jungler: 2,
    Midlaner: 3,
    "Exp Laner": 4,
    Roamer: 5
  };

  return (roster || [])
    .filter((player) => String(player?.team || "").trim() === teamCode)
    .sort((a, b) => {
      const laneDiff = (roleOrder[a.lane] || 99) - (roleOrder[b.lane] || 99);
      if (laneDiff !== 0) return laneDiff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
}

function getTeamStaff(teamCode) {
  return (staff || [])
    .filter((member) => String(member?.team || "").trim() === teamCode)
    .sort((a, b) => String(a.role || "").localeCompare(String(b.role || "")) || String(a.name || "").localeCompare(String(b.name || "")));
}

function normalizeProfileKey(name) {
  return String(name || "").trim().toLowerCase();
}

function getTeamRosterProfile(memberName) {
  return seasonProfiles[normalizeProfileKey(memberName)] || null;
}

function renderTeamRosterMemberCard(member, options = {}) {
  const isPlaceholder = Boolean(options.placeholder);
  const teamCode = String(options.teamCode || member?.team || "").trim();
  const memberType = String(options.memberType || "player").trim().toLowerCase();
  const image = String(member?.picture || "").trim();
  const role = String(member?.lane || member?.role || "TBD").trim() || "TBD";
  const name = String(member?.name || "TBD").trim() || "TBD";
  const canOpen = !isPlaceholder && name !== "TBD";
  const initials = name === "TBD"
    ? "?"
    : name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return `
    <button
      type="button"
      class="teamRosterCard ${isPlaceholder ? "is-placeholder" : ""} ${canOpen ? "is-clickable" : ""}"
      ${canOpen ? `onclick="openTeamRosterProfile('${encodeInlineString(teamCode)}', '${encodeInlineString(name)}', '${encodeInlineString(memberType)}')"` : "disabled"}
      ${canOpen ? `aria-label="Open ${escapeHtml(name)} profile"` : `aria-label="${escapeHtml(name)} profile unavailable"`}
    >
      <div class="teamRosterPortraitWrap">
        ${image
          ? `<img class="teamRosterPortrait" src="${image}" alt="${name}">`
          : `<div class="teamRosterPortraitFallback" aria-hidden="true">${initials}</div>`
        }
      </div>
      <div class="teamRosterCardBody">
        <h4>${name}</h4>
        <p>${role}</p>
      </div>
    </button>
  `;
}

function renderTeamRosterProfileSection(title, rows) {
  if (!rows.length) return "";

  return `
    <section class="teamRosterProfileSection">
      <div class="teamRosterProfileSectionTitle">${escapeHtml(title)}</div>
      <div class="teamRosterProfileRows">
        ${rows.map((row) => `
          <div class="teamRosterProfileRow">
            <div class="teamRosterProfileLabel">${escapeHtml(row.label)}</div>
            <div class="teamRosterProfileValue">${row.value}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderTeamRosterProfileView(teamCode, memberName, memberType) {
  const profile = getTeamRosterProfile(memberName);
  const teamLogo = teamLogos[teamCode] || "";
  const displayName = teamLabel(teamCode);
  const rosterRecord = memberType === "coach"
    ? getTeamStaff(teamCode).find((member) => normalizeProfileKey(member?.name) === normalizeProfileKey(memberName))
    : getTeamRosterPlayers(teamCode).find((member) => normalizeProfileKey(member?.name) === normalizeProfileKey(memberName));
  const picture = String(profile?.image || rosterRecord?.picture || "").trim();

  if (!profile) {
    return `
      <section class="teamRosterProfileShell">
        <div class="teamRosterProfileTopBar">
          <button type="button" class="teamRosterBackButton" onclick="backToTeamRoster()" aria-label="Back to roster">&#8592;</button>
          <div class="teamRosterProfileTitleBlock">
            <h4>${escapeHtml(memberName)}</h4>
            <p>${escapeHtml(displayName)}</p>
          </div>
        </div>
        <div class="teamRosterProfileEmpty">
          <div class="teamRosterProfileEmptyTitle">No data</div>
          <p>No Liquipedia profile is available for this ${escapeHtml(memberType || "member")} yet.</p>
        </div>
      </section>
    `;
  }

  const profileRows = [
    { label: "Name", value: escapeHtml(profile.fullName || profile.handle || memberName) },
    { label: "Nationality", value: escapeHtml(profile.nationality || "Unknown") },
    { label: "Born", value: escapeHtml(profile.born || "Unknown") },
    { label: "Status", value: escapeHtml(profile.status || "Unknown") },
    { label: "Role", value: escapeHtml(profile.role || rosterRecord?.lane || rosterRecord?.role || "Unknown") },
    { label: "Team", value: escapeHtml(profile.team || displayName) }
  ];

  if (profile.approxTotalWinnings) {
    profileRows.push({ label: "Winnings", value: escapeHtml(profile.approxTotalWinnings) });
  }

  const historyRows = Array.isArray(profile.history)
    ? profile.history.slice(0, 8).map((entry) => ({
        label: entry.dates || "History",
        value: escapeHtml(entry.team || entry.org || "Unknown")
      }))
    : [];

  const linkRows = [];
  if (profile.source) {
    linkRows.push({
      label: "Liquipedia",
      value: `<a class="teamRosterProfileLink" href="${escapeHtml(profile.source)}" target="_blank" rel="noopener noreferrer">Open source</a>`
    });
  }
  if (profile.links && typeof profile.links === "object") {
    for (const [label, href] of Object.entries(profile.links)) {
      if (!href) continue;
      linkRows.push({
        label: toDisplayLabel(label),
        value: `<a class="teamRosterProfileLink" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(href.replace(/^https?:\/\//, ""))}</a>`
      });
    }
  }

  return `
    <section class="teamRosterProfileShell">
      <div class="teamRosterProfileTopBar">
        <button type="button" class="teamRosterBackButton" onclick="backToTeamRoster()" aria-label="Back to roster">&#8592;</button>
        <div class="teamRosterProfileTitleBlock">
          <h4>${escapeHtml(profile.handle || memberName)}</h4>
          <p>${escapeHtml(displayName)}</p>
        </div>
      </div>
      <div class="teamRosterProfileHero">
        <div class="teamRosterProfileHeroCard">
          <div class="teamRosterProfileHeroMedia">
            ${picture ? `<img class="teamRosterProfilePortrait" src="${picture}" alt="${escapeHtml(profile.handle || memberName)}">` : `<div class="teamRosterProfilePortraitFallback">${escapeHtml((profile.handle || memberName).slice(0, 2).toUpperCase())}</div>`}
          </div>
          <div class="teamRosterProfileHeroMeta">
            <div class="teamRosterProfileHandle">${escapeHtml(profile.handle || memberName)}</div>
            <div class="teamRosterProfileTeam">
              ${teamLogo ? `<img class="teamRosterProfileTeamLogo" src="${teamLogo}" alt="${escapeHtml(displayName)} logo">` : ""}
              <span>${escapeHtml(profile.team || displayName)}</span>
            </div>
          </div>
        </div>
      </div>
      ${renderTeamRosterProfileSection("Profile", profileRows)}
      ${profile.summary ? `<section class="teamRosterProfileSection"><div class="teamRosterProfileSectionTitle">Summary</div><p class="teamRosterProfileSummary">${escapeHtml(profile.summary)}</p></section>` : ""}
      ${renderTeamRosterProfileSection("History", historyRows)}
      ${renderTeamRosterProfileSection("Links", linkRows)}
    </section>
  `;
}

function renderTeamRosterModal() {
  const teamCode = String(teamRosterModalState.teamCode || "").trim();
  if (!teamCode) return "";
  const memberName = String(teamRosterModalState.memberName || "").trim();
  const memberType = String(teamRosterModalState.memberType || "").trim();

  const players = getTeamRosterPlayers(teamCode);
  const teamLogo = teamLogos[teamCode] || "";
  const teamStaff = getTeamStaff(teamCode);
  const placeholderStaff = [
    { name: "TBD", role: "Head Coach", picture: "" },
    { name: "TBD", role: "Assistant Coach", picture: "" }
  ];

  return `
    <div class="h2hModalBackdrop" onclick="closeTeamRoster()">
      <div class="teamRosterModal h2hModalCard" onclick="event.stopPropagation()">
        <div class="h2hModalHead teamRosterModalHead">
          <div class="teamRosterModalTitle">
            ${teamLogo ? `<img class="teamRosterModalLogo" src="${teamLogo}" alt="${teamLabel(teamCode)} logo">` : ""}
            <div>
              <h3>${teamLabel(teamCode)}</h3>
            </div>
          </div>
          <button type="button" class="h2hModalClose" onclick="closeTeamRoster()">Close</button>
        </div>
        ${memberName
          ? renderTeamRosterProfileView(teamCode, memberName, memberType)
          : `
            <section class="teamRosterSection">
              <div class="teamRosterSectionHead">
                <h4>Players</h4>
              </div>
              <div class="teamRosterGrid">
                ${players.length
                  ? players.map((player) => renderTeamRosterMemberCard(player, { teamCode, memberType: "player" })).join("")
                  : `<div class="h2hModalEmpty">No roster data for this team yet.</div>`
                }
              </div>
            </section>
            <section class="teamRosterSection">
              <div class="teamRosterSectionHead">
                <h4>Coaching Staff</h4>
              </div>
              <div class="teamRosterGrid teamRosterGrid--staff">
                ${(teamStaff.length ? teamStaff : placeholderStaff)
                  .map((member) => renderTeamRosterMemberCard(member, { placeholder: !teamStaff.length, teamCode, memberType: "coach" }))
                  .join("")}
              </div>
            </section>
          `
        }
      </div>
    </div>
  `;
}

function renderPlayerDetailsModal() {
  const playerName = String(playerDetailsModalState.playerName || "").trim();
  if (!playerName) return "";

  const player = getPlayerSummary(playerName);
  if (!player) return "";

  const teamLogo = player.team ? (teamLogos[player.team] || "") : "";
  const statRows = [
    {
      label: "PLAYER",
      value: `
        <div class="playerDetailsIdentity">
          ${player.picture ? `<img class="playerDetailsPortrait" src="${player.picture}" alt="${escapeHtml(player.name)}">` : ""}
          <span>${escapeHtml(player.name)}</span>
        </div>
      `
    },
    {
      label: "TEAM",
      value: `
        <div class="playerDetailsIdentity">
          ${teamLogo ? `<img class="playerDetailsTeamLogo" src="${teamLogo}" alt="${escapeHtml(teamLabel(player.team))} logo">` : ""}
          <span>${escapeHtml(player.team ? teamLabel(player.team) : "Unknown")}</span>
        </div>
      `
    },
    { label: "ROLE", value: escapeHtml(player.lane) },
    { label: "GAMES", value: `${player.games}` },
    { label: "HERO POOL", value: `${player.heroPoolCount}` },
    { label: "KILLS", value: `${player.kills}` },
    { label: "AVG KILLS", value: player.avgK.toFixed(2) },
    { label: "DEATHS", value: `${player.deaths}` },
    { label: "AVG DEATHS", value: player.avgD.toFixed(2) },
    { label: "ASSISTS", value: `${player.assists}` },
    { label: "AVG ASSISTS", value: player.avgA.toFixed(2) },
    { label: "KDA", value: player.kda.toFixed(2) },
    { label: "KP%", value: `${player.kp.toFixed(1)}%` }
  ];

  return `
    <div class="h2hModalBackdrop" onclick="closePlayerDetailsModal()">
      <div class="playerDetailsModal playerStatsModal h2hModalCard" onclick="event.stopPropagation()">
        <div class="h2hModalHead playerDetailsModalHead">
          <h3>${escapeHtml(player.name)}</h3>
          <button type="button" class="h2hModalClose" onclick="closePlayerDetailsModal()">Close</button>
        </div>
        <div class="playerDetailsCard">
          ${statRows.map((row) => `
            <div class="playerDetailsRow">
              <div class="playerDetailsLabel">${row.label}</div>
              <div class="playerDetailsValue">${row.value}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderPlayerProfileModal() {
  const playerName = String(playerProfileModalState.playerName || "").trim();
  if (!playerName) return "";

  const player = getPlayerSummary(playerName);
  if (!player) return "";

  const profile = getTeamRosterProfile(playerName);
  const teamCode = String(player.team || "").trim();
  const displayName = teamCode ? teamLabel(teamCode) : "Unknown Team";
  const teamLogo = teamCode ? (teamLogos[teamCode] || "") : "";
  const picture = String(profile?.image || player.picture || "").trim();

  if (!profile) {
    return `
      <div class="h2hModalBackdrop" onclick="closePlayerProfileModal()">
        <div class="playerDetailsModal h2hModalCard" onclick="event.stopPropagation()">
          <div class="h2hModalHead playerDetailsModalHead">
            <h3>${escapeHtml(player.name)}</h3>
            <button type="button" class="h2hModalClose" onclick="closePlayerProfileModal()">Close</button>
          </div>
          <div class="teamRosterProfileEmpty">
            <div class="teamRosterProfileEmptyTitle">No data</div>
            <p>No Liquipedia profile is available for this player yet.</p>
          </div>
        </div>
      </div>
    `;
  }

  const profileRows = [
    { label: "Name", value: escapeHtml(profile.fullName || profile.handle || player.name) },
    { label: "Nationality", value: escapeHtml(profile.nationality || "Unknown") },
    { label: "Born", value: escapeHtml(profile.born || "Unknown") },
    { label: "Status", value: escapeHtml(profile.status || "Unknown") },
    { label: "Role", value: escapeHtml(profile.role || player.lane || "Unknown") },
    { label: "Team", value: escapeHtml(profile.team || displayName) }
  ];

  if (profile.approxTotalWinnings) {
    profileRows.push({ label: "Winnings", value: escapeHtml(profile.approxTotalWinnings) });
  }

  const historyRows = Array.isArray(profile.history)
    ? profile.history.slice(0, 8).map((entry) => ({
        label: entry.dates || "History",
        value: escapeHtml(entry.team || entry.org || "Unknown")
      }))
    : [];

  const linkRows = [];
  if (profile.source) {
    linkRows.push({
      label: "Liquipedia",
      value: `<a class="teamRosterProfileLink" href="${escapeHtml(profile.source)}" target="_blank" rel="noopener noreferrer">Open source</a>`
    });
  }
  if (profile.links && typeof profile.links === "object") {
    for (const [label, href] of Object.entries(profile.links)) {
      if (!href) continue;
      linkRows.push({
        label: toDisplayLabel(label),
        value: `<a class="teamRosterProfileLink" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(href.replace(/^https?:\/\//, ""))}</a>`
      });
    }
  }

  return `
    <div class="h2hModalBackdrop" onclick="closePlayerProfileModal()">
      <div class="playerDetailsModal h2hModalCard" onclick="event.stopPropagation()">
        <div class="h2hModalHead playerDetailsModalHead">
          <h3>${escapeHtml(player.name)}</h3>
          <button type="button" class="h2hModalClose" onclick="closePlayerProfileModal()">Close</button>
        </div>
        <section class="teamRosterProfileShell playerProfileModalContent">
          <div class="teamRosterProfileHero">
            <div class="teamRosterProfileHeroCard">
              <div class="teamRosterProfileHeroMedia">
                ${picture ? `<img class="teamRosterProfilePortrait" src="${picture}" alt="${escapeHtml(profile.handle || player.name)}">` : `<div class="teamRosterProfilePortraitFallback">${escapeHtml((profile.handle || player.name).slice(0, 2).toUpperCase())}</div>`}
              </div>
              <div class="teamRosterProfileHeroMeta">
                <div class="teamRosterProfileHandle">${escapeHtml(profile.handle || player.name)}</div>
                <div class="teamRosterProfileTeam">
                  ${teamLogo ? `<img class="teamRosterProfileTeamLogo" src="${teamLogo}" alt="${escapeHtml(displayName)} logo">` : ""}
                  <span>${escapeHtml(profile.team || displayName)}</span>
                </div>
              </div>
            </div>
          </div>
          ${renderTeamRosterProfileSection("Profile", profileRows)}
          ${profile.summary ? `<section class="teamRosterProfileSection"><div class="teamRosterProfileSectionTitle">Summary</div><p class="teamRosterProfileSummary">${escapeHtml(profile.summary)}</p></section>` : ""}
          ${renderTeamRosterProfileSection("History", historyRows)}
          ${renderTeamRosterProfileSection("Links", linkRows)}
        </section>
      </div>
    </div>
  `;
}

function renderHeroDetailsModal() {
  const heroName = String(heroDetailsModalState.heroName || "").trim();
  if (!heroName) return "";

  const hero = getHeroSummary(heroName);
  if (!hero) return "";

  const statRows = [
    {
      label: "HERO",
      value: `
        <div class="heroDetailsIdentity">
          ${hero.img ? `<img class="heroDetailsPortrait" src="${hero.img}" alt="${escapeHtml(hero.hero)}">` : ""}
          <span>${escapeHtml(hero.hero)}</span>
        </div>
      `
    },
    { label: "PICK", value: `${hero.pick}` },
    { label: "PLAYER POOL", value: `${hero.playerPoolCount}` },
    { label: "PICK RATE", value: `${hero.pickRate.toFixed(1)}%` },
    { label: "BAN", value: `${hero.ban}` },
    { label: "BAN RATE", value: `${hero.banRate.toFixed(1)}%` },
    { label: "WIN RATE", value: `${hero.winRate.toFixed(1)}%` },
    { label: "KILLS", value: `${hero.kills}` },
    { label: "DEATHS", value: `${hero.deaths}` },
    { label: "ASSISTS", value: `${hero.assists}` },
    { label: "KDA", value: hero.kda.toFixed(2) }
  ];

  return `
    <div class="h2hModalBackdrop" onclick="closeHeroDetailsModal()">
      <div class="heroDetailsModal h2hModalCard" onclick="event.stopPropagation()">
        <div class="h2hModalHead playerDetailsModalHead">
          <h3>${escapeHtml(hero.hero)}</h3>
          <button type="button" class="h2hModalClose" onclick="closeHeroDetailsModal()">Close</button>
        </div>
        <div class="playerDetailsCard">
          ${statRows.map((row) => `
            <div class="playerDetailsRow">
              <div class="playerDetailsLabel">${row.label}</div>
              <div class="playerDetailsValue">${row.value}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}


function showTeams() {
  let t = calculateTeamStats();

  let arr = Object.keys(t).map(team => ({
    team,
    ...t[team]
  }));

  if (teamSort.key) {
    arr.sort((a, b) => {
      let valA = a[teamSort.key];
      let valB = b[teamSort.key];

      if (typeof valA === "string") {
        const labelA = teamLabel(valA);
        const labelB = teamLabel(valB);
        const cmp = teamSort.asc ? labelA.localeCompare(labelB) : labelB.localeCompare(labelA);
        if (cmp !== 0) return cmp;
        return teamLabel(a.team).localeCompare(teamLabel(b.team));
      }
      const cmp = teamSort.asc ? valA - valB : valB - valA;
      if (cmp !== 0) return cmp;
      return teamLabel(a.team).localeCompare(teamLabel(b.team));
    });
  }

  function arrow(key) {
    if (teamSort.key !== key) return ' <span style="opacity:0.4;">&#9650;</span>';
    return teamSort.asc ? ' <span>&#9650;</span>' : ' <span>&#9660;</span>';
  }

  let html = `
      <div class="rotateHint">
    Rotate your phone for full table view
  </div>

    <table class="teamsTable">
      <tr>
        <th aria-sort="${teamSort.key === 'team' ? (teamSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortTeams('team')">TEAM${arrow('team')}</th>
        <th aria-sort="${teamSort.key === 'matchWins' ? (teamSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortTeams('matchWins')">MATCHES WON${arrow('matchWins')}</th>
        <th aria-sort="${teamSort.key === 'kills' ? (teamSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortTeams('kills')">KILLS${arrow('kills')}</th>
        <th aria-sort="${teamSort.key === 'deaths' ? (teamSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortTeams('deaths')">DEATHS${arrow('deaths')}</th>
        <th aria-sort="${teamSort.key === 'assists' ? (teamSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortTeams('assists')">ASSISTS${arrow('assists')}</th>
        <th aria-sort="${teamSort.key === 'lord' ? (teamSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortTeams('lord')">LORD${arrow('lord')}</th>
        <th aria-sort="${teamSort.key === 'turtle' ? (teamSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortTeams('turtle')">TURTLE${arrow('turtle')}</th>
        <th aria-sort="${teamSort.key === 'tower' ? (teamSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortTeams('tower')">TOWER${arrow('tower')}</th>
      </tr>
  `;

  for (let ts of arr) {
    const logo = teamLogos[ts.team] || "";
    html += `
      <tr>
<td>
  <div class="teamCell">
    <button type="button" class="teamLogoTrigger" onclick="openTeamRoster('${ts.team}')" aria-label="Open ${teamLabel(ts.team)} roster">
      <img class="teamLogo" src="${logo}" width="50" height="50" alt="${teamLabel(ts.team)} logo">
    </button>
    <button type="button" class="teamRosterTrigger" onclick="openTeamRoster('${ts.team}')">${teamLabel(ts.team)}</button>
  </div>
</td>
        <td>${ts.matchWins}</td>
        <td>${ts.kills}</td>
        <td>${ts.deaths}</td>
        <td>${ts.assists}</td>
        <td>${ts.lord || 0}</td>
        <td>${ts.turtle || 0}</td>
        <td>${ts.tower || 0}</td>
      </tr>
    `;
  }

  html += `</table>`;
  document.getElementById("output").innerHTML = html;
  mountTeamRosterModal();
}

function sortTeams(key) {
  if (teamSort.key === key) {
    teamSort.asc = !teamSort.asc;
  } else {
    teamSort.key = key;
    teamSort.asc = false; // default DESC
  }
  showTeams();
}

function showPlayers(keepSearchFocus = false) {
  
  let p = calculatePlayerStats();

  const currentTeam = document.getElementById("teamFilter")?.value || "ALL TEAMS";
  const currentLane = document.getElementById("laneFilter")?.value || "ALL ROLES";
  const searchEl = document.getElementById("playerSearch");
  const currentSearch = searchEl ? searchEl.value : (playerSearchState.value || "");
  const q = currentSearch.trim().toLowerCase();

  let arr = Object.keys(p).map(name => ({
    name,
    team: p[name].team,
    lane: p[name].lane,
    games: p[name].games,
    kills: p[name].kills,
    deaths: p[name].deaths,
    assists: p[name].assists,
    avgK: p[name].games ? p[name].kills / p[name].games : 0,
    avgD: p[name].games ? p[name].deaths / p[name].games : 0,
    avgA: p[name].games ? p[name].assists / p[name].games : 0,
    kda: (p[name].kills + p[name].assists) / (p[name].deaths || 1),
    kp: p[name].games ? (p[name].kpTotal / p[name].games) * 100 : 0,
    picture: p[name].picture
  }));

  let topKills = [...arr].sort((a,b) => b.kills - a.kills).slice(0,5);
  let topAssists = [...arr].sort((a,b) => b.assists - a.assists).slice(0,5);
  let topKDA = [...arr].sort((a,b) => b.kda - a.kda).slice(0,5);


  // ===== BUILD FILTER OPTIONS =====
  const teams = [...new Set(arr.map(p => p.team))];
  const lanes = [...new Set(arr.map(p => p.lane))];

  // ===== APPLY FILTER =====
  arr = arr.filter(ps => {
    const teamMatch = currentTeam === "ALL TEAMS" || ps.team === currentTeam;
    const laneMatch = currentLane === "ALL ROLES" || ps.lane === currentLane;
    return teamMatch && laneMatch;
  });

  // ===== APPLY NAME SEARCH (PLAYER NAME ONLY) =====
  if (q) {
    arr = arr.filter(ps => ps.name.toLowerCase().includes(q));
  }

  // ===== SORT =====
  if (playerSort.key) {
    arr.sort((a, b) => {

      if (playerSort.key === "lane") {
        const cmp = playerSort.asc
          ? laneOrder[a.lane] - laneOrder[b.lane]
          : laneOrder[b.lane] - laneOrder[a.lane];
        if (cmp !== 0) return cmp;
        return a.name.localeCompare(b.name);
      }

      let valA = a[playerSort.key];
      let valB = b[playerSort.key];

      if (typeof valA === "string") {
        const cmp = playerSort.asc
          ? (playerSort.key === "team" ? teamLabel(valA).localeCompare(teamLabel(valB)) : valA.localeCompare(valB))
          : (playerSort.key === "team" ? teamLabel(valB).localeCompare(teamLabel(valA)) : valB.localeCompare(valA));
        if (cmp !== 0) return cmp;
        return a.name.localeCompare(b.name);
      }

      const cmp = playerSort.asc ? valA - valB : valB - valA;
      if (cmp !== 0) return cmp;
      return a.name.localeCompare(b.name);
    });
  }

function arrow(key) {
  if (playerSort.key !== key) {
    return ' <span style="opacity:0.4;">&#9650;</span>';
  }
  return playerSort.asc
    ? ' <span>&#9650;</span>'
    : ' <span>&#9660;</span>';
}
  // ===== START HTML =====
let html = `
<h2 style="text-align:center;">TOP PLAYERS ${seasonLabel()}</h2>

<div class="topRow">
  <strong>TOP 5 KILLS:</strong>
  <div class="topItems">
${topKills.map((pl, i) => `
  <button
    type="button"
    class="topItem topPlayerTrigger topRank topRank--${i+1} ${i===0 ? "topMVP" : ""}"
    onclick="openPlayerDetailsModal(decodeURIComponent('${encodeInlineString(pl.name)}'))"
    aria-label="Open player details for ${escapeHtml(pl.name)}"
  >
    <div class="rankBadge">#${i+1}</div>

    <div class="avatarWrap">
      <img class="playerAvatar" src="${pl.picture}" alt="${pl.name}">
      
      <img class="teamMiniLogo"
           src="${teamLogos[pl.team] || ''}"
           alt="${teamLabel(pl.team)}">
    </div>

    <div class="topLabel">
      <span class="topName">${pl.name}</span>
      <span class="topValue">${pl.kills}</span>
    </div>

  </button>
`).join('')}
  </div>
</div>

<div class="topRow">
  <strong>TOP 5 ASSISTS:</strong>
  <div class="topItems">
    ${topAssists.map((pl, i) => `
      <button
        type="button"
        class="topItem topPlayerTrigger topRank topRank--${i+1} ${i===0 ? "topMVP" : ""}"
        onclick="openPlayerDetailsModal(decodeURIComponent('${encodeInlineString(pl.name)}'))"
        aria-label="Open player details for ${escapeHtml(pl.name)}"
      >
        <div class="rankBadge">#${i+1}</div>

        <div class="avatarWrap">
          <img class="playerAvatar" src="${pl.picture}" alt="${pl.name}">
          
          ${teamLogos[pl.team] 
            ? `<img class="teamMiniLogo" src="${teamLogos[pl.team]}" alt="${teamLabel(pl.team)}">`
            : ''
          }
        </div>

        <div class="topLabel">
          <span class="topName">${pl.name}</span>
          <span class="topValue">${pl.assists}</span>
        </div>

      </button>
    `).join('')}
  </div>
</div>

<div class="topRow">
  <strong>TOP 5 KDA:</strong>
  <div class="topItems">
    ${topKDA.map((pl, i) => `
      <button
        type="button"
        class="topItem topPlayerTrigger topRank topRank--${i+1} ${i===0 ? "topMVP" : ""}"
        onclick="openPlayerDetailsModal(decodeURIComponent('${encodeInlineString(pl.name)}'))"
        aria-label="Open player details for ${escapeHtml(pl.name)}"
      >
        <div class="rankBadge">#${i+1}</div>

        <div class="avatarWrap">
          <img class="playerAvatar" src="${pl.picture}" alt="${pl.name}">
          
          ${teamLogos[pl.team] 
            ? `<img class="teamMiniLogo" src="${teamLogos[pl.team]}" alt="${teamLabel(pl.team)}">`
            : ''
          }
        </div>

        <div class="topLabel">
          <span class="topName">${pl.name}</span>
          <span class="topValue">${pl.kda.toFixed(2)}</span>
        </div>

      </button>
    `).join('')}
  </div>
</div>




  <div style="margin-bottom:20px; display:flex; gap:20px; justify-content:center;">
    <div>
      <label>TEAM: </label>
      <select id="teamFilter" onchange="showPlayers()">
        <option value="ALL TEAMS">ALL TEAMS</option>
        ${teams.map(t => `<option value="${t}" ${t === currentTeam ? "selected" : ""}>${teamLabel(t)}</option>`).join("")}
      </select>
    </div>

    <div>
      <label>ROLE: </label>
      <select id="laneFilter" onchange="showPlayers()">
        <option value="ALL ROLES">ALL ROLES</option>
        ${lanes.map(l => `<option value="${l}" ${l === currentLane ? "selected" : ""}>${l}</option>`).join("")}
      </select>
    </div>
  </div>

  <div style="margin-bottom:20px; display:flex; justify-content:center;">
    <input
      id="playerSearch"
      type="text"
      placeholder="Search player..."
      value="${currentSearch.replace(/"/g, "&quot;")}"
      oninput="onPlayerSearchInput(event)"
      style="padding:10px 14px; width:320px; border-radius:10px; border:1px solid #444; background:#0b0b0b; color:#fff;"
    />
  </div>

    <div class="rotateHint">
    Rotate your phone for full table view
  </div>

  <table class="playersTable">
  <tr>
    <th aria-sort="${playerSort.key === 'name' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('name')">PLAYER${arrow('name')}</th>
    <th aria-sort="${playerSort.key === 'team' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('team')">TEAM${arrow('team')}</th>
    <th aria-sort="${playerSort.key === 'lane' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('lane')">ROLE${arrow('lane')}</th>
    <th aria-sort="${playerSort.key === 'games' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('games')">GAMES${arrow('games')}</th>
    <th aria-sort="${playerSort.key === 'kills' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('kills')">KILLS${arrow('kills')}</th>
    <th aria-sort="${playerSort.key === 'avgK' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('avgK')">AVG KILLS${arrow('avgK')}</th>
    <th aria-sort="${playerSort.key === 'deaths' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('deaths')">DEATHS${arrow('deaths')}</th>
    <th aria-sort="${playerSort.key === 'avgD' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('avgD')">AVG DEATHS${arrow('avgD')}</th>
    <th aria-sort="${playerSort.key === 'assists' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('assists')">ASSISTS${arrow('assists')}</th>
    <th aria-sort="${playerSort.key === 'avgA' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('avgA')">AVG ASSISTS${arrow('avgA')}</th>
    <th aria-sort="${playerSort.key === 'kda' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('kda')">KDA${arrow('kda')}</th>
    <th aria-sort="${playerSort.key === 'kp' ? (playerSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayers('kp')">KP%${arrow('kp')}</th>
  </tr>
  `;

  for (let ps of arr) {
html += `
<tr>
  <td>
    <button
      type="button"
      class="teamCell playerProfileTrigger"
      onclick="openPlayerProfileModal(decodeURIComponent('${encodeInlineString(ps.name)}'))"
      aria-label="Open player profile for ${escapeHtml(ps.name)}"
    >
      <img src="${ps.picture}" width="90" height="90" style="border-radius:50%;" alt="${ps.name}">
      <span>${ps.name}</span>
    </button>
  </td>

<td style="vertical-align:middle;">
  <div class="teamCell">
    <img class="teamLogo" src="${teamLogos[ps.team]}" width="50" height="50" alt="${teamLabel(ps.team)} logo">
    <span>${teamLabel(ps.team)}</span>
  </div>
</td>

  <td>${ps.lane}</td>
  <td>${ps.games}</td>
  <td>${ps.kills}</td>
  <td>${ps.avgK.toFixed(2)}</td>
  <td>${ps.deaths}</td>
  <td>${ps.avgD.toFixed(2)}</td>
  <td>${ps.assists}</td>
  <td>${ps.avgA.toFixed(2)}</td>
  <td>${ps.kda.toFixed(2)}</td>
  <td>${ps.kp.toFixed(1)}%</td>
</tr>
`;
  }

  html += "</table>";

  document.getElementById("output").innerHTML = html;

    if (keepSearchFocus) {
    requestAnimationFrame(() => {
      const el = document.getElementById("playerSearch");
      if (!el) return;
      el.focus();
      const pos = Math.min(playerSearchState.caret || 0, el.value.length);
      el.setSelectionRange(pos, pos);
    });
  }
}

function sortPlayers(key) {
  if (playerSort.key === key) {
    playerSort.asc = !playerSort.asc;
  } else {
    playerSort.key = key;
    playerSort.asc = false;
  }

  showPlayers(); // re-render with same filters preserved
}



function showTopPlayers(category) {
  let p = calculatePlayerStats();
  let arr = Object.keys(p).map(name => ({
    name,
    team: p[name].team,
    lane: p[name].lane,
    picture: p[name].picture,
    kills: p[name].kills,
    assists: p[name].assists,
    deaths: p[name].deaths,
    kda: ((p[name].kills + p[name].assists)/(p[name].deaths||1)).toFixed(2)
  }));
  if (category !== 'kda') arr.sort((a,b)=>b[category]-a[category]);
  else arr.sort((a,b)=>b.kda-a.kda); // kda numeric
  let top5 = arr.slice(0,5);
  let html = `<h2 style="text-align:center;">Top 5 Players - ${category.toUpperCase()}</h2><div style="display:flex; justify-content:center; gap:20px;">`;
  for (let pl of top5) {
    html += `<div style="text-align:center;"><img src="${pl.picture}" width="60" height="60" alt="${pl.name}"><br><b>${pl.name}</b><br>${teamLabel(pl.team)}<br>${pl[category]}</div>`;
  }
  html += "</div>";
  document.getElementById("output").innerHTML = html;
}



function showHeroes(keepSearchFocus = false) {
  let arr = calculateHeroStats();

  // ===== TOP LISTS =====
  const topPick = [...arr].sort((a, b) => b.pick - a.pick).slice(0, 5);
  const topBan  = [...arr].sort((a, b) => b.ban - a.ban).slice(0, 5);

  // Top 5 Winrate (min 5 picks). Fallback to min 1 pick if none >= 5
  let topWinCandidates = arr.filter(h => h.pick >= 5);
  const hasMin5 = topWinCandidates.length > 0;
  if (!hasMin5) topWinCandidates = arr.filter(h => h.pick > 0);
  const topWin = [...topWinCandidates].sort((a, b) => b.winRate - a.winRate).slice(0, 5);

  const winLabel = hasMin5
    ? "TOP 5 WINRATE (MIN 5 GAMES):"
    : "TOP 5 WINRATE (MIN 1 PICK):";

  // ===== SEARCH (HERO NAME ONLY) =====
  const searchEl = document.getElementById("heroSearch");
  const currentSearch = searchEl ? searchEl.value : (heroSearchState.value || "");
  const q = currentSearch.trim().toLowerCase();

  if (q) {
    arr = arr.filter(h => h.hero.toLowerCase().includes(q));
  }

  // ===== SORT TABLE =====
  if (heroSort.key) {
    arr.sort((a, b) => {
      let valA = a[heroSort.key];
      let valB = b[heroSort.key];

      if (typeof valA === "string") {
        const cmp = heroSort.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        if (cmp !== 0) return cmp;
        return a.hero.localeCompare(b.hero);
      }
      const cmp = heroSort.asc ? valA - valB : valB - valA;
      if (cmp !== 0) return cmp;
      return a.hero.localeCompare(b.hero);
    });
  }

  function arrow(key) {
    if (heroSort.key !== key) return ' <span style="opacity:0.4;">&#9650;</span>';
    return heroSort.asc ? ' <span>&#9650;</span>' : ' <span>&#9660;</span>';
  }

  // ===== unified top row renderer (centered + consistent card/avatar) =====
function renderTopRow(label, list, valueFn) {
  return `
    <div class="toprow">
      <div class="toprow-label">${label}</div>

      <div class="toprow-grid">
        ${list.map((item, i) => `
          <button
            type="button"
            class="topcard topPlayerTrigger topRank topRank--${i+1} ${i===0 ? "topMVP" : ""}"
            onclick="openHeroDetailsModal(decodeURIComponent('${encodeInlineString(item.hero)}'))"
            aria-label="Open hero details for ${escapeHtml(item.hero)}"
          >
            <div class="rankBadge">#${i+1}</div>
            <img class="topavatar" src="${item.img}" alt="${item.hero}">
            <div class="topLabel">
              <span class="topName">${item.hero}</span>
              <span class="topValue">${valueFn(item)}</span>
            </div>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

const topPickRow = renderTopRow("TOP 5 PICK:", topPick, h => h.pick);
const topBanRow  = renderTopRow("TOP 5 BAN:",  topBan,  h => h.ban);
const topWinRow  = renderTopRow(winLabel,      topWin,  h => `${h.winRate.toFixed(1)}%`);

let html = `
<h2 class="panel-title">HERO STATS ${seasonLabel()}</h2>

<div class="toprows">
  ${topPickRow}
  ${topBanRow}
  ${topWinRow}
</div>

<div class="searchRow">
  <input
    id="heroSearch"
    class="searchInput"
    type="text"
    placeholder="Search hero..."
    value="${currentSearch.replace(/"/g, "&quot;")}"
    oninput="onHeroSearchInput(event)"
  />
</div>

<div class="tableWrap">
  <div class="rotateHint">
    Rotate your phone for full table view
  </div>

  <table class="dataTable heroesTable">
    <tr>
      <th aria-sort="${heroSort.key === 'hero' ? (heroSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroes('hero')">HERO${arrow('hero')}</th>
      <th aria-sort="${heroSort.key === 'pick' ? (heroSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroes('pick')">PICK${arrow('pick')}</th>
      <th aria-sort="${heroSort.key === 'pickRate' ? (heroSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroes('pickRate')">PICK RATE${arrow('pickRate')}</th>
      <th aria-sort="${heroSort.key === 'ban' ? (heroSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroes('ban')">BAN${arrow('ban')}</th>
      <th aria-sort="${heroSort.key === 'banRate' ? (heroSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroes('banRate')">BAN RATE${arrow('banRate')}</th>
      <th aria-sort="${heroSort.key === 'winRate' ? (heroSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroes('winRate')">WIN RATE${arrow('winRate')}</th>
    </tr>
`;

for (let h of arr) {
  html += `
    <tr>
      <td>
        <div class="cellHero">
          <img class="cellHeroImg" src="${h.img}" alt="${h.hero}">
          <span class="cellHeroName">${h.hero}</span>
        </div>
      </td>
      <td class="tdCenter">${h.pick}</td>
      <td class="tdCenter">${h.pickRate.toFixed(1)}%</td>
      <td class="tdCenter">${h.ban}</td>
      <td class="tdCenter">${h.banRate.toFixed(1)}%</td>
      <td class="tdCenter">${h.winRate.toFixed(1)}%</td>
    </tr>
  `;
}

html += `
  </table>
</div>
`;

document.getElementById("output").innerHTML = html;

  // keep continuous typing
  if (keepSearchFocus) {
    requestAnimationFrame(() => {
      const el = document.getElementById("heroSearch");
      if (!el) return;
      el.focus();
      const pos = Math.min(heroSearchState.caret || 0, el.value.length);
      el.setSelectionRange(pos, pos);
    });
  }
}

function sortHeroes(key) {
  if (heroSort.key === key) {
    heroSort.asc = !heroSort.asc;
  } else {
    heroSort.key = key;
    heroSort.asc = false;
  }
  showHeroes();
}



function showHeroPool(keepSearchFocus = false) {

  const pool = calculateHeroPoolStats();

  let arr = Object.keys(pool).map(name => {
    const ps = pool[name];
    const uniqueHeroes = Object.keys(ps.heroes).length;

    const heroList = Object.keys(ps.heroes)
      .map(h => ({
        hero: h,
        games: ps.heroes[h].games,
        winRate: ps.heroes[h].games ? (ps.heroes[h].wins / ps.heroes[h].games) * 100 : 0,
        img: constHero[h] || ""
      }))
      .sort((a,b) => b.games - a.games);

    return {
      name: ps.name,
      team: ps.team,
      lane: ps.lane,
      picture: ps.picture,
      totalHeroes: uniqueHeroes,
      heroesPlayed: heroList
    };
  });

  // Keep current filter values
  const currentTeam = document.getElementById("hpTeamFilter")?.value || "ALL TEAMS";
  const currentLane = document.getElementById("hpLaneFilter")?.value || "ALL ROLES";

  // ===== SEARCH (PLAYER NAME ONLY) =====
  const searchEl = document.getElementById("hpPlayerSearch");
  const currentSearch = searchEl ? searchEl.value : (hpPlayerSearchState.value || "");
  const q = currentSearch.trim().toLowerCase();

  // Build filter lists
  const teams = [...new Set(arr.map(p => p.team))];
  const lanes = [...new Set(arr.map(p => p.lane))];

  // Apply Team/Lane filters
  arr = arr.filter(ps => {
    const teamMatch = currentTeam === "ALL TEAMS" || ps.team === currentTeam;
    const laneMatch = currentLane === "ALL ROLES" || ps.lane === currentLane;
    return teamMatch && laneMatch;
  });

  // Apply PLAYER NAME search
  if (q) {
    arr = arr.filter(ps => ps.name.toLowerCase().includes(q));
  }

  // Sort
  if (heroPoolSort.key) {
    arr.sort((a, b) => {
      let valA = a[heroPoolSort.key];
      let valB = b[heroPoolSort.key];

      if (heroPoolSort.key === "lane") {
        const cmp = heroPoolSort.asc
          ? laneOrder[a.lane] - laneOrder[b.lane]
          : laneOrder[b.lane] - laneOrder[a.lane];
        if (cmp !== 0) return cmp;
        return a.name.localeCompare(b.name);
      }

      if (typeof valA === "string") {
        const cmp = heroPoolSort.asc
          ? (heroPoolSort.key === "team" ? teamLabel(valA).localeCompare(teamLabel(valB)) : valA.localeCompare(valB))
          : (heroPoolSort.key === "team" ? teamLabel(valB).localeCompare(teamLabel(valA)) : valB.localeCompare(valA));
        if (cmp !== 0) return cmp;
        return a.name.localeCompare(b.name);
      }

      const cmp = heroPoolSort.asc ? valA - valB : valB - valA;
      if (cmp !== 0) return cmp;
      return a.name.localeCompare(b.name);
    });
  }

  function arrow(key) {
    if (heroPoolSort.key !== key) return ' <span style="opacity:0.4;">&#9650;</span>';
    return heroPoolSort.asc ? ' <span>&#9650;</span>' : ' <span>&#9660;</span>';
  }

  // Render
  let html = `
    <h2 style="text-align:center;">HERO POOL ${seasonLabel()}</h2>

    <div class="filterRow">
      <div>
        <label>TEAM: </label>
        <select id="hpTeamFilter" onchange="showHeroPool()">
          <option value="ALL TEAMS">ALL TEAMS</option>
          ${teams.map(t => `<option value="${t}" ${t === currentTeam ? "selected" : ""}>${teamLabel(t)}</option>`).join("")}
        </select>
      </div>

      <div>
        <label>ROLE: </label>
        <select id="hpLaneFilter" onchange="showHeroPool()">
          <option value="ALL ROLES">ALL ROLES</option>
          ${lanes.map(l => `<option value="${l}" ${l === currentLane ? "selected" : ""}>${l}</option>`).join("")}
        </select>
      </div>
    </div>

    <!-- SEARCH BELOW FILTERS (PLAYER NAME ONLY) -->
    <div class="searchRow">
      <input
        id="hpPlayerSearch"
        type="text"
        placeholder="Search player..."
        value="${currentSearch.replace(/"/g, "&quot;")}"
        oninput="onHpPlayerSearchInput(event)"
        class="searchInput"
      />
    </div>

          <div class="rotateHint">
    Rotate your phone for full table view
  </div>

    <table class="heroPoolTable">
      <tr>
        <th aria-sort="${heroPoolSort.key === 'name' ? (heroPoolSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroPool('name')">PLAYER${arrow('name')}</th>
        <th aria-sort="${heroPoolSort.key === 'team' ? (heroPoolSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroPool('team')">TEAM${arrow('team')}</th>
        <th aria-sort="${heroPoolSort.key === 'lane' ? (heroPoolSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroPool('lane')">ROLE${arrow('lane')}</th>
        <th aria-sort="${heroPoolSort.key === 'totalHeroes' ? (heroPoolSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortHeroPool('totalHeroes')">TOTAL HEROES${arrow('totalHeroes')}</th>
        <th>HEROES PLAYED (GAMES - WINRATE %)</th>
      </tr>
  `;

  for (let ps of arr) {
    const heroesHTML = ps.heroesPlayed.map(h => `
      <span style="display:inline-flex; align-items:center; gap:6px; margin:3px 10px 3px 0;">
        <img
          src="${h.img}"
          width="45"
          height="45"
          alt="${h.hero}"
          style="border-radius:50%; object-fit:cover; border:2px solid #fff;"
        >
        <span>${h.hero} (${h.games} - ${h.winRate.toFixed(0)}%)</span>
      </span>
    `).join("");

    html += `
      <tr>
        <td style="vertical-align:middle;">
          <button
            type="button"
            class="playerProfileTrigger heroPoolPlayerTrigger"
            onclick="openPlayerProfileModal(decodeURIComponent('${encodeInlineString(ps.name)}'))"
            aria-label="Open player profile for ${escapeHtml(ps.name)}"
          >
            <img src="${ps.picture}" width="55" height="55"
              alt="${ps.name}"
              style="border-radius:50%; object-fit:cover; border:2px solid #fff;">
            <span>${ps.name}</span>
          </button>
        </td>

<td style="vertical-align:middle;">
  <div class="teamCell">
    <img class="teamLogo" src="${teamLogos[ps.team] || ""}" width="45" height="45" alt="${teamLabel(ps.team)} logo">
    <span>${teamLabel(ps.team)}</span>
  </div>
</td>

        <td>${ps.lane}</td>
        <td>${ps.totalHeroes}</td>
        <td style="text-align:left; max-width:650px;">${heroesHTML}</td>
      </tr>
    `;
  }

  html += `</table>`;
  document.getElementById("output").innerHTML = html;

  // keep continuous typing
  if (keepSearchFocus) {
    requestAnimationFrame(() => {
      const el = document.getElementById("hpPlayerSearch");
      if (!el) return;
      el.focus();
      const pos = Math.min(hpPlayerSearchState.caret || 0, el.value.length);
      el.setSelectionRange(pos, pos);
    });
  }
}

function sortHeroPool(key) {
  
  if (heroPoolSort.key === key) {
    heroPoolSort.asc = !heroPoolSort.asc;
  } else {
    heroPoolSort.key = key;
    heroPoolSort.asc = false;
  }
  showHeroPool();
}



function showPlayerPools(keepSearchFocus = false) {
  const pools = calculatePlayerPoolsStats();

  let arr = Object.keys(pools).map(heroName => {
    const hs = pools[heroName];

    const playerList = Object.keys(hs.players || {})
      .map(pn => {
        const p = hs.players[pn];
        return {
          name: p.name,
          team: p.team,
          lane: p.lane,
          picture: p.picture,
          games: p.games,
          winRate: p.games ? (p.wins / p.games) * 100 : 0
        };
      })
      .sort((a, b) => b.games - a.games);

    return {
      hero: heroName,
      img: constHero[heroName] || "",
      totalPlayers: playerList.length,
      playersPlayed: playerList
    };
  });

  // ===== Current filters =====
  const currentTeam = document.getElementById("ppTeamFilter")?.value || "ALL TEAMS";
  const currentLane = document.getElementById("ppLaneFilter")?.value || "ALL ROLES";

  // ===== Search (hero name only) =====
  const searchEl = document.getElementById("ppHeroSearch");
  const currentSearch = searchEl ? searchEl.value : (ppHeroSearchState.value || "");
  const q = currentSearch.trim().toLowerCase();

  // ===== Filter dropdown options (from roster, so they always exist even if no games) =====
  const teams = ["ALL TEAMS", ...new Set((roster || []).map(r => r.team))].filter(Boolean);
  const lanes = ["ALL ROLES", ...new Set((roster || []).map(r => r.lane))].filter(Boolean);

  // ===== Apply Team/Lane filters =====
  // - If Team/Lane is not ALL, we filter the player list within each hero
  // - BUT we keep unused heroes in the table when checkbox is NOT checked
  const teamLaneFilteringActive = currentTeam !== "ALL TEAMS" || currentLane !== "ALL ROLES";

  arr = arr.map(h => {
    const filteredPlayers = (h.playersPlayed || []).filter(p => {
      const teamMatch = currentTeam === "ALL TEAMS" || p.team === currentTeam;
      const laneMatch = currentLane === "ALL ROLES" || p.lane === currentLane;
      return teamMatch && laneMatch;
    });

    return {
      ...h,
      totalPlayers: filteredPlayers.length,
      playersPlayed: filteredPlayers
    };
  });

  // If filters are active, we usually hide heroes that have 0 matching players,
  // BUT only if "Exclude unused heroes" is checked.
  // If checkbox is OFF, we still show heroes with 0 players (unused).
  if (ppExcludeUnused || teamLaneFilteringActive) {
    // keep heroes that have at least one matching player
    // unless checkbox is OFF AND no team/lane filter applied
    if (ppExcludeUnused) {
      arr = arr.filter(h => h.totalPlayers > 0);
    } else if (teamLaneFilteringActive) {
      arr = arr.filter(h => h.totalPlayers > 0);
    }
  }

  // ===== Apply hero-name search =====
  if (q) {
    arr = arr.filter(h => h.hero.toLowerCase().includes(q));
  }

  // ===== Sort =====
  if (playerPoolsSort.key) {
    arr.sort((a, b) => {
      let valA = a[playerPoolsSort.key];
      let valB = b[playerPoolsSort.key];

      if (typeof valA === "string") {
        const cmp = playerPoolsSort.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        if (cmp !== 0) return cmp;
        return a.hero.localeCompare(b.hero);
      }
      const cmp = playerPoolsSort.asc ? valA - valB : valB - valA;
      if (cmp !== 0) return cmp;
      return a.hero.localeCompare(b.hero);
    });
  }

  function arrow(key) {
    if (playerPoolsSort.key !== key) return ' <span style="opacity:0.4;">&#9650;</span>';
    return playerPoolsSort.asc ? ' <span>&#9650;</span>' : ' <span>&#9660;</span>';
  }

  // ===== Render =====
  let html = `
    <h2 style="text-align:center;">PLAYER POOL ${seasonLabel()}</h2>

    <div class="filterRow">
      <div>
        <label>TEAM: </label>
        <select id="ppTeamFilter" onchange="showPlayerPools()">
          ${teams.map(t => `<option value="${t}" ${t === currentTeam ? "selected" : ""}>${teamLabel(t)}</option>`).join("")}
        </select>
      </div>

      <div>
        <label>ROLE: </label>
        <select id="ppLaneFilter" onchange="showPlayerPools()">
          ${lanes.map(l => `<option value="${l}" ${l === currentLane ? "selected" : ""}>${l}</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="searchRow" style="margin:14px 0 18px; align-items:center; gap:14px;">
      <input
        id="ppHeroSearch"
        type="text"
        placeholder="Search hero..."
        value="${currentSearch.replace(/"/g, "&quot;")}"
        oninput="onPpHeroSearchInput(event)"
        class="searchInput"
      />

      <label style="display:flex; align-items:center; gap:8px; cursor:pointer; user-select:none;">
        <input
          id="ppExcludeUnused"
          type="checkbox"
          ${ppExcludeUnused ? "checked" : ""}
          onchange="onPpExcludeUnusedToggle(event)"
          style="width:18px; height:18px;"
        />
        <span style="opacity:0.9;">Exclude unused heroes</span>
      </label>
    </div>

          <div class="rotateHint">
    Rotate your phone for full table view
  </div>

    <table class="playerPoolTable">
      <tr>
        <th aria-sort="${playerPoolsSort.key === 'hero' ? (playerPoolsSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayerPools('hero')">HERO${arrow('hero')}</th>
        <th aria-sort="${playerPoolsSort.key === 'totalPlayers' ? (playerPoolsSort.asc ? 'ascending' : 'descending') : 'none'}" onclick="sortPlayerPools('totalPlayers')">TOTAL PLAYERS${arrow('totalPlayers')}</th>
        <th>PLAYERS PLAYED (GAMES - WIN RATE %)</th>
      </tr>
  `;

  for (let h of arr) {
    const playersHTML = (h.playersPlayed && h.playersPlayed.length)
      ? h.playersPlayed.map(p => `
          <span style="display:inline-flex; align-items:center; gap:6px; margin:3px 10px 3px 0;">
            <img
              src="${p.picture}"
              width="85"
              height="85"
              alt="${p.name}"
              style="border-radius:50%; object-fit:cover; border:2px solid #fff;"
            >
            <span>${p.name} (${p.games} - ${p.winRate.toFixed(0)}%)</span>
          </span>
        `).join("")
      : `<span style="opacity:0.6;">-</span>`;

    html += `
      <tr>
        <td style="vertical-align:middle;">
          <div style="display:flex; align-items:center; gap:10px; height:100%;">
            <img src="${h.img}" width="55" height="55"
              alt="${h.hero}"
              style="border-radius:50%; object-fit:cover; border:2px solid #fff;">
            <span>${h.hero}</span>
          </div>
        </td>
        <td>${h.totalPlayers}</td>
        <td style="text-align:left; max-width:700px;">${playersHTML}</td>
      </tr>
    `;
  }

  html += `</table>`;
  document.getElementById("output").innerHTML = html;

  // keep continuous typing
  if (keepSearchFocus) {
    requestAnimationFrame(() => {
      const el = document.getElementById("ppHeroSearch");
      if (!el) return;
      el.focus();
      const pos = Math.min(ppHeroSearchState.caret || 0, el.value.length);
      el.setSelectionRange(pos, pos);
    });
  }
}

function sortPlayerPools(key) {
  if (playerPoolsSort.key === key) {
    playerPoolsSort.asc = !playerPoolsSort.asc;
  } else {
    playerPoolsSort.key = key;
    playerPoolsSort.asc = false;
  }
  showPlayerPools();
}

function setH2hSubTab(tab) {
  if (!tab) return;
  const next = String(tab).toLowerCase();
  if (next !== "team" && next !== "player" && next !== "hero") return;
  h2hSubTab = next;
  h2hPopupState = { kind: "", side: "" };
  if (typeof window.syncH2hRoute === "function") {
    window.syncH2hRoute(next);
  }
  showH2H();
}

function getH2hSubTab() {
  return h2hSubTab;
}

function renderTeamH2HCompare() {
  const t = calculateTeamStats();
  const statRows = [
    { key: "matchWins", label: "MATCHES WON" },
    { key: "kills", label: "KILLS" },
    { key: "deaths", label: "DEATHS" },
    { key: "assists", label: "ASSISTS" },
    { key: "lord", label: "LORD" },
    { key: "turtle", label: "TURTLE" },
    { key: "tower", label: "TOWER" }
  ];
  const teamOptions = Object.keys(t).sort((a, b) => teamLabel(a).localeCompare(teamLabel(b)));

  function toStat(teamStats, key) {
    const raw = teamStats?.[key];
    const num = Number(raw);
    return Number.isFinite(num) ? num : 0;
  }

  function renderCompareCard(sideKey, title) {
    const teamCode = teamCompareState[sideKey];
    const selected = teamCode && t[teamCode] ? t[teamCode] : null;
    const otherCode = sideKey === "left" ? teamCompareState.right : teamCompareState.left;
    const other = otherCode && t[otherCode] ? t[otherCode] : null;

    return `
      <div class="teamCompareCard">
        <div class="teamCompareHead">
          <div class="teamCompareLabel">${title}</div>
          <select onchange="onTeamCompareChange('${sideKey}', this.value)">
            <option value="">Select team</option>
            ${teamOptions.map(code => `<option value="${code}" ${code === teamCode ? "selected" : ""}>${teamLabel(code)}</option>`).join("")}
          </select>
        </div>

        ${selected ? `
          <div class="teamCompareIdentity">
            <img class="teamCompareLogo" src="${teamLogos[teamCode] || ""}" alt="${teamLabel(teamCode)} logo">
            <span>${teamLabel(teamCode)}</span>
          </div>

          <div class="teamCompareStats">
            ${statRows.map(row => {
              const currentVal = toStat(selected, row.key);
              const otherVal = other ? toStat(other, row.key) : null;
              const isHigher = otherVal !== null && currentVal > otherVal;
              return `
                <div class="teamCompareRow">
                  <span>${row.label}</span>
                  <span class="teamCompareValue ${isHigher ? "is-better" : ""}">${currentVal}</span>
                </div>
              `;
            }).join("")}
          </div>
        ` : `
          <div class="teamCompareEmpty">Select a team to load stats.</div>
        `}
      </div>
    `;
  }

  return `
    <div class="teamCompareWrap">
      ${renderCompareCard("left", "TEAM A")}
      ${renderCompareCard("right", "TEAM B")}
    </div>
  `;
}

function renderPlayerH2HCompare() {
  const p = calculatePlayerStats();
  const heroPools = calculateHeroPoolStats();
  const playerOptions = Object.keys(p).sort((a, b) => a.localeCompare(b));
  const statRows = [
    { key: "games", label: "GAMES", format: v => `${v}` },
    { key: "heroPoolCount", label: "HERO POOL", format: v => `${v}` },
    { key: "kills", label: "KILLS", format: v => `${v}` },
    { key: "avgK", label: "AVG KILLS", format: v => v.toFixed(2) },
    { key: "deaths", label: "DEATHS", format: v => `${v}` },
    { key: "avgD", label: "AVG DEATHS", format: v => v.toFixed(2) },
    { key: "assists", label: "ASSISTS", format: v => `${v}` },
    { key: "avgA", label: "AVG ASSISTS", format: v => v.toFixed(2) },
    { key: "kda", label: "KDA", format: v => v.toFixed(2) },
    { key: "kp", label: "KP%", format: v => `${v.toFixed(1)}%` }
  ];

  function buildPlayerStats(name) {
    const ps = p[name];
    if (!ps) return null;
    const games = Number(ps.games) || 0;
    const kills = Number(ps.kills) || 0;
    const deaths = Number(ps.deaths) || 0;
    const assists = Number(ps.assists) || 0;
    const kpTotal = Number(ps.kpTotal) || 0;
    const pool = heroPools[name] || { heroes: {} };
    const heroPoolDetails = Object.keys(pool.heroes || {}).map(heroName => {
      const hs = (pool.heroes || {})[heroName] || {};
      const gamesUsed = Number(hs.games) || 0;
      const wins = Number(hs.wins) || 0;
      return {
        hero: heroName,
        img: constHero[heroName] || "",
        gamesUsed,
        winRate: gamesUsed ? (wins / gamesUsed) * 100 : 0
      };
    }).sort((a, b) => b.gamesUsed - a.gamesUsed);

    return {
      name,
      team: ps.team,
      lane: ps.lane,
      picture: ps.picture,
      games,
      kills,
      deaths,
      assists,
      avgK: games ? kills / games : 0,
      avgD: games ? deaths / games : 0,
      avgA: games ? assists / games : 0,
      kda: (kills + assists) / (deaths || 1),
      kp: games ? (kpTotal / games) * 100 : 0,
      heroPoolCount: Object.keys(pool.heroes || {}).length,
      heroPoolDetails
    };
  }

  function resolvePlayerName(input) {
    const q = String(input || "").trim().toLowerCase();
    if (!q) return "";
    return playerOptions.find(name => name.toLowerCase() === q) || "";
  }

  function renderCompareCard(sideKey, title) {
    const typedName = playerCompareState[sideKey] || "";
    const selectedName = resolvePlayerName(typedName);
    const selected = buildPlayerStats(selectedName);
    const otherName = sideKey === "left" ? playerCompareState.right : playerCompareState.left;
    const other = buildPlayerStats(resolvePlayerName(otherName));

    const q = typedName.trim().toLowerCase();
    const isExactMatch = !!selectedName && selectedName.toLowerCase() === q;
    const showSuggestions = !!q && !isExactMatch;
    const suggestions = q
      ? playerOptions.filter(name => name.toLowerCase().startsWith(q)).slice(0, 12)
      : [];

    return `
      <div class="teamCompareCard">
        <div class="teamCompareHead">
          <div class="teamCompareLabel">${title}</div>
          <div class="compareSearchWrap">
            <input
              id="h2hPlayerSearch-${sideKey}"
              class="compareSearchInput"
              placeholder="Search player..."
              value="${typedName.replace(/"/g, "&quot;")}"
              oninput="onPlayerCompareChange('${sideKey}', this.value, this.selectionStart)"
            />
            <select
              class="compareSelectInput"
              onchange="onPlayerCompareChange('${sideKey}', this.value, this.value.length)"
            >
              <option value="">Select player from list</option>
              ${playerOptions.map(name => `
                <option value="${name}" ${name === selectedName ? "selected" : ""}>${name}</option>
              `).join("")}
            </select>
            ${showSuggestions ? `
              <div class="compareSuggestList">
                ${suggestions.length
                  ? suggestions.map(name => `
                    ${(() => {
                      const safeName = name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                      return `
                    <button
                      type="button"
                      class="compareSuggestItem"
                      onmousedown="onPlayerCompareChange('${sideKey}', '${safeName}', ${name.length})"
                    >
                      ${name}
                    </button>
                  `;
                    })()}
                  `).join("")
                  : `<div class="compareSuggestEmpty">No player found</div>`
                }
              </div>
            ` : ""}
          </div>
        </div>

        ${selected ? `
          <div class="teamCompareIdentity">
            <img class="playerCompareAvatar" src="${selected.picture}" alt="${selected.name}">
            <span>${selected.name}</span>
          </div>
          <div class="playerCompareMeta">
            <span class="playerCompareTeamBadge">
              <img class="playerCompareTeamLogo" src="${teamLogos[selected.team] || ""}" alt="${teamLabel(selected.team)} logo">
              <span class="playerCompareTeamName">${teamLabel(selected.team)}</span>
            </span>
            <span class="playerCompareLane">${selected.lane}</span>
          </div>
          <div class="teamCompareStats">
            ${statRows.map(row => {
              const currentVal = Number(selected[row.key]) || 0;
              const otherVal = other ? (Number(other[row.key]) || 0) : null;
              const isHigher = otherVal !== null && currentVal > otherVal;
              const actionBtn = row.key === "heroPoolCount"
                ? `<button type="button" class="compareStatActionBtn" onclick="openH2hPoolPopup('playerHeroPool', '${sideKey}')">Show Hero</button>`
                : "";
              return `
                <div class="teamCompareRow">
                  <span>${row.label}</span>
                  <span style="display:inline-flex; align-items:center; gap:8px;">
                    ${actionBtn}
                    <span class="teamCompareValue ${isHigher ? "is-better" : ""}">${row.format(currentVal)}</span>
                  </span>
                </div>
              `;
            }).join("")}
          </div>
        ` : `
          <div class="teamCompareEmpty">Select a player to load stats.</div>
        `}
      </div>
    `;
  }

  function renderPoolPopup() {
    if (h2hPopupState.kind !== "playerHeroPool") return "";
    const side = h2hPopupState.side === "right" ? "right" : "left";
    const selectedName = resolvePlayerName(playerCompareState[side] || "");
    const selected = buildPlayerStats(selectedName);
    if (!selected) return "";

    return `
      <div class="h2hModalBackdrop" onclick="closeH2hPoolPopup()">
        <div class="h2hModalCard" onclick="event.stopPropagation()">
          <div class="h2hModalHead">
            <h3>${selected.name} - Hero List</h3>
            <button type="button" class="h2hModalClose" onclick="closeH2hPoolPopup()">Close</button>
          </div>
          <div class="h2hModalList">
            ${(selected.heroPoolDetails || []).map(item => `
              <div class="h2hModalItem">
                <div class="h2hModalMain">
                  <img class="h2hModalImg" src="${item.img}" alt="${item.hero}">
                  <span>${item.hero}</span>
                </div>
                <div class="h2hModalMeta">${item.gamesUsed} ${item.gamesUsed === 1 ? "game" : "games"} | ${item.winRate.toFixed(0)}% WR</div>
              </div>
            `).join("") || `<div class="h2hModalEmpty">No hero data.</div>`}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="teamCompareWrap">
      ${renderCompareCard("left", "PLAYER A")}
      ${renderCompareCard("right", "PLAYER B")}
    </div>
    ${renderPoolPopup()}
  `;
}

function renderHeroH2HCompare() {
  const heroStats = calculateHeroStats();
  const playerPools = calculatePlayerPoolsStats();
  const heroMap = Object.fromEntries(heroStats.map(h => [h.hero, h]));
  const heroOptions = Object.keys(heroMap).sort((a, b) => a.localeCompare(b));

  const extra = {};
  for (const match of getMatches()) {
    for (const game of (match.games || [])) {
      for (const p of (game.players || [])) {
        const heroName = String(p.hero || "").trim();
        if (!heroName) continue;
        if (!extra[heroName]) {
          extra[heroName] = { kills: 0, deaths: 0, assists: 0 };
        }
        extra[heroName].kills += Number(p.kills) || 0;
        extra[heroName].deaths += Number(p.deaths) || 0;
        extra[heroName].assists += Number(p.assists) || 0;
      }
    }
  }

  const statRows = [
    { key: "pick", label: "PICK", format: v => `${v}` },
    { key: "playerPoolCount", label: "PLAYER POOL", format: v => `${v}` },
    { key: "pickRate", label: "PICK RATE", format: v => `${v.toFixed(1)}%` },
    { key: "ban", label: "BAN", format: v => `${v}` },
    { key: "banRate", label: "BAN RATE", format: v => `${v.toFixed(1)}%` },
    { key: "winRate", label: "WIN RATE", format: v => `${v.toFixed(1)}%` },
    { key: "kills", label: "KILLS", format: v => `${v}` },
    { key: "deaths", label: "DEATHS", format: v => `${v}` },
    { key: "assists", label: "ASSISTS", format: v => `${v}` },
    { key: "kda", label: "KDA", format: v => v.toFixed(2) }
  ];

  function resolveHeroName(input) {
    const q = String(input || "").trim().toLowerCase();
    if (!q) return "";
    return heroOptions.find(name => name.toLowerCase() === q) || "";
  }

  function buildHeroStats(name) {
    const hs = heroMap[name];
    if (!hs) return null;
    const ext = extra[name] || { kills: 0, deaths: 0, assists: 0 };
    const kills = Number(ext.kills) || 0;
    const deaths = Number(ext.deaths) || 0;
    const assists = Number(ext.assists) || 0;
    const pool = playerPools[name] || { players: {} };
    const playerPoolDetails = Object.keys(pool.players || {}).map(playerName => {
      const pl = pool.players[playerName] || {};
      const gamesUsed = Number(pl.games) || 0;
      const wins = Number(pl.wins) || 0;
      return {
        name: playerName,
        picture: pl.picture || "",
        gamesUsed,
        winRate: gamesUsed ? (wins / gamesUsed) * 100 : 0
      };
    }).sort((a, b) => b.gamesUsed - a.gamesUsed);

    return {
      hero: hs.hero,
      img: hs.img || constHero[hs.hero] || "",
      pick: Number(hs.pick) || 0,
      pickRate: Number(hs.pickRate) || 0,
      ban: Number(hs.ban) || 0,
      banRate: Number(hs.banRate) || 0,
      winRate: Number(hs.winRate) || 0,
      kills,
      deaths,
      assists,
      kda: (kills + assists) / (deaths || 1),
      playerPoolCount: Object.keys(pool.players || {}).length,
      playerPoolDetails
    };
  }

  function renderCompareCard(sideKey, title) {
    const typedName = heroCompareState[sideKey] || "";
    const selectedName = resolveHeroName(typedName);
    const selected = buildHeroStats(selectedName);
    const otherName = sideKey === "left" ? heroCompareState.right : heroCompareState.left;
    const other = buildHeroStats(resolveHeroName(otherName));

    const q = typedName.trim().toLowerCase();
    const isExactMatch = !!selectedName && selectedName.toLowerCase() === q;
    const showSuggestions = !!q && !isExactMatch;
    const suggestions = q
      ? heroOptions.filter(name => name.toLowerCase().startsWith(q)).slice(0, 12)
      : [];

    return `
      <div class="teamCompareCard">
        <div class="teamCompareHead">
          <div class="teamCompareLabel">${title}</div>
          <div class="compareSearchWrap">
            <input
              id="h2hHeroSearch-${sideKey}"
              class="compareSearchInput"
              placeholder="Search hero..."
              value="${typedName.replace(/"/g, "&quot;")}"
              oninput="onHeroCompareChange('${sideKey}', this.value, this.selectionStart)"
            />
            <select
              class="compareSelectInput"
              onchange="onHeroCompareChange('${sideKey}', this.value, this.value.length)"
            >
              <option value="">Select hero from list</option>
              ${heroOptions.map(name => `
                <option value="${name}" ${name === selectedName ? "selected" : ""}>${name}</option>
              `).join("")}
            </select>
            ${showSuggestions ? `
              <div class="compareSuggestList">
                ${suggestions.length
                  ? suggestions.map(name => `
                    ${(() => {
                      const safeName = name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                      return `
                    <button
                      type="button"
                      class="compareSuggestItem"
                      onmousedown="onHeroCompareChange('${sideKey}', '${safeName}', ${name.length})"
                    >
                      ${name}
                    </button>
                  `;
                    })()}
                  `).join("")
                  : `<div class="compareSuggestEmpty">No hero found</div>`
                }
              </div>
            ` : ""}
          </div>
        </div>

        ${selected ? `
          <div class="teamCompareIdentity">
            <img class="heroCompareAvatar" src="${selected.img}" alt="${selected.hero}">
            <span>${selected.hero}</span>
          </div>
          <div class="teamCompareStats">
            ${statRows.map(row => {
              const currentVal = Number(selected[row.key]) || 0;
              const otherVal = other ? (Number(other[row.key]) || 0) : null;
              const isHigher = otherVal !== null && currentVal > otherVal;
              const actionBtn = row.key === "playerPoolCount"
                ? `<button type="button" class="compareStatActionBtn" onclick="openH2hPoolPopup('heroPlayerPool', '${sideKey}')">Show Player</button>`
                : "";
              return `
                <div class="teamCompareRow">
                  <span>${row.label}</span>
                  <span style="display:inline-flex; align-items:center; gap:8px;">
                    ${actionBtn}
                    <span class="teamCompareValue ${isHigher ? "is-better" : ""}">${row.format(currentVal)}</span>
                  </span>
                </div>
              `;
            }).join("")}
          </div>
        ` : `
          <div class="teamCompareEmpty">Select a hero to load stats.</div>
        `}
      </div>
    `;
  }

  function renderPoolPopup() {
    if (h2hPopupState.kind !== "heroPlayerPool") return "";
    const side = h2hPopupState.side === "right" ? "right" : "left";
    const selectedName = resolveHeroName(heroCompareState[side] || "");
    const selected = buildHeroStats(selectedName);
    if (!selected) return "";

    return `
      <div class="h2hModalBackdrop" onclick="closeH2hPoolPopup()">
        <div class="h2hModalCard" onclick="event.stopPropagation()">
          <div class="h2hModalHead">
            <h3>${selected.hero} - Player List</h3>
            <button type="button" class="h2hModalClose" onclick="closeH2hPoolPopup()">Close</button>
          </div>
          <div class="h2hModalList">
            ${(selected.playerPoolDetails || []).map(item => `
              <div class="h2hModalItem">
                <div class="h2hModalMain">
                  <img class="h2hModalImg h2hModalImg--player" src="${item.picture}" alt="${item.name}">
                  <span>${item.name}</span>
                </div>
                <div class="h2hModalMeta">${item.gamesUsed} ${item.gamesUsed === 1 ? "game" : "games"} | ${item.winRate.toFixed(0)}% WR</div>
              </div>
            `).join("") || `<div class="h2hModalEmpty">No player data.</div>`}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="teamCompareWrap">
      ${renderCompareCard("left", "HERO A")}
      ${renderCompareCard("right", "HERO B")}
    </div>
    ${renderPoolPopup()}
  `;
}

function showH2H(focus = null) {
  const tabs = [
    { key: "team", label: "Team" },
    { key: "player", label: "Player" },
    { key: "hero", label: "Hero" }
  ];

  const title = h2hSubTab === "team"
    ? "TEAM H2H"
    : h2hSubTab === "player"
      ? "PLAYER H2H"
      : "HERO H2H";

  const html = `
    <h2 class="panel-title">H2H ${seasonLabel()}</h2>

    <div class="nav" style="margin: 0 auto 22px; max-width: 540px;">
      ${tabs.map(tab => `
        ${(() => {
          const href = typeof window.getRouteHref === "function"
            ? window.getRouteHref("h2h", tab.key)
            : `/h2h/${tab.key}`;
          return `
        <a
          href="${href}"
          data-h2h-tab="${tab.key}"
          class="${h2hSubTab === tab.key ? "is-active" : ""}"
          ${h2hSubTab === tab.key ? 'aria-current="page"' : ""}
        >
          ${tab.label}
        </a>
      `;
        })()}
      `).join("")}
    </div>

    ${h2hSubTab === "team"
      ? renderTeamH2HCompare()
      : h2hSubTab === "player"
        ? renderPlayerH2HCompare()
        : h2hSubTab === "hero"
          ? renderHeroH2HCompare()
        : `
        <div style="text-align:center; padding: 12px 10px 4px;">
          <h3 style="margin-bottom:12px;">${title}</h3>
          <p style="margin:0; opacity:0.9;">No data yet.</p>
        </div>
      `
    }
  `;

  document.getElementById("output").innerHTML = html;

  if (focus && focus.focusId) {
    requestAnimationFrame(() => {
      const el = document.getElementById(focus.focusId);
      if (!el) return;
      el.focus();
      const nextCaret = Number(focus.caret);
      const pos = Number.isFinite(nextCaret)
        ? Math.min(nextCaret, el.value.length)
        : el.value.length;
      el.setSelectionRange(pos, pos);
    });
  }
}

// ===== Sociabuzz Position Control =====
let _sbEl = null;

function findSociabuzzElement() {
  // Try common possibilities (works even if Sociabuzz changes wrapper)
  return (
    document.querySelector("#sbBoW") ||
    document.querySelector(".sbBoW") ||
    document.querySelector('[class*="sbBoW"]') ||
    document.querySelector('iframe[src*="sociabuzz"]') ||
    document.querySelector('a[href*="sociabuzz.com/izzat27"]') ||
    null
  );
}

function setSupportPos(mode) {
  if (!_sbEl) _sbEl = findSociabuzzElement();
  if (!_sbEl) return;

  // Sometimes the clickable button is inside a wrapper; move the wrapper if possible
  const el = _sbEl.parentElement && _sbEl.tagName.toLowerCase() === "iframe"
    ? _sbEl.parentElement
    : _sbEl;

  el.style.position = "fixed";
  el.style.zIndex = "9999";

  if (mode === "center") {
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.transform = "translate(-50%, -50%)";
  } else if (mode === "topRight") {
    el.style.top = "15px";
    el.style.right = "15px";
    el.style.left = "auto";
    el.style.bottom = "auto";
    el.style.transform = "none";

  }}
export {
  showSchedule,
  refreshScheduleCountdowns,
  onScheduleStageChange,
  onScheduleTeamChange,
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
};







