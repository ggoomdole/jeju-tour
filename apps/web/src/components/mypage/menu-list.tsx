"use client";

import { MypageProvider } from "@/context/mypage-context";
import { userInfoDTO } from "@repo/types";

import MenuButton from "./menu-button";

interface MenuListProps {
  user: userInfoDTO | null;
  profileImage: string;
}

const MENUS = [
  {
    name: "나만의 순례길",
    value: "courses",
    type: "link" as const,
  },
  {
    name: "프로필 설정",
    value: "profile",
    type: "dialog" as const,
  },
  {
    name: "개인 정보 처리 방침",
    value: "privacy",
    type: "link" as const,
  },
  {
    name: "서비스 이용 약관",
    value: "terms",
    type: "link" as const,
  },
  {
    name: "탈퇴하기",
    value: "withdraw",
    type: "dialog" as const,
  },
  {
    name: "로그아웃",
    value: "logout",
    type: "dialog" as const,
  },
];

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

export default function MenuList({ user, profileImage }: MenuListProps) {
  const onLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  };
  return (
    <section className="rounded-t-5xl pb-navigation flex-1 bg-white p-5">
      {user ? (
        <MypageProvider nickname={user.nickName} profileImage={profileImage}>
          <ul className="typo-medium flex flex-col">
            {MENUS.map((menu) => (
              <MenuButton key={menu.value} {...menu} />
            ))}
          </ul>
        </MypageProvider>
      ) : (
        <button
          className="w-full border-b border-b-gray-100 px-1 py-5 text-start"
          onClick={onLogin}
        >
          로그인
        </button>
      )}
    </section>
  );
}
