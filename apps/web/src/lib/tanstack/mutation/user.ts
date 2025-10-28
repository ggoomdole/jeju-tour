import {
  checkNicknameDuplicate,
  signup,
  updateUserNickname,
  uploadProfileImage,
} from "@/services/user";
import { useMutation } from "@tanstack/react-query";

export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: uploadProfileImage,
  });
};

export const useCheckNicknameDuplicate = () => {
  return useMutation({
    mutationFn: checkNicknameDuplicate,
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
  });
};

export const useUpdateUserNickname = () => {
  return useMutation({
    mutationFn: updateUserNickname,
  });
};
