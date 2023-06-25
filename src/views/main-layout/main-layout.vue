<template>
  <div class="layout">
    <div class="l-model-preview">
      <ModelListComponent
        :current-view-model-name="currentViewModelName"
        @model-selected-change="modelSelectedChange"
      />
      <ModelViewComponent :model-name="currentViewModelName" />
    </div>
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
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #1f1f1f;
  .l-model-preview {
    flex: auto;
  }
}
</style>
