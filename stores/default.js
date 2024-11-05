// State sections
const getDefaultState = () => ({
  account: getAccountInfoState(),
  appResource: getAppResourceState(),
});

// Individual state getters

const getAccountInfoState = () => ({});

const getAppResourceState = () => ({
  centeredPadding: null,
  oldRouteVal: null,
  productModal: false,
  viewportWidth: 0,
  apiBase: useRuntimeConfig().public.apiBase,
});

export { getDefaultState, getAccountInfoState, getAppResourceState };
