import { ROAD } from "@/constants/road";
import { SPOT } from "@/constants/spot";
import { requestSpot, updateRequestSpots } from "@/services/spot";
import { revalidateTags } from "@/utils/revalidate";
import { useMutation } from "@tanstack/react-query";

import { invalidateQueries } from "..";

export const useRequestSpot = () => {
  return useMutation({
    mutationFn: requestSpot,
  });
};

export const useUpdateRequestSpots = ({
  id,
  setSelectedCourseIds,
}: {
  id: string;
  setSelectedCourseIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return useMutation({
    mutationFn: updateRequestSpots,
    onSuccess: () => {
      invalidateQueries([SPOT.REQUEST_SPOTS, id]);
      revalidateTags([ROAD.DETAIL, id]);
      setSelectedCourseIds([]);
    },
  });
};
