let teamSort = { key: null, asc: true };
let playerSort = { key: null, asc: true };
let heroSort = { key: null, asc: true };
let heroPoolSort = { key: null, asc: true };
let playerPoolsSort = { key: null, asc: true };

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
"Clint": "https://i.imgur.com/7FypXeP.png"


}

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
        bans: ["Cici","Kimmy","Baxia","Ruby","Uranus","Fanny","Wanwan", "Kalea","Chou", "Yve"],
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
        bans: ["Fredrinn","Arlott","Baxia","Yi Sun-Shin","Gatotkaca","Fanny","Wanwan", "Lancelot","Grock", "Uranus"],
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
        bans: ["Chou","Arlott","Baxia","Yi Sun-Shin","Joy","Fanny","Wanwan", "Lancelot","Hayabusa", "Benedetta"],
        players: [
          // AERO Esports Players
          { name: "Kusey", team: "AERO Esports", lane: "Gold Laner", hero: "Claude", kills: 2, deaths: 4, assists: 7, picture: "https://i.imgur.com/413R26Z.png" },
          { name: "Hazle", team: "AERO Esports", lane: "Jungler", hero: "Akai", kills: 5, deaths: 6, assists: 6, picture: "https://i.imgur.com/MvL7jzh.png" },
          { name: "Kyym", team: "AERO Esports", lane: "Midlaner", hero: "Yve", kills: 1, deaths: 5, assists: 15, picture: "https://i.imgur.com/5X4UXw8.png" },
          { name: "Smooth", team: "AERO Esports", lane: "Exp Laner", hero: "Uranus", kills: 8, deaths: 2, assists: 5, picture: "https://i.imgur.com/0bW64Ki.png" },
          { name: "Zqeef", team: "AERO Esports", lane: "Roamer", hero: "Hylos", kills: 0, deaths: 8, assists: 13, picture: "https://i.imgur.com/t7p2IxW.png"},

          // Untitled Players
          { name: "Skyzed", team: "Untitled", lane: "Gold Laner", hero: "Granger", kills: 14, deaths: 0, assists: 6, picture: "https://i.imgur.com/02b5lub.png" },
          { name: "Keymin", team: "Untitled", lane: "Jungler", hero: "Fredrinn", kills: 3, deaths: 5, assists: 14, picture: "https://i.imgur.com/cVEas3K.png" },
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
        bans: ["Fredrinn","Arlott","Baxia","Cici","Gloo","Pharsa","Wanwan", "Lancelot","Kalea", "Zhuxin"],
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
        bans: ["Valentina","Lunox","Baxia","Harith","Esmeralda","Fanny","Wanwan", "Cici","Grock", "Zhuxin"],
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
        bans: ["Fredrinn","Arlott","Zhuxin","Selena","Luoyi","Fanny","Wanwan", "Cici","Grock", "Kalea"],
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
        bans: ["Lancelot","Fanny","Zhuxin","Chip","Valentina","Cici","Kalea", "Arlott","Akai", "Hayabusa"],
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
        bans: ["Lancelot","Fanny","Wanwan","Ruby","Harith","Cici","Arlott", "Pharsa","Kalea", "Kimmy"],
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
        bans: ["Phoveus","Arlott","Hayabusa","Moskov","Granger","Wanwan","Lancelot", "Pharsa","Lapu-Lapu", "Kadita"],
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
        bans: ["Wanwan","Arlott","Baxia","Grock","Moskov","Fanny","Cici", "Kimmy","Ruby", "Pharsa"],
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
{               teamA: "Team Vamos",
                teamB: "Homebois",
                games: [
            { //game 1
        winner: "Team Vamos",
        bans: ["Baxia","Wanwan","Fanny","Esmeralda","Phoveus","Cici","Zhuxin", "Harith","Beatrix", "Luoyi"],
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
        bans: ["Fanny","Zhuxin","Baxia","Kagura","Valentina","Cici","Yi Sun-Shin", "Wanwan","Phoveus", "Arlott"],
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
        let t = player.team;
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
    ...t[team]
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
    html += `
    <tr>
      <td style="display:flex; align-items:center; gap:8px;">
        <img src="${teamLogos[ts.team]}" width="50" height="50" style="border-radius:50%;">
        <span>${ts.team}</span>
      </td>
      <td>${ts.matchWins}</td>
      <td>${ts.kills}</td>
      <td>${ts.deaths}</td>
      <td>${ts.assists}</td>
      <td>${ts.lord || 0}</td>
      <td>${ts.turtle || 0}</td>
      <td>${ts.tower || 0}</td>
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

  const currentTeam = document.getElementById("teamFilter")?.value || "ALL TEAMS";
  const currentLane = document.getElementById("laneFilter")?.value || "ALL ROLES";

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
    <div style="margin-bottom:10px; display:flex; justify-content:center; align-items:center; gap:16px;">
  <strong style="align-self:center;">TOP 5 KILLS:</strong>
  ${topKills.map(pl => `
    <span style="display:inline-flex; flex-direction:column; align-items:center; gap:8px;">
      <img src="${pl.picture}" width="120" height="120" style="border-radius:50%;">
      ${pl.name} (${pl.kills})
    </span>
  `).join('')}
</div>
      <div style="margin-bottom:10px; display:flex; justify-content:center; align-items:center; gap:16px;">
  <strong style="align-self:center;">TOP 5 ASSISTS:</strong>
  ${topAssists.map(pl => `
    <span style="display:inline-flex; flex-direction:column; align-items:center; gap:8px;">
      <img src="${pl.picture}" width="120" height="120" style="border-radius:50%;">
      ${pl.name} (${pl.assists})
    </span>
  `).join('')}
</div>
      <div style="margin-bottom:10px; display:flex; justify-content:center; align-items:center; gap:16px;">
  <strong style="align-self:center;">TOP 5 KDA:</strong>
  ${topKDA.map(pl => `
    <span style="display:inline-flex; flex-direction:column; align-items:center; gap:8px;">
      <img src="${pl.picture}" width="120" height="120" style="border-radius:50%;">
      ${pl.name} (${pl.kda})
    </span>
  `).join('')}
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

  <table>
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

function calculateHeroStats() {
  let heroStats = {};

  let totalPicks = 0;
  let totalGames = 0;

  for (let match of matches) {
    for (let game of match.games) {
      totalGames++;

      // PICKS + WINS from players
      for (let player of game.players) {
        const h = player.hero;
        if (!heroStats[h]) heroStats[h] = { hero: h, pick: 0, ban: 0, win: 0 };
        heroStats[h].pick++;
        totalPicks++;

        if (player.team === game.winner) {
          heroStats[h].win++;
        }
      }

      // BANS (count ONCE per game per hero)
      if (Array.isArray(game.bans)) {
        const uniqueBans = new Set(game.bans);
        for (let b of uniqueBans) {
          if (!heroStats[b]) heroStats[b] = { hero: b, pick: 0, ban: 0, win: 0 };
          heroStats[b].ban++; // = number of games banned
        }
      }
    }
  }

  // Build final array with rates
  let arr = Object.keys(heroStats).map(h => {
    const hs = heroStats[h];
    const winRate = hs.pick ? (hs.win / hs.pick) * 100 : 0;
    const pickRate = totalPicks ? (hs.pick / totalPicks) * 100 : 0;

    // ✅ ban rate by games (this is what you want)
    const banRate = totalGames ? (hs.ban / totalGames) * 100 : 0;

    return {
      hero: hs.hero,
      pick: hs.pick,
      pickRate,
      ban: hs.ban,
      banRate,
      winRate,
      img: constHero[hs.hero] || ""
    };
  });

  return arr;
}

function showHeroes() {
  
  let arr = calculateHeroStats();

  // Top 5 Pick
  let topPick = [...arr].sort((a,b) => b.pick - a.pick).slice(0,5);

  // Top 5 Ban
  let topBan = [...arr].sort((a,b) => b.ban - a.ban).slice(0,5);

  // Top 5 Winrate (min 5 picks)
  let topWin = arr
    .filter(h => h.pick >= 5)
    .sort((a,b) => b.winRate - a.winRate)
    .slice(0,5);

  // SORT table
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

  let html = `
    <h2 style="text-align:center;">HERO STATS MPL MY S16</h2>

    <div style="margin-bottom:14px; display:flex; justify-content:center; align-items:flex-start; gap:30px; flex-wrap:wrap;">

      <div style="text-align:center;">
        <strong>TOP 5 PICK</strong>
        <div style="display:flex; gap:14px; justify-content:center; margin-top:10px; flex-wrap:wrap;">
          ${topPick.map(h => `
            <span style="display:inline-flex; flex-direction:column; align-items:center; gap:6px;">
              <img src="${h.img}" width="80" height="80" style="border-radius:12px;">
              ${h.hero} (${h.pick})
            </span>
          `).join("")}
        </div>
      </div>

      <div style="text-align:center;">
        <strong>TOP 5 BAN</strong>
        <div style="display:flex; gap:14px; justify-content:center; margin-top:10px; flex-wrap:wrap;">
          ${topBan.map(h => `
            <span style="display:inline-flex; flex-direction:column; align-items:center; gap:6px;">
              <img src="${h.img}" width="80" height="80" style="border-radius:12px;">
              ${h.hero} (${h.ban})
            </span>
          `).join("")}
        </div>
      </div>

      <div style="text-align:center;">
        <strong>TOP 5 WINRATE % (MIN 5 GAMES PLAYED)</strong>
        <div style="display:flex; gap:14px; justify-content:center; margin-top:10px; flex-wrap:wrap;">
          ${topWin.map(h => `
            <span style="display:inline-flex; flex-direction:column; align-items:center; gap:6px;">
              <img src="${h.img}" width="80" height="80" style="border-radius:12px;">
              ${h.hero} (${h.winRate.toFixed(1)}%)
            </span>
          `).join("")}
        </div>
      </div>

    </div>

    <table>
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
        <td style="display:flex; align-items:center; gap:10px;">
          <img src="${h.img}" width="55" height="55" style="border-radius:12px;">
          <span>${h.hero}</span>
        </td>
        <td>${h.pick}</td>
        <td>${h.pickRate.toFixed(1)}%</td>
        <td>${h.ban}</td>
        <td>${h.banRate.toFixed(1)}%</td>
        <td>${h.winRate.toFixed(1)}%</td>
      </tr>
    `;
  }

  html += `</table>`;
  document.getElementById("output").innerHTML = html;
}

function sortHeroes(key) {
  if (heroSort.key === key) {
    heroSort.asc = !heroSort.asc;
  } else {
    heroSort.key = key;
    heroSort.asc = true;
  }
  showHeroes();
}

function calculateHeroPoolStats() {
  let pool = {};

  for (let match of matches) {
    for (let game of match.games) {
      for (let player of game.players) {
        if (!pool[player.name]) {
          pool[player.name] = {
            name: player.name,
            team: player.team,
            lane: player.lane,
            picture: player.picture,
            heroes: {} // heroName -> { games:0, wins:0 }
          };
        }

        const ps = pool[player.name];
        const heroName = player.hero;

        if (!ps.heroes[heroName]) ps.heroes[heroName] = { games: 0, wins: 0 };

        ps.heroes[heroName].games++;
        if (player.team === game.winner) ps.heroes[heroName].wins++;
      }
    }
  }

  return pool;
}

function showHeroPool() {
  
  const pool = calculateHeroPoolStats();

  let arr = Object.keys(pool).map(name => {
    const ps = pool[name];
    const uniqueHeroes = Object.keys(ps.heroes).length;

    // Build heroes list (sorted by games desc)
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

  // Keep current filter values (same behavior as your players tab)
  const currentTeam = document.getElementById("hpTeamFilter")?.value || "ALL TEAMS";
  const currentLane = document.getElementById("hpLaneFilter")?.value || "ALL ROLES";

  // Build filter lists
  const teams = [...new Set(arr.map(p => p.team))];
  const lanes = [...new Set(arr.map(p => p.lane))];

  // Apply filters
  arr = arr.filter(ps => {
    const teamMatch = currentTeam === "ALL TEAMS" || ps.team === currentTeam;
    const laneMatch = currentLane === "ALL ROLES" || ps.lane === currentLane;
    return teamMatch && laneMatch;
  });

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

    <table>
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
        <span>${h.games} - ${h.winRate.toFixed(0)}%</span>
      </span>
    `).join("");

    html += `
      <tr>
        <td style="vertical-align:middle;">
         <div style="display:flex; align-items:center; gap:10px; height:100%;">
          <img src="${ps.picture}" width="55" height="55"
            style="border-radius:50%; object-fit:cover; border:2px solid #fff;">
          <span>${ps.name}</span>
        </td>

        <td style="vertical-align:middle;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${teamLogos[ps.team]}" width="45" height="45" style="border-radius:50%;">
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
}

function sortHeroPool(key) {
  
  if (heroPoolSort.key === key) {
    heroPoolSort.asc = !heroPoolSort.asc;
  } else {
    heroPoolSort.key = key;
    heroPoolSort.asc = true;
  }
  showHeroPool();
}

function calculatePlayerPoolsStats() {
  let pools = {};

  for (let match of matches) {
    for (let game of match.games) {
      for (let player of game.players) {
        const heroName = player.hero;

        if (!pools[heroName]) {
          pools[heroName] = {
            hero: heroName,
            players: {} // playerName -> { games:0, wins:0, lane, team, picture }
          };
        }

        const hs = pools[heroName];

        if (!hs.players[player.name]) {
          hs.players[player.name] = {
            name: player.name,
            team: player.team,
            lane: player.lane,
            picture: player.picture,
            games: 0,
            wins: 0
          };
        }

        hs.players[player.name].games++;
        if (player.team === game.winner) hs.players[player.name].wins++;
      }
    }
  }

  return pools;
}

function showPlayerPools() {
  const pools = calculatePlayerPoolsStats();

  let arr = Object.keys(pools).map(heroName => {
    const hs = pools[heroName];

    const playerList = Object.keys(hs.players)
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
      .sort((a,b) => b.games - a.games);

    return {
      hero: heroName,
      img: constHero[heroName] || "",
      totalPlayers: playerList.length,
      playersPlayed: playerList
    };
  });

  // ===== Filters (Team + Lane) =====
  const currentTeam = document.getElementById("ppTeamFilter")?.value || "ALL TEAMS";
  const currentLane = document.getElementById("ppLaneFilter")?.value || "ALL ROLES";

  // Build filter options from all player entries
  const allPlayers = arr.flatMap(h => h.playersPlayed);
  const teams = [...new Set(allPlayers.map(p => p.team))];
  const lanes = [...new Set(allPlayers.map(p => p.lane))];

  // Apply filters:
  // Keep hero rows where at least one player entry matches
  arr = arr
    .map(h => {
      const filteredPlayers = h.playersPlayed.filter(p => {
        const teamMatch = currentTeam === "ALL TEAMS" || p.team === currentTeam;
        const laneMatch = currentLane === "ALL ROLES" || p.lane === currentLane;
        return teamMatch && laneMatch;
      });

      return {
        ...h,
        totalPlayers: filteredPlayers.length,
        playersPlayed: filteredPlayers
      };
    })
    .filter(h => h.playersPlayed.length > 0);

  // ===== Sort =====
  if (playerPoolsSort.key) {
    arr.sort((a, b) => {
      let valA = a[playerPoolsSort.key];
      let valB = b[playerPoolsSort.key];

      if (typeof valA === "string") {
        return playerPoolsSort.asc
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
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
    <h2 style="text-align:center;">PLAYER POOL</h2>

    <div style="margin-bottom:20px; display:flex; gap:20px; justify-content:center;">
      <div>
        <label>TEAM: </label>
        <select id="ppTeamFilter" onchange="showPlayerPools()">
          <option value="ALL TEAMS">ALL TEAMS</option>
          ${teams.map(t => `<option value="${t}" ${t === currentTeam ? "selected" : ""}>${t}</option>`).join("")}
        </select>
      </div>

      <div>
        <label>ROLE: </label>
        <select id="ppLaneFilter" onchange="showPlayerPools()">
          <option value="ALL ROLES">ALL ROLES</option>
          ${lanes.map(l => `<option value="${l}" ${l === currentLane ? "selected" : ""}>${l}</option>`).join("")}
        </select>
      </div>
    </div>

    <table>
      <tr>
        <th onclick="sortPlayerPools('hero')">HERO${arrow('hero')}</th>
        <th onclick="sortPlayerPools('totalPlayers')">TOTAL PLAYERS${arrow('totalPlayers')}</th>
        <th>PLAYERS PLAYED (GAMES - WIN RATE %)</th>
      </tr>
  `;

  for (let h of arr) {
    const playersHTML = h.playersPlayed.map(p => `
      <span style="display:inline-flex; align-items:center; gap:6px; margin:3px 10px 3px 0;">
        <img
          src="${p.picture}"
          width="85"
          height="85"
          style="border-radius:50%; object-fit:cover; border:2px solid #fff;"
        >
        <span>${p.name} (${p.games} - ${p.winRate.toFixed(0)}%)</span>
      </span>
    `).join("");

    html += `
      <tr>
        <td style="vertical-align:middle;">
         <div style="display:flex; align-items:center; gap:10px; height:100%;">
          <img src="${h.img}" width="55" height="55"
            style="border-radius:50%; object-fit:cover; border:2px solid #fff;">
          <span>${h.hero}</span>
        </td>
        <td>${h.totalPlayers}</td>
        <td style="text-align:left; max-width:700px;">${playersHTML}</td>
      </tr>
    `;
  }

  html += `</table>`;
  document.getElementById("output").innerHTML = html;
}

function sortPlayerPools(key) {
  if (playerPoolsSort.key === key) {
    playerPoolsSort.asc = !playerPoolsSort.asc;
  } else {
    playerPoolsSort.key = key;
    playerPoolsSort.asc = true;
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
  }
}

