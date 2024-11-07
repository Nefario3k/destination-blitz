<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <StatusToast />
  </div>
</template>
<script setup lang="ts">
const { showSuccess, catchError, showInfo } = toast();
const { on } = useEventBus();
interface EventData {
  prop: any;
  header: string;
}

onMounted(() => {
  on("success", ({ prop, header }: EventData): void => {
    showSuccess(prop, header);
  });
  on("error", ({ prop, header }: EventData): void => {
    catchError(prop, header);
  });
  on("info", ({ prop, header }: EventData): void => {
    showInfo(prop, header);
  });
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 500ms;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
