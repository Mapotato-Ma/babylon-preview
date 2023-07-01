<template>
  <div class="animation">
    <div class="a-item text-white" v-grass v-for="animation in props.animationGroups" :key="animation.name">
      <div class="bg-indigo-accent-2 text-white">
        {{ animation.name }}
      </div>
      <v-btn block class="bg-indigo-accent-2 text-white" rounded="0" elevation="12" @click="playOrPause(animation)">
        <template v-slot:prepend>
          <v-icon icon="$pause" v-if="animation.isPlaying" />
          <v-icon icon="$play" v-else />
        </template>
        {{ animation.isPlaying ? '停止动画' : '启动动画' }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AnimationGroup } from '@babylonjs/core';
import { getCurrentInstance, onMounted } from 'vue';
const props = defineProps<{ animationGroups: Array<AnimationGroup> }>();
const { proxy } = getCurrentInstance()!;

onMounted(() => {
  proxy?.$forceUpdate();
});

const playOrPause = (animation: AnimationGroup) => {
  if (animation.isPlaying) {
    animation.pause();
  } else {
    props.animationGroups.forEach((animation) => animation.isPlaying && animation.pause());
    animation.play(true);
  }
  proxy?.$forceUpdate();
};
</script>

<style lang="less" scoped>
.animation {
  display: flex;
  padding: 15px;
  gap: 5px;
  flex-direction: column;

  .a-item {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px;
    flex-direction: column;
    div {
      min-width: 5vw;
      height: 20px;
      padding: 10px;
      padding-left: 5px;
      font-size: 12px;
      font-weight: bolder;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
}
</style>
