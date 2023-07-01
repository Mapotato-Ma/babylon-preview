<template>
  <div class="model-list" v-grass>
    <v-btn
      :selected="modelListProps.currentViewModelName === value"
      :title="name"
      v-for="{ value, name } in modelListData"
      :key="value"
      rounded="0"
      elevation="12"
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
  min-width: 10vw;
  display: grid;
  gap: 10px;
  padding: 10px;
  z-index: 1;
  font-weight: bolder;
}
</style>
