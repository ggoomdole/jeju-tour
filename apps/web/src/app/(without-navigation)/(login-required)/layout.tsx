import { redirect } from "next/navigation";

import { getCookie } from "@/utils/cookie";
import { infoToast } from "@/utils/toast";

export default async function LoginRequiredLayout({ children }: { children: React.ReactNode }) {
  const isTokenExist = await getCookie("jwtToken");

  if (!isTokenExist) {
    infoToast("로그인 후 이용해주세요.");
    redirect("/home");
  }

  return children;
}
