const ROOM_MIN_SIZE = 2;

class Room {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  createPath(expandableX, expandableY, expandableWidth, expandableHeight, directions) {
    directions.forEach(dir => {
      switch (dir) {
      case DIR.LEFT:
        this.x = expandableX;
        break;
      case DIR.RIGHT:
        this.width = expandableWidth - (this.x - expandableX);
        break;
      case DIR.TOP:
        this.y = expandableY;
        break;
      case DIR.BOTTOM:
        this.height = expandableHeight - (this.y - expandableY);
        break;
      }
    });

    this.sizeX = this.x + this.width;
    this.sizeY = this.y + this.height;
  }
}

class Leaf {
  constructor(x, y, width, height, dir) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = `#${Math.floor(random.next() * 16777215).toString(16)}`;
    this.directions = new Set(dir ? [...dir] : []);
    this.room = null;
  }

  generateCoords(difficulty, map, mapWidth) {
    for (var x = this.x; x < (this.x + this.width); x++) {
      for (var y = this.y; y < (this.y + this.height); y++) {
        if (this.room.x <= x && x < this.room.sizeX
          && this.room.y <= y && y < this.room.sizeY) {
          const rnd = random.nextRange(0, 2);
          const type = rnd === 1 ? TILE_TYPE.ORE : TILE_TYPE.EMPTY;
          map[x + y * mapWidth] = { x, y, type };
        } else {
          map[x + y * mapWidth] = { x, y, type: TILE_TYPE.WALL };
        }
      }
    }
  }
}

class MazeGenerator {
  constructor(startX, startY, width, height, container) {
    this.leaves = [new Leaf(startX, startY, width, height)];
    this.ctx = container.context;
    this.map = new Array(width * height);
    this.width = width;
    this.height = height;
  }

  startGenerate(difficulty) {
    var split;
    this.map.length = 0;
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
            const newLeaf = new Leaf(x, y + middle, width, height - middle, [DIR.TOP, ...leaf.directions]);
            leaf.directions.add(DIR.BOTTOM);
            this.leaves.push(newLeaf);
            split = true;
          }
        } else {
          if (x + ROOM_MIN_SIZE < width - ROOM_MIN_SIZE) {
            const middle = random.nextRange(x + ROOM_MIN_SIZE, width - ROOM_MIN_SIZE);
            leaf.width = middle;
            const newLeaf = new Leaf(x + middle, y, width - middle, height, [DIR.LEFT, ...leaf.directions]);
            leaf.directions.add(DIR.RIGHT);
            this.leaves.push(newLeaf);
            split = true;
          }
        }
      });
    } while (split);

    this.leaves.sort(tileComparator);
    this.createRooms(difficulty);
  }

  createRooms(difficulty) {
    this.leaves.forEach(leaf => {
      const width = Math.max(1, Math.floor(random.nextRange(1, 100) / 100 * leaf.width));
      const height = Math.max(1, Math.floor(random.nextRange(1, 100) / 100 * leaf.height));
      leaf.room = new Room({
        width,
        height,
        x: random.nextRange(leaf.x, leaf.x + (leaf.width - width)),
        y: random.nextRange(leaf.y, leaf.y + (leaf.height - height)),
      });
      leaf.room.createPath(leaf.x, leaf.y, leaf.width, leaf.height, leaf.directions);
      leaf.generateCoords(difficulty, this.map, this.width);
    });
  }

  paint() {
    this.leaves.forEach(leaf => {
      const { x, y, width, height, color, room } = leaf;
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(x * 30, y * 30, width * 30, height * 30);
      this.ctx.fillStyle = hexToRgba(color, 0.2);
      this.ctx.fillRect(room.x * 30, room.y * 30, room.width * 30, room.height * 30);
    });
  }
}