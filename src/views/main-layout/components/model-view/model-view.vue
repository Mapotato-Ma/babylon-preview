<template>
  <div class="model-preview" ref="outBox">
    <!-- 进度指示条 -->
    <v-progress-linear
      bg-color="indigo-accent-1"
      color="indigo-accent-2"
      width="80%"
      rounded
      v-model="process"
      height="25"
      v-if="!complete"
    >
      <strong class="text-white">{{ process }}%</strong>
    </v-progress-linear>
    <!-- 动画面板 -->
    <div class="mp-animation" v-if="animationGroups">
      <AnimationComponent :animation-groups="animationGroups" />
    </div>
    <canvas v-resize="onResize" ref="babylonRenderCanvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { SceneService } from '@/scene';
import { E_Models } from '@/models';
import { AnimationComponent } from './components';
import { Subscription } from 'rxjs';
const scene = ref<SceneService | undefined>();
const props = defineProps<{ modelName: E_Models }>();

// 动画组
const animationGroups = computed(() => scene.value?.scene.animationGroups);

onMounted(async () => {
  onResize();
});

// 场景宽高
const [width, height] = [ref<number>(0), ref<number>(0)];
const outBox = ref<HTMLElement | undefined>();
const onResize = () => {
  const { width: rectWidth, height: rectHeight } = outBox.value?.getBoundingClientRect() ?? { width: 800, height: 800 };
  [width.value, height.value] = [rectWidth, rectHeight];
  scene.value?.engine.resize();
};

onMounted(() => {
  initScene();
});

const babylonRenderCanvas = ref<HTMLCanvasElement | undefined>();
// 加载进度相关
const [total, loaded, complete] = [ref<number>(0), ref<number>(0), ref<boolean>(false)];
const process = computed(() => Math.ceil((loaded.value / total.value) * 100));
// 加载订阅
const loadSubScription = ref<Subscription>();
const initScene = async () => {
  if (babylonRenderCanvas.value) {
    // 创建场景实例
    scene.value = new SceneService(babylonRenderCanvas.value, true);
    // 订阅加载进度
    loadSubScription.value = scene.value.importModel$.subscribe((v) => {
      v.loaded && (loaded.value = v.loaded);
      v.total && (total.value = v.total);
      complete.value = v.complete ?? false;
    });
    // 加载初始化模型
    await scene.value.importModel(props.modelName);
  }
};

onUnmounted(() => {
  // 卸载时取消订阅
  loadSubScription.value?.unsubscribe();
});

/**
 * 模型切换加载
 */
const modelNameWatcher = watch(
  () => props.modelName,
  (newModelName) => {
    if (newModelName !== scene.value?.currentViewModelName) {
      newModelName && scene.value?.importModel(newModelName);
    }
  },
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
  border-left: none;
  overflow: hidden;

  .v-progress-linear {
    position: absolute;
    width: 80%;
    height: 50px;
    top: 50% !important;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .mp-animation {
    position: absolute;
    right: 0;
  }

  canvas {
    outline: none;
  }
}
</style>
