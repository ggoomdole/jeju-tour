import { ROAD } from "@/constants/road";
import { getAllRoads, getMyCustomRoads } from "@/services/road";
import { useQuery } from "@tanstack/react-query";

export const useGetAllRoads = (props: { categoryId: string; sortBy: string }) => {
  return useQuery({
    queryKey: [ROAD.ALL_ROADS, props.categoryId, props.sortBy],
    queryFn: () => getAllRoads(props),
  });
};

export const useGetMyCustomRoads = (categoryId: string) => {
  return useQuery({
    queryKey: [ROAD.MY_CUSTOM_ROADS, categoryId],
    queryFn: () => getMyCustomRoads(categoryId),
  });
};
