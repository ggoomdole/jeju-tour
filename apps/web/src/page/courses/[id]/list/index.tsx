"use client";

import { Usable, use } from "react";
import Image from "next/image";

import LocationCard from "@/components/common/card/location-card";
import SortDrawer from "@/components/common/drawer/sort-drawer";
import Header from "@/components/common/header";
import FloatingActionButton from "@/components/courses/floating-action-button";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";

interface CourseDetailListPageProps {
  id: string;
  promisedResponse: Usable<BaseResponseDTO<RoadResponseDTO>>;
}

const SORT_OPTIONS = [
  {
    name: "코스순",
    value: "",
  },
  {
    name: "후기순",
    value: "review", // 리뷰 개수가 많은 순서
  },
  {
    name: "평점순",
    value: "popular", // 평점이 높은 순서
  },
];

const DEFAULT_THUMBNAIL = "/static/default-thumbnail.png";

export default function CourseDetailListPage({ id, promisedResponse }: CourseDetailListPageProps) {
  const { data } = use(promisedResponse);

  return (
    <>
      <Header rightElement={<SortDrawer options={SORT_OPTIONS} className="typo-regular" />} sticky>
        <div className="flex items-center gap-2.5">
          <Image
            src={data.imageUrl || DEFAULT_THUMBNAIL}
            alt={data.title}
            width={40}
            height={40}
            className="aspect-square shrink-0 rounded-sm"
          />
          <div className="space-y-1 text-start">
            <h1 className="typo-semibold line-clamp-1">{data.title}</h1>
            <p className="typo-regular line-clamp-1">{data.intro}</p>
          </div>
        </div>
      </Header>
      <main className="pb-navigation relative gap-2.5 px-5 pt-2.5">
        {data.spots.map((spot) => (
          <LocationCard key={spot.spotId} {...spot} />
        ))}
      </main>
      <FloatingActionButton id={id} isParticipate={data.isParti} />
    </>
  );
}
