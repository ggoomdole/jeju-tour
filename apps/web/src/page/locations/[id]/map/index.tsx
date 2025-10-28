"use client";

import { useEffect, useRef } from "react";

import Header from "@/components/common/header";
import { DEFAULT_MAP_ZOOM } from "@/constants/map";

interface LocationMapPageProps {
  id: string;
  lat: string;
  lng: string;
}

const MARKER = "/static/map-pin.png";

export default function LocationMapPage({ lat, lng }: LocationMapPageProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new window.Tmapv3.Map(mapContainerRef.current, {
        center: new window.Tmapv3.LatLng(+lat, +lng),
        zoom: DEFAULT_MAP_ZOOM,
        width: "100%",
        height: "100%",
        scaleBar: false,
      });

      new window.Tmapv3.Marker({
        position: new window.Tmapv3.LatLng(+lat, +lng),
        map,
        icon: MARKER,
        iconSize: new window.Tmapv3.Size(36, 36),
        title: "marker",
      });
    }
  }, []);

  return (
    <>
      <Header sticky />
      <main ref={mapContainerRef} className="flex-1" />;
    </>
  );
}
