"use client";

import CourseCard from "@/components/common/card/course-card";
import SortDrawer from "@/components/common/drawer/sort-drawer";
import QueryTabNav from "@/components/query-tab-nav";
import { COURSE_CATEGORIES } from "@/constants/category";
import { useSearchRoad } from "@/lib/tanstack/query/search";

import { Loader2 } from "lucide-react";

interface SearchResultPageProps {
  sort: string;
  word: string;
  category: string;
}

const SORT_OPTIONS = [
  {
    name: "인기순",
    value: "popular",
  },
  {
    name: "최신순",
    value: "latest",
  },
  {
    name: "참여순",
    value: "participants",
  },
  {
    name: "조회순",
    value: "views",
  },
];

export default function SearchResultPage({ sort, category, word }: SearchResultPageProps) {
  const { data, isLoading, isError } = useSearchRoad({
    word,
    sortBy: sort || "popular",
    categoryId: category,
  });

  return (
    <main className="pb-navigation">
      <QueryTabNav navKey="category" navs={COURSE_CATEGORIES} />
      <SortDrawer options={SORT_OPTIONS} className="typo-regular mr-5 w-max self-end" />

      <section className="px-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-gray-500" />
            <p className="typo-medium mt-4 text-gray-500">검색 결과를 불러오는 중...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-6xl">😵</div>
            <p className="typo-medium mb-2">검색 중 오류가 발생했어요</p>
            <p className="typo-regular text-sm text-gray-500">잠시 후 다시 시도해주세요</p>
          </div>
        ) : data?.data.results && data?.data.results.length > 0 ? (
          data?.data.results.map((course) => (
            <CourseCard
              key={`course-item-${course.categoryId}-${course.roadId}`}
              href={`/courses/${course.roadId}`}
              {...course}
            />
          ))
        ) : (
          <p className="typo-medium py-10 text-center">검색 결과가 없어요.</p>
        )}
      </section>
    </main>
  );
}
