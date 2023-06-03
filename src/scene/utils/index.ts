import { Scene } from '@babylonjs/core';

export function getBestCameraPosition(scene: Scene) {
  scene.createDefaultCamera(true, true, true);
}
