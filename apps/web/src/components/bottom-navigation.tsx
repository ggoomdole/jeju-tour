"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Home from "@/assets/home.svg";
import Inbox from "@/assets/inbox.svg";
import List from "@/assets/list.svg";
import User from "@/assets/user.svg";
import { cn } from "@/lib/utils";

const BOTTOM_NAVS = [
  {
    icon: Home,
    href: "/home",
  },
  {
    icon: List,
    href: "/courses",
  },
  {
    icon: Inbox,
    href: "/participations",
  },
  {
    icon: User,
    href: "/mypage",
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="max-w-mobile h-navigation shadow-layout fixed bottom-0 z-50 flex w-full bg-white">
      {BOTTOM_NAVS.map((nav) => (
        <div
          key={nav.href}
          className={cn(
            "flex h-full flex-1 items-center justify-center text-gray-500",
            pathname.startsWith(nav.href) && "text-gray-900"
          )}
        >
          <Link href={nav.href}>
            <nav.icon />
          </Link>
        </div>
      ))}
    </nav>
  );
}
