class Combatant {
  constructor(config, battle, info) {
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    })
    this.info = info;
    this.info.hp = typeof(this.info.hp) === "undefined" ? this.info.maxHp : this.info.hp;
    this.hp = this.info.hp;
    this.battle = battle;
  }

  get hpPercent() {
    const percent = this.info.hp / this.info.maxHp * 100;
    return percent > 0 ? percent : 0;
  }

  get xpPercent() {
    return this.info.xp / this.info.maxXp * 100;
  }

  get isActive() {
    return this.battle?.activeCombatants[this.team] === this.id;
  }

  get givesXp() {
    return this.info.level * 20;
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Combatant");

    this.hudElement.setAttribute("data-combatant", this.id);
    this.hudElement.setAttribute("data-team", this.team);

    this.hudElement.innerHTML = (`
      <p class="Combatant_name">${this.info.name}</p>
      <p class="Combatant_level"></p>
      <div class="Combatant_character_crop">
        <img class="Combatant_character" alt="${this.info.name}" src="${this.info.src}" />
      </div>
      <img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
      <svg viewBox="0 0 20 2" class="Combatant_life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ec6a7c" />
        <rect x=0 y=1 width="0%" height=2 fill="#bb5663" />
      </svg>
      <svg viewBox="0 0 20 2" class="Combatant_xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#22afc2" />
        <rect x=0 y=1 width="0%" height=2 fill="#198997" />
      </svg>
      <p class="Combatant_status"></p>
    `);

    this.weaponElement = document.createElement("img");
    this.weaponElement.classList.add("Weapon");
    this.weaponElement.setAttribute("src", this.src);
    this.weaponElement.setAttribute("alt", this.info.name);
    this.weaponElement.setAttribute("data-team", this.team);

    this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
    this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");
  }

  update(changes={}) {
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    this.hudElement.setAttribute("data-active", this.isActive);
    this.weaponElement.setAttribute("data-active", this.isActive);

    this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`)
    this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`)

    this.hudElement.querySelector(".Combatant_name").innerText = this.info.name;
    this.hudElement.querySelector(".Combatant_level").innerText = this.info.level;
    const img = this.hudElement.querySelector(".Combatant_character");
    img.setAttribute("src", this.info.src);
    img.setAttribute("alt", this.info.name);

    const statusElement = this.hudElement.querySelector(".Combatant_status");
    if (this.status) {
      statusElement.innerText = this.status.type;
      statusElement.style.display = "block";
    } else {
      statusElement.innerText = "";
      statusElement.style.display = "none";
    }
  }

  getReplacedEvents(originalEvents) {
    if (this.status?.type === "distracted" && utils.randomFromArray([true, false, false])) {
      return [
        { type: "textMessage", text: `${this.info.name} flops over!` },
      ]
    }

    return originalEvents;
  }

  getPostEvents() {
    if (this.status?.type === "saucy") {
      return [
        { type: "textMessage", text: `${this.info.name} feelin' saucy!` },
        { type: "stateChange", recover: 5, onCaster: true }
      ]
    } 
    return [];
  }

  decrementStatus() {
    if (this.status?.expiresIn > 0) {
      this.status.expiresIn -= 1;
      if (this.status.expiresIn === 0) {
        this.update({
          status: null
        })
        return {
          type: "textMessage",
          text: "Время действия статуса вышло!"
        }
      }
    }
    return null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.weaponElement);
    this.update();
  }

}