class AbstractComponent {
  constructor(props) {
    if (new.target === AbstractComponent) {
      throw new TypeError("Cannot construct AbstractComponent instances directly");
    }
    if (!props.container) {
      throw new ComponentException('Required value are missing');
    }

    this.ctx = props.container.context;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.color = props.color || 'black';
  }
}

class ObjectComponent extends AbstractComponent {
  constructor(props) {
    super(props);
    if (!props.width || !props.height) {
      throw new ComponentException('Size are required value');
    }

    this.width = props.width;
    this.height = props.height;
    this.halfWidth = this.width * 0.5;
    this.halfHeight = this.height * 0.5;
    this.centerX = this.x + this.halfWidth;
    this.centerY = this.y + this.halfHeight;
    this.sizeY = this.y + this.height;
    this.sizeX = this.x + this.width;
  }

  update() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class TextComponent extends AbstractComponent {
  constructor(props) {
    super(props);
    this.text = '';
    if (!props.size) {
      throw new ComponentException('Size are required value');
    }

    this.size = props.size;
  }

  update() {
    this.ctx.font = this.size + ' Arial';
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.text, this.x, this.y);
  }
}
