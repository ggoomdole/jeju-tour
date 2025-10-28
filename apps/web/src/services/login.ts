import { getCookie } from "@/utils/cookie";

import ky from "ky";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const withdraw = async () => {
  const accessToken = await getCookie("accessToken");
  return ky
    .post(`${API_BASE_URL}/login/kakao/unlink`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json();
};
