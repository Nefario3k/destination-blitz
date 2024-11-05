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
const appResourceStore = useAppResourceStore();
interface EventData {
  prop: any;
  header: string;
}

function updateViewportWidth() {
  if (process.client && process.browser) {
    const checkValue = 1306;
    appResourceStore.viewportWidth = window.innerWidth;
    if (appResourceStore.viewportWidth >= checkValue) {
      appResourceStore.centeredPadding =
        Math.round((appResourceStore.viewportWidth - checkValue) / 2) + "px";
    } else appResourceStore.centeredPadding = null;
  }
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
  on("updateCenteredPadding", (): void => {
    updateViewportWidth();
  });
  if (process.client && process.browser) {
    appResourceStore.viewportWidth = window.innerWidth;
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
  }
});
onUnmounted(() => {
  if (process.client && process.browser) {
    window.removeEventListener("resize", updateViewportWidth);
  }
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
