<template>
  <div>
    <div class="space-y-4 py-5 w-full px-[16px]">
      <div class="mb-4 flex_between">
        <h2 class="text-xl font-bold text-dark-2">Road Trip Planner</h2>
        <div class="visible_sm">
          <BaseButton
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
            @click="appResourceStore.zIndex = 0"
          />
        </div>
      </div>

      <!-- Travel Mode Selection -->
      <div class="space-y-2">
        <label class="block text-sm font-medium max-w-max">Travel Mode</label>
        <select
          :disabled="isMapLoading"
          v-model="travelMode"
          class="w-full p-2"
          @change="updateMapOnCondition()"
        >
          <option value="walking">Walking</option>
          <option value="cycling">Cycling</option>
          <option value="driving">Driving</option>
        </select>
      </div>
      <div v-if="travelMode === 'driving'" class="space-y-2 transInBasic">
        <label for="fuelCost" class="block text-sm font-medium max-w-max"
          >Fuel Cost</label
        >
        <BaseCurrencyInput
          placeholder="Fuel Cost"
          id="fuelCost"
          v-model="fuelPrice"
          :disabled="isMapLoading"
          :options="{
            distractionFree: {
              hideCurrencySymbol: false,
              hideNegligibleDecimalDigits: true,
              hideGroupingSymbol: true,
            },
            autoDecimalDigits: false,
            precision: 0,
            valueRange: {
              min: 0,
            },
            locale: 'en-NG',
            currency: 'NGN',
          }"
          class="form-control input_field"
          @update:modelValue="fuelPrice = $event"
        />
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium max-w-max">Points of interest</label>
        <FormCombobox
          :disabled="isMapLoading"
          :content="poiTypes"
          :selected-content="selectedPoiTypes"
          combo-type="filter"
          @update="selectedPoiTypes = $event"
        />
        <Transition name="slide-fade">
          <div
            v-if="
              canSearch && !$compareArrayStrings(selectedPoiTypes, backUpSelectedPoiTypes)
            "
            class="flex justify-end mt-3"
          >
            <BaseButton
              :disabled="isMapLoading"
              :elevation="1"
              class="linear__background"
              height="3rem"
              width="100%"
              max-width="max-content"
              color="var(--bg_color6)"
              text="Update Map"
              :text-style="{
                fontSize: 'var(--text_xs)',
              }"
              @click="updateMapOnCondition"
            />
          </div>
        </Transition>
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
                  isMapLoading ? true : location.searchResults.length ? false : true
                "
                max-width="318"
                v-model="location.menu"
              >
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="align_auto gap-[5px!important]">
                    <div class="relative flex_center">
                      <input
                        v-model="location.search"
                        @input="debounceSearch(getDynamicLocationsIndex(location.id))"
                        @click.stop="
                          location.searchResults.length
                            ? (location.menu = true)
                            : (location.menu = false)
                        "
                        :disabled="isMapLoading"
                        placeholder="Search location..."
                        class="w-full"
                        style="padding-right: 40px"
                      />
                      <div class="absolute max-w-max right-[12px] w-full">
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
                      :disabled="isMapLoading"
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
                  max-height="280"
                >
                  <template v-if="location.searchResults.length && !location.isSearching">
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
                  </template>
                  <div
                    v-else-if="!location.searchResults.length && !location.isSearching"
                    class="w-full text-center transInBasic"
                  >
                    <span class="text-sm text-dark-3">Nothing matchesyour earch</span>
                  </div>
                  <VListItem v-else class="">
                    <div class="w-full flex_center">
                      <BaseSpinner color="var(--primary_color)" />
                    </div>
                  </VListItem>
                </VList>
              </VMenu>
            </div>

            <!-- Location Error Message -->
          </div>
        </template>
      </Draggable>

      <!-- Add Location Button -->
      <Transition name="slide-fade">
        <BaseButton
          v-if="locations.length !== maxDestination"
          :disabled="isMapLoading"
          :loading="isMapLoading"
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
      <div v-if="!isMapLoading" class="mt-4 space-y-4 transInBasic">
        <template v-if="routeLegs.metrics.length > 1">
          <div class="p-4 bg-gray-100 rounded-[8px]">
            <h2 class="text-lg font-bold mb-4 linear__background clip__background">
              Route Breakdown
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
              <span class="text-dark-2 block text-sm">Fuel Consumption:</span>
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
                <span>{{ $formatCurrency(calculateFuelCost(routeInfo.distance)) }}</span>
              </p>
            </div>
          </template>
        </div>

        <div
          v-if="pois.length && !poisLoader"
          class="relative space-y-2 pt-5 transInBasic"
        >
          <label class="block text-sm font-medium max-w-max"
            >Suggested places of interest ({{ pois.length }})
          </label>

          <VMenu
            location="bottom center"
            :offset="5"
            transition="slide-y-transition"
            max-width="318"
            v-model="poisMenu"
          >
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                class="px-[12px] border-[1px] border-bc rounded-[8px] flex_between gap-[10px] h-[4rem] cursor-pointer relative overflow-hidden"
              >
                <p
                  :class="{
                    'linear__background clip__background text-sm elipsis':
                      activeInterest?.name,
                    'text-xs text-dark-4': !activeInterest?.name,
                  }"
                >
                  <span>{{
                    !activeInterest?.name ? "Search interests" : activeInterest.name
                  }}</span>
                  <span v-if="activeInterest?.amenity">
                    ({{ activeInterest.amenity }})</span
                  >
                </p>
                <div
                  :style="{ opacity: poisMenu ? 1 : 0 }"
                  @click.stop="poisMenu = true"
                  class="absolute top-0 left-0 w-full h-full"
                >
                  <input
                    style="
                      width: 100%;
                      height: 100%;
                      min-height: auto !important;
                      border: none;
                      box-shadow: none !important;
                      background: var(--text_light) !important;
                      border-radius: 0 !important;
                      padding-right: 40px;
                    "
                    ref="poisInput"
                    type="text"
                    placeholder="Search interests"
                    v-model="poisFilterInput"
                  />
                </div>
                <!-- icon -->
                <div class="flex_center min-w-max max-w-max relative z-10">
                  <SvgAngleDown />
                </div>
              </div>
            </template>
            <!-- pois -->
            <VList
              class="dropDownList dropList justify_auto gap-[15px!important]"
              min-width="221"
              max-height="280"
            >
              <template v-if="filteredPois.length">
                <VListItem
                  v-for="(result, index) in filteredPois"
                  :key="result.id + index + result.name"
                  :ripple="true"
                  class=""
                  style="
                    min-height: max-content !important;
                    height: max-content !important;
                  "
                  @click="setActiveInterest(result)"
                >
                  <div class="">
                    <div class="font-medium text-dark-7">{{ result.name }}</div>
                    <div
                      v-if="result.amenity"
                      class="font-medium text-xs elipsis-2 capital"
                    >
                      {{ result.amenity }}
                    </div>
                    <div
                      v-if="result.address"
                      class="text-[10px] capital text-dark-11 font-medium"
                    >
                      {{ result.address }}
                    </div>
                    <div
                      v-if="result.phone || result.email"
                      class="text-[10px] capital text-dark-11 font-medium flex flex-col gap-2"
                    >
                      <a
                        v-if="result.phone"
                        class="text-dark-7 underline font-bold"
                        :href="`tel:${result.phone}`"
                        >📞 {{ result.phone }}</a
                      >
                      <a
                        v-if="result.email"
                        class="text-dark-7 underline font-bold"
                        :href="`mailto:${result.email}`"
                        >📧 {{ result.email }}</a
                      >
                    </div>
                    <div
                      v-if="result.cuisineTypes"
                      class="text-[10px] capital text-dark-11 font-medium"
                    >
                      <strong>Cuisine:</strong> {{ result.cuisineTypes }}
                    </div>
                    <div
                      v-if="result.dietaryOptions?.length > 0"
                      class="text-[10px] capital text-dark-11 font-medium"
                    >
                      <strong>Dietary Options:</strong>
                      {{ result.dietaryOptions.join(", ") }}
                    </div>
                    <div
                      v-if="result.openingHours"
                      class="text-[10px] capital text-dark-11 font-medium"
                    >
                      <strong>Opening Hours:</strong>
                      <div v-html="result.openingHours"></div>
                    </div>
                    <div
                      v-if="result.features?.length > 0"
                      class="text-[10px] capital text-dark-11 font-medium"
                    >
                      <strong>Features:</strong> {{ result.features.join(" • ") }}
                    </div>
                  </div>
                </VListItem>
              </template>
              <div v-else class="w-full text-center transInBasic">
                <span class="text-sm text-dark-3">Nothing matchesyour earch</span>
              </div>
            </VList>
          </VMenu>
          <p class="text-[10px] text-right text-dark-2">Max: 174</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import defaultVals from "~/utils/defaultVals";
import Draggable from "vue3-draggable";
import L from "leaflet";
import debounce from "lodash/debounce";
import { useCustomFetch } from "~/composables/useCustomFetch";

// helpers functions, most are reusable from my reusable repo
const {
  $removeKebabCase,
  $globalEmit,
  $deepClone,
  $commitToLocalStorage,
  $getType,
} = useNuxtApp();

// state management
const appResourceStore = useAppResourceStore();

// State

// map markers
const markers = ref<Array<any>>([]);
const poiMarkers = ref<Array<any>>([]);

// marker popup structure styles
const popupConfig = ref<any>({
  maxWidth: 400,
  minWidth: 300,
  className: "custom-popup",
  autoPanPadding: [50, 50],
});

const routeLayer = ref<any>(null);
const routeLine = ref<any>(null);
const travelMode = ref<string>("driving");
const routeInfo = ref<any>(null);
const updateLocations = ref<boolean>(false); // to counteract dom update
const maxDestination = ref<number>(4);
const fuelPrice = ref<number>(1300);

// points of interest
const pois = ref<Array<any>>([]);
const poiTypes = defaultVals.poiTypes;
const poisFilterInput = ref<string>("");
const poisMenu = ref<boolean>(false);
const poisLoader = ref<boolean>(false);
const activeInterest = ref<any>({});
const selectedPoiTypes = ref<Array<string>>(["restaurant", "hotel", "spa"]);
const backUpSelectedPoiTypes = ref<Array<string>>(["restaurant", "hotel", "spa"]);
const filteredPois = computed(() => {
  let conData = $deepClone(pois.value);
  //  filter only string values tho
  if (poisFilterInput.value) {
    conData = conData.filter((el: any) => {
      return (
        (el.name &&
          el.name
            .toLocaleLowerCase()
            .includes(poisFilterInput.value.toLocaleLowerCase())) ||
        (el.amenity &&
          el.amenity
            .toLocaleLowerCase()
            .includes(poisFilterInput.value.toLocaleLowerCase())) ||
        (el.address &&
          el.address
            .toLocaleLowerCase()
            .includes(poisFilterInput.value.toLocaleLowerCase())) ||
        (el.cuisineTypes &&
          el.cuisineTypes
            .toLocaleLowerCase()
            .includes(poisFilterInput.value.toLocaleLowerCase()))
      );
    });
  }
  return conData;
});
// main destinations array
const locations = ref<Array<Locations>>([...$deepClone(appResourceStore.locations)]);

// leg work ?? no! captures the users path and individual data
const routeLegs = computed(() => appResourceStore.routeLegs);
// map loader
const isMapLoading = computed(() => appResourceStore.isMapLoading);
// loaded map
const map = computed(() => appResourceStore.map);
// formats the route for distance calculation on OSRM
const formattedCoordinates = computed(() => {
  if (locations.value.length <= 1) return "";
  else
    return locations.value
      .filter((loc: Locations) => loc.coordinates)
      .map((loc: Locations) => loc.coordinates.join(","))
      .join(";");
});

// just checks if there is need for distance and path calculation
const canSearch = computed(() => {
  return formattedCoordinates.value && locations.value.every((loc) => loc.coordinates);
});

// Custom map style
const mapStyle: any = defaultVals.mapStyle;

// sets default icons
const blueIcon = new L.Icon(defaultVals.defaultIcons[0]);
const redIcon = new L.Icon(defaultVals.defaultIcons[1]);
const greenIcon = new L.Icon(defaultVals.defaultIcons[2]);
const goldIcon = new L.Icon(defaultVals.defaultIcons[3]);
const blackIcon = new L.Icon(defaultVals.defaultIcons[4]);

// Initialize map on client only loaded to avoid windows error and document not found error
onMounted(() => {
  // sets default map view to be on abuja
  const zoomLevel = 12;
  const abujaCoordinates: Array<number> = [9.0765, 7.3986];
  if (!map.value) {
    appResourceStore.map = L.map("map");
    moveMap(abujaCoordinates);
  }

  // Add custom styled tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    className: "map-tiles",
    maxZoom: 19,
  }).addTo(map.value);

  // adds abuja marker
  let abj = L.marker(abujaCoordinates, { icon: blackIcon })
    .bindPopup(createPopupContent("Welcome to: Abuja, Nigeria"), popupConfig.value)
    .addTo(map.value)
    .openPopup();
  markers.value.push(abj);

  // set point of interest marker
  defaultVals.defaultAttractions.forEach((element: any) => {
    const defAt = L.marker(element.coordinates, { icon: redIcon })
      .bindPopup(createPopupContent(element.name), popupConfig.value)
      .addTo(map.value);
    markers.value.push(defAt);
  });

  // Add custom styles
  const style = document.createElement("style");
  style.textContent = `
    .map-tiles {
      filter: grayscale(20%) hue-rotate(10deg);
    }
  `;
  document.head.appendChild(style);
  appResourceStore.map.on("zoom", () => {
    calculateNewMarkerLayer();
    calculatePointOfInterestsMarkerLayer();
  });

  // check and add from localStorage
  const LClocations = localStorage.getItem("locations");
  const LCrouteLegs = localStorage.getItem("routeLegs");
  const LCrouteInfos = localStorage.getItem("routeInfo");
  const LCselectedPoiTypes = localStorage.getItem("selectedPoiTypes");
  const LCfuelPrice = localStorage.getItem("fuelPrice");
  const LCtravelMode = localStorage.getItem("travelMode");
  if (LClocations) locations.value = JSON.parse(LClocations);
  if (LCrouteLegs) appResourceStore.routeLegs = JSON.parse(LCrouteLegs);
  if (LCselectedPoiTypes) selectedPoiTypes.value = JSON.parse(LCselectedPoiTypes);
  if (LCrouteInfos) routeInfo.value = JSON.parse(LCrouteInfos);
  if (LCfuelPrice) fuelPrice.value = Number(LCfuelPrice);
  if (LCtravelMode) travelMode.value = LCtravelMode;
  updateLocations.value = true;
});

watch(poisMenu, () => {
  if (!poisMenu.value)
    setTimeout(() => {
      poisFilterInput.value = "";
    }, 400);
});

// Watch for changes in locations or travel mode
watch(
  [formattedCoordinates],
  () => {
    updateMapOnCondition();
  },
  { deep: true }
);

// watch for changes on items to save to localStorage
watch(
  [locations, routeLegs, routeInfo, selectedPoiTypes, fuelPrice, travelMode],
  () => {
    $commitToLocalStorage("locations", JSON.stringify(locations.value));
    $commitToLocalStorage("routeLegs", JSON.stringify(routeLegs.value));
    $commitToLocalStorage("routeInfo", JSON.stringify(routeInfo.value));
    $commitToLocalStorage("selectedPoiTypes", JSON.stringify(selectedPoiTypes.value));
    $commitToLocalStorage("fuelPrice", fuelPrice.value);
    $commitToLocalStorage("travelMode", travelMode.value);
  },
  { deep: true }
);

// Methods
// just moves the map
const moveMap = (coordinates: Array<number>) => {
  appResourceStore.map.setView(coordinates, 18); // cordinates and zoom level
};
// sets the active interests
const setActiveInterest = (item: any) => {
  activeInterest.value = item;
  moveMap([item.coordinates.lat, item.coordinates.lng]);
  // timeout to wait fro map dom update
  setTimeout(() => {
    const dataIndex = pois.value.findIndex((element: any) => element.id === item.id);
    // twice because of lag
    poiMarkers.value[dataIndex].remove();
    poiMarkers.value[dataIndex].remove();
    poiMarkers.value[dataIndex].closePopup();
    poiMarkers.value[dataIndex].closePopup();
    const icon = item.type !== "way" ? goldIcon : blackIcon;
    const marker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon })
      .addTo(map.value)
      .bindPopup(createPopupContent(item), popupConfig.value)
      .openPopup();
    poiMarkers.value[dataIndex] = marker;
  }, 400);
};
// get locations index because whomever refactored and took a lot from the draggable package needs help
const getDynamicLocationsIndex = (id: number) => {
  const loopedData = $deepClone(locations.value);
  const dataIndex = loopedData.findIndex((element: Locations) => element.id === id);
  return Math.abs(dataIndex);
};
// search for flight per input
const debounceSearch = debounce(async (index: number) => {
  const location = locations.value[index];
  const searchInputData = $deepClone(locations.value[index].search);
  if (!location.search) {
    location.searchResults = [];
    location.isSearching = false;
    return;
  }

  try {
    location.isSearching = true;
    const { data: response } = await useCustomFetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchInputData
      )}&limit=15`,
      { method: "Get" },
      true
    );

    // if (!response?.length) throw new Error("Search failed");
    if (!response?.length)
      return $globalEmit("info", {
        prop: `Unable to find places that match your search: <strong>${searchInputData}</strong>`,
        header: "Issue Searching",
      });

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

// select a searched flight per locations
const selectLocation = (index: number, result: SearchResult) => {
  const location = locations.value[index];
  if (location.search === result.display_name) return (location.menu = false);
  location.search = result.display_name;
  location.selectedRoute = result;
  location.coordinates = [parseFloat(result.lat), parseFloat(result.lon)];
  location.menu = false;
  updateMarkers();
};
// set the markers and update on the leaflet
const updateMarkers = () => {
  // Clear existing markers
  calculateNewMarkerLayer();
  calculatePointOfInterestsMarkerLayer();
  if (routeLayer.value) {
    appResourceStore.map.removeLayer(routeLayer.value);
  }
  // Fit bounds if we have multiple markers
  if (markers.value.length) {
    appResourceStore.map.setView(locations.value[0].coordinates, 13);
    routeInfo.value = null;
  }
};
// update the map when the desired UX is acheieved
const updateMapOnCondition = () => {
  if (canSearch.value) {
    updateRoute();
    updateRoutePoly();
    getPOIs();
    backUpSelectedPoiTypes.value = $deepClone(selectedPoiTypes.value);
  }
};
// get route distancing amd duration using osrm
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

    // routeLine.value = L.geoJSON(data.routes[0].geometry, { style }).addTo(map.value);
    routeInfo.value = {
      distance: data.routes[0].distance,
      duration: data.routes[0].duration,
    };
    appResourceStore.routeLegs = {
      metrics: [],
      names: [],
    };
    if (data.routes[0].legs?.length) {
      appResourceStore.routeLegs.names = locations.value.map((element: Locations) => {
        return element.selectedRoute.name;
      });
      data.routes[0].legs.forEach((el: RouteLeg, index: 0) => {
        appResourceStore.routeLegs.metrics.push({
          distance: el.distance,
          duration: el.duration,
        });
      });
    }
  } catch (error) {
    $globalEmit("error", { prop: error, header: "Route error" });
  } finally {
  }
};
const removeMarkers = async (type: string = "markers") => {
  const mapMarks = type === "markers" ? markers.value : poiMarkers.value;
  await mapMarks.forEach((marker: any) => marker.closePopup());
  await mapMarks.forEach((marker: any) => marker.remove());
};
// clear and calculate new markers
const calculateNewMarkerLayer = async () => {
  // did this twice because noticed a bit of a lag
  await removeMarkers();
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
        .bindPopup(
          createPopupContent(location.selectedRoute.display_name),
          popupConfig.value
        )
        .addTo(map.value);
      markers.value.push(marker);
    }
  });
};
// clear and calculate new poi markers
const calculatePointOfInterestsMarkerLayer = async () => {
  poisLoader.value = true;
  // did this twice because noticed a bit of a lag
  await removeMarkers("poiMarkers");
  poiMarkers.value = [];
  if (!pois.value || !selectedPoiTypes.value?.length) return;
  pois.value.forEach((poi: any) => {
    const icon = poi.type !== "way" ? goldIcon : blackIcon;
    const marker = L.marker([poi.coordinates.lat, poi.coordinates.lng], { icon })
      .addTo(map.value)
      .bindPopup(createPopupContent(poi), popupConfig.value);
    poiMarkers.value.push(marker);
  });
  poisLoader.value = false;
};
const getPOIs = async () => {
  if (!selectedPoiTypes.value?.length) return calculatePointOfInterestsMarkerLayer();

  pois.value = [];
  activeInterest.value = {};
  // Calculate bounding box based on route
  const lats = locations.value.map((d) => d.coordinates[0]);
  const lngs = locations.value.map((d) => d.coordinates[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Build Overpass API query
  const selectedTypes = new Set(selectedPoiTypes.value);
  const query = `
    [out:json][timeout:25];
    (
      ${selectedPoiTypes.value
        .map((tag: string) => {
          let nodeTag = "amenity";
          if (defaultVals.amenity.includes(tag)) nodeTag = "amenity";
          else if (defaultVals.tourism.includes(tag)) nodeTag = "tourism";
          else if (defaultVals.leisure.includes(tag)) nodeTag = "leisure";
          else if (defaultVals.shop.includes(tag)) nodeTag = "shop";
          else if (defaultVals.historic.includes(tag)) nodeTag = "historic";
          return `node["${nodeTag}"="${tag}"](${minLat},${minLng},${maxLat},${maxLng});
                way["${nodeTag}"="${tag}"](${minLat},${minLng},${maxLat},${maxLng});`;
        })
        .join("\n")}
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    poisLoader.value = true;
    // Query Overpass API
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });
    const data = await response.json();
    const nodeMap: any = {};
    data.elements.forEach((element: any) => {
      if (element.type === "node") {
        nodeMap[element.id] = { lat: element.lat, lng: element.lon };
      }
    });

    pois.value = data.elements
      .map((element: any) => processOsmElement(element, nodeMap))
      .filter((poi: any) => poi && poi?.name !== "Unnamed Location");
    if (pois.value.length > 174) pois.value = pois.value.slice(0, 174);
    // Add POI markers
    calculatePointOfInterestsMarkerLayer();
  } catch (error: any) {
    poisLoader.value = false;
    $globalEmit("error", { prop: error, header: "Points of interest error" });
  }
};
// remember to put me as a helper function
const processOsmElement = (element: any, nodeMap: any = {}) => {
  try {
    // Handle different OSM element types
    let coordinates = null;

    if (element.type === "node") {
      // Direct coordinates for nodes
      coordinates = {
        lat: element.lat,
        lng: element.lon,
      };
    } else if (element.type === "way") {
      // For ways, calculate the center point of all nodes
      const nodes = element.nodes
        .map((nodeId: any) => nodeMap[nodeId])
        .filter((node: any) => node); // Remove any undefined nodes

      if (nodes.length > 0) {
        const latSum = nodes.reduce((sum: any, node: any) => sum + node.lat, 0);
        const lngSum = nodes.reduce((sum: any, node: any) => sum + node.lng, 0);

        coordinates = {
          lat: latSum / nodes.length,
          lng: lngSum / nodes.length,
        };
      }
    }

    // If coordinates no dey, skip am
    if (!coordinates) return null;

    // Process tags
    const tags = element.tags || {};

    // Build formatted address
    const addressParts = [];
    if (tags["addr:housenumber"]) addressParts.push(tags["addr:housenumber"]);
    if (tags["addr:street"]) addressParts.push(tags["addr:street"]);
    if (tags["addr:city"]) addressParts.push(tags["addr:city"]);
    if (tags["addr:postcode"]) addressParts.push(tags["addr:postcode"]);

    // Process cuisine types: really difficult cause the data is not structured
    const cuisineTypes = tags.cuisine
      ? tags.cuisine
          .split(";")
          .map((c: any) => c.replace("_", " "))
          .join(", ")
      : null;

    // Process dietary options
    const dietaryOptions = Object.entries(tags)
      .filter(([key, value]) => key.startsWith("diet:") && value === "yes")
      .map(([key]) => key.replace("diet:", "").replace("_", " "));

    // Build opening hours display
    const openingHours = tags.opening_hours
      ? tags.opening_hours.split(";").join("<br>")
      : null;

    // Compile features
    const features = [];
    if (tags.outdoor_seating === "yes") features.push("Outdoor Seating");
    if (tags.delivery === "yes") features.push("Delivery");
    if (tags.takeaway === "yes") features.push("Takeaway");
    if (tags.reservation === "yes") features.push("Reservations");
    if (tags.internet_access) features.push("WiFi");

    return {
      id: element.id,
      type: element.type,
      coordinates,
      name: tags.name || "Unnamed Location",
      amenity: tags.amenity,
      address: addressParts.join(", "),
      phone: tags.phone,
      email: tags.email,
      cuisineTypes,
      dietaryOptions,
      openingHours,
      features,
      originalTags: tags, // Keep original tags in case
    };
  } catch (error) {
    return null;
  }
};
const createPopupContent = (poi: any) => {
  const sections = [];
  if ($getType(poi) === "string") return `<p class="text-sm font-bold">${poi}</p>`;

  // Name and type
  sections.push(`<p class="text-lg font-bold">${poi.name}</p>`);
  if (poi.amenity) {
    sections.push(`<p class="text-sm text-gray-600">${poi.amenity}</p>`);
  }

  // Address and contact
  if (poi.address) {
    sections.push(`<p class="mt-2 text-sm">${poi.address}</p>`);
  }
  if (poi.phone || poi.email) {
    const contacts = [];
    if (poi.phone) contacts.push(`📞 <a href="tel:${poi.phone}">${poi.phone}</a>`);
    if (poi.email) contacts.push(`📧 <a href="mailto:${poi.email}">${poi.email}</a>`);
    sections.push(`<p class="mt-2 text-sm ">${contacts.join("<br>")}</p>`);
  }

  // Cuisine types
  if (poi.cuisineTypes) {
    sections.push(`
      <div class="mt-2 text-sm ">
        <strong>Cuisine:</strong> ${poi.cuisineTypes}
      </div>
    `);
  }

  // Dietary options
  if (poi.dietaryOptions?.length > 0) {
    sections.push(`
      <div class="mt-2 text-sm ">
        <strong>Dietary Options:</strong> ${poi.dietaryOptions.join(", ")}
      </div>
    `);
  }

  // Opening hours
  if (poi.openingHours) {
    sections.push(`
      <div class="mt-2 text-sm ">
        <strong>Opening Hours:</strong><br>
        ${poi.openingHours}
      </div>
    `);
  }

  // Features
  if (poi.features?.length > 0) {
    sections.push(`
      <div class="mt-2 text-sm ">
        <strong>Features:</strong> ${poi.features.join(" • ")}
      </div>
    `);
  }

  return sections.join("\n");
};
// just adds a new locations object
const addLocation = () => {
  updateLocations.value = false;
  locations.value.push($deepClone({ id: Math.random(), ...defaultVals.defaultLocation }));
  setTimeout(() => {
    updateLocations.value = true;
  }, 0);
};
// just removes a locations object
const removeLocation = (index: number) => {
  if (locations.value.length > 2) {
    updateLocations.value = false;
    locations.value.splice(index, 1);
    setTimeout(() => {
      updateLocations.value = true;
    }, 0);
  }
};
// format the loacation details
const formatPlaceDetails = (result: SearchResult) => {
  const details = [];
  if (result.type) details.push($removeKebabCase(result.type));
  if (result.address?.city) details.push($removeKebabCase(result.address.city));
  if (result.address?.country) details.push($removeKebabCase(result.address.country));
  return details.join(", ");
};
// format the distance
const formatDistance = (meters: number) => {
  return meters > 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
};
// Calculate fuel consumed
const calculateFuelConsumed = (distance: number) => {
  const fuelEfficiency = 25;
  const distanceInKm = distance / 1000;
  return (distanceInKm * fuelEfficiency) / 100;
};
// calculate fuel cost
const calculateFuelCost = (distance: number) => {
  return calculateFuelConsumed(distance) * fuelPrice.value;
};
// format the length duration in hrs and or mins
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} minutes`;
};
// get multiple locations path using OSRM, wanted to implement others but time
const getGeoJSon = async () => {
  calculateNewMarkerLayer();
  calculatePointOfInterestsMarkerLayer();
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
  return data;
};
// this code took me a while to get, so frustrating but i did it: lol
// basically decode the poly line on the leaflet
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
// updates the map with the new poly line
const updateRoutePoly = async () => {
  appResourceStore.isMapLoading = true;
  appResourceStore.zIndex = 0;
  try {
    if (routeLayer.value) {
      appResourceStore.map.removeLayer(routeLayer.value);
      routeLayer.value = null;
    }
    // Get the route from OSRM
    const routeData = await getGeoJSon();
    const decodedRoute = decodePolyline(routeData.routes[0].geometry);
    // Create new polyline with the route and based on travel mode
    routeLayer.value = L.polyline(decodedRoute, mapStyle[travelMode.value]).addTo(
      map.value
    );

    // Fit bounds to show the entire route
    appResourceStore.map.fitBounds(routeLayer.value.getBounds(), {
      padding: [50, 50],
    });
    // emit success cause i like this my popup too much, please rate it too!
    $globalEmit("success", {
      prop: "Path generated successfully! Your road trip plan is a success",
      header: "Route found!",
    });
  } catch (error) {
    $globalEmit("error", { prop: error, header: "Route not found" });
  } finally {
    appResourceStore.isMapLoading = false;
  }
};
</script>

<style>
@import "leaflet/dist/leaflet.css";
@import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
</style>
