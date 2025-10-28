"use client";

import { useEffect, useRef } from "react";

import type { TMap, TMapMarker, TMapPolyline, TMapTransitResponse } from "@/types/tmap";

import Map, { type MapProps } from ".";

interface TransitRouteMapProps extends MapProps {
  transitData: TMapTransitResponse | null;
  isShowPathMode: boolean;
}

// 경로 그리기 함수
const drawTransitRoute = (map: TMap, transitData: TMapTransitResponse) => {
  // 기존 경로 제거를 위한 배열
  const polylines: TMapPolyline[] = [];
  const markers: TMapMarker[] = [];

  // 첫 번째 경로만 표시 (여러 경로가 있을 수 있음)
  const itinerary = transitData.metaData.plan.itineraries[0];

  if (!itinerary) return { polylines, markers };

  itinerary.legs.forEach((leg, index) => {
    const strokeColor = leg.mode === "WALK" ? "#666666" : `#${leg.routeColor}`;

    // 각 구간의 경로 그리기
    if (leg.steps && leg.steps.length > 0) {
      leg.steps.forEach((step) => {
        if (step.linestring) {
          // linestring을 좌표 배열로 변환
          const coordinates = step.linestring.split(" ").map((coord: string) => {
            const [lng, lat] = coord.split(",").map(Number);
            return new window.Tmapv3.LatLng(lat, lng);
          });

          // 경로 선 그리기
          const polyline = new window.Tmapv3.Polyline({
            path: coordinates,
            strokeColor,
            strokeWeight: 6,
            strokeOpacity: 0.8,
            map,
          });

          polylines.push(polyline);
        }
      });
    }

    // 버스나 지하철의 경우 passShape 사용
    if (leg.passShape && leg.passShape.linestring) {
      const coordinates = leg.passShape.linestring.split(" ").map((coord: string) => {
        const [lng, lat] = coord.split(",").map(Number);
        return new window.Tmapv3.LatLng(lat, lng);
      });

      const polyline = new window.Tmapv3.Polyline({
        path: coordinates,
        strokeColor,
        strokeWeight: 8,
        strokeOpacity: 0.9,
        map,
      });

      polylines.push(polyline);
    }

    // 시작점과 끝점 마커 추가
    const startMarker = new window.Tmapv3.Marker({
      position: new window.Tmapv3.LatLng(leg.start.lat, leg.start.lon),
      map,
      icon: index === 0 ? "/static/start-pin.png" : undefined, // 첫 번째 구간의 시작점만 특별한 아이콘
      iconSize: new window.Tmapv3.Size(40, 52),
      title: leg.start.name,
      zIndex: 99999,
    });

    const endMarker = new window.Tmapv3.Marker({
      position: new window.Tmapv3.LatLng(leg.end.lat, leg.end.lon),
      map,
      icon: index === itinerary.legs.length - 1 ? "/static/end-pin.png" : undefined, // 마지막 구간의 끝점만 특별한 아이콘
      iconSize: new window.Tmapv3.Size(40, 52),
      title: leg.end.name,
      zIndex: 99999,
    });

    markers.push(startMarker, endMarker);

    // 대중교통 정류장 마커 추가
    if (leg.passStopList && leg.passStopList.stationList) {
      leg.passStopList.stationList.forEach((station) => {
        const stationMarker = new window.Tmapv3.Marker({
          position: new window.Tmapv3.LatLng(+station.lat, +station.lon),
          map,
          icon: leg.mode === "SUBWAY" ? "●" : "○", // 지하철은 원형, 버스는 빈 원형
          iconSize: new window.Tmapv3.Size(12, 12),
          title: station.stationName,
        });

        markers.push(stationMarker);
      });
    }
  });

  return { polylines, markers };
};

// 지도 영역 자동 조정
const fitMapToRoute = (map: TMap, transitData: TMapTransitResponse) => {
  const itinerary = transitData.metaData.plan.itineraries[0];
  if (!itinerary) return;

  const bounds = new window.Tmapv3.LatLngBounds(
    new window.Tmapv3.LatLng(itinerary.legs[0].start.lat, itinerary.legs[0].start.lon),
    new window.Tmapv3.LatLng(
      itinerary.legs[itinerary.legs.length - 1].end.lat,
      itinerary.legs[itinerary.legs.length - 1].end.lon
    )
  );

  itinerary.legs.forEach((leg) => {
    // 시작점과 끝점을 경계에 추가
    bounds.extend(new window.Tmapv3.LatLng(leg.start.lat, leg.start.lon));
    bounds.extend(new window.Tmapv3.LatLng(leg.end.lat, leg.end.lon));

    // 정류장들도 경계에 추가
    if (leg.passStopList && leg.passStopList.stationList) {
      leg.passStopList.stationList.forEach((station) => {
        bounds.extend(new window.Tmapv3.LatLng(Number(station.lat), Number(station.lon)));
      });
    }
  });

  // 지도 영역 조정
  map.fitBounds(bounds, 100);
};

export default function TransitRouteMap(props: TransitRouteMapProps) {
  const { transitData, isShowPathMode, ...restProps } = props;

  const polylinesRef = useRef<TMapPolyline[]>([]);
  const markersRef = useRef<TMapMarker[]>([]);

  const resetPolylinesAndMarkers = () => {
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    markersRef.current.forEach((marker) => marker.setMap(null));
    polylinesRef.current = [];
    markersRef.current = [];
  };

  //   대중교통 데이터가 변경될 때 경로 그리기
  useEffect(() => {
    if (restProps.mapInstanceRef.current && transitData && isShowPathMode) {
      // 기존 경로와 마커 제거
      resetPolylinesAndMarkers();

      // 새로운 경로 그리기
      const { polylines, markers } = drawTransitRoute(
        restProps.mapInstanceRef.current,
        transitData
      );
      polylinesRef.current = polylines;
      markersRef.current = markers;

      // 지도 영역 자동 조정
      fitMapToRoute(restProps.mapInstanceRef.current, transitData);
    } else {
      resetPolylinesAndMarkers();
    }
  }, [transitData, isShowPathMode]);

  return <Map {...restProps} />;
}
