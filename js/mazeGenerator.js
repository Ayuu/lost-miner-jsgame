const ROOM_MIN_SIZE = 2;
const random = new Random(21);

class Leaf {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = `#${Math.floor(random.next() * 16777215).toString(16)}`;
  }
}

class MazeGenerator {
  constructor(startX, startY, width, height, container) {
    this.leaves = [new Leaf(startX, startY, width, height)];
    this.ctx = container.context;
  }

  startGenerate() {
    var split;
    do {
      split = false;
      this.leaves.forEach(leaf => {
        const { x, y, width, height } = leaf;
        var splitH = true;

        if (width * 1.25 > height) {
          splitH = false;
        } else if (height * 1.25 > width) {
          splitH = true;
        } else {
          splitH = random.nextRange(0, 2) === 1;
        }

        if (splitH) {
          if (y + ROOM_MIN_SIZE < height - ROOM_MIN_SIZE) {
            const middle = random.nextRange(y + ROOM_MIN_SIZE, height - ROOM_MIN_SIZE);
            leaf.height = middle;
            const newLeaf = new Leaf(x, y + middle, width, height - middle);
            this.leaves.push(newLeaf);
            split = true;
          }
        } else {
          if (x + ROOM_MIN_SIZE < width - ROOM_MIN_SIZE) {
            const middle = random.nextRange(x + ROOM_MIN_SIZE, width - ROOM_MIN_SIZE);
            leaf.width = middle;
            const newLeaf = new Leaf(x + middle, y, width - middle, height);
            this.leaves.push(newLeaf);
            split = true;
          }
        }
      });
    } while (split);

    this.leaves.sort((r1, r2) => {
      if (r1.x < r2.x) {
        if (r1.y < r2.y) {
          return -4;
        } else if (r1.y === r2.y) {
          return -3;
        }
        return -2;
      } else if (r1.x === r2.x) {
        if (r1.y < r2.y) {
          return -1;
        } else if (r1.y === r2.y) {
          return 0;
        }
        return 1;
      } else {
        if (r1.y < r2.y) {
          return 2;
        } else if (r1.y === r2.y) {
          return 3;
        }
        return 4;
      }
    });
  }

  paint() {
    this.leaves.forEach(leaf => {
      const { x, y, width, height, color } = leaf;
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(x * 30, y * 30, width * 30, height * 30);
    });
  }
}
