class Progress {
  constructor() {
    this.mapId = "StartRoom";
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.startingHeroDirection = "down";
    this.saveFileKey = "CHOICE_SaveFile1";
  }

  save() {
    window.localStorage.setItem(this.saveFileKey, JSON.stringify({
      mapId: this.mapId,
      startingHeroX: this.startingHeroX,
      startingHeroY: this.startingHeroY,
      startingHeroDirection: this.startingHeroDirection,
      playerState: {
        info: playerState.info,
        weapons: playerState.weapons,
        lineup: playerState.lineup,
        items: playerState.items,
        storyFlags: playerState.storyFlags,
        hp: playerState.hp,
        maxHp: playerState.maxHp,
        xp: playerState.xp,
        level: playerState.level
      }
    }))
  }

  getSaveFile() {
    const file = window.localStorage.getItem(this.saveFileKey);
    return file ? JSON.parse(file) : null
  }
  
  load() {
    const file = this.getSaveFile();
    if (file) {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;
      Object.keys(file.playerState).forEach(key => {
        playerState[key] = file.playerState[key];
      })
    }
  }

}