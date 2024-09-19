class PlayerState {
  constructor() {
    this.info = {
      name: "ТЫ",
      src: "images/characters/main-character.png",
      hp: 100,
      maxHp: 100,
      xp: 0,
      maxXp: 100,
      level: 1,
      status: null
    },
    this.weapons = {
      "w1": {
        weaponId: "wooden-stick",
        hp: 100,
        maxHp: 100,
        xp: 0,
        maxXp: 100,
        level: 1,
        status: null
      }
    }
    this.lineup = ["w1"];
    this.items = [
      { actionId: "item_recoverHp1", instanceId: "item1" },
      { actionId: "item_recoverHp2", instanceId: "item2" },
      { actionId: "item_recoverHp2", instanceId: "item3" },
      { actionId: "item_recoverHp2", instanceId: "item4" },
    ]
    this.storyFlags = {};
  }

  addWeapon(weaponId) {
    const newId = `w${Date.now()}`+Math.floor(Math.random() * 99999);
    this.weapons[newId] = {
      weaponId
    }
    if (this.lineup.length < 3) {
      this.lineup.push(newId)
    }
    utils.emitEvent("LineupChanged");
  }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    utils.emitEvent("LineupChanged");
  }

  moveToFront(futureFrontId) {
    this.lineup = this.lineup.filter(id => id !== futureFrontId);
    this.lineup.unshift(futureFrontId);
    utils.emitEvent("LineupChanged");
  }

}

window.playerState = new PlayerState();