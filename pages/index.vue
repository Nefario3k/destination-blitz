<template>
  <div v-if="$getUser()?.full_name">
    <ClientOnly>
      <Planner />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const { $getUser } = useNuxtApp();
onMounted(() => {
  if (!$getUser()?.full_name) return navigateTo("/auth/login");
});
</script>

<style lang="scss" scoped></style>
