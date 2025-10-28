interface LatLng {
  lat: number;
  lng: number;
}

interface Spot {
  latitude: number;
  longitude: number;
}

const MAX_SPOTS_LENGTH = 5;

/**
 * 장소들의 중심점을 계산합니다.
 */
export const calculateCenter = (spots: Spot[]): LatLng => {
  if (spots.length === 0) {
    return { lat: 0, lng: 0 };
  }

  const total = spots.slice(0, MAX_SPOTS_LENGTH).reduce(
    (acc, spot) => ({
      lat: acc.lat + spot.latitude,
      lng: acc.lng + spot.longitude,
    }),
    { lat: 0, lng: 0 }
  );

  const spotsLength = Math.min(MAX_SPOTS_LENGTH, spots.length);

  return {
    lat: total.lat / spotsLength,
    lng: total.lng / spotsLength,
  };
};

/**
 * 장소들이 모두 보이도록 하는 경계를 계산합니다.
 */
export const calculateBounds = (
  spots: Spot[]
): { north: number; south: number; east: number; west: number } => {
  if (spots.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 };
  }

  const minLatitudes = spots.slice(0, MAX_SPOTS_LENGTH).map((spot) => spot.latitude - 0.001);
  const maxLatitudes = spots.slice(0, MAX_SPOTS_LENGTH).map((spot) => spot.latitude + 0.001);
  const minLongitudes = spots.slice(0, MAX_SPOTS_LENGTH).map((spot) => spot.longitude - 0.001);
  const maxLongitudes = spots.slice(0, MAX_SPOTS_LENGTH).map((spot) => spot.longitude + 0.001);

  return {
    north: Math.max(...maxLatitudes),
    south: Math.min(...minLatitudes),
    east: Math.max(...maxLongitudes),
    west: Math.min(...minLongitudes),
  };
};

/**
 * 경계를 기반으로 적절한 줌 레벨을 계산합니다.
 * TMap API의 줌 레벨 범위는 1-19입니다.
 */
export const calculateZoomLevel = (bounds: {
  north: number;
  south: number;
  east: number;
  west: number;
}): number => {
  const latDiff = bounds.north - bounds.south;
  const lngDiff = bounds.east - bounds.west;

  // 더 큰 차이를 기준으로 줌 레벨 계산
  const maxDiff = Math.max(latDiff, lngDiff);

  // 줌 레벨 계산 공식 (경험적 공식)
  // 작은 영역일수록 높은 줌 레벨, 큰 영역일수록 낮은 줌 레벨
  let zoomLevel = Math.floor(Math.log2(360 / maxDiff));

  // TMap API 줌 레벨 범위 제한 (1-19)
  zoomLevel = Math.max(1, Math.min(19, zoomLevel));

  // 장소가 1개인 경우 적절한 줌 레벨로 조정
  if (latDiff === 0 && lngDiff === 0) {
    zoomLevel = 15; // 기본 줌 레벨
  }

  return zoomLevel;
};

/**
 * 장소들을 모두 포함하는 중심점과 줌 레벨을 계산합니다.
 */
export const calculateMapView = (spots: Spot[]): { center: LatLng; zoom: number } => {
  const center = calculateCenter(spots);
  const bounds = calculateBounds(spots);
  const zoom = calculateZoomLevel(bounds);

  return { center, zoom };
};
