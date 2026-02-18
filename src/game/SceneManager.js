import * as THREE from "three";
import Controls from "./Controls";
import Player from "./Player";

class SceneManager {
  constructor(container) {
    this.container = container;
    this.isDisposed = false;
    this.animationFrameId = null;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.frustumSize = 20;
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    this.cameraOffset = new THREE.Vector3(14, 14, 14);
    this.cameraTarget = new THREE.Vector3(0, 1, 0);
    this.cameraSmoothness = 8;
    this.camera.position.copy(this.cameraOffset);
    this.camera.lookAt(this.cameraTarget);

    this.upVector = new THREE.Vector3(0, 1, 0);
    this.forwardVector = new THREE.Vector3();
    this.rightVector = new THREE.Vector3();
    this.worldMovementVector = new THREE.Vector3();
    this.desiredCameraPosition = new THREE.Vector3();

    this.clock = new THREE.Clock();
    this.controls = new Controls(window);
    this.player = new Player(this.scene);

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  async init() {
    try {
      await this.player.loadFirstDigimonTexture();
    } catch (error) {
      console.error("Could not load initial Digimon texture:", error);
    }

    if (!this.isDisposed) {
      this.clock.start();
      this.animate();
    }
  }

  handleResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / height || 1;

    this.camera.left = (-this.frustumSize * aspect) / 2;
    this.camera.right = (this.frustumSize * aspect) / 2;
    this.camera.top = this.frustumSize / 2;
    this.camera.bottom = -this.frustumSize / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }

  animate = () => {
    if (this.isDisposed) {
      return;
    }

    this.animationFrameId = window.requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();
    const inputVector = this.controls.getMovementVector();
    const movementVector = this.convertInputToWorldMovement(inputVector);

    this.player.update(deltaTime, movementVector);
    this.updateCamera(deltaTime);

    this.renderer.render(this.scene, this.camera);
  };

  convertInputToWorldMovement(inputVector) {
    if (inputVector.horizontal === 0 && inputVector.vertical === 0) {
      return { x: 0, z: 0 };
    }

    this.camera.getWorldDirection(this.forwardVector);
    this.forwardVector.y = 0;

    if (this.forwardVector.lengthSq() === 0) {
      return { x: 0, z: 0 };
    }

    this.forwardVector.normalize();
    this.rightVector.crossVectors(this.forwardVector, this.upVector).normalize();

    this.worldMovementVector
      .set(0, 0, 0)
      .addScaledVector(this.rightVector, inputVector.horizontal)
      .addScaledVector(this.forwardVector, inputVector.vertical);

    if (this.worldMovementVector.lengthSq() > 1) {
      this.worldMovementVector.normalize();
    }

    return { x: this.worldMovementVector.x, z: this.worldMovementVector.z };
  }

  updateCamera(deltaTime) {
    const smoothStep = 1 - Math.exp(-this.cameraSmoothness * deltaTime);
    const playerPosition = this.player.getPosition();

    this.cameraTarget.lerp(playerPosition, smoothStep);

    this.desiredCameraPosition.copy(this.cameraTarget).add(this.cameraOffset);
    this.camera.position.lerp(this.desiredCameraPosition, smoothStep);
    this.camera.lookAt(this.cameraTarget);
  }

  dispose() {
    this.isDisposed = true;

    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    window.removeEventListener("resize", this.handleResize);
    this.controls.dispose();
    this.player.dispose();
    this.renderer.dispose();

    const canvas = this.renderer.domElement;
    if (canvas.parentNode === this.container) {
      this.container.removeChild(canvas);
    }
  }
}

export default SceneManager;
