import { Engine, Scene } from '@babylonjs/core';
import { createDefaultScene, createEngine, createScene } from '@/creator';
import { E_Models } from '@/models';
import { DEFAULT_MODEL_FILE_PATH, I_Scene } from './index.api';
import { Subject } from 'rxjs';
import { SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders';
import { getBestCameraPosition } from './utils';

/**
 * @description 场景类
 * @date 01/06/2023
 * @export
 * @class SceneService
 * @implements {I_Scene}
 */
export class SceneService implements I_Scene {
  engine: Engine;
  scene: Scene;
  importModel$: Subject<Partial<{ loaded: number; total: number; complete: boolean }>> = new Subject();
  currentViewModelName: E_Models | null = null;
  constructor(canvas: HTMLCanvasElement, isDefaultScene: boolean) {
    // 创建默认场景,带一个灯光
    if (isDefaultScene) {
      const { engine, scene } = createDefaultScene(canvas);
      this.engine = engine;
      this.scene = scene;
      return;
    }
    // 创建纯净场景
    this.engine = createEngine(canvas);
    this.scene = createScene(this.engine);
  }

  /**
   * @description 导入模型
   * @date 01/06/2023
   * @param {E_Models} modelName 模型名称
   * @memberof SceneService
   */
  public async importModel(modelName: E_Models) {
    // 清空场景
    await this.clearScene();
    // 加载模型
    await this.loadModel(modelName);
    // 将当前模型名称改为传入模型名称
    this.currentViewModelName = modelName;
    // 导入完成
    this.importModel$.next({ complete: true });
    // 移动摄像头到最佳位置
    getBestCameraPosition(this.scene);
  }

  /**
   * @description 加载模型
   * @date 01/06/2023
   * @param {E_Models} modelName 模型名称
   * @memberof SceneService
   */
  public async loadModel(modelName: E_Models) {
    await SceneLoader.ImportMeshAsync('', DEFAULT_MODEL_FILE_PATH, modelName, this.scene, (event) => {
      this.importModel$.next({
        loaded: event.loaded,
        total: event.total,
      });
    });
    // 如果有动画先停止所有动画
    this.scene.animationGroups.forEach((animation) => animation.pause());
  }

  /**
   * @description 销毁场景中所有mesh及其动画
   * @date 06/06/2023
   * @memberof SceneService
   */
  public clearScene() {
    return new Promise<void>((resolve) => {
      while (this.scene.meshes.length > 0 || this.scene.animationGroups.length > 0) {
        this.scene.meshes[0]?.dispose();
        this.scene.animationGroups[0]?.dispose();
      }
      resolve();
    });
  }
}
