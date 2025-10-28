import Link from "next/link";

import Search from "@/assets/search.svg";
import Header from "@/components/common/header";
import { USER } from "@/constants/user";
import { BaseResponseDTO } from "@/models";
import MypagePage from "@/page/mypage";
import { serverApi } from "@/services/api";
import { getCookie } from "@/utils/cookie";
import { userInfoDTO } from "@repo/types";

export default async function Mypage() {
  const isTokenExist = !!(await getCookie("jwtToken"));

  let user: userInfoDTO | null = null;
  if (isTokenExist) {
    const { data } = await serverApi.get<BaseResponseDTO<userInfoDTO>>("users", {
      next: { tags: [USER.GET_USER_INFO] },
    });
    user = data;
  }

  return (
    <>
      <Header
        logoHeader
        rightElement={
          <Link href="/search">
            <Search />
          </Link>
        }
      />
      <MypagePage user={user} />
    </>
  );
}
