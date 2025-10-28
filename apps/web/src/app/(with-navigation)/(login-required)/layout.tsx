import { redirect } from "next/navigation";

import { getCookie } from "@/utils/cookie";

export default async function LoginRequiredLayout({ children }: { children: React.ReactNode }) {
  const isTokenExist = await getCookie("jwtToken");

  if (!isTokenExist) {
    redirect("/");
  }

  return children;
}
