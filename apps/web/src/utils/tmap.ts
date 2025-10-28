import { MAP } from "@/constants/map";
import type { TMapTransitResponse } from "@/types/tmap";

const TMAP_API_KEY = process.env.NEXT_PUBLIC_TMAP_API_KEY!;

interface TransitRequestProps {
  startX: string;
  startY: string;
  endX: string;
  endY: string;
}

/**
 * TMap 대중교통 경로 검색 API 호출
 */
export const fetchTransitRoute = async (
  params: TransitRequestProps
): Promise<TMapTransitResponse> => {
  const response = await fetch("https://apis.openapi.sk.com/transit/routes", {
    method: "POST",
    headers: {
      appKey: TMAP_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      format: "json",
      count: 1, // 첫 번째 경로만 가져오기
      ...params,
    }),
    next: {
      tags: [MAP.GET_TRANSIT_ROUTE, params.startX, params.startY, params.endX, params.endY],
    },
  });

  if (!response.ok) {
    throw new Error(`대중교통 경로 검색 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 위도/경도 좌표로 대중교통 경로 검색
 */
export const searchTransitRoute = async (
  props: TransitRequestProps
): Promise<TMapTransitResponse> => {
  return fetchTransitRoute(props);
};
