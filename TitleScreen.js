class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
  }

  getOptions(resolve) {
    const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "НОВАЯ ИГРА",
        description: "Делай В-Ы-Б-О-Р, скорее!",
        handler: () => {
          const sceneTransition = new SceneTransition();
          sceneTransition.init(document.querySelector(".game-container"), () => {
            resolve();
            sceneTransition.fadeOut();
          });

          this.close();
        }
      },
      safeFile ? {
        label: "ПРОДОЛЖИТЬ",
        description: "Вернёмся в место, сохранившееся в памяти.",
        handler: () => {
          const sceneTransition = new SceneTransition();
          sceneTransition.init(document.querySelector(".game-container"), () => {
            resolve(safeFile);
            sceneTransition.fadeOut();
          });

          this.close();
        }
      } : null
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = (`
      <img class="TitleScreen_logo" src="images/arts/choice-logo.png" alt="CHOICE" />
    `)
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }
  
  init(container) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve))
    })
  }

}