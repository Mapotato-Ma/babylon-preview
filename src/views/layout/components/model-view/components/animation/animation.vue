<template>
  <div class="animation">
    <div class="a-item" v-for="(animation, index) in props.animationGroups" :key="animation.name">
      <span class="a-name">动画{{ index + 1 }}{{ animation.name }}</span>
      <button @click="playOrPause(animation)">{{ animation.isPlaying ? '暂停' : '启动' }}</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AnimationGroup } from '@babylonjs/core';
import { watch } from 'vue';


const props = defineProps<{ animationGroups: Array<AnimationGroup> }>()

const playOrPause = (animation: AnimationGroup) => {
  if (animation.isPlaying) {
    animation.pause();
  } else {
    animation.play(true);
  }
}

props.animationGroups.forEach(animation => {
  watch(() => animation.isPlaying, () => {
    console.log('%c |→_→| playChange |←_←| ', 'font-size: 18px',);
  })
})
</script>

<style lang="less" scoped>
.animation {
  display: flex;
  padding: 15px;
  gap: 15px;
  flex-direction: column;

  .a-item {
    display: flex;
    gap: 15px;
    align-items: center;
  }
}
</style>