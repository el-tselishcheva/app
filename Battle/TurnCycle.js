class TurnCycle {
  constructor({ battle, onNewEvent, onWinner }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
    this.currentTeam = "player";
  }

  async turn() {
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"]
    const enemy = this.battle.combatants[enemyId];

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy
    })

    if (submission.replacement) {
      await this.onNewEvent({
        type: "replace",
        replacement: submission.replacement
      })
      await this.onNewEvent({
        type: "textMessage",
        text: `${submission.replacement.info.name} достаёт ${submission.replacement.name}!`
      })
      this.nextTurn();
      return;
    }

    if (submission.instanceId) {
      this.battle.usedInstanceIds[submission.instanceId] = true;
      this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId)
    }

    const resultingEvents = caster.getReplacedEvents(submission.action.success);

    for (let i=0; i<resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      }
      await this.onNewEvent(event);
    }

    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({ 
        type: "textMessage", text: `${submission.target.info.name} повержен!`
      })

      if (submission.target.team === "enemy") {
        const playerActiveWeaponId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXp;

        await this.onNewEvent({
          type: "textMessage",
          text: `${this.battle.combatants[playerActiveWeaponId].info.name} зарабатывает ${xp} XP!`
        })

        await this.onNewEvent({
          type: "giveXp",
          xp,
          combatant: this.battle.combatants[playerActiveWeaponId]
        })
      } else {
        const playerActiveWeaponId = this.battle.activeCombatants.enemy;
        const xp = submission.target.givesXp;

        await this.onNewEvent({
          type: "textMessage",
          text: `${this.battle.combatants[playerActiveWeaponId].info.name} зарабатывает ${xp} XP!`
        })

        await this.onNewEvent({
          type: "giveXp",
          xp,
          combatant: this.battle.combatants[playerActiveWeaponId]
        })
      }
    }

    const winner = this.getWinningTeam();
    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${this.battle.combatants[casterId].info.name} – победитель!`
      })
      this.onWinner(winner);
      return;
    }

    const postEvents = caster.getPostEvents();
    for (let i=0; i < postEvents.length; i++ ) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target, 
      }
      await this.onNewEvent(event);
    }

    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent)
    }

    this.nextTurn();
  }

  nextTurn() {
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn();
  }

  getWinningTeam() {
    let aliveTeams = {};
    Object.values(this.battle.combatants).forEach(c => {
      if (c.info.hp > 0) {
        aliveTeams[c.team] = true;
      }
    })
    if (!aliveTeams["player"]) { return "enemy"}
    if (!aliveTeams["enemy"]) { return "player"}
    return null;
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `Похоже, ${this.battle.enemy.info.name} ищет драки!`
    })

    this.turn();
  }

}