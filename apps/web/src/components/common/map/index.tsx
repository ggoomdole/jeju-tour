"use client";

import { useEffect, useRef } from "react";

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/constants/map";
import { cn } from "@/lib/utils";
import type { TMap, TMapMarker, TMapMarkerClickEvent, TMapPoi } from "@/types/tmap";

export interface MapProps {
  mapInstanceRef: React.RefObject<TMap | null>;
  markers?: TMapPoi[];
  selectedMarkerId?: string;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  className?: string;
  onClickMap?: () => void;
  onClickMarker?: (e: TMapMarkerClickEvent) => void;
  onDragEnd?: () => void;
  fitBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

const MARKER = "/static/map-pin.png";
const MARKER_SELECTED = "/static/onboarding/mini-ggoomdole.png";

const onClearMarkers = (markers: TMapMarker[]) => {
  markers.forEach((marker) => marker.setMap(null));
};

const onCreateMarkers = ({
  markers,
  map,
  selectedMarkerId,
  onClickMarker,
}: {
  markers: TMapPoi[];
  map: TMap;
  selectedMarkerId?: string;
  onClickMarker: (e: TMapMarkerClickEvent) => void;
}) => {
  const newMarkers: TMapMarker[] = [];

  markers.forEach((marker) => {
    const isSelected = selectedMarkerId === marker.id;
    const newMarker: TMapMarker = new window.Tmapv3.Marker({
      position: new window.Tmapv3.LatLng(
        +marker.newAddressList.newAddress[0].frontLat,
        +marker.newAddressList.newAddress[0].frontLon
      ),
      map,
      icon: isSelected ? MARKER_SELECTED : MARKER,
      iconSize: new window.Tmapv3.Size(isSelected ? 40 : 36, isSelected ? 52 : 36),
      title: marker.id.toString(),
      visible: true,
    });

    newMarker.on("Click", (e: TMapMarkerClickEvent) => {
      onClickMarker(e);
    });

    newMarkers.push(newMarker);
  });

  return newMarkers;
};

export default function Map({
  mapInstanceRef,
  markers,
  selectedMarkerId,
  center,
  zoom,
  className,
  onClickMap,
  onClickMarker,
  onDragEnd,
  fitBounds,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<TMapMarker[]>([]);
  const isMapInitializedRef = useRef(false);

  const onInitializeMap = () => {
    onClearMarkers(markersRef.current);

    if (markers) {
      markersRef.current = onCreateMarkers({
        markers: markers ?? [],
        map: mapInstanceRef.current!,
        selectedMarkerId,
        onClickMarker: onClickMarker ?? (() => {}),
      });
    }
  };

  useEffect(() => {
    if (mapContainerRef.current && !isMapInitializedRef.current) {
      mapInstanceRef.current = new window.Tmapv3.Map(mapContainerRef.current, {
        center: new window.Tmapv3.LatLng(
          center?.lat ?? DEFAULT_MAP_CENTER.lat,
          center?.lng ?? DEFAULT_MAP_CENTER.lng
        ),
        zoom: zoom ?? DEFAULT_MAP_ZOOM,
        width: "100%",
        height: "100%",
        scaleBar: false,
      });

      mapInstanceRef.current.on("Click", () => {
        onClickMap?.();
      });

      mapInstanceRef.current.on("DragEnd", () => {
        onDragEnd?.();
      });

      isMapInitializedRef.current = true;
    }

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      mapInstanceRef.current?.destroy();
      isMapInitializedRef.current = false;
    };
  }, []);

  // fitBounds가 변경될 때 지도 영역 조정
  useEffect(() => {
    if (mapInstanceRef.current && fitBounds && isMapInitializedRef.current) {
      const bounds = new window.Tmapv3.LatLngBounds(
        new window.Tmapv3.LatLng(fitBounds.south, fitBounds.west),
        new window.Tmapv3.LatLng(fitBounds.north, fitBounds.east)
      );

      mapInstanceRef.current.fitBounds(bounds, 100); // 100px 패딩으로 증가
    }
  }, [fitBounds]);

  useEffect(() => {
    if (mapInstanceRef.current && isMapInitializedRef.current) {
      onInitializeMap();
    }
  }, [markers, selectedMarkerId]);

  return <div ref={mapContainerRef} className={cn("flex-1", className)} />;
}
