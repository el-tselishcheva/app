class Sprite {
  constructor(config) {
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    this.shadow = new Image();
    this.useShadow = true;
    if (this.useShadow) {
      this.shadow.src = "images/items/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    this.animations = config.animations || {
      "idle-down" : [ [0,0] ],
      "idle-left" : [ [0,1] ],
      "idle-right": [ [0,2] ],
      "idle-up"   : [ [0,3] ],
      "walk-down" : [ [1,0],[2,0],[3,0],[4,0], ],
      "walk-left" : [ [1,1],[2,1],[3,1],[4,1], ],
      "walk-right": [ [1,2],[2,2],[3,2],[4,2], ],
      "walk-up"   : [ [1,3],[2,3],[3,3],[4,3], ]
    }
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;
    
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }
  }
  
  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 8 + utils.withGrid(9) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(this.image,
      frameX * 32, frameY * 48,
      32,48,
      x,y,
      32,48
    )

    this.updateAnimationProgress();
  }

}