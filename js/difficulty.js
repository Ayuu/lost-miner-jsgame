const LEVEL = {
  EASY: {
    LOOT: 80,
    WALL: 20,
  },
  MEDIUM: {
    LOOT: 50,
    WALL: 50,
  },
  HARD: {
    LOOT: 20,
    WALL: 80,
  },
};

class Difficulty {
  constructor(progress) {
    this.level = progress > 8 ? LEVEL.HARD : (progress > 4 ? LEVEL.MEDIUM : LEVEL.EASY);
    this.progress = progress;
  }

  getLootChance() {
    return this.level.LOOT * (1 - this.progress / MAX_PROGRESS) || 1;
  }

  getWallChance() {
    return this.level.WALL * (this.progress / MAX_PROGRESS);
  }
}