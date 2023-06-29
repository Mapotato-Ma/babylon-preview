<template>
  <div class="model-list">
    <v-btn
      :selected="modelListProps.currentViewModelName === value"
      :title="name"
      v-for="{ value, name } in modelListData"
      :key="value"
      @click="$emit('model-selected-change', value)"
      class="bg-indigo-accent-2 text-white"
    >
      {{ name }}
    </v-btn>
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
  top: 1vh;
  left: 1vh;
  width: 300pt;
  display: grid;
  gap: 10px;
  padding: 20px;
  overflow: auto;
  z-index: 1;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  background-color: rgba(92, 107, 192, 0.4);
  border-radius: 5px;
  backdrop-filter: blur(8px);
}
</style>
