class Player extends ObjectComponent {
  constructor(props) {
    super(props);
    this.container = props.container;
    this.margin = this.height * 0.1;
    this.headSize = this.height * 0.1;
    this.headMargin = this.headSize * 2;
    this.bodySize = this.height * 0.35;
    this.memberSize = this.height * 0.2;
    this.memberWidth = this.width * 0.15;

    this.setPosition(props);
    this.reset();
  }

  get progress() { return internal(this).progress; }
  set progress(x) { internal(this).progress = x; }

  reset() {
    internal(this).progress = 0;
  }

  setPosition({ x, y }) {
    this.x = x * this.width;
    this.y = y * this.height;
    internal(this).direction = DIR.LEFT;
    internal(this).speedX = 0;
    internal(this).speedY = 0;
    this.updateBodyPos();
  }

  move(x, y) {
    internal(this).speedX = defaults(x, internal(this).speedX);
    internal(this).speedY = defaults(y, internal(this).speedY);

    if (Number.isFinite(x) && x !== 0) {
      internal(this).direction = x > 0 ? DIR.RIGHT : DIR.LEFT;
    }
    if (Number.isFinite(y) && y !== 0) {
      internal(this).direction = y < 0 ? DIR.TOP : DIR.BOTTOM;
    }
  }

  action(map, mapWidth) {
    var tile;
    var x = Math.round(this.x / this.width);
    var y = Math.round(this.y / this.height);
    switch(internal(this).direction) {
      case DIR.LEFT:
        tile = map[x - 1 + y * mapWidth];
        break;
      case DIR.RIGHT:
        tile = map[x + 1 + y * mapWidth];
        break;
      case DIR.TOP:
        tile = map[x + (y - 1) * mapWidth];
        break;
      case DIR.BOTTOM:
        tile = map[x + (y + 1) * mapWidth];
        break;
    }
    return tile && tile.type === TILE_TYPE.ORE ? tile : null;
  }

  endLevel(progress) {
    internal(this).progress += progress;
  }

  updateBodyPos() {
    this.centerX = this.x + this.halfWidth;
    this.centerY = this.y + this.halfHeight;
    this.leftX = this.centerX - this.memberWidth;
    this.rightX = this.centerX + this.memberWidth;
  }

  newPos(walls, objs, exits) {
    var e;
    this.x += internal(this).speedX;
    this.y += internal(this).speedY;
    // temporary updating body pos to check collision
    this.updateBodyPos();
    walls.forEach(wall => this.crashWith(wall));
    objs.forEach(obj => this.crashWith(obj));
    this.hitContainer();
    for (var i = 0; i < exits.length; i++) {
      e = exits[i];
      if (e && this.crashWith(e)) break;
    }
    // final update for body pos after collision check
    this.updateBodyPos();
    return e;
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
      return true;
    }
    return false;
  }

  update() {
    this.ctx.strokeStyle = "#000";
    this.ctx.fillStyle = "#000";

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.y + this.margin + this.headSize, this.headSize, 0, Math.PI * 2, true);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.centerX, this.y + this.margin + this.headMargin);
    this.ctx.lineTo(this.centerX, this.y + this.margin + this.headMargin + this.bodySize);
    this.ctx.moveTo(this.centerX, this.y + this.margin + this.headMargin + this.bodySize / 2);
    this.ctx.strokeStyle = "#FFF";
    this.ctx.lineTo(this.centerX, this.y + this.margin + this.headMargin + this.bodySize);
    this.ctx.stroke();

    this.ctx.strokeStyle = "#000";
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.y + this.margin + this.headMargin);
    this.ctx.lineTo(this.leftX, this.y + this.margin + this.headMargin + this.memberSize);
    this.ctx.moveTo(this.centerX, this.y + this.margin + this.headMargin);
    this.ctx.lineTo(this.rightX, this.y + this.margin + this.headMargin + this.memberSize);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.y + this.margin + this.headMargin + this.bodySize);
    this.ctx.lineTo(this.leftX, this.y + this.height);
    this.ctx.moveTo(this.centerX, this.y + this.margin + this.headMargin + this.bodySize);
    this.ctx.lineTo(this.rightX, this.y + this.height);
    this.ctx.stroke();

    this.ctx.lineWidth = 1;
    // arrow
    this.ctx.strokeStyle = "#000";
    this.ctx.fillStyle = "red";
    switch(internal(this).direction) {
      case DIR.LEFT:
        this.ctx.moveTo(this.x, this.centerY);
        this.ctx.lineTo(this.x + 5, this.centerY + 5);
        this.ctx.lineTo(this.x + 5, this.centerY - 5);
        break;
      case DIR.RIGHT:
        this.ctx.moveTo(this.x + this.width, this.centerY);
        this.ctx.lineTo(this.x + this.width - 5, this.centerY + 5);
        this.ctx.lineTo(this.x + this.width - 5, this.centerY - 5);
        break;
      case DIR.TOP:
        this.ctx.moveTo(this.centerX, this.y);
        this.ctx.lineTo(this.centerX - 5, this.y + 5);
        this.ctx.lineTo(this.centerX + 5, this.y + 5);
        break;
      case DIR.BOTTOM:
        this.ctx.moveTo(this.centerX, this.y + this.height);
        this.ctx.lineTo(this.centerX - 5, this.y + this.height - 5);
        this.ctx.lineTo(this.centerX + 5, this.y + this.height - 5);
        break;
    }
    this.ctx.fill();
  }
}