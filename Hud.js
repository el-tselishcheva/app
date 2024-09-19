class Hud {
  constructor() {
    this.scoreboard;
  }

  update() {
    this.scoreboard.update(window.playerState.weapons[this.scoreboard.id]);
  }

  createElement() {

    if (this.element) {
      this.element.remove();
      this.scoreboards = [];
    }

    this.element = document.createElement("div");
    this.element.classList.add("Hud");

    const {playerState} = window;
    const weapon = playerState.weapons["w1"];
    const scoreboard = new Combatant({
      id: "w1",
      ...Weapons[weapon.weaponId],
      ...weapon,
    }, null, window.playerState.info);
  
    scoreboard.createElement();
    this.scoreboard = scoreboard;
    this.element.appendChild(scoreboard.hudElement);
    
    this.update();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    document.addEventListener("PlayerStateUpdated", () => {
      this.update();
    })

    document.addEventListener("LineupChanged", () => {
      this.createElement();
      container.appendChild(this.element);
    })
  }

}