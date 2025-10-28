import { NativeType } from "@/constants/user";
import { BaseResponseDTO } from "@/models";

import { clientApi } from "./api";

export const uploadProfileImage = async (formData: FormData): Promise<BaseResponseDTO<string>> => {
  return clientApi.post("users/image", undefined, { body: formData });
};

export const checkNicknameDuplicate = async (
  nickname: string
): Promise<BaseResponseDTO<boolean>> => {
  return clientApi.get(`users/nickname/check?nickname=${nickname}`);
};

export const signup = async ({
  formData,
  body,
}: {
  formData: FormData | undefined;
  body: { nickname: string; term?: NativeType };
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.post("users", body, { body: formData });
};

export const updateUserNickname = async (nickname: string): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.patch("users/nickname", { nickname });
};
