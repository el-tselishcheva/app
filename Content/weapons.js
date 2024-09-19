window.WeaponTypes = {
  weak: "weak",
  moderate: "moderate",
  strong: "strong"
}

window.Weapons = {
  "wooden-stick": {
    name: "ПАЛКА",
    description: "Pizza desc here",
    src: "images/weapons/wooden-stick.png",
    type: WeaponTypes.weak,
    icon: "images/icons/weak.png",
    actions: [ "saucyStatus", "distractedStatus", "damage1" ],
  },
  "lighter": {
    name: "ЗАЖИГАЛКА",
    description: "Pizza desc here",
    src: "images/weapons/lighter.png",
    type: WeaponTypes.moderate,
    icon: "images/icons/moderate.png",
    actions: [ "saucyStatus", "distractedStatus", "damage2" ],
  },
  "knife": {
    name: "НОЖ",
    description: "Pizza desc here",
    src: "images/weapons/knife.png",
    type: WeaponTypes.strong,
    icon: "images/icons/strong.png",
    actions: [ "saucyStatus", "distractedStatus", "damage3" ],
  },
  "stone": {
    name: "КАМЕНЬ",
    description: "Pizza desc here",
    src: "images/weapons/stone.png",
    type: WeaponTypes.weak,
    icon: "images/icons/weak.png",
    actions: [ "saucyStatus", "distractedStatus", "damage1" ],
  },
  "broken-bottle": {
    name: "РОЗОЧКА",
    description: "Pizza desc here",
    src: "images/weapons/broken-bottle.png",
    type: WeaponTypes.moderate,
    icon: "images/icons/moderate.png",
    actions: [ "saucyStatus", "distractedStatus", "damage2" ],
  },
  "baseball-bat": {
    name: "БИТА",
    description: "Pizza desc here",
    src: "images/weapons/baseball-bat.png",
    type: WeaponTypes.strong,
    icon: "images/icons/strong.png",
    actions: [ "saucyStatus", "distractedStatus", "damage3" ],
  }
}