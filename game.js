const playerNameEl = document.getElementById("player-name");
const enemyNameEl = document.getElementById("enemy-name");
const playerPilotEl = document.getElementById("player-pilot");
const enemyPilotEl = document.getElementById("enemy-pilot");
const playerHpEl = document.getElementById("player-hp");
const enemyHpEl = document.getElementById("enemy-hp");
const playerHpLabelEl = document.getElementById("player-hp-label");
const enemyHpLabelEl = document.getElementById("enemy-hp-label");
const playerSuperEl = document.getElementById("player-super");
const enemySuperEl = document.getElementById("enemy-super");
const playerSuperLabelEl = document.getElementById("player-super-label");
const enemySuperLabelEl = document.getElementById("enemy-super-label");
const playerSpecialReadyEl = document.getElementById("player-special-ready");
const enemySpecialReadyEl = document.getElementById("enemy-special-ready");
const attacksEl = document.getElementById("attacks");
const messageEl = document.getElementById("message");
const turnIndicatorEl = document.getElementById("turn-indicator");
const ribbonLogEl = document.getElementById("ribbon-log");
const battleCalloutEl = document.getElementById("battle-callout");
const modePvpEl = document.getElementById("mode-pvp");
const modeCpuEl = document.getElementById("mode-cpu");
const setupFlowEl = document.getElementById("setup-flow");
const setupModePageEl = document.getElementById("setup-mode-page");
const setupCharacterPageEl = document.getElementById("setup-character-page");
const setupStartPageEl = document.getElementById("setup-start-page");
const setupCharacterTitleEl = document.getElementById("setup-character-title");
const setupCharacterInstructionEl = document.getElementById("setup-character-instruction");
const setupSummaryEl = document.getElementById("setup-summary");
const gameStageEl = document.getElementById("game-stage");
const cpuCharacterSelectEl = document.getElementById("cpu-character-select");
const chooseCharacterGalaxybroEl = document.getElementById("choose-character-galaxybro");
const chooseCharacterLightningkidEl = document.getElementById("choose-character-lightningkid");
const chooseCharacterSuperdadEl = document.getElementById("choose-character-superdad");
const chooseCharacterStarshaEl = document.getElementById("choose-character-starsha");
const chooseCharacterSoccerholdenEl = document.getElementById("choose-character-soccerholden");
const chooseCharacterEliashackerEl = document.getElementById("choose-character-eliashacker");
const startGameEl = document.getElementById("start-game");
const restartEl = document.getElementById("restart");
const playerLogEl = document.getElementById("player-log");
const enemyLogEl = document.getElementById("enemy-log");
const playerLogTitleEl = document.getElementById("player-log-title");
const enemyLogTitleEl = document.getElementById("enemy-log-title");
const playerCreatureEl = document.getElementById("player-creature");
const enemyCreatureEl = document.getElementById("enemy-creature");
const playerCardEl = document.getElementById("player-card");
const enemyCardEl = document.getElementById("enemy-card");
const arenaEl = document.querySelector(".arena");

const MAX_HP = 100;
const MAX_SUPER = 100;
const SUPER_PER_HIT = 20;
const TURN_DELAY_MS = 900;
const HEAVY_COMBO_CHANCE = 0.03;
const PRAISE_CHANCE = 1;
const TEAM_SIZE = 2;
const LIGHTNING_ASSIST_IMAGE = "./assets/lightning_boy_512.png";
const LIGHTNING_WEAPON_IMAGE = "./assets/lightningkid_custom.png";
const FIRE_WEAPON_IMAGE = "./assets/flaming_sword_512.png";
const GALAXY_WEAPON_IMAGE = "./assets/characters/galaxybro-attack.png";
const WATERSHA_IMAGE = "./assets/characters/waterwoman.png";
const WATERSHA_WEAPON_IMAGE = "./assets/characters/waterwoman-attack.png";
const SOCCERHOLDEN_IMAGE = "./assets/characters/soccerplayer.png";
const SOCCERHOLDEN_WEAPON_IMAGE = "./assets/characters/soccerplayerattack.png";
const ELIAS_IMAGE = "./assets/characters/elias_the_hacker.png";
const ELIAS_WEAPON_IMAGE = "./assets/characters/gamer_blast.png";
const SUPERDAD_IMAGE = "./assets/father_fire_sword_512.png";
const TYPE_ADVANTAGE = {
  Electric: "Water",
  Water: "Fire",
  Fire: "Nature",
  Nature: "Cosmic",
  Cosmic: "Cyber",
  Cyber: "Electric"
};
const PRAISE_LINES = [
  "Okay, that was unreal from {name}!",
  "{pilot} just made that look way too easy!",
  "Big hero move from {name} right there!",
  "No way. {pilot} actually pulled that off!",
  "{name} is absolutely owning this arena!"
];

const CHARACTER_LIBRARY = {
  galaxybro: {
    name: "Galaxy Bro",
    image: "./assets/characters/galaxybro.png",
    weapon: GALAXY_WEAPON_IMAGE,
    type: "Cosmic",
    special: "galaxy_combo",
    attacks: [
      { name: "Galaxy Ball", min: 15, max: 30, accuracy: 0.9, style: "heavy" },
      { name: "Mind Ball", min: 10, max: 15, accuracy: 0.93, style: "medium" },
      { name: "Galaxy Strip", min: 5, max: 10, accuracy: 0.95, style: "light" },
      { name: "Universal Heal", min: -27, max: -17, accuracy: 0.95, style: "heal" }
    ]
  },
  lightningkid: {
    name: "Lightning Kid",
    image: LIGHTNING_ASSIST_IMAGE,
    weapon: LIGHTNING_WEAPON_IMAGE,
    type: "Electric",
    special: "heal_75",
    attacks: [
      { name: "Lightning Strike", min: 15, max: 30, accuracy: 0.9, style: "heavy" },
      { name: "Air Strike", min: 10, max: 15, accuracy: 0.93, style: "medium" },
      { name: "Lightning Boomerang", min: 5, max: 10, accuracy: 0.95, style: "light" },
      { name: "Healing Lightning", min: -41, max: -29, accuracy: 0.95, style: "heal" }
    ]
  },
  superdad: {
    name: "Super Dad",
    image: SUPERDAD_IMAGE,
    weapon: FIRE_WEAPON_IMAGE,
    type: "Fire",
    special: "damage_75_floor_5",
    attacks: [
      { name: "Flame Sword", min: 15, max: 30, accuracy: 0.9, style: "heavy" },
      { name: "Flame Attack", min: 10, max: 15, accuracy: 0.93, style: "medium" },
      { name: "Fire Strike", min: 5, max: 10, accuracy: 0.95, style: "light" },
      { name: "Fireheal", min: -27, max: -17, accuracy: 0.95, style: "heal" }
    ]
  },
  starsha: {
    name: "Starsha",
    image: WATERSHA_IMAGE,
    weapon: WATERSHA_WEAPON_IMAGE,
    type: "Water",
    special: "super_block_heal_25",
    attacks: [
      { name: "Water Blast", min: 15, max: 30, accuracy: 0.9, style: "heavy" },
      { name: "Water Attack", min: 10, max: 15, accuracy: 0.93, style: "medium" },
      { name: "Dolphin Slap", min: 5, max: 10, accuracy: 0.95, style: "light" },
      { name: "Universal Heal", min: -27, max: -17, accuracy: 0.95, style: "heal" }
    ]
  },
  soccerholden: {
    name: "Soccer Holden",
    image: SOCCERHOLDEN_IMAGE,
    weapon: SOCCERHOLDEN_WEAPON_IMAGE,
    type: "Nature",
    special: "tiger_attack",
    attacks: [
      { name: "Bicycle Kick", min: 15, max: 30, accuracy: 0.9, style: "heavy" },
      { name: "Power Pass", min: 10, max: 15, accuracy: 0.93, style: "medium" },
      { name: "Slide Tackle", min: 5, max: 10, accuracy: 0.95, style: "light" },
      { name: "Recovery Stretch", min: -27, max: -17, accuracy: 0.95, style: "heal" }
    ]
  },
  eliashacker: {
    name: "Elias the Hacker",
    image: ELIAS_IMAGE,
    weapon: ELIAS_WEAPON_IMAGE,
    type: "Cyber",
    special: "hack_the_game",
    attacks: [
      { name: "Code Breaker", min: 15, max: 30, accuracy: 0.9, style: "heavy" },
      { name: "Glitch Burst", min: 10, max: 15, accuracy: 0.93, style: "medium" },
      { name: "Packet Jab", min: 5, max: 10, accuracy: 0.95, style: "light" },
      { name: "Exploit Charge", min: 34, max: 34, accuracy: 1, style: "charge" }
    ]
  }
};

let playerPokemon = {
  name: "Galaxy Bro",
  hp: MAX_HP,
  side: "player",
  pilot: "Player 1",
  superReady: false,
  superCharge: 0,
  blockGuess: null,
  blockLocked: false,
  shieldTurns: 0,
  hackCountdown: 0,
  attacks: [],
  weaponImage: GALAXY_WEAPON_IMAGE,
  image: "./assets/characters/galaxybro.png",
  specialType: "galaxy_combo",
  type: "Cosmic",
  characterId: "galaxybro"
};

let enemyPokemon = {
  name: "Lightning Kid",
  hp: MAX_HP,
  side: "enemy",
  pilot: "Player 2",
  superReady: false,
  superCharge: 0,
  blockGuess: null,
  blockLocked: false,
  shieldTurns: 0,
  hackCountdown: 0,
  attacks: [],
  weaponImage: LIGHTNING_WEAPON_IMAGE,
  image: LIGHTNING_ASSIST_IMAGE,
  specialType: "heal_75",
  type: "Electric",
  characterId: "lightningkid"
};

let locked = false;
let finished = false;
let activeSide = "player";
let openingBlockOnly = true;
let gameMode = "pvp";
let humanSide = "player";
let awaitingCpuChoice = false;
let setupActive = true;
let selectedPlayerTeamIds = ["galaxybro", "superdad"];
let selectedEnemyTeamIds = ["lightningkid", "starsha"];
let setupPickSide = "player";
let setupPickSlot = 0;
let playerTeam = [];
let enemyTeam = [];
let playerActiveIndex = 0;
let enemyActiveIndex = 0;
let crowdVoice = null;
let crowdVoiceReady = false;

restartEl.addEventListener("click", resetBattle);
window.addEventListener("keydown", handleBlockKey);
if (modePvpEl) modePvpEl.addEventListener("click", () => setGameMode("pvp"));
if (modeCpuEl) modeCpuEl.addEventListener("click", () => setGameMode("cpu"));
if (chooseCharacterGalaxybroEl) chooseCharacterGalaxybroEl.addEventListener("click", () => chooseCharacter("galaxybro"));
if (chooseCharacterLightningkidEl) chooseCharacterLightningkidEl.addEventListener("click", () => chooseCharacter("lightningkid"));
if (chooseCharacterSuperdadEl) chooseCharacterSuperdadEl.addEventListener("click", () => chooseCharacter("superdad"));
if (chooseCharacterStarshaEl) chooseCharacterStarshaEl.addEventListener("click", () => chooseCharacter("starsha"));
if (chooseCharacterSoccerholdenEl) chooseCharacterSoccerholdenEl.addEventListener("click", () => chooseCharacter("soccerholden"));
if (chooseCharacterEliashackerEl) chooseCharacterEliashackerEl.addEventListener("click", () => chooseCharacter("eliashacker"));
if (startGameEl) startGameEl.addEventListener("click", startGameFromSetup);

init();

function init() {
  assignBattleCharacters();
  syncCharacterUi();
  syncModeUi();
  initCrowdVoice();
  playerLogTitleEl.textContent = `${playerPokemon.name} Log`;
  enemyLogTitleEl.textContent = `${enemyPokemon.name} Log`;
  initSetupFlow();
}

function setGameMode(mode) {
  if (mode !== "pvp" && mode !== "cpu") return;
  gameMode = mode;
  setupActive = true;
  awaitingCpuChoice = true;
  humanSide = "player";
  resetTeamPicks();
  syncModeUi();
  syncCharacterSelectionUi();
  showSetupPage(2);
}

function chooseCharacter(characterId) {
  if (!CHARACTER_LIBRARY[characterId]) return;
  if (gameMode === "cpu") {
    if (setupPickSide !== "player") return;
    if (selectedPlayerTeamIds.includes(characterId)) {
      if (setupCharacterInstructionEl) setupCharacterInstructionEl.textContent = "Player 1: choose a different character for slot 2.";
      return;
    }
    selectedPlayerTeamIds[setupPickSlot] = characterId;
    setupPickSlot += 1;
    if (setupPickSlot < TEAM_SIZE) {
      syncCharacterSelectionUi();
      return;
    }
    selectedEnemyTeamIds = pickCpuTeamIds(selectedPlayerTeamIds);
    awaitingCpuChoice = false;
    syncModeUi();
    if (setupSummaryEl) {
      const p1 = selectedPlayerTeamIds.map((id) => CHARACTER_LIBRARY[id].name).join(" + ");
      const p2 = selectedEnemyTeamIds.map((id) => CHARACTER_LIBRARY[id].name).join(" + ");
      setupSummaryEl.textContent = `Vs Computer teams: ${p1} vs ${p2}.`;
    }
    showSetupPage(3);
    return;
  }

  const teamIds = setupPickSide === "player" ? selectedPlayerTeamIds : selectedEnemyTeamIds;
  if (teamIds.includes(characterId)) {
    if (setupCharacterInstructionEl) {
      setupCharacterInstructionEl.textContent = `${setupPickSide === "player" ? "Player 1" : "Player 2"}: choose a different character for slot ${setupPickSlot + 1}.`;
    }
    return;
  }
  teamIds[setupPickSlot] = characterId;
  setupPickSlot += 1;
  if (setupPickSlot < TEAM_SIZE) {
    syncCharacterSelectionUi();
    return;
  }

  if (setupPickSide === "player") {
    setupPickSide = "enemy";
    setupPickSlot = 0;
    awaitingCpuChoice = true;
    syncCharacterSelectionUi();
    return;
  }

  awaitingCpuChoice = false;
  syncModeUi();
  if (setupSummaryEl) {
    const p1 = selectedPlayerTeamIds.map((id) => CHARACTER_LIBRARY[id].name).join(" + ");
    const p2 = selectedEnemyTeamIds.map((id) => CHARACTER_LIBRARY[id].name).join(" + ");
    setupSummaryEl.textContent = `2 Players teams selected. Player 1: ${p1}. Player 2: ${p2}.`;
  }
  showSetupPage(3);
}

function initSetupFlow() {
  setupActive = true;
  awaitingCpuChoice = true;
  resetTeamPicks();
  if (setupFlowEl) setupFlowEl.hidden = false;
  if (gameStageEl) gameStageEl.hidden = true;
  if (setupSummaryEl) setupSummaryEl.textContent = "Ready to begin.";
  showSetupPage(1);
  syncModeUi();
  syncCharacterSelectionUi();
}

function showSetupPage(pageNum) {
  if (setupModePageEl) setupModePageEl.hidden = pageNum !== 1;
  if (setupCharacterPageEl) setupCharacterPageEl.hidden = pageNum !== 2;
  if (setupStartPageEl) setupStartPageEl.hidden = pageNum !== 3;
}

function startGameFromSetup() {
  if (awaitingCpuChoice) return;
  setupActive = false;
  if (setupFlowEl) setupFlowEl.hidden = true;
  if (gameStageEl) gameStageEl.hidden = false;
  resetBattle();
  syncTurnUi();
}

function syncCharacterSelectionUi() {
  if (!setupCharacterInstructionEl || !setupCharacterTitleEl) return;
  const picked1 = selectedPlayerTeamIds.filter(Boolean).length;
  const picked2 = selectedEnemyTeamIds.filter(Boolean).length;
  if (gameMode === "cpu") {
    setupCharacterTitleEl.textContent = "2. Choose Team (2 Characters)";
    setupCharacterInstructionEl.textContent = `Player 1: pick character ${picked1 + 1} of ${TEAM_SIZE}.`;
    return;
  }
  setupCharacterTitleEl.textContent = "2. Choose Teams (2 Characters Each)";
  const label = setupPickSide === "player" ? "Player 1" : "Player 2";
  const slot = setupPickSlot + 1;
  const currentPicked = setupPickSide === "player" ? picked1 : picked2;
  setupCharacterInstructionEl.textContent = `${label}: pick character ${slot} of ${TEAM_SIZE}. Selected so far: ${currentPicked}/${TEAM_SIZE}.`;
}

function syncModeUi() {
  const enemyPilot = gameMode === "cpu" ? "Computer" : "Player 2";
  if (gameMode === "cpu") {
    playerPokemon.pilot = "Player 1";
    enemyPokemon.pilot = enemyPilot;
  } else {
    playerPokemon.pilot = "Player 1";
    enemyPokemon.pilot = enemyPilot;
  }
  playerTeam.forEach((m) => { m.pilot = "Player 1"; });
  enemyTeam.forEach((m) => { m.pilot = enemyPilot; });
  if (playerPilotEl) playerPilotEl.textContent = playerPokemon.pilot;
  if (enemyPilotEl) enemyPilotEl.textContent = enemyPokemon.pilot;
  if (modePvpEl) modePvpEl.classList.toggle("active", gameMode === "pvp");
  if (modeCpuEl) modeCpuEl.classList.toggle("active", gameMode === "cpu");
}

function isCpuControlled(side) {
  return !setupActive && gameMode === "cpu" && !awaitingCpuChoice && side === "enemy";
}

function resetTeamPicks() {
  selectedPlayerTeamIds = [];
  selectedEnemyTeamIds = [];
  setupPickSide = "player";
  setupPickSlot = 0;
}

function pickCpuTeamIds(playerIds) {
  const ids = Object.keys(CHARACTER_LIBRARY).filter((id) => !playerIds.includes(id));
  return sanitizeTeamIds(ids.slice(0, TEAM_SIZE), ["lightningkid", "starsha"], playerIds);
}

function sanitizeTeamIds(teamIds, fallbackIds, avoidIds = []) {
  const pool = Object.keys(CHARACTER_LIBRARY).filter((id) => !avoidIds.includes(id));
  const unique = [];
  (teamIds || []).forEach((id) => {
    if (CHARACTER_LIBRARY[id] && !unique.includes(id) && !avoidIds.includes(id)) unique.push(id);
  });
  (fallbackIds || []).forEach((id) => {
    if (unique.length < TEAM_SIZE && CHARACTER_LIBRARY[id] && !unique.includes(id) && !avoidIds.includes(id)) unique.push(id);
  });
  pool.forEach((id) => {
    if (unique.length < TEAM_SIZE && !unique.includes(id)) unique.push(id);
  });
  return unique.slice(0, TEAM_SIZE);
}

function createMonsterFromCharacter(characterId, side, pilot) {
  const data = CHARACTER_LIBRARY[characterId] || CHARACTER_LIBRARY.galaxybro;
  return {
    name: data.name,
    hp: MAX_HP,
    side,
    pilot,
    superReady: false,
    superCharge: 0,
    blockGuess: null,
    blockLocked: false,
    shieldTurns: 0,
    hackCountdown: 0,
    attacks: cloneAttacks(data.attacks),
    weaponImage: data.weapon,
    image: data.image,
    specialType: data.special,
    type: data.type,
    characterId
  };
}

function getTeamBySide(side) {
  return side === "enemy" ? enemyTeam : playerTeam;
}

function getActiveIndexBySide(side) {
  return side === "enemy" ? enemyActiveIndex : playerActiveIndex;
}

function resetTeamState(side) {
  const team = getTeamBySide(side);
  team.forEach((m) => {
    m.hp = MAX_HP;
    m.blockGuess = null;
    m.blockLocked = false;
    m.shieldTurns = 0;
    m.hackCountdown = 0;
    m.superReady = false;
    m.superCharge = 0;
  });
  if (side === "player") {
    playerActiveIndex = 0;
    playerPokemon = team[0];
  } else {
    enemyActiveIndex = 0;
    enemyPokemon = team[0];
  }
}

function setActiveMonster(side, index) {
  const team = getTeamBySide(side);
  if (!team[index] || team[index].hp <= 0) return false;
  if (side === "player") {
    playerActiveIndex = index;
    playerPokemon = team[index];
  } else {
    enemyActiveIndex = index;
    enemyPokemon = team[index];
  }
  syncCharacterUi();
  syncModeUi();
  syncUi();
  return true;
}

function hasBenchAvailable(side) {
  const team = getTeamBySide(side);
  const activeIndex = getActiveIndexBySide(side);
  return team.some((m, idx) => idx !== activeIndex && m.hp > 0);
}

function resetBattle() {
  assignBattleCharacters();
  resetTeamState("player");
  resetTeamState("enemy");
  syncCharacterUi();
  syncModeUi();
  locked = false;
  finished = false;
  activeSide = "player";
  openingBlockOnly = true;
  playerPokemon.superReady = false;
  enemyPokemon.superReady = false;
  playerPokemon.superCharge = 0;
  enemyPokemon.superCharge = 0;
  messageEl.textContent = turnPrompt(getMonsterBySide(activeSide));
  restartEl.hidden = true;
  playerLogEl.innerHTML = "";
  enemyLogEl.innerHTML = "";
  addLog("player", "A new battle starts.");
  addLog("enemy", "A new battle starts.");
  renderAttackButtons();
  syncUi();
  syncTurnUi();
}

function syncTurnUi() {
  if (playerCardEl) playerCardEl.classList.remove("turn-active");
  if (enemyCardEl) enemyCardEl.classList.remove("turn-active");

  if (setupActive) {
    if (turnIndicatorEl) turnIndicatorEl.textContent = "Turn: Setup";
    return;
  }

  if (finished) {
    if (turnIndicatorEl) turnIndicatorEl.textContent = "Turn: Battle Over";
    return;
  }

  const activeMonster = getMonsterBySide(activeSide);
  if (turnIndicatorEl) {
    turnIndicatorEl.textContent = `Turn: ${activeMonster.pilot} (${activeMonster.name})`;
  }
  if (activeSide === "player") {
    if (playerCardEl) playerCardEl.classList.add("turn-active");
  } else {
    if (enemyCardEl) enemyCardEl.classList.add("turn-active");
  }
}

function cloneAttacks(attacks) {
  return attacks.map((attack) => ({ ...attack }));
}

function applyCharacter(monster, characterId) {
  const data = CHARACTER_LIBRARY[characterId] || CHARACTER_LIBRARY.galaxybro;
  monster.characterId = characterId;
  monster.name = data.name;
  monster.image = data.image;
  monster.weaponImage = data.weapon;
  monster.specialType = data.special;
  monster.type = data.type;
  monster.attacks = cloneAttacks(data.attacks);
}

function assignBattleCharacters() {
  const validPlayerIds = sanitizeTeamIds(selectedPlayerTeamIds, ["galaxybro", "superdad"]);
  const validEnemyIds = sanitizeTeamIds(selectedEnemyTeamIds, ["lightningkid", "starsha"], validPlayerIds);
  selectedPlayerTeamIds = validPlayerIds;
  selectedEnemyTeamIds = validEnemyIds;

  playerTeam = validPlayerIds.map((id) => createMonsterFromCharacter(id, "player", "Player 1"));
  enemyTeam = validEnemyIds.map((id) => createMonsterFromCharacter(id, "enemy", gameMode === "cpu" ? "Computer" : "Player 2"));
  playerActiveIndex = 0;
  enemyActiveIndex = 0;
  playerPokemon = playerTeam[playerActiveIndex];
  enemyPokemon = enemyTeam[enemyActiveIndex];
}

function syncCharacterUi() {
  playerNameEl.textContent = `${playerPokemon.name} (${playerPokemon.type})`;
  enemyNameEl.textContent = `${enemyPokemon.name} (${enemyPokemon.type})`;
  playerLogTitleEl.textContent = `${playerPokemon.name} Log`;
  enemyLogTitleEl.textContent = `${enemyPokemon.name} Log`;
  if (playerCreatureEl) playerCreatureEl.style.backgroundImage = `url("${playerPokemon.image}")`;
  if (enemyCreatureEl) enemyCreatureEl.style.backgroundImage = `url("${enemyPokemon.image}")`;
}

function renderAttackButtons() {
  attacksEl.innerHTML = "";
  if (setupActive) return;
  if (awaitingCpuChoice) {
    const hint = document.createElement("p");
    hint.className = "attack-hint";
    hint.textContent = "Choose your fighter above to start Vs Computer.";
    attacksEl.appendChild(hint);
    return;
  }
  const activeMonster = getMonsterBySide(activeSide);
  if (isCpuControlled(activeMonster.side)) {
    const hint = document.createElement("p");
    hint.className = "attack-hint";
    hint.textContent = "Computer is taking its turn...";
    attacksEl.appendChild(hint);
    return;
  }
  const canPickAttack = activeMonster.blockLocked && !locked && !finished;

  if (!canPickAttack) {
    const hint = document.createElement("p");
    hint.className = "attack-hint";
    hint.textContent = "Choose your block to unlock attack buttons (or press keys 1, 2, 3).";
    attacksEl.appendChild(hint);

    const opponent = getOpponent(activeMonster);
    const blockOptions = document.createElement("div");
    blockOptions.className = "block-options";
    for (let i = 0; i < 3; i += 1) {
      const blockBtn = document.createElement("button");
      blockBtn.type = "button";
      blockBtn.className = "block-btn";
      const blockedMove = opponent.attacks[i] ? attackDisplayName(opponent.attacks[i]) : `Move ${i + 1}`;
      blockBtn.textContent = `${i + 1}: Block ${blockedMove}`;
      blockBtn.disabled = locked || finished || activeMonster.blockLocked;
      blockBtn.addEventListener("click", () => lockBlockGuess(i + 1));
      blockOptions.appendChild(blockBtn);
    }
    attacksEl.appendChild(blockOptions);
    return;
  }

  activeMonster.attacks.forEach((attack, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = `${attackDisplayName(attack)} (${activeMonster.name})`;
    btn.disabled = locked || finished;
    btn.addEventListener("click", () => handleTurn(index));
    attacksEl.appendChild(btn);
  });

  const superBtn = document.createElement("button");
  superBtn.type = "button";
  superBtn.disabled = locked || finished || !canUseSuper(activeMonster);
  superBtn.textContent = `${activeMonster.name} Special ${canUseSuper(activeMonster) ? "(Ready)" : "(Locked)"}`;
  superBtn.addEventListener("click", () => handleSuperPower(activeMonster));
  attacksEl.appendChild(superBtn);

  if (hasBenchAvailable(activeMonster.side)) {
    const team = getTeamBySide(activeMonster.side);
    const activeIndex = getActiveIndexBySide(activeMonster.side);
    team.forEach((mate, index) => {
      if (index === activeIndex || mate.hp <= 0) return;
      const switchBtn = document.createElement("button");
      switchBtn.type = "button";
      switchBtn.className = "switch-btn";
      switchBtn.disabled = locked || finished;
      switchBtn.textContent = `Switch to ${mate.name} (${mate.hp}/${MAX_HP}) - Lose Turn`;
      switchBtn.addEventListener("click", () => handleSwitch(activeMonster.side, index));
      attacksEl.appendChild(switchBtn);
    });
  }
}

function handleSwitch(side, targetIndex) {
  if (setupActive || locked || finished || awaitingCpuChoice) return;
  if (side !== activeSide) return;
  locked = true;
  const activeMonster = getMonsterBySide(side);
  if (!activeMonster.blockLocked) {
    locked = false;
    const prompt = "You must choose your block move.";
    messageEl.textContent = `${prompt} ${turnPrompt(activeMonster)}`;
    addLog(activeMonster.side, `${activeMonster.pilot}: ${prompt}`);
    return;
  }
  if (!setActiveMonster(side, targetIndex)) {
    locked = false;
    return;
  }
  const switchedIn = getMonsterBySide(side);
  addLog(side, `${switchedIn.pilot}: switched to ${switchedIn.name} and lost the turn.`);
  activeSide = switchedIn.side === "player" ? "enemy" : "player";
  messageEl.textContent = turnPrompt(getMonsterBySide(activeSide));
  locked = false;
  renderAttackButtons();
  syncTurnUi();
  if (isCpuControlled(activeSide)) {
    queueComputerTurn(420);
  }
}

function handleTurn(attackIndex) {
  if (setupActive || locked || finished || awaitingCpuChoice) return;
  const attacker = getMonsterBySide(activeSide);
  if (!attacker.blockLocked) {
    const prompt = "You must choose your block move.";
    messageEl.textContent = `${prompt} ${turnPrompt(attacker)}`;
    addLog(attacker.side, `${attacker.pilot}: ${prompt}`);
    return;
  }
  locked = true;
  renderAttackButtons();

  const defender = getOpponent(attacker);
  const attack = attacker.attacks[attackIndex];
  const result = resolveAttack(attacker, defender, attack, attackIndex);
  if (result.kind === "damage" && result.hits > 0) {
    addSuperCharge(attacker, result.hits);
  }
  syncUi();
  const animDuration = playMoveAnimation(attacker, defender, attack, result);
  addLog(
    attacker.side,
    withPraise(`${attacker.pilot}: ${attacker.name} used ${attackDisplayName(attack)}. ${result.text}`, attacker)
  );
  if (result.kind === "block") {
    showCallout("BLOCK");
    messageEl.textContent = `Block success! ${defender.name} blocked ${attackDisplayName(attack)}.`;
    addLog(defender.side, withPraise(`${defender.pilot}: BLOCK SUCCESS!`, defender));
  } else if (result.kind === "damage" && result.hits === 3 && (attack.style === "light" || attack.style === "medium" || attack.style === "heavy")) {
    showCallout("COMBO");
  }

  if (defender.hp <= 0 && handleFaintAndSwap(defender, attacker)) return;
  if (applyHackTick(attacker)) {
    syncUi();
    if (handleFaintAndSwap(attacker, defender)) return;
    return;
  }

  activeSide = defender.side;
  const waitMs = Math.max(TURN_DELAY_MS, (animDuration || 0) + 220);
  setTimeout(() => {
    messageEl.textContent = turnPrompt(getMonsterBySide(activeSide));
    locked = false;
    renderAttackButtons();
    syncTurnUi();
    if (isCpuControlled(activeSide)) {
      queueComputerTurn(420);
    }
  }, waitMs);
}

function handleSuperPower(attacker) {
  if (setupActive || locked || finished || awaitingCpuChoice || !canUseSuper(attacker)) return;
  if (!attacker.blockLocked) {
    const prompt = "You must choose your block move.";
    messageEl.textContent = `${prompt} ${turnPrompt(attacker)}`;
    addLog(attacker.side, `${attacker.pilot}: ${prompt}`);
    return;
  }
  locked = true;
  renderAttackButtons();

  const defender = getOpponent(attacker);
  let result;
  let animDuration = 0;

  if (attacker.specialType === "galaxy_combo") {
    const healAmount = 50;
    const baseDamage = 50;
    attacker.hp = Math.min(MAX_HP, attacker.hp + healAmount);
    if (defender.shieldTurns > 0) {
      defender.shieldTurns -= 1;
      result = {
        text: `${attacker.name} SPECIAL healed 50 HP, but ${defender.name}'s super block stopped the attack (${defender.shieldTurns} turns left).`,
        kind: "block",
        hits: 0
      };
    } else {
      const multiplier = getTypeMultiplier(attacker.type, defender.type);
      const damage = Math.max(1, Math.round(baseDamage * multiplier));
      defender.hp = Math.max(0, defender.hp - damage);
      result = {
        text: `${attacker.name} SPECIAL healed 50 HP and hit for ${damage} damage${typeEffectText(multiplier)} (${attacker.hp}/${MAX_HP} HP, ${defender.name} ${defender.hp}/${MAX_HP} HP).`,
        kind: "damage",
        hits: 1
      };
    }
    animDuration = animateGalaxyBroSpecial(getCreatureEl(attacker.side), getCreatureEl(defender.side), attacker.weaponImage);
  } else if (attacker.specialType === "heal_75") {
    const healAmount = Math.ceil(MAX_HP * 0.75);
    attacker.hp = Math.min(MAX_HP, attacker.hp + healAmount);
    result = { text: `${attacker.name} used SUPER POWER and healed ${healAmount} HP (${attacker.hp}/${MAX_HP} HP).`, kind: "heal", hits: 0 };
    animDuration = animateOrbitHeal(getCreatureEl(attacker.side), attacker.weaponImage, 2100, 4, true);
  } else if (attacker.specialType === "super_block_heal_25") {
    const healAmount = 25;
    attacker.hp = Math.min(MAX_HP, attacker.hp + healAmount);
    attacker.shieldTurns = 2;
    result = {
      text: `${attacker.name} used SUPER POWER: healed 25 HP and activated super block for the next two turns.`,
      kind: "heal",
      hits: 0
    };
    animDuration = animateStarshaSpecial(getCreatureEl(attacker.side), attacker.weaponImage);
  } else if (attacker.specialType === "tiger_attack") {
    const perHitDamage = 15;
    const guaranteedHits = 25;
    const bonusChainChance = 0.98;
    const maxBonusHits = 10;
    let hits = guaranteedHits;
    let bonusHits = 0;
    while (bonusHits < maxBonusHits && Math.random() < bonusChainChance) {
      bonusHits += 1;
    }
    hits += bonusHits;
    const baseDamage = hits * perHitDamage;
    const multiplier = getTypeMultiplier(attacker.type, defender.type);
    const damage = Math.max(1, Math.round(baseDamage * multiplier));
    const text = `${attacker.name} used TIGER ATTACK: ${hits} rapid hits for ${damage} total damage.`;
    if (defender.shieldTurns > 0) {
      defender.shieldTurns -= 1;
      result = {
        text: `${defender.name}'s super block stopped TIGER ATTACK (${defender.shieldTurns} turns left).`,
        kind: "block",
        hits: 0
      };
    } else {
      defender.hp = Math.max(0, defender.hp - damage);
      result = {
        text: `${text}${typeEffectText(multiplier)} (${defender.name} at ${defender.hp}/${MAX_HP} HP).`,
        kind: "damage",
        hits
      };
    }
    if (result.kind === "damage") {
      animDuration = animateTigerChain(getCreatureEl(attacker.side), getCreatureEl(defender.side), attacker.weaponImage, result.hits);
    } else {
      animDuration = animateStraightBolt(getCreatureEl(attacker.side), getCreatureEl(defender.side), attacker.weaponImage, false);
    }
  } else if (attacker.specialType === "hack_the_game") {
    const baseDamage = 200;
    const multiplier = getTypeMultiplier(attacker.type, defender.type);
    const damage = Math.max(1, Math.round(baseDamage * multiplier));
    if (defender.shieldTurns > 0) {
      defender.shieldTurns -= 1;
      result = {
        text: `${defender.name}'s super block stopped HACK THE GAME (${defender.shieldTurns} turns left).`,
        kind: "block",
        hits: 0
      };
      animDuration = animateStraightBolt(getCreatureEl(attacker.side), getCreatureEl(defender.side), attacker.weaponImage, false);
    } else {
      defender.hp = Math.max(0, defender.hp - damage);
      result = {
        text: `Elias hacked the game for ${damage} damage${typeEffectText(multiplier)} (${defender.name} at ${defender.hp}/${MAX_HP} HP).`,
        kind: "damage",
        hits: 1
      };
      animDuration = animateStraightBolt(getCreatureEl(attacker.side), getCreatureEl(defender.side), attacker.weaponImage, true);
    }
    if (messageEl) {
      messageEl.innerHTML = "<strong>Elias hacked the game</strong>";
    }
    showCallout("ELIAS HACKED THE GAME");
  } else {
    const baseDamage = Math.ceil(MAX_HP * 0.75);
    if (defender.shieldTurns > 0) {
      defender.shieldTurns -= 1;
      result = {
        text: `${defender.name}'s super block stopped the SUPER POWER (${defender.shieldTurns} turns left).`,
        kind: "block",
        hits: 0
      };
    } else {
      const multiplier = getTypeMultiplier(attacker.type, defender.type);
      const damage = Math.max(1, Math.round(baseDamage * multiplier));
      defender.hp = Math.max(5, defender.hp - damage);
      result = { text: `SUPER POWER hit for ${damage} damage${typeEffectText(multiplier)} (${defender.name} at ${defender.hp}/${MAX_HP} HP).`, kind: "damage", hits: 1 };
    }
    animDuration = animateRunSlash(getCreatureEl(attacker.side), getCreatureEl(defender.side), true) + 300;
  }

  attacker.superReady = false;
  attacker.superCharge = 0;
  syncUi();
  addLog(attacker.side, withPraise(`${attacker.pilot}: ${result.text}`, attacker));
  if (result.kind === "block") {
    showCallout("BLOCK");
  } else if (result.kind === "damage" && result.hits >= 3) {
    showCallout(`COMBO x${result.hits}`);
  }

  if (defender.hp <= 0 && handleFaintAndSwap(defender, attacker)) return;
  if (applyHackTick(attacker)) {
    syncUi();
    if (handleFaintAndSwap(attacker, defender)) return;
    return;
  }

  activeSide = defender.side;
  const waitMs = Math.max(TURN_DELAY_MS, (animDuration || 0) + 220);
  setTimeout(() => {
    messageEl.textContent = turnPrompt(getMonsterBySide(activeSide));
    locked = false;
    renderAttackButtons();
    syncTurnUi();
    if (isCpuControlled(activeSide)) {
      queueComputerTurn(420);
    }
  }, waitMs);
}

function resolveAttack(attacker, defender, attack, attackIndex) {
  if (attack.style !== "heal" && attack.style !== "charge" && defender.shieldTurns > 0) {
    defender.shieldTurns -= 1;
    return {
      text: `${defender.name}'s super block stopped the attack (${defender.shieldTurns} turns left).`,
      kind: "block",
      hits: 0
    };
  }

  const predictedMove = attackIndex + 1;
  const blockableMove = predictedMove <= 3;
  const blocked = Boolean(defender.blockLocked && blockableMove && defender.blockGuess === predictedMove);
  defender.blockGuess = null;
  defender.blockLocked = false;

  if (blocked) {
    return {
      text: `${defender.name} blocked the attack.`,
      kind: "block",
      hits: 0
    };
  }

  return performAttack(attacker, defender, attack);
}

function performAttack(attacker, defender, attack) {
  if (attack.style === "charge") {
    addSuperChargeAmount(attacker, attack.min);
    return {
      text: `${attacker.name} gained ${attack.min}% Special bar.`,
      kind: "charge",
      hits: 0
    };
  }

  const hitRoll = Math.random();
  if (hitRoll > attack.accuracy) {
    return { text: "It missed.", kind: "miss", hits: 0 };
  }

  const amount = randomInt(attack.min, attack.max);

  if (amount < 0) {
    const heal = Math.min(MAX_HP - attacker.hp, Math.abs(amount));
    attacker.hp += heal;
    return {
      text: `${attacker.name} healed ${heal} HP (now ${attacker.hp}/${MAX_HP}).`,
      kind: "heal",
      hits: 0
    };
  }

  let hits = 1;
  if (attack.style === "light" && Math.random() < 0.5) {
    hits = 3;
  } else if (attack.style === "medium" && Math.random() < 0.2) {
    hits = 3;
  } else if (attack.style === "heavy" && Math.random() < HEAVY_COMBO_CHANCE) {
    hits = 3;
  }

  let damage = 0;
  for (let i = 0; i < hits; i += 1) {
    damage += randomInt(attack.min, attack.max);
  }
  const crit = Math.random() < 0.12;
  if (crit) {
    damage = Math.round(damage * 1.5);
  }
  const multiplier = getTypeMultiplier(attacker.type, defender.type);
  damage = Math.max(1, Math.round(damage * multiplier));

  defender.hp = Math.max(0, defender.hp - damage);
  const comboText = hits === 3 ? " 3-hit combo!" : "";
  const typeText = typeEffectText(multiplier);
  if (crit) {
    return {
      text: `Critical hit for ${damage} damage${comboText}${typeText} (${defender.name} at ${defender.hp}/${MAX_HP} HP).`,
      kind: "damage",
      hits
    };
  }
  return {
    text: `${damage} damage dealt${comboText}${typeText} (${defender.name} at ${defender.hp}/${MAX_HP} HP).`,
    kind: "damage",
    hits
  };
}

function syncUi() {
  setHp(playerPokemon.hp, playerHpEl, playerHpLabelEl);
  setHp(enemyPokemon.hp, enemyHpEl, enemyHpLabelEl);
  setSuper(playerPokemon, playerSuperEl, playerSuperLabelEl, playerSpecialReadyEl);
  setSuper(enemyPokemon, enemySuperEl, enemySuperLabelEl, enemySpecialReadyEl);
}

function setHp(hp, barEl, labelEl) {
  const percent = (hp / MAX_HP) * 100;
  barEl.style.width = `${percent}%`;
  barEl.style.background = hpColor(percent);
  labelEl.textContent = `HP ${hp}/${MAX_HP}`;
}

function hpColor(percent) {
  if (percent > 50) return "#3fa34d";
  if (percent > 20) return "#f0a63c";
  return "#de4137";
}

function getTypeMultiplier(attackerType, defenderType) {
  if (!attackerType || !defenderType) return 1;
  if (TYPE_ADVANTAGE[attackerType] === defenderType) return 1.25;
  if (TYPE_ADVANTAGE[defenderType] === attackerType) return 0.8;
  return 1;
}

function typeEffectText(multiplier) {
  if (multiplier > 1) return " It's super effective!";
  if (multiplier < 1) return " It's not very effective...";
  return "";
}

function setSuper(monster, barEl, labelEl, readyEl) {
  const charge = Math.max(0, Math.min(MAX_SUPER, monster.superCharge || 0));
  const percent = (charge / MAX_SUPER) * 100;
  if (barEl) {
    barEl.style.width = `${percent}%`;
    barEl.classList.toggle("ready", percent >= 100);
  }
  if (labelEl) {
    labelEl.textContent = `SP ${charge}/${MAX_SUPER}`;
  }
  if (readyEl) {
    readyEl.hidden = percent < 100;
  }
  monster.superReady = percent >= 100;
}

function canUseSuper(monster) {
  return (monster.superCharge || 0) >= MAX_SUPER;
}

function addSuperCharge(monster, hits) {
  if (!hits || hits < 1) return;
  addSuperChargeAmount(monster, hits * SUPER_PER_HIT);
}

function addSuperChargeAmount(monster, amount) {
  if (!amount || amount <= 0) return;
  const prev = Math.max(0, Math.min(MAX_SUPER, monster.superCharge || 0));
  const next = Math.min(MAX_SUPER, prev + amount);
  monster.superCharge = next;
  monster.superReady = next >= MAX_SUPER;
  if (prev < MAX_SUPER && next >= MAX_SUPER) {
    addLog(monster.side, `${monster.name} SPECIAL is ready!`);
  }
}

function applyHackTick(monster) {
  if (!monster || monster.hackCountdown <= 0) return false;
  monster.hackCountdown -= 1;
  if (monster.hackCountdown <= 0) {
    monster.hp = 0;
    addLog(monster.side, `${monster.name} was deleted by the hack.`);
    return true;
  }
  return false;
}

function handleFaintAndSwap(faintedMonster, attacker) {
  if (faintedMonster.hp > 0) return false;
  const side = faintedMonster.side;
  const team = getTeamBySide(side);
  const replacementIndex = team.findIndex((m, idx) => idx !== getActiveIndexBySide(side) && m.hp > 0);
  if (replacementIndex === -1) {
    endBattle(`${attacker.pilot} wins with ${attacker.name}!`);
    return true;
  }
  const faintedName = faintedMonster.name;
  setActiveMonster(side, replacementIndex);
  const replacement = getMonsterBySide(side);
  addLog(side, `${replacement.pilot}: ${faintedName} fainted. ${replacement.name} switched in.`);
  activeSide = side;
  messageEl.textContent = turnPrompt(replacement);
  locked = false;
  renderAttackButtons();
  syncTurnUi();
  if (isCpuControlled(activeSide)) {
    queueComputerTurn(420);
  }
  return true;
}

function endBattle(text) {
  finished = true;
  locked = true;
  messageEl.textContent = text;
  addLog("player", text);
  addLog("enemy", text);
  renderAttackButtons();
  syncTurnUi();
  restartEl.hidden = false;
}

function addLog(side, text) {
  const crowdMatch = text.match(/Crowd: "([^"]+)"/);
  if (ribbonLogEl) {
    if (text.includes("Elias hacked the game")) {
      ribbonLogEl.innerHTML = "<strong>Elias hacked the game</strong>";
    } else {
      ribbonLogEl.textContent = crowdMatch ? `Crowd: "${crowdMatch[1]}"` : text;
    }
  }
  if (crowdMatch) {
    speakCrowd(crowdMatch[1]);
  }
  const item = document.createElement("li");
  item.textContent = text;
  const logEl = side === "enemy" ? enemyLogEl : playerLogEl;
  logEl.appendChild(item);
  logEl.scrollTop = logEl.scrollHeight;
}

function getMonsterBySide(side) {
  return side === "enemy" ? enemyPokemon : playerPokemon;
}

function getOpponent(monster) {
  return monster.side === "enemy" ? playerPokemon : enemyPokemon;
}

function getCreatureEl(side) {
  return side === "enemy" ? enemyCreatureEl : playerCreatureEl;
}

function turnPrompt(monster) {
  if (awaitingCpuChoice) {
    return "Choose your character above.";
  }
  if (isCpuControlled(monster.side)) {
    if (monster.blockLocked) {
      return "Computer locked a block and is choosing an attack...";
    }
    return "Computer is choosing a block...";
  }
  const opponent = getOpponent(monster);
  const options = [
    `[1] ${opponent.attacks[0] ? attackDisplayName(opponent.attacks[0]) : "Move 1"}`,
    `[2] ${opponent.attacks[1] ? attackDisplayName(opponent.attacks[1]) : "Move 2"}`,
    `[3] ${opponent.attacks[2] ? attackDisplayName(opponent.attacks[2]) : "Move 3"}`
  ].join(", ");
  if (openingBlockOnly && monster.side === humanSide) {
    return `${monster.pilot}: choose your block first (${options}).`;
  }
  if (monster.blockLocked) {
    return `${monster.pilot}: block locked. Choose ${monster.name}'s attack.`;
  }
  return `${monster.pilot}: choose your block (${options}).`;
}

function handleBlockKey(event) {
  if (setupActive || locked || finished || awaitingCpuChoice) return;
  if (!["1", "2", "3"].includes(event.key)) return;
  lockBlockGuess(Number(event.key));
}

function attackDisplayName(attack) {
  const type = attack.style === "heal"
    ? "Heal"
    : attack.style === "charge"
      ? "Charge"
    : attack.style === "heavy"
      ? "Heavy"
      : attack.style === "medium"
        ? "Medium"
        : "Light";
  return `${attack.name} [${type}]`;
}

function autoLockBlock(monster) {
  if (monster.blockLocked) return;
  monster.blockGuess = randomInt(1, 3);
  monster.blockLocked = true;
}

function lockBlockGuess(guess) {
  if (setupActive || locked || finished || awaitingCpuChoice) return;
  if (![1, 2, 3].includes(guess)) return;
  const activeMonster = getMonsterBySide(activeSide);
  if (isCpuControlled(activeMonster.side)) return;

  if (activeMonster.blockLocked) {
    addLog(activeMonster.side, `${activeMonster.pilot}: block already locked in.`);
    messageEl.textContent = turnPrompt(activeMonster);
    return;
  }
  activeMonster.blockGuess = guess;
  activeMonster.blockLocked = true;
  addLog(activeMonster.side, `${activeMonster.pilot}: block locked in.`);

  if (openingBlockOnly && activeMonster.side === humanSide) {
    openingBlockOnly = false;
    const next = getOpponent(activeMonster);
    activeSide = next.side;
    messageEl.textContent = turnPrompt(next);
    renderAttackButtons();
    syncTurnUi();
    if (isCpuControlled(activeSide)) {
      queueComputerTurn(480);
    }
    return;
  }

  messageEl.textContent = turnPrompt(activeMonster);
  renderAttackButtons();
  syncTurnUi();
}

function queueComputerTurn(delayMs) {
  if (gameMode !== "cpu") return;
  if (awaitingCpuChoice || finished || !isCpuControlled(activeSide)) return;
  setTimeout(() => {
    if (gameMode !== "cpu" || awaitingCpuChoice || finished || !isCpuControlled(activeSide) || locked) return;
    const cpu = getMonsterBySide(activeSide);
    autoLockBlock(cpu);
    messageEl.textContent = turnPrompt(cpu);
    renderAttackButtons();

    if (hasBenchAvailable(cpu.side) && Math.random() < 0.2) {
      const team = getTeamBySide(cpu.side);
      const activeIndex = getActiveIndexBySide(cpu.side);
      const targetIndex = team.findIndex((m, idx) => idx !== activeIndex && m.hp > 0);
      if (targetIndex !== -1) {
        handleSwitch(cpu.side, targetIndex);
        return;
      }
    }

    const useSuper = canUseSuper(cpu) && Math.random() < 0.3;
    if (useSuper) {
      handleSuperPower(cpu);
      return;
    }
    const attackIndex = randomInt(0, cpu.attacks.length - 1);
    handleTurn(attackIndex);
  }, delayMs);
}

function showCallout(text) {
  if (!battleCalloutEl) return;
  const tone = text.toLowerCase() === "block" ? "block" : "combo";
  battleCalloutEl.textContent = text;
  battleCalloutEl.classList.remove("show", "block", "combo");
  void battleCalloutEl.offsetWidth;
  battleCalloutEl.classList.add(tone, "show");
  setTimeout(() => {
    battleCalloutEl.classList.remove("show", "block", "combo");
  }, 2050);
}

function withPraise(text, monster) {
  if (!monster || Math.random() > PRAISE_CHANCE) return text;
  const template = PRAISE_LINES[randomInt(0, PRAISE_LINES.length - 1)];
  const praise = template
    .replaceAll("{pilot}", monster.pilot)
    .replaceAll("{name}", monster.name);
  return `${text} Crowd: "${praise}"`;
}

function pickCrowdVoice(voices) {
  if (!voices || !voices.length) return null;
  // Prefer a clearly different announcer-style voice from common defaults.
  return (
    voices.find((v) => /daniel|fred|tom|alex|jorge|arthur|serena|allison|moira|victoria|samantha/i.test(v.name)) ||
    voices.find((v) => /google uk english|google us english/i.test(v.name)) ||
    voices.find((v) => /en-us|en-gb|english/i.test(v.lang)) ||
    voices[0]
  );
}

function initCrowdVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    crowdVoice = pickCrowdVoice(voices);
    crowdVoiceReady = Boolean(crowdVoice);
  };
  setVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    setVoice();
  };
}

function speakCrowd(line) {
  if (!line || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const utterance = new SpeechSynthesisUtterance(line);
    if (!crowdVoiceReady) {
      const voices = window.speechSynthesis.getVoices();
      crowdVoice = pickCrowdVoice(voices);
      crowdVoiceReady = Boolean(crowdVoice);
    }
    if (crowdVoice) {
      utterance.voice = crowdVoice;
    }
    // Energetic teen-adventure narrator cadence.
    utterance.rate = 1.02;
    utterance.pitch = 1.08;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch (_err) {
    // Ignore speech errors; text still appears in ribbon.
  }
}

function playMoveAnimation(attacker, defender, attack, result) {
  const attackerEl = getCreatureEl(attacker.side);
  const defenderEl = getCreatureEl(defender.side);

  const hit = result.kind === "damage";
  const comboHits = result.hits === 3 && (attack.style === "light" || attack.style === "medium" || attack.style === "heavy");
  if (result.kind === "block") {
    animateBlockReaction(defenderEl, defender.side);
  }
  const name = attack.name.toLowerCase();
  let duration;

  if (result.kind === "heal" || attack.style === "heal" || attack.style === "charge") {
    if (attack.style === "charge") {
      duration = animateOrbitHeal(attackerEl, attacker.weaponImage, 1200, 3, false);
      return duration;
    }
    if (name === "healing lightning") {
      duration = animateOrbitHeal(attackerEl, attacker.weaponImage, 1800, 4, true);
      return duration;
    }
    if (name === "universal heal") {
      duration = animateOrbitHeal(attackerEl, attacker.weaponImage, 1800, 4, true);
      return duration;
    }
    if (name === "fireheal") {
      duration = animateOrbitHeal(attackerEl, attacker.weaponImage, 1800, 4, true);
      return duration;
    }
    animateOnce(attackerEl, "heal-cast");
    return 1200;
  }

  if (name === "lightning boomerang") {
    duration = animateBoomerang(attackerEl, defenderEl, attacker.weaponImage, hit);
  } else if (name === "lightning strike") {
    duration = animateStraightBolt(attackerEl, defenderEl, attacker.weaponImage, hit);
  } else if (name === "air strike") {
    duration = animateAirStrike(attackerEl, defenderEl, hit);
  } else if (name === "water blast") {
    duration = animateRunSlash(attackerEl, defenderEl, hit);
  } else if (name === "water attack") {
    duration = animateStraightBolt(attackerEl, defenderEl, attacker.weaponImage, hit);
  } else if (name === "dolphin slap") {
    duration = animateSwordRain(attackerEl, defenderEl, attacker.weaponImage, hit);
  } else if (name === "galaxy ball") {
    duration = animateRunSlash(attackerEl, defenderEl, hit);
  } else if (name === "galaxy strip") {
    duration = animateSwordRain(attackerEl, defenderEl, attacker.weaponImage, hit);
  } else if (name === "fire strike") {
    duration = animateSwordRain(attackerEl, defenderEl, attacker.weaponImage, hit);
  } else {
    duration = animateStraightBolt(attackerEl, defenderEl, attacker.weaponImage, hit);
  }

  if (comboHits) {
    const comboDuration = animateTripleHitCombo(attackerEl, defenderEl, attack.style);
    return Math.max(duration, comboDuration);
  }

  return duration;
}

function animateGalaxyBroSpecial(attackerEl, defenderEl, weaponImage) {
  const healDur = animateOrbitHeal(attackerEl, LIGHTNING_WEAPON_IMAGE, 1200, 3, true);
  const strikeDur = animateStraightBolt(attackerEl, defenderEl, weaponImage, true);
  const c = center(attackerEl);
  const assist = createProjectile(LIGHTNING_ASSIST_IMAGE, 190, c.x, c.y);
  assist.animate(
    [
      { transform: "scale(0.82)", opacity: 0 },
      { transform: "scale(1)", opacity: 0.95, offset: 0.3 },
      { transform: "scale(1.08)", opacity: 0, offset: 1 }
    ],
    { duration: 1000, easing: "ease-out", fill: "forwards" }
  ).onfinish = () => assist.remove();
  return Math.max(healDur, strikeDur, 1200);
}

function animateStarshaSpecial(attackerEl, weaponImage) {
  const healDur = animateOrbitHeal(attackerEl, weaponImage, 2400, 4, true);
  const c = center(attackerEl);
  const assist = createProjectile(SUPERDAD_IMAGE, 210, c.x, c.y - 18);
  assist.animate(
    [
      { transform: "scale(0.8)", opacity: 0 },
      { transform: "scale(1)", opacity: 0.95, offset: 0.22 },
      { transform: "scale(1.08)", opacity: 0, offset: 1 }
    ],
    { duration: 2200, easing: "ease-out", fill: "forwards" }
  ).onfinish = () => assist.remove();

  const text = document.createElement("div");
  text.textContent = "SUPERDAD does a super block for the next two turns!";
  text.style.position = "fixed";
  text.style.left = `${c.x - 210}px`;
  text.style.top = `${c.y - 160}px`;
  text.style.width = "420px";
  text.style.textAlign = "center";
  text.style.fontWeight = "900";
  text.style.fontSize = "18px";
  text.style.letterSpacing = "0.02em";
  text.style.color = "#eaf7ff";
  text.style.textShadow = "0 0 12px rgba(140,220,255,0.9), 0 0 22px rgba(140,220,255,0.55)";
  text.style.pointerEvents = "none";
  text.style.zIndex = "1300";
  document.body.appendChild(text);
  text.animate(
    [
      { transform: "translateY(10px)", opacity: 0 },
      { transform: "translateY(0px)", opacity: 1, offset: 0.18 },
      { transform: "translateY(0px)", opacity: 1, offset: 0.78 },
      { transform: "translateY(-12px)", opacity: 0, offset: 1 }
    ],
    { duration: 3600, easing: "ease-out", fill: "forwards" }
  ).onfinish = () => text.remove();

  return Math.max(healDur, 3600);
}

function animateStraightBolt(attackerEl, defenderEl, imgSrc, hit) {
  const start = center(attackerEl);
  const end = center(defenderEl);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dir = Math.sign(dx) || 1;
  const dur = 1700;
  const p = createProjectile(imgSrc, 160, start.x, start.y);
  p.style.transform = `rotate(${dir > 0 ? 90 : -90}deg)`;

  p.animate(
    [
      { transform: `rotate(${dir > 0 ? 90 : -90}deg) scale(0.85)`, opacity: 0.2 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45}px) rotate(${dir > 0 ? 90 : -90}deg) scale(1.02)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx * (hit ? 0.95 : 1.12)}px, ${dy * (hit ? 0.95 : 1.12)}px) rotate(${dir > 0 ? 90 : -90}deg) scale(1.15)`, opacity: 1, offset: 0.88 },
      { transform: `translate(${dx * (hit ? 1.02 : 1.22)}px, ${dy * (hit ? 1.02 : 1.22)}px) rotate(${dir > 0 ? 90 : -90}deg) scale(0.55)`, opacity: 0 }
    ],
    { duration: dur, easing: "cubic-bezier(0.2, 0.88, 0.2, 1)", fill: "forwards" }
  ).onfinish = () => p.remove();

  if (hit) applyHitReaction(defenderEl, dir, 52, 900, Math.round(dur * 0.82));
  return dur;
}

function animateTigerChain(attackerEl, defenderEl, imgSrc, hits) {
  if (!attackerEl || !defenderEl) return 0;
  const start = center(attackerEl);
  const end = center(defenderEl);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dir = Math.sign(dx) || 1;
  const strikeCount = Math.max(1, Math.min(60, hits || 1));
  const stepMs = 115;
  const strikeDur = 320;

  for (let i = 0; i < strikeCount; i += 1) {
    const launchDelay = i * stepMs;
    const spreadY = ((i % 5) - 2) * 12;
    const spreadX = ((i % 4) - 1.5) * 7;
    setTimeout(() => {
      const p = createProjectile(imgSrc, 88, start.x, start.y);
      p.style.transform = `rotate(${dir > 0 ? 90 : -90}deg)`;
      p.animate(
        [
          { transform: `translate(0px, 0px) rotate(${dir > 0 ? 90 : -90}deg) scale(0.72)`, opacity: 0.25 },
          { transform: `translate(${dx * 0.62 + spreadX}px, ${dy * 0.62 + spreadY}px) rotate(${dir > 0 ? 90 : -90}deg) scale(0.95)`, opacity: 1, offset: 0.62 },
          { transform: `translate(${dx * 1.02 + spreadX}px, ${dy * 1.02 + spreadY}px) rotate(${dir > 0 ? 90 : -90}deg) scale(0.62)`, opacity: 0 }
        ],
        { duration: strikeDur, easing: "cubic-bezier(0.22, 0.9, 0.2, 1)", fill: "forwards" }
      ).onfinish = () => p.remove();

      defenderEl.animate(
        [
          { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" },
          { transform: `translate(${dir * 11}px, -5px) scale(0.97)`, filter: "brightness(1.35)", offset: 0.45 },
          { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" }
        ],
        { duration: 210, easing: "ease-out" }
      );
    }, launchDelay);
  }

  const total = strikeCount * stepMs + strikeDur;
  if (arenaEl) {
    arenaEl.animate(
      [
        { transform: "translateX(0px)" },
        { transform: `translateX(${-dir * 5}px)`, offset: 0.2 },
        { transform: `translateX(${dir * 5}px)`, offset: 0.4 },
        { transform: `translateX(${-dir * 3}px)`, offset: 0.7 },
        { transform: "translateX(0px)" }
      ],
      { duration: total, easing: "ease-in-out" }
    );
  }
  return total;
}

function animateBoomerang(attackerEl, defenderEl, imgSrc, hit) {
  const start = center(attackerEl);
  const end = center(defenderEl);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dir = Math.sign(dx) || 1;
  const dur = 2100;
  const p = createProjectile(imgSrc, 145, start.x, start.y);

  p.animate(
    [
      { transform: "translate(0px, 0px) rotate(0deg) scale(0.85)", opacity: 0.2 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 80}px) rotate(${dir * 430}deg) scale(1.02)`, opacity: 1, offset: 0.34 },
      { transform: `translate(${dx * (hit ? 0.94 : 1.12)}px, ${dy * (hit ? 0.94 : 1.12)}px) rotate(${dir * 860}deg) scale(1.12)`, offset: 0.5 },
      { transform: `translate(${dx * 0.54}px, ${dy * 0.52 - 95}px) rotate(${dir * 1220}deg) scale(1.03)`, offset: 0.72 },
      { transform: "translate(0px, 0px) rotate(1540deg) scale(0.9)", opacity: 1, offset: 0.95 },
      { transform: "translate(0px, 0px) rotate(1600deg) scale(0.75)", opacity: 0 }
    ],
    { duration: dur, easing: "cubic-bezier(0.22, 0.9, 0.2, 1)", fill: "forwards" }
  ).onfinish = () => p.remove();

  if (hit) applyHitReaction(defenderEl, dir, 38, 860, Math.round(dur * 0.5));
  return dur;
}

function animateAirStrike(attackerEl, defenderEl, hit) {
  const a = center(attackerEl);
  const d = center(defenderEl);
  const dx = d.x - a.x;
  const dy = d.y - a.y;
  const dir = Math.sign(dx) || 1;
  const dur = 1850;

  attackerEl.animate(
    [
      { transform: "translate(0px, 0px) scale(1)" },
      { transform: `translate(${dx * 0.35}px, ${dy * 0.2 - 130}px) scale(1.12)`, offset: 0.4 },
      { transform: `translate(${dx * 0.95}px, ${dy * 0.95 - 20}px) scale(1.2) rotate(${dir * 9}deg)`, offset: 0.66 },
      { transform: `translate(${dx * 0.2}px, ${dy * 0.2 - 90}px) scale(1.06)`, offset: 0.82 },
      { transform: "translate(0px, 0px) scale(1) rotate(0deg)" }
    ],
    { duration: dur, easing: "cubic-bezier(0.22, 0.9, 0.2, 1)" }
  );

  if (hit) applyHitReaction(defenderEl, dir, 48, 900, Math.round(dur * 0.64));
  return dur;
}

function animateRunSlash(attackerEl, defenderEl, hit) {
  const a = center(attackerEl);
  const d = center(defenderEl);
  const dx = d.x - a.x;
  const dy = d.y - a.y;
  const dir = Math.sign(dx) || 1;
  const dur = 2000;

  attackerEl.animate(
    [
      { transform: "translate(0px, 0px) scale(1)" },
      { transform: `translate(${dx * 0.78}px, ${dy * 0.7}px) scale(1.15)`, offset: 0.44 },
      { transform: `translate(${dx * 0.95}px, ${dy * 0.9}px) scale(1.24) rotate(${dir * 10}deg)`, offset: 0.58 },
      { transform: `translate(${dx * 0.46}px, ${dy * 0.46}px) scale(1.08)`, offset: 0.75 },
      { transform: "translate(0px, 0px) scale(1) rotate(0deg)" }
    ],
    { duration: dur, easing: "cubic-bezier(0.24, 0.9, 0.2, 1)" }
  );

  if (hit) applyHitReaction(defenderEl, dir, 54, 950, Math.round(dur * 0.55));
  return dur;
}

function animateSwordRain(attackerEl, defenderEl, imgSrc, hit) {
  const d = center(defenderEl);
  const a = center(attackerEl);
  const dir = Math.sign(d.x - a.x) || 1;
  const dur = 1850;
  const count = 7;
  for (let i = 0; i < count; i += 1) {
    const delay = i * 120;
    const p = createProjectile(imgSrc, 110, d.x + (i - count / 2) * 22, d.y - 280 - i * 18);
    setTimeout(() => {
      p.animate(
        [
          { transform: "translate(0px, 0px) rotate(0deg) scale(0.8)", opacity: 0.15 },
          { transform: `translate(${(i - count / 2) * -18}px, ${250 + i * 16}px) rotate(${dir * (220 + i * 20)}deg) scale(1.1)`, opacity: 1, offset: 0.8 },
          { transform: `translate(${(i - count / 2) * -22}px, ${280 + i * 18}px) rotate(${dir * (290 + i * 24)}deg) scale(0.55)`, opacity: 0 }
        ],
        { duration: 700, easing: "cubic-bezier(0.12, 0.9, 0.22, 1)", fill: "forwards" }
      ).onfinish = () => p.remove();
    }, delay);
  }
  if (hit) applyHitReaction(defenderEl, dir, 45, 980, 760);
  return dur;
}

function animateOrbitHeal(targetEl, imgSrc, duration, count, shake) {
  if (!targetEl) return duration;
  const c = center(targetEl);
  const bolts = [];
  for (let i = 0; i < count; i += 1) {
    const p = createProjectile(imgSrc, 92, c.x, c.y);
    p.style.opacity = "0.95";
    bolts.push(p);
  }
  const start = performance.now();

  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const angBase = t * Math.PI * 6;
    bolts.forEach((p, i) => {
      const ang = angBase + (i * Math.PI * 2) / count;
      const r = 58 + 18 * Math.sin(t * Math.PI * 2 + i);
      const x = c.x + Math.cos(ang) * r;
      const y = c.y + Math.sin(ang) * r * 0.7;
      p.style.left = `${x - p.offsetWidth / 2}px`;
      p.style.top = `${y - p.offsetHeight / 2}px`;
      p.style.transform = `rotate(${(ang * 180) / Math.PI + i * 34}deg) scale(${0.85 + 0.35 * Math.sin(t * Math.PI)})`;
      p.style.opacity = String(t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1);
    });
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      bolts.forEach((p) => p.remove());
    }
  }
  requestAnimationFrame(step);

  targetEl.animate(
    [
      { transform: "translate(0px,0px) scale(1)", filter: "brightness(1)" },
      { transform: "translate(0px,-14px) scale(1.08)", filter: "brightness(1.35)", offset: 0.45 },
      { transform: "translate(0px,0px) scale(1)", filter: "brightness(1)" }
    ],
    { duration, easing: "ease-in-out" }
  );

  if (shake) {
    setTimeout(() => {
      targetEl.animate(
        [
          { transform: "translateX(0px)" },
          { transform: "translateX(-7px)", offset: 0.2 },
          { transform: "translateX(7px)", offset: 0.4 },
          { transform: "translateX(-5px)", offset: 0.6 },
          { transform: "translateX(5px)", offset: 0.8 },
          { transform: "translateX(0px)" }
        ],
        { duration: 420, easing: "ease-out" }
      );
    }, Math.round(duration * 0.72));
  }
  return duration;
}

function applyHitReaction(defenderEl, dir, knock, duration, delay) {
  setTimeout(() => {
    defenderEl.animate(
      [
        { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" },
        { transform: `translate(${dir * knock}px, -16px) scale(0.84)`, filter: "brightness(1.55)", offset: 0.34 },
        { transform: `translate(${-dir * knock * 0.5}px, 10px) scale(1.06)`, offset: 0.66 },
        { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" }
      ],
      { duration, easing: "cubic-bezier(0.2, 0.9, 0.2, 1)" }
    );
    if (arenaEl) {
      arenaEl.animate(
        [
          { transform: "translateX(0px)" },
          { transform: `translateX(${-dir * 11}px)`, offset: 0.25 },
          { transform: `translateX(${dir * 11}px)`, offset: 0.5 },
          { transform: `translateX(${-dir * 6}px)`, offset: 0.75 },
          { transform: "translateX(0px)" }
        ],
        { duration: Math.max(680, duration * 0.8), easing: "ease-out" }
      );
    }
  }, delay);
}

function animateBlockReaction(targetEl, side) {
  if (!targetEl) return;
  targetEl.animate(
    [
      { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" },
      { transform: "translate(0px, -26px) scale(1.11)", filter: "brightness(2.2)", offset: 0.2 },
      { transform: "translate(0px, 0px) scale(1.03)", filter: "brightness(1.5)", offset: 0.4 },
      { transform: "translate(0px, -20px) scale(1.09)", filter: "brightness(2.1)", offset: 0.62 },
      { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" }
    ],
    { duration: 860, easing: "cubic-bezier(0.2, 0.88, 0.2, 1)" }
  );

  summonBlockAura(targetEl, side);
}

function summonBlockAura(targetEl, side) {
  const c = center(targetEl);
  const isPlayer = side === "player";
  const src = getMonsterBySide(side).weaponImage || (isPlayer ? GALAXY_WEAPON_IMAGE : LIGHTNING_WEAPON_IMAGE);
  const count = isPlayer ? 4 : 5;
  const dur = 900;

  for (let i = 0; i < count; i += 1) {
    const p = createProjectile(src, isPlayer ? 84 : 92, c.x, c.y + 34);
    const spread = (i - (count - 1) / 2) * 44;
    const rise = -120 - i * 16;
    const rot = (i % 2 === 0 ? 1 : -1) * (220 + i * 22);
    p.style.filter = isPlayer
      ? "drop-shadow(0 0 18px rgba(255,120,60,0.95)) saturate(1.25)"
      : "drop-shadow(0 0 22px rgba(120,210,255,0.98))";

    p.animate(
      [
        { transform: "translate(0px, 0px) scale(0.45) rotate(0deg)", opacity: 0.15 },
        { transform: `translate(${spread * 0.45}px, ${rise * 0.42}px) scale(1.06) rotate(${rot * 0.5}deg)`, opacity: 1, offset: 0.46 },
        { transform: `translate(${spread}px, ${rise}px) scale(0.78) rotate(${rot}deg)`, opacity: 0 }
      ],
      { duration: dur + i * 60, easing: "cubic-bezier(0.18, 0.9, 0.2, 1)", fill: "forwards" }
    ).onfinish = () => p.remove();
  }
}

function animateTripleHitCombo(attackerEl, defenderEl, style) {
  if (!attackerEl || !defenderEl) return 0;
  const a = center(attackerEl);
  const d = center(defenderEl);
  const dir = Math.sign(d.x - a.x) || 1;
  const dash = style === "heavy" ? 84 : style === "medium" ? 72 : 58;
  const dur = 980;

  attackerEl.animate(
    [
      { transform: "translate(0px, 0px) scale(1)" },
      { transform: `translate(${dir * dash}px, -8px) scale(1.08)`, offset: 0.12 },
      { transform: "translate(0px, 0px) scale(1)", offset: 0.24 },
      { transform: `translate(${dir * (dash + 6)}px, -10px) scale(1.1)`, offset: 0.4 },
      { transform: "translate(0px, 0px) scale(1)", offset: 0.56 },
      { transform: `translate(${dir * (dash + 12)}px, -12px) scale(1.12)`, offset: 0.74 },
      { transform: "translate(0px, 0px) scale(1)" }
    ],
    { duration: dur, easing: "cubic-bezier(0.2, 0.9, 0.2, 1)" }
  );

  const hitTimes = [170, 440, 720];
  hitTimes.forEach((ms, i) => {
    applyHitReaction(defenderEl, dir, 22 + i * 5, 320, ms);
  });

  if (arenaEl) {
    arenaEl.animate(
      [
        { transform: "translateX(0px)" },
        { transform: `translateX(${-dir * 7}px)`, offset: 0.22 },
        { transform: `translateX(${dir * 7}px)`, offset: 0.34 },
        { transform: `translateX(${-dir * 7}px)`, offset: 0.5 },
        { transform: `translateX(${dir * 7}px)`, offset: 0.66 },
        { transform: `translateX(${-dir * 7}px)`, offset: 0.82 },
        { transform: "translateX(0px)" }
      ],
      { duration: dur, easing: "ease-out" }
    );
  }

  return dur;
}

function createProjectile(src, size, cx, cy) {
  const p = document.createElement("img");
  p.src = src;
  p.alt = "";
  p.setAttribute("aria-hidden", "true");
  p.style.position = "fixed";
  p.style.left = `${cx - size / 2}px`;
  p.style.top = `${cy - size / 2}px`;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.objectFit = "contain";
  p.style.pointerEvents = "none";
  p.style.zIndex = "1200";
  p.style.filter = "drop-shadow(0 0 22px rgba(255,255,255,0.75))";
  document.body.appendChild(p);
  return p;
}

function center(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function animateOnce(el, className) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  el.addEventListener(
    "animationend",
    () => {
      el.classList.remove(className);
    },
    { once: true }
  );
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
