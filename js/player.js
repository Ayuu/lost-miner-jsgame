class Player extends ObjectComponent {
  constructor(props) {
    super({ ...props, width: 30, height: 30, x: 40, y: 120 });
    this.speedX = 0;
    this.speedY = 0;
    this.container = props.container;
    this.dead = false;
  }

  move(x, y) {
    this.speedX = defaults(x, this.speedX);
    this.speedY = defaults(y, this.speedY);
  }

  newPos(wall) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.centerX = this.x + this.width * 0.5;
    this.centerY = this.y + this.height * 0.5;
    wall.forEach(w => {
      this.crashWith(w);
    });
    this.hitContainer();
  }

  hitContainer() {
    const bottom = this.container.canvas.height - this.height;
    const right = this.container.canvas.width - this.width;
    if (this.y <= 0) this.y = 0;
    else if (this.y >= bottom) this.y = bottom;
    if (this.x <= 0) this.x = 0;
    else if (this.x >= right) this.x = right;
  }
  
  crashWith(o) {
    const w = 0.5 * (this.width + o.width);
    const h = 0.5 * (this.height + o.height);
    const dx = this.centerX - o.centerX;
    const dy = this.centerY - o.centerY;
    if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
      const wy = w * dy;
      const hx = h * dx;

      if (wy > hx) {
        if (wy > -hx) this.y = o.y + o.height;
        else this.x = o.x - this.width;
      } else {
        if (wy > -hx) this.x = o.x + o.width;
        else this.y = o.y - this.height;
      }
    }
  }

  isDead() { return this.dead; }
}