export interface MapOptions {
  zoomControl?: boolean;
}

export interface NewAddress {
  centerLat: string;
  centerLon: string;
  frontLat: string;
  frontLon: string;
  fullAddressRoad: string;
}

export interface NewAddressList {
  newAddress: NewAddress[];
}

export interface Poi {
  newAddressList: NewAddressList;
  id: string;
  pkey: string;
  name: string;
  noorLat: string;
  noorLon: string;
}

export interface Pois {
  poi: Poi[];
}

export interface SearchPoiInfo {
  totalCount: string;
  count: string;
  page: string;
  pois: Pois;
}

export interface TMap {
  setCenter: (latLng: TMapLatLng) => void;
  setZoomLimit: (minZoom: number, maxZoom: number) => void;
  setZoom: (zoomLevel: number) => void;
  setOptions: ({ zoomControl }: MapOptions) => void;
  getCenter: () => TMapLatLng;
  getBounds: () => TMapGetBounds;
  destroy: () => void;
  on: (eventType: EventType, listener: (event: TMapEvent) => void) => void;
  fitBounds: (
    bounds: TMapLatLngBounds,
    options: number | { left: number; top: number; right: number; bottom: number }
  ) => void;
}

interface TMapGetBounds {
  _ne: {
    _lat: number;
    _lng: number;
  };
  _sw: {
    _lat: number;
    _lng: number;
  };
}

export type EventType = "Click" | "DragEnd";

export interface TMapEvent {
  data: {
    lngLat: TMapLatLng;
  };
}

export interface TMapMarkerOptions {
  map: TMap;
  position: TMapLatLng;
  color?: string;
  anchor?: string;
  icon?: string;
  zIndex?: number;
  iconHTML?: string;
  iconSize?: TMapSize;
  offset?: TMapPoint;
  label?: string;
  labelSize?: string;
  opacity?: number;
  visible?: boolean;
  title?: string;
}

export interface TMapMarkerClickEvent {
  _marker_data: {
    options: TMapMarkerOptions;
  };
}

export interface TMapPolylineOptions {
  path: TMapLatLng[];
  map: TMap;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  direction?: boolean;
}

export interface TMapLatLng {
  lat: () => number;
  lng: () => number;
  _lat: number;
  _lng: number;
}

export interface TMapMarker {
  getPosition: () => TMapLatLng;
  getOffset: () => TMapPoint;
  getIconSize: () => TMapSize;
  getIcon: () => string;
  setMap: (map: TMap | null) => void;
  setPosition: (latLng: TMapLatLng) => void;
  setVisible: (visible: boolean) => void;
  on: (eventType: EventType, listener: (event: TMapMarkerClickEvent) => void) => void;
}

export interface TMapPolyline {
  setMap: (map: TMap | null) => void;
  getPath: () => TMapLatLng[];
}

export interface TMapSize {
  _width: number;
  _height: number;
}

export interface TmapAddressInfo {
  fullAddress: string;
}

export interface TmapResponse {
  searchPoiInfo: SearchPoiInfo;
}

export interface TmapReverseGeocodingResponse {
  addressInfo: TmapAddressInfo;
}

// 공식 문서 기반 타입 정의
export interface TMapLatLngBounds {
  getCenter(): TMapLatLng;
  getNorthEast(): TMapLatLng;
  getSouthWest(): TMapLatLng;
  contains(latLng: TMapLatLng): boolean;
  intersects(bounds: TMapLatLngBounds): boolean;
  extend(latLng: TMapLatLng): TMapLatLngBounds;
  union(bounds: TMapLatLngBounds): TMapLatLngBounds;
  isEmpty(): boolean;
  getWidth(): number;
  getHeight(): number;
  toString(): string;
}

export interface TMapPoint {
  getX(): number;
  getY(): number;
  setX(x: number): void;
  setY(y: number): void;
  clone(): TMapPoint;
  distanceTo(point: TMapPoint): number;
  equals(point: TMapPoint): boolean;
  toString(): string;
}

export interface TMapPoi {
  detailBizName: string;
  name: string;
  id: string;
  newAddressList: {
    newAddress: {
      frontLat: string;
      frontLon: string;
      fullAddressRoad: string;
    }[];
  };
}

export type TMapTransitMode =
  | "WALK"
  | "SUBWAY"
  | "BUS"
  | "EXPRESS BUS"
  | "TRAIN"
  | "AIRPLANE"
  | "FERRY";

export interface TMapTransitResponse {
  metaData: {
    requestParameters: {
      busCount: number;
      expressbusCount: number;
      subwayCount: number;
      airplaneCount: number;
      locale: string;
      endY: string;
      endX: string;
      wideareaRouteCount: number;
      subwayBusCount: number;
      startY: string;
      startX: string;
      ferryCount: number;
      trainCount: number;
      reqDttm: string;
    };
    plan: {
      itineraries: {
        fare: {
          regular: {
            totalFare: number;
            currency: {
              currency: string;
              currencyCode: string;
              symbol: string;
            };
          };
        };
        legs: {
          distance: number;
          end: {
            lat: number;
            lon: number;
            name: string;
          };
          mode: TMapTransitMode;
          sectionTime: number;
          start: {
            lat: number;
            lon: number;
            name: string;
          };
          steps: {
            description: string;
            distance: number;
            linestring: string;
            streetName: string;
          }[];
          passShape?: {
            linestring: string;
          };
          passStopList?: {
            stationList: {
              index: number;
              lat: string;
              lon: string;
              stationID: string;
              stationName: string;
            }[];
          };
          Lane?: {
            route: string;
            routeColor: string;
            routeId: string;
            service: number;
            type: number;
          }[];
          route?: string;
          routeColor?: string;
          routeId?: string;
          service?: number;
          type?: number;
        }[];
        pathType: number;
        totalDistance: number;
        totalTime: number;
        totalWalkDistance: number;
        totalWalkTime: number;
        transferCount: number;
      }[];
    };
  };
}
