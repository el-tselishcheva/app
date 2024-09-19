class Chest extends GameObject {
  constructor(config) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
      animations: {
        "used-down"   : [ [0,0] ],
        "unused-down" : [ [1,0] ],
      },
      currentAnimation: "used-down"
    });
    this.storyFlag = config.storyFlag;
    this.weapons = config.weapons;

    this.talking = [
      {
        required: [this.storyFlag],
        events: [
          { type: "textMessage", text: "Внутри больше нет ничего интересного, кроме пыли и грязи..." },
        ]
      },
      {
        events: [
          { type: "textMessage", text: "Вы наткнулись на красивый сундук." },
          { type: "textMessage", text: "Кажется, внутри что-то есть..." },
          { type: "craftingMenu", weapons: this.weapons },
          { type: "addStoryFlag", flag: this.storyFlag },
        ]
      }
    ]
  }

  update() {
    this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
    ? "used-down"
    : "unused-down";
  }

}