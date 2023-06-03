import { AbstractMesh, Engine, Scene } from '@babylonjs/core';
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
  meshGroup: Map<E_Models, AbstractMesh[]> = new Map();
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
    // 开始导入
    this.importModel$.next({ complete: false });
    // 禁用当前模型
    this.setDisableMeshes();
    // 判断是否已经导入过，如果导入过直接启用该模型mesh
    if (this.meshGroup.get(modelName)) {
      this.setEnableMeshes(modelName);
    } else {
      // 加载模型
      await this.loadModel(modelName);
    }
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
    this.insertMeshes(
      modelName,
      this.scene.meshes.filter((mesh) => mesh.isEnabled(false))
    );
  }

  /**
   * 将模型实例缓存起来，一般在模型加载完毕后调用
   * @param modelName 模型名字
   * @param meshes 场景实例
   */
  public insertMeshes(modelName: E_Models, meshes: AbstractMesh[]) {
    meshes.forEach((mesh) => (mesh.metadata = { modelName }));
    this.meshGroup.set(modelName, meshes);
  }

  /**
   * @description 启用模型
   * @date 01/06/2023
   * @public
   * @param {E_Models} modelName
   * @memberof SceneService
   */
  public setEnableMeshes(modelName: E_Models) {
    modelName && this.meshGroup.get(modelName)?.forEach((mesh) => mesh.setEnabled(true));
  }

  /**
   * @description 禁用模型
   * @date 01/06/2023
   * @public
   * @param {(E_Models | null)} [modelName=this.currentViewModelName]
   * @memberof SceneService
   */
  public setDisableMeshes(modelName: E_Models | null = this.currentViewModelName) {
    modelName && this.meshGroup.get(modelName)?.forEach((mesh) => mesh.setEnabled(false));
  }
}
