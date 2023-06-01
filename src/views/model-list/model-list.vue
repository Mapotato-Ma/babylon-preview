<template>
  <div class="model-list">
    <div
      class="ml-item"
      :class="{ 'ml-item-selected': currentViewModelName === model.value }"
      v-for="model in modelListData"
      :key="model.value"
      @click="$emit('model-selected-change', model.value)"
    >
      {{ `模型${model.name}` }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { E_Models } from '@/models';
const { currentViewModelName } = defineProps<{
  currentViewModelName: E_Models;
}>();
defineEmits<{
  (e: 'model-selected-change', modelName: E_Models): void;
}>();

const modelListData = Object.entries(E_Models).map((k) => ({ name: k[0], value: k[1] }));
</script>

<style lang="less" scoped>
.model-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  overflow: auto;
  .ml-item {
    cursor: pointer;
    flex: 1;
    display: grid;
    place-content: center;
    color: rgba(255, 255, 255, 0.5);
    border: 2px solid;
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
      border: 2px dashed;
    }
  }
  .ml-item-selected {
    background-color: #fff;
    color: rgba(42, 121, 240, 0.827);
  }
}
</style>
