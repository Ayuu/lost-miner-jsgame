var myGamePiece;
var myObstacles = [];
var myScore;

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
};

function accelerateXY(n) {
  myGamePiece.speedX = n;
}

function accelerateZ(n) {
  myGamePiece.gravity = n;
}

function keyup(e) {
  var code = e.keyCode;
  switch (code) {
    case KEY.Q:
    case KEY.A:
    case KEY.LEFT:
    case KEY.D:
    case KEY.RIGHT:
      accelerateXY(0);
      break;
    case KEY.S:
    case KEY.DOWN:
    case KEY.Z:
    case KEY.W:
    case KEY.UP:
    case KEY.SPACE:
      accelerateZ(0.05);
      break;
  }
}

function keydown(e) {
  var code = e.keyCode;
  switch (code) {
    case KEY.Q:
    case KEY.A:
    case KEY.LEFT:
      accelerateXY(-4);
      break;
    case KEY.Z:
    case KEY.W:
    case KEY.UP:
      accelerateZ(-0.2);
      break;
    case KEY.D:
    case KEY.RIGHT:
      accelerateXY(4);
      break;
    case KEY.S:
    case KEY.DOWN:
      accelerateZ(0.2);
      break;
    case KEY.SPACE:
      accelerateZ(-0.2);
      break;
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  window.addEventListener('keydown', keydown, false);
  window.addEventListener('keyup', keyup, false);
  var myGameArea = {
    canvas: document.getElementById("container"),
    start: function() {
      this.context = this.canvas.getContext("2d");
      this.frameNo = 0;
      this.interval = setInterval(updateGameArea, 20);
      this.canvas.width = 480;
      this.canvas.height = 270;
    },
    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
      ctx = myGameArea.context;
      if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    this.newPos = function() {
      this.gravitySpeed += this.gravity;
      this.x += this.speedX;
      this.y += this.gravitySpeed;
      this.hitContainer();
    }
    this.hitContainer = function() {
      var bottom = myGameArea.canvas.height - this.height;
      var right = myGameArea.canvas.width - this.width;
      if (this.y <= 0) {
        this.y = 0;
        this.gravitySpeed = 0;
      } else if (this.y >= bottom) {
        this.y = bottom;
        this.gravitySpeed = 0;
      }
      if (this.x <= 0) {
        this.x = 0;
        this.speedX = 0;
      } else if (this.x >= right) {
        this.x = right;
        this.speedX = 0;
      }
    }
    this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
      }
      return crash;
    }
  }

  function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
        return;
      }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
      x = myGameArea.canvas.width;
      minHeight = 20;
      maxHeight = 200;
      height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      minGap = 50;
      maxGap = 200;
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new component(10, height, "green", x, 0));
      myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -1;
      myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
  }

  function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 == 0;
  }

  function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
  }

  startGame();
});
