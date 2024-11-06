<template>
  <section class="page_main_section preventDefaultTransition">
    <section style="grid-gap: 0" class="auth__section align_auto min-h-screen relative">
      <!-- Locations Panel -->
      <div class="overlflow-hidden h-screen max-w-[350px] overflow-auto">
        <div class="space-y-4 py-5 w-full px-[16px]">
          <h2 class="text-xl font-bold mb-4">New Trip Planner</h2>

          <!-- Travel Mode Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">Travel Mode</label>
            <select
              :disabled="isLoading"
              v-model="travelMode"
              class="w-full p-2 border rounded"
              @change="updateMapOnCondition()"
            >
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
              <option value="driving">Driving</option>
            </select>
          </div>
          <div v-if="travelMode === 'driving'" class="space-y-2 transInBasic">
            <label for="fuelCost" class="block text-sm font-medium">Fuel Cost</label>
            <input
              id="fuelCost"
              v-model="fuelPrice"
              type="number"
              :disabled="isLoading"
              placeholder="Fuel Cost"
              min="100"
              step="100"
              class="w-full"
            />
          </div>
          <Draggable v-if="updateLocations" v-model="locations" class="space-y-4">
            <template #item="{ item: location }">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <label class="text-sm font-medium">
                    {{
                      getDynamicLocationsIndex(location.id) === 0
                        ? "Start"
                        : getDynamicLocationsIndex(location.id) === locations.length - 1
                        ? "End"
                        : "Stop " + getDynamicLocationsIndex(location.id)
                    }}
                  </label>
                </div>

                <div class="relative">
                  <VMenu
                    :close-on-content-click="false"
                    location="bottom center"
                    :offset="5"
                    transition="slide-y-transition"
                    :disabled="
                      isLoading ? true : location.searchResults.length ? false : true
                    "
                    v-model="location.menu"
                  >
                    <template v-slot:activator="{ props }">
                      <div class="align_auto gap-[5px!important]">
                        <div v-bind="props" class="relative flex_center">
                          <input
                            v-model="location.search"
                            @input="debounceSearch(getDynamicLocationsIndex(location.id))"
                            @click.stop="
                              location.searchResults.length
                                ? (location.menu = true)
                                : (location.menu = false)
                            "
                            :disabled="isLoading"
                            placeholder="Search location..."
                            class="w-full"
                            style="padding-right: 40px"
                            :class="{ 'border-red-500': location.error }"
                          />
                          <div class="absolute max-w-max z-[99999] right-[12px] w-full">
                            <svg
                              width="20"
                              height="20"
                              fill="#a5a5a5"
                              viewBox="0 0 1920 1920"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                <path
                                  d="M600 1440c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240 107.64-240 240-240Zm720 0c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240 107.64-240 240-240ZM600 720c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240 107.64-240 240-240Zm720 0c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240 107.64-240 240-240ZM600 0c132.36 0 240 107.64 240 240S732.36 480 600 480 360 372.36 360 240 467.64 0 600 0Zm720 0c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240S1187.64 0 1320 0Z"
                                  fill-rule="evenodd"
                                ></path>
                              </g>
                            </svg>
                          </div>
                        </div>
                        <BaseButton
                          v-if="locations.length > 2"
                          :disabled="isLoading"
                          :svg="true"
                          style="padding: 0 !important"
                          svgLeft="XMark"
                          max-width="max-content"
                          width="3rem"
                          min-width="3rem"
                          height="3rem"
                          min-height="3rem"
                          svg-class="w-[10px] h-[10px]"
                          svg-stroke="#f00"
                          @click="removeLocation(getDynamicLocationsIndex(location.id))"
                        />
                      </div>
                    </template>

                    <!-- Search Results -->
                    <VList
                      class="dropDownList dropList justify_auto gap-[15px!important]"
                      min-width="221"
                      max-width="318"
                      max-height="180"
                    >
                      <div
                        v-if="location.searchResults.length && !location.isSearching"
                        class="overflow-auto"
                      >
                        <VListItem
                          v-for="result in location.searchResults"
                          :key="result.place_id"
                          :ripple="true"
                          class=""
                          style="
                            min-height: max-content !important;
                            height: max-content !important;
                          "
                          @click="
                            selectLocation(getDynamicLocationsIndex(location.id), result)
                          "
                        >
                          <div class="">
                            <div class="font-medium text-dark-7">{{ result.name }}</div>
                            <div class="font-medium text-xs elipsis-2">
                              {{ result.display_name }}
                            </div>
                            <div class="text-[10px] capital text-dark-11 font-medium">
                              {{ formatPlaceDetails(result) }}
                            </div>
                          </div>
                        </VListItem>
                      </div>
                    </VList>
                  </VMenu>
                </div>

                <!-- Location Error Message -->
                <div v-if="location.error" class="text-red-500 text-sm">
                  {{ location.error }}
                </div>
              </div>
            </template>
          </Draggable>

          <!-- Add Location Button -->
          <Transition name="slide-fade">
            <BaseButton
              v-if="locations.length !== maxDestination"
              :disabled="isLoading"
              :loading="isLoading"
              :elevation="1"
              class="linear__background"
              height="4rem"
              width="100%"
              color="var(--bg_color6)"
              text="Add Stop"
              :text-style="{
                fontSize: 'var(--text_sm)',
              }"
              @click="addLocation"
            />
          </Transition>

          <!-- Route Information -->
          <div v-if="!isLoading" class="mt-4 space-y-4 transInBasic">
            <template v-if="routeLegs.metrics.length > 1">
              <div class="p-4 bg-gray-100 rounded-[8px]">
                <h2 class="text-lg font-bold mb-4 linear__background clip__background">
                  Route breakdown
                </h2>
                <div v-for="(item, index) in routeLegs.names" :key="item + index">
                  <h3 class="font-medium text-sm text-dark-2">{{ item }}</h3>
                  <div
                    v-if="index !== routeLegs.names.length - 1"
                    class="flex items-center pl-[24px] my-3 gap-3"
                  >
                    <svg
                      width="16"
                      height="100"
                      viewBox="0 0 16 233"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.64645 232.354C7.84171 232.549 8.15829 232.549 8.35355 232.354L11.5355 229.172C11.7308 228.976 11.7308 228.66 11.5355 228.464C11.3403 228.269 11.0237 228.269 10.8284 228.464L8 231.293L5.17157 228.464C4.97631 228.269 4.65973 228.269 4.46447 228.464C4.2692 228.66 4.2692 228.976 4.46447 229.172L7.64645 232.354ZM7.5 0V2H8.5V0L7.5 0ZM7.5 6V10H8.5L8.5 6H7.5ZM7.5 14V18H8.5V14H7.5ZM7.5 22L7.5 26H8.5V22H7.5ZM7.5 30L7.5 34H8.5V30H7.5ZM7.5 38L7.5 42H8.5V38H7.5ZM7.5 46L7.5 50H8.5L8.5 46H7.5ZM7.5 54V58H8.5V54H7.5ZM7.5 62V66H8.5L8.5 62H7.5ZM7.5 70V74H8.5V70H7.5ZM7.5 78L7.5 82H8.5V78H7.5ZM7.5 86L7.5 90H8.5V86H7.5ZM7.5 94L7.5 98H8.5V94H7.5ZM7.5 102L7.5 106H8.5V102H7.5ZM7.5 110V114H8.5V110H7.5ZM7.5 118V122H8.5L8.5 118H7.5ZM7.5 126V130H8.5V126H7.5ZM7.5 134V138H8.5L8.5 134H7.5ZM7.5 142V146H8.5V142H7.5ZM7.5 150L7.5 154H8.5V150H7.5ZM7.5 158L7.5 162H8.5V158H7.5ZM7.5 166L7.5 170H8.5V166H7.5ZM7.5 174L7.5 178H8.5V174H7.5ZM7.5 182V186H8.5V182H7.5ZM7.5 190V194H8.5L8.5 190H7.5ZM7.5 198V202H8.5V198H7.5ZM7.5 206L7.5 210H8.5L8.5 206H7.5ZM7.5 214L7.5 218H8.5V214H7.5ZM7.5 222L7.5 226H8.5V222H7.5ZM7.5 230V232H8.5V230H7.5ZM7.29289 232.707C7.68342 233.098 8.31658 233.098 8.70711 232.707L15.0711 226.343C15.4616 225.953 15.4616 225.319 15.0711 224.929C14.6805 224.538 14.0474 224.538 13.6569 224.929L8 230.586L2.34315 224.929C1.95262 224.538 1.31946 224.538 0.928932 224.929C0.538408 225.319 0.538408 225.953 0.928932 226.343L7.29289 232.707ZM7 0V2H9V0L7 0ZM7 6V10H9V6H7ZM7 14V18H9V14H7ZM7 22L7 26H9V22H7ZM7 30L7 34H9V30H7ZM7 38L7 42H9V38H7ZM7 46L7 50H9L9 46H7ZM7 54V58H9V54H7ZM7 62V66H9L9 62H7ZM7 70V74H9V70H7ZM7 78L7 82H9V78H7ZM7 86L7 90H9V86H7ZM7 94L7 98H9V94H7ZM7 102L7 106H9V102H7ZM7 110V114H9V110H7ZM7 118V122H9L9 118H7ZM7 126V130H9V126H7ZM7 134V138H9L9 134H7ZM7 142V146H9V142H7ZM7 150L7 154H9V150H7ZM7 158L7 162H9V158H7ZM7 166L7 170H9V166H7ZM7 174L7 178H9V174H7ZM7 182V186H9V182H7ZM7 190V194H9L9 190H7ZM7 198V202H9V198H7ZM7 206L7 210H9L9 206H7ZM7 214L7 218H9V214H7ZM7 222L7 226H9V222H7ZM7 230V232H9V230H7Z"
                        fill="var(--primary_color)"
                      />
                    </svg>

                    <div>
                      <p class="text-xs linear__background clip__background">
                        <span>
                          {{ formatDistance(routeLegs.metrics[index].distance) }} ({{
                            formatDuration(routeLegs.metrics[index].duration)
                          }})
                        </span>
                      </p>
                      <template v-if="travelMode === 'driving'">
                        <p class="text-xs text-dark-2">
                          <span>
                            {{
                              $formatCurrency(
                                calculateFuelCost(routeLegs.metrics[index].distance)
                              )
                            }}
                            ({{
                              $formatNumber(
                                calculateFuelConsumed(routeLegs.metrics[index].distance)
                              )
                            }}
                            L)
                          </span>
                        </p>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div v-if="routeInfo" class="p-4 bg-gray-100 rounded-[8px]">
              <h2 class="text-lg font-bold mb-4 linear__background clip__background">
                Route Information
              </h2>
              <div class="flex_between gap-[10px]">
                <span class="text-dark-2 block text-sm">Total Distance:</span>
                <p class="text-sm text-dark-2">
                  <span>{{ formatDistance(routeInfo.distance) }}</span>
                </p>
              </div>
              <div class="flex_between gap-[10px]">
                <span class="text-dark-2 block text-sm">Estimated Time:</span>
                <p class="text-sm text-dark-2">
                  <span>{{ formatDuration(routeInfo.duration) }}</span>
                </p>
              </div>
              <template v-if="travelMode === 'driving'">
                <div class="flex_between gap-[10px]">
                  <span class="text-dark-2 block text-sm">Estimated Fuel:</span>
                  <p class="text-sm text-dark-2">
                    <span
                      >{{
                        $formatNumber(calculateFuelConsumed(routeInfo.distance))
                      }}
                      Liters</span
                    >
                  </p>
                </div>
                <div class="flex_between gap-[10px]">
                  <span class="text-dark-2 block text-sm">Fuel Cost:</span>
                  <p class="text-sm text-dark-2">
                    <span>{{
                      $formatCurrency(calculateFuelCost(routeInfo.distance))
                    }}</span>
                  </p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- Map Container -->
      <div class="relative h-full min-h-screen">
        <div id="map" class="w-full h-full min-h-screen rounded"></div>

        <!-- isLoading Overlay -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-[var(--scrim)] bg-opacity-75 flex_center z-[1000] flex-col"
        >
          <BaseSpinner color="var(--text_light)" />
          <p class="font-rhd text-dark">Loading map...</p>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import defaultVals from "~/utils/defaultVals";
import Draggable from "vue3-draggable";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import debounce from "lodash/debounce";
import { useCustomFetch } from "~/composables/useCustomFetch";
// helpers
const { $removeKebabCase, $globalEmit, $deepClone, $commitToLocalStorage } = useNuxtApp();

// State
const map = ref<any>(null);
const routeLayer = ref<any>(null);
const markers = ref<Array<any>>([]);
const pois = ref<Array<any>>([]);
const poiMarkers = ref<Array<any>>([]);
const routeLine = ref<any>(null);
const isLoading = ref<boolean>(false);
const travelMode = ref<string>("driving");
const routeInfo = ref<any>(null);
const updateLocations = ref<boolean>(false); // to counteract dom update
const loading = ref<boolean>(false);
const maxDestination = ref<number>(4);
const fuelPrice = ref<number>(1300);

const locations = ref<Array<Locations>>([]);
const routeLegs = ref<UserLeg>({
  metrics: [],
  names: [],
});
const formattedCoordinates = computed(() => {
  if (locations.value.length <= 1) return "";
  else
    return locations.value
      .filter((loc: Locations) => loc.coordinates)
      .map((loc: Locations) => loc.coordinates.join(","))
      .join(";");
});

// Custom map style
const mapStyle: any = {
  default: {
    color: "#3B82F6",
    weight: 4,
    opacity: 0.7,
  },
  walking: {
    color: "#10B981",
    dashArray: "5, 10",
  },
  cycling: {
    color: "#6366F1",
    dashArray: "10, 5",
  },
};
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Initialize map on client only loaded to avoid windows error and document not found error

onMounted(() => {
  // set default location
  locations.value.push($deepClone({ id: Math.random(), ...defaultVals.defaultLocation }));
  locations.value.push($deepClone({ id: Math.random(), ...defaultVals.defaultLocation }));
  updateLocations.value = true;

  const abujaCoordinates = [9.0765, 7.3986];
  const zoomLevel = 12;

  map.value = L.map("map").setView(abujaCoordinates, zoomLevel);

  // Add custom styled tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    className: "map-tiles",
    maxZoom: 19,
  }).addTo(map.value);
  let abj = L.marker(abujaCoordinates)
    .addTo(map.value)
    .bindPopup("Welcome to: Abuja, Nigeria")
    .openPopup();
  markers.value.push(abj);

  // Add custom styles
  const style = document.createElement("style");
  style.textContent = `
    .map-tiles {
      filter: grayscale(20%) hue-rotate(10deg);
    }
  `;
  document.head.appendChild(style);
  map.value.on("zoom", () => {
    calculateNewMarkerLayer();
  });
  let LClocations = localStorage.getItem("locations");
  const LCrouteLegs = localStorage.getItem("routeLegs");
  const LCfuelPrice = localStorage.getItem("fuelPrice");
  const LCtravelMode = localStorage.getItem("travelMode");
  if (LClocations) locations.value = JSON.parse(LClocations);
  if (LCrouteLegs) routeLegs.value = JSON.parse(LCrouteLegs);
  if (LCfuelPrice) fuelPrice.value = Number(LCfuelPrice);
  if (LCtravelMode) travelMode.value = LCtravelMode;
});

// Watch for changes in locations or travel mode
watch(
  [formattedCoordinates],
  () => {
    updateMapOnCondition();
  },
  { deep: true }
);

// items to save
watch(
  [locations, routeLegs, fuelPrice, travelMode],
  () => {
    $commitToLocalStorage("locations", JSON.stringify(locations.value));
    $commitToLocalStorage("routeLegs", JSON.stringify(routeLegs.value));
    $commitToLocalStorage("fuelPrice", fuelPrice.value);
    $commitToLocalStorage("travelMode", travelMode.value);
  },
  { deep: true }
);

// Methods
const getDynamicLocationsIndex = (id: number) => {
  const loopedData = $deepClone(locations.value);
  const dataIndex = loopedData.findIndex((element: Locations) => element.id === id);
  return Math.abs(dataIndex);
};

const debounceSearch = debounce(async (index: number) => {
  const location = locations.value[index];
  if (!location.search) {
    location.searchResults = [];
    location.isSearching = false;
    return;
  }

  try {
    location.isSearching = true;
    const { data: response } = await useCustomFetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location.search
      )}&limit=5`,
      { method: "Get" },
      true
    );

    // if (!response?.length) throw new Error("Search failed");
    if (!response?.length) return;

    location.searchResults = response;
    location.error = null;
    location.menu = true;
  } catch (error) {
    $globalEmit("error", { prop: error, header: "Failed to search location" });
    location.error = "Failed to search location";
  } finally {
    location.isSearching = false;
  }
}, 300);

const selectLocation = (index: number, result: SearchResult) => {
  const location = locations.value[index];
  if (location.search === result.display_name) return (location.menu = false);
  location.search = result.display_name;
  location.selectedRoute = result;
  location.coordinates = [parseFloat(result.lat), parseFloat(result.lon)];
  location.menu = false;
  updateMarkers();
};

const updateMarkers = () => {
  // Clear existing markers
  calculateNewMarkerLayer();
  if (routeLayer.value) {
    map.value.removeLayer(routeLayer.value);
  }
  // Fit bounds if we have multiple markers
  if (markers.value.length) {
    map.value.setView(locations.value[0].coordinates, 13);
    routeInfo.value = null;
  }
};

const updateMapOnCondition = () => {
  if (formattedCoordinates.value && locations.value.every((loc) => loc.coordinates)) {
    updateRoute();
    updateRoutePoly();
  }
};

const updateRoute = async () => {
  if (routeLine.value) {
    routeLine.value.remove();
  }
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${travelMode.value}/${formattedCoordinates.value}?overview=full&geometries=geojson`
    );

    if (!response.ok) throw new Error("Route calculation failed");

    const data = await response.json();

    if (data.code !== "Ok") throw new Error("Invalid route");

    const style = {
      ...mapStyle.default,
      ...(mapStyle[travelMode.value] || {}),
    };

    routeLine.value = L.geoJSON(data.routes[0].geometry, { style }).addTo(map.value);
    routeInfo.value = {
      distance: data.routes[0].distance,
      duration: data.routes[0].duration,
    };
    routeLegs.value = {
      metrics: [],
      names: [],
    };
    if (data.routes[0].legs?.length) {
      routeLegs.value.names = locations.value.map((element: Locations) => {
        return element.selectedRoute.name;
      });
      data.routes[0].legs.forEach((el: RouteLeg, index: 0) => {
        routeLegs.value.metrics.push({
          distance: el.distance,
          duration: el.duration,
        });
      });
    }
  } catch (error) {
    console.error("Route error:", error);
    // Show error message to user
  } finally {
  }
};

const calculateNewMarkerLayer = () => {
  markers.value.forEach((marker: any) => marker.remove());
  markers.value = [];
  //  Add new markers
  locations.value.forEach((location, index) => {
    if (location.coordinates) {
      const icon = !index
        ? blueIcon
        : index !== locations.value.length - 1
        ? greenIcon
        : redIcon;
      const marker = L.marker(location.coordinates, { icon })
        .bindPopup(location.search)
        .addTo(map.value);
      markers.value.push(marker);
    }
  });
};

const calculatePointOfInterestsMarkerLayer = () => {
  poiMarkers.value.forEach((marker) => map.value.removeLayer(marker));
  poiMarkers.value = [];
  pois.value = [];
};

const addLocation = () => {
  updateLocations.value = false;
  locations.value.push($deepClone({ id: Math.random(), ...defaultVals.defaultLocation }));
  setTimeout(() => {
    updateLocations.value = true;
  }, 0);
};

const removeLocation = (index: number) => {
  if (locations.value.length > 2) {
    updateLocations.value = false;
    locations.value.splice(index, 1);
    setTimeout(() => {
      updateLocations.value = true;
      updateMarkers();
      setTimeout(() => {}, 200);
    }, 0);
  }
};

const formatPlaceDetails = (result: SearchResult) => {
  const details = [];
  if (result.type) details.push($removeKebabCase(result.type));
  if (result.address?.city) details.push($removeKebabCase(result.address.city));
  if (result.address?.country) details.push($removeKebabCase(result.address.country));
  return details.join(", ");
};

const formatDistance = (meters: number) => {
  return meters > 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
};

// Calculate fuel cost
const calculateFuelConsumed = (distance: number) => {
  const fuelEfficiency = 25;
  const distanceInKm = distance / 1000;
  return (distanceInKm * fuelEfficiency) / 100;
};
const calculateFuelCost = (distance: number) => {
  return calculateFuelConsumed(distance) * fuelPrice.value;
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} minutes`;
};

const getRoute = async () => {
  isLoading.value = true;
  calculateNewMarkerLayer();
  const cord = locations.value.map((element: Locations, index: number) => {
    return [...element.coordinates];
  });

  const coordinateString = cord.map((coord: any) => `${coord[1]},${coord[0]}`).join(";");
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/${travelMode.value}/${coordinateString}?overview=full&geometries=polyline`
  );
  const data = await response.json();

  if (data.code !== "Ok") {
    throw new Error("Unable to find route");
  }
  isLoading.value = false;
  return data;
};

const decodePolyline = (str: string, precision: number = 5) => {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change,
    factor = Math.pow(10, precision);

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = result & 1 ? ~(result >> 1) : result >> 1;
    shift = result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    lat += latitude_change;
    lng += longitude_change;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
};

const updateRoutePoly = async () => {
  try {
    if (routeLayer.value) {
      map.value.removeLayer(routeLayer.value);
      routeLayer.value = null;
    }
    // Get the route from OSRM
    const routeData = await getRoute();
    const decodedRoute = decodePolyline(routeData.routes[0].geometry);

    // Create new polyline with the route
    routeLayer.value = L.polyline(decodedRoute, {
      color:
        travelMode.value === "driving"
          ? "blue"
          : travelMode.value === "cycling"
          ? "green"
          : "orange",
      weight: 3,
      opacity: 0.7,
    }).addTo(map.value);

    // Fit bounds to show the entire route
    map.value.fitBounds(routeLayer.value.getBounds(), {
      padding: [50, 50],
    });
  } catch (error) {
    console.error("Error getting route:", error);
    alert("Unable to find route between these points");
  }
};
</script>

<style>
@import "leaflet/dist/leaflet.css";
</style>
