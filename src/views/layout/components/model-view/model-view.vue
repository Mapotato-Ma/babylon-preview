<template>
  <div class="model-preview" ref="outBox">
    <!-- 进度指示条 -->
    <progress v-if="!complete" :max="total" :value="loaded"></progress>
    <canvas ref="babylonRenderCanvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { SceneService } from '@/scene';
import { E_Models } from '@/models';
const scene = ref<SceneService | undefined>();
const props = defineProps<{ modelName?: E_Models }>();

const outBox = ref<HTMLElement | undefined>();
const babylonRenderCanvas = ref<HTMLCanvasElement | undefined>();

// 场景宽高
const [width, height] = [ref<number>(0), ref<number>(0)];

// 加载进度相关
const [total, loaded, complete] = [ref<number>(0), ref<number>(0), ref<boolean>(false)];

onMounted(() => {
  const rect = outBox.value?.getBoundingClientRect() ?? { width: 800, height: 800 };
  [width.value, height.value] = [rect.width, rect.height];
  initScene();
});

const initScene = async () => {
  if (babylonRenderCanvas.value) {
    scene.value = new SceneService(babylonRenderCanvas.value, true);
    scene.value.importModel$.subscribe((v) => {
      v.loaded && (loaded.value = v.loaded);
      v.total && (total.value = v.total);
      v.complete && (complete.value = v.complete);
    });
    if (props.modelName) {
      await scene.value.importModel(props.modelName);
    }
  }
};

const modelNameWatcher = watch(
  () => props.modelName,
  (newModelName) => {
    newModelName && scene.value?.importModel(newModelName);
    console.log('%c |→_→| 场景 |←_←| ', 'font-size: 18px', scene.value);
  }
);

onUnmounted(() => {
  modelNameWatcher();
});
</script>

<style lang="less" scoped>
.model-preview {
  position: relative;
  width: 100%;
  height: 100%;
  border: 20px solid #1f1f1f;
  border-left: none;
  overflow: hidden;
  progress {
    position: absolute;
    width: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  canvas {
    outline: none;
  }
}
</style>
