window.Actions = {
  damage1: {
    name: "НЕЛОВКИЙ УДАР",
    description: "Первый шаг любого начинающего бойца.",
    success: [
      { type: "textMessage", text: "{CASTER} производит {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10}
    ]
  },
  damage2: {
    name: "ВНЕЗАПНЫЙ ВЫПАД",
    description: "Pillowy punch of dough",
    success: [
      { type: "textMessage", text: "{CASTER} делает {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 20}
    ]
  },
  damage3: {
    name: "ЯРОСТНОЕ НАПАДЕНИЕ",
    description: "Pillowy punch of dough",
    success: [
      { type: "textMessage", text: "{CASTER} совершает {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 30}
    ]
  },
  saucyStatus: {
    name: "Tomato Squeeze",
    description: "Applies the Saucy status",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "stateChange", status: { type: "saucy", expiresIn: 3 } }
    ]
  },
  distractedStatus: {
    name: "Olive Oil",
    description: "Slippery mess of deliciousness",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "distracted", expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} is slipping all around!"},
    ]
  },
  
  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Feeling fresh!", },
    ]
  },
  item_recoverHp1: {
    name: "?",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} использует {ACTION}!", },
      { type: "stateChange", recover: 150, },
      { type: "textMessage", text: "{CASTER} полностью восстанавливает HP!", },
    ]
  },
  item_recoverHp2: {
    name: "ПЛАСТЫРЬ",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} использует {ACTION}!", },
      { type: "stateChange", recover: 15, },
      { type: "textMessage", text: "{CASTER} восстанавливает 15 HP!", },
    ]
  },
}