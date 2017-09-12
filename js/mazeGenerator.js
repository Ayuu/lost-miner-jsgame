class MazeGenerator {
  constructor(maxLeafSize, maxWidth, maxHeight) {
    this.maxLeafSize = maxLeafSize;
    this.maxWidth = maxHeight;
    this.left = null;
    this.right = null;
    this.random = new Random(42);
  }

  split() {
    for (var i = 10; i >= 0; i--) {
      console.log(this.random.nextInt());
    }
  }
}