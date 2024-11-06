export { };

declare global {
  interface UserLegMetrics {
    duration: number;
    distance: number;
  }
  interface UserLeg {
    metrics: Array<UserLegMetrics>;
    names: Array<string>;
  }
  interface RouteLeg {
    steps: Array<any>;
    summary: String;
    weight: number;
    duration: number;
    distance: number;
  }
  interface Locations {
    id: number;
    search: string;
    coordinates: any;
    searchResults: Array<SearchResult>;
    selectedRoute: SearchResult;
    isSearching: boolean;
    menu?: boolean;
    error: any;
  }
  interface SearchResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address?: any;
    boundingbox: Array<any>;
  }
  interface CustomChart {
    label: string;
    size: number;
    value: number;
  }
  interface DeleteContent {
    title: string;
    subText: string;
    deleteType: string;
    deleteObject: any;
    modalType?: string;
  }
  interface FilesPreview {
    id?: number;
    name: any;
    size: string | number;
    val: any;
    title?: string;
  }
  interface ImageSelectProps {
    multiple?: boolean;
    maxSize?: number;
    width?: number;
    height?: number;
  }
}
