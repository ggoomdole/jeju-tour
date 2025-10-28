"use client";

import { useSearchTmap } from "@/lib/tanstack/mutation/tmap";
import { useGetNearbyTouristSpots } from "@/lib/tanstack/query/spot";
import { NearbyTouristSpotResponseDTO } from "@/models/spot";

import NearbyTouristSpotItem from "./nearby-tourist-spot-item";

export default function NearbyTouristSpotList() {
  const { data } = useGetNearbyTouristSpots();
  const { mutateAsync: searchTmap, isPending } = useSearchTmap();

  const onRouteToLocation = async (tourist: NearbyTouristSpotResponseDTO) => {
    await searchTmap(tourist);
  };

  return data && data.data.length > 0 ? (
    <div className="flex gap-5 overflow-x-auto px-2 py-5">
      {data.data.map((tourist) => (
        <NearbyTouristSpotItem
          key={`tourist-spot-item-${tourist.title}`}
          onRouteToLocation={() => onRouteToLocation(tourist)}
          {...tourist}
          disabled={isPending}
        />
      ))}
    </div>
  ) : (
    <p className="typo-medium py-10 text-center">주변 관광지 추천이 없어요.</p>
  );
}
