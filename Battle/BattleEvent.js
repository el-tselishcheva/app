class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }
  
  textMessage(resolve) {
    const text = this.event.text
    .replace("{CASTER}", this.event.caster?.info.name)
    .replace("{TARGET}", this.event.target?.info.name)
    .replace("{ACTION}", this.event.action?.name)

    const message = new TextMessage({
      text,
      onComplete: () => {
        resolve();
      }
    })
    message.init( this.battle.element )
  }

  async stateChange(resolve) {
    const {caster, target, damage, recover, status, action} = this.event;
    let who = this.event.onCaster ? caster : target;

    if (damage) {
      target.info.hp = target.info.hp - damage;
      target.update({
        hp: target.info.hp
      })
      
      target.weaponElement.classList.add("battle-damage-blink");
    }

    if (recover) {
      let newHp = who.info.hp + recover;
      if (newHp > who.info.maxHp) {
        newHp = who.info.maxHp;
      }
      who.info.hp = newHp;
      who.update({
        hp: who.info.hp
      })
    }

    if (status) {
      who.info.status = {...status};
      who.update({
        status: who.info.status
      })
    }

    if (status === null) {
      who.info.status = null;
      who.update({
        status: who.info.status
      })
    }

    await utils.wait(600)

    target.weaponElement.classList.remove("battle-damage-blink");
    resolve();
  }

  submissionMenu(resolve) {
    const {caster} = this.event;
    const menu = new SubmissionMenu({
      caster: caster,
      enemy: this.event.enemy,
      items: this.battle.items,
      replacements: Object.values(this.battle.combatants).filter(c => {
        return c.id !== caster.id && c.team === caster.team && c.hp > 0
      }),
      onComplete: submission => {
        resolve(submission)
      }
    })
    menu.init( this.battle.element )
  }

  replacementMenu(resolve) {
    const menu = new ReplacementMenu({
      replacements: Object.values(this.battle.combatants).filter(c => {
        return c.team === this.event.team && c.hp > 0
      }),
      onComplete: replacement => {
        resolve(replacement)
      }
    })
    menu.init( this.battle.element )
  }

  async replace(resolve) {
    const {replacement} = this.event;

    const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
    this.battle.activeCombatants[replacement.team] = null;
    prevCombatant.update();
    await utils.wait(400);

    this.battle.activeCombatants[replacement.team] = replacement.id;
    replacement.update();
    await utils.wait(400);

    resolve();
  }

  giveXp(resolve) {
    let amount = this.event.xp;
    const {combatant} = this.event;

    const step = () => {
      if (amount > 0) {
        amount -= 1;
        combatant.info.xp += 1;

        if (combatant.info.xp === combatant.info.maxXp) {
          combatant.info.xp = 0;
          combatant.info.maxXp = 100;
          combatant.info.level += 1;
        }

        combatant.xp = combatant.info.xp;
        combatant.maxHp = combatant.info.maxXp;
        combatant.level = combatant.info.level;
        combatant.update();
        
        requestAnimationFrame(step);
        return;
      }
      resolve();
    }

    requestAnimationFrame(step);
  }

  animation(resolve) {
    const fn = BattleAnimations[this.event.animation];
    fn(this.event, resolve);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}