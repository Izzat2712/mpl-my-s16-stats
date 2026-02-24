let teamSort = { key: null, asc: true };
let playerSort = { key: null, asc: true };

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

// MPL MY S16 matches array
let matches = [
  { //week 1 saturday match 1 (MV 2-0 VMS)
    teamA: "Monster Vicious",
    teamB: "Team Vamos",
    games: [
      { //game 1
        winner: "Monster Vicious",
        players: [
          // Monster Vicious Players
          { name: "Rough", team: "Monster Vicious", lane: "Gold Laner", hero: "Harith", kills: 3, deaths: 0, assists: 7, picture: "https://i.imgur.com/scpwgUa.png" },
          { name: "Unii", team: "Monster Vicious", lane: "Jungler", hero: "Fredrinn", kills: 3, deaths: 0, assists: 8, picture: "https://i.imgur.com/Y6cCEK4.png" },
          { name: "Bondolz", team: "Monster Vicious", lane: "Midlaner", hero: "Yve", kills: 2, deaths: 0, assists: 12, picture: "https://i.imgur.com/lLUfZVt.png" },
          { name: "Momo", team: "Monster Vicious", lane: "Exp Laner", hero: "Arlott", kills: 6, deaths: 1, assists: 5, picture: "https://i.imgur.com/aDKFRPI.png" },
          { name: "Lyoni", team: "Monster Vicious", lane: "Roamer", hero: "Chip", kills: 0, deaths: 1, assists: 12, picture: "https://i.imgur.com/ouVd1Kr.png"},

          // Team Vamos Players
          { name: "Natco", team: "Team Vamos", lane: "Gold Laner", hero: "Claude", kills: 0, deaths: 3, assists: 0, picture: "https://i.imgur.com/48b6SmK.png" },
          { name: "Chibi", team: "Team Vamos", lane: "Jungler", hero: "Yi Sun-Shin", kills: 2, deaths: 3, assists: 0, picture: "https://i.imgur.com/ahEyDfv.png" },
          { name: "Clawkun", team: "Team Vamos", lane: "Midlaner", hero: "Kimmy", kills: 0, deaths: 2, assists: 2, picture: "https://i.imgur.com/mDZrBXV.png" },
          { name: "Gojes", team: "Team Vamos", lane: "Exp Laner", hero: "Uranus", kills: 0, deaths: 2, assists: 0, picture: "https://i.imgur.com/2inGQSn.png" },
          { name: "Xorn", team: "Team Vamos", lane: "Roamer", hero: "Hylos", kills: 0, deaths: 4, assists: 0, picture: "https://i.imgur.com/Ux5auTn.png"}
        ], objectives: {
          lord: { "Monster Vicious": 1, "Team Vamos": 0 },
          turtle: { "Monster Vicious": 3, "Team Vamos": 0 },
          tower: { "Monster Vicious": 7, "Team Vamos": 0 }
        }
      },
      { //game 2
        winner: "Monster Vicious",
        players: [
          // Monster Vicious Players
          { name: "Rough", team: "Monster Vicious", lane: "Gold Laner", hero: "Esmeralda", kills: 4, deaths: 0, assists: 8, picture: "https://i.imgur.com/scpwgUa.png" },
          { name: "Unii", team: "Monster Vicious", lane: "Jungler", hero: "Yi Sun-Shin", kills: 4, deaths: 0, assists: 11, picture: "https://i.imgur.com/Y6cCEK4.png" },
          { name: "Bondolz", team: "Monster Vicious", lane: "Midlaner", hero: "Zhuxin", kills: 8, deaths: 0, assists: 10, picture: "https://i.imgur.com/lLUfZVt.png" },
          { name: "Momo", team: "Monster Vicious", lane: "Exp Laner", hero: "Phoveus", kills: 2, deaths: 0, assists: 10, picture: "https://i.imgur.com/aDKFRPI.png" },
          { name: "Lyoni", team: "Monster Vicious", lane: "Roamer", hero: "Hylos", kills: 0, deaths: 2, assists: 16, picture: "https://i.imgur.com/ouVd1Kr.png"},

          // Team Vamos Players
          { name: "Natco", team: "Team Vamos", lane: "Gold Laner", hero: "Harith", kills: 1, deaths: 4, assists: 1, picture: "https://i.imgur.com/48b6SmK.png" },
          { name: "Chibi", team: "Team Vamos", lane: "Jungler", hero: "Lancelot", kills: 0, deaths: 5, assists: 2, picture: "https://i.imgur.com/ahEyDfv.png" },
          { name: "Clawkun", team: "Team Vamos", lane: "Midlaner", hero: "Aurora", kills: 1, deaths: 2, assists: 1, picture: "https://i.imgur.com/mDZrBXV.png" },
          { name: "Gojes", team: "Team Vamos", lane: "Exp Laner", hero: "Arlott", kills: 0, deaths: 3, assists: 0, picture: "https://i.imgur.com/2inGQSn.png" },
          { name: "Xorn", team: "Team Vamos", lane: "Roamer", hero: "Gatotkaca", kills: 0, deaths: 4, assists: 1, picture: "https://i.imgur.com/Ux5auTn.png"}
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
        players: [
          // AERO Esports Players
          { name: "Kusey", team: "AERO Esports", lane: "Gold Laner", hero: "Harith", kills: 1, deaths: 2, assists: 0, picture: "https://i.imgur.com/413R26Z.png" },
          { name: "Hazle", team: "AERO Esports", lane: "Jungler", hero: "Joy", kills: 2, deaths: 3, assists: 3, picture: "https://i.imgur.com/MvL7jzh.png" },
          { name: "Kyym", team: "AERO Esports", lane: "Midlaner", hero: "Selena", kills: 1, deaths: 2, assists: 2, picture: "https://i.imgur.com/5X4UXw8.png" },
          { name: "Smooth", team: "AERO Esports", lane: "Exp Laner", hero: "Phoveus", kills: 0, deaths: 6, assists: 0, picture: "https://i.imgur.com/0bW64Ki.png" },
          { name: "Zqeef", team: "AERO Esports", lane: "Roamer", hero: "Chou", kills: 1, deaths: 4, assists: 3, picture: "https://i.imgur.com/t7p2IxW.png"},

          // Untitled Players
          { name: "Skyzed", team: "Untitled", lane: "Gold Laner", hero: "Granger", kills: 7, deaths: 1, assists: 2, picture: "https://i.imgur.com/02b5lub.png" },
          { name: "Keymin", team: "Untitled", lane: "Jungler", hero: "Hayabusa", kills: 4, deaths: 2, assists: 6, picture: "https://i.imgur.com/cVEas3K.png" },
          { name: "Stowm", team: "Untitled", lane: "Midlaner", hero: "Zhuxin", kills: 1, deaths: 1, assists: 11, picture: "https://i.imgur.com/cOtDg24.png" },
          { name: "Sizkaa", team: "Untitled", lane: "Exp Laner", hero: "Lapu-Lapu", kills: 2, deaths: 0, assists: 7, picture: "https://i.imgur.com/CgldSAq.png" },
          { name: "Rasy", team: "Untitled", lane: "Roamer", hero: "Hylos", kills: 3, deaths: 1, assists: 11, picture: "https://i.imgur.com/3xz28tZ.png"}
        ], objectives: {
          lord: { "AERO Esports": 0, "Untitled": 1 },
          turtle: { "AERO Esports": 2, "Untitled": 1 },
          tower: { "AERO Esports": 3, "Untitled": 7 }
        }
      },
            { //game 2
        winner: "Untitled",
        players: [
          // AERO Esports Players
          { name: "Kusey", team: "AERO Esports", lane: "Gold Laner", hero: "Claude", kills: 2, deaths: 4, assists: 7, picture: "https://i.imgur.com/413R26Z.png" },
          { name: "Hazle", team: "AERO Esports", lane: "Jungler", hero: "Akai", kills: 5, deaths: 6, assists: 6, picture: "https://i.imgur.com/MvL7jzh.png" },
          { name: "Kyym", team: "AERO Esports", lane: "Midlaner", hero: "Yve", kills: 1, deaths: 5, assists: 15, picture: "https://i.imgur.com/5X4UXw8.png" },
          { name: "Smooth", team: "AERO Esports", lane: "Exp Laner", hero: "Uranus", kills: 8, deaths: 2, assists: 5, picture: "https://i.imgur.com/0bW64Ki.png" },
          { name: "Zqeef", team: "AERO Esports", lane: "Roamer", hero: "Hylos", kills: 0, deaths: 8, assists: 13, picture: "https://i.imgur.com/t7p2IxW.png"},

          // Untitled Players
          { name: "Skyzed", team: "Untitled", lane: "Gold Laner", hero: "Granger", kills: 14, deaths: 0, assists: 6, picture: "https://i.imgur.com/02b5lub.png" },
          { name: "Keymin", team: "Untitled", lane: "Jungler", hero: "Fredrinna", kills: 3, deaths: 5, assists: 14, picture: "https://i.imgur.com/cVEas3K.png" },
          { name: "Stowm", team: "Untitled", lane: "Midlaner", hero: "Zhuxin", kills: 4, deaths: 2, assists: 17, picture: "https://i.imgur.com/cOtDg24.png" },
          { name: "Sizkaa", team: "Untitled", lane: "Exp Laner", hero: "Masha", kills: 4, deaths: 3, assists: 8, picture: "https://i.imgur.com/CgldSAq.png" },
          { name: "Rasy", team: "Untitled", lane: "Roamer", hero: "Chip", kills: 0, deaths: 6, assists: 17, picture: "https://i.imgur.com/3xz28tZ.png"}
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
        players: [
          // Selangor Red Giants Players
          { name: "Innocent", team: "Selangor Red Giants", lane: "Gold Laner", hero: "Ruby", kills: 3, deaths: 2, assists: 8, picture: "https://i.imgur.com/SHdZx30.png" },
          { name: "Sekys", team: "Selangor Red Giants", lane: "Jungler", hero: "Yi Sun-Shin", kills: 4, deaths: 0, assists: 7, picture: "https://i.imgur.com/6cd6pGF.png" },
          { name: "Stormie", team: "Selangor Red Giants", lane: "Midlaner", hero: "Luoyi", kills: 4, deaths: 0, assists: 7, picture: "https://i.imgur.com/1KIkUJ7.png" },
          { name: "Kramm", team: "Selangor Red Giants", lane: "Exp Laner", hero: "Esmeralda", kills: 6, deaths: 0, assists: 4, picture: "https://i.imgur.com/bPYW0sI.png" },
          { name: "Yums", team: "Selangor Red Giants", lane: "Roamer", hero: "Chou", kills: 1, deaths: 3, assists: 6, picture: "https://i.imgur.com/ws8GoEJ.png"},

          // Homebois Players
          { name: "Melqt", team: "Homebois", lane: "Gold Laner", hero: "Harith", kills: 0, deaths: 3, assists: 4, picture: "https://i.imgur.com/ReSovOr.png" },
          { name: "Eyymal", team: "Homebois", lane: "Jungler", hero: "Fanny", kills: 0, deaths: 3, assists: 3, picture: "https://i.imgur.com/cMJUTQh.png" },
          { name: "Izanami", team: "Homebois", lane: "Midlaner", hero: "Kimmy", kills: 1, deaths: 6, assists: 4, picture: "https://i.imgur.com/xaBAD77.png" },
          { name: "Rezza", team: "Homebois", lane: "Exp Laner", hero: "Phoveus", kills: 2, deaths: 2, assists: 1, picture: "https://i.imgur.com/1HJiEgB.png" },
          { name: "Cayden", team: "Homebois", lane: "Roamer", hero: "Gatotkaca", kills: 2, deaths: 4, assists: 1, picture: "https://i.imgur.com/O4oDGXc.png"}
        ], objectives: {
          lord: { "Selangor Red Giants": 1, "Homebois": 0 },
          turtle: { "Selangor Red Giants": 3, "Homebois": 0 },
          tower: { "Selangor Red Giants": 8, "Homebois": 0 }
        }
      },
    
            { //game 2
        winner: "Homebois",
        players: [
          // Selangor Red Giants Players
          { name: "Innocent", team: "Selangor Red Giants", lane: "Gold Laner", hero: "Lapu-Lapu", kills: 2, deaths: 3, assists: 2, picture: "https://i.imgur.com/SHdZx30.png" },
          { name: "Sekys", team: "Selangor Red Giants", lane: "Jungler", hero: "Yi Sun-Shin", kills: 6, deaths: 4, assists: 4, picture: "https://i.imgur.com/6cd6pGF.png" },
          { name: "Stormie", team: "Selangor Red Giants", lane: "Midlaner", hero: "Kagura", kills: 2, deaths: 2, assists: 7, picture: "https://i.imgur.com/1KIkUJ7.png" },
          { name: "Kramm", team: "Selangor Red Giants", lane: "Exp Laner", hero: "Phoveus", kills: 0, deaths: 1, assists: 3, picture: "https://i.imgur.com/bPYW0sI.png" },
          { name: "Yums", team: "Selangor Red Giants", lane: "Roamer", hero: "Gatotkaca", kills: 1, deaths: 2, assists: 8, picture: "https://i.imgur.com/ws8GoEJ.png"},

          // Homebois Players
          { name: "Melqt", team: "Homebois", lane: "Gold Laner", hero: "Moskov", kills: 3, deaths: 1, assists: 4, picture: "https://i.imgur.com/ReSovOr.png" },
          { name: "Eyymal", team: "Homebois", lane: "Jungler", hero: "Benedetta", kills: 2, deaths: 2, assists: 8, picture: "https://i.imgur.com/cMJUTQh.png" },
          { name: "Izanami", team: "Homebois", lane: "Midlaner", hero: "Kimmy", kills: 3, deaths: 0, assists: 3, picture: "https://i.imgur.com/xaBAD77.png" },
          { name: "Rezza", team: "Homebois", lane: "Exp Laner", hero: "Hilda", kills: 3, deaths: 3, assists: 6, picture: "https://i.imgur.com/1HJiEgB.png" },
          { name: "Cayden", team: "Homebois", lane: "Roamer", hero: "Kalea", kills: 1, deaths: 5, assists: 5, picture: "https://i.imgur.com/O4oDGXc.png"}
        ], objectives: {
          lord: { "Selangor Red Giants": 1, "Homebois": 0 },
          turtle: { "Selangor Red Giants": 3, "Homebois": 0 },
          tower: { "Selangor Red Giants": 8, "Homebois": 0 }
        }
      },
            { //game 3
        winner: "Selangor Red Giants",
        players: [
                // Selangor Red Giants Players
          { name: "Innocent", team: "Selangor Red Giants", lane: "Gold Laner", hero: "Ruby", kills: 3, deaths: 2, assists: 8, picture: "https://i.imgur.com/SHdZx30.png" },
          { name: "Sekys", team: "Selangor Red Giants", lane: "Jungler", hero: "Yi Sun-Shin", kills: 4, deaths: 0, assists: 7, picture: "https://i.imgur.com/6cd6pGF.png" },
          { name: "Stormie", team: "Selangor Red Giants", lane: "Midlaner", hero: "Luoyi", kills: 4, deaths: 0, assists: 7, picture: "https://i.imgur.com/1KIkUJ7.png" },
          { name: "Kramm", team: "Selangor Red Giants", lane: "Exp Laner", hero: "Esmeralda", kills: 6, deaths: 0, assists: 4, picture: "https://i.imgur.com/bPYW0sI.png" },
          { name: "Yums", team: "Selangor Red Giants", lane: "Roamer", hero: "Chou", kills: 1, deaths: 3, assists: 6, picture: "https://i.imgur.com/ws8GoEJ.png"},

          // Homebois Players
          { name: "Melqt", team: "Homebois", lane: "Gold Laner", hero: "Harith", kills: 0, deaths: 3, assists: 4, picture: "https://i.imgur.com/ReSovOr.png" },
          { name: "Eyymal", team: "Homebois", lane: "Jungler", hero: "Fanny", kills: 0, deaths: 3, assists: 3, picture: "https://i.imgur.com/cMJUTQh.png" },
          { name: "Izanami", team: "Homebois", lane: "Midlaner", hero: "Kimmy", kills: 1, deaths: 6, assists: 4, picture: "https://i.imgur.com/xaBAD77.png" },
          { name: "Rezza", team: "Homebois", lane: "Exp Laner", hero: "Phoveus", kills: 2, deaths: 2, assists: 1, picture: "https://i.imgur.com/1HJiEgB.png" },
          { name: "Cayden", team: "Homebois", lane: "Roamer", hero: "Gatotkaca", kills: 2, deaths: 4, assists: 1, picture: "https://i.imgur.com/O4oDGXc.png"}
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
        players: [
          // Team Rey Players
          { name: "Jowm", team: "Team Rey", lane: "Gold Laner", hero: "Moskov", kills: 8, deaths: 1, assists: 6, picture: "https://i.imgur.com/vVtCp4S.png" },
          { name: "Duskk", team: "Team Rey", lane: "Jungler", hero: "Fredrinn", kills: 2, deaths: 3, assists: 9, picture: "https://i.imgur.com/yEpZzkl.png" },
          { name: "Zakqt", team: "Team Rey", lane: "Midlaner", hero: "Pharsa", kills: 1, deaths: 1, assists: 11, picture: "https://i.imgur.com/rLCjvzJ.png" },
          { name: "Der", team: "Team Rey", lane: "Exp Laner", hero: "Lapu-Lapu", kills: 3, deaths: 3, assists: 10, picture: "https://i.imgur.com/V0kSb6s.png" },
          { name: "NovaXCobar", team: "Team Rey", lane: "Roamer", hero: "Kaja", kills: 1, deaths: 4, assists: 9, picture: "https://i.imgur.com/dgfRft1.png"},

          // Todak Players
          { name: "Loleal", team: "Todak", lane: "Gold Laner", hero: "Wanwan", kills: 4, deaths: 3, assists: 5, picture: "https://i.imgur.com/Mmz80I7.png" },
          { name: "Zahyed", team: "Todak", lane: "Jungler", hero: "Baxia", kills: 0, deaths: 5, assists: 9, picture: "https://i.imgur.com/Zr5f3ZU.png" },
          { name: "ZaimSempoi", team: "Todak", lane: "Midlaner", hero: "Selena", kills: 4, deaths: 1, assists: 4, picture: "https://i.imgur.com/J1dXujF.png" },
          { name: "Fawndeer", team: "Todak", lane: "Exp Laner", hero: "Phoveus", kills: 4, deaths: 4, assists: 5, picture: "https://i.imgur.com/5AMdEih.png" },
          { name: "Dreams", team: "Todak", lane: "Roamer", hero: "Khaleed", kills: 0, deaths: 2, assists: 8, picture: "https://i.imgur.com/aNDNWHb.png"}
        ], objectives: {
          lord: { "Team Rey": 3, "Todak": 0 },
          turtle: { "Team Rey": 2, "Todak": 1 },
          tower: { "Team Rey": 9, "Todak": 4 }
        }
      },
            { //game 2
        winner: "Team Rey",
        players: [
          // Team Rey Players
          { name: "Jowm", team: "Team Rey", lane: "Gold Laner", hero: "Moskov", kills: 1, deaths: 0, assists: 5, picture: "https://i.imgur.com/vVtCp4S.png" },
          { name: "Duskk", team: "Team Rey", lane: "Jungler", hero: "Fredrinn", kills: 3, deaths: 1, assists: 2, picture: "https://i.imgur.com/yEpZzkl.png" },
          { name: "Zakqt", team: "Team Rey", lane: "Midlaner", hero: "Valentina", kills: 1, deaths: 0, assists: 7, picture: "https://i.imgur.com/rLCjvzJ.png" },
          { name: "Der", team: "Team Rey", lane: "Exp Laner", hero: "Lapu-Lapu", kills: 1, deaths: 3, assists: 4, picture: "https://i.imgur.com/V0kSb6s.png" },
          { name: "NovaXCobar", team: "Team Rey", lane: "Roamer", hero: "Chou", kills: 3, deaths: 0, assists: 2, picture: "https://i.imgur.com/dgfRft1.png"},

          // Todak Players
          { name: "Loleal", team: "Todak", lane: "Gold Laner", hero: "Claude", kills: 0, deaths: 1, assists: 2, picture: "https://i.imgur.com/Mmz80I7.png" },
          { name: "Zahyed", team: "Todak", lane: "Jungler", hero: "Yi Sun-Shin", kills: 2, deaths: 2, assists: 2, picture: "https://i.imgur.com/Zr5f3ZU.png" },
          { name: "ZaimSempoi", team: "Todak", lane: "Midlaner", hero: "Zhuxin", kills: 2, deaths: 1, assists: 2, picture: "https://i.imgur.com/J1dXujF.png" },
          { name: "Fawndeer", team: "Todak", lane: "Exp Laner", hero: "Esmeralda", kills: 0, deaths: 2, assists: 2, picture: "https://i.imgur.com/5AMdEih.png" },
          { name: "Dreams", team: "Todak", lane: "Roamer", hero: "Gatotkaca", kills: 0, deaths: 3, assists: 4, picture: "https://i.imgur.com/aNDNWHb.png"}
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
        players: [
          // CG Esports Players
          { name: "Amzziq", team: "CG Esports", lane: "Gold Laner", hero: "Harith", kills: 5, deaths: 1, assists: 3, picture: "https://i.imgur.com/wguX967.png" },
          { name: "Gary", team: "CG Esports", lane: "Jungler", hero: "Baxia", kills: 4, deaths: 3, assists: 5, picture: "https://i.imgur.com/QPK02Ki.png" },
          { name: "Ciku", team: "CG Esports", lane: "Midlaner", hero: "Xavier", kills: 0, deaths: 2, assists: 6, picture: "https://i.imgur.com/r3iKJPK.png" },
          { name: "Ye3", team: "CG Esports", lane: "Exp Laner", hero: "Paquito", kills: 1, deaths: 2, assists: 5, picture: "https://i.imgur.com/Dzd9Bpy.png" },
          { name: "Valenz", team: "CG Esports", lane: "Roamer", hero: "Kalea", kills: 0, deaths: 1, assists: 5, picture: "https://i.imgur.com/nzbIpw1.png"},

          // GAMESMY Kelantan Players
          { name: "Immqt", team: "GAMESMY Kelantan", lane: "Gold Laner", hero: "Bruno", kills: 2, deaths: 1, assists: 3, picture: "https://i.imgur.com/K18ycH2.png" },
          { name: "Jaja", team: "GAMESMY Kelantan", lane: "Jungler", hero: "Fredrinn", kills: 1, deaths: 2, assists: 6, picture: "https://i.imgur.com/qwypigC.png" },
          { name: "Maima", team: "GAMESMY Kelantan", lane: "Midlaner", hero: "Kimmy", kills: 3, deaths: 4, assists: 3, picture: "https://i.imgur.com/0WNp0Ub.png" },
          { name: "Munster", team: "GAMESMY Kelantan", lane: "Exp Laner", hero: "Cici", kills: 3, deaths: 2, assists: 4, picture: "https://i.imgur.com/2bBe6Ev.png" },
          { name: "Matdinz", team: "GAMESMY Kelantan", lane: "Roamer", hero: "Mathilda", kills: 0, deaths: 1, assists: 7, picture: "https://i.imgur.com/lSWoHLl.png"}
        ], objectives: {
          lord: { "CG Esports": 2, "GAMESMY Kelantan": 0 },
          turtle: { "CG Esports": 3, "GAMESMY Kelantan": 0 },
          tower: { "CG Esports": 7, "GAMESMY Kelantan": 2 }
        }
      },
    
            { //game 2
        winner: "CG Esports",
        players: [
          // CG Esports Players
          { name: "Amzziq", team: "CG Esports", lane: "Gold Laner", hero: "Granger", kills: 4, deaths: 0, assists: 6, picture: "https://i.imgur.com/wguX967.png" },
          { name: "Gary", team: "CG Esports", lane: "Jungler", hero: "Yi Sun-Shin", kills: 3, deaths: 0, assists: 11, picture: "https://i.imgur.com/QPK02Ki.png" },
          { name: "Ciku", team: "CG Esports", lane: "Midlaner", hero: "Odette", kills: 6, deaths: 1, assists: 4, picture: "https://i.imgur.com/r3iKJPK.png" },
          { name: "Ye3", team: "CG Esports", lane: "Exp Laner", hero: "Esmeralda", kills: 2, deaths: 0, assists: 4, picture: "https://i.imgur.com/Dzd9Bpy.png" },
          { name: "Valenz", team: "CG Esports", lane: "Roamer", hero: "Kalea", kills: 0, deaths: 0, assists: 12, picture: "https://i.imgur.com/nzbIpw1.png"},

          // GAMESMY Kelantan Players
          { name: "Immqt", team: "GAMESMY Kelantan", lane: "Gold Laner", hero: "Harith", kills: 0, deaths: 0, assists: 0, picture: "https://i.imgur.com/K18ycH2.png" },
          { name: "Jaja", team: "GAMESMY Kelantan", lane: "Jungler", hero: "Lancelot", kills: 0, deaths: 3, assists: 1, picture: "https://i.imgur.com/qwypigC.png" },
          { name: "Maima", team: "GAMESMY Kelantan", lane: "Midlaner", hero: "Zhuxin", kills: 0, deaths: 3, assists: 1, picture: "https://i.imgur.com/0WNp0Ub.png" },
          { name: "Munster", team: "GAMESMY Kelantan", lane: "Exp Laner", hero: "Uranus", kills: 0, deaths: 4, assists: 0, picture: "https://i.imgur.com/2bBe6Ev.png" },
          { name: "Matdinz", team: "GAMESMY Kelantan", lane: "Roamer", hero: "Gatotkaca", kills: 1, deaths: 5, assists: 0, picture: "https://i.imgur.com/lSWoHLl.png"}
        ], objectives: {
          lord: { "CG Esports": 1, "GAMESMY Kelantan": 0 },
          turtle: { "CG Esports": 3, "GAMESMY Kelantan": 0 },
          tower: { "CG Esports": 7, "GAMESMY Kelantan": 0 }
        }
      },
    ]},
            //week 1 SUNDAY match 3 (VMS 2-0 HB)
{               teamA: "Monster Vicious",
                teamB: "Team Vamos",
                games: [
            { //game 1
        winner: "Team Vamos",
        players: [
          // Team Vamos Players
          // Team Vamos Players
          { name: "Natco", team: "Team Vamos", lane: "Gold Laner", hero: "Granger", kills: 3, deaths: 1, assists: 5, picture: "https://i.imgur.com/48b6SmK.png" },
          { name: "Chibi", team: "Team Vamos", lane: "Jungler", hero: "Lancelot", kills: 3, deaths: 0, assists: 7, picture: "https://i.imgur.com/ahEyDfv.png" },
          { name: "Clawkun", team: "Team Vamos", lane: "Midlaner", hero: "Pharsa", kills: 2, deaths: 2, assists: 6, picture: "https://i.imgur.com/mDZrBXV.png" },
          { name: "Gojes", team: "Team Vamos", lane: "Exp Laner", hero: "Hilda", kills: 4, deaths: 2, assists: 6, picture: "https://i.imgur.com/2inGQSn.png" },
          { name: "Xorn", team: "Team Vamos", lane: "Roamer", hero: "Kalea", kills: 1, deaths: 4, assists: 9, picture: "https://i.imgur.com/Ux5auTn.png"},

          // Homebois Players
          { name: "Zippyqt", team: "Homebois", lane: "Gold Laner", hero: "Moskov", kills: 0, deaths: 2, assists: 3, picture: "https://i.imgur.com/Po8ykTi.png" },
          { name: "Eyymal", team: "Homebois", lane: "Jungler", hero: "Yi Sun-Shin", kills: 0, deaths: 2, assists: 8, picture: "https://i.imgur.com/cMJUTQh.png" },
          { name: "Izanami", team: "Homebois", lane: "Midlaner", hero: "Selena", kills: 3, deaths: 3, assists: 6, picture: "https://i.imgur.com/xaBAD77.png" },
          { name: "Rezza", team: "Homebois", lane: "Exp Laner", hero: "Badang", kills: 4, deaths: 3, assists: 3, picture: "https://i.imgur.com/1HJiEgB.png" },
          { name: "Cayden", team: "Homebois", lane: "Roamer", hero: "Gatotkaca", kills: 2, deaths: 3, assists: 7, picture: "https://i.imgur.com/O4oDGXc.png"}
        ], objectives: {
          lord: { "Team Vamos": 1, "Homebois": 0 },
          turtle: { "Team Vamos": 2, "Homebois": 1 },
          tower: { "Team Vamos": 9, "Homebois": 0 }
        }
      },
            { //game 2
        winner: "Team Vamos",
        players: [
          // Team Vamos Players
          { name: "Natco", team: "Team Vamos", lane: "Gold Laner", hero: "Granger", kills: 6, deaths: 0, assists: 6, picture: "https://i.imgur.com/48b6SmK.png" },
          { name: "Chibi", team: "Team Vamos", lane: "Jungler", hero: "Lancelot", kills: 1, deaths: 2, assists: 13, picture: "https://i.imgur.com/ahEyDfv.png" },
          { name: "Clawkun", team: "Team Vamos", lane: "Midlaner", hero: "Pharsa", kills: 7, deaths: 0, assists: 7, picture: "https://i.imgur.com/mDZrBXV.png" },
          { name: "Gojes", team: "Team Vamos", lane: "Exp Laner", hero: "Esmeralda", kills: 3, deaths: 1, assists: 8, picture: "https://i.imgur.com/2inGQSn.png" },
          { name: "Xorn", team: "Team Vamos", lane: "Roamer", hero: "Kalea", kills: 0, deaths: 1, assists: 10, picture: "https://i.imgur.com/Ux5auTn.png"},

          // Homebois Players
          { name: "Zippyqt", team: "Homebois", lane: "Gold Laner", hero: "Harith", kills: 1, deaths: 3, assists: 0, picture: "https://i.imgur.com/Po8ykTi.png" },
          { name: "Eyymal", team: "Homebois", lane: "Jungler", hero: "Benedetta", kills: 1, deaths: 3, assists: 1, picture: "https://i.imgur.com/cMJUTQh.png" },
          { name: "Izanami", team: "Homebois", lane: "Midlaner", hero: "Lunox", kills: 2, deaths: 1, assists: 2, picture: "https://i.imgur.com/xaBAD77.png" },
          { name: "Rezza", team: "Homebois", lane: "Exp Laner", hero: "Gloo", kills: 0, deaths: 4, assists: 2, picture: "https://i.imgur.com/1HJiEgB.png" },
          { name: "Cayden", team: "Homebois", lane: "Roamer", hero: "Gatotkaca", kills: 0, deaths: 6, assists: 3, picture: "https://i.imgur.com/O4oDGXc.png"}
        ], objectives: {
          lord: { "Team Vamos": 1, "Homebois": 0 },
          turtle: { "Team Vamos": 2, "Homebois": 0 },
          tower: { "Team Vamos": 9, "Homebois": 0 }
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
      if (!teamStats[match.teamA]) teamStats[match.teamA] = { kills:0,deaths:0,assists:0,gamesPlayed:0,gameWins:0,matchesPlayed:0,matchWins:0 };
      if (!teamStats[match.teamB]) teamStats[match.teamB] = { kills:0,deaths:0,assists:0,gamesPlayed:0,gameWins:0,matchesPlayed:0,matchWins:0 };
      if (game.winner === match.teamA) teamAGameWins++; else teamBGameWins++;
      for (let player of game.players) {
        let t = player.team;
        teamStats[t].kills += player.kills;
        teamStats[t].deaths += player.deaths;
        teamStats[t].assists += player.assists;
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
  for (let match of matches) {
    for (let game of match.games) {
      let teamKills = {};
      for (let player of game.players) {
        if (!teamKills[player.team]) teamKills[player.team] = 0;
        teamKills[player.team] += player.kills;
      }
      for (let player of game.players) {
        if (!playerStats[player.name]) {
          playerStats[player.name] = { team: player.team, lane: player.lane, games:0, kills:0,deaths:0,assists:0,kpTotal:0, picture:player.picture };
        }
        let ps = playerStats[player.name];
        ps.games++;
        ps.kills += player.kills;
        ps.deaths += player.deaths;
        ps.assists += player.assists;
        ps.kpTotal += (player.kills + player.assists)/teamKills[player.team];
      }
    }
  }
  return playerStats;
}

function showTeams() {
  let t = calculateTeamStats();

  let arr = Object.keys(t).map(team => ({
    team,
    ...t[team],
    winRate: (t[team].matchWins / t[team].matchesPlayed) * 100
  }));

  // SORTING
  if (teamSort.key) {
    arr.sort((a, b) => {
      let valA = a[teamSort.key];
      let valB = b[teamSort.key];

      if (typeof valA === "string") {
        return teamSort.asc
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return teamSort.asc ? valA - valB : valB - valA;
    });
  }

function arrow(key) {
  if (teamSort.key !== key) {
    return ' <span style="opacity:0.4;">⇅</span>';
  }
  return teamSort.asc
    ? ' <span>▲</span>'
    : ' <span>▼</span>';
}

  let html = `
  <table>
  <tr>
    <th onclick="sortTeams('team')">Team${arrow('team')}</th>
    <th onclick="sortTeams('kills')">Kills${arrow('kills')}</th>
    <th onclick="sortTeams('deaths')">Deaths${arrow('deaths')}</th>
    <th onclick="sortTeams('assists')">Assists${arrow('assists')}</th>
    <th onclick="sortTeams('gamesPlayed')">Games${arrow('gamesPlayed')}</th>
    <th onclick="sortTeams('gameWins')">Game Wins${arrow('gameWins')}</th>
    <th onclick="sortTeams('matchesPlayed')">Matches${arrow('matchesPlayed')}</th>
    <th onclick="sortTeams('matchWins')">Match Wins${arrow('matchWins')}</th>
    <th onclick="sortTeams('winRate')">Win Rate${arrow('winRate')}</th>
  </tr>
  `;

  for (let ts of arr) {
    html += `
    <tr>
      <td style="display:flex; align-items:center; gap:8px;">
        <img src="${teamLogos[ts.team]}" width="50" height="50" style="border-radius:50%;">
        <span>${ts.team}</span>
      </td>
      <td>${ts.kills}</td>
      <td>${ts.deaths}</td>
      <td>${ts.assists}</td>
      <td>${ts.gamesPlayed}</td>
      <td>${ts.gameWins}</td>
      <td>${ts.matchesPlayed}</td>
      <td>${ts.matchWins}</td>
      <td>${ts.winRate.toFixed(1)}%</td>
    </tr>`;
  }

  html += "</table>";
  document.getElementById("output").innerHTML = html;
}

function sortTeams(key) {
  if (teamSort.key === key) {
    teamSort.asc = !teamSort.asc;
  } else {
    teamSort.key = key;
    teamSort.asc = true;
  }
  showTeams();
}

function showPlayers() {

  let p = calculatePlayerStats();

  const currentTeam = document.getElementById("teamFilter")?.value || "All";
  const currentLane = document.getElementById("laneFilter")?.value || "All";

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
    const teamMatch = currentTeam === "All" || ps.team === currentTeam;
    const laneMatch = currentLane === "All" || ps.lane === currentLane;
    return teamMatch && laneMatch;
  });

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
  <h2 style="text-align:center;">Top Players MPL MY S16</h2>
    <div style="margin-bottom:10px; display:flex; justify-content:center; align-items:center; gap:16px;">
  <strong style="align-self:center;">Top 5 Kills:</strong>
  ${topKills.map(pl => `
    <span style="display:inline-flex; flex-direction:column; align-items:center; gap:8px;">
      <img src="${pl.picture}" width="120" height="120" style="border-radius:50%;">
      ${pl.name} (${pl.kills})
    </span>
  `).join('')}
</div>
      <div style="margin-bottom:10px; display:flex; justify-content:center; align-items:center; gap:16px;">
  <strong style="align-self:center;">Top 5 Kills:</strong>
  ${topAssists.map(pl => `
    <span style="display:inline-flex; flex-direction:column; align-items:center; gap:8px;">
      <img src="${pl.picture}" width="120" height="120" style="border-radius:50%;">
      ${pl.name} (${pl.kills})
    </span>
  `).join('')}
</div>
      <div style="margin-bottom:10px; display:flex; justify-content:center; align-items:center; gap:16px;">
  <strong style="align-self:center;">Top 5 Kills:</strong>
  ${topKDA.map(pl => `
    <span style="display:inline-flex; flex-direction:column; align-items:center; gap:8px;">
      <img src="${pl.picture}" width="120" height="120" style="border-radius:50%;">
      ${pl.name} (${pl.kills})
    </span>
  `).join('')}
</div>

  <div style="margin-bottom:20px; display:flex; gap:20px; justify-content:center;">
    <div>
      <label>Team: </label>
      <select id="teamFilter" onchange="showPlayers()">
        <option value="All">All</option>
        ${teams.map(t => `<option value="${t}" ${t === currentTeam ? "selected" : ""}>${t}</option>`).join("")}
      </select>
    </div>

    <div>
      <label>Lane: </label>
      <select id="laneFilter" onchange="showPlayers()">
        <option value="All">All</option>
        ${lanes.map(l => `<option value="${l}" ${l === currentLane ? "selected" : ""}>${l}</option>`).join("")}
      </select>
    </div>
  </div>

  <table>
  <tr>
    <th onclick="sortPlayers('name')">Player${arrow('name')}</th>
    <th onclick="sortPlayers('team')">Team${arrow('team')}</th>
    <th onclick="sortPlayers('lane')">Lane${arrow('lane')}</th>
    <th onclick="sortPlayers('games')">Games${arrow('games')}</th>
    <th onclick="sortPlayers('kills')">Kills${arrow('kills')}</th>
    <th onclick="sortPlayers('avgK')">Avg K${arrow('avgK')}</th>
    <th onclick="sortPlayers('deaths')">Deaths${arrow('deaths')}</th>
    <th onclick="sortPlayers('avgD')">Avg D${arrow('avgD')}</th>
    <th onclick="sortPlayers('assists')">Assists${arrow('assists')}</th>
    <th onclick="sortPlayers('avgA')">Avg A${arrow('avgA')}</th>
    <th onclick="sortPlayers('kda')">KDA${arrow('kda')}</th>
    <th onclick="sortPlayers('kp')">KP%${arrow('kp')}</th>
  </tr>
  `;

  for (let ps of arr) {
    html += `
    <tr>
      <td style="display:flex; align-items:center; gap:12px;">
        <img src="${ps.picture}" width="90" height="90" style="border-radius:50%;">
        <span>${ps.name}</span>
<td style="vertical-align:middle;">
  <div style="display:flex; align-items:center; gap:8px;">
    <img src="${teamLogos[ps.team]}" width="50" height="50" style="border-radius:50%;">
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
    </tr>`;
  }

  html += "</table>";

  document.getElementById("output").innerHTML = html;
}

function sortPlayers(key) {
  if (playerSort.key === key) {
    playerSort.asc = !playerSort.asc;
  } else {
    playerSort.key = key;
    playerSort.asc = true;
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