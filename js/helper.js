function defaults(value, defaultValue) {
  return value === undefined || value === null ? defaultValue : value;
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function hexToRgba(hex, a) {
  var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `rgba(${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}, ${a})` : null;
}

function tileComparator(r1, r2) {
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
}

class Random {
  constructor(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;

    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
  }

  next() {
    return this.nextInt() / (this.m - 1);
  }

  nextInt() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }

  nextRange(start, end) {
    var rangeSize = end - start;
    var randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
}

let map = new WeakMap();

let internal = function (object) {
  if (!map.has(object))
      map.set(object, {});
  return map.get(object);
}

const random = new Random(42);
const DIR = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
};
const TILE_TYPE = {
  EMPTY: '',
  WALL: 'WALL',
  ORE: 'ORE',
  EXIT: 'EXIT',
};