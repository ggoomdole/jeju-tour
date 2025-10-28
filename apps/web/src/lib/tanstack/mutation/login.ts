import { withdraw } from "@/services/login";
import { useMutation } from "@tanstack/react-query";

export const useWithdraw = () => {
  return useMutation({
    mutationFn: withdraw,
  });
};
