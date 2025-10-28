import { SPOT } from "@/constants/spot";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getNearbyTouristSpots, getRequestSpots } from "@/services/spot";
import { useQuery } from "@tanstack/react-query";

export const useGetNearbyTouristSpots = (location?: { lat: number; lng: number }) => {
  const { latitude: userLat, longitude: userLon, loading } = useGeolocation();

  return useQuery({
    queryKey: [SPOT.NEARBY_TOURIST_SPOTS, location?.lat, location?.lng, userLat, userLon],
    queryFn: () =>
      getNearbyTouristSpots({ lat: location?.lat || userLat, lng: location?.lng || userLon }),
    enabled: !loading,
  });
};

export const useGetRequestSpots = (roadId?: string) => {
  return useQuery({
    queryKey: [SPOT.REQUEST_SPOTS, roadId],
    queryFn: () => getRequestSpots(roadId as string),
    enabled: !!roadId,
    select: (data) => data.data,
  });
};
