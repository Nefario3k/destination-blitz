<template>
  <section class="noTransition page_main_section">
    <section style="grid-gap: 0" class="auth__section align_auto min-h-screen relative">
      <div
        class="overlflow-hidden h-screen imageWrapper sticky top-0 bottom-0 max-w-[35%] flex justify-center preventDefaultTransition hidden_md"
      >
        <img
          class="h-full w-full object-left-top object-cover"
          src="/images/login.jpg"
          alt="login"
        />
        <div class="absolute top-0 left-0 w-full h-full bg-[#09001b38]"></div>
        <header
          class="h-mc minh-mc topInfoHeader max-w-[412px] mx-auto w-full absolute top-[76px]"
        >
          <div class="text-center">
            <NuxtLink class="font-lobster text-dark text-[44px]" to="/">
              Destination Blitz
            </NuxtLink>
            <p class="text-dark text-lg font-rhd mt-[14px]">
              Travel is the only purchase that enriches you in ways beyond material wealth
            </p>
          </div>
        </header>
      </div>
      <section
        style="grid-gap: 0 !important"
        class="transrightBasic justify_auto min-h-[inherit]"
      >
        <section class="auth__body px-[16px] max-w-[50.1rem] mx-auto flex_center w-full">
          <form autocomplete="new-password" class="py-[24px]">
            <VRow>
              <VCol :cols="12" class="mb-p-[12px]">
                <div class="w-full">
                  <h1
                    class="sm:text-[2.8rem] text-p font-semibold font-Lora mb-[5px] linear__background clip__background max-w-max"
                  >
                    <span>One step away from your desired weekend</span>
                  </h1>
                  <h3 class="sm:text-sm text-xs text-dark-2 font-medium mb-[36px]">
                    Create your account to begin
                  </h3>
                </div>
              </VCol>
              <!-- reg-full-name -->
              <VCol :cols="12" class="">
                <label
                  for="reg-full-name"
                  class="text-sm text-dark-2 inline-block mb-[6px]"
                >
                  Full Name
                </label>
                <input
                  style="height: 4rem"
                  class="bg-main-3"
                  autocomplete="new-password"
                  id="reg-full-name"
                  type="text"
                  placeholder=""
                />
              </VCol>
              <!-- reg-work-email-address -->
              <VCol :cols="12" class="">
                <label
                  for="reg-work-email-address"
                  class="text-sm text-dark-2 inline-block mb-[6px]"
                >
                  Email
                </label>
                <input
                  style="height: 4rem"
                  class="bg-main-3"
                  autocomplete="new-password"
                  id="reg-work-email-address"
                  type="email"
                  placeholder=""
                />
              </VCol>
              <!-- reg-password -->
              <VCol :cols="12" class="">
                <label
                  for="reg-password"
                  class="text-sm text-dark-2 inline-block mb-[6px]"
                >
                  Password
                </label>
                <div class="relative">
                  <input
                    style="height: 4rem; padding-right: 36px"
                    class="bg-main-3"
                    id="reg-password"
                    :type="!togglePassword ? 'password' : 'text'"
                    placeholder=""
                  />
                  <label
                    @click="togglePassword = !togglePassword"
                    for="log-password"
                    class="mb-0 max-w-max absolute top-[50%] right-[12px] max-h-max translate-y-[-50%] cursor-pointer"
                  >
                    <SvgEye />
                  </label>
                </div>
              </VCol>
              <!-- btn -->
              <VCol :cols="12" class="">
                <BaseButton
                  :elevation="1"
                  class="linear__background"
                  height="4.5rem"
                  width="100%"
                  color="var(--bg_color6)"
                  text="Create Account"
                  :text-style="{
                    fontSize: 'var(--text_sm)',
                  }"
                  @click="startInterval()"
                />
              </VCol>
              <!-- or -->
              <VCol :cols="12" class="">
                <div class="or w-full max-w-[20rem] flex items-center mx-auto gap-[18px]">
                  <div class="h-[1px] bg-main-2 flex-auto"></div>
                  <span class="text-md text-black flex-none">Or</span>
                  <div class="h-[1px] bg-main-2 flex-auto"></div>
                </div>
              </VCol>
              <!-- reg -->
              <VCol :cols="12" class="mt-[12px]">
                <p class="text-center text-md font-medium">
                  Already have an account?
                  <NuxtLink class="text-dark-7" to="/auth/login">Sign In</NuxtLink>
                </p>
              </VCol>
            </VRow>
          </form>
        </section>
      </section>
    </section>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "auth",
  // auth: {
  //   unauthenticatedOnly: true,
  //   navigateAuthenticatedTo: "/",
  // },
});
const { $globalEmit } = useNuxtApp();
const togglePassword = ref(false);
const isLoading = ref(true);
const loading = ref(0);
const maxTimer = ref(25);
const interval = ref(null);
const startInterval = () => {};
useSeoMeta({
  title: "Register - Destination Blitz",
  ogTitle: "Register - Destination Blitz",
});

useHead({
  title: "Register - Destination Blitz",
  meta: [
    {
      hid: "og:title",
      property: "og:title",
      content: "Register - Destination Blitz",
    },
  ],
});
</script>

<style></style>
