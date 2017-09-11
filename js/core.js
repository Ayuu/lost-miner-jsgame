const MAX_HEIGHT = 490;
const MAX_WIDTH = 600;

var container;
var player;
var score;
var ctrlPressed = false;
var gameStarted = false;
var gameOver = false;
var permanentWall = [];

var KEY = {
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
  R: 82,
  CTRL: 17,
  SHIFT: 16,
  ALT: 18,
  ESC: 27,
  TAB: 9,
  E: 69,
};

var KEY_UP = [KEY.UP, KEY.W, KEY.Z, KEY.SPACE];
var KEY_DOWN = [KEY.DOWN, KEY.S];
var KEY_LEFT = [KEY.LEFT, KEY.A, KEY.Q];
var KEY_RIGHT = [KEY.RIGHT, KEY.D];
var KEY_ACTION = [KEY.E];

function updateGameArea() {
  if (player.isDead()) {
    gameOver = true;
    return;
  }
  container.clear();
  container.frameNo += 1;

  score.text = `SCORE: ${container.frameNo}`;
  score.update();

  permanentWall.forEach(wall => { wall.update() });
  player.newPos(permanentWall);
  player.update();
}

function startGame() {
  container.start();
  gameStarted = true;
}

function keyup({ keyCode: code }) {
  if (ctrlPressed) {
    if (code === KEY.CTRL) {
      ctrlPressed = false;
    }
    return;
  }
  if (gameStarted) {
    if (KEY_UP.includes(code) || KEY_DOWN.includes(code)) {
      player.move(undefined, 0);
    } else if (KEY_LEFT.includes(code) || KEY_RIGHT.includes(code)) {
      player.move(0);
    }
  }
}

function keydown({ keyCode: code }) {
  if (code === KEY.R) {
    startGame();
  } else {
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
}

// 12, 20

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
      player = new Player({ container, color: 'red' });
      score = new TextComponent({
        size: '30px',
        x: 10, y: MAX_HEIGHT - 10,
        container,
      });
      generateWall(container);
      permanentWall.push(new ObjectComponent({
        width: 600,
        height: 2,
        x: 0,
        y: MAX_HEIGHT - 40,
        container,
      }));

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