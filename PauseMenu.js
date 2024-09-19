class PauseMenu {
  constructor({progress, onComplete}) {
    this.progress = progress;
    this.onComplete = onComplete;
  }

  getOptions() {

    const lineupWeapons = playerState.lineup.map(id => {
      const {weaponId} = playerState.weapons[id];
      const base = Weapons[weaponId];
      return {
        label: base.name,
        description: base.description
      }
    })

    return {
      root: [
        {
          label: "Оружие",
          description: "Просмотреть инвентарь.",
          handler: () => {
            this.keyboardMenu.setOptions( this.getOptions().items )
          }
        },
        {
          label: "Сохраниться",
          description: "Сохраните Ваш прогресс, и вернитесь в игру в то место, где закончили в прошлый раз.",
          handler: () => {
            this.progress.save();
            this.close();
          }
        },
        {
          label: "Справка",
          description: "Просмотреть основные команды.",
          handler: () => {
            this.keyboardMenu.setOptions( this.getOptions().info );

            var info = document.createElement("div");
            info.innerHTML = (`
              <div class="info">
                <ol>
                  <li><strong>&emsp;WASD / СТРЕЛКИ</strong> —</li>
                  <li> перемещение;</li>
                  <li></li>
                  <li><strong>&emsp;ENTER</strong> —</li>
                  <li> взаимодействие с NPC и предметами, выбор действия, пропуск текстового сообщения;</li>
                  <li></li>
                  <li><strong>&emsp;ESC</strong> —</li>
                  <li> меню паузы.</li>
                </ol>
              </div>
            `);

            var keyboardMenu = this.element.querySelector("div");
            var parent = keyboardMenu.parentNode;
            parent.insertBefore(info, keyboardMenu);
          }
        },
        {
          label: "Закрыть",
          description: "Свернуть меню и вернуться обратно в игру.",
          handler: () => {
            this.close();
          }
        }
      ],
      items: [
        ...lineupWeapons,
        {
          label: "Назад",
          description: "Вернуться на предыдущую страницу.",
          handler: () => {
            this.keyboardMenu.setOptions(this.getOptions().root)
          }
        }
      ],
      info: [
        {
          label: "Назад",
          description: "Вернуться на предыдущую страницу.",
          handler: () => {
            var info = this.element.querySelector("div");
            info.remove();

            this.keyboardMenu.setOptions(this.getOptions().root)
          }
        }
      ]
    }
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    this.element.classList.add("overlayMenu");
    this.element.innerHTML = (`
      <h2>ПАУЗА</h2>
    `)
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.keyboardMenu = new KeyboardMenu(
      {descriptionContainer: container}
    )
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions().root);

    utils.wait(200);
    
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })
  }

}