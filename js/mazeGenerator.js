const ROOM_MIN_SIZE = 3;

class MazeGenerator {
  constructor(x, y, width, height) {
    this.random = new Random(42);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rooms = [];
    this.walkable = [];
    this.breakable = [];
    this.walls = [];
  }

  split() {
    const split = false;

    do {
      var splitH = true;

      if (width * 1.25 > height) {
        splitH = false;
      } else if (height * 1.25 > width) {
        splitH = true;
      } else if (this.random.nextRange(0, 2)) {
        splitH = false;
      }

      if (splitH) {
        const middle = this.random.nextRange(this.y + MIN_SIZE, this.height - MIN_SIZE);
      } else {
        const middle = this.random.nextRange(this.x + MIN_SIZE, this.width - MIN_SIZE);
      }
    } while (split);
  }
}

// 1,1 => 13,18
