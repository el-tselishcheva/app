class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(9) - cameraPerson.x, 
      utils.withGrid(7) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(9) - cameraPerson.x, 
      utils.withGrid(7) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;

      object.mount(this);
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;
    let resArr = [];
    let res = undefined;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      const result = await eventHandler.init();
      resArr[i] = result;
      if (result === "LOST_BATTLE") {
        break;
      }
    }

    this.isCutscenePlaying = false;
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));

    for (let i=0; i<resArr.length; i++) {
      if (resArr[i] != null) {
        res = resArr[i];
      }
    }

    return res;
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    
    if (!this.isCutscenePlaying && match && match.length) {
      const relevantScenario = match.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  
  StartRoom: {
    id: "StartRoom",
    lowerSrc: "images/rooms/start-room (lower).png",
    upperSrc: "images/rooms/start-room (upper).png",

    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(11),
        y: utils.withGrid(6),
      })
    },

    walls: {
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,3)] : true,
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,3)] : true,
      [utils.asGridCoord(7,3)] : true,
      [utils.asGridCoord(8,3)] : true,
      [utils.asGridCoord(9,3)] : true,
      [utils.asGridCoord(10,3)] : true,
      [utils.asGridCoord(11,3)] : true,
      [utils.asGridCoord(12,3)] : true,

      [utils.asGridCoord(1,4)] : true,
      [utils.asGridCoord(1,5)] : true,
      [utils.asGridCoord(1,6)] : true,
      [utils.asGridCoord(1,7)] : true,
      [utils.asGridCoord(1,8)] : true,

      [utils.asGridCoord(13,4)] : true,
      [utils.asGridCoord(13,5)] : true,
      [utils.asGridCoord(13,6)] : true,
      [utils.asGridCoord(13,7)] : true,
      [utils.asGridCoord(13,8)] : true,

      [utils.asGridCoord(2,9)] : true,
      [utils.asGridCoord(3,9)] : true,
      [utils.asGridCoord(4,9)] : true,
      [utils.asGridCoord(5,9)] : true,
      [utils.asGridCoord(7,9)] : true,
      [utils.asGridCoord(8,9)] : true,
      [utils.asGridCoord(9,9)] : true,
      [utils.asGridCoord(10,9)] : true,
      [utils.asGridCoord(11,9)] : true,
      [utils.asGridCoord(12,9)] : true,

      [utils.asGridCoord(5,10)] : true,
      [utils.asGridCoord(5,11)] : true,
      [utils.asGridCoord(5,12)] : true,
      [utils.asGridCoord(5,13)] : true,
      [utils.asGridCoord(5,14)] : true,
      [utils.asGridCoord(5,15)] : true,
      [utils.asGridCoord(5,16)] : true,
      [utils.asGridCoord(5,17)] : true,

      [utils.asGridCoord(7,10)] : true,
      [utils.asGridCoord(7,11)] : true,
      [utils.asGridCoord(7,12)] : true,
      [utils.asGridCoord(7,13)] : true,

      [utils.asGridCoord(6,18)] : true,
      [utils.asGridCoord(7,18)] : true,
      [utils.asGridCoord(8,18)] : true,
      [utils.asGridCoord(9,18)] : true,
      [utils.asGridCoord(10,18)] : true,
      [utils.asGridCoord(11,18)] : true,
      [utils.asGridCoord(12,18)] : true,
      [utils.asGridCoord(13,18)] : true,
      [utils.asGridCoord(14,18)] : true,
      [utils.asGridCoord(15,18)] : true,
      [utils.asGridCoord(16,18)] : true,
      [utils.asGridCoord(17,18)] : true,
      [utils.asGridCoord(18,18)] : true,
      [utils.asGridCoord(19,18)] : true,
      [utils.asGridCoord(20,18)] : true,
      [utils.asGridCoord(21,18)] : true,
      [utils.asGridCoord(22,18)] : true,
      [utils.asGridCoord(23,18)] : true,
      [utils.asGridCoord(24,18)] : true,
      [utils.asGridCoord(25,18)] : true,
      [utils.asGridCoord(26,18)] : true,
      [utils.asGridCoord(27,18)] : true,
      [utils.asGridCoord(28,18)] : true,
      [utils.asGridCoord(29,18)] : true,
      [utils.asGridCoord(30,18)] : true,
      [utils.asGridCoord(31,18)] : true,
      [utils.asGridCoord(32,18)] : true,
      [utils.asGridCoord(33,18)] : true,
      [utils.asGridCoord(34,18)] : true,
      [utils.asGridCoord(35,18)] : true,
      [utils.asGridCoord(36,18)] : true,
      [utils.asGridCoord(37,18)] : true,

      [utils.asGridCoord(7,13)] : true,
      [utils.asGridCoord(8,13)] : true,
      [utils.asGridCoord(9,13)] : true,
      [utils.asGridCoord(10,13)] : true,
      [utils.asGridCoord(11,13)] : true,
      [utils.asGridCoord(12,13)] : true,
      [utils.asGridCoord(13,13)] : true,
      [utils.asGridCoord(14,13)] : true,
      [utils.asGridCoord(15,13)] : true,
      [utils.asGridCoord(16,13)] : true,
      [utils.asGridCoord(17,13)] : true,
      [utils.asGridCoord(18,13)] : true,
      [utils.asGridCoord(19,13)] : true,
      [utils.asGridCoord(20,13)] : true,
      [utils.asGridCoord(21,13)] : true,
      [utils.asGridCoord(22,13)] : true,
      [utils.asGridCoord(23,13)] : true,
      [utils.asGridCoord(24,13)] : true,
      [utils.asGridCoord(25,13)] : true,
      [utils.asGridCoord(26,13)] : true,
      [utils.asGridCoord(27,13)] : true,
      [utils.asGridCoord(28,13)] : true,
      [utils.asGridCoord(29,13)] : true,
      [utils.asGridCoord(30,13)] : true,
      [utils.asGridCoord(31,13)] : true,
      [utils.asGridCoord(32,13)] : true,

      [utils.asGridCoord(32,3)] : true,
      [utils.asGridCoord(32,4)] : true,
      [utils.asGridCoord(32,5)] : true,
      [utils.asGridCoord(32,6)] : true,
      [utils.asGridCoord(32,7)] : true,
      [utils.asGridCoord(32,8)] : true,
      [utils.asGridCoord(32,9)] : true,
      [utils.asGridCoord(32,10)] : true,
      [utils.asGridCoord(32,11)] : true,
      [utils.asGridCoord(32,12)] : true,

      [utils.asGridCoord(38,3)] : true,
      [utils.asGridCoord(38,4)] : true,
      [utils.asGridCoord(38,5)] : true,
      [utils.asGridCoord(38,6)] : true,
      [utils.asGridCoord(38,7)] : true,
      [utils.asGridCoord(38,8)] : true,
      [utils.asGridCoord(38,9)] : true,
      [utils.asGridCoord(38,10)] : true,
      [utils.asGridCoord(38,11)] : true,
      [utils.asGridCoord(38,12)] : true,
      [utils.asGridCoord(38,13)] : true,
      [utils.asGridCoord(38,14)] : true,
      [utils.asGridCoord(38,15)] : true,
      [utils.asGridCoord(38,16)] : true,
      [utils.asGridCoord(38,17)] : true,

      [utils.asGridCoord(33,3)] : true,
      [utils.asGridCoord(34,3)] : true,
      [utils.asGridCoord(36,3)] : true,
      [utils.asGridCoord(37,3)] : true,
    },

    cutsceneSpaces: {
      [utils.asGridCoord(35,3)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Room_1",
              x: utils.withGrid(13),
              y: utils.withGrid(17),
              direction: "up"
            }
          ]
        }
      ]
    }
  },

  Room_1: {
    id: "Room_1",
    lowerSrc: "images/rooms/room_1 (lower).png",
    upperSrc: "images/rooms/room_1 (upper).png",

    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
      }),

      npc_1: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(8),
        src: "images/characters/npc_1.png",
        talking: [
          {
            required: ["PASS_1"],
            events: [
              { type: "textMessage", name: "1", text: "иди ты уже в следующую комнату эй", faceHero: "npc_1" },
            ]
          },
          {
            events: [
              { type: "textMessage", name: "1", text: "надо пройти тестики ;}", faceHero: "npc_1" },
              { type: "battle", enemyId: "npc_1" },
              { type: "addStoryFlag", flag: "PASS_1"},
              { type: "textMessage", name: "1", text: "можешь проходить в следующую комнату!", faceHero: "npc_1" },
            ]
          }
        ]
      })
    },

    walls: {
      [utils.asGridCoord(1,3)] : true,
      [utils.asGridCoord(1,4)] : true,
      [utils.asGridCoord(1,5)] : true,
      [utils.asGridCoord(1,6)] : true,
      [utils.asGridCoord(1,7)] : true,
      [utils.asGridCoord(1,8)] : true,
      [utils.asGridCoord(1,9)] : true,
      [utils.asGridCoord(1,10)] : true,
      [utils.asGridCoord(1,11)] : true,
      [utils.asGridCoord(1,12)] : true,
      [utils.asGridCoord(1,13)] : true,
      [utils.asGridCoord(1,14)] : true,
      [utils.asGridCoord(1,15)] : true,
      [utils.asGridCoord(1,16)] : true,
      [utils.asGridCoord(1,17)] : true,

      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,3)] : true,
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,3)] : true,
      [utils.asGridCoord(7,2)] : true,
      [utils.asGridCoord(8,2)] : true,
      [utils.asGridCoord(9,2)] : true,
      [utils.asGridCoord(10,3)] : true,
      [utils.asGridCoord(11,3)] : true,
      [utils.asGridCoord(12,3)] : true,
      [utils.asGridCoord(13,3)] : true,
      [utils.asGridCoord(14,3)] : true,
      [utils.asGridCoord(15,3)] : true,
      [utils.asGridCoord(16,3)] : true,

      [utils.asGridCoord(17,3)] : true,
      [utils.asGridCoord(17,4)] : true,
      [utils.asGridCoord(17,5)] : true,
      [utils.asGridCoord(17,6)] : true,
      [utils.asGridCoord(17,7)] : true,
      [utils.asGridCoord(17,8)] : true,
      [utils.asGridCoord(17,9)] : true,
      [utils.asGridCoord(17,10)] : true,
      [utils.asGridCoord(17,11)] : true,
      [utils.asGridCoord(17,12)] : true,
      [utils.asGridCoord(17,13)] : true,
      [utils.asGridCoord(17,14)] : true,
      [utils.asGridCoord(17,15)] : true,
      [utils.asGridCoord(17,16)] : true,
      [utils.asGridCoord(17,17)] : true,

      [utils.asGridCoord(2,17)] : true,
      [utils.asGridCoord(3,17)] : true,
      [utils.asGridCoord(4,17)] : true,
      [utils.asGridCoord(5,17)] : true,
      [utils.asGridCoord(6,17)] : true,
      [utils.asGridCoord(7,17)] : true,
      [utils.asGridCoord(8,17)] : true,
      [utils.asGridCoord(9,17)] : true,
      [utils.asGridCoord(10,17)] : true,
      [utils.asGridCoord(11,17)] : true,
      [utils.asGridCoord(12,17)] : true,
      [utils.asGridCoord(14,17)] : true,
      [utils.asGridCoord(15,17)] : true,
      [utils.asGridCoord(16,17)] : true,

      [utils.asGridCoord(13,18)] : true,
    },

    cutsceneSpaces: {
      [utils.asGridCoord(7,3)]: [
        {
          required: ["PASS_1"],
          events: [
            {
              type: "changeMap",
              map: "Room_2",
              x: utils.withGrid(6),
              y: utils.withGrid(12),
              direction: "up"
            }
          ]
        },
        {
          events: [
            {type: "textMessage", text: "Вы не можете пройти, так как не сделали кое-что важное..."},
            {who: "hero", type: "walk",  direction: "down"}
          ]
        }
      ],

      [utils.asGridCoord(8,3)]: [
        {
          required: ["PASS_1"],
          events: [
            {
              type: "changeMap",
              map: "Room_2",
              x: utils.withGrid(7),
              y: utils.withGrid(12),
              direction: "up"
            }
          ]
        },
        {
          events: [
            {type: "textMessage", text: "Вы не можете пройти, так как не сделали кое-что важное..."},
            {who: "hero", type: "walk",  direction: "down"}
          ]
        }
      ],

      [utils.asGridCoord(9,3)]: [
        {
          required: ["PASS_1"],
          events: [
            {
              type: "changeMap",
              map: "Room_2",
              x: utils.withGrid(8),
              y: utils.withGrid(12),
              direction: "up"
            }
          ]
        },
        {
          events: [
            {type: "textMessage", text: "Вы не можете пройти, так как не сделали кое-что важное..."},
            {who: "hero", type: "walk",  direction: "down"}
          ]
        }
      ]
    }
  },

  Room_2: {
    id: "Room_2",
    lowerSrc: "images/rooms/room_2 (lower).png",
    upperSrc: "images/rooms/room_2 (upper).png",

    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
      }),

      npc_2: new Person({
        x: utils.withGrid(11),
        y: utils.withGrid(5),
        src: "images/characters/npc_2.png",
        talking: [
          {
            required: ["PASS_2"],
            events: [
              { type: "textMessage", name: "2", text: "беги отсюда скорей", faceHero: "npc_2" },
            ]
          },
          {
            events: [
              { type: "textMessage", name: "2", text: "снова тестики ;[]", faceHero: "npc_2" },
              { type: "battle", enemyId: "npc_2" },
              { type: "addStoryFlag", flag: "PASS_2"},
              { type: "textMessage", name: "2", text: "дальшедальшеДАЛЬШЕ", faceHero: "npc_2" },
            ]
          }
        ]
      })
    },

    walls: {
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,3)] : true,
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,3)] : true,
      [utils.asGridCoord(7,3)] : true,
      [utils.asGridCoord(8,3)] : true,
      [utils.asGridCoord(9,3)] : true,
      [utils.asGridCoord(10,3)] : true,
      [utils.asGridCoord(11,3)] : true,
      [utils.asGridCoord(12,3)] : true,
      [utils.asGridCoord(13,3)] : true,
      [utils.asGridCoord(14,3)] : true,
      [utils.asGridCoord(15,3)] : true,

      [utils.asGridCoord(1,4)] : true,
      [utils.asGridCoord(1,5)] : true,
      [utils.asGridCoord(1,6)] : true,
      [utils.asGridCoord(1,7)] : true,
      [utils.asGridCoord(1,8)] : true,
      [utils.asGridCoord(1,9)] : true,
      [utils.asGridCoord(1,10)] : true,
      [utils.asGridCoord(1,11)] : true,

      [utils.asGridCoord(2,12)] : true,
      [utils.asGridCoord(3,12)] : true,
      [utils.asGridCoord(4,12)] : true,
      [utils.asGridCoord(5,12)] : true,
      [utils.asGridCoord(9,12)] : true,
      [utils.asGridCoord(10,12)] : true,
      [utils.asGridCoord(11,12)] : true,
      [utils.asGridCoord(12,12)] : true,
      [utils.asGridCoord(13,12)] : true,
      [utils.asGridCoord(14,12)] : true,
      [utils.asGridCoord(15,12)] : true,

      [utils.asGridCoord(16,4)] : true,
      [utils.asGridCoord(16,5)] : true,
      [utils.asGridCoord(17,6)] : true,
      [utils.asGridCoord(16,7)] : true,
      [utils.asGridCoord(16,8)] : true,
      [utils.asGridCoord(16,9)] : true,
      [utils.asGridCoord(16,10)] : true,
      [utils.asGridCoord(16,11)] : true,

      [utils.asGridCoord(6,13)] : true,
      [utils.asGridCoord(7,13)] : true,
      [utils.asGridCoord(8,13)] : true,
    },

    cutsceneSpaces: {
      [utils.asGridCoord(16,6)]: [
        {
          required: ["PASS_2"],
          events: [
            {
              type: "changeMap",
              map: "Room_3",
              x: utils.withGrid(1),
              y: utils.withGrid(4),
              direction: "right"
            }
          ]
        },
        {
          events: [
            {type: "textMessage", text: "Вы не можете пройти, так как не сделали кое-что важное..."},
            {who: "hero", type: "walk",  direction: "left"}
          ]
        }
      ]
    }
  },

  Room_3: {
    id: "Room_3",
    lowerSrc: "images/rooms/room_3 (lower).png",
    upperSrc: "images/rooms/room_3 (upper).png",

    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
      }),

      chest_1: new Chest({
        x: utils.withGrid(3),
        y: utils.withGrid(16),
        src: "images/items/chest.png",
        storyFlag: "USED_1",
        weapons: ["stone", "broken-bottle", "knife"],
      }),

      chest_2: new Chest({
        x: utils.withGrid(26),
        y: utils.withGrid(12),
        src: "images/items/chest.png",
        storyFlag: "USED_2",
        weapons: ["wooden-stick", "lighter", "baseball-bat"],
      })
    },

    walls: {
      [utils.asGridCoord(0,4)] : true,

      [utils.asGridCoord(1,3)] : true,
      [utils.asGridCoord(1,5)] : true,

      [utils.asGridCoord(2,2)] : true,
      [utils.asGridCoord(3,2)] : true,
      [utils.asGridCoord(4,2)] : true,
      [utils.asGridCoord(5,2)] : true,
      [utils.asGridCoord(6,2)] : true,
      [utils.asGridCoord(7,2)] : true,
      [utils.asGridCoord(8,2)] : true,
      [utils.asGridCoord(9,2)] : true,
      [utils.asGridCoord(10,2)] : true,
      [utils.asGridCoord(11,2)] : true,
      [utils.asGridCoord(12,2)] : true,
      [utils.asGridCoord(13,2)] : true,
      [utils.asGridCoord(14,2)] : true,
      [utils.asGridCoord(15,2)] : true,
      [utils.asGridCoord(16,2)] : true,
      [utils.asGridCoord(17,2)] : true,
      [utils.asGridCoord(18,2)] : true,
      [utils.asGridCoord(19,2)] : true,
      [utils.asGridCoord(20,2)] : true,
      [utils.asGridCoord(21,2)] : true,
      [utils.asGridCoord(22,2)] : true,
      [utils.asGridCoord(23,2)] : true,
      [utils.asGridCoord(24,2)] : true,
      [utils.asGridCoord(25,2)] : true,
      [utils.asGridCoord(26,2)] : true,

      [utils.asGridCoord(4,4)] : true,
      [utils.asGridCoord(5,4)] : true,
      [utils.asGridCoord(6,4)] : true,
      [utils.asGridCoord(7,4)] : true,
      [utils.asGridCoord(8,4)] : true,
      [utils.asGridCoord(9,4)] : true,
      [utils.asGridCoord(10,4)] : true,
      [utils.asGridCoord(11,4)] : true,
      [utils.asGridCoord(12,4)] : true,
      [utils.asGridCoord(14,4)] : true,
      [utils.asGridCoord(15,4)] : true,
      [utils.asGridCoord(16,4)] : true,
      [utils.asGridCoord(17,4)] : true,
      [utils.asGridCoord(18,4)] : true,
      [utils.asGridCoord(19,4)] : true,
      [utils.asGridCoord(20,4)] : true,
      [utils.asGridCoord(21,4)] : true,
      [utils.asGridCoord(22,4)] : true,
      [utils.asGridCoord(23,4)] : true,
      [utils.asGridCoord(24,4)] : true,
      [utils.asGridCoord(25,4)] : true,

      [utils.asGridCoord(25,4)] : true,
      [utils.asGridCoord(25,5)] : true,
      [utils.asGridCoord(25,6)] : true,
      [utils.asGridCoord(25,7)] : true,
      [utils.asGridCoord(25,8)] : true,
      [utils.asGridCoord(25,9)] : true,
      [utils.asGridCoord(25,10)] : true,
      [utils.asGridCoord(25,11)] : true,
      [utils.asGridCoord(25,12)] : true,

      [utils.asGridCoord(27,3)] : true,
      [utils.asGridCoord(27,4)] : true,
      [utils.asGridCoord(27,5)] : true,
      [utils.asGridCoord(27,6)] : true,
      [utils.asGridCoord(27,7)] : true,
      [utils.asGridCoord(27,8)] : true,
      [utils.asGridCoord(27,9)] : true,
      [utils.asGridCoord(27,10)] : true,
      [utils.asGridCoord(27,11)] : true,
      [utils.asGridCoord(27,12)] : true,

      [utils.asGridCoord(26,13)] : true,

      [utils.asGridCoord(2,6)] : true,
      [utils.asGridCoord(2,7)] : true,
      [utils.asGridCoord(2,8)] : true,
      [utils.asGridCoord(2,9)] : true,
      [utils.asGridCoord(2,10)] : true,
      [utils.asGridCoord(2,11)] : true,
      [utils.asGridCoord(2,12)] : true,
      [utils.asGridCoord(2,13)] : true,
      [utils.asGridCoord(2,14)] : true,
      [utils.asGridCoord(2,15)] : true,
      [utils.asGridCoord(2,16)] : true,

      [utils.asGridCoord(4,4)] : true,
      [utils.asGridCoord(4,5)] : true,
      [utils.asGridCoord(4,6)] : true,
      [utils.asGridCoord(4,7)] : true,
      [utils.asGridCoord(4,8)] : true,
      [utils.asGridCoord(4,9)] : true,
      [utils.asGridCoord(4,10)] : true,
      [utils.asGridCoord(4,11)] : true,
      [utils.asGridCoord(4,12)] : true,
      [utils.asGridCoord(4,13)] : true,
      [utils.asGridCoord(4,14)] : true,
      [utils.asGridCoord(4,15)] : true,
      [utils.asGridCoord(4,16)] : true,

      [utils.asGridCoord(3,17)] : true,

      [utils.asGridCoord(12,4)] : true,
      [utils.asGridCoord(12,5)] : true,
      [utils.asGridCoord(12,6)] : true,
      [utils.asGridCoord(12,7)] : true,
      [utils.asGridCoord(12,8)] : true,

      [utils.asGridCoord(14,4)] : true,
      [utils.asGridCoord(14,5)] : true,
      [utils.asGridCoord(14,6)] : true,
      [utils.asGridCoord(14,7)] : true,
      [utils.asGridCoord(14,8)] : true,
      [utils.asGridCoord(14,9)] : true,

      [utils.asGridCoord(6,8)] : true,
      [utils.asGridCoord(7,8)] : true,
      [utils.asGridCoord(8,8)] : true,
      [utils.asGridCoord(9,8)] : true,
      [utils.asGridCoord(10,8)] : true,
      [utils.asGridCoord(11,8)] : true,

      [utils.asGridCoord(7,10)] : true,
      [utils.asGridCoord(8,10)] : true,
      [utils.asGridCoord(9,10)] : true,
      [utils.asGridCoord(10,10)] : true,
      [utils.asGridCoord(11,10)] : true,
      [utils.asGridCoord(12,10)] : true,
      [utils.asGridCoord(13,10)] : true,

      [utils.asGridCoord(7,10)] : true,
      [utils.asGridCoord(7,11)] : true,
      [utils.asGridCoord(7,12)] : true,
      [utils.asGridCoord(7,13)] : true,

      [utils.asGridCoord(5,9)] : true,
      [utils.asGridCoord(5,10)] : true,
      [utils.asGridCoord(5,11)] : true,
      [utils.asGridCoord(5,12)] : true,
      [utils.asGridCoord(5,13)] : true,
      [utils.asGridCoord(5,14)] : true,

      [utils.asGridCoord(6,15)] : true,
      [utils.asGridCoord(7,15)] : true,
      [utils.asGridCoord(8,15)] : true,
      [utils.asGridCoord(9,15)] : true,
      [utils.asGridCoord(10,15)] : true,
      [utils.asGridCoord(11,15)] : true,
      [utils.asGridCoord(12,15)] : true,
      [utils.asGridCoord(13,15)] : true,
      [utils.asGridCoord(14,15)] : true,
      [utils.asGridCoord(15,15)] : true,
      [utils.asGridCoord(16,15)] : true,
      [utils.asGridCoord(17,15)] : true,

      [utils.asGridCoord(7,13)] : true,
      [utils.asGridCoord(8,13)] : true,
      [utils.asGridCoord(9,13)] : true,
      [utils.asGridCoord(10,13)] : true,
      [utils.asGridCoord(11,13)] : true,
      [utils.asGridCoord(12,13)] : true,
      [utils.asGridCoord(13,13)] : true,
      [utils.asGridCoord(14,13)] : true,
      [utils.asGridCoord(15,13)] : true,
      [utils.asGridCoord(16,13)] : true,

      [utils.asGridCoord(16,7)] : true,
      [utils.asGridCoord(16,8)] : true,
      [utils.asGridCoord(16,9)] : true,
      [utils.asGridCoord(16,10)] : true,
      [utils.asGridCoord(16,11)] : true,
      [utils.asGridCoord(16,12)] : true,

      [utils.asGridCoord(18,8)] : true,
      [utils.asGridCoord(18,9)] : true,
      [utils.asGridCoord(18,10)] : true,
      [utils.asGridCoord(18,11)] : true,
      [utils.asGridCoord(18,12)] : true,
      [utils.asGridCoord(18,13)] : true,
      [utils.asGridCoord(18,14)] : true,

      [utils.asGridCoord(17,6)] : true,
      [utils.asGridCoord(18,6)] : true,
      [utils.asGridCoord(19,6)] : true,
      [utils.asGridCoord(20,6)] : true,
      [utils.asGridCoord(21,6)] : true,

      [utils.asGridCoord(19,8)] : true,
      [utils.asGridCoord(20,8)] : true,

      [utils.asGridCoord(20,8)] : true,
      [utils.asGridCoord(20,9)] : true,
      [utils.asGridCoord(20,10)] : true,
      [utils.asGridCoord(20,11)] : true,
      [utils.asGridCoord(20,12)] : true,
      [utils.asGridCoord(20,13)] : true,
      [utils.asGridCoord(20,14)] : true,
      [utils.asGridCoord(20,15)] : true,
      [utils.asGridCoord(20,16)] : true,

      [utils.asGridCoord(22,7)] : true,
      [utils.asGridCoord(22,8)] : true,
      [utils.asGridCoord(22,9)] : true,
      [utils.asGridCoord(22,10)] : true,
      [utils.asGridCoord(22,11)] : true,
      [utils.asGridCoord(22,12)] : true,
      [utils.asGridCoord(22,13)] : true,
      [utils.asGridCoord(22,14)] : true,
      [utils.asGridCoord(22,15)] : true,

      [utils.asGridCoord(21,17)] : true,
      [utils.asGridCoord(22,17)] : true,
      [utils.asGridCoord(23,17)] : true,
      [utils.asGridCoord(24,17)] : true,
      [utils.asGridCoord(25,17)] : true,
      [utils.asGridCoord(26,17)] : true,
      [utils.asGridCoord(27,17)] : true,
      [utils.asGridCoord(28,17)] : true,
      [utils.asGridCoord(29,17)] : true,

      [utils.asGridCoord(23,15)] : true,
      [utils.asGridCoord(24,15)] : true,
      [utils.asGridCoord(25,15)] : true,
      [utils.asGridCoord(26,15)] : true,
      [utils.asGridCoord(27,15)] : true,
      [utils.asGridCoord(28,15)] : true,
      [utils.asGridCoord(29,15)] : true,
    },

    cutsceneSpaces: {
      [utils.asGridCoord(29,16)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "FinalRoom",
              x: utils.withGrid(17),
              y: utils.withGrid(6),
              direction: "left"
            }
          ]
        }
      ]
    }
  },

  FinalRoom: {
    id: "FinalRoom",
    lowerSrc: "images/rooms/final-room (lower).png",
    upperSrc: "images/rooms/final-room (upper).png",
    
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        src: "images/characters/alter.png"
      }),

      alter: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(9),
        direction: "right",
        src: "images/characters/main-character.png"
      })
    },

    walls: {
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,3)] : true,
      [utils.asGridCoord(7,3)] : true,
      [utils.asGridCoord(8,3)] : true,
      [utils.asGridCoord(9,3)] : true,
      [utils.asGridCoord(10,3)] : true,
      [utils.asGridCoord(11,3)] : true,
      [utils.asGridCoord(12,3)] : true,
      [utils.asGridCoord(13,3)] : true,
      [utils.asGridCoord(14,3)] : true,
      [utils.asGridCoord(15,3)] : true,
      [utils.asGridCoord(16,3)] : true,

      [utils.asGridCoord(3,4)] : true,
      [utils.asGridCoord(3,5)] : true,
      [utils.asGridCoord(3,6)] : true,
      [utils.asGridCoord(3,7)] : true,
      [utils.asGridCoord(3,8)] : true,
      [utils.asGridCoord(3,10)] : true,
      [utils.asGridCoord(3,11)] : true,
      
      [utils.asGridCoord(4,12)] : true,
      [utils.asGridCoord(5,12)] : true,
      [utils.asGridCoord(6,12)] : true,
      [utils.asGridCoord(7,12)] : true,
      [utils.asGridCoord(8,12)] : true,
      [utils.asGridCoord(9,12)] : true,
      [utils.asGridCoord(10,12)] : true,
      [utils.asGridCoord(11,12)] : true,
      [utils.asGridCoord(12,12)] : true,
      [utils.asGridCoord(13,12)] : true,
      [utils.asGridCoord(14,12)] : true,
      [utils.asGridCoord(15,12)] : true,
      [utils.asGridCoord(16,12)] : true,
      
      [utils.asGridCoord(17,4)] : true,
      [utils.asGridCoord(17,5)] : true,
      [utils.asGridCoord(17,7)] : true,
      [utils.asGridCoord(17,8)] : true,
      [utils.asGridCoord(17,9)] : true,
      [utils.asGridCoord(17,10)] : true,
      [utils.asGridCoord(17,11)] : true,
    }
  }

}