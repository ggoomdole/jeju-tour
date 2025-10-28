"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface QueryTabNavProps {
  /**
   * query params의 키 값
   */
  navKey: string;
  /**
   * 네비게이션 탭 목록
   * name: 탭에 표시될 이름, path: 쿼리 파라미터 값
   */
  navs: {
    name: string;
    path: string;
  }[];
}

const url = (key: string, path: string, searchParams: URLSearchParams) => {
  const newSearchParams = new URLSearchParams(searchParams);

  if (path) newSearchParams.set(key, path);
  else newSearchParams.delete(key);

  return `?${newSearchParams.toString()}`;
};

function QueryTabNavWithoutSuspense({ navKey, navs }: QueryTabNavProps) {
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get(navKey) || "";

  return (
    <nav className="relative py-2.5">
      <ul className="typo-regular flex">
        {navs.map((nav) => (
          <li
            key={nav.name}
            className={cn(
              "flex-1 border-b border-b-gray-100 py-1 text-center text-gray-300 transition-colors duration-200",
              currentStatus === nav.path && "text-main-900 border-b-main-900 border-b-2"
            )}
          >
            <Link replace href={url(navKey, nav.path, searchParams)}>
              {nav.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function QueryTabNav({ navKey, navs }: QueryTabNavProps) {
  return (
    <Suspense fallback={<></>}>
      <QueryTabNavWithoutSuspense navKey={navKey} navs={navs} />
    </Suspense>
  );
}
