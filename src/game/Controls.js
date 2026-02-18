class Controls {
  constructor(target = window) {
    this.target = target;
    this.pressedKeys = new Set();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.target.addEventListener("keydown", this.handleKeyDown);
    this.target.addEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === "w" || key === "a" || key === "s" || key === "d") {
      this.pressedKeys.add(key);
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key === "w" || key === "a" || key === "s" || key === "d") {
      this.pressedKeys.delete(key);
    }
  }

  getMovementVector() {
    let horizontal = 0;
    let vertical = 0;

    if (this.pressedKeys.has("a")) {
      horizontal -= 1;
    }
    if (this.pressedKeys.has("d")) {
      horizontal += 1;
    }
    if (this.pressedKeys.has("w")) {
      vertical += 1;
    }
    if (this.pressedKeys.has("s")) {
      vertical -= 1;
    }

    if (horizontal !== 0 && vertical !== 0) {
      const diagonalScale = Math.SQRT1_2;
      horizontal *= diagonalScale;
      vertical *= diagonalScale;
    }

    return { horizontal, vertical };
  }

  dispose() {
    this.target.removeEventListener("keydown", this.handleKeyDown);
    this.target.removeEventListener("keyup", this.handleKeyUp);
    this.pressedKeys.clear();
  }
}

export default Controls;
