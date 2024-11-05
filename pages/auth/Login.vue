<template>
  <section class="noTransition page_main_section">
    <section style="grid-gap: 0" class="auth__section align_auto min-h-screen relative">
      <div
        class="overlflow-hidden h-screen imageWrapper sticky top-0 bottom-0 max-w-[35%] preventDefaultTransition flex justify-center hidden_md"
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
              <VCol :cols="12" class="mb-[12px]">
                <div class="w-full">
                  <h1
                    class="sm:text-[2.8rem] text-p font-semibold font-Lora mb-[5px] linear__background clip__background max-w-max"
                  >
                    <span>Welcome Back</span>
                  </h1>
                  <h3 class="sm:text-sm text-xs text-dark-2 font-medium mb-[36px]">
                    Log into your account to continue
                  </h3>
                </div>
              </VCol>
              <!-- log-email-address -->
              <VCol :cols="12" class="">
                <label
                  for="log-email-address"
                  class="text-sm text-dark-2 inline-block mb-[6px]"
                >
                  Email Address
                </label>
                <input
                  style="height: 4rem"
                  class="bg-main-3"
                  id="log-email-address"
                  type="email"
                  placeholder=""
                />
              </VCol>
              <!-- log-password -->
              <VCol :cols="12" class="">
                <label
                  for="log-password"
                  class="text-sm text-dark-2 inline-block mb-[6px]"
                >
                  Password
                </label>
                <div class="relative">
                  <input
                    style="height: 4rem; padding-right: 36px"
                    class="bg-main-3"
                    id="log-password"
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
                  text="Log in"
                  :text-style="{
                    fontSize: 'var(--text_sm)',
                  }"
                  to="/"
                  @click="
                    $globalEmit('success', {
                      prop: 'Logged in successfully!',
                      header: 'Access granted',
                    })
                  "
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
                  Don't have an account?
                  <NuxtLink class="text-dark-7" to="/auth/register">Sign Up</NuxtLink>
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
const togglePassword = ref(false);

useSeoMeta({
  title: "Login - Destination Blitz",
  ogTitle: "Login - Destination Blitz",
});

useHead({
  title: "Login - Destination Blitz",
  meta: [
    {
      hid: "og:title",
      property: "og:title",
      content: "Login - Destination Blitz",
    },
  ],
});
</script>

<style></style>
