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
    // blue
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
    // red
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
    // green
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
    // gold
    {
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    },
    // black
    {
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    },
    // violet
    {
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    },
  ],
  mapStyle: {
    driving: {
      color: "blue",
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
  poiTypes: [
    // Food and Drink
    { label: "Restaurants", value: "restaurant" },
    { label: "Cafes", value: "cafe" },
    { label: "Bars", value: "bar" },
    { label: "Pubs", value: "pub" },
    { label: "Fast Food", value: "fast_food" },
    { label: "Ice Cream", value: "ice_cream" },
    { label: "Food Court", value: "food_court" },
    { label: "Biergarten", value: "biergarten" },

    // Accommodation
    { label: "Hotels", value: "hotel" },
    { label: "Hostels", value: "hostel" },
    { label: "Guest Houses", value: "guest_house" },
    { label: "Apartments", value: "apartments" },
    { label: "Camping Sites", value: "camp_site" },
    { label: "Caravan Sites", value: "caravan_site" },

    // Tourism and Entertainment
    { label: "Tourist Attractions", value: "tourism" },
    { label: "Museums", value: "museum" },
    { label: "Art Galleries", value: "gallery" },
    { label: "Theatres", value: "theatre" },
    { label: "Cinemas", value: "cinema" },
    { label: "Viewpoints", value: "viewpoint" },
    { label: "Theme Parks", value: "theme_park" },
    { label: "Zoo", value: "zoo" },
    { label: "Aquarium", value: "aquarium" },

    // Wellness and Healthcare
    { label: "Spas", value: "spa" },
    { label: "Massage Centers", value: "massage" },
    { label: "Fitness Centers", value: "fitness_centre" },
    { label: "Swimming Pools", value: "swimming_pool" },
    { label: "Pharmacies", value: "pharmacy" },
    { label: "Hospitals", value: "hospital" },
    { label: "Doctors", value: "doctors" },
    { label: "Dentists", value: "dentist" },

    // Shopping
    { label: "Shopping Malls", value: "mall" },
    { label: "Supermarkets", value: "supermarket" },
    { label: "Marketplaces", value: "marketplace" },
    { label: "Convenience Stores", value: "convenience" },
    { label: "Department Stores", value: "department_store" },
    { label: "Gift Shops", value: "gift_shop" },
    { label: "Bookshops", value: "bookshop" },

    // Sports and Recreation
    { label: "Sports Centers", value: "sports_centre" },
    { label: "Golf Courses", value: "golf_course" },
    { label: "Tennis Courts", value: "tennis" },
    { label: "Parks", value: "park" },
    { label: "Playgrounds", value: "playground" },
    { label: "Water Parks", value: "water_park" },
    { label: "Nature Reserves", value: "nature_reserve" },

    // Transportation
    { label: "Bus Stations", value: "bus_station" },
    { label: "Train Stations", value: "train_station" },
    { label: "Subway Stations", value: "subway_entrance" },
    { label: "Taxi Stands", value: "taxi" },
    { label: "Car Rental", value: "car_rental" },
    { label: "Bicycle Rental", value: "bicycle_rental" },
    { label: "Parking", value: "parking" },
    { label: "Fuel Stations", value: "fuel" },

    // Financial Services
    { label: "Banks", value: "bank" },
    { label: "ATMs", value: "atm" },
    { label: "Bureau de Change", value: "bureau_de_change" },

    // Education and Culture
    { label: "Libraries", value: "library" },
    { label: "Universities", value: "university" },
    { label: "Schools", value: "school" },
    { label: "Language Schools", value: "language_school" },
    { label: "Places of Worship", value: "place_of_worship" },

    // Services
    { label: "Post Offices", value: "post_office" },
    { label: "Police Stations", value: "police" },
    { label: "Fire Stations", value: "fire_station" },
    { label: "Tourist Information", value: "information" },
    { label: "Public Toilets", value: "toilets" },
    { label: "Laundry", value: "laundry" },
    { label: "Hair Salons", value: "hairdresser" },

    // Historic Sites
    { label: "Historic Buildings", value: "historic" },
    { label: "Monuments", value: "monument" },
    { label: "Castles", value: "castle" },
    { label: "Ruins", value: "ruins" },
    { label: "Archaeological Sites", value: "archaeological_site" },
    { label: "Memorials", value: "memorial" },

    // Natural Features
    { label: "Beaches", value: "beach" },
    { label: "Peaks", value: "peak" },
    { label: "Waterfalls", value: "waterfall" },
    { label: "Caves", value: "cave_entrance" },
    { label: "Springs", value: "spring" },
    { label: "Lakes", value: "water" },
  ],
  amenity: [
    "restaurant",
    "cafe",
    "bar",
    "pub",
    "fast_food",
    "ice_cream",
    "food_court",
    "biergarten",
    "pharmacy",
    "hospital",
    "doctors",
    "dentist",
    "spa",
    "massage",
    "fitness_centre",
    "swimming_pool",
    "bank",
    "atm",
    "police",
    "post_office",
    "toilets",
    "library",
  ],
  tourism: [
    "hotel",
    "hostel",
    "guest_house",
    "museum",
    "gallery",
    "viewpoint",
    "zoo",
    "theme_park",
    "aquarium",
    "information",
  ],
  leisure: [
    "sports_centre",
    "golf_course",
    "water_park",
    "park",
    "playground",
    "fitness_centre",
    "swimming_pool",
  ],
  shop: [
    "supermarket",
    "convenience",
    "mall",
    "department_store",
    "bookshop",
    "gift_shop",
  ],
  historic: ["monument", "memorial", "archaeological_site", "castle", "ruins"],
};
