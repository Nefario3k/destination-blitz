export default {
  defaultLocation: {
    search: "",
    coordinates: null,
    searchResults: [],
    selectedRoute: {},
    isSearching: false,
    error: null,
    menu: false,
  },
  defaultAttractions: [
    {
      name: "Aso Rock Presidential Villa",
      coordinates: [9.0764, 7.4851],
    },
    {
      name: "National Mosque of Nigeria",
      coordinates: [9.0574, 7.4871],
    },
    {
      name: "Jabi Lake Mall",
      coordinates: [9.0649, 7.4543],
    },
    {
      name: "Nigerian National Merit Award House",
      coordinates: [9.073, 7.4914],
    },
    {
      name: "Millennium Park",
      coordinates: [9.077, 7.4795],
    },
    {
      name: "Nigerian National Assembly Complex",
      coordinates: [9.061, 7.492],
    },
    {
      name: "Nigerian Supreme Court",
      coordinates: [9.0596, 7.492],
    },
    {
      name: "Zuma Rock",
      coordinates: [9.1759, 7.3572],
    },
  ],
  defaultIcons: [
    {
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    },
    {
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    },
    {
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    },
  ],
  mapStyle: {
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
  },
};
