import { TMap, TMapLatLng, TMapLatLngBounds, TMapMarkerOptions, TMapPoint, TMapSize } from "./tmap";

declare global {
  interface Window {
    Tmapv3: {
      // 기본 지도 클래스
      Map: new (
        element: HTMLElement | string,
        options?: {
          width?: string | number; // 맵의 넓이를 설정합니다.
          height?: string | number; // 맵의 높이를 설정합니다.
          center?: TMapLatLng; // 맵의 중심 좌표를 설정합니다.
          zoom?: number; // 맵의 줌레벨을 설정합니다.
          bearing?: number; // 맵의 방향을 설정합니다.(0~360)
          pitch?: number; // 맵의 기울기를 설정합니다.(0~60)
          minZoom?: number; // 최소 줌레벨을 설정합니다.
          maxZoom?: number; // 최대 줌레벨을 설정합니다.
          minPitch?: number; // 최소 기울기를 설정합니다.
          maxPitch?: number; // 최대 기울기를 설정합니다.
          bounds?: TMapLatLngBounds; // 맵의 초기 표출 영역을 설정합니다.
          maxBounds?: TMapLatLngBounds; // 맵의 최대 표출 영역을 설정합니다.
          naviControl?: boolean; // 맵의 줌컨트롤 여부를 설정합니다.
          scaleBar?: boolean; // 맵의 스케일바 사용 여부를 설정합니다.
        }
      ) => TMap;

      // 좌표 클래스
      LatLng: new (lat: number, lng: number) => TMapLatLng;

      // 경계 클래스
      LatLngBounds: new (southWest: TMapLatLng, northEast: TMapLatLng) => TMapLatLngBounds;

      // 크기 클래스
      Size: new (width: number, height: number) => TMapSize;

      // 포인트 클래스
      Point: new (x: number, y: number) => TMapPoint;

      // 마커 클래스
      Marker: new (options?: TMapMarkerOptions) => TMapMarker;

      // 폴리라인 클래스
      Polyline: new (options?: TMapPolylineOptions) => TMapPolyline;
    };
  }
}

export {};
