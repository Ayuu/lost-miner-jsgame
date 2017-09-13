const MAX_HEIGHT = 490;
const MAX_WIDTH = 600;
const MAX_PROGRESS = 12;

const mapWidth = 20;
const TILE_HEIGHT = 30;
const TILE_WIDTH = 30;

var container;
var maze;
var player;
var time;
var progress;
var metaPressed = false;
var gameStarted = false;
var gameOver = false;
const permanentWall = [];
const ores = [];
const exit = [];
const freeWalk = [];
const sounds = {};

const KEY = {
  Z: 90,
  Q: 81,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  CTRL: 17,
  SHIFT: 16,
  ALT: 18,
  ESC: 27,
  TAB: 9,
  E: 69,
  META: 91,
  ENTER: 13,
};

const KEY_UP = [KEY.UP, KEY.W, KEY.Z, KEY.SPACE];
const KEY_DOWN = [KEY.DOWN, KEY.S];
const KEY_LEFT = [KEY.LEFT, KEY.A, KEY.Q];
const KEY_RIGHT = [KEY.RIGHT, KEY.D];
const KEY_ACTION = [KEY.E];

function updateGameArea() {
  container.clear();
  container.frameNo += 1;

  if (player.isDead() || player.progress > MAX_PROGRESS) {
    gameOver = true;
    gameStarted = false;
    return;
  }
  time.text = `Time elapsed: ${Math.floor(container.frameNo / 50)}`;
  time.update();

  progress.text = `${player.progress === MAX_PROGRESS ? 'Last level' : `Level: ${player.progress + 1}`}`;
  progress.update();

  permanentWall.forEach(wall => wall.update());
  ores.forEach(ore => ore.update());
  exit.forEach(e => e.update());
  var isEnd = player.newPos(permanentWall, ores, exit);
  if (isEnd) {
    player.endLevel();
    sound.win.play();
    generateLevel();
  }
  player.update();
}

function startGame() {
  container.start();
  gameStarted = true;
}

function keyup({ keyCode: code }) {
  if (code === KEY.ENTER) {
    startGame();
  }
  if (gameStarted) {
    if (KEY_UP.includes(code) || KEY_DOWN.includes(code)) {
      player.move(undefined, 0);
    } else if (KEY_LEFT.includes(code) || KEY_RIGHT.includes(code)) {
      player.move(0);
    } else if (KEY_ACTION.includes(code)) {
      const tile = player.action(maze.map, mapWidth);
      if (tile) {
        if (tile.type === TILE_TYPE.ORE) {
          var idx = -1;
          const x = tile.x * TILE_WIDTH;
          const y = tile.y * TILE_HEIGHT;
          for(var i = 0; i < ores.length; i++) {
            const ore = ores[i];
            if (ore.x === x && ore.y === y) {
              idx = i;
              break;
            }
          }
          if (idx > -1) {
            if (random.next() < 0.05 || ores.length === 1) {
              map[tile.x + tile.y * mapWidth] = Object.assign({}, map[x + y * mapWidth], { type: TILE_TYPE.EXIT });
              exit.push(new StarComponent({
                width: TILE_WIDTH, height: TILE_HEIGHT,
                x, y,
                container,
              }));
            }
            sounds.mine.play();
            ores.splice(idx, 1);
          }
        }
      }
    }
  }
}

function keydown({ keyCode: code }) {
  if (gameStarted) {
    if (KEY_UP.includes(code)) {
      player.move(undefined, -5);
    } else if (KEY_DOWN.includes(code)) {
      player.move(undefined, 5);
    } else if (KEY_LEFT.includes(code)) {
      player.move(-5);
    } else if (KEY_RIGHT.includes(code)) {
      player.move(5);
    }
  }
}

function generateLevel() {
  permanentWall.length = 0;
  ores.length = 0;
  freeWalk.length = 0;
  exit.length = 0;

  maze.startGenerate(new Difficulty(player ? player.progress : 0));
  maze.map.forEach(({ x, y, type }) => {
    switch(type) {
      case TILE_TYPE.WALL:
        permanentWall.push(new WallComponent({
          width: TILE_WIDTH, height: TILE_HEIGHT,
          x: x * TILE_WIDTH,
          y: y * TILE_HEIGHT,
          container,
        }));
        break;
      case TILE_TYPE.ORE:
        ores.push(new OreComponent({
          width: TILE_WIDTH, height: TILE_HEIGHT,
          x: x * TILE_WIDTH,
          y: y * TILE_HEIGHT,
          container,
        }));
        break;
      case TILE_TYPE.EMPTY:
        freeWalk.push({ x, y });
        break;
    }
  });
  const start = freeWalk[random.nextRange(0, freeWalk.length)];
  if (!player) {
    player = new Player({ container, color: 'red', x: start.x, y: start.y, width: TILE_WIDTH, height: TILE_HEIGHT });
  } else {
    player.setPosition(start);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener('keydown', keydown, false);
  window.addEventListener('keyup', keyup, false);

  container = {
    canvas: document.getElementById("container"),
    start: function () {
      container = this;
      this.reset();
      this.context = this.canvas.getContext("2d");
      this.frameNo = 0;
      this.canvas.width = MAX_WIDTH;
      this.canvas.height = MAX_HEIGHT;
      time = new TextComponent({
        size: '30px',
        x: 10, y: MAX_HEIGHT - 10,
        container,
      });
      progress = new TextComponent({
        size: '30px',
        x: MAX_WIDTH - 120, y: MAX_HEIGHT - 10,
        container,
      });
      permanentWall.push(new ObjectComponent({
        width: MAX_WIDTH * 2,
        height: 2,
        x: -MAX_WIDTH / 2,
        y: MAX_HEIGHT - 40,
        container,
      }));
      maze = new MazeGenerator(0, 0, mapWidth, 15, container);
      sounds.mine = new Audio('assets/mine.ogg');
      sounds.win = new Audio('assets/win.ogg');
      generateLevel();
      this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
      if (this.context) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    },
    reset: function () {
      this.clear();
      if (this.interval) {
        clearInterval(this.interval);
        gameOver = false;
      }
      permanentWall.length = 0;
    }
  }
});