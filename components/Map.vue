<template>
  <div class="relative h-full min-h-screen">
    <div id="map" class="w-full h-full min-h-screen rounded"></div>

    <!-- isMapLoading Overlay -->
    <div
      v-if="isMapLoading"
      class="absolute inset-0 bg-[var(--scrim)] bg-opacity-75 flex_center z-[1000] flex-col"
    >
      <BaseSpinner color="var(--text_light)" />
      <p class="font-rhd text-dark">Loading map...</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// state management
const appResourceStore = useAppResourceStore();
const isMapLoading = computed(() => appResourceStore.isMapLoading);
</script>

<style></style>
