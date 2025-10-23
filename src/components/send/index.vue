<script setup>
import { addObserverHook, clearByCtrlA, transferInputText } from '@/shared';

const show = ref(false);

onMounted(async () => {
  addObserverHook('beforeSendTranslate', () => {
    show.value = true;
  });
  addObserverHook('afterSendTranslate', () => {
    show.value = false;
  });
});

const handleTranslate = () => {
  clearByCtrlA();
  transferInputText();
};

chrome.runtime.onMessage.addListener((request) => {
  console.log(request);
});
</script>

<template>
  <Teleport to="._ak1r">
    <div class="send-translate">
      <n-spin :show="show">
        <n-button type="info" @click="handleTranslate"> 翻译 </n-button>
      </n-spin>
    </div>
  </Teleport>
</template>

<style scoped>
.send-translate {
  padding: 7px;
  margin-bottom: 12px;
}
</style>
