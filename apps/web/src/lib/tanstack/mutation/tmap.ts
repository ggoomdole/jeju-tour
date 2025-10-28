import { useRouter } from "next/navigation";

import { LOCATION } from "@/constants/location";
import { NearbyTouristSpotResponseDTO } from "@/models/spot";
import { TMapPoi } from "@/types/tmap";
import { infoToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";

const TMAP_API_KEY = process.env.NEXT_PUBLIC_TMAP_API_KEY;

const getLocationInfo = async (tourist: NearbyTouristSpotResponseDTO): Promise<string | null> => {
  const area = tourist.address.split(" ")[0];
  const encodedTitle = encodeURIComponent(area + " " + tourist.title);

  const res = await fetch(
    `https://apis.openapi.sk.com/tmap/pois?searchKeyword=${encodedTitle}&version=1&appKey=${TMAP_API_KEY}&count=150`,
    { next: { tags: [LOCATION.SEARCH, encodedTitle] } }
  );

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();
  const location = data.searchPoiInfo.pois.poi.find((poi: TMapPoi) => poi.name === tourist.title);

  const locationId = location ? location.id : data.searchPoiInfo.pois.poi[0].id;

  return locationId;
};

export const useSearchTmap = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: getLocationInfo,
    onSuccess: (locationId) => {
      if (locationId) {
        router.push(`/locations/${locationId}`);
      } else {
        infoToast("관광지 정보가 없어요.");
      }
    },
    onError: () => {
      infoToast("관광지 정보가 없어요.");
    },
  });
};
