<template>
  <div class="animation">
    <div class="a-item" v-for="(animation, index) in props.animationGroups" :key="animation.name">
      <div class="a-label">{{ `动画${numberToChinese(index + 1)}` }}</div>
      <span class="a-name">{{ animation.name }}</span>
      <v-btn color="#283593" @click="playOrPause(animation)">
        {{ animation.isPlaying ? '暂停' : '启动' }}
      </v-btn>
    </div>
    <div class="a-empty" v-if="!props.animationGroups[0]">此模型暂无动画</div>
  </div>
</template>

<script lang="ts" setup>
import { AnimationGroup } from '@babylonjs/core';
import { getCurrentInstance, onMounted } from 'vue';
import { VBtn } from 'vuetify/components';
const props = defineProps<{ animationGroups: Array<AnimationGroup> }>();
const { proxy } = getCurrentInstance()!;

onMounted(() => {
  proxy?.$forceUpdate();
});

const playOrPause = (animation: AnimationGroup) => {
  if (animation.isPlaying) {
    animation.pause();
  } else {
    animation.play(true);
  }
  proxy?.$forceUpdate();
};

const numberToChinese = (num: number): string =>
  String(num)
    .split('')
    .reverse()
    .map((digit, index, arr) => {
      const unit = ['', '十', '百', '千', '万', '亿'][index];
      const char = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'][Number(digit)];
      return char === '零' && unit !== '' && arr[index - 1] !== '0' ? char : char + unit;
    })
    .reverse()
    .join('');
</script>

<style lang="less" scoped>
.animation {
  display: flex;
  padding: 15px;
  gap: 15px;
  flex-direction: column;

  .a-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
    align-items: center;
    background-color: #37373d;
    border-top: 4px solid #2b79d7;
    padding: 10px;
    div {
      color: #2b79d7;
      font-size: 12px;
      font-weight: bolder;
      grid-row: 1;
      grid-column: 1;
    }
    span {
      font-size: 16px;
      grid-row: 2;
    }
  }
}
</style>
