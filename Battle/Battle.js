class Battle {
  constructor({ enemy, onComplete }) {

    this.enemy = enemy;
    this.onComplete = onComplete;

    this.combatants = {}

    this.activeCombatants = {
      player: null,
      enemy: null,
    }

    window.playerState.lineup.forEach(id => {
      this.addCombatant(id, "player", window.playerState.weapons[id], window.playerState.info)
    });

    Object.keys(this.enemy.weapons).forEach(key => {
      this.addCombatant("e_"+key, "enemy", this.enemy.weapons[key], this.enemy.info)
    })

    this.items = []

    window.playerState.items.forEach(item => {
      this.items.push({
        ...item,
        team: "player"
      })
    })

    this.usedInstanceIds = {};

  }

  addCombatant(id, team, config, info) {
      this.combatants[id] = new Combatant({
        ...Weapons[config.weaponId],
        ...config,
        team,
        isPlayerControlled: team === "player"
      }, this, info)

      this.activeCombatants[team] = this.activeCombatants[team] || id
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
    <div class="Battle_hero">
      <img src="${window.playerState.info.src}" alt="ТЫ" />
    </div>
    <div class="Battle_enemy">
      <img src=${this.enemy.info.src} alt=${this.enemy.info.name} />
    </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", `${this.enemy.info.name}`);

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element)
      
      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    })

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this)
          battleEvent.init(resolve);
        })
      },
      onWinner: winner => {

        if (winner === "player") {
          const playerState = window.playerState;
          const playerStateInfo = playerState.info;
          Object.keys(playerState.weapons).forEach(id => {
            const combatant = this.combatants[id];
            if (combatant) {
              playerStateInfo.hp = combatant.hp;
              playerStateInfo.xp = combatant.xp;
              playerStateInfo.maxXp = combatant.maxXp;
              playerStateInfo.level = combatant.level;
            }
          })

          playerState.items = playerState.items.filter(item => {
            return !this.usedInstanceIds[item.instanceId]
          })

          utils.emitEvent("PlayerStateUpdated");
        }

        this.element.remove();
        this.onComplete(winner === "player");
      }
    })
    this.turnCycle.init();
  }

}