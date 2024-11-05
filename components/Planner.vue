<template>
  <section class="page_main_section preventDefaultTransition">
    <section style="grid-gap: 0" class="auth__section align_auto min-h-screen relative">
      <!-- Locations Panel -->
      <div class="overlflow-hidden h-screen sticky top-0 bottom-0 max-w-[350px]">
        <div class="space-y-4 py-5 w-full px-[16px]">
          <h2 class="text-xl font-bold mb-4">Travel Planner</h2>

          <!-- Travel Mode Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">Travel Mode</label>
            <select v-model="travelMode" class="w-full p-2 border rounded">
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
              <option value="driving">Driving</option>
            </select>
          </div>
          <draggable v-model="locations">
            <!-- v-for="(location, index) in locations"
                :key="location.id" -->
            <template v-slot:item="{ item: location, index }">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <label class="text-sm font-medium">
                    {{
                      index === 0
                        ? "Start"
                        : index === locations.length - 1
                        ? "End"
                        : "Stop " + index
                    }}
                  </label>
                  <button
                    v-if="locations.length > 2"
                    @click="removeLocation(index)"
                    class="text-red-500 text-[10px] hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div class="relative">
                  <VMenu
                    :close-on-content-click="false"
                    location="bottom center"
                    :offset="5"
                    transition="slide-y-transition"
                    :disabled="location.searchResults.length ? false : true"
                    v-model="location.menu"
                  >
                    <template v-slot:activator="{ props }">
                      <div v-bind="props">
                        <input
                          v-model="location.search"
                          @input="debounceSearch(index)"
                          @click.stop="
                            location.searchResults.length
                              ? (location.menu = true)
                              : (location.menu = false)
                          "
                          placeholder="Search location..."
                          class="w-full p-2 border rounded"
                          :class="{ 'border-red-500': location.error }"
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
                          @click="selectLocation(index, result)"
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
          </draggable>

          <!-- Add Location Button -->
          <button
            @click="addLocation"
            class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Stop
          </button>

          <!-- Route Information -->
          <div v-if="routeInfo" class="mt-4 p-4 bg-gray-100 rounded">
            <h3 class="font-medium">Route Information</h3>
            <p>Total Distance: {{ formatDistance(routeInfo.distance) }}</p>
            <p>Estimated Time: {{ formatDuration(routeInfo.duration) }}</p>
          </div>
        </div>
      </div>
      <!-- Map Container -->
      <div class="relative h-full min-h-screen">
        <div id="map" class="w-full h-full min-h-screen rounded"></div>

        <!-- Loading Overlay -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          ></div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineComponent } from "vue";
import Draggable from "vue3-draggable";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import debounce from "lodash/debounce";
import { useCustomFetch } from "~/composables/useCustomFetch";
import defaultVals from "~/utils/defaultVals";
defineComponent({ Draggable });
// helpers
const { $removeKebabCase, $globalEmit, $deepClone } = useNuxtApp();

// State
const drag = ref<boolean>(false);
const map = ref<any>(null);
const routeLayer = ref<any>(null);
const markers = ref<Array<any>>([]);
const routeLine = ref<any>(null);
const isLoading = ref<boolean>(false);
const travelMode = ref<string>("walking");
const routeInfo = ref<any>(null);

const locations = ref<Array<Locations>>([]);

// Custom map style
const mapStyle = {
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

// Initialize map on client only loaded to avoid windows error and document not found error

// set default location
locations.value.push($deepClone({ id: Math.random(), ...defaultVals.defaultLocation }));
locations.value.push($deepClone({ id: Math.random(), ...defaultVals.defaultLocation }));
onMounted(() => {
  const abujaCoordinates = [9.0765, 7.3986];
  const zoomLevel = 12;

  map.value = L.map("map").setView(abujaCoordinates, zoomLevel);

  // Add custom styled tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    className: "map-tiles",
    maxZoom: 19,
  }).addTo(map.value);
  L.marker(abujaCoordinates)
    .addTo(map.value)
    .bindPopup("Welcome to: Abuja, Nigeria")
    .openPopup();

  // Add custom styles
  const style = document.createElement("style");
  style.textContent = `
    .map-tiles {
      filter: grayscale(20%) hue-rotate(10deg);
    }
  `;
  document.head.appendChild(style);
});

// Watch for changes in locations or travel mode
watch(
  [locations, travelMode],
  async () => {
    if (locations.value.every((loc) => loc.coordinates)) {
      await updateRoute();
    }
  },
  { deep: true }
);

// Methods
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
  location.search = result.display_name;
  location.coordinates = [parseFloat(result.lat), parseFloat(result.lon)];
  location.menu = false;
  updateMarkers();
};

const updateMarkers = () => {
  // Clear existing markers
  markers.value.forEach((marker: any) => marker.remove());
  markers.value = [];
  if (routeLayer.value) {
    map.value.removeLayer(routeLayer.value);
  }

  // Add new markers
  locations.value.forEach((location, index) => {
    if (location.coordinates) {
      const marker = L.marker(location.coordinates)
        .bindPopup(location.search)
        .addTo(map.value);
      markers.value.push(marker);
    }
  });

  // Fit bounds if we have multiple markers
  if (markers.value.length > 1) {
    const cord = locations.value.map((element: Locations) => {
      return [...element.coordinates];
    });
    updateRoutePoly(cord);
  } else map.value.setView(locations.value[0].coordinates, 13);
};

const updateRoute = async () => {
  if (routeLine.value) {
    routeLine.value.remove();
  }

  isLoading.value = true;

  try {
    const coordinates = locations.value
      .filter((loc: Locations) => loc.coordinates)
      .map((loc: Locations) => loc.coordinates.join(","))
      .join(";");

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${travelMode.value}/${coordinates}?overview=full&geometries=geojson`
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
  } catch (error) {
    console.error("Route error:", error);
    // Show error message to user
  } finally {
    isLoading.value = false;
  }
};

const addLocation = () => {
  locations.value.push($deepClone({ id: Math.random(), ...defaultVals.defaultLocation }));
};

const removeLocation = (index: number) => {
  if (locations.value.length > 2) {
    locations.value.splice(index, 1);
    updateMarkers();
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

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} minutes`;
};

const getRoute = async (coordinates: any, profile = "car") => {
  const coordinateString = coordinates
    .map((coord: any) => `${coord[1]},${coord[0]}`)
    .join(";");

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/${profile}/${coordinateString}?overview=full&geometries=polyline`
  );
  const data = await response.json();

  if (data.code !== "Ok") {
    throw new Error("Unable to find route");
  }

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

const updateRoutePoly = async (cord: any, profile = "car") => {
  try {
    // Get the route from OSRM
    const routeData = await getRoute(cord, profile);
    const decodedRoute = decodePolyline(routeData.routes[0].geometry);

    // Create new polyline with the route
    routeLayer.value = L.polyline(decodedRoute, {
      color: profile === "car" ? "blue" : profile === "bike" ? "green" : "orange",
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
