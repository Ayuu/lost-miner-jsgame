class Player extends ObjectComponent {
  constructor(props) {
    super({ ...props, width: 30, height: 30, x: 40, y: 120 });
    this.speedX = 0;
    this.speedY = 0;
    this.container = props.container;
    this.dead = false;
    this.headSize = this.height * 0.1;
    this.headMargin = this.headSize * 2;
    this.bodySize = this.height * 0.5;
    this.memberSize = this.height * 0.2;
    this.memberWidth = this.width * 0.15;
    this.updateBodyPos();
  }

  move(x, y) {
    this.speedX = defaults(x, this.speedX);
    this.speedY = defaults(y, this.speedY);
  }

  updateBodyPos() {
    this.centerX = this.x + this.halfWidth;
    this.centerY = this.y + this.halfHeight;
    this.leftX = this.centerX - this.memberWidth;
    this.rightX = this.centerX + this.memberWidth;
  }

  newPos(walls) {
    this.x += this.speedX;
    this.y += this.speedY;
    // temporary updating body pos to check collision
    this.updateBodyPos();
    walls.forEach(wall => this.crashWith(wall));
    this.hitContainer();
    // final update for body pos after collision check
    this.updateBodyPos();
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

  update() {
    this.ctx.strokeStyle = "#000"; // blue
    this.ctx.fillStyle = "#000"; // #ffe4c4

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.y + this.headSize, this.headSize, 0, Math.PI * 2, true);
    this.ctx.fill();

    // body
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.y + this.headMargin);
    this.ctx.lineTo(this.centerX, this.y + this.headMargin + this.bodySize);
    this.ctx.stroke();

    // arms
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.y + this.headMargin);
    this.ctx.lineTo(this.leftX, this.y + this.headMargin + this.memberSize);
    this.ctx.moveTo(this.centerX, this.y + this.headMargin);
    this.ctx.lineTo(this.rightX, this.y + this.headMargin + this.memberSize);
    this.ctx.stroke();

    // legs
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.y + this.headMargin + this.bodySize);
    this.ctx.lineTo(this.leftX, this.y + this.height);
    this.ctx.moveTo(this.centerX, this.y + this.headMargin + this.bodySize);
    this.ctx.lineTo(this.rightX, this.y + this.height);
    this.ctx.stroke();
  }
}