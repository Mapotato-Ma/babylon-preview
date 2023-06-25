<template>
  <div class="model-list">
    <div
      class="ml-item"
      :class="{ 'ml-item-selected': modelListProps.currentViewModelName === value }"
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
const modelListProps = defineProps<{
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
  position: absolute;
  top: 0;
  left: 0;
  width: 5vw;
  height: 100%;
  display: grid;
  gap: 10px;
  padding: 20px;
  overflow: auto;
  z-index: 1;
  clip-path: circle(5% at 0 50%);
  transition: clip-path 233ms;
  background-color: rgba(34, 29, 29, 0.161);

  &:hover {
    clip-path: circle(200% at 0 50%);
  }

  .ml-item {
    cursor: pointer;
    flex: 1;
    display: grid;
    place-content: center;
    color: #fff;
    border-radius: 10px;
    background: #003399;
    transition: all 233ms;
    word-break: break-all;

    &.ml-item-selected {
      background-color: #cc0033;
      color: #fff;
      border-color: #2b79d7;
      box-shadow: inset 3px 3px 10px 3px #2e2e2e;
    }
  }
}
</style>
