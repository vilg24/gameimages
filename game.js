const playerNameEl = document.getElementById("player-name");
const enemyNameEl = document.getElementById("enemy-name");
const playerHpEl = document.getElementById("player-hp");
const enemyHpEl = document.getElementById("enemy-hp");
const playerHpLabelEl = document.getElementById("player-hp-label");
const enemyHpLabelEl = document.getElementById("enemy-hp-label");
const attacksEl = document.getElementById("attacks");
const messageEl = document.getElementById("message");
const restartEl = document.getElementById("restart");
const playerLogEl = document.getElementById("player-log");
const enemyLogEl = document.getElementById("enemy-log");
const playerLogTitleEl = document.getElementById("player-log-title");
const enemyLogTitleEl = document.getElementById("enemy-log-title");
const playerCreatureEl = document.getElementById("player-creature");
const enemyCreatureEl = document.getElementById("enemy-creature");
const arenaEl = document.querySelector(".arena");

const MAX_HP = 100;
const TURN_DELAY_MS = 3000;
const PLAYER_WEAPON_IMAGE = "./assets/flaming_sword_512.png";
const ENEMY_WEAPON_IMAGE = "./assets/lightning_anime_512.png";

const playerPokemon = {
  name: "Super Dad",
  hp: MAX_HP,
  side: "player",
  pilot: "Player 1",
  skipNextTurn: false,
  attacks: [
    { name: "Flame Sword", min: 24, max: 40, accuracy: 0.55, style: "heavy" },
    { name: "Flame Attack", min: 15, max: 25, accuracy: 0.75, style: "medium" },
    { name: "Fire Strike", min: 8, max: 14, accuracy: 0.9, style: "light" },
    { name: "Fireheal", min: -22, max: -12, accuracy: 0.95, style: "heal" }
  ]
};

const enemyPokemon = {
  name: "Lightning Kid",
  hp: MAX_HP,
  side: "enemy",
  pilot: "Player 2",
  skipNextTurn: false,
  attacks: [
    { name: "Lightning Strike", min: 24, max: 40, accuracy: 0.55, style: "heavy" },
    { name: "Air Strike", min: 15, max: 25, accuracy: 0.75, style: "medium" },
    { name: "Lightning Boomerang", min: 8, max: 14, accuracy: 0.9, style: "light" },
    { name: "Healing Lightning", min: -22, max: -12, accuracy: 0.95, style: "heal" }
  ]
};

let locked = false;
let finished = false;
let activeSide = "player";

restartEl.addEventListener("click", resetBattle);

init();

function init() {
  playerNameEl.textContent = playerPokemon.name;
  enemyNameEl.textContent = enemyPokemon.name;
  playerLogTitleEl.textContent = `${playerPokemon.name} Log`;
  enemyLogTitleEl.textContent = `${enemyPokemon.name} Log`;
  resetBattle();
}

function resetBattle() {
  playerPokemon.hp = MAX_HP;
  enemyPokemon.hp = MAX_HP;
  locked = false;
  finished = false;
  activeSide = "player";
  playerPokemon.skipNextTurn = false;
  enemyPokemon.skipNextTurn = false;
  messageEl.textContent = `${playerPokemon.pilot}'s turn: choose ${playerPokemon.name}'s attack.`;
  restartEl.hidden = true;
  playerLogEl.innerHTML = "";
  enemyLogEl.innerHTML = "";
  addLog("player", "A new battle starts.");
  addLog("enemy", "A new battle starts.");
  renderAttackButtons();
  syncUi();
}

function renderAttackButtons() {
  attacksEl.innerHTML = "";
  const activeMonster = getMonsterBySide(activeSide);

  activeMonster.attacks.forEach((attack, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = `${attack.name} (${activeMonster.name})`;
    btn.disabled = locked || finished;
    btn.addEventListener("click", () => handleTurn(index));
    attacksEl.appendChild(btn);
  });
}

function handleTurn(attackIndex) {
  if (locked || finished) return;
  locked = true;
  renderAttackButtons();

  const attacker = getMonsterBySide(activeSide);
  const defender = getOpponent(attacker);
  const attack = attacker.attacks[attackIndex];
  const result = performAttack(attacker, defender, attack);
  syncUi();
  playMoveAnimation(attacker, defender, attack, result);
  addLog(attacker.side, `${attacker.pilot}: ${attacker.name} used ${attack.name}. ${result.text}`);

  if (result.kind === "heal") {
    attacker.skipNextTurn = true;
    addLog(attacker.side, `${attacker.name} must recover and will skip their next turn.`);
  }

  if (defender.hp <= 0) {
    endBattle(`${attacker.pilot} wins with ${attacker.name}!`);
    return;
  }

  activeSide = defender.side;
  setTimeout(() => {
    const current = getMonsterBySide(activeSide);
    if (current.skipNextTurn) {
      current.skipNextTurn = false;
      addLog(current.side, `${current.pilot}: ${current.name} is recovering and skips this turn.`);
      activeSide = getOpponent(current).side;
    }
    messageEl.textContent = `${getMonsterBySide(activeSide).pilot}'s turn: choose ${getMonsterBySide(activeSide).name}'s attack.`;
    locked = false;
    renderAttackButtons();
  }, TURN_DELAY_MS);
}

function performAttack(attacker, defender, attack) {
  const hitRoll = Math.random();
  if (hitRoll > attack.accuracy) {
    return { text: "It missed.", kind: "miss" };
  }

  const amount = randomInt(attack.min, attack.max);

  if (amount < 0) {
    const heal = Math.min(MAX_HP - attacker.hp, Math.abs(amount));
    attacker.hp += heal;
    return {
      text: `${attacker.name} healed ${heal} HP (now ${attacker.hp}/${MAX_HP}).`,
      kind: "heal"
    };
  }

  let damage = amount;
  const crit = Math.random() < 0.12;
  if (crit) {
    damage = Math.round(damage * 1.5);
  }

  defender.hp = Math.max(0, defender.hp - damage);
  if (crit) {
    return {
      text: `Critical hit for ${damage} damage (${defender.name} at ${defender.hp}/${MAX_HP} HP).`,
      kind: "damage"
    };
  }
  return {
    text: `${damage} damage dealt (${defender.name} at ${defender.hp}/${MAX_HP} HP).`,
    kind: "damage"
  };
}

function syncUi() {
  setHp(playerPokemon.hp, playerHpEl, playerHpLabelEl);
  setHp(enemyPokemon.hp, enemyHpEl, enemyHpLabelEl);
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

function endBattle(text) {
  finished = true;
  locked = true;
  messageEl.textContent = text;
  addLog("player", text);
  addLog("enemy", text);
  renderAttackButtons();
  restartEl.hidden = false;
}

function addLog(side, text) {
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

function playMoveAnimation(attacker, defender, attack, result) {
  const attackerEl = getCreatureEl(attacker.side);
  const defenderEl = getCreatureEl(defender.side);

  if (result.kind === "miss") {
    throwWeapon(attackerEl, defenderEl, attack.style || "light", false, attacker.side);
    return;
  }

  if (result.kind === "heal" || attack.style === "heal") {
    animateOnce(attackerEl, "heal-cast");
    return;
  }

  throwWeapon(attackerEl, defenderEl, attack.style || "light", true, attacker.side);
}

function throwWeapon(attackerEl, defenderEl, style, didHit, attackerSide) {
  if (!attackerEl || !defenderEl) return;
  const attackerRect = attackerEl.getBoundingClientRect();
  const defenderRect = defenderEl.getBoundingClientRect();

  const startX = attackerRect.left + attackerRect.width / 2;
  const startY = attackerRect.top + attackerRect.height / 2;
  const endCoreX = defenderRect.left + defenderRect.width / 2;
  const endCoreY = defenderRect.top + defenderRect.height / 2;

  const presets = {
    light: { duration: 1850, size: 132, arc: 88, spin: 720, overshoot: 1.14, knock: 30, impactAt: 0.82 },
    medium: { duration: 2050, size: 152, arc: 118, spin: 860, overshoot: 1.08, knock: 42, impactAt: 0.84 },
    heavy: { duration: 2450, size: 182, arc: 170, spin: 1020, overshoot: 1.1, knock: 62, impactAt: 0.88 }
  };
  const p = presets[style] || presets.medium;
  const dx = endCoreX - startX;
  const dy = endCoreY - startY;
  const dir = Math.sign(dx) || 1;
  const endX = startX + dx * (didHit ? 0.95 : p.overshoot);
  const endY = startY + dy * (didHit ? 0.95 : p.overshoot);

  const projectile = document.createElement("img");
  projectile.src = attackerSide === "player" ? PLAYER_WEAPON_IMAGE : ENEMY_WEAPON_IMAGE;
  projectile.alt = "";
  projectile.setAttribute("aria-hidden", "true");
  projectile.style.position = "fixed";
  projectile.style.left = `${startX - p.size / 2}px`;
  projectile.style.top = `${startY - p.size / 2}px`;
  projectile.style.width = `${p.size}px`;
  projectile.style.height = `${p.size}px`;
  projectile.style.objectFit = "contain";
  projectile.style.pointerEvents = "none";
  projectile.style.zIndex = "1200";
  projectile.style.filter = "drop-shadow(0 0 22px rgba(255,255,255,0.75))";
  document.body.appendChild(projectile);

  animateProjectile(projectile, style, {
    startX,
    startY,
    dx,
    dy,
    dir,
    arc: p.arc,
    spin: p.spin,
    endX,
    endY,
    didHit,
    duration: p.duration
  });

  if (didHit) {
    setTimeout(() => {
      defenderEl.animate(
        [
          { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" },
          { transform: `translate(${dir * p.knock}px, -16px) scale(0.86)`, filter: "brightness(1.5)", offset: 0.34 },
          { transform: `translate(${-dir * p.knock * 0.52}px, 8px) scale(1.05)`, offset: 0.66 },
          { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" }
        ],
        { duration: 880, easing: "cubic-bezier(0.2, 0.9, 0.2, 1)" }
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
          { duration: 720, easing: "ease-out" }
        );
      }
    }, Math.round(p.duration * p.impactAt));
  }
}

function animateProjectile(projectile, style, motion) {
  const {
    startX,
    startY,
    dx,
    dy,
    dir,
    arc,
    spin,
    endX,
    endY,
    didHit,
    duration
  } = motion;

  const start = performance.now();

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    let x = startX;
    let y = startY;
    let rot = 0;
    let scale = 1;
    let opacity = 1;

    if (style === "heavy") {
      const topY = Math.min(startY, endY) - (200 + arc);
      if (t < 0.45) {
        const u = t / 0.45;
        x = startX + dx * 0.2 * u;
        y = startY + (topY - startY) * u;
      } else {
        const u = (t - 0.45) / 0.55;
        x = startX + dx * (0.2 + 0.8 * u);
        y = topY + (endY - topY) * u;
      }
      rot = dir * spin * t;
      scale = 0.84 + 0.44 * Math.sin(Math.PI * Math.min(1, t / 0.9));
      opacity = t < 0.08 ? t / 0.08 : t > 0.93 ? (1 - t) / 0.07 : 1;
    } else if (style === "light") {
      // Exaggerated zig-zag
      x = startX + dx * t;
      y = startY + dy * t - arc * Math.sin(Math.PI * t) * 0.45 + Math.sin(t * Math.PI * 7) * (28 + arc * 0.12);
      rot = dir * spin * t * 1.15;
      scale = 0.88 + 0.3 * Math.sin(Math.PI * t);
      opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? (1 - t) / 0.08 : 1;
    } else {
      // Medium/current arc
      x = startX + dx * t;
      y = startY + dy * t - arc * Math.sin(Math.PI * t);
      rot = dir * spin * t;
      scale = 0.9 + 0.22 * Math.sin(Math.PI * t);
      opacity = t < 0.1 ? t / 0.1 : t > 0.94 ? (1 - t) / 0.06 : 1;
    }

    const targetX = didHit ? endX : startX + dx * 1.1;
    const targetY = didHit ? endY : startY + dy * 1.1;
    if (t > 0.9) {
      const r = (t - 0.9) / 0.1;
      x += (targetX - x) * r;
      y += (targetY - y) * r;
      scale *= 1 - 0.35 * r;
    }

    projectile.style.left = `${x - projectile.offsetWidth / 2}px`;
    projectile.style.top = `${y - projectile.offsetHeight / 2}px`;
    projectile.style.transform = `rotate(${rot}deg) scale(${scale})`;
    projectile.style.opacity = String(Math.max(0, Math.min(1, opacity)));

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      projectile.remove();
    }
  }

  requestAnimationFrame(frame);
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
