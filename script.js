let teamSort = {key: "matchWins", asc: false }; // false = DESC (highest matchWins first)
let playerSort = { key: "kda", asc: false };
let heroSort = { key: "pickRate", asc: false };
let heroPoolSort = { key: "totalHeroes", asc: false };
let playerPoolsSort = { key: "totalPlayers", asc: false };



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
let ppExcludeUnused = false; // ✅ checkbox state

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

const teamLogos = {
  "Monster Vicious": "https://i.imgur.com/17CoAJO.png",
  "Team Vamos": "https://i.imgur.com/Y9LMqU9.png",
  "AERO Esports": "https://i.imgur.com/cT7XCWe.png",
  "Untitled": "https://i.imgur.com/z4vRDxZ.png",
  "Selangor Red Giants": "https://i.imgur.com/rKrW5Tv.png",
  "Homebois": "https://i.imgur.com/ALLd2pa.png",
  "Team Rey": "https://i.imgur.com/qQOtl5b.png",
  "Todak": "https://i.imgur.com/PNsHyYc.png",
  "CG Esports": "https://i.imgur.com/BJEdq8E.png",
  "GAMESMY Kelantan": "https://i.imgur.com/ZEzKnRQ.png"
};

// ===== MASTER ROSTER (include subs here) =====
const roster = [
  // Example format:
  // { name:"PlayerName", team:"Team Name", lane:"Gold Laner", picture:"https://..." },

  { name: "Rough", team: "Monster Vicious", lane: "Gold Laner", picture: "https://i.imgur.com/scpwgUa.png" },
  { name: "Unii", team: "Monster Vicious", lane: "Jungler", picture: "https://i.imgur.com/Y6cCEK4.png" },
  { name: "Bondolz", team: "Monster Vicious", lane: "Midlaner", picture: "https://i.imgur.com/lLUfZVt.png" },
  { name: "Momo", team: "Monster Vicious", lane: "Exp Laner", picture: "https://i.imgur.com/aDKFRPI.png" },
  { name: "Lyoni", team: "Monster Vicious", lane: "Roamer", picture: "https://i.imgur.com/ouVd1Kr.png" },
  { name: "Natco", team: "Team Vamos", lane: "Gold Laner", picture: "https://i.imgur.com/48b6SmK.png" },
  { name: "Chibi", team: "Team Vamos", lane: "Jungler", picture: "https://i.imgur.com/ahEyDfv.png" },
  { name: "Clawkun", team: "Team Vamos", lane: "Midlaner",  picture: "https://i.imgur.com/mDZrBXV.png" },
  { name: "Gojes", team: "Team Vamos", lane: "Exp Laner",  picture: "https://i.imgur.com/2inGQSn.png" },
  { name: "Xorn", team: "Team Vamos", lane: "Roamer",  picture: "https://i.imgur.com/Ux5auTn.png"},
  { name: "Kusey", team: "AERO Esports", lane: "Gold Laner",  picture: "https://i.imgur.com/413R26Z.png" },
  { name: "Hazle", team: "AERO Esports", lane: "Jungler", picture: "https://i.imgur.com/MvL7jzh.png" },
  { name: "Kyym", team: "AERO Esports", lane: "Midlaner",  picture: "https://i.imgur.com/5X4UXw8.png" },
  { name: "Smooth", team: "AERO Esports", lane: "Exp Laner",  picture: "https://i.imgur.com/0bW64Ki.png" },
  { name: "Zqeef", team: "AERO Esports", lane: "Roamer",  picture: "https://i.imgur.com/t7p2IxW.png"},
  { name: "Skyzed", team: "Untitled", lane: "Gold Laner",  picture: "https://i.imgur.com/02b5lub.png" },
  { name: "Keymin", team: "Untitled", lane: "Jungler",  picture: "https://i.imgur.com/cVEas3K.png" },
  { name: "Stowm", team: "Untitled", lane: "Midlaner",  picture: "https://i.imgur.com/cOtDg24.png" },
  { name: "Sizkaa", team: "Untitled", lane: "Exp Laner",  picture: "https://i.imgur.com/CgldSAq.png" },
  { name: "Rasy", team: "Untitled", lane: "Roamer", picture: "https://i.imgur.com/3xz28tZ.png"},
  { name: "Innocent", team: "Selangor Red Giants", lane: "Gold Laner",  picture: "https://i.imgur.com/SHdZx30.png" },
  { name: "Sekys", team: "Selangor Red Giants", lane: "Jungler",  picture: "https://i.imgur.com/6cd6pGF.png" },
  { name: "Stormie", team: "Selangor Red Giants", lane: "Midlaner",  picture: "https://i.imgur.com/1KIkUJ7.png" },
  { name: "Kramm", team: "Selangor Red Giants", lane: "Exp Laner",  picture: "https://i.imgur.com/bPYW0sI.png" },
  { name: "Yums", team: "Selangor Red Giants", lane: "Roamer",  picture: "https://i.imgur.com/ws8GoEJ.png"},
  { name: "Melqt", team: "Homebois", lane: "Gold Laner",  picture: "https://i.imgur.com/ReSovOr.png" },
  { name: "Eyymal", team: "Homebois", lane: "Jungler",  picture: "https://i.imgur.com/cMJUTQh.png" },
  { name: "Izanami", team: "Homebois", lane: "Midlaner",  picture: "https://i.imgur.com/xaBAD77.png" },
  { name: "Rezza", team: "Homebois", lane: "Exp Laner",  picture: "https://i.imgur.com/1HJiEgB.png" },
  { name: "Cayden", team: "Homebois", lane: "Roamer",  picture: "https://i.imgur.com/O4oDGXc.png"},
  { name: "Daniel", team: "Homebois", lane: "Roamer",  picture: "https://i.imgur.com/qZjDoLe.png"},
  { name: "Zippyqt", team: "Homebois", lane: "Gold Laner",  picture: "https://i.imgur.com/Po8ykTi.png" },
  { name: "Jowm", team: "Team Rey", lane: "Gold Laner",  picture: "https://i.imgur.com/vVtCp4S.png" },
  { name: "Duskk", team: "Team Rey", lane: "Jungler",  picture: "https://i.imgur.com/yEpZzkl.png" },
  { name: "Zakqt", team: "Team Rey", lane: "Midlaner",  picture: "https://i.imgur.com/rLCjvzJ.png" },
  { name: "Der", team: "Team Rey", lane: "Exp Laner",  picture: "https://i.imgur.com/V0kSb6s.png" },
  { name: "NovaXCobar", team: "Team Rey", lane: "Roamer",  picture: "https://i.imgur.com/dgfRft1.png"},
  { name: "Zayyy", team: "Team Rey", lane: "Midlaner",  picture: "https://i.imgur.com/vuHaJz2.png" },
  { name: "Error404", team: "Team Rey", lane: "Jungler",  picture: "https://i.imgur.com/2aJP8iR.png" },
  { name: "Loleal", team: "Todak", lane: "Gold Laner",  picture: "https://i.imgur.com/Mmz80I7.png" },
  { name: "Zahyed", team: "Todak", lane: "Jungler",  picture: "https://i.imgur.com/Zr5f3ZU.png" },
  { name: "ZaimSempoi", team: "Todak", lane: "Midlaner",  picture: "https://i.imgur.com/J1dXujF.png" },
  { name: "Fawndeer", team: "Todak", lane: "Exp Laner",  picture: "https://i.imgur.com/5AMdEih.png" },
  { name: "Dreams", team: "Todak", lane: "Roamer",  picture: "https://i.imgur.com/aNDNWHb.png"},
  { name: "Amzziq", team: "CG Esports", lane: "Gold Laner",  picture: "https://i.imgur.com/wguX967.png" },
  { name: "Gary", team: "CG Esports", lane: "Jungler",  picture: "https://i.imgur.com/QPK02Ki.png" },
  { name: "Ciku", team: "CG Esports", lane: "Midlaner",  picture: "https://i.imgur.com/r3iKJPK.png" },
  { name: "Ye3", team: "CG Esports", lane: "Exp Laner",  picture: "https://i.imgur.com/Dzd9Bpy.png" },
  { name: "Valenz", team: "CG Esports", lane: "Roamer",  picture: "https://i.imgur.com/nzbIpw1.png"},
  { name: "Aj", team: "CG Esports", lane: "Midlaner",  picture: "https://i.imgur.com/f8zm6mw.png" },
  { name: "Trap", team: "CG Esports", lane: "Gold Laner",  picture: "https://i.imgur.com/i4hCtRd.png" },
  { name: "Immqt", team: "GAMESMY Kelantan", lane: "Gold Laner",  picture: "https://i.imgur.com/K18ycH2.png" },
  { name: "Jaja", team: "GAMESMY Kelantan", lane: "Jungler",  picture: "https://i.imgur.com/qwypigC.png" },
  { name: "Maima", team: "GAMESMY Kelantan", lane: "Midlaner",  picture: "https://i.imgur.com/0WNp0Ub.png" },
  { name: "Munster", team: "GAMESMY Kelantan", lane: "Exp Laner",  picture: "https://i.imgur.com/2bBe6Ev.png" },
  { name: "Matdinz", team: "GAMESMY Kelantan", lane: "Roamer",  picture: "https://i.imgur.com/lSWoHLl.png"},
  { name: "Skyzar", team: "GAMESMY Kelantan", lane: "Gold Laner",  picture: "https://i.imgur.com/TN31Ebg.png" },

  
];
  const rosterMap = Object.fromEntries((roster || []).map(p => [p.name, p]));

  function getRoster(name) {
  return rosterMap[name] || { name, team: "Unknown", lane: "Unknown", picture: "" };
}

const constHero = {
"Arlott": "https://i.imgur.com/4WJhGhe.png",
"Nolan": "https://i.imgur.com/uRSvNxF.png",
"Uranus": "https://i.imgur.com/yzhv75N.png",
"Atlas": "https://i.imgur.com/lw8CROi.png",
"Harith": "https://i.imgur.com/pYfO3Ad.png",
"Novaria": "https://i.imgur.com/Cm315Fh.png",
"Eudora": "https://i.imgur.com/Wprn5cR.png",
"Zhuxin": "https://i.imgur.com/vVCqM7G.png",
"Roger": "https://i.imgur.com/sjTQXJx.png",
"Paquito": "https://i.imgur.com/hIprPnH.png",
"Aurora": "https://i.imgur.com/9ueDYjh.png",
"Khaleed": "https://i.imgur.com/KBW0271.png",
"Hylos": "https://i.imgur.com/qtxxjAW.png",
"Zetian": "https://i.imgur.com/vix1Y27.png",
"Lesley": "https://i.imgur.com/sxSVgvF.png",
"Barats": "https://i.imgur.com/CsH4l0T.png",
"Popol": "https://i.imgur.com/OcC9vi3.png",
"Miya": "https://i.imgur.com/3sy6waG.png",
"Vale": "https://i.imgur.com/ByD9eS2.png",
"Edith": "https://i.imgur.com/BqBs6GU.png",
"Carmilla": "https://i.imgur.com/Ay77L1Z.png",
"Vexana": "https://i.imgur.com/JWUIIl5.png",
"Minotaur": "https://i.imgur.com/D6DrwXq.png",
"Thamuz": "https://i.imgur.com/4KaYInZ.png",
"Fredrinn": "https://i.imgur.com/Rsqas4g.png",
"Kimmy": "https://i.imgur.com/riUISJC.png",
"Yi Sun-Shin": "https://i.imgur.com/kwmYzNo.png",
"Suyou": "https://i.imgur.com/FCIZSjo.png",
"Jawhead": "https://i.imgur.com/ISvF7lo.png",
"Julian": "https://i.imgur.com/btioHRZ.png",
"Lukas": "https://i.imgur.com/8DCwMKp.png",
"Karina": "https://i.imgur.com/VeIQntc.png",
"Sora": "https://i.imgur.com/jNVZFrQ.png",
"Badang": "https://i.imgur.com/BonOUbR.png",
"Chang'e": "https://i.imgur.com/TfWvNTW.png",
"Karrie": "https://i.imgur.com/Sheuj97.png",
"Faramis": "https://i.imgur.com/1hxgE8E.png",
"Tigreal": "https://i.imgur.com/ljB1xBX.png",
"Cici": "https://i.imgur.com/waCNa9t.png",
"Harley": "https://i.imgur.com/ut4hs4J.png",
"Xavier": "https://i.imgur.com/Jb3iVre.png",
"Floryn": "https://i.imgur.com/td7Seet.png",
"Grock": "https://i.imgur.com/HBV9wlc.png",
"Selena": "https://i.imgur.com/BHBYJ2A.png",
"Aulus": "https://i.imgur.com/AzTuOL9.png",
"Lolita": "https://i.imgur.com/djzz8lz.png",
"Lylia": "https://i.imgur.com/K99yDUL.png",
"Irithel": "https://i.imgur.com/rpkZinV.png",
"Ruby": "https://i.imgur.com/wcW0oFc.png",
"Khufra": "https://i.imgur.com/q3W71B0.png",
"Kagura": "https://i.imgur.com/6ga1aEf.png",
"Hayabusa": "https://i.imgur.com/0xpQnuP.png",
"Natan": "https://i.imgur.com/ZPDkEou.png",
"Bruno": "https://i.imgur.com/WZVRS07.png",
"Lunox": "https://i.imgur.com/jw9Vu8p.png",
"Joy": "https://i.imgur.com/FjIUlVb.png",
"Gord": "https://i.imgur.com/jPRrDXW.png",
"Phoveus": "https://i.imgur.com/447kSk9.png",
"Balmond": "https://i.imgur.com/S0CgiAQ.png",
"Leomord": "https://i.imgur.com/i0fb155.png",
"Zilong": "https://i.imgur.com/flXkVx5.png",
"Layla": "https://i.imgur.com/0gImcbn.png",
"Masha": "https://i.imgur.com/7balUm2.png",
"Odette": "https://i.imgur.com/Ih6wIUt.png",
"Cyclops": "https://i.imgur.com/v8FvjBi.png",
"Hanzo": "https://i.imgur.com/OGhLkkY.png",
"Luoyi": "https://i.imgur.com/8baQPRw.png",
"Valentina": "https://i.imgur.com/nVnhbCn.png",
"Diggie": "https://i.imgur.com/wg1dGoO.png",
"Yuzhong": "https://i.imgur.com/2nUwTwa.png",
"Zhask": "https://i.imgur.com/Xrcq0gN.png",
"Melissa": "https://i.imgur.com/teYdhsC.png",
"Claude": "https://i.imgur.com/nz8vv59.png",
"Akai": "https://i.imgur.com/WejZLnt.png",
"Gusion": "https://i.imgur.com/VvqG2uH.png",
"Bane": "https://i.imgur.com/FvBYCC5.png",
"Chou": "https://i.imgur.com/NyczTOZ.png",
"Hanabi": "https://i.imgur.com/FwdlSV1.png",
"Chip": "https://i.imgur.com/PZxVfrJ.png",
"Kaja": "https://i.imgur.com/8U56qO2.png",
"Gloo": "https://i.imgur.com/L0zc7AY.png",
"Fanny": "https://i.imgur.com/WIWR0Tt.png",
"Obsidia": "https://i.imgur.com/bzro5dJ.png",
"Yin": "https://i.imgur.com/aYQ6jJE.png",
"Martis": "https://i.imgur.com/fMVTk0g.png",
"Johnson": "https://i.imgur.com/EoE2ItZ.png",
"Kalea": "https://i.imgur.com/YklbOOo.png",
"Moskov": "https://i.imgur.com/iWMBRK4.png",
"Granger": "https://i.imgur.com/muQish4.png",
"Guinevere": "https://i.imgur.com/fxmH978.png",
"Estes": "https://i.imgur.com/MqQwtGj.png",
"Angela": "https://i.imgur.com/vAswQYM.png",
"Lancelot": "https://i.imgur.com/sokqbAa.png",
"Baxia": "https://i.imgur.com/IKa93wE.png",
"Cecilion": "https://i.imgur.com/0moMfu8.png",
"Saber": "https://i.imgur.com/T3BIG6j.png",
"Lapu-Lapu": "https://i.imgur.com/NlOxl6l.png",
"Freya": "https://i.imgur.com/W1fZET1.png",
"Dyrroth": "https://i.imgur.com/s7fMChq.png",
"Wanwan": "https://i.imgur.com/KbtrVJO.png",
"Beatrix": "https://i.imgur.com/zTwq5Ky.png",
"Aldous": "https://i.imgur.com/VXhKPWh.png",
"Mathilda": "https://i.imgur.com/yTlMj1Z.png",
"Ixia": "https://i.imgur.com/8MBmZB5.png",
"Belerick": "https://i.imgur.com/y7JIAR8.png",
"Aamon": "https://i.imgur.com/c00MQpK.png",
"Xborg": "https://i.imgur.com/9kUt0UM.png",
"Pharsa": "https://i.imgur.com/hptVtVX.png",
"Valir": "https://i.imgur.com/hm7AT3g.png",
"Nana": "https://i.imgur.com/8iYA0mD.png",
"Alpha": "https://i.imgur.com/q51CUri.png",
"Yve": "https://i.imgur.com/O0ojzAG.png",
"Franco": "https://i.imgur.com/xVhY8cR.png",
"Kadita": "https://i.imgur.com/dOaM8DZ.png",
"Minsitthar": "https://i.imgur.com/LYb89tF.png",
"Brody": "https://i.imgur.com/BRzmcCz.png",
"Alucard": "https://i.imgur.com/3CnEK0O.png",
"Gatotkaca": "https://i.imgur.com/4nHDoNr.png",
"Sun": "https://i.imgur.com/zS4kDSi.png",
"Alice": "https://i.imgur.com/7C43cD1.png",
"Benedetta": "https://i.imgur.com/fotdI4V.png",
"Natalia": "https://i.imgur.com/cIKLxiv.png",
"Hilda": "https://i.imgur.com/u5I8Zpn.png",
"Argus": "https://i.imgur.com/H0SvFsP.png",
"Rafaela": "https://i.imgur.com/kGmWjYj.png",
"Esmeralda": "https://i.imgur.com/rB09HDl.png",
"Terizla": "https://i.imgur.com/LnwD5CM.png",
"Silvanna": "https://i.imgur.com/KM2w9j1.png",
"Clint": "https://i.imgur.com/7FypXeP.png",
"Helcurt": "https://i.imgur.com/IZNcoIp.png",
"Ling": "https://i.imgur.com/Fs468yM.png"

}
/* match template

      //week 2 friday match 1 (GMXK 0-2 VMS)
  {
        teamA: "",
        teamB: "",
        games: [
            { //game 1
        winner: "",
        bans: ["","","","","","","", "","", ""],
        players: [
          // teamA Players
          { name: "",  hero: "", kills: , deaths: , assists:  }, //gold
          { name: "",  hero: "", kills: , deaths: , assists:  }, //jungle
          { name: "",  hero: "", kills: , deaths: , assists:  }, //midlane
          { name: "",  hero: "", kills: , deaths: , assists:  }, //exp
          { name: "",  hero: "", kills: , deaths: , assists: }, //roam

          // teamB Players
          { name: "",  hero: "", kills: , deaths: , assists:  }, //gold
          { name: "",  hero: "", kills: , deaths: , assists:  }, //jungle
          { name: "",  hero: "", kills: , deaths: , assists:  }, //midlane
          { name: "",  hero: "", kills: , deaths: , assists:  }, //exp
          { name: "",  hero: "", kills: , deaths: , assists: }, //roam
        ], objectives: {
          lord: { "TeamA": , "TeamB":  },
          turtle: { "TeamA": , "TeamB":  },
          tower: { "TeamA": , "TeamB":  }
        }
      },
            { //game 2
        winner: "",
        bans: ["","","","","","","", "","", ""],
        players: [
          // teamA Players
          { name: "",  hero: "", kills: , deaths: , assists:  }, //gold
          { name: "",  hero: "", kills: , deaths: , assists:  }, //jungle
          { name: "",  hero: "", kills: , deaths: , assists:  }, //midlane
          { name: "",  hero: "", kills: , deaths: , assists:  }, //exp
          { name: "",  hero: "", kills: , deaths: , assists: }, //roam

          // teamB Players
          { name: "",  hero: "", kills: , deaths: , assists:  }, //gold
          { name: "",  hero: "", kills: , deaths: , assists:  }, //jungle
          { name: "",  hero: "", kills: , deaths: , assists:  }, //midlane
          { name: "",  hero: "", kills: , deaths: , assists:  }, //exp
          { name: "",  hero: "", kills: , deaths: , assists: }, //roam
        ], objectives: {
          lord: { "TeamA": , "TeamB":  },
          turtle: { "TeamA": , "TeamB":  },
          tower: { "TeamA": , "TeamB":  }
        }
      },
    ]},
*/

// MPL MY S16 matches array
let matches = [
  { //week 1 saturday match 1 (MV 2-0 VMS)
    teamA: "Monster Vicious",
    teamB: "Team Vamos",
    games: [
      { //game 1
        winner: "Monster Vicious",
        bans: ["Cici","Phoveus","Baxia","Ruby","Esmeralda","Fanny","Wanwan", "Lancelot","Zhuxin", "Pharsa"],
        players: [
          // Monster Vicious Players
          { name: "Rough",  hero: "Harith", kills: 3, deaths: 0, assists: 7 },
          { name: "Unii",  hero: "Fredrinn", kills: 3, deaths: 0, assists: 8 },
          { name: "Bondolz",  hero: "Yve", kills: 2, deaths: 0, assists: 12 },
          { name: "Momo",  hero: "Arlott", kills: 6, deaths: 1, assists: 5 },
          { name: "Lyoni",  hero: "Chip", kills: 0, deaths: 1, assists: 12},

          // Team Vamos Players
          { name: "Natco",  hero: "Claude", kills: 0, deaths: 3, assists: 0 },
          { name: "Chibi",  hero: "Yi Sun-Shin", kills: 2, deaths: 3, assists: 0 },
          { name: "Clawkun",  hero: "Kimmy", kills: 0, deaths: 2, assists: 2 },
          { name: "Gojes",  hero: "Uranus", kills: 0, deaths: 2, assists: 0 },
          { name: "Xorn",  hero: "Hylos", kills: 0, deaths: 4, assists: 0}
        ], objectives: {
          lord: { "Monster Vicious": 1, "Team Vamos": 0 },
          turtle: { "Monster Vicious": 3, "Team Vamos": 0 },
          tower: { "Monster Vicious": 7, "Team Vamos": 0 }
        }
      },
      { //game 2
        winner: "Monster Vicious",
        bans: ["Cici","Kimmy","Baxia","Ruby","Uranus","Fanny","Wanwan", "Kalea","Chou", "Yve"],
        players: [
          // Monster Vicious Players
          { name: "Rough",  hero: "Esmeralda", kills: 4, deaths: 0, assists: 8 },
          { name: "Unii",  hero: "Yi Sun-Shin", kills: 4, deaths: 0, assists: 11 },
          { name: "Bondolz",  hero: "Zhuxin", kills: 8, deaths: 0, assists: 10 },
          { name: "Momo",  hero: "Phoveus", kills: 2, deaths: 0, assists: 10 },
          { name: "Lyoni",  hero: "Hylos", kills: 0, deaths: 2, assists: 16},

          // Team Vamos Players
          { name: "Natco",  hero: "Harith", kills: 1, deaths: 4, assists: 1 },
          { name: "Chibi",  hero: "Lancelot", kills: 0, deaths: 5, assists: 2 },
          { name: "Clawkun",  hero: "Aurora", kills: 1, deaths: 2, assists: 1 },
          { name: "Gojes", hero: "Arlott", kills: 0, deaths: 3, assists: 0 },
          { name: "Xorn",  hero: "Gatotkaca", kills: 0, deaths: 4, assists: 1}
        ], objectives: {
          lord: { "Monster Vicious": 1, "Team Vamos": 0 },
          turtle: { "Monster Vicious": 3, "Team Vamos": 0 },
          tower: { "Monster Vicious": 8, "Team Vamos": 1 }
        }
      },
]},  
      //week 1 saturday match 2 (AERO 0-2 UNT)
  {
        teamA: "AERO Esports",
        teamB: "Untitled",
        games: [
            { //game 1
        winner: "Untitled",
        bans: ["Fredrinn","Arlott","Baxia","Yi Sun-Shin","Gatotkaca","Fanny","Wanwan", "Lancelot","Grock", "Uranus"],
        players: [
          // AERO Esports Players
          { name: "Kusey",  hero: "Harith", kills: 1, deaths: 2, assists: 0 },
          { name: "Hazle",  hero: "Joy", kills: 2, deaths: 3, assists: 3 },
          { name: "Kyym",  hero: "Selena", kills: 1, deaths: 2, assists: 2 },
          { name: "Smooth",  hero: "Phoveus", kills: 0, deaths: 6, assists: 0 },
          { name: "Zqeef",  hero: "Chou", kills: 1, deaths: 4, assists: 3},

          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 7, deaths: 1, assists: 2 },
          { name: "Keymin",  hero: "Hayabusa", kills: 4, deaths: 2, assists: 6 },
          { name: "Stowm",  hero: "Zhuxin", kills: 1, deaths: 1, assists: 11 },
          { name: "Sizkaa",  hero: "Lapu-Lapu", kills: 2, deaths: 0, assists: 7 },
          { name: "Rasy",  hero: "Hylos", kills: 3, deaths: 1, assists: 11}
        ], objectives: {
          lord: { "AERO Esports": 0, "Untitled": 1 },
          turtle: { "AERO Esports": 2, "Untitled": 1 },
          tower: { "AERO Esports": 3, "Untitled": 7 }
        }
      },
            { //game 2
        winner: "Untitled",
        bans: ["Chou","Arlott","Baxia","Yi Sun-Shin","Joy","Fanny","Wanwan", "Lancelot","Hayabusa", "Benedetta"],
        players: [
          // AERO Esports Players
          { name: "Kusey",  hero: "Claude", kills: 2, deaths: 4, assists: 7 },
          { name: "Hazle",  hero: "Akai", kills: 5, deaths: 6, assists: 6 },
          { name: "Kyym",  hero: "Yve", kills: 1, deaths: 5, assists: 15 },
          { name: "Smooth",  hero: "Uranus", kills: 8, deaths: 2, assists: 5 },
          { name: "Zqeef",  hero: "Hylos", kills: 0, deaths: 8, assists: 13},

          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 14, deaths: 0, assists: 6 },
          { name: "Keymin",  hero: "Fredrinn", kills: 3, deaths: 5, assists: 14 },
          { name: "Stowm",  hero: "Zhuxin", kills: 4, deaths: 2, assists: 17 },
          { name: "Sizkaa",  hero: "Masha", kills: 4, deaths: 3, assists: 8 },
          { name: "Rasy",  hero: "Chip", kills: 0, deaths: 6, assists: 17}
        ], objectives: {
          lord: { "AERO Esports": 0, "Untitled": 2 },
          turtle: { "AERO Esports": 2, "Untitled": 1 },
          tower: { "AERO Esports": 5, "Untitled": 6 }
        }
      },
    ]},
  {          //week 1 saturday match 3 (SRG 2-1 HB)
                teamA: "Selangor Red Giants",
                teamB: "Homebois",
                games: [
            { //game 1
        winner: "Selangor Red Giants",
        bans: ["Fredrinn","Arlott","Baxia","Cici","Gloo","Pharsa","Wanwan", "Lancelot","Kalea", "Zhuxin"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Ruby", kills: 3, deaths: 2, assists: 8 },
          { name: "Sekys",  hero: "Yi Sun-Shin", kills: 4, deaths: 0, assists: 7 },
          { name: "Stormie",  hero: "Luoyi", kills: 4, deaths: 0, assists: 7 },
          { name: "Kramm",  hero: "Esmeralda", kills: 6, deaths: 0, assists: 4 },
          { name: "Yums",  hero: "Chou", kills: 1, deaths: 3, assists: 6},

          // Homebois Players
          { name: "Melqt",  hero: "Harith", kills: 0, deaths: 3, assists: 4 },
          { name: "Eyymal",  hero: "Fanny", kills: 0, deaths: 3, assists: 3 },
          { name: "Izanami",  hero: "Kimmy", kills: 1, deaths: 6, assists: 4 },
          { name: "Rezza",  hero: "Phoveus", kills: 2, deaths: 2, assists: 1 },
          { name: "Cayden",  hero: "Gatotkaca", kills: 2, deaths: 4, assists: 1}
        ], objectives: {
          lord: { "Selangor Red Giants": 1, "Homebois": 0 },
          turtle: { "Selangor Red Giants": 3, "Homebois": 0 },
          tower: { "Selangor Red Giants": 8, "Homebois": 0 }
        }
      },
    
            { //game 2
        winner: "Homebois",
        bans: ["Valentina","Lunox","Baxia","Harith","Esmeralda","Fanny","Wanwan", "Cici","Grock", "Zhuxin"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Lapu-Lapu", kills: 2, deaths: 3, assists: 2 },
          { name: "Sekys",  hero: "Yi Sun-Shin", kills: 6, deaths: 4, assists: 4 },
          { name: "Stormie", hero: "Kagura", kills: 2, deaths: 2, assists: 7 },
          { name: "Kramm",  hero: "Phoveus", kills: 0, deaths: 1, assists: 3 },
          { name: "Yums",  hero: "Gatotkaca", kills: 1, deaths: 2, assists: 8},

          // Homebois Players
          { name: "Melqt",  hero: "Moskov", kills: 3, deaths: 1, assists: 4 },
          { name: "Eyymal",  hero: "Benedetta", kills: 2, deaths: 2, assists: 8 },
          { name: "Izanami",  hero: "Kimmy", kills: 3, deaths: 0, assists: 3 },
          { name: "Rezza",  hero: "Hilda", kills: 3, deaths: 3, assists: 6 },
          { name: "Cayden",  hero: "Kalea", kills: 1, deaths: 5, assists: 5}
        ], objectives: {
          lord: { "Selangor Red Giants": 1, "Homebois": 0 },
          turtle: { "Selangor Red Giants": 3, "Homebois": 0 },
          tower: { "Selangor Red Giants": 8, "Homebois": 0 }
        }
      },
            { //game 3
        winner: "Selangor Red Giants",
        bans: ["Fredrinn","Arlott","Zhuxin","Selena","Luoyi","Fanny","Wanwan", "Cici","Grock", "Kalea"],
        players: [
                // Selangor Red Giants Players
          { name: "Innocent",  hero: "Ruby", kills: 3, deaths: 2, assists: 8},
          { name: "Sekys",  hero: "Yi Sun-Shin", kills: 4, deaths: 0, assists: 7},
          { name: "Stormie", hero: "Luoyi", kills: 4, deaths: 0, assists: 7 },
          { name: "Kramm",  hero: "Esmeralda", kills: 6, deaths: 0, assists: 4 },
          { name: "Yums",  hero: "Chou", kills: 1, deaths: 3, assists: 6, },

          // Homebois Players
          { name: "Melqt",  hero: "Harith", kills: 0, deaths: 3, assists: 4 },
          { name: "Eyymal",  hero: "Fanny", kills: 0, deaths: 3, assists: 3 },
          { name: "Izanami",  hero: "Kimmy", kills: 1, deaths: 6, assists: 4 },
          { name: "Rezza",  hero: "Phoveus", kills: 2, deaths: 2, assists: 1 },
          { name: "Cayden",  hero: "Gatotkaca", kills: 2, deaths: 4, assists: 1}
        ], objectives: {
          lord: { "Selangor Red Giants": 1, "Homebois": 0 },
          turtle: { "Selangor Red Giants": 3, "Homebois": 0 },
          tower: { "Selangor Red Giants": 8, "Homebois": 0 }
        }
      },
  ]},
            //week 1 sunday match 1 (TR 2-0 TDK)
{               teamA: "Team Rey",
                teamB: "Todak",
                games: [
            { //game 1
        winner: "Team Rey",
        bans: ["Lancelot","Fanny","Zhuxin","Chip","Valentina","Cici","Kalea", "Arlott","Akai", "Hayabusa"],
        players: [
          // Team Rey Players
          { name: "Jowm",  hero: "Moskov", kills: 8, deaths: 1, assists: 6 },
          { name: "Duskk",  hero: "Fredrinn", kills: 2, deaths: 3, assists: 9 },
          { name: "Zakqt",  hero: "Pharsa", kills: 1, deaths: 1, assists: 11 },
          { name: "Der",  hero: "Lapu-Lapu", kills: 3, deaths: 3, assists: 10 },
          { name: "NovaXCobar",  hero: "Kaja", kills: 1, deaths: 4, assists: 9},

          // Todak Players
          { name: "Loleal",  hero: "Wanwan", kills: 4, deaths: 3, assists: 5 },
          { name: "Zahyed",  hero: "Baxia", kills: 0, deaths: 5, assists: 9 },
          { name: "ZaimSempoi", hero: "Selena", kills: 4, deaths: 1, assists: 4 },
          { name: "Fawndeer",  hero: "Phoveus", kills: 4, deaths: 4, assists: 5 },
          { name: "Dreams", hero: "Khaleed", kills: 0, deaths: 2, assists: 8}
        ], objectives: {
          lord: { "Team Rey": 3, "Todak": 0 },
          turtle: { "Team Rey": 2, "Todak": 1 },
          tower: { "Team Rey": 9, "Todak": 4 }
        }
      },
            { //game 2
        winner: "Team Rey",
        bans: ["Lancelot","Fanny","Wanwan","Ruby","Harith","Cici","Arlott", "Pharsa","Kalea", "Kimmy"],
        players: [
          // Team Rey Players
          { name: "Jowm",  hero: "Moskov", kills: 1, deaths: 0, assists: 5 },
          { name: "Duskk",  hero: "Fredrinn", kills: 3, deaths: 1, assists: 2 },
          { name: "Zakqt",  hero: "Valentina", kills: 1, deaths: 0, assists: 7 },
          { name: "Der",  hero: "Lapu-Lapu", kills: 1, deaths: 3, assists: 4 },
          { name: "NovaXCobar",  hero: "Chou", kills: 3, deaths: 0, assists: 2},

          // Todak Players
          { name: "Loleal",  hero: "Claude", kills: 0, deaths: 1, assists: 2},
          { name: "Zahyed",  hero: "Yi Sun-Shin", kills: 2, deaths: 2, assists: 2 },
          { name: "ZaimSempoi",  hero: "Zhuxin", kills: 2, deaths: 1, assists: 2 },
          { name: "Fawndeer",  hero: "Esmeralda", kills: 0, deaths: 2, assists: 2 },
          { name: "Dreams",  hero: "Gatotkaca", kills: 0, deaths: 3, assists: 4}
        ], objectives: {
          lord: { "Team Rey": 1, "Todak": 0 },
          turtle: { "Team Rey": 1, "Todak": 2 },
          tower: { "Team Rey": 7, "Todak": 2 }
        }
      },
    ]},
            //week 1 sunday match 2 (CG 2-0 GMXK)
{               teamA: "CG Esports",
                teamB: "GAMESMY Kelantan",
                games: [
            { //game 1
        winner: "CG Esports",
        bans: ["Phoveus","Arlott","Hayabusa","Moskov","Granger","Wanwan","Lancelot", "Pharsa","Lapu-Lapu", "Kadita"],
        players: [
          // CG Esports Players
          { name: "Amzziq",  hero: "Harith", kills: 5, deaths: 1, assists: 3 },
          { name: "Gary",  hero: "Baxia", kills: 4, deaths: 3, assists: 5 },
          { name: "Ciku",  hero: "Xavier", kills: 0, deaths: 2, assists: 6 },
          { name: "Ye3",  hero: "Paquito", kills: 1, deaths: 2, assists: 5 },
          { name: "Valenz",  hero: "Kalea", kills: 0, deaths: 1, assists: 5},

          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Bruno", kills: 2, deaths: 1, assists: 3},
          { name: "Jaja",  hero: "Fredrinn", kills: 1, deaths: 2, assists: 6 },
          { name: "Maima",  hero: "Kimmy", kills: 3, deaths: 4, assists: 3 },
          { name: "Munster",  hero: "Cici", kills: 3, deaths: 2, assists: 4 },
          { name: "Matdinz",  hero: "Mathilda", kills: 0, deaths: 1, assists: 7}
        ], objectives: {
          lord: { "CG Esports": 2, "GAMESMY Kelantan": 0 },
          turtle: { "CG Esports": 3, "GAMESMY Kelantan": 0 },
          tower: { "CG Esports": 7, "GAMESMY Kelantan": 2 }
        }
      },
    
            { //game 2
        winner: "CG Esports",
        bans: ["Wanwan","Arlott","Baxia","Grock","Moskov","Fanny","Cici", "Kimmy","Ruby", "Pharsa"],
        players: [
          // CG Esports Players
          { name: "Amzziq",  hero: "Granger", kills: 4, deaths: 0, assists: 6 },
          { name: "Gary",  hero: "Yi Sun-Shin", kills: 3, deaths: 0, assists: 11 },
          { name: "Ciku",  hero: "Odette", kills: 6, deaths: 1, assists: 4 },
          { name: "Ye3",  hero: "Esmeralda", kills: 2, deaths: 0, assists: 4 },
          { name: "Valenz",  hero: "Kalea", kills: 0, deaths: 0, assists: 12},

          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Harith", kills: 0, deaths: 0, assists: 0 },
          { name: "Jaja",  hero: "Lancelot", kills: 0, deaths: 3, assists: 1 },
          { name: "Maima",  hero: "Zhuxin", kills: 0, deaths: 3, assists: 1 },
          { name: "Munster",  hero: "Uranus", kills: 0, deaths: 4, assists: 0 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 1, deaths: 5, assists: 0}
        ], objectives: {
          lord: { "CG Esports": 1, "GAMESMY Kelantan": 0 },
          turtle: { "CG Esports": 3, "GAMESMY Kelantan": 0 },
          tower: { "CG Esports": 7, "GAMESMY Kelantan": 0 }
        }
      },
    ]},
            //week 1 SUNDAY match 3 (VMS 2-0 HB)
{               teamA: "Team Vamos",
                teamB: "Homebois",
                games: [
            { //game 1
        winner: "Team Vamos",
        bans: ["Baxia","Wanwan","Fanny","Esmeralda","Phoveus","Cici","Zhuxin", "Harith","Beatrix", "Luoyi"],
        players: [
          // Team Vamos Players
          // Team Vamos Players
          { name: "Natco", hero: "Granger", kills: 3, deaths: 1, assists: 5 },
          { name: "Chibi", hero: "Lancelot", kills: 3, deaths: 0, assists: 7 },
          { name: "Clawkun",  hero: "Pharsa", kills: 2, deaths: 2, assists: 6 },
          { name: "Gojes", hero: "Hilda", kills: 4, deaths: 2, assists: 6 },
          { name: "Xorn",  hero: "Kalea", kills: 1, deaths: 4, assists: 9},

          // Homebois Players
          { name: "Zippyqt",  hero: "Moskov", kills: 0, deaths: 2, assists: 3 },
          { name: "Eyymal",  hero: "Yi Sun-Shin", kills: 0, deaths: 2, assists: 8},
          { name: "Izanami",  hero: "Selena", kills: 3, deaths: 3, assists: 6 },
          { name: "Rezza",  hero: "Badang", kills: 4, deaths: 3, assists: 3 },
          { name: "Cayden",  hero: "Gatotkaca", kills: 2, deaths: 3, assists: 7}
        ], objectives: {
          lord: { "Team Vamos": 1, "Homebois": 0 },
          turtle: { "Team Vamos": 2, "Homebois": 1 },
          tower: { "Team Vamos": 9, "Homebois": 0 }
        }
      },
            { //game 2
        winner: "Team Vamos",
        bans: ["Fanny","Zhuxin","Baxia","Kagura","Valentina","Cici","Yi Sun-Shin", "Wanwan","Phoveus", "Arlott"],
        players: [
          // Team Vamos Players
          { name: "Natco",  hero: "Granger", kills: 6, deaths: 0, assists: 6 },
          { name: "Chibi",  hero: "Lancelot", kills: 1, deaths: 2, assists: 13 },
          { name: "Clawkun",  hero: "Pharsa", kills: 7, deaths: 0, assists: 7 },
          { name: "Gojes",  hero: "Esmeralda", kills: 3, deaths: 1, assists: 8 },
          { name: "Xorn",  hero: "Kalea", kills: 0, deaths: 1, assists: 10},

          // Homebois Players
          { name: "Zippyqt",  hero: "Harith", kills: 1, deaths: 3, assists: 0 },
          { name: "Eyymal",  hero: "Benedetta", kills: 1, deaths: 3, assists: 1 },
          { name: "Izanami",  hero: "Lunox", kills: 2, deaths: 1, assists: 2 },
          { name: "Rezza",  hero: "Gloo", kills: 0, deaths: 4, assists: 2 },
          { name: "Cayden",  hero: "Gatotkaca", kills: 0, deaths: 6, assists: 3}
        ], objectives: {
          lord: { "Team Vamos": 1, "Homebois": 0 },
          turtle: { "Team Vamos": 2, "Homebois": 0 },
          tower: { "Team Vamos": 9, "Homebois": 0 }
        }
      },
    ]},

      //week 2 friday match 1 (GMXK 0-2 VMS)
  {
        teamA: "GAMESMY Kelantan",
        teamB: "Team Vamos",
        games: [
            { //game 1
        winner: "Team Vamos",
        bans: ["Arlott","Wanwan","Baxia","Chou","Granger","Kalea","Phoveus", "Zhuxin","Moskov", "Fredrinn"],
        players: [
          // GMXK  Players
          { name: "Immqt",  hero: "Ruby", kills:0 , deaths:3 , assists:5  },
          { name: "Jaja",  hero: "Yi Sun-Shin", kills:6 , deaths:2 , assists:3  },
          { name: "Maima",  hero: "Kimmy", kills:2 , deaths: 2, assists: 5 },
          { name: "Munster",  hero: "Terizla", kills:0 , deaths: 6, assists:5  },
          { name: "Matdinz",  hero: "Hilda", kills:1 , deaths: 3, assists:5 },

          // VMS Players
          { name: "Natco",  hero: "Bruno", kills: 6 , deaths:3 , assists:5  },
          { name: "Chibi",  hero: "Akai", kills: 0, deaths: 2, assists: 14 },
          { name: "Clawkun",  hero: "Lunox", kills:8 , deaths:2 , assists:6  },
          { name: "Gojes",  hero: "Esmeralda", kills:0 , deaths:2 , assists: 10 },
          { name: "Xorn",  hero: "Fanny", kills:2 , deaths:0 , assists:4 }


        ], objectives: {
          lord: { "GMAMESMY Kelantan":0 , "Team Vamos":2  },
          turtle: { "GAMESMY Kelantan":0 , "Team Vamos":3  },
          tower: { "GAMESMY Kelantan":4 , "Team Vamos":9  }
        }
      },
            { //game 2
        winner: "Team Vamos",
        bans: ["Arlott","Zhuxin","Pharsa","Beatrix","Kadita","Wanwan","Fanny", "Phoveus","Ruby", "Esmeralda"],
        players: [
          // GMXK  Players
          { name: "Immqt",  hero: "Moskov", kills:0 , deaths:2 , assists:2  },
          { name: "Jaja",  hero: "Baxia", kills:0 , deaths:5 , assists:5  },
          { name: "Maima",  hero: "Kimmy", kills:0 , deaths: 1, assists: 4 },
          { name: "Munster",  hero: "Lapu-Lapu", kills:4 , deaths: 2, assists:1  },
          { name: "Matdinz",  hero: "Franco", kills:1 , deaths: 4, assists:3 },

          // VMS Players
          { name: "Natco",  hero: "Granger", kills: 9 , deaths:0 , assists:3  },
          { name: "Chibi",  hero: "Lancelot", kills: 3, deaths: 0, assists: 5 },
          { name: "Clawkun",  hero: "Lunox", kills:2 , deaths:1 , assists:12 },
          { name: "Gojes",  hero: "Cici", kills:0 , deaths:1 , assists: 8 },
          { name: "Xorn",  hero: "Kalea", kills:0 , deaths:3 , assists:8 }

        ], objectives: {
          lord: { "GMAMESMY Kelantan":1 , "Team Vamos":1  },
          turtle: { "GAMESMY Kelantan":1 , "Team Vamos":2  },
          tower: { "GAMESMY Kelantan":3 , "Team Vamos":9  }
        }
      },
    ]},
      //week 2 friday match 2 (unt 1-2 tdk)
  {
        teamA: "Untitled",
        teamB: "Todak",
        games: [
            { //game 1
        winner: "Untitled",
        bans: ["Fredrinn","Chip","Wanwan","Hayabusa","Baxia","Lancelot","Kalea", "Angela","Yi Sun-Shin", "Fanny"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 8, deaths:0 , assists:2  }, //gold
          { name: "Keymin",  hero: "Guinevere", kills:2 , deaths:3 , assists:7  }, //jungle
          { name: "Stowm",  hero: "Zhuxin", kills:1 , deaths: 0, assists:10  }, //midlane
          { name: "Sizkaa",  hero: "Lapu-Lapu", kills:1 , deaths:2 , assists:9  }, //exp
          { name: "Rasy",  hero: "Grock", kills:0 , deaths:3 , assists:9 }, //roam

          // Todak Players
          { name: "Loleal",  hero: "Harith", kills:2 , deaths: 3, assists:5  }, //gold
          { name: "Zahyed",  hero: "Martis", kills:2 , deaths: 1, assists:3  }, //jungle
          { name: "ZaimSempoi",  hero: "Pharsa", kills:2 , deaths:1 , assists:5  }, //midlane
          { name: "Fawndeer",  hero: "Cici", kills:2 , deaths: 2, assists:5  }, //exp
          { name: "Dreams",  hero: "Gatotkaca", kills:0 , deaths:5 , assists:2 }, //roam
        ], objectives: {
          lord: { "Untitled":1 , "Todak":0  },
          turtle: { "Untitled": 2, "Todak": 0 },
          tower: { "Untitled": 9, "Todak":1  }
        }
      },
            { //game 2
        winner: "Todak",
        bans: ["Fredrinn","Chip","Wanwan","Uranus","Harith","Beatrix","Granger", "Arlott","Yi Sun-Shin", "Fanny"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Irithel", kills: 2, deaths:2 , assists:3  }, //gold
          { name: "Keymin",  hero: "Joy", kills:2 , deaths:4 , assists:2  }, //jungle
          { name: "Stowm",  hero: "Angela", kills:2 , deaths: 0, assists:4  }, //midlane
          { name: "Sizkaa",  hero: "Cici", kills:1 , deaths:2 , assists:4  }, //exp
          { name: "Rasy",  hero: "Gloo", kills:0 , deaths:4 , assists:4 }, //roam

          // Todak Players
          { name: "Loleal",  hero: "Karrie", kills:4 , deaths: 1, assists:5  }, //gold
          { name: "Zahyed",  hero: "Baxia", kills:0 , deaths: 1, assists:6  }, //jungle
          { name: "ZaimSempoi",  hero: "Kimmy", kills:8 , deaths:2 , assists:0  }, //midlane
          { name: "Fawndeer",  hero: "Ruby", kills:0 , deaths: 1, assists:8  }, //exp
          { name: "Dreams",  hero: "Franco", kills:0 , deaths:2 , assists:10 }, //roam
        ], objectives: {
          lord: { "Untitled":1 , "Todak":1  },
          turtle: { "Untitled": 2, "Todak": 1 },
          tower: { "Untitled": 5, "Todak":7  }
        }
      },
              { //game 3
        winner: "Todak",
        bans: ["Fredrinn","Chip","Wanwan","Yve","Natalia","Guinevere","Angela", "Franco","Hayabusa", "Fanny"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 0, deaths:2 , assists:0  }, //gold
          { name: "Keymin",  hero: "Akai", kills:0 , deaths:3 , assists:2  }, //jungle
          { name: "Stowm",  hero: "Zhuxin", kills:0 , deaths: 1, assists:2  }, //midlane
          { name: "Sizkaa",  hero: "Cici", kills:0 , deaths:5 , assists:1  }, //exp
          { name: "Rasy",  hero: "Khaleed", kills:2 , deaths:4 , assists:0 }, //roam

          // Todak Players
          { name: "Loleal",  hero: "Harith", kills:2 , deaths: 0, assists:9  }, //gold
          { name: "Zahyed",  hero: "Baxia", kills:2 , deaths: 1, assists:4  }, //jungle
          { name: "ZaimSempoi",  hero: "Kimmy", kills:6 , deaths:0 , assists:5  }, //midlane
          { name: "Fawndeer",  hero: "Lapu-Lapu", kills:4 , deaths: 1, assists:8  }, //exp
          { name: "Dreams",  hero: "Mathilda", kills:1 , deaths:0 , assists:13 }, //roam
        ], objectives: {
          lord: { "Untitled":0 , "Todak":2  },
          turtle: { "Untitled": 1, "Todak": 2 },
          tower: { "Untitled": 0, "Todak":8  }
        }
      },
    ]},
      //week 2 saturday match 2 (cg 2-0 unt)
  {
        teamA: "CG Esports",
        teamB: "Untitled",
        games: [
            { //game 1
        winner: "CG Esports",
        bans: ["Fanny","Kalea","Wanwan","Lancelot","Hayabusa","Kimmy","Hilda", "Angela","Chip", "Fredrinn"],
        players: [
          // cg Players
          { name: "Amzziq",  hero: "Granger", kills: 10, deaths: 2, assists: 2 },
          { name: "Gary",  hero: "Joy", kills: 7, deaths: 5, assists: 9 },
          { name: "Ciku",  hero: "Zhuxin", kills: 1, deaths: 4, assists: 13 },
          { name: "Ye3",  hero: "Gloo", kills: 1, deaths: 0, assists: 13 },
          { name: "Valenz",  hero: "Chou", kills: 0, deaths: 4, assists: 9},

          // Untitled Players
          { name: "Skyzed",  hero: "Harith", kills: 2, deaths:4 , assists:5  }, //gold
          { name: "Keymin",  hero: "Baxia", kills:2 , deaths:2 , assists:7  }, //jungle
          { name: "Stowm",  hero: "Pharsa", kills:3 , deaths: 5, assists:6  }, //midlane
          { name: "Sizkaa",  hero: "Lapu-Lapu", kills:7 , deaths:2 , assists:3 }, //exp
          { name: "Rasy",  hero: "Grock", kills:1 , deaths:6 , assists:8 }, //roam
        ], objectives: {
          lord: { "CG Esports":1 , "Untitled":1  },
          turtle: { "CG Esports":0 , "Untitled":3  },
          tower: { "CG Esports":7 , "Untitled": 5 }
        }
      },
            { //game 2
        winner: "CG Esports",
        bans: ["Fanny","Kalea","Wanwan","Lunox","Chou","Irithel","Hilda", "Zhuxin","Chip", "Fredrinn"],
        players: [
          // CG Players
          { name: "Amzziq",  hero: "Harith", kills: 6, deaths: 0, assists: 7 },
          { name: "Gary",  hero: "Lancelot", kills: 3, deaths: 3, assists: 4 },
          { name: "Ciku",  hero: "Cecilion", kills: 5, deaths: 2, assists: 9 },
          { name: "Ye3",  hero: "Esmeralda", kills: 2, deaths: 1, assists: 6 },
          { name: "Valenz",  hero: "Grock", kills: 0, deaths: 2, assists: 13},

          // Untitled Players
          { name: "Skyzed",  hero: "Natan", kills: 3, deaths:3 , assists:2  }, //gold
          { name: "Keymin",  hero: "Baxia", kills:1 , deaths:4 , assists:4  }, //jungle
          { name: "Stowm",  hero: "Angela", kills:0 , deaths: 1, assists:7  }, //midlane
          { name: "Sizkaa",  hero: "Cici", kills:4 , deaths:4 , assists:1  }, //exp
          { name: "Rasy",  hero: "Helcurt", kills:0 , deaths:4 , assists:1 }, //roam
        ], objectives: {
          lord: { "CG Esports":1 , "Untitled":0  },
          turtle: { "CG Esports": 2, "Untitled":1  },
          tower: { "CG Esports":2 , "Untitled":8  }
        }
      },
    ]},
      //week 2 sat match 2 (hb 0-2 tr)
  {
        teamA: "Homebois",
        teamB: "Team Rey",
        games: [
            { //game 1
        winner: "Homebois",
        bans: ["Baxia","Fredrinn","Moskov","Akai","Yve","Gatotkaca","Hylos", "Angela","Wanwan", "Fanny"],
        players: [
          // Homebois Players
          { name: "Melqt",  hero: "Cici", kills: 7, deaths: 2, assists: 13 },
          { name: "Eyymal",  hero: "Yi Sun-Shin", kills: 8, deaths: 0, assists: 14 },
          { name: "Izanami",  hero: "Zhuxin", kills: 5, deaths: 2, assists: 16 },
          { name: "Rezza",  hero: "Terizla", kills: 4, deaths: 1, assists: 16 },
          { name: "Cayden",  hero: "Khaleed", kills: 3, deaths: 2, assists: 20},

          // Team Rey Players
          { name: "Jowm",  hero: "Harith", kills: 2, deaths: 4, assists: 2 },
          { name: "Duskk",  hero: "Lancelot", kills: 2, deaths: 5, assists: 3 },
          { name: "Zakqt",  hero: "Faramis", kills: 3, deaths: 5, assists: 4 },
          { name: "Der",  hero: "Arlott", kills: 0, deaths: 7, assists: 5 },
          { name: "NovaXCobar",  hero: "Chip", kills: 0, deaths: 6, assists: 5},

        ], objectives: {
          lord: { "Homebois": 1, "Team Rey":1  },
          turtle: { "Homebois": 2, "Team Rey": 0 },
          tower: { "Homebois":9 , "Team Rey":2  }
        }
      },
            { //game 2
        winner: "Homebois",
        bans: ["Fanny","Joy","Baxia","Harith","Phoveus","Guinevere","Akai", "Moskov","Fredrinn", "Angela"],
        players: [
          // Homebois Players
          { name: "Melqt",  hero: "Claude", kills: 5, deaths: 4, assists: 10 },
          { name: "Eyymal",  hero: "Hayabusa", kills: 11, deaths: 2, assists: 5},
          { name: "Izanami",  hero: "Yve", kills: 5, deaths: 4, assists: 15 },
          { name: "Rezza",  hero: "Terizla", kills: 2, deaths: 7, assists: 10 },
          { name: "Cayden",  hero: "Khaleed", kills: 1, deaths: 6, assists: 15},

          // Team Rey Players
          { name: "Jowm",  hero: "Irithel", kills: 6, deaths: 2, assists: 9 },
          { name: "Duskk",  hero: "Lancelot", kills: 4, deaths: 4, assists: 15 },
          { name: "Zakqt",  hero: "Zhuxin", kills: 6, deaths: 5, assists: 12 },
          { name: "Der",  hero: "Arlott", kills: 6, deaths: 5, assists: 13 },
          { name: "NovaXCobar",  hero: "Chip", kills: 1, deaths: 8, assists: 16},

        ], objectives: {
          lord: { "Homebois": 2, "Team Rey":1  },
          turtle: { "Homebois":2 , "Team Rey": 1 },
          tower: { "Homebois":7 , "Team Rey": 6 }
        }
      },
    ]},
      //week 2 SAT match 3 (SRG 2-0 TDK)
  {
        teamA: "Selangor Red Giants",
        teamB: "Todak",
        games: [
            { //game 1
        winner: "Selangor Red Giants",
        bans: ["Zhuxin","Franco","Cici","Chou","Fredrinn","Moskov","Esmeralda", "Fanny","Wanwan", "Lancelot"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Bane", kills: 1, deaths: 1, assists: 8 },
          { name: "Sekys",  hero: "Baxia", kills: 3, deaths: 1, assists: 11 },
          { name: "Stormie",  hero: "Lunox", kills: 8, deaths: 1, assists: 6 },
          { name: "Kramm",  hero: "Paquito", kills: 3, deaths: 1, assists: 5 },
          { name: "Yums",  hero: "Kalea", kills: 2, deaths: 0, assists: 11},


          // Todak Players
          { name: "Loleal",  hero: "Harith", kills:0 , deaths: 4, assists:1  }, //gold
          { name: "Zahyed",  hero: "Martis", kills:3 , deaths: 4, assists:0  }, //jungle
          { name: "ZaimSempoi",  hero: "Angela", kills:0 , deaths:2 , assists:4  }, //midlane
          { name: "Fawndeer",  hero: "Lapu-Lapu", kills:1, deaths: 2, assists:1  }, //exp
          { name: "Dreams",  hero: "Gatotkaca", kills:0 , deaths:5 , assists:2 }, //roam

        ], objectives: {
          lord: { "Selangor Red Giants":1 , "Todak":0  },
          turtle: { "Selangor Red Giants":3 , "Todak":0  },
          tower: { "Selangor Red Giants":7 , "Todak":0  }
        }
      },
            { //game 2
        winner: "Selangor Red Giants",
        bans: ["Kalea","Cici","Fanny","Gatotkaca","Grock","Arlott","Masha", "Zhuxin","Baxia", "Wanwan"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Bane", kills: 6, deaths: 1, assists: 8 },
          { name: "Sekys",  hero: "Yi Sun-Shin", kills: 6, deaths: 1, assists: 9 },
          { name: "Stormie",  hero: "Kimmy", kills: 2, deaths: 1, assists: 13 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills:4, deaths: 1, assists: 10 },
          { name: "Yums",  hero: "Badang", kills:0, deaths: 4, assists: 14},

          // Todak Players
          { name: "Loleal",  hero: "Claude", kills:4, deaths: 2, assists:2  }, //gold
          { name: "Zahyed",  hero: "Fredrinn", kills:2 , deaths: 6, assists:2  }, //jungle
          { name: "ZaimSempoi",  hero: "Yve", kills:1 , deaths:0 , assists:6  }, //midlane
          { name: "Fawndeer",  hero: "Lukas", kills:0 , deaths: 6, assists:5  }, //exp
          { name: "Dreams",  hero: "Chip", kills:1 , deaths:4 , assists:7 }, //roam

        ], objectives: {
          lord: { "Selangor Red Giants":3 , "Todak":0  },
          turtle: { "Selangor Red Giants":2 , "Todak":1  },
          tower: { "Selangor Red Giants":9 , "Todak":2  }
        }
      },
    ]},
      //week 2 sun match 1 (GMXK 1-2 tr)
  {
        teamA: "GAMESMY Kelantan",
        teamB: "Team Rey",
        games: [
            { //game 1
        winner: "Team Rey",
        bans: ["Zhuxin","Moskov","Wanwan","Claude","Grock","Kadita","Kimmy", "Pharsa","Cici", "Fanny"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Ruby", kills: 0, deaths: 3, assists: 4 },
          { name: "Jaja",  hero: "Yi Sun-Shin", kills: 3, deaths: 1, assists: 2 },
          { name: "Maima",  hero: "Cyclops", kills: 1, deaths: 2, assists: 4 },
          { name: "Munster",  hero: "Esmeralda", kills: 0, deaths: 1, assists: 3 },
          { name: "Matdinz",  hero: "Franco", kills: 1, deaths: 3, assists: 4},

          // Team Rey Players
          { name: "Jowm",  hero: "Natan", kills: 4, deaths: 1, assists: 2 },
          { name: "Duskk",  hero: "Fredrinn", kills: 0, deaths: 2, assists: 6 },
          { name: "Zakqt",  hero: "Angela", kills: 0, deaths: 0, assists: 8 },
          { name: "Der",  hero: "Cici", kills: 4, deaths: 0, assists: 6 },
          { name: "NovaXCobar",  hero: "Gatotkaca", kills: 2, deaths: 2, assists: 6},
        ], objectives: {
          lord: { "GAMESMY Kelantan": 1, "Team Rey": 1 },
          turtle: { "GAMESMY Kelantan":1 , "Team Rey": 2 },
          tower: { "GAMESMY Kelantan": 4, "Team Rey":8  }
        }
      },
            { //game 2
        winner: "GAMESMY Kelantan",
        bans: ["Fanny","Joy","Valentina","Cici","Khaleed","Chip","Claude", "Wanwan","Moskov", "Angela"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Minsitthar", kills: 0, deaths: 3, assists: 8 },
          { name: "Jaja",  hero: "Yi Sun-Shin", kills: 5, deaths: 0, assists: 9 },
          { name: "Maima",  hero: "Yve", kills: 6, deaths: 1, assists: 7 },
          { name: "Munster",  hero: "Uranus", kills: 2, deaths: 3, assists: 6 },
          { name: "Matdinz",  hero: "Grock", kills: 1, deaths: 1, assists: 8},

          // Team Rey Players
          { name: "Jowm",  hero: "Harith", kills: 6, deaths: 1, assists: 2 },
          { name: "Duskk",  hero: "Fredrinn", kills: 0, deaths: 4, assists: 4 },
          { name: "Zakqt",  hero: "Zhuxin", kills: 1, deaths: 1, assists: 7 },
          { name: "Der",  hero: "Lapu-Lapu", kills: 1, deaths: 5, assists: 2 },
          { name: "NovaXCobar",  hero: "Arlott", kills: 0, deaths: 3, assists: 4},

        ], objectives: {
          lord: { "GAMESMY Kelantan":3 , "Team Rey":0  },
          turtle: { "GAMESMY Kelantan":3 , "Team Rey":0  },
          tower: { "GAMESMY Kelantan":9 , "Team Rey":3  }
        }
      },
                  { //game 3
        winner: "Team Rey",
        bans: ["Fanny","Joy","Yi Sun-Shin","Grock","Kimmy","Arlott","Chip", "Wanwan","Moskov", "Angela"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Granger", kills: 1, deaths: 1, assists: 0 },
          { name: "Jaja",  hero: "Lancelot", kills: 0, deaths: 3, assists: 2 },
          { name: "Maima",  hero: "Yve", kills: 0, deaths: 3, assists: 2 },
          { name: "Munster",  hero: "Uranus", kills: 0, deaths: 2, assists: 0 },
          { name: "Matdinz",  hero: "Badang", kills: 1, deaths: 6, assists: 0},

          // Team Rey Players
          { name: "Jowm",  hero: "Claude", kills:3, deaths: 0, assists:7 },
          { name: "Duskk",  hero: "Baxia", kills: 1, deaths: 0, assists: 8 },
          { name: "Zakqt",  hero: "Zhuxin", kills: 8, deaths: 0, assists: 5 },
          { name: "Der",  hero: "Esmeralda", kills: 3, deaths: 0, assists: 8 },
          { name: "NovaXCobar",  hero: "Chou", kills: 0, deaths: 2, assists: 10},

        ], objectives: {
          lord: { "GAMESMY Kelantan":0 , "Team Rey": 2 },
          turtle: { "GAMESMY Kelantan":1 , "Team Rey":2  },
          tower: { "GAMESMY Kelantan":0 , "Team Rey": 9 }
        }
      },
    ]},

          //week 2 sun match 2 (cg 2-0 MV)
  {
        teamA: "CG Esports",
        teamB: "Monster Vicious",
        games: [
            { //game 1
        winner: "CG Esports",
        bans: ["Chip","Fanny","Angela","Hayabusa","Lancelot","Grock","Chou", "Baxia","Zhuxin", "Wanwan"],
        players: [
          // cg Players
          { name: "Amzziq",  hero: "Granger", kills: 10, deaths: 0, assists: 6 },
          { name: "Gary",  hero: "Yi Sun-Shin", kills: 5, deaths: 2, assists: 9 },
          { name: "Ciku",  hero: "Lunox", kills: 1, deaths: 3, assists: 13 },
          { name: "Ye3",  hero: "Esmeralda", kills: 2, deaths: 2, assists: 15 },
          { name: "Valenz",  hero: "Kalea", kills: 1, deaths: 1, assists: 14},

          // Monster Vicious Players
          { name: "Rough",  hero: "Harith", kills: 3, deaths: 4, assists: 4 },
          { name: "Unii",  hero: "Lukas", kills: 1, deaths: 3, assists: 4 },
          { name: "Bondolz",  hero: "Kimmy", kills: 2, deaths: 2, assists: 4 },
          { name: "Momo",  hero: "Uranus", kills: 1, deaths: 3, assists: 6 },
          { name: "Lyoni",  hero: "Hilda", kills: 1, deaths: 7, assists: 4},
        ], objectives: {
          lord: { "CG Esports":3 , "Monster Vicious":0  },
          turtle: { "CG Esports":2 , "Monster Vicious":1  },
          tower: { "CG Esports":9 , "Monster Vicious":1  }
        }
      },
            { //game 2
        winner: "CG Esports",
        bans: ["Chip","Fanny","Angela","Granger","Bruno","Grock","Chou", "Esmeralda","Kalea", "Wanwan"],
        players: [
       // cg Players
          { name: "Amzziq",  hero: "Harith", kills: 3, deaths: 0, assists: 2 },
          { name: "Gary",  hero: "Yi Sun-Shin", kills: 2, deaths: 1, assists: 4 },
          { name: "Ciku",  hero: "Zhuxin", kills: 1, deaths: 1, assists: 6 },
          { name: "Ye3",  hero: "Benedetta", kills: 2, deaths: 0, assists: 1 },
          { name: "Valenz",  hero: "Badang", kills: 1, deaths: 3, assists: 5},

          // Monster Vicious Players
          { name: "Rough",  hero: "Natan", kills: 0, deaths: 1, assists: 3 },
          { name: "Unii",  hero: "Lancelot", kills: 2, deaths: 1, assists: 2 },
          { name: "Bondolz",  hero: "Pharsa", kills: 1, deaths: 3, assists: 3 },
          { name: "Momo",  hero: "Uranus", kills: 1, deaths: 2, assists: 2 },
          { name: "Lyoni",  hero: "Gatotkaca", kills: 1, deaths: 2, assists: 3},
        ], objectives: {
          lord: { "CG Esports":1 , "Monster Vicious":0  },
          turtle: { "CG Esports":3 , "Monster Vicious":0  },
          tower: { "CG Esports":5 , "Monster Vicious":5  }
        }
      },
    ]},

      //week 2 sun match 3 (AERO 1-2 VMS)
  {
        teamA: "AERO Esports",
        teamB: "Team Vamos",
        games: [
            { //game 1
        winner: "AERO Esports",
        bans: ["Baxia","Zhuxin","Angela","Harith","Chou","Karrie","Pharsa", "Wanwan","Yi Sun-Shin", "Fanny"],
        players: [
          // AERO Esports Players
          { name: "Kusey",  hero: "Granger", kills: 8, deaths: 0, assists: 3 },
          { name: "Hazle",  hero: "Joy", kills: 2, deaths: 0, assists: 6 },
          { name: "Kyym",  hero: "Luoyi", kills: 2, deaths: 0, assists: 7 },
          { name: "Smooth",  hero: "Uranus", kills: 0, deaths: 0, assists: 6 },
          { name: "Zqeef",  hero: "Kalea", kills: 1, deaths: 0, assists: 7},

          // VMS Players
          { name: "Natco",  hero: "Bruno", kills: 0 , deaths:2 , assists:0  },
          { name: "Chibi",  hero: "Lancelot", kills: 0, deaths: 4, assists: 0 },
          { name: "Clawkun",  hero: "Lunox", kills:0 , deaths:1 , assists:0 },
          { name: "Gojes",  hero: "Esmeralda", kills:0 , deaths:3 , assists: 0 },
          { name: "Xorn",  hero: "Gatotkaca", kills:0 , deaths:3 , assists:0 },
        ], objectives: {
          lord: { "AERO Esports":1 , "Team Vamos":0  },
          turtle: { "AERO Esports":3 , "Team Vamos":0  },
          tower: { "AERO Esports":7 , "Team Vamos":0  }
        }
      },
            { //game 2
        winner: "Team Vamos",
        bans: ["Fanny","Yi Sun-Shin","Kalea","Chou","Khaleed","Harith","Moskov", "Wanwan","Zhuxin", "Baxia"],
        players: [
          // AERO Esports Players
          { name: "Kusey",  hero: "Granger", kills: 0, deaths: 2, assists: 2 },
          { name: "Hazle",  hero: "Joy", kills: 3, deaths: 5, assists: 3 },
          { name: "Kyym",  hero: "Angela", kills: 1, deaths: 5, assists: 6 },
          { name: "Smooth",  hero: "Uranus", kills: 3, deaths: 3, assists: 0 },
          { name: "Zqeef",  hero: "Badang", kills: 0, deaths: 6, assists: 3},
          // VMS Players
          { name: "Natco",  hero: "Irithel", kills: 2 , deaths:3 , assists:11  },
          { name: "Chibi",  hero: "Hayabusa", kills: 9, deaths: 1, assists: 7 },
          { name: "Clawkun",  hero: "Pharsa", kills:3 , deaths:1 , assists:8 },
          { name: "Gojes",  hero: "Cici", kills:4 , deaths:1 , assists: 8 },
          { name: "Xorn",  hero: "Chip", kills:1 , deaths:1 , assists:14 },
        ], objectives: {
          lord: { "AERO Esports":0 , "Team Vamos":2  },
          turtle: { "AERO Esports":0 , "Team Vamos":3  },
          tower: { "AERO Esports":3 , "Team Vamos":7  }
        }
      },
            { //game 2
        winner: "Team Vamos",
        bans: ["Baxia","Chip","Zhuxin","Valentina","Lunox","Uranus","Phoveus", "Yi Sun-Shin","Wanwan", "Fanny"],
        players: [
          // AERO Esports Players
          { name: "Kusey",  hero: "Harith", kills: 1, deaths: 1, assists: 3 },
          { name: "Hazle",  hero: "Lancelot", kills: 3, deaths: 2, assists: 3 },
          { name: "Kyym",  hero: "Novaria", kills: 4, deaths: 0, assists: 5 },
          { name: "Smooth",  hero: "Ruby", kills: 2, deaths: 4, assists: 5 },
           { name: "Zqeef",  hero: "Kalea", kills: 1, deaths: 5, assists: 6},

          // VMS Players
          { name: "Natco",  hero: "Esmeralda", kills: 4 , deaths:4 , assists:3  },
          { name: "Chibi",  hero: "Hayabusa", kills: 6, deaths: 1, assists: 3 },
          { name: "Clawkun",  hero: "Pharsa", kills:0 , deaths:2 , assists:8 },
          { name: "Gojes",  hero: "Cici", kills:2 , deaths:2 , assists: 7 },
          { name: "Xorn",  hero: "Chou", kills:0 , deaths:2 , assists:7 },
        ], objectives: {
          lord: { "AERO Esports":0 , "Team Vamos":3  },
          turtle: { "AERO Esports":2 , "Team Vamos":0  },
          tower: { "AERO Esports":1 , "Team Vamos":9  }
        }
      },      
    ]},
      //week 3 friday match 1 (AERO 2-0 TDK)
  {
        teamA: "AERO Esports",
        teamB: "Todak",
        games: [
            { //game 1
        winner: "AERO Esports",
        bans: ["Fanny","Joy","Baxia","Franco","Kadita","Kagura","Grock", "Zhuxin","Gatotkaca", "Yi Sun-Shin"],
        players: [
          // AERO Esports  Players
          { name: "Kusey",  hero: "Granger", kills:6 , deaths:0 , assists:7  },
          { name: "Hazle",  hero: "Lancelot", kills:5 , deaths:1 , assists:10  },
          { name: "Kyym",  hero: "Lunox", kills:0 , deaths: 3, assists: 12 },
          { name: "Smooth",  hero: "Esmeralda", kills:5 , deaths: 0, assists:12  },
          { name: "Zqeef",  hero: "Kalea", kills:2 , deaths: 2, assists:9 },

          // Todak Players
          { name: "Loleal",  hero: "Cici", kills:5, deaths: 3, assists:1  }, //gold
          { name: "Zahyed",  hero: "Hayabusa", kills:0 , deaths: 5, assists:3  }, //jungle
          { name: "ZaimSempoi",  hero: "Pharsa", kills:1 , deaths:3 , assists:4  }, //midlane
          { name: "Fawndeer",  hero: "Ruby", kills:0 , deaths: 4, assists:4  }, //exp
          { name: "Dreams",  hero: "Hylos", kills:0 , deaths:3 , assists:5 }, //roam


        ], objectives: {
          lord: { "AERO Esports":2 , "Todak":0 },
          turtle: { "AERO Esports":3 , "Todak":0  },
          tower: { "AERO Esports":8 , "Todak":2  }
        }
      },
            { //game 2
        winner: "AERO Esports",
        bans: ["Fanny","Zhuxin","Pharsa","Kaja","Badang","Uranus","Lunox", "Franco","Baxia", "Yi Sun-Shin"],
        players: [
          // AERO Esports  Players
          { name: "Kusey",  hero: "Irithel", kills:5 , deaths:0 , assists:9  },
          { name: "Hazle",  hero: "Hayabusa", kills:4, deaths:0 , assists:10  },
          { name: "Kyym",  hero: "Novaria", kills:3 , deaths: 0, assists: 13 },
          { name: "Smooth",  hero: "Esmeralda", kills:4, deaths: 0, assists:7  },
          { name: "Zqeef",  hero: "Grock", kills:2 , deaths: 1, assists:13 },

          // Todak Players
          { name: "Loleal",  hero: "Wanwan", kills:0, deaths: 4, assists:1  }, //gold
          { name: "Zahyed",  hero: "Lancelot", kills:0 , deaths: 3, assists:0  }, //jungle
          { name: "ZaimSempoi",  hero: "Valentina", kills:1 , deaths:1 , assists:0  }, //midlane
          { name: "Fawndeer",  hero: "Gatotkaca", kills:0, deaths: 3, assists:1  }, //exp
          { name: "Dreams",  hero: "Kalea", kills:0 , deaths:7, assists:1 }, //roam

        ], objectives: {
          lord: { "AERO Esports":2 , "Todak":0  },
          turtle: { "AERO Esports":1 , "Todak":1  },
          tower: { "AERO Esports":9 , "Todak":2  }
        }
      },
    ]},
      //week 3 friday match 2 (cg 2-0 tr)
  {
        teamA: "CG Esports",
        teamB: "Team Rey",
        games: [
            { //game 1
        winner: "CG Esports",
        bans: ["Kalea","Fanny","Grock","Esmeralda","Mathilda","Arlott","Wanwan", "Angela","Yi Sun-Shin", "Moskov"],
        players: [
          // cg Players
          { name: "Amzziq",  hero: "Granger", kills: 9, deaths: 1, assists: 6 },
          { name: "Gary",  hero: "Baxia", kills: 2, deaths: 5, assists: 9 },
          { name: "Ciku",  hero: "Kimmy", kills: 3, deaths: 1, assists: 12 },
          { name: "Ye3",  hero: "Lapu-Lapu", kills: 2, deaths: 2, assists: 8 },
          { name: "Valenz",  hero: "Guinevere", kills: 1, deaths: 3, assists: 11},

          // TR Players
          { name: "Jowm",  hero: "Claude", kills: 3, deaths: 2, assists: 8 },
          { name: "Duskk",  hero: "Fredrinn", kills: 5, deaths: 4, assists: 4 },
          { name: "Zakqt",  hero: "Zhuxin", kills: 2, deaths: 4, assists: 8 },
          { name: "Der",  hero: "Cici", kills: 2, deaths: 2, assists: 8 },
          { name: "NovaXCobar",  hero: "Chou", kills: 0, deaths: 5, assists: 6},
        ], objectives: {
          lord: { "CG Esports":1 , "Team Rey":1  },
          turtle: { "CG Esports": 0, "Team Rey": 3 },
          tower: { "CG Esports": 9, "Team Rey":3  }
        }
      },
            { //game 2
        winner: "CG Esports",
        bans: ["Moskov","Fredrinn","Wanwan","Irithel","Natan","Chou","Grock", "Kalea","Yi Sun-Shin", "Fanny"],
        players: [
          // cg Players
          { name: "Amzziq",  hero: "Granger", kills: 10, deaths: 3, assists: 2 },
          { name: "Gary",  hero: "Joy", kills: 2, deaths: 1, assists: 6 },
          { name: "Ciku",  hero: "Zhuxin", kills: 0, deaths: 0, assists: 11 },
          { name: "Ye3",  hero: "Esmeralda", kills: 0, deaths: 1, assists: 10 },
          { name: "Valenz",  hero: "Guinevere", kills: 0, deaths: 4, assists: 10},

          // TR Players
          { name: "Jowm",  hero: "Claude", kills: 3, deaths: 1, assists: 1 },
          { name: "Duskk",  hero: "Baxia", kills: 2, deaths: 3, assists: 5 },
          { name: "Zakqt",  hero: "Angela", kills: 0, deaths: 2, assists: 3 },
          { name: "Der",  hero: "Cici", kills: 2, deaths: 3, assists: 0 },
          { name: "NovaXCobar",  hero: "Badang", kills: 2, deaths: 3, assists: 4},
        ], objectives: {
          lord: { "CG Esports":1 , "Team Rey":1  },
          turtle: { "CG Esports": 0, "Team Rey": 3 },
          tower: { "CG Esports": 8, "Team Rey":2  }
        }
      },
          
    ]},
      //week 3 saturday match 1 (srg 2-0 aero)
  {
        teamA: "Selangor Red Giants",
        teamB: "AERO Esports",
        games: [
            { //game 1
        winner: "Selangor Red Giants",
        bans: ["Zhuxin","Fanny","Angela","Harith","Novaria","Moskov","Grock", "Yi Sun-Shin","Wanwan", "Cici"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Claude", kills: 1, deaths: 1, assists: 11 },
          { name: "Sekys",  hero: "Baxia", kills: 3, deaths: 0, assists: 12 },
          { name: "Stormie",  hero: "Kimmy", kills: 5, deaths: 2, assists: 7 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills: 8, deaths: 1, assists: 5 },
          { name: "Yums",  hero: "Chip", kills: 0, deaths: 4, assists: 11},

          // AERO Esports  Players
          { name: "Kusey",  hero: "Esmeralda", kills:1 , deaths:4 , assists:4  },
          { name: "Hazle",  hero: "Lancelot", kills:4 , deaths:4 , assists:3  },
          { name: "Kyym",  hero: "Cecilion", kills:1 , deaths: 1, assists: 6 },
          { name: "Smooth",  hero: "Uranus", kills:2 , deaths: 3, assists:4  },
          { name: "Zqeef",  hero: "Kalea", kills:0 , deaths: 5, assists:5 },
        ], objectives: {
          lord: { "Selangor Red Giants":3 , "AERO Esports":0  },
          turtle: { "Selangor Red Giants":3 , "AERO Esports":0  },
          tower: { "Selangor Red Giants":8 , "AERO Esports": 0 }
        }
      },
            { //game 2
        winner: "Selangor Red Giants",
        bans: ["Baxia","Cici","Fanny","Uranus","Moskov","Ruby","Luoyi", "Angela","Zhuxin", "Wanwan"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Bane", kills: 1, deaths: 1, assists: 8 },
          { name: "Sekys",  hero: "Lancelot", kills: 3, deaths: 1, assists: 11 },
          { name: "Stormie",  hero: "Lunox", kills: 8, deaths: 1, assists: 6 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills: 3, deaths: 1, assists: 5 },
          { name: "Yums",  hero: "Kalea", kills: 2, deaths: 0, assists: 11},

          // AERO Esports  Players
          { name: "Kusey",  hero: "Claude", kills:0 , deaths:3 , assists:5  },
          { name: "Hazle",  hero: "Yi Sun-Shin", kills:6 , deaths:2 , assists:3  },
          { name: "Kyym",  hero: "Kimmy", kills:2 , deaths: 2, assists: 5 },
          { name: "Smooth",  hero: "Esmeralda", kills:0 , deaths: 6, assists:5  },
          { name: "Zqeef",  hero: "Grock", kills:1 , deaths: 3, assists:5 },
        ], objectives: {
          lord: { "Selangor Red Giants":1 , "AERO Esports":0  },
          turtle: { "Selangor Red Giants":3 , "AERO Esports":0  },
          tower: { "Selangor Red Giants":8 , "AERO Esports": 1 }
        }
      },
    ]},
      //week 3 sat match 2 (GMXK 2-1 TDK)
  {
        teamA: "GAMESMY Kelantan",
        teamB: "Todak",
        games: [
            { //game 1
        winner: "Todak",
        bans: ["Kimmy","Zhuxin","Wanwan","Pharsa","Lunox","Ruby","Beatrix", "Cici","Angela", "Baxia"],
        players: [

          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Granger", kills: 3, deaths: 2, assists: 2 },
          { name: "Jaja",  hero: "Lancelot", kills: 1, deaths: 3, assists: 3 },
          { name: "Maima",  hero: "Kagura", kills: 2, deaths: 1, assists: 4 },
          { name: "Munster",  hero: "Arlott", kills: 1, deaths: 6, assists: 5 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 0, deaths: 2, assists: 4},

          // Todak Players
          { name: "Loleal",  hero: "Harith", kills:5, deaths: 1, assists:4  }, //gold
          { name: "Zahyed",  hero: "Yi Sun-Shin", kills:3 , deaths: 1, assists:6  }, //jungle
          { name: "ZaimSempoi",  hero: "Kadita", kills:4 , deaths:1 , assists:6  }, //midlane
          { name: "Fawndeer",  hero: "Phoveus", kills:2 , deaths: 2, assists:6  }, //exp
          { name: "Dreams",  hero: "Kalea", kills:0 , deaths:2 , assists:10 }, //roam

        ], objectives: {
          lord: { "GAMESMY Kelantan": 1, "Todak":2 },
          turtle: { "GAMESMY Kelantan": 0, "Todak": 3 },
          tower: { "GAMESMY Kelantan":2 , "Todak":8  }
        }
      },
            { //game 2
        winner: "GAMESMY Kelantan",
        bans: ["Fanny","Chip","Franco","Moskov","Kalea","Badang","Grock", "Baxia","Yi Sun-Shin", "Wanwan"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Kimmy", kills: 10, deaths: 1, assists: 1 },
          { name: "Jaja",  hero: "Lancelot", kills: 0, deaths: 1, assists: 6 },
          { name: "Maima",  hero: "Angela", kills: 1, deaths: 1, assists: 12 },
          { name: "Munster",  hero: "Cici", kills: 3, deaths: 1, assists: 11 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 0, deaths: 3, assists: 11},

          // Todak Players
          { name: "Loleal",  hero: "Karrie", kills:0, deaths: 2, assists:5  }, //gold
          { name: "Zahyed",  hero: "Fredrinn", kills:1 , deaths: 5, assists:1  }, //jungle
          { name: "ZaimSempoi",  hero: "Lunox", kills:5 , deaths:2 , assists:2  }, //midlane
          { name: "Fawndeer",  hero: "Esmeralda", kills:0 , deaths: 2, assists:5  }, //exp
          { name: "Dreams",  hero: "Kaja", kills:1 , deaths:3 , assists:6 }, //roam

        ], objectives: {
          lord: { "GAMESMY Kelantan": 2, "Todak":0  },
          turtle: { "GAMESMY Kelantan": 3, "Todak": 0 },
          tower: { "GAMESMY Kelantan":8 , "Todak":2  }
        }
      },
          { //game 3
        winner: "GAMESMY Kelantan",
        bans: ["Fanny","Chip","Franco","Lunox","Kadita","Grock","Badang", "Baxia","Wanwan", "Yi Sun-Shin"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Lapu-Lapu", kills: 4, deaths: 1, assists: 6 },
          { name: "Jaja",  hero: "Lancelot", kills: 5, deaths: 0, assists: 2 },
          { name: "Maima",  hero: "Angela", kills: 2, deaths: 0, assists: 10 },
          { name: "Munster",  hero: "Cici", kills: 2, deaths: 0, assists: 6 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 0, deaths: 0, assists: 9},

          // Todak Players
          { name: "Loleal",  hero: "Harith", kills:0, deaths: 3, assists:1  }, //gold
          { name: "Zahyed",  hero: "Fredrinn", kills:1 , deaths: 4, assists:0  }, //jungle
          { name: "ZaimSempoi",  hero: "Pharsa", kills:0 , deaths:4 , assists:1  }, //midlane
          { name: "Fawndeer",  hero: "Arlott", kills:0 , deaths: 1, assists:0  }, //exp
          { name: "Dreams",  hero: "Kaja", kills:0 , deaths:1 , assists:1 }, //roam

        ], objectives: {
          lord: { "GAMESMY Kelantan": 2, "Todak":0  },
          turtle: { "GAMESMY Kelantan": 3, "Todak": 0 },
          tower: { "GAMESMY Kelantan":9 , "Todak":1  }
        }
      },
    ]},
      //week 3 SAT match 3 (MV 2-0 TR)
  {
        teamA: "Monster Vicious",
        teamB: "Team Rey",
        games: [
            { //game 1
        winner: "Monster Vicious",
        bans: ["Fredrinn","Baxia","Wanwan","Akai","Gatotkaca","Harith","Granger", "Joy","Fanny", "Yi Sun-Shin"],
        players: [
          // Monster Vicious Players
          { name: "Rough",  hero: "Esmeralda", kills: 1, deaths: 0, assists: 7 },
          { name: "Unii",  hero: "Suyou", kills: 4, deaths: 0, assists: 5 },
          { name: "Bondolz",  hero: "Lunox", kills: 5, deaths: 1, assists: 4 },
          { name: "Momo",  hero: "Cici", kills: 0, deaths: 0, assists: 6 },
          { name: "Lyoni",  hero: "Kalea", kills: 0, deaths: 1, assists: 8},

          // Team Rey Players
          { name: "Jowm",  hero: "Moskov", kills: 0, deaths: 1, assists: 2 },
          { name: "Duskk",  hero: "Hayabusa", kills: 1, deaths: 2, assists: 0 },
          { name: "Zakqt",  hero: "Valentina", kills: 1, deaths: 2, assists: 1 },
          { name: "Der",  hero: "Arlott", kills: 0, deaths: 2, assists: 2 },
          { name: "NovaXCobar",  hero: "Grock", kills: 0, deaths: 3, assists: 1},

        ], objectives: {
          lord: { "Monster Vicious":1 , "Team Rey":0  },
          turtle: { "Monster Vicious":3 , "Team Rey":0  },
          tower: { "Monster Vicious":8 , "Team Rey":2  }
        }
      },
            { //game 2
        winner: "Monster Vicious",
        bans: ["Fredrinn","Baxia","Wanwan","Arlott","Esmeralda","Granger","Uranus", "Joy","Fanny", "Yi Sun-Shin"],
        players: [
          // Monster Vicious Players
          { name: "Rough",  hero: "Ruby", kills: 3, deaths: 4, assists: 4 },
          { name: "Unii",  hero: "Lancelot", kills: 1, deaths: 3, assists: 4 },
          { name: "Bondolz",  hero: "Kimmy", kills: 2, deaths: 2, assists: 4 },
          { name: "Momo",  hero: "Cici", kills: 1, deaths: 3, assists: 6 },
          { name: "Lyoni",  hero: "Grock", kills: 1, deaths: 7, assists: 4},
          // Team Rey Players
          { name: "Jowm",  hero: "Moskov", kills: 4, deaths: 1, assists: 2 },
          { name: "Duskk",  hero: "Akai", kills: 0, deaths: 2, assists: 6 },
          { name: "Zakqt",  hero: "Valentina", kills: 0, deaths: 0, assists: 8 },
          { name: "Der",  hero: "Lapu-Lapu", kills: 4, deaths: 0, assists: 6 },
          { name: "NovaXCobar",  hero: "Gatotkaca", kills: 2, deaths: 2, assists: 6},

        ], objectives: {
          lord: { "Monster Vicious":3 , "Team Rey":0  },
          turtle: { "Monster Vicious":3 , "Team Rey":0  },
          tower: { "Monster Vicious":9 , "Team Rey":1  }
        }
      },
    ]},
      //week 3 sun match 1 (GMXK 0-2 hb)
  {
        teamA: "GAMESMY Kelantan",
        teamB: "Homebois",
        games: [
            { //game 1
        winner: "Homebois",
        bans: ["Fanny","Kalea","Wanwan","Claude","Gloo","Esmeralda","Yi Sun-Shin", "Lapu-Lapu","Cici", "Angela"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Ruby", kills: 1, deaths: 3, assists: 3 },
          { name: "Jaja",  hero: "Baxia", kills: 0, deaths: 5, assists: 6 },
          { name: "Maima",  hero: "Kimmy", kills: 3, deaths: 5, assists: 5 },
          { name: "Munster",  hero: "Phoveus", kills: 3, deaths: 8, assists: 5 },
          { name: "Matdinz",  hero: "Mathilda", kills: 2, deaths: 2, assists: 5},

          // Homebois Players
          { name: "Melqt",  hero: "Granger", kills: 11, deaths: 0, assists: 5 },
          { name: "Eyymal",  hero: "Joy", kills: 6, deaths: 2, assists: 13 },
          { name: "Izanami",  hero: "Zhuxin", kills: 6, deaths: 2, assists: 15 },
          { name: "Rezza",  hero: "Hylos", kills: 0, deaths: 3, assists: 16 },
          { name: "Daniel",  hero: "Chip", kills: 0, deaths: 2, assists: 19}

        ], objectives: {
          lord: { "GAMESMY Kelantan": 0, "Homebois": 2 },
          turtle: { "GAMESMY Kelantan":0 , "Homebois": 3 },
          tower: { "GAMESMY Kelantan": 1, "Homebois":9  }
        }
      },
            { //game 2
        winner: "Homebois",
        bans: ["Yi Sun-Shin","Zhuxin","Angela","Lapu-Lapu","Esmeralda","Lancelot","Fanny", "Chip","Wanwan", "Kalea"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Harith", kills: 0, deaths: 2, assists: 1 },
          { name: "Jaja",  hero: "Hayabusa", kills: 0, deaths: 5, assists: 1 },
          { name: "Maima",  hero: "Kimmy", kills: 1, deaths: 1, assists: 0 },
          { name: "Munster",  hero: "Arlott", kills: 0, deaths: 6, assists: 1 },
          { name: "Matdinz",  hero: "Baxia", kills: 0, deaths: 5, assists: 1},

          // Homebois Players
          { name: "Melqt",  hero: "Granger", kills: 8, deaths: 0, assists: 4 },
          { name: "Eyymal",  hero: "Joy", kills: 4, deaths: 0, assists: 12 },
          { name: "Izanami",  hero: "Yve", kills: 4, deaths: 0, assists: 14 },
          { name: "Rezza",  hero: "Cici", kills: 3, deaths: 0, assists: 10 },
          { name: "Daniel",  hero: "Chou", kills: 0, deaths: 1, assists: 14}

        ], objectives: {
          lord: { "GAMESMY Kelantan": 0, "Homebois": 2 },
          turtle: { "GAMESMY Kelantan":1 , "Homebois": 1 },
          tower: { "GAMESMY Kelantan": 2, "Homebois":7  }
        }
      },
    ]},

          //week 3 sun match 2 (srg 2-1 cg)
  {
        teamA: "Selangor Red Giants",
        teamB: "CG Esports",
        games: [
            { //game 1
        winner: "CG Esports",
        bans: ["Zhuxin","Baxia","Arlott","Odette","Uranus","Chibi","Kimmy", "Fanny","Wanwan", "Cici"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Ruby", kills: 1, deaths: 4, assists: 2 },
          { name: "Sekys",  hero: "Yi Sun-Shin", kills: 3, deaths: 2, assists: 2 },
          { name: "Stormie",  hero: "Pharsa", kills: 0, deaths: 1, assists: 5 },
          { name: "Kramm",  hero: "Esmeralda", kills: 1, deaths: 5, assists: 2 },
          { name: "Yums",  hero: "Grock", kills: 0, deaths: 6, assists: 3},

          // cg Players
          { name: "Amzziq",  hero: "Granger", kills: 7, deaths: 0, assists: 4 },
          { name: "Gary",  hero: "Lancelot", kills: 5, deaths: 0, assists: 8 },
          { name: "Ciku",  hero: "Lunox", kills: 3, deaths: 0, assists: 12 },
          { name: "Ye3",  hero: "Lapu-Lapu", kills: 2, deaths: 3, assists: 10 },
          { name: "Valenz",  hero: "Kalea", kills: 1, deaths: 2, assists: 14},
        ], objectives: {
          lord: { "Selangor Red Giants":0 , "CG Esports":1  },
          turtle: { "Selangor Red Giants":0 , "CG Esports":3  },
          tower: { "Selangor Red Giants":0 , "CG Esports":8 }
        }
      },
            { //game 2
        winner: "Selangor Red Giants",
        bans: ["Fanny","Cici","Zhuxin","Grock","Chip","Odette","Ruby", "Kalea","Baxia", "Wanwan"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Claude", kills: 6, deaths: 1, assists: 11 },
          { name: "Sekys",  hero: "Lancelot", kills: 2, deaths: 3, assists: 13 },
          { name: "Stormie",  hero: "Kimmy", kills: 11, deaths: 4, assists: 9 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills: 7, deaths: 1, assists: 6 },
          { name: "Yums",  hero: "Gatotkaca", kills: 1, deaths: 2, assists: 16},

          // cg Players
          { name: "Amzziq",  hero: "Granger", kills: 3, deaths: 5, assists: 3 },
          { name: "Gary",  hero: "Yi Sun-Shin", kills: 5, deaths: 3, assists: 5 },
          { name: "Ciku",  hero: "Lunox", kills: 3, deaths: 6, assists: 4 },
          { name: "Ye3",  hero: "Esmeralda", kills: 0, deaths: 6, assists: 4 },
          { name: "Valenz",  hero: "Chou", kills: 0, deaths: 7, assists: 6},
        ], objectives: {
          lord: { "Selangor Red Giants":2 , "CG Esports":0  },
          turtle: { "Selangor Red Giants":3 , "CG Esports":0  },
          tower: { "Selangor Red Giants":9 , "CG Esports":4  }
        }
      },
                  { //game 3
        winner: "Selangor Red Giants",
        bans: ["Zhuxin","Baxia","Lancelot","Grock","Odette","Bane","Lunox", "Kimmy","Kalea", "Wanwan"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Harith", kills: 6, deaths: 1, assists: 4 },
          { name: "Sekys",  hero: "Yi Sun-Shin", kills: 9, deaths: 0, assists: 6 },
          { name: "Stormie",  hero: "Selena", kills: 1, deaths: 0, assists: 9 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills: 4, deaths: 3, assists: 5 },
          { name: "Yums",  hero: "Chou", kills: 0, deaths: 2, assists: 14},

          // cg Players
          { name: "Amzziq",  hero: "Granger", kills: 4, deaths: 5, assists: 2 },
          { name: "Gary",  hero: "Joy", kills: 1, deaths: 5, assists: 2 },
          { name: "Ciku",  hero: "Novaria", kills: 1, deaths: 1, assists: 4 },
          { name: "Ye3",  hero: "Uranus", kills: 0, deaths: 2, assists: 2 },
          { name: "Valenz",  hero: "Badang", kills: 0, deaths: 7, assists: 4},
        ], objectives: {
          lord: { "Selangor Red Giants":3 , "CG Esports":1  },
          turtle: { "Selangor Red Giants":3, "CG Esports":0 },
          tower: { "Selangor Red Giants":8 , "CG Esports":0  }
        }
      },
    ]},

      //week 3 sun match 3 (unt 0-2 VMS)
  {
        teamA: "Untitled",
        teamB: "Team Vamos",
        games: [
            { //game 1
        winner: "Team Vamos",
        bans: ["Fredrinn","Zhuxin","Phoveus","Guinevere","Akai","Chou","Franco", "Uranus","Angela", "Chip"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Beatrix", kills: 1, deaths: 3, assists: 3 },
          { name: "Keymin",  hero: "Hayabusa", kills: 1, deaths: 4, assists: 5 },
          { name: "Stowm",  hero: "Pharsa", kills: 3, deaths: 1, assists: 5 },
          { name: "Sizkaa",  hero: "Lapu-Lapu", kills: 3, deaths: 4, assists: 2 },
          { name: "Rasy",  hero: "Kalea", kills: 0, deaths: 7, assists: 5},

          // VMS Players
          { name: "Natco",  hero: "Wanwan", kills: 8 , deaths:2 , assists:6  },
          { name: "Chibi",  hero: "Baxia", kills: 3, deaths: 1, assists: 9 },
          { name: "Clawkun",  hero: "Kimmy", kills:5 , deaths:2 , assists:9 },
          { name: "Gojes",  hero: "Cici", kills:2 , deaths:0 , assists: 7 },
          { name: "Xorn",  hero: "Grock", kills:1 , deaths:3 , assists:14 },
        ], objectives: {
          lord: { "Untitled":0 , "Team Vamos":2  },
          turtle: { "Untitled":0 , "Team Vamos":3  },
          tower: { "Untitled":0 , "Team Vamos":9  }
        }
      },
            { //game 2
        winner: "Team Vamos",
        bans: ["Zhuxin","Angela","Kalea","Esmeralda","Kimmy","Ruby","Harith", "Wanwan","Chip", "Baxia"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Claude", kills: 3, deaths: 3, assists: 10 },
          { name: "Keymin",  hero: "Yi Sun-Shin", kills: 8, deaths: 4, assists: 6 },
          { name: "Stowm",  hero: "Selena", kills: 3, deaths: 3, assists: 11 },
          { name: "Sizkaa",  hero: "Arlott", kills: 6, deaths: 5, assists: 9 },
          { name: "Rasy",  hero: "Hylos", kills: 1, deaths: 6, assists: 12},
          // VMS Players
          { name: "Natco",  hero: "Cici", kills: 2 , deaths:3 , assists:13  },
          { name: "Chibi",  hero: "Lancelot", kills: 11, deaths: 5, assists: 6 },
          { name: "Clawkun",  hero: "Kagura", kills:4 , deaths:5 , assists:5 },
          { name: "Gojes",  hero: "Lapu-Lapu", kills:3 , deaths:3 , assists: 11 },
          { name: "Xorn",  hero: "Grock", kills:1 , deaths:5 , assists:11 },
        ], objectives: {
          lord: { "Untitled":1 , "Team Vamos":3  },
          turtle: { "Untitled":1 , "Team Vamos":2  },
          tower: { "Untitled":7 , "Team Vamos":8  }
        }
      },
    ]},
          //week 4 friday match 1 (unt 0-2 mv)
  {
        teamA: "Untitled",
        teamB: "Monster Vicious",
        games: [
            { //game 1
        winner: "Monster Vicious",
        bans: ["Fanny","Angela","Cici","Gatotkaca","Lancelot","Harith","Pharsa", "Zhuxin","Wanwan", "Chip"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Beatrix", kills: 7, deaths: 1, assists: 6 },
          { name: "Keymin",  hero: "Yi Sun-Shin", kills: 1, deaths: 6, assists: 12 },
          { name: "Stowm",  hero: "Valentina", kills: 4, deaths: 6, assists: 8 },
          { name: "Sizkaa",  hero: "Lapu-Lapu", kills: 3, deaths: 6, assists: 8 },
          { name: "Rasy",  hero: "Kalea", kills: 1, deaths: 6, assists: 10},

          // Monster Vicious Players
          { name: "Rough",  hero: "Granger", kills: 13, deaths: 1, assists: 9 },
          { name: "Unii",  hero: "Guinevere", kills: 2, deaths: 3, assists: 14 },
          { name: "Bondolz",  hero: "Kimmy", kills: 5, deaths: 1, assists: 15 },
          { name: "Momo",  hero: "Arlott", kills: 2, deaths: 8, assists: 13 },
          { name: "Lyoni",  hero: "Grock", kills: 3, deaths: 3, assists: 12},


        ], objectives: {
          lord: { "Untitled":4 , "Monster Vicious":1  },
          turtle: { "Untitled":0 , "Monster Vicious":2  },
          tower: { "Untitled":8 , "Monster Vicious":6  }
        }
      },
            { //game 2
        winner: "Monster Vicious",
        bans: ["Fanny","Angela","Pharsa","Cici","Zhuxin","Harith","Lapu-Lapu", "Yi Sun-Shin","Wanwan", "Ruby"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Beatrix", kills: 2, deaths: 1, assists: 1 },
          { name: "Keymin",  hero: "Lancelot", kills: 0, deaths: 3, assists: 1 },
          { name: "Stowm",  hero: "Kimmy", kills: 0, deaths: 2, assists: 3 },
          { name: "Sizkaa",  hero: "Gloo", kills: 0, deaths: 2, assists: 2 },
          { name: "Rasy",  hero: "Kalea", kills: 1, deaths: 2, assists: 3},

          // Monster Vicious Players
          { name: "Rough",  hero: "Granger", kills: 1, deaths: 0, assists: 5 },
          { name: "Unii",  hero: "Baxia", kills: 0, deaths: 1, assists: 4 },
          { name: "Bondolz",  hero: "Lunox", kills: 6, deaths: 0, assists: 1 },
          { name: "Momo",  hero: "Arlott", kills: 0, deaths: 1, assists: 4 },
          { name: "Lyoni",  hero: "Grock", kills: 3, deaths: 1, assists: 8},

        ], objectives: {
          lord: { "Untitled":0 , "Monster Vicious":2  },
          turtle: { "Untitled":0 , "Monster Vicious":3  },
          tower: { "Untitled":3 , "Monster Vicious":9  }
        }
      },
    ]},
      //week 4 friday match 2 (cg 1-2 aero)
  {
        teamA: "CG Esports",
        teamB: "AERO Esports",
        games: [
            { //game 1
        winner: "CG Esports",
        bans: ["Fanny","Hayabusa","Phoveus","Grock","Chip","Arlott","Lunox", "Lapu-Lapu","Zhuxin", "Kalea"],
        players: [
          // cg Players
          { name: "Trap",  hero: "Wanwan", kills: 10, deaths: 2, assists: 2 },
          { name: "Gary",  hero: "Baxia", kills: 7, deaths: 5, assists: 9 },
          { name: "Ciku",  hero: "Odette", kills: 1, deaths: 4, assists: 13 },
          { name: "Ye3",  hero: "Benedetta", kills: 1, deaths: 0, assists: 13 },
          { name: "Valenz",  hero: "Chou", kills: 0, deaths: 4, assists: 9},

          //aero players
          { name: "Kusey",  hero: "Cici", kills:0 , deaths:3 , assists:5  },
          { name: "Hazle",  hero: "Yi Sun-Shin", kills:6 , deaths:2 , assists:3  },
          { name: "Kyym",  hero: "Pharsa", kills:2 , deaths: 2, assists: 5 },
          { name: "Smooth",  hero: "Terizla", kills:0 , deaths: 6, assists:5  },
          { name: "Zqeef",  hero: "Gloo", kills:1 , deaths: 3, assists:5 },
        ], objectives: {
          lord: { "CG Esports":1 , "AERO Esports":1  },
          turtle: { "CG Esports": 1, "AERO Esports": 2 },
          tower: { "CG Esports": 9, "AERO Esports":4  }
        }
      },
            { //game 2
        winner: "AERO Esports",
        bans: ["Fanny","Hayabusa","Wanwan","Grock","Chip","Ruby","Harith", "Chou","Zhuxin", "Kalea"],
        players: [
          // cg Players
          { name: "Trap",  hero: "Phoveus", kills: 0, deaths: 5, assists: 2 },
          { name: "Gary",  hero: "Yi Sun-Shin", kills: 1, deaths: 3, assists: 3 },
          { name: "Ciku",  hero: "Kimmy", kills: 2, deaths: 4, assists: 4 },
          { name: "Ye3",  hero: "Lapu-Lapu", kills: 3, deaths: 3, assists: 3 },
          { name: "Valenz",  hero: "Gatotkaca", kills: 2, deaths: 2, assists: 4},

          //aero players
          { name: "Kusey",  hero: "Cici", kills:2 , deaths:2 , assists:10  },
          { name: "Hazle",  hero: "Lancelot", kills:5 , deaths:2 , assists:5  },
          { name: "Kyym",  hero: "Pharsa", kills:5 , deaths: 0, assists: 10 },
          { name: "Smooth",  hero: "Alice", kills:1 , deaths: 1, assists:12  },
          { name: "Zqeef",  hero: "Hilda", kills:4 , deaths: 3, assists:5 },
        ], objectives: {
          lord: { "CG Esports":0 , "AERO Esports":1  },
          turtle: { "CG Esports": 0, "AERO Esports": 3 },
          tower: { "CG Esports": 1, "AERO Esports":8  }
        }
      },
                  { //game 3
        winner: "AERO Esports",
        bans: ["Fanny","Cici","Wanwan","Khaleed","Hilda","Badang","Grock", "Zhuxin","Chou", "Kalea"],
        players: [
          // cg Players
          { name: "Trap",  hero: "Moskov", kills: 0, deaths: 5, assists: 3 },
          { name: "Gary",  hero: "Uranus", kills: 2, deaths: 4, assists: 2 },
          { name: "Ciku",  hero: "Kimmy", kills: 2, deaths: 7, assists: 5 },
          { name: "Ye3",  hero: "Benedetta", kills: 3, deaths: 4, assists: 2 },
          { name: "Valenz",  hero: "Baxia", kills: 2, deaths: 4, assists: 4},

          //aero players
          { name: "Kusey",  hero: "Harith", kills:8 , deaths:1 , assists:11  },
          { name: "Hazle",  hero: "Hayabusa", kills:5 , deaths:4 , assists:6  },
          { name: "Kyym",  hero: "Pharsa", kills:5 , deaths: 0, assists: 15 },
          { name: "Smooth",  hero: "Lapu-Lapu", kills:3 , deaths: 1, assists:12  },
          { name: "Zqeef",  hero: "Gatotkaca", kills:3 , deaths: 3, assists:13 },
        ], objectives: {
          lord: { "CG Esports":0 , "AERO Esports":2  },
          turtle: { "CG Esports": 1, "AERO Esports": 2 },
          tower: { "CG Esports": 5, "AERO Esports":7 }
        }
      },
          
    ]},
      //week 4 saturday match 1 (srg 2-0 vms)
  {
        teamA: "Selangor Red Giants",
        teamB: "Team Vamos",
        games: [
            { //game 1
        winner: "Selangor Red Giants",
        bans: ["Zhuxin","Chip","Cici","Grock","Chou","Granger","Lunox", "Baxia","Wanwan", "Fanny"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Brody", kills: 2, deaths: 2, assists: 5 },
          { name: "Sekys",  hero: "Lancelot", kills: 7, deaths: 0, assists: 2 },
          { name: "Stormie",  hero: "Selena", kills: 4, deaths: 1, assists: 5 },
          { name: "Kramm",  hero: "Esmeralda", kills: 1, deaths: 0, assists: 7 },
          { name: "Yums",  hero: "Kalea", kills: 0, deaths: 4, assists: 6},

          // VMS Players
          { name: "Natco",  hero: "Bane", kills: 2 , deaths:4 , assists:0  },
          { name: "Chibi",  hero: "Hayabusa", kills: 3, deaths: 2, assists: 1 },
          { name: "Clawkun",  hero: "Kimmy", kills:2 , deaths:3 , assists:3 },
          { name: "Gojes",  hero: "Lapu-Lapu", kills:0 , deaths:3 , assists: 3 },
          { name: "Xorn",  hero: "Gatotkaca", kills:0 , deaths:2 , assists:6 },
        ], objectives: {
          lord: { "Selangor Red Giants":2 , "Team Vamos":0  },
          turtle: { "Selangor Red Giants":3 , "Team Vamos":0  },
          tower: { "Selangor Red Giants":9 , "Team Vamos": 1 }
        }
      },
            { //game 2
        winner: "Selangor Red Giants",
        bans: ["Fanny","Zhuxin","Wanwan","Selena","Pharsa","Franco","Grock", "Kalea","Chip", "Cici"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Claude", kills: 1, deaths: 1, assists: 8 },
          { name: "Sekys",  hero: "Yi Sun-Shin", kills: 3, deaths: 1, assists: 11 },
          { name: "Stormie",  hero: "Lunox", kills: 8, deaths: 1, assists: 6 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills: 3, deaths: 1, assists: 5 },
          { name: "Yums",  hero: "Chou", kills: 2, deaths: 0, assists: 11},

          // VMS Players
          { name: "Natco",  hero: "Granger", kills: 0 , deaths:2 , assists:0  },
          { name: "Chibi",  hero: "Baxia", kills: 0, deaths: 4, assists: 0 },
          { name: "Clawkun",  hero: "Kimmy", kills:0 , deaths:1 , assists:0 },
          { name: "Gojes",  hero: "Phoveus", kills:0 , deaths:3 , assists: 0 },
          { name: "Xorn",  hero: "Mathilda", kills:0 , deaths:3 , assists:0 },
        ], objectives: {
          lord: { "Selangor Red Giants":2 , "Team Vamos":0  },
          turtle: { "Selangor Red Giants":2 , "Team Vamos":1  },
          tower: { "Selangor Red Giants":8 , "Team Vamos": 2 }
        }
      },
    ]},
      //week 4 sat match 2 (hb 2-0 TDK)
  {
        teamA: "Homebois",
        teamB: "Todak",
        games: [
            { //game 1
        winner: "Homebois",
        bans: ["Cici","Zhuxin","Chip","Fanny","Joy","Ruby","Pharsa", "Fredrinn","Angela", "Baxia"],
        players: [

          // Homebois Players
          { name: "Melqt",  hero: "Granger", kills: 8, deaths: 1, assists: 2 },
          { name: "Eyymal",  hero: "Hayabusa", kills: 1, deaths: 0, assists: 6 },
          { name: "Izanami",  hero: "Lunox", kills: 1, deaths: 2, assists: 7 },
          { name: "Rezza",  hero: "Lapu-Lapu", kills: 3, deaths: 0, assists:71 },
          { name: "Daniel",  hero: "Chou", kills: 0, deaths: 2, assists: 9},

          // Todak Players
          { name: "Loleal",  hero: "Obsidia", kills:0, deaths: 2, assists:0  }, //gold
          { name: "Zahyed",  hero: "Yi Sun-Shin", kills:2 , deaths: 1, assists:1  }, //jungle
          { name: "ZaimSempoi",  hero: "Kadita", kills:1 , deaths:2 , assists:1  }, //midlane
          { name: "Fawndeer",  hero: "Arlott", kills:0 , deaths: 5, assists:2  }, //exp
          { name: "Dreams",  hero: "Grock", kills:1 , deaths:3 , assists:3 }, //roam

        ], objectives: {
          lord: { "Homebois": 1, "Todak":0  },
          turtle: { "Homebois": 3, "Todak": 0 },
          tower: { "Homebois":8 , "Todak":2  }
        }
      },
            { //game 2
        winner: "Homebois",
        bans: ["Angela","Fredrinn","Baxia","Harith","Pharsa","Moskov","Lancelot", "Yi Sun-Shin","Zhuxin", "Cici"],
        players: [
          // Homebois Players
          { name: "Melqt",  hero: "Obsidia", kills: 8, deaths: 2, assists: 6 },
          { name: "Eyymal",  hero: "Joy", kills: 3, deaths: 1, assists: 5 },
          { name: "Izanami",  hero: "Lunox", kills: 1, deaths: 1, assists: 7 },
          { name: "Rezza",  hero: "Hylos", kills: 0, deaths: 0, assists: 6 },
          { name: "Daniel",  hero: "Kalea", kills: 3, deaths: 1, assists: 8},

          // Todak Players
          { name: "Loleal",  hero: "Claude", kills:0, deaths: 4, assists:5  }, //gold
          { name: "Zahyed",  hero: "Fanny", kills:3 , deaths: 4, assists:0  }, //jungle
          { name: "ZaimSempoi",  hero: "Selena", kills:1 , deaths:1 , assists:1  }, //midlane
          { name: "Fawndeer",  hero: "Lapu-Lapu", kills:0 , deaths: 4, assists:0  }, //exp
          { name: "Dreams",  hero: "Grock", kills:1 , deaths:2 , assists:2 }, //roam

        ], objectives: {
          lord: { "Homebois": 2, "Todak":0  },
          turtle: { "Homebois": 3, "Todak": 0 },
          tower: { "Homebois":7 , "Todak":2  }
        }
      },
          
    ]},
      //week 4 SAT match 3 (unt 2-0 TR)
  {
        teamA: "Untitled",
        teamB: "Team Rey",
        games: [
            { //game 1
        winner: "Untitled",
        bans: ["Baxia","Wanwan","Chip","Fredrinn","Akai","Uranus","Ruby", "Cici","Angela", "Fanny"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 6, deaths: 0, assists: 5 },
          { name: "Keymin",  hero: "Guinevere", kills: 1, deaths: 0, assists: 8 },
          { name: "Stowm",  hero: "Yve", kills: 1, deaths: 0, assists: 10 },
          { name: "Sizkaa",  hero: "Arlott", kills: 4, deaths: 0, assists: 7 },
          { name: "Rasy",  hero: "Chou", kills: 0, deaths: 1, assists: 6},

          // Team Rey Players
          { name: "Jowm",  hero: "Esmeralda", kills: 0, deaths: 2, assists: 0 },
          { name: "Error404",  hero: "Yi Sun-Shin", kills: 0, deaths: 1, assists: 1 },
          { name: "Zakqt",  hero: "Zhuxin", kills: 0, deaths: 2, assists: 1 },
          { name: "Der",  hero: "Phoveus", kills: 0, deaths: 4, assists: 0 },
          { name: "NovaXCobar",  hero: "Grock", kills: 1, deaths: 3, assists: 0},

        ], objectives: {
          lord: { "Untitled":1 , "Team Rey":0  },
          turtle: { "Untitled":1 , "Team Rey":2  },
          tower: { "Untitled":8 , "Team Rey":1  }
        }
      },
            { //game 2
        winner: "Untitled",
        bans: ["Fanny","Cici","Angela","Yve","Lapu-Lapu","Kalea","Ruby", "Chibi","Baxia", "Wanwan"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Claude", kills: 4, deaths: 0, assists: 8 },
          { name: "Keymin",  hero: "Yi Sun-Shin", kills: 4, deaths: 2, assists: 12 },
          { name: "Stowm",  hero: "Zhuxin", kills: 3, deaths: 2, assists: 14 },
          { name: "Sizkaa",  hero: "Arlott", kills: 6, deaths: 2, assists: 8 },
          { name: "Rasy",  hero: "Gatotkaca", kills: 1, deaths: 1, assists: 13},
          // Team Rey Players
          { name: "Jowm",  hero: "Granger", kills: 4, deaths: 0, assists: 1 },
          { name: "Error404",  hero: "Hayabusa", kills: 1, deaths: 4, assists: 5 },
          { name: "Zakqt",  hero: "Pharsa", kills: 2, deaths: 4, assists: 4 },
          { name: "Der",  hero: "Terizla", kills: 0, deaths: 5, assists: 4 },
          { name: "NovaXCobar",  hero: "Grock", kills: 0, deaths: 5, assists: 5},

        ], objectives: {
          lord: { "Untitled":0 , "Team Rey":1  },
          turtle: { "Untitled":1 , "Team Rey":2  },
          tower: { "Untitled":6 , "Team Rey":3  }
        }
      },
    ]},
      //week 4 sun match 1 (GMXK 1-2 SRG)
  {
        teamA: "GAMESMY Kelantan",
        teamB: "Selangor Red Giants",
        games: [
            { //game 1
        winner: "Selangor Red Giants",
        bans: ["Zhuxin","Angela","Cici","Ruby","Minsitthar","Granger","Selena", "Baxia","Wanwan", "Kalea"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Kimmy", kills: 4, deaths: 1, assists: 1 },
          { name: "Jaja",  hero: "Yi Sun-Shin", kills: 2, deaths: 3, assists: 3 },
          { name: "Maima",  hero: "Lunox", kills: 0, deaths: 2, assists: 4 },
          { name: "Munster",  hero: "Arlott", kills: 1, deaths: 3, assists: 2 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 1, deaths: 2, assists: 3},

          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Claude", kills: 0, deaths: 3, assists: 5 },
          { name: "Sekys",  hero: "Lancelot", kills: 7, deaths: 1, assists: 2 },
          { name: "Stormie",  hero: "Valentina", kills: 0, deaths: 2, assists: 4 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills: 2, deaths: 1, assists: 5 },
          { name: "Yums",  hero: "Grock", kills: 2, deaths: 1, assists: 7},

        ], objectives: {
          lord: { "GAMESMY Kelantan": 0, "Selangor Red Giants": 2 },
          turtle: { "GAMESMY Kelantan":0 , "Selangor Red Giants": 3 },
          tower: { "GAMESMY Kelantan": 2, "Selangor Red Giants":9  }
        }
      },
            { //game 2
        winner: "GAMESMY Kelantan",
        bans: ["Fanny","Kalea","Wanwan","Phoveus","Claude","Arlott","Harith", "Baxia","Cici", "Angela"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Kimmy", kills: 5, deaths: 2, assists: 3 },
          { name: "Jaja",  hero: "Lancelot", kills: 2, deaths: 3, assists: 8 },
          { name: "Maima",  hero: "Yve", kills: 1, deaths: 2, assists: 8 },
          { name: "Munster",  hero: "Esmeralda", kills: 3, deaths: 3, assists: 6 },
          { name: "Matdinz",  hero: "Chou", kills: 1, deaths: 8, assists: 8},

          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Obsidia", kills: 0, deaths: 5, assists: 8 },
          { name: "Sekys",  hero: "Joy", kills: 3, deaths: 2, assists: 12 },
          { name: "Stormie",  hero: "Zhuxin", kills: 10, deaths: 1, assists: 4 },
          { name: "Kramm",  hero: "Dyrroth", kills: 5, deaths: 3, assists: 6 },
          { name: "Yums",  hero: "Gatotkaca", kills: 0, deaths: 3, assists: 13},

        ], objectives: {
          lord: { "GAMESMY Kelantan": 2, "Selangor Red Giants": 1 },
          turtle: { "GAMESMY Kelantan":3 , "Selangor Red Giants": 0 },
          tower: { "GAMESMY Kelantan": 9, "Selangor Red Giants":4  }
        }
      },
       { //game 3
        winner: "Selangor Red Giants",
        bans: ["Zhuxin","Angela","Cici","Chou","Kaja","Franco","Grock", "Lapu-Lapu","Wanwan", "Kalea"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Immqt",  hero: "Harith", kills: 1, deaths: 4, assists: 0 },
          { name: "Jaja",  hero: "Lancelot", kills: 0, deaths: 6, assists: 0 },
          { name: "Maima",  hero: "Lunox", kills: 0, deaths: 2, assists: 0 },
          { name: "Munster",  hero: "Gloo", kills: 0, deaths: 2, assists: 1 },
          { name: "Matdinz",  hero: "Badang", kills: 0, deaths: 4, assists: 0},

          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Moskov", kills: 3, deaths: 0, assists: 6 },
          { name: "Sekys",  hero: "Baxia", kills: 3, deaths: 0, assists: 10 },
          { name: "Stormie",  hero: "Kimmy", kills: 6, deaths: 1, assists: 7 },
          { name: "Kramm",  hero: "Esmeralda", kills: 4, deaths: 0, assists: 7 },
          { name: "Yums",  hero: "Gatotkaca", kills: 2, deaths: 0, assists: 11},

        ], objectives: {
          lord: { "GAMESMY Kelantan": 0, "Selangor Red Giants": 1 },
          turtle: { "GAMESMY Kelantan":0 , "Selangor Red Giants": 3 },
          tower: { "GAMESMY Kelantan": 0, "Selangor Red Giants":7  }
        }
      },
    ]},

          //week 4 sun match 2 (tdk 0-2 cg)
  {
        teamA: "Todak",
        teamB: "CG Esports",
        games: [
            { //game 1
        winner: "CG Esports",
        bans: ["Kalea","Chou","Zhuxin","Odette","Cici","Chip","Mathilda", "Wanwan","Angela", "Franco"],
        players: [

          //todak player
          { name: "Loleal",  hero: "Moskov", kills: 0, deaths: 2, assists: 0 },
          { name: "Zahyed",  hero: "Baxia", kills: 1, deaths: 6, assists: 3 },
          { name: "ZaimSempoi", hero: "Pharsa", kills: 3, deaths: 1, assists: 0 },
          { name: "Fawndeer",  hero: "Lapu-Lapu", kills: 1, deaths: 5, assists: 4 },
          { name: "Dreams", hero: "Hylos", kills: 0, deaths: 4, assists: 2},

          // cg Players
          { name: "Amzziq",  hero: "Harith", kills: 5, deaths: 0, assists: 7 },
          { name: "Gary",  hero: "Lancelot", kills: 6, deaths: 0, assists: 8 },
          { name: "Ciku",  hero: "Kimmy", kills: 6, deaths: 2, assists: 9 },
          { name: "Ye3",  hero: "Gloo", kills: 1, deaths: 1, assists: 12 },
          { name: "Valenz",  hero: "Grock", kills: 0, deaths: 2, assists: 12},
        ], objectives: {
          lord: { "Todak":0 , "CG Esports":2  },
          turtle: { "Todak":0 , "CG Esports":3  },
          tower: { "Todak":2 , "CG Esports":9  }
        }
      },
            { //game 2
        winner: "CG Esports",
        bans: ["Franco","Wanwan","Angela","Kimmy","Selena","Lunox","Zhuxin", "Grock","Kalea", "Chou"],
        players: [
          //todak player
          { name: "Loleal",  hero: "Esmeralda", kills: 1, deaths: 2, assists: 6 },
          { name: "Zahyed",  hero: "Fanny", kills: 7, deaths: 2, assists: 2 },
          { name: "ZaimSempoi", hero: "Valentina", kills: 1, deaths: 2, assists: 8 },
          { name: "Fawndeer",  hero: "Lapu-Lapu", kills: 2, deaths: 4, assists: 6 },
          { name: "Dreams", hero: "Gatotkaca", kills: 0, deaths: 5, assists: 7},

          // cg Players
          { name: "Amzziq",  hero: "Ruby", kills: 1, deaths: 1, assists: 11 },
          { name: "Gary",  hero: "Yi Sun-Shin", kills: 3, deaths: 3, assists: 12 },
          { name: "Ciku",  hero: "Odette", kills: 6, deaths: 1, assists: 8 },
          { name: "Ye3",  hero: "Phoveus", kills: 2, deaths: 3, assists: 8 },
          { name: "Valenz",  hero: "Badang", kills: 3, deaths: 3, assists: 9},
        ], objectives: {
          lord: { "Todak":2 , "CG Esports":1  },
          turtle: { "Todak":1 , "CG Esports":1  },
          tower: { "Todak":7 , "CG Esports":6  }
        }
      },
    ]},

      //week 4 sun match 3 (hb 2-0 mv)
  {
        teamA: "Homebois",
        teamB: "Monster Vicious",
        games: [
            { //game 1
        winner: "Homebois",
        bans: ["Arlott","Fanny","Esmeralda","Ruby","Granger","Khaleed","Hilda", "Chou","Kalea", "Chip"],
        players: [
          // Homebois Players
          { name: "Melqt",  hero: "Cici", kills: 5, deaths: 4, assists: 7 },
          { name: "Eyymal",  hero: "Yi Sun-Shin", kills: 5, deaths: 3, assists: 7 },
          { name: "Izanami",  hero: "Lunox", kills: 3, deaths: 3, assists: 7 },
          { name: "Rezza",  hero: "Hylos", kills: 0, deaths: 4, assists: 9 },
          { name: "Daniel",  hero: "Kaja", kills: 2, deaths: 3, assists: 9},

          // Monster Vicious Players
          { name: "Rough",  hero: "Kimmy", kills: 8, deaths: 3, assists: 6 },
          { name: "Unii",  hero: "Lancelot", kills: 3, deaths: 3, assists: 8 },
          { name: "Bondolz",  hero: "Angela", kills: 6, deaths: 1, assists: 8 },
          { name: "Momo",  hero: "Alice", kills: 0, deaths: 3, assists: 11 },
          { name: "Lyoni",  hero: "Grock", kills: 0, deaths: 5, assists: 10},

        ], objectives: {
          lord: { "Homebois":2 , "Monster Vicious":1  },
          turtle: { "Homebois":1 , "Monster Vicious":2  },
          tower: { "Homebois":8 , "Monster Vicious":6  }
        }
      },
            { //game 2
        winner: "Homebois",
        bans: ["Fanny","Arlott","Angela","Ruby","Hilda","Joy","Hayabusa", "Chou","Chip", "Kalea"],
        players: [
          // Homebois Players
          { name: "Melqt",  hero: "Granger", kills: 6, deaths: 3, assists: 8 },
          { name: "Eyymal",  hero: "Alpha", kills: 2, deaths: 4, assists: 8 },
          { name: "Izanami",  hero: "Lunox", kills: 6, deaths: 1, assists: 5 },
          { name: "Rezza",  hero: "Cici", kills: 0, deaths: 3, assists: 7 },
          { name: "Daniel",  hero: "Khaleed", kills: 3, deaths: 4, assists: 7},

          // Monster Vicious Players
          { name: "Rough",  hero: "Obsidia", kills: 7, deaths: 3, assists: 5 },
          { name: "Unii",  hero: "Yi Sun-Shin", kills: 2, deaths: 4, assists: 9 },
          { name: "Bondolz",  hero: "Zhuxin", kills: 3, deaths: 3, assists: 8 },
          { name: "Momo",  hero: "Lapu-Lapu", kills: 3, deaths: 2, assists: 5 },
          { name: "Lyoni",  hero: "Grock", kills: 0, deaths: 5, assists: 9},

        ], objectives: {
          lord: { "Homebois":3 , "Monster Vicious":0  },
          turtle: { "Homebois":3 , "Monster Vicious":0  },
          tower: { "Homebois":8 , "Monster Vicious":4  }
        }
      },
    ]},
              //week 5 friday match 1 (srg 2-0 tr)
  {
        teamA: "Selangor Red Giants",
        teamB: "Team Rey",
        games: [
            { //game 1
        winner: "Selangor Red Giants",
        bans: ["Arlott","Zhuxin","Fanny","Ruby","Harith","Grock","Esmeralda", "Chip","Wanwan", "Kalea"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Cici", kills: 1, deaths: 0, assists: 7 },
          { name: "Sekys",  hero: "Lancelot", kills: 4, deaths: 0, assists: 6 },
          { name: "Stormie",  hero: "Kimmy", kills: 2, deaths: 0, assists: 12 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills: 8, deaths: 1, assists: 4 },
          { name: "Yums",  hero: "Gatotkaca", kills: 2, deaths: 0, assists: 12},

          // Team Rey Players
          { name: "Jowm",  hero: "Karrie", kills: 0, deaths: 2, assists: 1 },
          { name: "Error404",  hero: "Yi Sun-Shin", kills: 0, deaths: 3, assists: 1 },
          { name: "Zayyy",  hero: "Lunox", kills: 1, deaths: 4, assists: 0 },
          { name: "Der",  hero: "Uranus", kills: 0, deaths: 3, assists: 1 },
          { name: "NovaXCobar",  hero: "Badang", kills: 0, deaths: 5, assists: 1},


        ], objectives: {
          lord: { "Selangor Red Giants":1 , "Team Rey":0  },
          turtle: { "Selangor Red Giants":3 , "Team Rey":0  },
          tower: { "Selangor Red Giants":8 , "Team Rey":2  }
        }
      },
            { //game 2
        winner: "Selangor Red Giants",
        bans: ["Kalea","Chip","Wanwan","Pharsa","Lapu-Lapu","Uranus","Arlott", "Fanny","Angela", "Baxia"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Granger", kills: 8, deaths: 2, assists: 3 },
          { name: "Sekys",  hero: "Lancelot", kills: 5, deaths: 0, assists: 3 },
          { name: "Stormie",  hero: "Kagura", kills: 1, deaths: 1, assists: 10 },
          { name: "Kramm",  hero: "Cici", kills: 0, deaths: 1, assists: 8 },
          { name: "Yums",  hero: "Grock", kills: 1, deaths: 1, assists: 10},

          // Team Rey Players
          { name: "Jowm",  hero: "Harith", kills: 0, deaths: 1, assists: 3 },
          { name: "Error404",  hero: "Hayabusa", kills: 2, deaths: 3, assists: 0 },
          { name: "Zayyy",  hero: "Kimmy", kills: 2, deaths: 3, assists: 2 },
          { name: "Der",  hero: "Esmeralda", kills: 1, deaths: 5, assists: 2 },
          { name: "NovaXCobar",  hero: "Badang", kills: 0, deaths: 3, assists: 2},

        ], objectives: {
          lord: { "Selangor Red Giants":1 , "Team Rey":0  },
          turtle: { "Selangor Red Giants":3 , "Team Rey":0  },
          tower: { "Selangor Red Giants":8 , "Team Rey":0  }
        }
      },
    ]},
      //week 5 friday match 2 (unt 2-0 hb)
  {
        teamA: "Untitled",
        teamB: "Homebois",
        games: [
            { //game 1
        winner: "Untitled",
        bans: ["Fanny","Chip","Cici","Hayabusa","Zhuxin","Lancelot","Gatotkaca", "Angela","Baxia", "Fredrinn"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 6, deaths: 1, assists: 8 },
          { name: "Keymin",  hero: "Yi Sun-Shin", kills: 7, deaths: 1, assists: 8 },
          { name: "Stowm",  hero: "Kimmy", kills: 0, deaths: 3, assists: 15 },
          { name: "Sizkaa",  hero: "Arlott", kills: 3, deaths: 4, assists: 8 },
          { name: "Rasy",  hero: "Chou", kills: 2, deaths: 3, assists: 7},

          //hb players
          { name: "Melqt",  hero: "Obsidia", kills: 4, deaths: 3, assists: 2 },
          { name: "Eyymal",  hero: "Joy", kills: 5, deaths: 3, assists: 2 },
          { name: "Izanami",  hero: "Lunox", kills: 0, deaths: 4, assists: 3 },
          { name: "Rezza",  hero: "Hilda", kills: 1, deaths: 5, assists: 8 },
          { name: "Daniel",  hero: "Kalea", kills: 1, deaths: 3, assists: 6},

        ], objectives: {
          lord: { "Untitled":2 , "Homebois":0  },
          turtle: { "Untitled": 2, "Homebois": 1 },
          tower: { "Untitled": 7, "Homebois":2  }
        }
      },
            { //game 2
        winner: "Untitled",
        bans: ["Fanny","Chip","Cici","Hilda","Phoveus","Guinevere","Yve", "Angela","Fredrinn", "Baxia"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 7, deaths: 1, assists: 1 },
          { name: "Keymin",  hero: "Lancelot", kills: 0, deaths: 0, assists: 4 },
          { name: "Stowm",  hero: "Kimmy", kills: 1, deaths: 2, assists: 6 },
          { name: "Sizkaa",  hero: "Arlott", kills: 1, deaths: 2, assists: 1 },
          { name: "Rasy",  hero: "Gatotkaca", kills: 0, deaths: 1, assists: 4},

          //hb players
          { name: "Melqt",  hero: "Moskov", kills: 0, deaths: 1, assists: 4 },
          { name: "Eyymal",  hero: "Yi Sun-Shin", kills: 3, deaths: 1, assists: 2 },
          { name: "Izanami",  hero: "Zhuxin", kills: 3, deaths: 2, assists: 0 },
          { name: "Rezza",  hero: "Hylos", kills: 0, deaths: 2, assists: 2 },
          { name: "Daniel",  hero: "Chou", kills: 0, deaths: 3, assists: 5},

        ], objectives: {
          lord: { "Untitled":0 , "Homebois":1  },
          turtle: { "Untitled": 2, "Homebois": 1 },
          tower: { "Untitled": 5, "Homebois":5  }
        }
      },
                
          
    ]},
      //week 5 saturday match 1 (hb 2-1 cg)
  {
        teamA: "Homebois",
        teamB: "CG Esports",
        games: [
            { //game 1
        winner: "Homebois",
        bans: ["Zhuxin","Yi Sun-Shin","Kalea","Benedetta","Angela","Chip","Kaja", "Lancelot","Fanny", "Cici"],
        players: [
          //hb players
          { name: "Melqt",  hero: "Lunox", kills: 5, deaths: 5, assists: 5 },
          { name: "Eyymal",  hero: "Hayabusa", kills: 9, deaths: 3, assists: 4 },
          { name: "Izanami",  hero: "Yve", kills: 3, deaths: 3, assists: 8 },
          { name: "Rezza",  hero: "Hilda", kills: 1, deaths: 7, assists: 2 },
          { name: "Daniel",  hero: "Guinevere", kills: 1, deaths: 1, assists: 6},

          // cg Players
          { name: "Amzziq",  hero: "Granger", kills: 10, deaths: 6, assists: 5 },
          { name: "Gary",  hero: "Baxia", kills: 2, deaths: 2, assists: 12 },
          { name: "Ciku",  hero: "Kimmy", kills: 2, deaths: 5, assists: 12 },
          { name: "Ye3",  hero: "Lapu-Lapu", kills: 4, deaths: 2, assists: 6 },
          { name: "Valenz",  hero: "Chou", kills: 1, deaths: 4, assists: 11},

        ], objectives: {
          lord: { "Homebois":2 , "CG Esports":2  },
          turtle: { "Homebois":0 , "CG Esports":3  },
          tower: { "Homebois":2 , "CG Esports": 2 }
        }
      },
            { //game 2
        winner: "CG Esports",
        bans: ["Yi Sun-Shin","Kalea","Zhuxin","Harith","Esmeralda","Yve","Pharsa", "Hayabusa","Fanny", "Cici"],
        players: [
           //hb players
          { name: "Melqt",  hero: "Granger", kills: 1, deaths: 3, assists: 0 },
          { name: "Eyymal",  hero: "Joy", kills: 1, deaths: 4, assists: 1 },
          { name: "Izanami",  hero: "Angela", kills: 1, deaths: 1, assists: 2 },
          { name: "Rezza",  hero: "Alice", kills: 0, deaths: 2, assists: 3 },
          { name: "Daniel",  hero: "Chou", kills: 0, deaths: 6, assists: 3},


                    // cg Players
          { name: "Amzziq",  hero: "Wanwan", kills: 1, deaths: 0, assists: 4 },
          { name: "Gary",  hero: "Lancelot", kills: 6, deaths: 0, assists: 6 },
          { name: "Ciku",  hero: "Lunox", kills: 7, deaths: 0, assists: 8 },
          { name: "Ye3",  hero: "Hilda", kills: 2, deaths: 2, assists: 5 },
          { name: "Valenz",  hero: "Grock", kills: 0, deaths: 1, assists: 5},

        ], objectives: {
          lord: { "Homebois":0 , "CG Esports":1  },
          turtle: { "Homebois":0 , "CG Esports":3  },
          tower: { "Homebois":0 , "CG Esports": 8 }
        }
      },
      { //game 3
        winner: "Homebois",
        bans: ["Yi Sun-Shin","Kalea","Zhuxin","Kimmy","Odette","Fredrinn","Joy", "Hayabusa","Fanny", "Cici"],
        players: [
          //hb players
          { name: "Melqt",  hero: "Moskov", kills: 5, deaths: 0, assists: 3 },
          { name: "Eyymal",  hero: "Benedetta", kills: 1, deaths: 0, assists: 10 },
          { name: "Izanami",  hero: "Lunox", kills: 7, deaths: 1, assists: 7 },
          { name: "Rezza",  hero: "Hilda", kills: 2, deaths: 1, assists: 5 },
          { name: "Daniel",  hero: "Chou", kills: 1, deaths: 4, assists: 5},

          // cg Players
          { name: "Amzziq",  hero: "Harith", kills: 3, deaths: 0, assists: 0 },
          { name: "Gary",  hero: "Lancelot", kills: 2, deaths: 3, assists: 2 },
          { name: "Ciku",  hero: "Xavier", kills: 1, deaths: 4, assists: 4 },
          { name: "Ye3",  hero: "Lapu-Lapu", kills: 0, deaths: 5, assists: 4 },
          { name: "Valenz",  hero: "Grock", kills: 0, deaths: 4, assists: 3},

        ], objectives: {
          lord: { "Homebois":3 , "CG Esports":0  },
          turtle: { "Homebois":1 , "CG Esports":1  },
          tower: { "Homebois":9 , "CG Esports": 1 }
        }
      },
    ]},
      //week 5 sat match 2 (Aero 0-2 mv)
  {
        teamA: "AERO Esports",
        teamB: "Monster Vicious",
        games: [
            { //game 1
        winner: "Monster Vicious",
        bans: ["Zhuxin","Kalea","Pharsa","Chou","Harith","Lunox","Kimmy", "Grock","Fanny", "Arlott"],
        players: [

          // AERO Esports Players
          { name: "Kusey",  hero: "Irithel", kills: 4, deaths: 1, assists: 4 },
          { name: "Hazle",  hero: "Joy", kills: 7, deaths: 2, assists: 5 },
          { name: "Kyym",  hero: "Angela", kills: 0, deaths: 2, assists: 11 },
          { name: "Smooth",  hero: "Phoveus", kills: 2, deaths: 4, assists: 3 },
          { name: "Zqeef",  hero: "Gloo", kills: 1, deaths: 3, assists: 4},

          // Monster Vicious Players
          { name: "Rough",  hero: "Granger", kills: 4, deaths: 4, assists: 3 },
          { name: "Unii",  hero: "Baxia", kills: 2, deaths: 3, assists: 9 },
          { name: "Bondolz",  hero: "Vexana", kills: 2, deaths: 3, assists: 8 },
          { name: "Momo",  hero: "Cici", kills: 3, deaths: 1, assists: 8 },
          { name: "Lyoni",  hero: "Franco", kills: 1, deaths: 3, assists: 11},

        ], objectives: {
          lord: { "AERO Esports": 1, "Monster Vicious":2  },
          turtle: { "AERO Esports": 1, "Monster Vicious": 1 },
          tower: { "AERO Esports":4 , "Monster Vicious":9  }
        }
      },
            { //game 2
        winner: "Monster Vicious",
        bans: ["Arlott","Grock","Chip","Ruby","Phoveus","Granger","Esmeralda", "Fanny","Cici", "Zhuxin"],
        players: [
          // AERO Esports Players
          { name: "Kusey",  hero: "Wanwan", kills: 2, deaths: 1, assists: 3 },
          { name: "Hazle",  hero: "Lancelot", kills: 4, deaths: 2, assists: 2 },
          { name: "Kyym",  hero: "Pharsa", kills: 2, deaths: 1, assists: 5 },
          { name: "Smooth",  hero: "Edith", kills: 0, deaths: 6, assists: 6 },
          { name: "Zqeef",  hero: "Kalea", kills: 0, deaths: 7, assists: 7},

          // Monster Vicious Players
          { name: "Rough",  hero: "Harith", kills: 3, deaths: 1, assists: 10 },
          { name: "Unii",  hero: "Yi Sun-Shin", kills: 5, deaths: 1, assists: 10 },
          { name: "Bondolz",  hero: "Kimmy", kills: 5, deaths: 1, assists: 11 },
          { name: "Momo",  hero: "Alice", kills: 2, deaths: 1, assists: 9 },
          { name: "Lyoni",  hero: "Gatotkaca", kills: 2, deaths: 4, assists: 13},

        ], objectives: {
          lord: { "AERO Esports": 0, "Monster Vicious":2  },
          turtle: { "AERO Esports": 0, "Monster Vicious": 3 },
          tower: { "AERO Esports":1 , "Monster Vicious":8  }
        }
      },
          
    ]},
      //week 5 SAT match 3 (VMS 1-2 TDK)
  {
        teamA: "Team Vamos",
        teamB: "Todak",
        games: [
            { //game 1
        winner: "Todak",
        bans: ["Fanny","Arlott","Baxia","Pharsa","Selena","Grock","Chou", "Kimmy","Chip", "Kalea"],
        players: [
          // VMS Players
          { name: "Natco",  hero: "Wanwan", kills: 1 , deaths:2 , assists:2  },
          { name: "Chibi",  hero: "Hayabusa", kills: 2, deaths: 3, assists: 1 },
          { name: "Clawkun",  hero: "Lunox", kills:1 , deaths:1 , assists:4 },
          { name: "Gojes",  hero: "Alice", kills:1 , deaths:2 , assists: 3 },
          { name: "Xorn",  hero: "Khaleed", kills:0 , deaths:4 , assists:2 },

          //todak player
          { name: "Loleal",  hero: "Cici", kills: 2, deaths: 1, assists: 4 },
          { name: "Zahyed",  hero: "Yi Sun-Shin", kills: 3, deaths: 0, assists: 4 },
          { name: "ZaimSempoi", hero: "Valentina", kills: 1, deaths: 0, assists: 10 },
          { name: "Fawndeer",  hero: "Phoveus", kills: 5, deaths: 2, assists: 5 },
          { name: "Dreams", hero: "Gatotkaca", kills: 1, deaths: 2, assists: 8},

        ], objectives: {
          lord: { "Team Vamos":0 , "Todak":2  },
          turtle: { "Team Vamos":0 , "Todak":2  },
          tower: { "Team Vamos":0 , "Todak":8  }
        }
      },
            { //game 2
        winner: "Team Vamos",
        bans: ["Fanny","Arlott","Wanwan","Gatotkaca","Harith","Valentina","Pharsa", "Kimmy","Chip", "Kalea"],
        players: [
          // VMS Players
          { name: "Natco",  hero: "Cici", kills: 5 , deaths:5 , assists:10  },
          { name: "Chibi",  hero: "Lancelot", kills: 3, deaths: 1, assists: 9 },
          { name: "Clawkun",  hero: "Yve", kills:5 , deaths:1 , assists:10 },
          { name: "Gojes",  hero: "Alice", kills:4 , deaths:3 , assists: 6 },
          { name: "Xorn",  hero: "Grock", kills:1 , deaths:0 , assists:11 },

          //todak player
          { name: "Loleal",  hero: "Esmeralda", kills: 1, deaths: 4, assists: 2 },
          { name: "Zahyed",  hero: "Yi Sun-Shin", kills: 7, deaths: 3, assists: 2 },
          { name: "ZaimSempoi", hero: "Lunox", kills: 1, deaths: 4, assists: 7 },
          { name: "Fawndeer",  hero: "Uranus", kills: 1, deaths: 2, assists: 5 },
          { name: "Dreams", hero: "Franco", kills: 0, deaths: 5, assists: 9},

        ], objectives: {
          lord: { "Team Vamos":1 , "Todak":1  },
          turtle: { "Team Vamos":3 , "Todak":0  },
          tower: { "Team Vamos":7 , "Todak":5  }
        }
      },
       { //game 3
        winner: "Todak",
        bans: ["Fanny","Arlott","Wanwan","Grock","Franco","Gloo","Esmeralda", "Cici","Kimmy", "Kalea"],
        players: [
          // VMS Players
          { name: "Natco",  hero: "Ruby", kills: 1 , deaths:3 , assists:3  },
          { name: "Chibi",  hero: "Yi Sun-Shin", kills: 1, deaths: 3, assists: 2 },
          { name: "Clawkun",  hero: "Pharsa", kills:2 , deaths:3 , assists:2 },
          { name: "Gojes",  hero: "Uranus", kills:0 , deaths:5 , assists: 0 },
          { name: "Xorn",  hero: "Chou", kills:0 , deaths:4 , assists:4 },

          //todak player
          { name: "Loleal",  hero: "Granger", kills: 10, deaths: 0, assists: 3 },
          { name: "Zahyed",  hero: "Baxia", kills: 1, deaths: 2, assists: 8 },
          { name: "ZaimSempoi", hero: "Kagura", kills: 3, deaths: 0, assists: 11 },
          { name: "Fawndeer",  hero: "Lapu-Lapu", kills: 2, deaths: 0, assists: 7 },
          { name: "Dreams", hero: "Hilda", kills: 2, deaths: 2, assists: 12},

        ], objectives: {
          lord: { "Team Vamos":0 , "Todak":2  },
          turtle: { "Team Vamos":0 , "Todak":3  },
          tower: { "Team Vamos":0 , "Todak":8  }
        }
      },
    ]},
      //week 5 sun match 1 (mv 0-2 SRG)
  {
        teamA: "Monster Vicious",
        teamB: "Selangor Red Giants",
        games: [
            { //game 1
        winner: "Selangor Red Giants",
        bans: ["Kalea","Cici","Baxia","Chou","Gatotkaca","Ruby","Harith", "Zhuxin","Arlott", "Fanny"],
        players: [
          // Monster Vicious Players
          { name: "Rough",  hero: "Bane", kills: 1, deaths: 3, assists: 3 },
          { name: "Unii",  hero: "Yi Sun-Shin", kills: 3, deaths: 4, assists: 3 },
          { name: "Bondolz",  hero: "Lunox", kills: 3, deaths: 3, assists: 5 },
          { name: "Momo",  hero: "Esmeralda", kills: 4, deaths: 4, assists: 5 },
          { name: "Lyoni",  hero: "Grock", kills: 0, deaths: 6, assists: 6},

          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Granger", kills: 7, deaths: 1, assists: 3 },
          { name: "Sekys",  hero: "Lancelot", kills: 5, deaths: 2, assists: 5 },
          { name: "Stormie",  hero: "Kimmy", kills: 2, deaths: 3, assists: 10 },
          { name: "Kramm",  hero: "Alice", kills: 0, deaths: 2, assists: 12 },
          { name: "Yums",  hero: "Hilda", kills: 6, deaths: 3, assists: 8},

        ], objectives: {
          lord: { "Monster Vicious": 0, "Selangor Red Giants": 2 },
          turtle: { "Monster Vicious":0 , "Selangor Red Giants": 3 },
          tower: { "Monster Vicious": 1, "Selangor Red Giants":9  }
        }
      },
            { //game 2
        winner: "Selangor Red Giants",
        bans: ["Arlott","Fanny","Zhuxin","Harith","Uranus","Lunox","Claude", "Kalea","Cici", "Baxia"],
        players: [
          // Monster Vicious Players
          { name: "Rough",  hero: "Esmeralda", kills: 1, deaths: 1, assists: 3 },
          { name: "Unii",  hero: "Yi Sun-Shin", kills: 3, deaths: 3, assists: 2 },
          { name: "Bondolz",  hero: "Kimmy", kills: 3, deaths: 5, assists: 4 },
          { name: "Momo",  hero: "Hilda", kills: 2, deaths: 4, assists: 0 },
          { name: "Lyoni",  hero: "Grock", kills: 0, deaths: 3, assists: 6},

          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Moskov", kills: 4, deaths: 1, assists: 8 },
          { name: "Sekys",  hero: "Lancelot", kills: 4, deaths: 2, assists: 3 },
          { name: "Stormie",  hero: "Selena", kills: 3, deaths: 2, assists: 9 },
          { name: "Kramm",  hero: "Alice", kills: 0, deaths: 2, assists: 11 },
          { name: "Yums",  hero: "Gatotkaca", kills: 5, deaths: 2, assists: 8},

        ], objectives: {
          lord: { "Monster Vicious": 0, "Selangor Red Giants": 1 },
          turtle: { "Monster Vicious":1 , "Selangor Red Giants": 2 },
          tower: { "Monster Vicious": 2, "Selangor Red Giants":6  }
        }
      },
       
    ]},

          //week 5 sun match 2 (tr 1-2 vms)
  {
        teamA: "Team Rey",
        teamB: "Team Vamos",
        games: [
            { //game 1
        winner: "Team Vamos",
        bans: ["Wanwan","Fanny","Angela","Moskov","Zhuxin","Faramis","Chip", "Kalea","Kimmy", "Pharsa"],
        players: [

          // Team Rey Players
          { name: "Jowm",  hero: "Ruby", kills: 1, deaths: 2, assists: 3 },
          { name: "Error404",  hero: "Joy", kills: 2, deaths: 2, assists: 1 },
          { name: "Zayyy",  hero: "Lylia", kills: 0, deaths: 1, assists: 5 },
          { name: "Der",  hero: "Uranus", kills: 3, deaths: 1, assists: 1 },
          { name: "NovaXCobar",  hero: "Chou", kills: 0, deaths: 4, assists: 5},

          // VMS Players
          { name: "Natco",  hero: "Cici", kills: 4 , deaths:0 , assists:2  },
          { name: "Chibi",  hero: "Baxia", kills: 1, deaths: 0, assists: 7 },
          { name: "Clawkun",  hero: "Lunox", kills:2 ,deaths:1 , assists:6 },
          { name: "Gojes",  hero: "Esmeralda", kills:1 , deaths:2 , assists: 7 },
          { name: "Xorn",  hero: "Helcurt", kills:2 , deaths:3 , assists:3 },

        ], objectives: {
          lord: { "Team Rey":0 , "Team Vamos":2  },
          turtle: { "Team Rey":2 , "Team Vamos":1  },
          tower: { "Team Rey":1 , "Team Vamos":9  }
        }
      },
            { //game 2
        winner: "Team Rey",
        bans: ["Kalea","Baxia","Wanwan","Harith","Alice","Hilda","Gatotkaca", "Angela","Cici", "Fanny"],
        players: [
          // Team Rey Players
          { name: "Jowm",  hero: "Ruby", kills: 1, deaths: 2, assists: 12 },
          { name: "Error404",  hero: "Yi Sun-Shin", kills: 7, deaths: 1, assists: 9 },
          { name: "Zayyy",  hero: "Kimmy", kills: 5, deaths: 0, assists: 9 },
          { name: "Der",  hero: "Esmeralda", kills: 4, deaths: 1, assists: 3 },
          { name: "NovaXCobar",  hero: "Khaleed", kills: 2, deaths: 1, assists: 7},

          // VMS Players
          { name: "Natco",  hero: "Granger", kills: 1 , deaths:4 , assists:3  },
          { name: "Chibi",  hero: "Hayabusa", kills: 3, deaths: 2, assists: 2 },
          { name: "Clawkun",  hero: "Pharsa", kills:0 , deaths:3 , assists:3 },
          { name: "Gojes",  hero: "Arlott", kills:0 , deaths:6 , assists: 1 },
          { name: "Xorn",  hero: "Chip", kills:1 , deaths:4 , assists:4 },

        ], objectives: {
          lord: { "Team Rey":2 , "Team Vamos":0  },
          turtle: { "Team Rey":2 , "Team Vamos":1  },
          tower: { "Team Rey":9 , "Team Vamos":2  }
        }
      },
       { //game 3
        winner: "Team Vamos",
        bans: ["Ruby","Fanny","Angela","Gatotkaca","Kimmy","Hayabusa","Lancelot", "Baxia","Cici", "Wanwan"],
        players: [

          // Team Rey Players
          { name: "Jowm",  hero: "Harith", kills: 2, deaths: 1, assists: 5 },
          { name: "Error404",  hero: "Yi Sun-Shin", kills: 3, deaths: 4, assists: 1 },
          { name: "Zayyy",  hero: "Zhuxin", kills: 0, deaths: 3, assists: 6 },
          { name: "Der",  hero: "Esmeralda", kills: 2, deaths: 2, assists: 4 },
          { name: "NovaXCobar",  hero: "Badang", kills: 1, deaths: 4, assists: 4},

          // VMS Players
          { name: "Natco",  hero: "Granger", kills: 6 , deaths:1 , assists:3  },
          { name: "Chibi",  hero: "Joy", kills: 4, deaths: 1, assists: 6 },
          { name: "Clawkun",  hero: "Lunox", kills:0 , deaths:1 , assists:6 },
          { name: "Gojes",  hero: "Alice", kills:2 , deaths:2 , assists: 7 },
          { name: "Xorn",  hero: "Kalea", kills:2 , deaths:3 , assists:9 },

        ], objectives: {
          lord: { "Team Rey":0 , "Team Vamos":3  },
          turtle: { "Team Rey":1 , "Team Vamos":2  },
          tower: { "Team Rey":2 , "Team Vamos":9  }
        }
      },
    ]},

      //week 5 sun match 3 (aero 2-0 GMXK)
  {
        teamA: "AERO Esports",
        teamB: "GAMESMY Kelantan",
        games: [
            { //game 1
        winner: "AERO Esports",
        bans: ["Angela","Gatotkaca","Zhuxin","Ruby","Bane","Harith","Chou", "Wanwan","Kalea", "Cici"],
        players: [

          //AERO
          { name: "Kusey",  hero: "Granger", kills: 3, deaths: 0, assists: 4 },
          { name: "Hazle",  hero: "Fanny", kills: 3, deaths: 1, assists: 1 },
          { name: "Kyym",  hero: "Pharsa", kills: 1, deaths: 0, assists: 6 },
          { name: "Smooth",  hero: "Esmeralda", kills: 3, deaths: 1, assists: 3 },
          { name: "Zqeef",  hero: "Grock", kills: 1, deaths: 1, assists: 5},

          // GAMESMY Kelantan Players
          { name: "Skyzar",  hero: "Bruno", kills: 0, deaths: 1, assists: 1 },
          { name: "Jaja",  hero: "Lancelot", kills: 0, deaths: 3, assists: 2 },
          { name: "Maima",  hero: "Valentina", kills: 1, deaths: 4, assists: 2 },
          { name: "Munster",  hero: "Alice", kills: 1, deaths: 2, assists: 2 },
          { name: "Matdinz",  hero: "Badang", kills: 1, deaths: 1, assists: 0},

        ], objectives: {
          lord: { "AERO Esports":1 , "GAMESMY Kelantan":0  },
          turtle: { "AERO Esports":1 , "GAMESMY Kelantan":1  },
          tower: { "AERO Esports":6 , "GAMESMY Kelantan":0  }
        }
      },
            { //game 2
        winner: "AERO Esports",
        bans: ["Fanny","Kalea","Baxia","Esmeralda","Grock","Yve","Lunox", "Lancelot","Gatotkaca", "Angela"],
        players: [

          //AERO
          { name: "Kusey",  hero: "Harith", kills: 1, deaths: 2, assists: 14 },
          { name: "Hazle",  hero: "Yi Sun-Shin", kills: 7, deaths: 3, assists: 7 },
          { name: "Kyym",  hero: "Zhuxin", kills: 2, deaths: 2, assists: 10 },
          { name: "Smooth",  hero: "Lapu-Lapu", kills: 6, deaths: 2, assists: 6 },
          { name: "Zqeef",  hero: "Chou", kills: 1, deaths: 4, assists: 6},


          // GAMESMY Kelantan Players
          { name: "Skyzar",  hero: "Cici", kills: 5, deaths: 3, assists: 4 },
          { name: "Jaja",  hero: "Joy", kills: 3, deaths: 5, assists: 4 },
          { name: "Maima",  hero: "Kagura", kills: 2, deaths: 2, assists: 6 },
          { name: "Munster",  hero: "Alice", kills: 2, deaths: 5, assists: 6 },
          { name: "Matdinz",  hero: "Khaleed", kills: 1, deaths: 2, assists: 8},
          
        ], objectives: {
          lord: { "AERO Esports":2 , "GAMESMY Kelantan":1  },
          turtle: { "AERO Esports":2 , "GAMESMY Kelantan":1  },
          tower: { "AERO Esports":9 , "GAMESMY Kelantan":5  }
        }
      },
    ]},
                  //week 6 friday match 1 (UNT 2-1 GMXK)
  {
        teamA: "Untitled",
        teamB: "GAMESMY Kelantan",
        games: [
            { //game 1
        winner: "GAMESMY Kelantan",
        bans: ["Fredrinn","Wanwan","Arlott","Granger","Grock","Lunox","Lapu-Lapu", "Fanny","Cici", "Angela"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Harith", kills: 7, deaths: 3, assists: 2 },
          { name: "Keymin",  hero: "Yi Sun-Shin", kills: 3, deaths: 4, assists: 9 },
          { name: "Stowm",  hero: "Zhuxin", kills: 1, deaths: 3, assists: 8 },
          { name: "Sizkaa",  hero: "Alice", kills: 2, deaths: 5, assists: 11 },
          { name: "Rasy",  hero: "Hilda", kills: 1, deaths: 4, assists: 10},

          // GAMESMY Kelantan Players
          { name: "Skyzar",  hero: "Karrie", kills: 3, deaths: 2, assists: 9 },
          { name: "Jaja",  hero: "Lancelot", kills: 7, deaths: 2, assists: 6 },
          { name: "Maima",  hero: "Kimmy", kills: 5, deaths: 2, assists: 8 },
          { name: "Munster",  hero: "Uranus", kills: 3, deaths: 4, assists: 9 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 1, deaths: 4, assists: 13},


        ], objectives: {
          lord: { "Untitled":0 , "GAMESMY Kelantan":3  },
          turtle: { "Untitled":3 , "GAMESMY Kelantan":0  },
          tower: { "Untitled":3 , "GAMESMY Kelantan":8  }
        }
      },
            { //game 2
        winner: "Untitled",
        bans: ["Fredrinn","Wanwan","Arlott","Grock","Zhuxin","Ruby","Uranus", "Fanny","Cici", "Angela"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 12, deaths: 0, assists: 4 },
          { name: "Keymin",  hero: "Baxia", kills: 2, deaths: 1, assists: 15 },
          { name: "Stowm",  hero: "Yve", kills: 1, deaths: 1, assists: 16 },
          { name: "Sizkaa",  hero: "Lapu-Lapu", kills: 5, deaths: 1, assists: 12 },
          { name: "Rasy",  hero: "Chou", kills: 1, deaths: 1, assists: 12},

          // GAMESMY Kelantan Players
          { name: "Skyzar",  hero: "Natan", kills: 1, deaths: 3, assists: 1 },
          { name: "Jaja",  hero: "Lancelot", kills: 1, deaths: 4, assists: 1 },
          { name: "Maima",  hero: "Kimmy", kills: 1, deaths: 2, assists: 2 },
          { name: "Munster",  hero: "Esmeralda", kills: 1, deaths: 5, assists: 0 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 0, deaths: 7, assists: 3},

        ], objectives: {
          lord: { "Untitled":2 , "GAMESMY Kelantan":1  },
          turtle: { "Untitled":0 , "GAMESMY Kelantan":3  },
          tower: { "Untitled":8 , "GAMESMY Kelantan":3  }
        }
      },
      { //game 3
        winner: "Untitled",
        bans: ["Fredrinn","Wanwan","Baxia","Harith","Grock","Uranus","Cici", "Phoveus","Fanny", "Angela"],
        players: [
          // Untitled Players
          { name: "Skyzed",  hero: "Claude", kills: 0, deaths: 3, assists: 6 },
          { name: "Keymin",  hero: "Lancelot", kills: 4, deaths: 4, assists: 5 },
          { name: "Stowm",  hero: "Kimmy", kills: 6, deaths: 2, assists: 6 },
          { name: "Sizkaa",  hero: "Arlott", kills: 3, deaths: 6, assists: 4 },
          { name: "Rasy",  hero: "Chou", kills: 1, deaths: 4, assists: 9},

          // GAMESMY Kelantan Players
          { name: "Skyzar",  hero: "Granger", kills: 5, deaths: 1, assists: 4 },
          { name: "Jaja",  hero: "Yi Sun-Shin", kills: 3, deaths: 4, assists: 11 },
          { name: "Maima",  hero: "Kadita", kills: 1, deaths: 3, assists: 12 },
          { name: "Munster",  hero: "Lapu-Lapu", kills: 7, deaths: 2, assists: 6 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 3, deaths: 4, assists: 9},

        ], objectives: {
          lord: { "Untitled":4 , "GAMESMY Kelantan":0  },
          turtle: { "Untitled":0 , "GAMESMY Kelantan":3  },
          tower: { "Untitled":9 , "GAMESMY Kelantan":5  }
        }
      },
    ]},
      //week 6 friday match 2 (AERO 2-0 hb)
  {
        teamA: "AERO Esports",
        teamB: "Homebois",
        games: [
            { //game 1
        winner: "AERO Esports",
        bans: ["Yi Sun-Shin","Angela","Fanny","Joy","Guinevere","Khaleed","Grock", "Hayabusa","Lunox", "Chou"],
        players: [
          //AERO
          { name: "Kusey",  hero: "Granger", kills: 12, deaths: 0, assists: 2 },
          { name: "Hazle",  hero: "Baxia", kills: 0, deaths: 2, assists: 16 },
          { name: "Kyym",  hero: "Zhuxin", kills: 2, deaths: 0, assists: 15 },
          { name: "Smooth",  hero: "Esmeralda", kills: 4, deaths: 0, assists: 5 },
          { name: "Zqeef",  hero: "Kalea", kills: 1, deaths: 3, assists: 15},

          //hb players
          { name: "Melqt",  hero: "Cici", kills: 0, deaths: 2, assists: 1 },
          { name: "Eyymal",  hero: "Lancelot", kills: 2, deaths: 3, assists: 1 },
          { name: "Izanami",  hero: "Yve", kills: 1, deaths: 3, assists: 1 },
          { name: "Rezza",  hero: "Uranus", kills: 1, deaths: 3, assists: 4 },
          { name: "Daniel",  hero: "Hilda", kills: 1, deaths: 8, assists: 4},

        ], objectives: {
          lord: { "AERO Esports":1 , "Homebois":0  },
          turtle: { "AERO Esports": 2, "Homebois": 1 },
          tower: { "AERO Esports": 8, "Homebois":2  }
        }
      },
            { //game 2
        winner: "AERO Esports",
        bans: ["Chou","Lunox","Hayabusa","Alice","Joy","Grock","Uranus", "Fanny","Esmeralda", "Angela"],
        players: [
          //AERO
          { name: "Kusey",  hero: "Harith", kills: 1, deaths: 2, assists: 12 },
          { name: "Hazle",  hero: "Baxia", kills: 3, deaths: 2, assists: 12 },
          { name: "Kyym",  hero: "Kimmy", kills: 11, deaths: 3, assists: 3 },
          { name: "Smooth",  hero: "Cici", kills: 1, deaths: 4, assists: 12 },
          { name: "Zqeef",  hero: "Hylos", kills: 1, deaths: 6, assists: 14},

          //hb players
          { name: "Melqt",  hero: "Granger", kills: 6, deaths: 1, assists: 5 },
          { name: "Eyymal",  hero: "Benedetta", kills: 6, deaths: 3, assists: 8 },
          { name: "Izanami",  hero: "Zhuxin", kills: 1, deaths: 3, assists: 9 },
          { name: "Rezza",  hero: "Hilda", kills: 3, deaths: 3, assists: 8 },
          { name: "Daniel",  hero: "Kalea", kills: 1, deaths: 7, assists: 8},

        ], objectives: {
          lord: { "AERO Esports":2 , "Homebois":2  },
          turtle: { "AERO Esports": 0, "Homebois": 3 },
          tower: { "AERO Esports": 7, "Homebois":7  }
        }
      },
                
          
    ]},
      //week 6 saturday match 1 (GMXK 0-2 MV)
  {
        teamA: "GAMESMY Kelantan",
        teamB: "Monster Vicious",
        games: [
            { //game 1
        winner: "Monster Vicious",
        bans: ["Angela","Cici","Uranus","Lapu-Lapu","Granger","Wanwan","Harith", "Arlott","Chip", "Fanny"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Skyzar",  hero: "Bruno", kills: 1, deaths: 2, assists: 0 },
          { name: "Jaja",  hero: "Joy", kills: 1, deaths: 3, assists: 0 },
          { name: "Maima",  hero: "Kimmy", kills: 0, deaths: 2, assists: 1 },
          { name: "Munster",  hero: "Hilda", kills: 0, deaths: 3, assists: 1 },
          { name: "Matdinz",  hero: "Gatotkaca", kills: 0, deaths: 2, assists: 2},

          // Monster Vicious Players
          { name: "Rough",  hero: "Bane", kills: 6, deaths: 1, assists: 3 },
          { name: "Unii",  hero: "Lancelot", kills: 2, deaths: 0, assists: 5 },
          { name: "Bondolz",  hero: "Zhuxin", kills: 2, deaths: 0, assists: 9 },
          { name: "Momo",  hero: "Alice", kills: 1, deaths: 0, assists: 8 },
          { name: "Lyoni",  hero: "Grock", kills: 1, deaths: 1, assists: 10},


        ], objectives: {
          lord: { "GAMESMY Kelantan":0 , "Monster Vicious":2  },
          turtle: { "GAMESMY Kelantan":1 , "Monster Vicious":2  },
          tower: { "GAMESMY Kelantan":2 , "Monster Vicious": 8 }
        }
      },
            { //game 2
        winner: "Monster Vicious",
        bans: ["Fanny","Chip","Zhuxin","Guinevere","Joy","Harith","Franco", "Cici","Lancelot", "Angela"],
        players: [
          // GAMESMY Kelantan Players
          { name: "Skyzar",  hero: "Claude", kills: 0, deaths: 1, assists: 1 },
          { name: "Jaja",  hero: "Baxia", kills: 1, deaths: 5, assists: 0 },
          { name: "Maima",  hero: "Kimmy", kills: 0, deaths: 4, assists: 0 },
          { name: "Munster",  hero: "Lapu-Lapu", kills: 0, deaths: 5, assists: 0 },
          { name: "Matdinz",  hero: "Khaleed", kills: 0, deaths: 4, assists: 0},

          // Monster Vicious Players
          { name: "Rough",  hero: "Granger", kills: 5, deaths: 0, assists: 2 },
          { name: "Unii",  hero: "Akai", kills: 0, deaths: 0, assists: 12 },
          { name: "Bondolz",  hero: "Yve", kills: 3, deaths: 1, assists: 9 },
          { name: "Momo",  hero: "Arlott", kills: 10, deaths: 0, assists: 5 },
          { name: "Lyoni",  hero: "Grock", kills: 1, deaths: 0, assists: 13},


        ], objectives: {
          lord: { "GAMESMY Kelantan":0 , "Monster Vicious":1  },
          turtle: { "GAMESMY Kelantan":0 , "Monster Vicious":3  },
          tower: { "GAMESMY Kelantan":0 , "Monster Vicious": 7 }
        }
      },
      
    ]},
      //week 6 sat match 2 (CG 0-2 VMS)
  {
        teamA: "CG Esports",
        teamB: "Team Vamos",
        games: [
            { //game 1
        winner: "Team Vamos",
        bans: ["Chip","Chou","Cici","Gloo","Harith","Phoveus","Esmeralda", "Lunox","Kalea", "Wanwan"],
        players: [

          // CG Esports Players
          { name: "Ciku",  hero: "Claude", kills: 0, deaths: 3, assists: 2 },
          { name: "Gary",  hero: "Baxia", kills: 2, deaths: 3, assists: 1 },
          { name: "Aj",  hero: "Zhuxin", kills: 0, deaths: 3, assists: 3 },
          { name: "Ye3",  hero: "Hilda", kills: 0, deaths: 1, assists: 1 },
          { name: "Valenz",  hero: "Hylos", kills: 1, deaths: 1, assists: 1},

          // VMS Players
          { name: "Natco",  hero: "Bane", kills: 4 , deaths:2 , assists:6  },
          { name: "Chibi",  hero: "Lancelot", kills: 3, deaths: 1, assists: 4 },
          { name: "Clawkun",  hero: "Kimmy", kills:2 , deaths:0 , assists:6 },
          { name: "Gojes",  hero: "Yuzhong", kills:2 , deaths:0 , assists: 4 },
          { name: "Xorn",  hero: "Grock", kills:0 , deaths:0 , assists:7 },

        ], objectives: {
          lord: { "CG Esports": 0, "Team Vamos":1  },
          turtle: { "CG Esports": 1, "Team Vamos": 2 },
          tower: { "CG Esports":0 , "Team Vamos":9  }
        }
      },
            { //game 2
        winner: "Team Vamos",
        bans: ["Lunox","Kimmy","Yi Sun-Shin","Alice","Lapu-Lapu","Chip","Franco", "Lancelot","Kalea", "Cici"],
        players: [
          // CG Esports Players
          { name: "Trap",  hero: "Irithel", kills: 3, deaths: 2, assists: 11 },
          { name: "Gary",  hero: "Baxia", kills: 0, deaths: 6, assists: 13 },
          { name: "Ciku",  hero: "Zhuxin", kills: 11, deaths: 3, assists: 5 },
          { name: "Ye3",  hero: "Esmeralda", kills: 4, deaths: 2, assists: 8 },
          { name: "Valenz",  hero: "Grock", kills: 0, deaths: 6, assists: 11},

          // VMS Players
          { name: "Natco",  hero: "Wanwan", kills: 4 , deaths:1 , assists:12  },
          { name: "Chibi",  hero: "Fredrinn", kills: 1, deaths: 4, assists: 14 },
          { name: "Clawkun",  hero: "Yve", kills:7 , deaths:0 , assists:10 },
          { name: "Gojes",  hero: "Yuzhong", kills:7 , deaths:7 , assists: 5 },
          { name: "Xorn",  hero: "Chou", kills:0 , deaths:6 , assists:7 },

        ], objectives: {
          lord: { "CG Esports": 1, "Team Vamos":2  },
          turtle: { "CG Esports": 1, "Team Vamos": 2 },
          tower: { "CG Esports":8 , "Team Vamos":7  }
        }
      },
          
    ]},
      //week 6 SAT match 3 (tr 2-1 aero)
  {
        teamA: "Team Rey",
        teamB: "AERO Esports",
        games: [
            { //game 1
        winner: "Team Rey",
        bans: ["Harith","Wanwan","Granger","Beatrix","Karrie","Lancelot","Yi Sun-Shin", "Cici","Fanny", "Angela"],
        players: [
          // Team Rey Players
          { name: "Jowm",  hero: "Claude", kills: 2, deaths: 0, assists: 4 },
          { name: "Error404",  hero: "Baxia", kills: 0, deaths: 1, assists: 6 },
          { name: "Zakqt",  hero: "Kimmy", kills: 4, deaths: 0, assists: 4 },
          { name: "Der",  hero: "Esmeralda", kills: 2, deaths: 1, assists: 4 },
          { name: "NovaXCobar",  hero: "Gatotkaca", kills: 0, deaths: 0, assists: 6},

          //AERO
          { name: "Kusey",  hero: "Bruno", kills: 0, deaths: 1, assists: 2 },
          { name: "Hazle",  hero: "Hayabusa", kills: 2, deaths: 1, assists: 0 },
          { name: "Kyym",  hero: "Zhuxin", kills: 0, deaths: 1, assists: 2 },
          { name: "Smooth",  hero: "Lapu-Lapu", kills: 0, deaths: 2, assists: 0 },
          { name: "Zqeef",  hero: "Kalea", kills: 0, deaths: 3, assists: 1},

        ], objectives: {
          lord: { "Team Rey":2 , "AERO Esports":1  },
          turtle: { "Team Rey":3 , "AERO Esports":0  },
          tower: { "Team Rey":7 , "AERO Esports":6  }
        }
      },
            { //game 2
        winner: "AERO Esports",
        bans: ["Angela","Lunox","Fanny","Chou","Grock","Kalea","Franco", "Cici","Harith", "Wanwan"],
        players: [
          // Team Rey Players
          { name: "Jowm",  hero: "Granger", kills: 2, deaths: 2, assists: 0 },
          { name: "Error404",  hero: "Yi Sun-Shin", kills: 3, deaths: 3, assists: 1 },
          { name: "Zakqt",  hero: "Zhuxin", kills: 0, deaths: 2, assists: 5 },
          { name: "Der",  hero: "Gloo", kills: 0, deaths: 5, assists: 2 },
          { name: "NovaXCobar",  hero: "Gatotkaca", kills: 0, deaths: 3, assists: 4},

          //AERO
          { name: "Kusey",  hero: "Irithel", kills: 4, deaths: 0, assists: 2 },
          { name: "Hazle",  hero: "Hayabusa", kills: 5, deaths: 2, assists: 8 },
          { name: "Kyym",  hero: "Kimmy", kills: 6, deaths: 0, assists: 4 },
          { name: "Smooth",  hero: "Esmeralda", kills: 0, deaths: 1, assists: 9 },
          { name: "Zqeef",  hero: "Baxia", kills: 0, deaths: 2, assists: 7},

        ], objectives: {
          lord: { "Team Rey":0 , "AERO Esports":2  },
          turtle: { "Team Rey":1 , "AERO Esports":2  },
          tower: { "Team Rey":0 , "AERO Esports":9  }
        }
      },
       { //game 3
        winner: "Team Rey",
        bans: ["Harith","Wanwan","Granger","Kalea","Claude","Ruby","Gatotkaca", "Baxia","Fanny", "Angela"],
        players: [
          // Team Rey Players
          { name: "Jowm",  hero: "Cici", kills: 1, deaths: 1, assists: 7 },
          { name: "Error404",  hero: "Yi Sun-Shin", kills: 8, deaths: 0, assists: 6 },
          { name: "Zakqt",  hero: "Zhuxin", kills: 4, deaths: 1, assists: 7 },
          { name: "Der",  hero: "Uranus", kills: 0, deaths: 1, assists: 9 },
          { name: "NovaXCobar",  hero: "Khaleed", kills: 1, deaths: 0, assists: 7},

          //AERO
          { name: "Kusey",  hero: "Bane", kills: 1, deaths: 2, assists: 1 },
          { name: "Hazle",  hero: "Hayabusa", kills: 2, deaths: 2, assists: 0 },
          { name: "Kyym",  hero: "Lunox", kills: 0, deaths: 3, assists: 2 },
          { name: "Smooth",  hero: "Esmeralda", kills: 0, deaths: 4, assists: 1 },
          { name: "Zqeef",  hero: "Grock", kills: 0, deaths: 3, assists: 0},

        ], objectives: {
          lord: { "Team Rey":1 , "AERO Esports":0  },
          turtle: { "Team Rey":3 , "AERO Esports":0  },
          tower: { "Team Rey":8 , "AERO Esports":1  }
        }
      },
    ]},
      //week 6 sun match 1 (mv 0-2 tdk)
  {
        teamA: "Monster Vicious",
        teamB: "Todak",
        games: [
            { //game 1
        winner: "Todak",
        bans: ["Cici","Baxia","Uranus","Franco","Kaja","Alice","Phoveus", "Grock","Kimmy", "Zhuxin"],
        players: [
          // Monster Vicious Players
          { name: "Rough",  hero: "Esmeralda", kills: 1, deaths: 5, assists: 2 },
          { name: "Unii",  hero: "Fanny", kills: 1, deaths: 2, assists: 3 },
          { name: "Bondolz",  hero: "Lunox", kills: 1, deaths: 3, assists: 2 },
          { name: "Momo",  hero: "Thamuz", kills: 2, deaths: 5, assists: 1 },
          { name: "Lyoni",  hero: "Gatotkaca", kills: 0, deaths: 7, assists: 3},

          // Todak Players
          { name: "Loleal",  hero: "Chou", kills: 10, deaths: 1, assists: 4 },
          { name: "Zahyed",  hero: "Yi Sun-Shin", kills: 5, deaths: 0, assists: 9 },
          { name: "ZaimSempoi", hero: "Valentina", kills: 4, deaths: 0, assists: 15 },
          { name: "Fawndeer",  hero: "Arlott", kills: 2, deaths: 3, assists: 12 },
          { name: "Dreams", hero: "Badang", kills: 1, deaths: 1, assists: 17}

        ], objectives: {
          lord: { "Monster Vicious": 0, "Todak": 1 },
          turtle: { "Monster Vicious":1 , "Todak": 2 },
          tower: { "Monster Vicious": 0, "Todak":9  }
        }
      },
            { //game 2
        winner: "Todak",
        bans: ["Cici","Yi Sun-Shin","Baxia","Kaja","Franco","Selena","Valentina", "Grock","Kimmy", "Zhuxin"],
        players: [
          // Monster Vicious Players
          { name: "Rough",  hero: "Harith", kills: 1, deaths: 4, assists: 5 },
          { name: "Unii",  hero: "Fanny", kills: 4, deaths: 3, assists: 2 },
          { name: "Bondolz",  hero: "Yve", kills: 1, deaths: 4, assists: 7 },
          { name: "Momo",  hero: "Alice", kills: 3, deaths: 2, assists: 6 },
          { name: "Lyoni",  hero: "Gatotkaca", kills: 1, deaths: 5, assists: 3},

          // Todak Players
          { name: "Loleal",  hero: "Bane", kills: 4, deaths: 2, assists: 7 },
          { name: "Zahyed",  hero: "Lancelot", kills: 6, deaths: 3, assists: 6 },
          { name: "ZaimSempoi", hero: "Lunox", kills: 7, deaths: 2, assists: 8 },
          { name: "Fawndeer",  hero: "Ruby", kills: 1, deaths: 2, assists: 10 },
          { name: "Dreams", hero: "Chou", kills: 0, deaths: 1, assists: 14}

        ], objectives: {
          lord: { "Monster Vicious": 0, "Todak": 2 },
          turtle: { "Monster Vicious":1 , "Todak": 2 },
          tower: { "Monster Vicious": 3, "Todak":8  }
        }
      },
       
    ]},

          //week 6 sun match 2 (srg 2-0 unt)
  {
        teamA: "Selangor Red Giants",
        teamB: "Untitled",
        games: [
            { //game 1
        winner: "Selangor Red Giants",
        bans: ["Fredrinn","Arlott","Zhuxin","Guinevere","Chou","Yuzhong","Esmeralda", "Lancelot","Cici", "Fanny"],
        players: [

          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Claude", kills: 4, deaths: 0, assists: 4 },
          { name: "Sekys",  hero: "Baxia", kills: 3, deaths: 0, assists: 5 },
          { name: "Stormie",  hero: "Kimmy", kills: 2, deaths: 2, assists: 8 },
          { name: "Kramm",  hero: "Alice", kills: 2, deaths: 0, assists: 9 },
          { name: "Yums",  hero: "Gatotkaca", kills: 2, deaths: 0, assists: 6},

          // Untitled Players
          { name: "Skyzed",  hero: "Granger", kills: 0, deaths: 2, assists: 1 },
          { name: "Keymin",  hero: "Joy", kills: 1, deaths: 2, assists: 0 },
          { name: "Stowm",  hero: "Yve", kills: 0, deaths: 3, assists: 0 },
          { name: "Sizkaa",  hero: "Lapu-Lapu", kills: 1, deaths: 3, assists: 0 },
          { name: "Rasy",  hero: "Grock", kills: 0, deaths: 3, assists: 1}

        ], objectives: {
          lord: { "Selangor Red Giants":1 , "Untitled":0  },
          turtle: { "Selangor Red Giants":3 , "Untitled":0  },
          tower: { "Selangor Red Giants":7 , "Untitled":0  }
        }
      },
            { //game 2
        winner: "Selangor Red Giants",
        bans: ["Cici","Lancelot","Yi Sun-Shin","Joy","Claude","Mathilda","Benedetta", "Fredrinn","Arlott", "Baxia"],
        players: [
          // Selangor Red Giants Players
          { name: "Innocent",  hero: "Granger", kills: 5, deaths: 3, assists: 3 },
          { name: "Sekys",  hero: "Xborg", kills: 5, deaths: 1, assists: 8 },
          { name: "Stormie",  hero: "Kimmy", kills: 1, deaths: 2, assists: 9 },
          { name: "Kramm",  hero: "Lapu-Lapu", kills: 1, deaths: 2, assists: 10 },
          { name: "Yums",  hero: "Kalea", kills: 1, deaths: 2, assists: 7},

          // Untitled Players
          { name: "Skyzed",  hero: "Harith", kills: 2, deaths: 3, assists: 5 },
          { name: "Keymin",  hero: "Akai", kills: 2, deaths: 3, assists: 4 },
          { name: "Stowm",  hero: "Zhuxin", kills: 1, deaths: 0, assists: 3 },
          { name: "Sizkaa",  hero: "Masha", kills: 5, deaths: 3, assists: 0 },
          { name: "Rasy",  hero: "Chip", kills: 0, deaths: 4, assists: 6},

        ], objectives: {
          lord: { "Selangor Red Giants":1 , "Untitled":1  },
          turtle: { "Selangor Red Giants":2 , "Untitled":1  },
          tower: { "Selangor Red Giants":7 , "Untitled":4  }
        }
      },
       
    ]},
]
    


// === Functions ===


function calculateTeamStats() {
  let teamStats = {};
  for (let match of matches) {
    let teamAGameWins = 0, teamBGameWins = 0;

    for (let game of match.games) {
      if (!teamStats[match.teamA]) {
        teamStats[match.teamA] = {
          kills:0,deaths:0,assists:0,
          gamesPlayed:0,gameWins:0,
          matchesPlayed:0,matchWins:0,
          lord:0,turtle:0,tower:0
        };
      }
      if (!teamStats[match.teamB]) {
        teamStats[match.teamB] = {
          kills:0,deaths:0,assists:0,
          gamesPlayed:0,gameWins:0,
          matchesPlayed:0,matchWins:0,
          lord:0,turtle:0,tower:0
        };
      }

      if (game.winner === match.teamA) teamAGameWins++; else teamBGameWins++;

for (let player of game.players) {
  const info = getRoster(player.name);
  const t = info.team;

  if (!teamStats[t]) {
    teamStats[t] = {
      kills:0,deaths:0,assists:0,
      gamesPlayed:0,gameWins:0,
      matchesPlayed:0,matchWins:0,
      lord:0,turtle:0,tower:0
    };
  }

  teamStats[t].kills += player.kills;
  teamStats[t].deaths += player.deaths;
  teamStats[t].assists += player.assists;
}

      // objectives totals (safe if missing)
      if (game.objectives) {
        const l = game.objectives.lord || {};
        const tu = game.objectives.turtle || {};
        const to = game.objectives.tower || {};

        teamStats[match.teamA].lord += (l[match.teamA] || 0);
        teamStats[match.teamB].lord += (l[match.teamB] || 0);

        teamStats[match.teamA].turtle += (tu[match.teamA] || 0);
        teamStats[match.teamB].turtle += (tu[match.teamB] || 0);

        teamStats[match.teamA].tower += (to[match.teamA] || 0);
        teamStats[match.teamB].tower += (to[match.teamB] || 0);
      }

      teamStats[match.teamA].gamesPlayed++;
      teamStats[match.teamB].gamesPlayed++;
    }

    teamStats[match.teamA].gameWins += teamAGameWins;
    teamStats[match.teamB].gameWins += teamBGameWins;

    teamStats[match.teamA].matchesPlayed++;
    teamStats[match.teamB].matchesPlayed++;

    if (teamAGameWins > teamBGameWins) teamStats[match.teamA].matchWins++;
    else teamStats[match.teamB].matchWins++;
  }
  return teamStats;
}

function calculatePlayerStats() {
  let playerStats = {};

  // Seed from roster so subs show with 0 games
  for (const r of (roster || [])) {
    playerStats[r.name] = {
      team: r.team,
      lane: r.lane,
      games: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      kpTotal: 0,
      picture: r.picture
    };
  }

  // Add match data
  for (let match of matches) {
    for (let game of match.games) {

      // teamKills needs team info from roster
      let teamKills = {};
      for (let player of game.players) {
        const t = getRoster(player.name).team;
        if (!teamKills[t]) teamKills[t] = 0;
        teamKills[t] += player.kills;
      }

      for (let player of game.players) {
        const info = getRoster(player.name);

        // if player not in roster (typo/new), still include them
        if (!playerStats[player.name]) {
          playerStats[player.name] = {
            team: info.team,
            lane: info.lane,
            games: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            kpTotal: 0,
            picture: info.picture
          };
        }

        const ps = playerStats[player.name];
        ps.team = info.team;
        ps.lane = info.lane;
        ps.picture = info.picture;

        ps.games++;
        ps.kills += player.kills;
        ps.deaths += player.deaths;
        ps.assists += player.assists;

        const denom = teamKills[info.team] || 0;
        if (denom > 0) {
          ps.kpTotal += (player.kills + player.assists) / denom;
        }
      }
    }
  }

  return playerStats;
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
        return teamSort.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return teamSort.asc ? valA - valB : valB - valA;
    });
  }

  function arrow(key) {
    if (teamSort.key !== key) return ' <span style="opacity:0.4;">⇅</span>';
    return teamSort.asc ? ' <span>▲</span>' : ' <span>▼</span>';
  }

  let html = `
      <div class="rotateHint">
    📱 Rotate your phone for full table view
  </div>

    <table class="teamsTable">
      <tr>
        <th onclick="sortTeams('team')">TEAM${arrow('team')}</th>
        <th onclick="sortTeams('matchWins')">MATCHES WON${arrow('matchWins')}</th>
        <th onclick="sortTeams('kills')">KILLS${arrow('kills')}</th>
        <th onclick="sortTeams('deaths')">DEATHS${arrow('deaths')}</th>
        <th onclick="sortTeams('assists')">ASSISTS${arrow('assists')}</th>
        <th onclick="sortTeams('lord')">LORD${arrow('lord')}</th>
        <th onclick="sortTeams('turtle')">TURTLE${arrow('turtle')}</th>
        <th onclick="sortTeams('tower')">TOWER${arrow('tower')}</th>
      </tr>
  `;

  for (let ts of arr) {
    const logo = teamLogos[ts.team] || "";
    html += `
      <tr>
<td>
  <div class="teamCell">
    <img class="teamLogo" src="${teamLogos[ts.team]}" width="50" height="50">
    <span>${ts.team}</span>
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
        return playerSort.asc
          ? laneOrder[a.lane] - laneOrder[b.lane]
          : laneOrder[b.lane] - laneOrder[a.lane];
      }

      let valA = a[playerSort.key];
      let valB = b[playerSort.key];

      if (typeof valA === "string") {
        return playerSort.asc
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return playerSort.asc ? valA - valB : valB - valA;
    });
  }

function arrow(key) {
  if (playerSort.key !== key) {
    return ' <span style="opacity:0.4;">⇅</span>';
  }
  return playerSort.asc
    ? ' <span>▲</span>'
    : ' <span>▼</span>';
}
  // ===== START HTML =====
let html = `
<h2 style="text-align:center;">TOP PLAYERS MPL MY S16</h2>

<div class="topRow">
  <strong>TOP 5 KILLS:</strong>
  <div class="topItems">
${topKills.map((pl, i) => `
  <div class="topItem topRank topRank--${i+1} ${i===0 ? "topMVP" : ""}">
    
    <div class="avatarWrap">
      <img class="playerAvatar" src="${pl.picture}" alt="${pl.name}">
      
      <img class="teamMiniLogo"
           src="${teamLogos[pl.team] || ''}"
           alt="${pl.team}">
      
      <div class="rankBadge">#${i+1}</div>
    </div>

    <div class="topLabel">
      <span class="topName">${pl.name}</span>
      <span class="topValue">${pl.kills}</span>
    </div>

  </div>
`).join('')}
  </div>
</div>

<div class="topRow">
  <strong>TOP 5 ASSISTS:</strong>
  <div class="topItems">
    ${topAssists.map((pl, i) => `
      <div class="topItem topRank topRank--${i+1} ${i===0 ? "topMVP" : ""}">
        
        <div class="avatarWrap">
          <img class="playerAvatar" src="${pl.picture}" alt="${pl.name}">
          
          ${teamLogos[pl.team] 
            ? `<img class="teamMiniLogo" src="${teamLogos[pl.team]}" alt="${pl.team}">`
            : ''
          }

          <div class="rankBadge">#${i+1}</div>
        </div>

        <div class="topLabel">
          <span class="topName">${pl.name}</span>
          <span class="topValue">${pl.assists}</span>
        </div>

      </div>
    `).join('')}
  </div>
</div>

<div class="topRow">
  <strong>TOP 5 KDA:</strong>
  <div class="topItems">
    ${topKDA.map((pl, i) => `
      <div class="topItem topRank topRank--${i+1} ${i===0 ? "topMVP" : ""}">
        
        <div class="avatarWrap">
          <img class="playerAvatar" src="${pl.picture}" alt="${pl.name}">
          
          ${teamLogos[pl.team] 
            ? `<img class="teamMiniLogo" src="${teamLogos[pl.team]}" alt="${pl.team}">`
            : ''
          }

          <div class="rankBadge">#${i+1}</div>
        </div>

        <div class="topLabel">
          <span class="topName">${pl.name}</span>
          <span class="topValue">${pl.kda.toFixed(2)}</span>
        </div>

      </div>
    `).join('')}
  </div>
</div>




  <div style="margin-bottom:20px; display:flex; gap:20px; justify-content:center;">
    <div>
      <label>TEAM: </label>
      <select id="teamFilter" onchange="showPlayers()">
        <option value="ALL TEAMS">ALL TEAMS</option>
        ${teams.map(t => `<option value="${t}" ${t === currentTeam ? "selected" : ""}>${t}</option>`).join("")}
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
    📱 Rotate your phone for full table view
  </div>

  <table class="playersTable">
  <tr>
    <th onclick="sortPlayers('name')">PLAYER${arrow('name')}</th>
    <th onclick="sortPlayers('team')">TEAM${arrow('team')}</th>
    <th onclick="sortPlayers('lane')">ROLE${arrow('lane')}</th>
    <th onclick="sortPlayers('games')">GAMES${arrow('games')}</th>
    <th onclick="sortPlayers('kills')">KILLS${arrow('kills')}</th>
    <th onclick="sortPlayers('avgK')">AVG KILLS${arrow('avgK')}</th>
    <th onclick="sortPlayers('deaths')">DEATHS${arrow('deaths')}</th>
    <th onclick="sortPlayers('avgD')">AVG DEATHS${arrow('avgD')}</th>
    <th onclick="sortPlayers('assists')">ASSISTS${arrow('assists')}</th>
    <th onclick="sortPlayers('avgA')">AVG ASSISTS${arrow('avgA')}</th>
    <th onclick="sortPlayers('kda')">KDA${arrow('kda')}</th>
    <th onclick="sortPlayers('kp')">KP%${arrow('kp')}</th>
  </tr>
  `;

  for (let ps of arr) {
html += `
<tr>
  <td>
    <div class="teamCell">
      <img src="${ps.picture}" width="90" height="90" style="border-radius:50%;">
      <span>${ps.name}</span>
    </div>
  </td>

<td style="vertical-align:middle;">
  <div class="teamCell">
    <img class="teamLogo" src="${teamLogos[ps.team]}" width="50" height="50">
    <span>${ps.team}</span>
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
  else arr.sort((a,b)=>b.kda-b.kda); // kda numeric
  let top5 = arr.slice(0,5);
  let html = `<h2 style="text-align:center;">Top 5 Players - ${category.toUpperCase()}</h2><div style="display:flex; justify-content:center; gap:20px;">`;
  for (let pl of top5) {
    html += `<div style="text-align:center;"><img src="${pl.picture}" width="60" height="60"><br><b>${pl.name}</b><br>${pl.team}<br>${pl[category]}</div>`;
  }
  html += "</div>";
  document.getElementById("output").innerHTML = html;
}

function calculateHeroStats() {
  const heroStats = {};
  let totalGames = 0;

  for (const match of matches) {
    for (const game of (match.games || [])) {
      totalGames++;

      // Track which heroes were picked THIS game (so pickGames counts once per game)
      const pickedThisGame = new Set();

      // PICKS + WINS
      for (const p of (game.players || [])) {
        const h = String(p.hero || "").trim();
        if (!h) continue;

        if (!heroStats[h]) heroStats[h] = { hero: h, pick: 0, pickGames: 0, ban: 0, win: 0 };

        heroStats[h].pick += 1;          // total times picked (player-picks)
        pickedThisGame.add(h);           // used for per-game pick rate

        const team = getRoster(p.name).team;
        if (team === game.winner) heroStats[h].win += 1; // win per pick (same as before)
      }

      // After reading all players, add 1 pickGame for each hero picked this game
      for (const h of pickedThisGame) {
        heroStats[h].pickGames += 1;
      }

      // BANS (once per game per hero)
      if (Array.isArray(game.bans)) {
        const uniqueBans = new Set(game.bans.map(b => String(b).trim()));
        for (const b of uniqueBans) {
          if (!heroStats[b]) heroStats[b] = { hero: b, pick: 0, pickGames: 0, ban: 0, win: 0 };
          heroStats[b].ban += 1;
        }
      }
    }
  }

  // Include unused heroes too
  const allHeroes = new Set([
    ...Object.keys(constHero || {}),
    ...Object.keys(heroStats)
  ]);

  return Array.from(allHeroes).map(h => {
    const hs = heroStats[h] || { hero: h, pick: 0, pickGames: 0, ban: 0, win: 0 };

    return {
      hero: hs.hero,
      pick: hs.pick,
      pickRate: totalGames ? (hs.pickGames / totalGames) * 100 : 0, // ✅ per-game pick rate
      ban: hs.ban,
      banRate: totalGames ? (hs.ban / totalGames) * 100 : 0,
      winRate: hs.pick ? (hs.win / hs.pick) * 100 : 0,
      img: constHero[hs.hero] || ""
    };
  });
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
        return heroSort.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return heroSort.asc ? valA - valB : valB - valA;
    });
  }

  function arrow(key) {
    if (heroSort.key !== key) return ' <span style="opacity:0.4;">⇅</span>';
    return heroSort.asc ? ' <span>▲</span>' : ' <span>▼</span>';
  }

  // ===== unified top row renderer (centered + consistent card/avatar) =====
function renderTopRow(label, list, valueFn) {
  return `
    <div class="toprow">
      <div class="toprow-label">${label}</div>

      <div class="toprow-grid">
        ${list.map((item, i) => `
          <div class="topcard topRank topRank--${i+1} ${i===0 ? "topMVP" : ""}">
            <div class="rankBadge">#${i+1}</div>
            <img class="topavatar" src="${item.img}" alt="${item.hero}">
            <div class="topLabel">
              <span class="topName">${item.hero}</span>
              <span class="topValue">${valueFn(item)}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

const topPickRow = renderTopRow("TOP 5 PICK:", topPick, h => h.pick);
const topBanRow  = renderTopRow("TOP 5 BAN:",  topBan,  h => h.ban);
const topWinRow  = renderTopRow(winLabel,      topWin,  h => `${h.winRate.toFixed(1)}%`);

let html = `
<h2 class="panel-title">HERO STATS MPL MY S16</h2>

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
    📱 Rotate your phone for full table view
  </div>

  <table class="dataTable heroesTable">
    <tr>
      <th onclick="sortHeroes('hero')">HERO${arrow('hero')}</th>
      <th onclick="sortHeroes('pick')">PICK${arrow('pick')}</th>
      <th onclick="sortHeroes('pickRate')">PICK RATE${arrow('pickRate')}</th>
      <th onclick="sortHeroes('ban')">BAN${arrow('ban')}</th>
      <th onclick="sortHeroes('banRate')">BAN RATE${arrow('banRate')}</th>
      <th onclick="sortHeroes('winRate')">WIN RATE${arrow('winRate')}</th>
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

function calculateHeroPoolStats() {
  let pool = {};

  // 1) Seed from roster so 0-game players exist
  for (const r of (roster || [])) {
    pool[r.name] = {
      name: r.name,
      team: r.team,
      lane: r.lane,
      picture: r.picture,
      heroes: {} // heroName -> { games:0, wins:0 }
    };
  }

  // 2) Add match data
  for (let match of matches) {
    for (let game of (match.games || [])) {
      for (let player of (game.players || [])) {
        const info = getRoster(player.name);

        // If player not in roster (typo/new), still include them
        if (!pool[player.name]) {
          pool[player.name] = {
            name: player.name,
            team: info.team,
            lane: info.lane,
            picture: info.picture,
            heroes: {}
          };
        }

        const ps = pool[player.name];
        const heroName = player.hero;

        if (!ps.heroes[heroName]) ps.heroes[heroName] = { games: 0, wins: 0 };

        ps.heroes[heroName].games++;
        if (info.team === game.winner) ps.heroes[heroName].wins++;
      }
    }
  }

  return pool;
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
        return heroPoolSort.asc
          ? laneOrder[a.lane] - laneOrder[b.lane]
          : laneOrder[b.lane] - laneOrder[a.lane];
      }

      if (typeof valA === "string") {
        return heroPoolSort.asc
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return heroPoolSort.asc ? valA - valB : valB - valA;
    });
  }

  function arrow(key) {
    if (heroPoolSort.key !== key) return ' <span style="opacity:0.4;">⇅</span>';
    return heroPoolSort.asc ? ' <span>▲</span>' : ' <span>▼</span>';
  }

  // Render
  let html = `
    <h2 style="text-align:center;">HERO POOL MPL MY S16</h2>

    <div style="margin-bottom:20px; display:flex; gap:20px; justify-content:center;">
      <div>
        <label>TEAM: </label>
        <select id="hpTeamFilter" onchange="showHeroPool()">
          <option value="ALL TEAMS">ALL TEAMS</option>
          ${teams.map(t => `<option value="${t}" ${t === currentTeam ? "selected" : ""}>${t}</option>`).join("")}
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
    <div style="margin-bottom:20px; display:flex; justify-content:center;">
      <input
        id="hpPlayerSearch"
        type="text"
        placeholder="Search player..."
        value="${currentSearch.replace(/"/g, "&quot;")}"
        oninput="onHpPlayerSearchInput(event)"
        style="padding:10px 14px; width:320px; border-radius:10px; border:1px solid #444; background:#0b0b0b; color:#fff;"
      />
    </div>

          <div class="rotateHint">
    📱 Rotate your phone for full table view
  </div>

    <table class="heroPoolTable">
      <tr>
        <th onclick="sortHeroPool('name')">PLAYER${arrow('name')}</th>
        <th onclick="sortHeroPool('team')">TEAM${arrow('team')}</th>
        <th onclick="sortHeroPool('lane')">ROLE${arrow('lane')}</th>
        <th onclick="sortHeroPool('totalHeroes')">TOTAL HEROES${arrow('totalHeroes')}</th>
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
          style="border-radius:50%; object-fit:cover; border:2px solid #fff;"
        >
        <span>${h.hero} (${h.games} - ${h.winRate.toFixed(0)}%)</span>
      </span>
    `).join("");

    html += `
      <tr>
        <td style="vertical-align:middle;">
          <div style="display:flex; align-items:center; gap:10px; height:100%;">
            <img src="${ps.picture}" width="55" height="55"
              style="border-radius:50%; object-fit:cover; border:2px solid #fff;">
            <span>${ps.name}</span>
          </div>
        </td>

<td style="vertical-align:middle;">
  <div class="teamCell">
    <img class="teamLogo" src="${teamLogos[ps.team] || ""}" width="45" height="45">
    <span>${ps.team}</span>
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

function calculatePlayerPoolsStats() {
  let pools = {};

  // ✅ Seed all heroes so unused heroes exist
  for (const heroName of Object.keys(constHero || {})) {
    pools[heroName] = { hero: heroName, players: {} };
  }

  // Add match data
  for (let match of matches) {
    for (let game of (match.games || [])) {
      for (let player of (game.players || [])) {
        const heroName = player.hero;
        const info = getRoster(player.name);

        if (!pools[heroName]) {
          pools[heroName] = { hero: heroName, players: {} };
        }

        if (!pools[heroName].players[player.name]) {
          pools[heroName].players[player.name] = {
            name: player.name,
            team: info.team,
            lane: info.lane,
            picture: info.picture,
            games: 0,
            wins: 0
          };
        }

        pools[heroName].players[player.name].games++;
        if (info.team === game.winner) pools[heroName].players[player.name].wins++;
      }
    }
  }

  return pools;
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
        return playerPoolsSort.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return playerPoolsSort.asc ? valA - valB : valB - valA;
    });
  }

  function arrow(key) {
    if (playerPoolsSort.key !== key) return ' <span style="opacity:0.4;">⇅</span>';
    return playerPoolsSort.asc ? ' <span>▲</span>' : ' <span>▼</span>';
  }

  // ===== Render =====
  let html = `
    <h2 style="text-align:center;">PLAYER POOL MPL MY S16</h2>

    <div style="margin-bottom:20px; display:flex; gap:20px; justify-content:center;">
      <div>
        <label>TEAM: </label>
        <select id="ppTeamFilter" onchange="showPlayerPools()">
          ${teams.map(t => `<option value="${t}" ${t === currentTeam ? "selected" : ""}>${t}</option>`).join("")}
        </select>
      </div>

      <div>
        <label>ROLE: </label>
        <select id="ppLaneFilter" onchange="showPlayerPools()">
          ${lanes.map(l => `<option value="${l}" ${l === currentLane ? "selected" : ""}>${l}</option>`).join("")}
        </select>
      </div>
    </div>

    <div style="margin:14px 0 18px; display:flex; justify-content:center; align-items:center; gap:14px;">
      <input
        id="ppHeroSearch"
        type="text"
        placeholder="Search hero..."
        value="${currentSearch.replace(/"/g, "&quot;")}"
        oninput="onPpHeroSearchInput(event)"
        style="padding:10px 14px; width:320px; border-radius:10px; border:1px solid #444; background:#0b0b0b; color:#fff;"
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
    📱 Rotate your phone for full table view
  </div>

    <table class="playerPoolTable">
      <tr>
        <th onclick="sortPlayerPools('hero')">HERO${arrow('hero')}</th>
        <th onclick="sortPlayerPools('totalPlayers')">TOTAL PLAYERS${arrow('totalPlayers')}</th>
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
// ✅ HOME = TEAMS (auto render on first load)
window.addEventListener("DOMContentLoaded", () => {
  showTeams();
});
