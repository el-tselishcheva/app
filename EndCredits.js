class EndCredits {
    constructor(ending) {
        this.ending = ending;
    }

    createElement() {
      this.element = document.createElement("div");
      this.element.classList.add("EndCredits");

      if (this.ending == "WON_BATTLE") {
        this.element.innerHTML = (`
        <img class="EndCredits_img" src="images/arts/ending-loser.png" alt="GAME OVER" />
        `)
      } else if (this.ending == "LOST_BATTLE") {
        this.element.innerHTML = (`
        <img class="EndCredits_img" src="images/arts/ending-winner.png" alt="WINNER!" />
        `)
      }
    }
  
    close() {
      this.element.remove();
    }
    
    init(container) {
      this.createElement();
      container.appendChild(this.element);
    }
  
}