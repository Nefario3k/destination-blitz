<template>
  <VApp>
    <section style="opacity: 1" class="generic__mount__domain">
      <VMain class="main-page-wrapper">
        <BaseOffline />
        <slot />
      </VMain>
    </section>
  </VApp>
</template>
<script setup lang="ts"></script>
