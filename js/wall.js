class WallComponent extends ObjectComponent {
  constructor(props) {
    super(props);
  }

  update() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

  }
}
