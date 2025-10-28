import Link from "next/link";

import Search from "@/assets/search.svg";
import FloatingNavButton from "@/components/common/button/floating-nav-button";
import Header from "@/components/common/header";
import CoursesPage from "@/page/courses";

interface CoursesPageProps {
  searchParams: Promise<{
    category: string;
    sort: string;
  }>;
}

export default async function Courses({ searchParams }: CoursesPageProps) {
  const { category, sort } = await searchParams;

  return (
    <>
      <Header
        logoHeader
        rightElement={
          <Link href="/search">
            <Search />
          </Link>
        }
        sticky
      />
      <CoursesPage category={category} sort={sort || "popular"} />
      <FloatingNavButton />
    </>
  );
}
