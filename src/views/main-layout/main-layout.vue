<template>
  <div class="layout">
    <ModelListComponent :current-view-model-name="currentViewModelName" @model-selected-change="modelSelectedChange" />
    <ModelViewComponent :model-name="currentViewModelName" />
  </div>
</template>

<script lang="ts" setup>
import { E_Models } from '@/models';
import { ref } from 'vue';
import { ModelViewComponent, ModelListComponent } from './components';
const currentViewModelName = ref<E_Models>();
const modelSelectedChange = (modelName: E_Models) => {
  currentViewModelName.value !== modelName && (currentViewModelName.value = modelName);
};
</script>

<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
}
</style>
