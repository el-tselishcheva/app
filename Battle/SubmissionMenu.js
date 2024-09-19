class SubmissionMenu { 
  constructor({ caster, enemy, onComplete, items, replacements }) {
    this.caster = caster;
    this.enemy = enemy;
    this.replacements = replacements;
    this.onComplete = onComplete;

    let quantityMap = {};
    items.forEach(item => {
      if (item.team === caster.team) {
        let existing = quantityMap[item.actionId];
        if (existing) {
          existing.quantity += 1;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          }
       }
      }
    })
    this.items = Object.values(quantityMap);
  }

  getPages() {
    const backOption = {
      label: "Назад",
      description: "Вернуться на предыдущую страницу.",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root)
      }
    };

    return {
      root: [
        {
          label: "Действия",
          description: "Что же делать дальше? Выбор за Вами.",
          handler: () => {
            this.keyboardMenu.setOptions( this.getPages().actions )
          }
        },
        {
          label: "Предметы",
          description: "Может, в рюкзаке завалялось что-то полезное?",
          handler: () => {
            this.keyboardMenu.setOptions( this.getPages().items )
          }
        },
        /*
        {
          label: "Оружие",
          description: "Выберите любое другое оружие для атаки.",
          handler: () => {
            this.keyboardMenu.setOptions( this.getPages().replacements );

            if (this.replacements.length == 0) {
              var info = document.createElement("div");
              info.innerHTML = (`
                <div class="info">
                  <p>пусто</p>
                </div>
              `);

              var element = this.keyboardMenu.element.querySelector("div");
              var parent = element.parentNode;
              parent.insertBefore(info, element);
            }
          }
        },
        */
      ],

      actions: [
        ...this.caster.actions.map(key => {
          const action = Actions[key];
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],

      items: [
        ...this.items.map(item => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x"+item.quantity;
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId)
            }
          }
        }),
        backOption
      ],

      /*
      replacements: [
        ...this.replacements.map(replacement => {
          return {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              this.menuSubmitReplacement(replacement)
            }
          }
        }),
        backOption
      ]
      */
    }
  }

  menuSubmitReplacement(replacement) {
    this.keyboardMenu?.end();
    this.onComplete({
      replacement
    })
  }

  menuSubmit(action, instanceId=null) {
    this.keyboardMenu?.end();

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
      instanceId
    })
  }

  decide() {
    let action = Math.random() * this.caster.actions.length;
    let actionNumber = Math.floor(action);
    this.menuSubmit(Actions[ this.caster.actions[actionNumber] ]);
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions( this.getPages().root )
  }

  init(container) {
    if (this.caster.isPlayerControlled) {
      this.showMenu(container)
    } else {
      this.decide()
    }
  }
}