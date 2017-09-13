const MAX_HEIGHT = 490;
const MAX_WIDTH = 600;
const MAX_PROGRESS = 11; // start at 0, end after the 12 lvl

const mapWidth = 20;
const TILE_HEIGHT = 30;
const TILE_WIDTH = 30;

var container;
var maze;
var player;
var difficulty;
var time;
var progress;
var splashText;
var pressEnter;
var gameStarted = false;
var gamePause = false;
const walls = [];
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
  CTRL: 17,
  SHIFT: 16,
  ALT: 18,
  ESC: 27,
  TAB: 9,
  E: 69,
  META: 91,
  ENTER: 13,
};

const KEY_UP = [KEY.UP, KEY.W, KEY.Z];
const KEY_DOWN = [KEY.DOWN, KEY.S];
const KEY_LEFT = [KEY.LEFT, KEY.A, KEY.Q];
const KEY_RIGHT = [KEY.RIGHT, KEY.D];
const KEY_ACTION = [KEY.E];

function updateGameArea() {
  if (!gameStarted || gamePause) return;
  container.clear();
  container.frameNo += 1;

  time.text = `Time elapsed: ${Math.floor(container.frameNo / 50)}`;
  time.update();

  progress.text = `${player.progress === MAX_PROGRESS ? 'Last level' : `Level: ${player.progress + 1}`}`;
  progress.update();

  walls.forEach(wall => wall.update());
  ores.forEach(ore => ore.update());
  exit.forEach(e => e.update());
  var isEnd = player.newPos(walls, ores, exit);
  if (isEnd) {
    var inc = isEnd.type === TILE_TYPE.HOLE ? -1 : 1;
    player.endLevel(inc);
    sounds.win.play();
    gamePause = true;
    container.clear();
    if (player.progress >= MAX_PROGRESS) {
      gameStarted = false;
      splashText.text = `Congratulation! You made your way out!`;
      pressEnter.text = `Press Enter to restart the game!`;
      container.frameNo = 0;
    } else {
      splashText.text = inc > 0 ? `Good job!` : 'Boo, try again.';
      pressEnter.text = `Press Enter to start next level (${player.progress + 1})!`;
    }
    splashText.update();
    pressEnter.update();
    return;
  }
  player.update();
}

function keyup({ keyCode: code }) {
  // adding some randomness to the game otherwise it's too easy
  const rng = random.next();
  if (code === KEY.ENTER) {
    generateLevel(gameStarted === false);
  }
  if (gameStarted) {
    if (KEY_UP.includes(code) || KEY_DOWN.includes(code)) {
      player.move(null, 0);
    } else if (KEY_LEFT.includes(code) || KEY_RIGHT.includes(code)) {
      player.move(0);
    } else if (KEY_ACTION.includes(code)) {
      const tile = player.action(maze.map, mapWidth);
      if (tile) {
        if (tile.type === TILE_TYPE.ORE) {
          const x = tile.x * TILE_WIDTH;
          const y = tile.y * TILE_HEIGHT;
          for(var i = 0; i < ores.length; i++) {
            const ore = ores[i];
            if (ore.x === x && ore.y === y) {
              if (rng < 0.05 || ores.length === 1) {
                const type = rng > (0.025 * difficulty.getLootChance() / 100) || ores.length === 1 ? TILE_TYPE.EXIT : TILE_TYPE.HOLE;
                const key = tile.x + tile.y * mapWidth;
                map[key] = Object.assign({}, map[key], { type });
                exit.push(new StarComponent({
                  container, width: TILE_WIDTH, height: TILE_HEIGHT,
                  x, y, type,
                }));
              }
              sounds.mine.play();
              ores.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  }
}

function keydown({ keyCode: code }) {
  if (gameStarted) {
    if (KEY_UP.includes(code)) {
      player.move(null, -5);
    } else if (KEY_DOWN.includes(code)) {
      player.move(null, 5);
    } else if (KEY_LEFT.includes(code)) {
      player.move(-5);
    } else if (KEY_RIGHT.includes(code)) {
      player.move(5);
    }
  }
}

function generateLevel(reset) {
  container.reset();
  difficulty = new Difficulty(player ? player.progress : 0);
  maze.startGenerate();
  maze.map.forEach(({ x, y, type }) => {
    switch(type) {
      case TILE_TYPE.WALL:
        walls.push(new WallComponent({
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
    player = new Player(Object.assign({}, { container, width: TILE_WIDTH, height: TILE_HEIGHT }, start));
  } else {
    reset && player.reset();
    player.setPosition(start);
  }
  container.interval = setInterval(updateGameArea, 20);
  gamePause = false;
  gameStarted = true;
}

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener('keydown', keydown, false);
  window.addEventListener('keyup', keyup, false);

  container = {
    canvas: document.getElementById("container"),
    start() {
      container = this;
      this.reset();
      this.context = this.canvas.getContext("2d");
      this.frameNo = 0;
      this.canvas.width = MAX_WIDTH;
      this.canvas.height = MAX_HEIGHT;

      time = new TextComponent({
        size: '18px',
        x: 10, y: MAX_HEIGHT - 10,
        container,
      });
      progress = new TextComponent({
        size: '18px',
        x: MAX_WIDTH - 100, y: MAX_HEIGHT - 10,
        container,
      });
      pressEnter = new TextComponent({
        size: '18px',
        x: 90, y: MAX_HEIGHT / 2 + 50,
        container,
      });
      splashText = new TextComponent({
        size: '18px',
        x: 30, y: MAX_HEIGHT / 2,
        container,
      });
      walls.push(new ObjectComponent({
        width: MAX_WIDTH * 2,
        height: 2,
        x: -MAX_WIDTH / 2,
        y: MAX_HEIGHT - 40,
        container,
      }));

      maze = new MazeGenerator(0, 0, mapWidth, 15, container);
      sounds.mine = new Audio('assets/mine.wav');
      sounds.win = new Audio('assets/win.wav');
      splashText.text = `You are a romantic panda that is trying to find a crystal for your lover.`;
      splashText.update();
      splashText.x = 90;
      pressEnter.text = `Press Enter to start the game!`;
      pressEnter.update();
      gamePause = true;
    },
    clear() {
      if (this.context) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    },
    reset() {
      this.clear();
      if (this.interval) {
        clearInterval(this.interval);
        gameStarted = false;
      }
      walls.length = 0;
      ores.length = 0;
      freeWalk.length = 0;
      exit.length = 0;
    }
  }; 
  container.start();
});