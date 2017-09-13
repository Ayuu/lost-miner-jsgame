class WallComponent extends ObjectComponent {
  constructor(props) {
    super(props);
  }

  update() {
    this.ctx.strokeStyle = '#000';
    this.ctx.fillStyle = '#C0C0C0';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x + this.width, this.y);
    this.ctx.lineTo(this.x, this.y + this.height);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#708090';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + this.width, this.y + this.height);
    this.ctx.lineTo(this.x + this.width, this.y);
    this.ctx.lineTo(this.x, this.y + this.height);
    this.ctx.fill();
    this.ctx.stroke();
  }
}
