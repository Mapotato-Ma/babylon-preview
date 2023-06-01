import { AbstractMesh, Engine, Scene } from '@babylonjs/core';
import { createDefaultScene, createEngine, createScene } from '@/creator';
import { E_Models } from '@/models';
import { DEFAULT_MODEL_FILE_PATH, I_Scene } from './index.api';
import { Subject } from 'rxjs';
import { SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders';
export class SceneService implements I_Scene {
  engine: Engine;
  scene: Scene;
  meshGroup?: Record<E_Models, AbstractMesh[]>;
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
   * 将模型实例缓存起来，一般在模型加载完毕后调用
   * @param modelName 模型名字
   * @param meshes 场景实例
   */
  public insertMeshes(modelName: E_Models, meshes: AbstractMesh[]) {
    meshes.forEach((mesh) => (mesh.metadata = { modelName }));
    if (this.meshGroup) {
      this.meshGroup[modelName] = meshes;
    } else {
      this.meshGroup = Object.create({ [modelName]: meshes });
    }
  }

  public async importModel(modelName: E_Models) {
    if (this.meshGroup?.[modelName]) {
      this.setDisableMeshes();
      this.setEnableMeshes(modelName);
      this.currentViewModelName = modelName;
      return;
    }
    this.setDisableMeshes();
    this.currentViewModelName = modelName;
    await this.loadModel(modelName);
  }

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
    this.importModel$.next({
      complete: true,
    });
  }

  private setEnableMeshes(modelName: E_Models) {
    if (modelName) {
      this.meshGroup?.[modelName]?.forEach((mesh) => mesh.setEnabled(true));
    }
  }

  private setDisableMeshes(modelName = this.currentViewModelName) {
    if (modelName) {
      this.meshGroup?.[modelName]?.forEach((mesh) => mesh.setEnabled(false));
    }
  }
}
