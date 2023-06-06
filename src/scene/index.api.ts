import { E_Models } from '@/models';
import { Engine, Scene } from '@babylonjs/core';
import { Subject } from 'rxjs';

/**
 * @description 场景定义
 * @author mapf
 * @date 31/05/2023
 * @export
 * @interface I_Scene
 */
export interface I_Scene {
  engine: Engine; // 引擎
  scene: Scene; // 场景
  importModel$: Subject<Partial<{ loaded: number; total: number; complete: boolean }>>;
  currentViewModelName: E_Models | null;
  importModel: (modelName: E_Models) => Promise<void>;
  loadModel: (modelName: E_Models) => Promise<void>;
}

export const DEFAULT_MODEL_FILE_PATH = 'models/';
