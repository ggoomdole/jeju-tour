import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO, UploadRoadResponseDTO } from "@/models/road";
import { getParams } from "@/utils/params";

import { clientApi } from "./api";

export const uploadRoad = async (props: {
  formData: FormData;
}): Promise<BaseResponseDTO<UploadRoadResponseDTO>> => {
  return clientApi.post("road", undefined, { body: props.formData });
};

export const checkRoadNameDuplicate = async (title: string): Promise<BaseResponseDTO<boolean>> => {
  return clientApi.get(`road/name?title=${title}`);
};

export const getAllRoads = async (props: {
  categoryId: string;
  sortBy: string;
}): Promise<BaseResponseDTO<RoadResponseDTO[]>> => {
  const params = getParams(props);
  return clientApi.get(`road?${params}`);
};

export const updateRoad = async (props: {
  formData: FormData;
  roadId: string;
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.patch(`road/${props.roadId}`, undefined, { body: props.formData });
};

export const getMyCustomRoads = async (
  categoryId: string
): Promise<BaseResponseDTO<RoadResponseDTO[]>> => {
  const params = getParams({ categoryId });
  return clientApi.get(`road/custom?${params}`);
};

export const createMyRoad = async (formData: FormData): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.post("road/custom", undefined, { body: formData });
};

export const participateRoad = async (
  roadId: string
): Promise<BaseResponseDTO<{ userId: number; pilgrimageId: number }>> => {
  return clientApi.post(`road/participation/${roadId}`);
};

export const removeRoad = async (roadId: string): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`road/${roadId}`);
};

export const withdrawRoad = async (roadId: string): Promise<BaseResponseDTO<number>> => {
  return clientApi.delete(`road/out/${roadId}`);
};
