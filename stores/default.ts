import defaultVals from "~/utils/defaultVals";


interface AccountInfoState { }

interface AppResourceState {
  isMapLoading: boolean;
  map: any | null;
  locations: Array<Locations>;
  routeLegs: UserLeg;
  apiBase: string;
}

interface RootState {
  account: AccountInfoState;
  appResource: AppResourceState;
}

const getDefaultState = (): RootState => ({
  account: getAccountInfoState(),
  appResource: getAppResourceState(),
});

const getAccountInfoState = (): AccountInfoState => ({
});

const getAppResourceState = (): AppResourceState => ({
  isMapLoading: false,
  map: null,
  locations: [
    { id: Math.random(), ...defaultVals.defaultLocation },
    { id: Math.random(), ...defaultVals.defaultLocation },
  ],
  routeLegs: {
    metrics: [],
    names: [],
  },
  apiBase: useRuntimeConfig().public.apiBase,
});

export { getDefaultState, getAccountInfoState, getAppResourceState };