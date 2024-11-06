<template>
  <section class="page_main_section preventDefaultTransition">
    <section style="grid-gap: 0" class="align_auto min-h-screen">
      <!-- Locations Control -->
      <Controls
        :style="{ zIndex }"
        class="overlflow-hidden h-screen max-w-[350px] overflow-auto responsiveControl"
      />
      <BaseButton
        class="linear__background fixed top-[12px] right-[12px] z-[1000] visible_sm"
        style="padding: 0 !important"
        width="5rem"
        min-width="5rem"
        height="5rem"
        min-height="5rem"
        @click="appResourceStore.zIndex = 1001"
      >
        <svg
          width="30"
          hight="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#ffffff"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              opacity="0.15"
              d="M18 9.22222C18 12.6587 15.3137 15.4444 12 17C8.68629 15.4444 6 12.6587 6 9.22222C6 5.78578 8.68629 3 12 3C15.3137 3 18 5.78578 18 9.22222Z"
              fill="#fff"
            ></path>
            <path
              d="M4.20404 15C3.43827 15.5883 3 16.2714 3 17C3 19.2091 7.02944 21 12 21C16.9706 21 21 19.2091 21 17C21 16.2714 20.5617 15.5883 19.796 15M12 6.5V11.5M9.5 9H14.5M18 9.22222C18 12.6587 15.3137 15.4444 12 17C8.68629 15.4444 6 12.6587 6 9.22222C6 5.78578 8.68629 3 12 3C15.3137 3 18 5.78578 18 9.22222Z"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </BaseButton>
      <!-- Map Container -->
      <Map />
    </section>
  </section>
</template>
<script setup lang="ts">
import { computed } from "vue";
// state management
const appResourceStore = useAppResourceStore();
const zIndex = computed(() => appResourceStore.zIndex);
</script>

<style lang="scss" scoped></style>
