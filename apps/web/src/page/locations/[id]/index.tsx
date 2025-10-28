"use client";

import Image from "next/image";
import Link from "next/link";

import { DragCarousel, DragCarouselItem } from "@/components/common/carousel/drag-carousel";
import Header from "@/components/common/header";
import CourseTab from "@/components/locations/course-tab";
import HomeTab from "@/components/locations/home-tab";
import ReviewTab from "@/components/locations/review-tab";
import QueryTabNav from "@/components/query-tab-nav";
import { useGetReviewsById } from "@/lib/tanstack/query/review";
import { GetDetailPOIDTO } from "@/models/tmap";

interface LocationsPageProps {
  id: string;
  tab: string;
  data: GetDetailPOIDTO;
  currentUserId: string | null;
}

const NAVS = [
  {
    name: "홈",
    path: "",
  },
  {
    name: "후기",
    path: "review",
  },
  {
    name: "주변 관광지",
    path: "course",
  },
];

export default function LocationsPage({ id, tab, data, currentUserId }: LocationsPageProps) {
  const { data: reviewData, isLoading, error } = useGetReviewsById(id);
  const isNotFoundError = error?.message.includes("404");

  const reviewImages = reviewData?.data?.reviews?.map((review) => review.imageUrls).flat();

  const renderTab = (tab: string) => {
    switch (tab) {
      case "review":
        return (
          <ReviewTab
            id={id}
            currentUserId={currentUserId}
            data={reviewData?.data}
            isLoading={isLoading}
            isNotFoundError={isNotFoundError ?? false}
          />
        );
      case "course":
        return (
          <CourseTab
            title={data.poiDetailInfo.name}
            lat={+data.poiDetailInfo.lat}
            lng={+data.poiDetailInfo.lon}
          />
        );
      default:
        return <HomeTab data={data} />;
    }
  };

  return (
    <>
      <Header sticky>
        <h1 className="typo-semibold line-clamp-1">장소 상세보기</h1>
      </Header>
      <main className="pb-navigation">
        <section className="bg-main-100 space-y-5 p-5">
          <div className="flex items-center justify-between gap-2.5">
            <div className="space-y-1">
              <h1 className="typo-semibold line-clamp-1 text-gray-700">
                {data.poiDetailInfo.name}
              </h1>
              <p className="typo-regular line-clamp-1 text-gray-500">
                {data.poiDetailInfo.bldAddr || "정보가 없어요."}
              </p>
            </div>
            <Link
              className="bg-main-300 typo-regular text-nowrap rounded-xl px-5 py-1 text-gray-500"
              href={`/locations/${id}/map?lat=${data.poiDetailInfo.lat}&lng=${data.poiDetailInfo.lon}`}
            >
              지도
            </Link>
          </div>
          {reviewData ? (
            <DragCarousel>
              <>
                {reviewImages?.slice(0, 10).map(
                  (imageUrl, idx) =>
                    imageUrl && (
                      <DragCarouselItem key={`${imageUrl}-${idx}`}>
                        <div className="aspect-thumbnail relative w-32 shrink-0 rounded-sm">
                          <Image
                            src={imageUrl}
                            alt="review-image"
                            fill
                            className="rounded-sm object-cover"
                          />
                        </div>
                      </DragCarouselItem>
                    )
                )}
                {reviewImages && reviewData.data.reviews.length > 10 && (
                  <DragCarouselItem>
                    <Link
                      href={`/locations/${id}?tab=review`}
                      className="aspect-thumbnail flex w-32 shrink-0 items-center justify-center rounded-sm bg-gray-100"
                    >
                      <div className="text-center">
                        <div className="typo-regular text-gray-600">더보기</div>
                        <div className="typo-caption text-gray-500">
                          +{(reviewData.data.reviews.length - 10).toLocaleString()}
                        </div>
                      </div>
                    </Link>
                  </DragCarouselItem>
                )}
              </>
            </DragCarousel>
          ) : (
            !isNotFoundError && (
              <div className="aspect-thumbnail w-32 shrink-0 animate-pulse rounded-sm bg-gray-300" />
            )
          )}
        </section>
        <section>
          <QueryTabNav navKey="tab" navs={NAVS} />
          {renderTab(tab)}
        </section>
      </main>
    </>
  );
}
