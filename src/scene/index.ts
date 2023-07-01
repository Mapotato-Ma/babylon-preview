import { Engine, GizmoManager, Scene, TransformNode } from '@babylonjs/core';
import { createDefaultScene, createEngine, createScene } from '@/creator';
import { E_Models } from '@/models';
import { generateModelFilePathByModelName, I_Scene } from './index.api';
import { Subject } from 'rxjs';
import { SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders';

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
    // 重新生成摄像机与环境
    this.scene.createDefaultCamera(true, true, true);
    this.scene.createDefaultEnvironment();
  }

  /**
   * @description 加载模型
   * @date 01/06/2023
   * @param {E_Models} modelName 模型名称
   * @memberof SceneService
   */
  public async loadModel(modelName: E_Models) {
    // 解析并导入glb模型文件
    await SceneLoader.ImportMeshAsync(
      '',
      generateModelFilePathByModelName(modelName),
      undefined,
      this.scene,
      (event) => {
        this.importModel$.next({
          loaded: event.loaded,
          total: event.total,
        });
      },
    );
    // this.registerControl();
    // 如果有动画先停止所有动画
    this.scene.animationGroups.forEach((animation) => animation.pause());
  }

  /**
   * @description 销毁场景中所有mesh及其动画
   * @date 06/06/2023
   * @memberof SceneService
   */
  public async clearScene() {
    return new Promise<void>((resolve) => {
      while (this.scene.meshes.length > 0 || this.scene.animationGroups.length > 0) {
        this.scene.meshes[0]?.dispose();
        this.scene.animationGroups[0]?.dispose();
      }
      resolve();
    });
  }

  /**
   * @description 为每一个模型零件创建坐标系
   * @author Mapotato
   * @date 28/06/2023
   * @memberof SceneService
   */
  public registerControl() {
    const gizmoManager = new GizmoManager(this.scene);
    // gizmoManager.attachableNodes = [];
    this.scene.meshes.forEach((mesh) => {
      // // 创建一个Node对象
      // const node = new TransformNode(mesh.name + '_node', this.scene);

      // // 将Mesh对象的位置、缩放和旋转信息应用到Node对象中
      // node.position = mesh.position.clone();
      // node.scaling = mesh.scaling.clone();
      // if (mesh.rotationQuaternion) {
      //   node.rotationQuaternion = mesh.rotationQuaternion.clone();
      // }
      // // 将Node对象添加到GizmoManager中
      // gizmoManager.attachableNodes?.push(node);

      const controller = new TransformNode(mesh.name + '_controller', this.scene);
      // 将Mesh对象的位置、缩放和旋转信息应用到Node对象中
      controller.position = mesh.position.clone();
      controller.scaling = mesh.scaling.clone();
      if (mesh.rotationQuaternion) {
        controller.rotationQuaternion = mesh.rotationQuaternion.clone();
      }
      mesh.parent = controller;
    });

    this.scene.onPointerDown = function (_, pickResult) {
      if (pickResult.hit && pickResult.pickedMesh) {
        console.log('%c |→_→| mesh |←_←| ', 'font-size: 18px', pickResult.pickedMesh);
        // 显示选中mesh的控制器
        // const controller = pickResult.pickedMesh.parent;
        // if (controller) {
        //   controller.isVisible = true;
        //   // 操纵mesh
        //   controller.scaling.x += 0.1;
        // }
        gizmoManager.attachToNode(pickResult.pickedMesh!.parent);
      }
    };

    gizmoManager.positionGizmoEnabled = true;
    // gizmoManager.rotationGizmoEnabled = true;
    // gizmoManager.scaleGizmoEnabled = true;

    // const gizmoManager = new GizmoManager(this.scene);
    // gizmoManager.positionGizmoEnabled = true;
    // this.scene.onPointerDown = (_, p) => {
    //   if (p.hit) {
    //     console.log(p.pickedMesh);
    //     gizmoManager.attachToMesh(p.pickedMesh);
    //   }
    // };

    // const gizmoManager = new GizmoManager(this.scene);
    // gizmoManager.positionGizmoEnabled = true;
    // gizmoManager.rotationGizmoEnabled = true;
    // gizmoManager.scaleGizmoEnabled = true;
    // gizmoManager.attachableMeshes = [this.scene.meshes[1]];
  }
}
