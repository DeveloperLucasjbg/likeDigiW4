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
    let x = 0;
    let z = 0;

    if (this.pressedKeys.has("a")) {
      x -= 1;
    }
    if (this.pressedKeys.has("d")) {
      x += 1;
    }
    if (this.pressedKeys.has("w")) {
      z -= 1;
    }
    if (this.pressedKeys.has("s")) {
      z += 1;
    }

    if (x !== 0 && z !== 0) {
      const diagonalScale = Math.SQRT1_2;
      x *= diagonalScale;
      z *= diagonalScale;
    }

    return { x, z };
  }

  dispose() {
    this.target.removeEventListener("keydown", this.handleKeyDown);
    this.target.removeEventListener("keyup", this.handleKeyUp);
    this.pressedKeys.clear();
  }
}

export default Controls;
