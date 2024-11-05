
export const useCustomLoadingIndicator = () => {
  const loading = ref(false);
  const start = () => (loading.value = true);
  const finish = () => (loading.value = false);
  return {
    loading,
    start,
    finish
  }
};
