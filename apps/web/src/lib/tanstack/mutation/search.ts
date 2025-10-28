import { clearAllRecentSearch, removeRecentSearch } from "@/services/search";
import { useMutation } from "@tanstack/react-query";

export const useRemoveRecentSearch = () => {
  return useMutation({
    mutationFn: removeRecentSearch,
  });
};

export const useClearAllRecentSearch = () => {
  return useMutation({
    mutationFn: clearAllRecentSearch,
  });
};
