import { BaseResponseDTO } from "@/models";
import { NearbyTouristSpotResponseDTO, RequestSpotResponseDTO } from "@/models/spot";
import { getParams } from "@/utils/params";
import { addSpotDTO } from "@repo/types";

import { clientApi, serverApi } from "./api";

export const getNearbyTouristSpots = async (props: {
  lat: number;
  lng: number;
}): Promise<BaseResponseDTO<NearbyTouristSpotResponseDTO[]>> => {
  const params = getParams(props);
  return serverApi.get(`spot/dataSpot?${params}`);
};

export const requestSpot = async (props: {
  roadId: number;
  spots: addSpotDTO[];
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.post("spot/add/req", props);
};

export const getRequestSpots = async (
  roadId: string
): Promise<BaseResponseDTO<RequestSpotResponseDTO[]>> => {
  return clientApi.get(`spot/add/check/${roadId}`);
};

export const updateRequestSpots = async (props: {
  roadId: string;
  approve: string[];
  reject: string[];
}): Promise<BaseResponseDTO<unknown>> => {
  const { roadId, ...restProps } = props;
  return clientApi.patch(`spot/add/accept/${roadId}`, restProps);
};
