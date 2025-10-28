import { BaseResponseDTO } from "@/models";
import { SearchRoadResponseDTO } from "@/models/road";
import { getParams } from "@/utils/params";

import { clientApi } from "./api";

export const searchRoad = async (props: { word: string; sortBy: string; categoryId: string }) => {
  const params = getParams(props);
  return clientApi.get<BaseResponseDTO<SearchRoadResponseDTO>>(`search/road?${params}`);
};

export const removeRecentSearch = async (word: string) => {
  return clientApi.delete("search/delete", {
    json: {
      word,
    },
  });
};

export const clearAllRecentSearch = async () => {
  return clientApi.delete("search/delete/all");
};

export const getRecentSearchWords = async () => {
  return clientApi.get<BaseResponseDTO<string[]>>("search/recent");
};
