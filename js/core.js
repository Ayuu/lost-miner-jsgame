const MAX_HEIGHT = 490;
const MAX_WIDTH = 600;
const MAX_PROGRESS = 12;

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
const freeWalk = [];
const difficulty = new Difficulty();

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
  if (player.isDead()) {
    gameOver = true;
    return;
  }
  container.clear();
  container.frameNo += 1;

  time.text = `Time elapsed: ${Math.floor(container.frameNo / 50)}`;
  time.update();

  progress.text = `${player.progress === MAX_PROGRESS ? 'Last level' : `Level: ${player.progress + 1}`}`;
  progress.update();

  permanentWall.forEach(wall => wall.update());
  ores.forEach(ore => ore.update());
  maze.paint();
  player.newPos(permanentWall, ores);
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
      player.action();
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

function generateWall(container) {
  const height = 30;
  const width = 30;
  const w = new Set();
  var x, y;
  for (x = 0, y = 0; x < 20; x++) w.add({ x, y });
  for (x = 0, y = 14; x < 20; x++) w.add({ x, y });
  for (x = 0, y = 0; y < 15; y++) w.add({ x, y });
  for (x = 19, y = 0; y < 15; y++) w.add({ x, y });

  w.forEach(({ x, y }) => {
    permanentWall.push(new WallComponent({ width, height, x: 0 + x * 30, y: 0 + y * 30, container }));
  });
}

function generateLevel() {
  const height = 30;
  const width = 30;
  permanentWall.length = 0;
  ores.length = 0;
  freeWalk.length = 0;

  maze.startGenerate(new Difficulty(player ? player.progress : 0));
  console.log(maze.map);
  maze.map.forEach(({ x, y, type }) => {
    switch(type) {
      case TILE_TYPE.WALL:
        permanentWall.push(new WallComponent({
          width, height,
          x: x * width,
          y: y * height,
          container,
        }));
        break;
      case TILE_TYPE.ORE:
        ores.push(new OreComponent({
          width, height,
          x: x * width,
          y: y * height,
          container,
        }));
        break;
      case TILE_TYPE.EMPTY:
        freeWalk.push({ x, y });
        break;
    }
  });
  player = new Player({ container, color: 'red', ...freeWalk[random.nextRange(0, freeWalk.length)] });
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
      maze = new MazeGenerator(0, 0, 20, 15, container);
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