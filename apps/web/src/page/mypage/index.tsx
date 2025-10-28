import Image from "next/image";

import MenuList from "@/components/mypage/menu-list";
import { userInfoDTO } from "@repo/types";

interface MypagePageProps {
  user: userInfoDTO | null;
}

const defaultProfileImage = "/static/default-profile.png";

export default function MypagePage({ user }: MypagePageProps) {
  const profileImage = user
    ? user.profileImage === "null"
      ? defaultProfileImage
      : user.profileImage
    : defaultProfileImage;

  return (
    <main className="bg-main-300">
      <section className="flex flex-col items-center justify-center gap-5 py-10">
        <Image
          src={profileImage}
          alt="default-profile"
          width={144}
          height={144}
          className="aspect-square rounded-full object-cover"
        />
        <p className="typo-bold">{user ? user.nickName : "비회원"}</p>
      </section>
      <MenuList user={user} profileImage={profileImage} />
    </main>
  );
}
