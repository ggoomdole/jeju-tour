import { NativeType } from "@/constants/user";

export interface KakaoLoginResponseDTO {
  userId: number;
  accessToken: string;
  jwtToken: string;
  isFirstLogin: boolean;
}

export interface UserResponseDTO {
  nickName: string;
  profileImage: string;
  native: NativeType;
}
