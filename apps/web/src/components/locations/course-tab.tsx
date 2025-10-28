"use client";

import Image from "next/image";

import { useSearchTmap } from "@/lib/tanstack/mutation/tmap";
import { useGetNearbyTouristSpots } from "@/lib/tanstack/query/spot";
import { NearbyTouristSpotResponseDTO } from "@/models/spot";

import { Loader2 } from "lucide-react";

const DEFAULT_THUMBNAIL = "/static/default-thumbnail.png";

interface CourseTabProps {
  title: string;
  lat: number;
  lng: number;
}

export default function CourseTab({ title, lat, lng }: CourseTabProps) {
  const { data, isLoading, isError } = useGetNearbyTouristSpots({ lat, lng });
  const { mutateAsync: searchTmap, isPending } = useSearchTmap();

  const filteredData = data?.data.filter((location) => location.title !== title);

  const onRouteToLocation = async (tourist: NearbyTouristSpotResponseDTO) => {
    await searchTmap(tourist);
  };

  return isLoading ? (
    <div className="flex flex-col items-center gap-2.5">
      <Loader2 className="size-5 animate-spin text-gray-500" />
      <p className="typo-regular text-gray-500">주변 관광지를 불러오는 중이에요.</p>
    </div>
  ) : isError ? (
    <div className="flex flex-col items-center gap-2.5">
      <p className="typo-regular text-gray-500">주변 관광지를 불러오지 못했어요.</p>
    </div>
  ) : (
    <section className="px-5">
      {filteredData?.map((location) => (
        <button
          key={location.title}
          className="flex w-full items-center gap-2.5 border-b border-b-gray-100 px-1 py-2.5 text-start"
          onClick={() => onRouteToLocation(location)}
          disabled={isPending}
        >
          <div className="relative">
            <Image
              src={location.image || DEFAULT_THUMBNAIL}
              alt={`${location.title}-thumbnail`}
              width={80}
              height={80}
              className="aspect-square rounded-sm object-cover"
            />
          </div>
          <div>
            <h2 className="typo-semibold line-clamp-1">{location.title}</h2>
            <p className="typo-medium line-clamp-1">{location.address}</p>
          </div>
        </button>
      ))}
    </section>
  );
}
