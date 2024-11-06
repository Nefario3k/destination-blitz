<template>
  <section class="noTransition page_main_section">
    <section
      style="grid-gap: 0"
      class="auth__section align_auto min-h-screen relative overflow-hidden"
    >
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
          <form autocomplete="new-password" class="py-[24px]" @submit.prevent="register">
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
                  required
                  v-model="formData.full_name"
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
                  required
                  v-model="formData.email"
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
                    required
                    v-model="formData.password"
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
                  :disabled="disabledBtn"
                  :loading="isLoading"
                  type="submit"
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
const { $globalEmit, $commitToLocalStorage } = useNuxtApp();
const togglePassword = ref(false);
const formData = ref({
  full_name: "",
  email: "",
  password: "",
});
const disabledBtn = computed(() => {
  let val = false;

  Object.entries(formData.value).forEach(([key, value]) => {
    if (!value) val = true;
  });
  if (isLoading.value) val = true;
  return val;
});
const isLoading = ref(false);
const loading = ref(0);
const maxTimer = ref(25);
const interval = ref(null);
const register = () => {
  if (disabledBtn.value)
    return $globalEmit("info", {
      prop: "Please fill out the form",
    });
  let allUsersArray = [];
  const allUsers = localStorage.getItem("allUsersArray");
  if (allUsers) {
    allUsersArray = JSON.parse(allUsers);
    const dd = allUsersArray.filter((element: any) => {
      return element.email === formData.value.email;
    });
    if (dd.length)
      return $globalEmit("error", {
        prop: "Email already in use!",
        header: "Account registration",
      });
  }
  allUsersArray.push(formData.value);
  $commitToLocalStorage("allUsersArray", JSON.stringify(allUsersArray));
  $commitToLocalStorage("user", JSON.stringify(formData.value));

  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    $globalEmit("success", { prop: "Account created successfully!", header: "New user" });
    navigateTo("/");
  }, 5000);
};
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
