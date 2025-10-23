<script setup>
import Send from '@/components/send';
import SoleTransfer from '@/components/soleTransfer';
import InsertComponent from '@/components/insert';
import { addObserverHook, getItem, provideSettingStyle, provideBrand } from '@/shared';

const show = ref(false);
const unTextChangeObserver = ref(null);
const componentKey = ref(0);

const targetSelector = ref('._ak1r div[tabindex="-1"]');

const textChangeOb = () => {
  unTextChangeObserver?.value?.();
  unTextChangeObserver.value = addObserverHook('textChange', (textContent) => {
    show.value = !!textContent;
  });
};

onMounted(async () => {
  textChangeOb();
  addObserverHook('chatChange', async () => {
    show.value = false;
    componentKey.value++;
    await nextTick();
    textChangeOb();
  });
  addObserverHook('brandChange', async () => {
    console.log('brandChange');
    provideBrand(import.meta.env.VITE_APP_LOGO_URL, import.meta.env.VITE_APP_NAME);
  });

  const setting = await getItem('setting');
  provideSettingStyle(setting);
});

onUnmounted(() => {
  unTextChangeObserver?.value?.();
});
</script>

<template></template>
<!-- <template>
  <send v-if="show" :key="componentKey"/>
  <insert-component
    v-if="show"
    :key="componentKey"
    :component="SoleTransfer"
    :target-selector="targetSelector"
    position="first"
  />
</template> -->

<style scoped></style>
