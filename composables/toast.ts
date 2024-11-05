// composables/appToast.ts
import { ref } from "vue";

export function toast() {
  const toast_duration = ref(3000);
  const permanent = ref(false);
  const reloadData = ref(false);
  const tableLoader = ref(false);
  const searchContents = ref(false);
  const loading = ref(false);
  const errors = ref<string | null>(null);
  const errorsObj = ref<Record<string, any>>({});

  const { emit } = useEventBus();
  const nuxtApp = useNuxtApp();

  function emitShowToastEvent(toastOptions: Record<string, any>) {
    emit("show-toast", { duration: toast_duration, content: toastOptions });
  }

  function showError(res: string | null, head: string | null = null) {
    const toastOptions = {
      absolute: false,
      border: false,
      svg: true,
      header: head || "An Error Occured",
      subtext: res || "Seems something went wrong!",
      headerColor: "#fff",
      subtextColor: "#fff",
      svgStroke: "#f00",
      svgType: "danger",
      svgColor: "#fff",
      color: "#f00",
    };

    emitShowToastEvent(toastOptions);
    permanent.value = false;
    tableLoader.value = false;
    loading.value = false;
    reloadData.value = false;
    searchContents.value = false;
    emit("loading-animation-finish"); // You can also emit an event for loading animation finish
  }

  function showSuccess(res: string, head: string | null = null) {
    // const toastOptions = {
    //   header: head || "Success",
    //   subtext: res || "Action carried out successfully",
    //   headerColor: "#FFFFFF",
    //   subtextColor: "#E0D7DE",
    //   svg: true,
    //   svgStroke: "#34C759",
    //   svgType: "check",
    //   color: "#201A1E",
    // };
    const toastOptions = {
      header: head || "Success",
      subtext: res || "Action carried out successfully",
      headerColor: "#101828",
      subtextColor: "#344054",
      svg: true,
      svgStroke: "#079455",
      svgType: "check",
      color: "#FFFFFF",
      borderColor: "#D0D5DD",
    };

    emitShowToastEvent(toastOptions);
    emit("loading-animation-finish");
  }

  function showInfo(res: string, head: string | null = null) {
    const toastOptions = {
      header: head || "Warning",
      subtext: res || "Something is wrong with your action",
      headerColor: "#fff",
      subtextColor: "#fff",
      svg: true,
      svgColor: "#fff",
      borderColor: "#cacaca",
      svgType: "info",
      color: "linear-gradient(90deg, #402983 0%, #3a71b4 47%, #d97032 100%)",
    };

    emitShowToastEvent(toastOptions);
    emit("loading-animation-finish");
  }

  function showTableLoader() {
    tableLoader.value = !tableLoader.value;
  }

  function catchError(err: any, head: string | null = null) {
    let message: string | null = null;
    if (typeof err === "string") {
      message = err;
    } else if (err?.response?._data?.message) {
      message = err.response._data.message;
      if (err.response._data?.errors) {
        errorsObj.value = err.response._data.errors;
      }
    } else if (err?.response?.data?.message) {
      message = err.response.data.message;
      if (err.response.data?.errors) {
        errorsObj.value = err.response.data.errors;
      }
    } else if (err?.response?.message) {
      message = err.response.message;
    } else {
      message = err.message;
    }

    if (message && message.toLowerCase().includes("network error")) {
      showInfo(message, "Connection error");
    } else if (message && message.toLowerCase().includes("failed to")) {
      showInfo(message, head);
    } else {
      showError(message, head);
    }

    errors.value = message;
    loading.value = false;
  }

  return {
    permanent,
    reloadData,
    tableLoader,
    searchContents,
    loading,
    errors,
    errorsObj,
    showError,
    showSuccess,
    showInfo,
    showTableLoader,
    catchError,
  };
}
