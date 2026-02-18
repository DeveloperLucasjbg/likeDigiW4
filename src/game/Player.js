import * as THREE from "three";

const DIGIMON_ENDPOINT = "https://digi-api.com/api/v1/digimon?pageSize=1";

class Player {
  constructor(scene) {
    this.scene = scene;
    this.speed = 6;
    this.position = new THREE.Vector3(0, 1, 0);

    this.spriteMaterial = new THREE.SpriteMaterial({
      color: 0xffffff,
      transparent: true,
    });

    this.sprite = new THREE.Sprite(this.spriteMaterial);
    this.sprite.position.copy(this.position);
    this.sprite.scale.set(2.2, 2.2, 1);
    this.scene.add(this.sprite);

    this.textureLoader = new THREE.TextureLoader();
    this.textureLoader.setCrossOrigin("anonymous");
  }

  async loadFirstDigimonTexture() {
    const response = await fetch(DIGIMON_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch Digimon (${response.status})`);
    }

    const data = await response.json();
    const imageUrl = data?.content?.[0]?.image;

    if (!imageUrl) {
      throw new Error("No Digimon image found in API response");
    }

    const texture = await this.loadTexture(imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.spriteMaterial.map = texture;
    this.spriteMaterial.needsUpdate = true;

    const textureImage = texture.image;
    if (textureImage?.width && textureImage?.height) {
      const ratio = textureImage.width / textureImage.height;
      const baseHeight = 2.6;
      this.sprite.scale.set(baseHeight * ratio, baseHeight, 1);
    }
  }

  loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(url, resolve, undefined, reject);
    });
  }

  update(deltaTime, movementVector) {
    this.position.x += movementVector.x * this.speed * deltaTime;
    this.position.z += movementVector.z * this.speed * deltaTime;
    this.sprite.position.copy(this.position);
  }

  getPosition() {
    return this.position;
  }

  dispose() {
    this.scene.remove(this.sprite);

    if (this.spriteMaterial.map) {
      this.spriteMaterial.map.dispose();
    }

    this.spriteMaterial.dispose();
  }
}

export default Player;
