"use client";

import { Usable, use } from "react";
import { useRouter } from "next/navigation";

import Close from "@/assets/close.svg";
import CourseCard from "@/components/common/card/course-card";
import { SEARCH } from "@/constants/search";
import { invalidateQueries } from "@/lib/tanstack";
import { useClearAllRecentSearch, useRemoveRecentSearch } from "@/lib/tanstack/mutation/search";
import { useGetRecentSearchWords } from "@/lib/tanstack/query/search";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";

interface SearchPageProps {
  isTokenExist: boolean;
  roadRecommendResponse: Usable<BaseResponseDTO<RoadResponseDTO[]>>;
}

export default function SearchPage({ isTokenExist, roadRecommendResponse }: SearchPageProps) {
  const roadRecommend = use(roadRecommendResponse);
  const { data: recentSearch } = useGetRecentSearchWords(isTokenExist);

  const router = useRouter();

  const { mutate: removeRecentSearch, isPending: isRemoveRecentSearchPending } =
    useRemoveRecentSearch();
  const { mutate: clearAllRecentSearch, isPending: isClearAllRecentSearchPending } =
    useClearAllRecentSearch();

  const isRemovePending = isRemoveRecentSearchPending || isClearAllRecentSearchPending;

  // 개별 검색어 삭제
  const onRemoveSearchKeyword = async (word: string) => {
    removeRecentSearch(word, {
      onSuccess: () => {
        invalidateQueries([SEARCH.RECENT]);
      },
    });
  };

  // 전체 검색어 삭제
  const onClearAllSearchKeywords = async () => {
    clearAllRecentSearch(undefined, {
      onSuccess: () => {
        invalidateQueries([SEARCH.RECENT]);
      },
    });
  };

  // 최근 검색어 클릭 시 검색 실행
  const onSearchKeywordClick = async (keyword: string) => {
    invalidateQueries([SEARCH.RECENT]);
    router.push(`/search?word=${encodeURIComponent(keyword)}`);
  };

  return (
    <main className="pb-navigation space-y-5 px-5 py-2.5">
      <section className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <h2 className="typo-semibold">최근 검색어</h2>
          {recentSearch && recentSearch.data.length > 0 && (
            <button
              onClick={onClearAllSearchKeywords}
              className="typo-regular text-gray-300 underline disabled:text-gray-400"
              disabled={isRemovePending}
            >
              전체 삭제
            </button>
          )}
        </div>
        <div className="flex flex-col items-start gap-1">
          {recentSearch && recentSearch.data.length > 0 ? (
            recentSearch.data.map((search) => (
              <div
                key={search}
                className="typo-regular flex items-center gap-1 rounded-sm border border-gray-300 px-2.5 py-1"
              >
                <button
                  className="disabled:text-gray-400"
                  onClick={() => onSearchKeywordClick(search)}
                  disabled={isRemovePending}
                >
                  {search}
                </button>
                <button onClick={() => onRemoveSearchKeyword(search)} disabled={isRemovePending}>
                  <Close className="size-3 disabled:text-gray-400" />
                </button>
              </div>
            ))
          ) : (
            <p className="typo-regular text-gray-400">최근 검색어가 없어요.</p>
          )}
        </div>
      </section>
      <section className="space-y-2.5">
        <h2 className="typo-semibold">추천 순례길</h2>
        {roadRecommend.data.length > 0 ? (
          roadRecommend.data.map((course) => (
            <CourseCard
              key={`course-item-${course.categoryId}-${course.roadId}`}
              href={`/courses/${course.roadId}`}
              {...course}
            />
          ))
        ) : (
          <p className="typo-medium py-10 text-center">추천 순례길이 없어요.</p>
        )}
      </section>
    </main>
  );
}
