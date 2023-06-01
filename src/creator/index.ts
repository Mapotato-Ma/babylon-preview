import { ArcRotateCamera, Engine, HemisphericLight, Scene, Tools, Vector3 } from '@babylonjs/core';
/**
 * 创建Babylon引擎
 * @param canvas 渲染的canvas元素
 * @returns 引擎实例
 */
export const createEngine = (canvas: HTMLCanvasElement) => new Engine(canvas);
/**
 * 创建Babylon场景
 * @param engine 引擎实例
 * @returns 场景实例
 */
export const createScene = (engine: Engine) => new Scene(engine);
/**
 * 创建旋转摄像机
 * @param scene 场景实例
 * @returns 旋转摄像机实例
 */
export const createArcRotateCamera = (scene: Scene) =>
  new ArcRotateCamera('ArcRotateCamera', Tools.ToRadians(125), Tools.ToRadians(70), 25, new Vector3(0, 3, 0), scene);
/**
 * 创建点光源
 * @param scene 场景实例
 * @returns 点光源实例
 */
export const createHemisphericLight = (scene: Scene) => new HemisphericLight('light1', new Vector3(0, 1, 0), scene);

/**
 * 创建默认场景
 * @param canvas 渲染的canvas元素
 */
export const createDefaultScene = (canvas: HTMLCanvasElement) => {
  const engine = createEngine(canvas);
  const scene = createScene(engine);
  createArcRotateCamera(scene).attachControl(canvas, true);
  createHemisphericLight(scene).intensity = 0.7;
  engine.runRenderLoop(() => {
    scene.render();
  });
  return { scene, engine };
};
