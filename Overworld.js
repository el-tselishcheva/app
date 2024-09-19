class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;

    this.nonRepeatingCutscene = false;
    this.cameraPerson = undefined;
    this.ending = undefined;
  }

  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.progress.mapId == "FinalRoom" && this.ending != undefined) {
        this.cameraPerson = this.map.gameObjects.alter;
      } else {
        this.cameraPerson = this.map.gameObjects.hero;
      }
      
      const container = document.querySelector(".game-container");

      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      })
      
      this.map.drawLowerImage(this.ctx, this.cameraPerson);

      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, this.cameraPerson);
      })

      this.map.drawUpperImage(this.ctx, this.cameraPerson);

      this.progress.currentX = this.map.gameObjects.hero.x;
      this.progress.currentY = this.map.gameObjects.hero.y;

      if ((this.progress.mapId == "StartRoom") && !this.nonRepeatingCutscene &&
          (`${this.progress.currentX},${this.progress.currentY}` == utils.asGridCoord(35,4))) {
        this.map.startCutscene([
          {who: "hero", type: "stand",  direction: "up", time: 1000},
          {type: "textMessage", name: "ВЕДУЩИЙ", text: "Помните, как только Вы покинете комнату, Вы не сможете вернуться назад в неё."},
          {type: "textMessage", name: "ВЕДУЩИЙ", text: "Весёлого путешествия!"},
          {type: "textMessage", name: "ВЕДУЩИЙ", text: "Хе-хе."}
        ]);
        this.nonRepeatingCutscene = true;
      }

      if (this.progress.mapId == "FinalRoom" && this.ending != undefined && !this.nonRepeatingCutscene) {
        let final = new Promise(resolve => {
          var endDialog;

            if (this.ending == "WON_BATTLE") {
              endDialog = this.map.startCutscene([
                {who: "hero", type: "stand",  direction: "left", time: 2000},
                {type: "textMessage", name: "ОНО", text: "здоровья погибшим"},
                {who: "hero", type: "stand",  direction: "left", time: 1000},
                {who: "hero", type: "walk",  direction: "down"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"},
                {who: "hero", type: "walk",  direction: "left"}
              ]);
            } else {
              endDialog = this.map.startCutscene([
                {who: "alter", type: "stand",  direction: "right", time: 2000},
                {type: "textMessage", name: "ТЫ", text: "я свободеен словно птица в небесах"},
                {who: "alter", type: "stand",  direction: "right", time: 1000},
                {who: "alter", type: "walk",  direction: "up"},
                {who: "alter", type: "walk",  direction: "up"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"},
                {who: "alter", type: "walk",  direction: "right"}
              ]);
            }

            resolve(endDialog);
        })

        final.then(result => {
          const sceneTransition = new SceneTransition();
          sceneTransition.init(container, () => {
              this.endCredits = new EndCredits(this.ending);
              sceneTransition.fadeOut();
              this.endCredits.init(container);
          });
        });

        this.nonRepeatingCutscene = true;
      }

      if (!this.map.isPaused) {
        requestAnimationFrame(() => {
          step();   
        })
      }
    }
    step();
  }
  
  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.map.checkForActionCutscene()
    })
    new KeyPressListener("Escape", () => {
      if (!this.map.isCutscenePlaying) {
        this.map.startCutscene([
          { type: "pause" }
        ])
      }
    })
  }
  
  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        this.map.checkForFootstepCutscene()
      }
    })
  }
  
  startMap(mapConfig, heroInitialState = null) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();

    this.nonRepeatingCutscene = false;

    if (heroInitialState) {
      const {hero} = this.map.gameObjects;
      this.map.removeWall(hero.x, hero.y);
      hero.x = heroInitialState.x;
      hero.y = heroInitialState.y;
      hero.direction = heroInitialState.direction;
      this.map.addWall(hero.x, hero.y);
    }

    this.progress.mapId = mapConfig.id;
    this.progress.startingHeroX = this.map.gameObjects.hero.x;
    this.progress.startingHeroY = this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;

    if (this.progress.mapId == "StartRoom") {
      this.map.startCutscene([
        {who: "hero", type: "stand",  direction: "up", time: 5000},
        {who: "hero", type: "stand",  direction: "left", time: 500},
        {who: "hero", type: "stand",  direction: "right", time: 700},
        {type: "textMessage", name: "ВЕДУЩИЙ", text: "Многоуважаемый игрок!"},
        {who: "hero", type: "stand",  direction: "down", time: 200},
        {type: "textMessage", name: "ВЕДУЩИЙ", text: "Вы наконец проснулись!"},
        {type: "textMessage", name: "ВЕДУЩИЙ", text: "Или же, наоборот, только уснули..."},
        {type: "textMessage", name: "ВЕДУЩИЙ", text: "..."},
        {type: "textMessage", name: "ВЕДУЩИЙ", text: "Впрочем, это не так важно."},
        {type: "textMessage", name: "ВЕДУЩИЙ", text: "Вероятно, Вы озадачены сложившейся ситуацией? Позвольте разъяснить."}
      ]);
    };

    if (this.progress.mapId == "Room_1") {
      this.map.startCutscene([
        {who: "hero", type: "stand",  direction: "up", time: 1000},
        {who: "hero", type: "walk",  direction: "up"},
        {who: "hero", type: "walk",  direction: "up"},
        {who: "hero", type: "walk",  direction: "up"},
        {who: "hero", type: "walk",  direction: "left"},
        {who: "hero", type: "stand",  direction: "up", time: 200},
        {type: "textMessage", name: "ВЕДУЩИЙ", text: "Добро пожаловать в первую комнату!"},
        {type: "textMessage", name: "ВЕДУЩИЙ", text: "Мы подготовили много интересного для Вас!"}
      ]);
    };

    if (this.progress.mapId == "FinalRoom") {
      let plotTwist = new Promise(resolve => {
        let swapProgress = null;
        swapProgress = window.playerState.info;
        window.playerState.info = window.Enemies.alter.info;
        window.Enemies.alter.info = swapProgress;

        let max = 0;
        let weapon = null;
        let strongest = null;
        window.playerState.lineup.forEach(id => {
          weapon = window.playerState.weapons[id].weaponId;
          let damage = 0;
          if (weapon == "wooden-stick" || weapon == "stone") {
            damage = 1;
          } else if (weapon == "lighter" || weapon == "broken-bottle") {
            damage = 2;
          } else if (weapon == "knife" || weapon == "baseball-bat") {
            damage = 3;
          }
          if (damage > max) {
            max = damage;
            strongest = weapon;
          }
        });

        window.Enemies.alter.weapons.w3.weaponId = strongest;
        window.playerState.lineup = [];
        window.playerState.addWeapon("baseball-bat");

        window.playerState.items = [
          { actionId: "item_recoverHp1", instanceId: "item1" },
          { actionId: "item_recoverHp2", instanceId: "item2" },
          { actionId: "item_recoverHp2", instanceId: "item3" },
          { actionId: "item_recoverHp2", instanceId: "item4" }];

        this.hud.scoreboard.info = window.playerState.info;
        this.hud.update();
        
        resolve(this);
      });

      plotTwist.then(thisProgress => {
        let finalScene = new Promise(resolve => {
          let finalBattle = thisProgress.map.startCutscene([
            {who: "hero", type: "stand",  direction: "left", time: 600},
            {who: "hero", type: "walk",  direction: "left"},
            {who: "hero", type: "walk",  direction: "left"},
            {who: "hero", type: "walk",  direction: "left"},
            {who: "hero", type: "walk",  direction: "left"},
            {who: "hero", type: "walk",  direction: "down"},
            {who: "hero", type: "walk",  direction: "down"},
            {who: "hero", type: "walk",  direction: "left"},
            {who: "hero", type: "walk",  direction: "left"},
            {who: "hero", type: "stand",  direction: "left", time: 2000},
            {type: "textMessage", name: "ОНО", text: "Let's start a battle!"},
            {type: "battle", enemyId: "alter"},
          ])
          
          thisProgress.map.startCutscene([
            {who: "alter", type: "stand",  direction: "right", time: 1000},
            {who: "alter", type: "walk",  direction: "right"},
            {who: "alter", type: "walk",  direction: "right"},
            {who: "alter", type: "walk",  direction: "right"},
            {who: "alter", type: "walk",  direction: "right"},
            {who: "alter", type: "walk",  direction: "up"},
            {who: "alter", type: "walk",  direction: "right"},
            {who: "alter", type: "walk",  direction: "right"},
            {who: "alter", type: "stand",  direction: "right", time: 2000},
          ]);

          resolve(finalBattle);
        });

        finalScene.then(finalBattle => {
          let swapProgress = null;
          swapProgress = window.playerState.info;
          window.playerState.info = window.Enemies.alter.info;
          window.Enemies.alter.info = swapProgress;

          this.hud.scoreboard.info = window.playerState.info;
          this.hud.update();

          let endGame = new Promise(resolve => {
            this.map.gameObjects.hero.isPlayerControlled = false;
            this.map.gameObjects.hero.x = 176;
            this.map.gameObjects.hero.y = 128;
            this.map.gameObjects.hero.direction = "left";
            
            this.map.gameObjects.alter.isPlayerControlled = true;
            this.map.gameObjects.alter.x = 144;
            this.map.gameObjects.alter.y = 128;
            this.map.gameObjects.alter.direction = "right";
            
            resolve();
          });

          endGame.then(result => {
            this.ending = finalBattle;
          });
        });
      });
    };

  }
  
  async init() {
    const container = document.querySelector(".game-container");

    this.progress = new Progress();

    this.titleScreen = new TitleScreen({
      progress: this.progress
    })
    const useSaveFile = await this.titleScreen.init(container);

    let initialHeroState = null;
    if (useSaveFile) {
      this.progress.load();
      initialHeroState = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection,
      }
    }

    this.hud = new Hud();
    this.hud.init(container);

    this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
  
}