class OreComponent extends ObjectComponent {
  constructor(props, color, sides) {
    super(props);
    this.color = props.color || '#686868';
    this.sides = props.sides || 8;
    this.halfWidth *= 0.8;
    this.halfHeight *= 0.8;
    this.quarterWidth = this.halfWidth * 0.75;
    this.quarterHeight = this.halfHeight * 0.75;
  }

  update() {
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = this.color;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX + this.halfWidth * Math.cos(0),
        this.centerY + this.halfHeight * Math.sin(0));
    for (var i = 1; i <= this.sides; i += 1) {
      this.ctx.lineTo(
        this.centerX + this.halfWidth * Math.cos(i * 2 * Math.PI / this.sides),
        this.centerY + this.halfHeight * Math.sin(i * 2 * Math.PI / this.sides),
      );
    }
    this.ctx.fill();
    this.ctx.lineTo(this.centerX + this.quarterWidth * Math.cos(0),
        this.centerY + this.quarterHeight * Math.sin(0));
    for (var i = 1; i <= this.sides; i += 1) {
      this.ctx.lineTo(
        this.centerX + this.quarterWidth * Math.cos(i * 2 * Math.PI / this.sides),
        this.centerY + this.quarterHeight * Math.sin(i * 2 * Math.PI / this.sides),
      );
      this.ctx.lineTo(
        this.centerX + this.halfWidth * Math.cos(i * 2 * Math.PI / this.sides),
        this.centerY + this.halfHeight * Math.sin(i * 2 * Math.PI / this.sides),
      );
      this.ctx.moveTo(
        this.centerX + this.quarterWidth * Math.cos(i * 2 * Math.PI / this.sides),
        this.centerY + this.quarterHeight * Math.sin(i * 2 * Math.PI / this.sides),
      );
    }

    this.ctx.stroke();
  }
}