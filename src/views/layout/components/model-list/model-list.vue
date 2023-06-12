<template>
  <div class="model-list">
    <div
      class="ml-item"
      :class="{ 'ml-item-selected': currentViewModelName === value }"
      :title="name"
      v-for="{ value, name } in modelListData"
      :key="value"
      @click="$emit('model-selected-change', value)"
    >
      {{ name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { E_Models } from '@/models';
import { onMounted } from 'vue';
const { currentViewModelName } = defineProps<{
  currentViewModelName?: E_Models;
}>();
const emits = defineEmits<{
  (e: 'model-selected-change', modelName: E_Models): void;
}>();

const modelListData = Object.entries(E_Models).map(([name, value]) => ({ name, value }));

onMounted(() => emits('model-selected-change', modelListData[0].value));
</script>

<style lang="less" scoped>
.model-list {
  width: 100%;
  height: 100%;
  display: grid;
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
    transition: box-shadow 233ms;

    &.ml-item-selected {
      background-color: #37373d;
      color: #fff;
      border-color: #2b79d7;
    }
  }
}
</style>
