import { Usable, use } from "react";
import Image from "next/image";
import Link from "next/link";

import ArrowRight from "@/assets/arrow-right.svg";
import CourseCard from "@/components/common/card/course-card";
import { Carousel, CarouselItem } from "@/components/common/carousel";
import NearbyTouristSpotList from "@/components/home/nearby-tourist-spot-list";
import QueryTabNav from "@/components/query-tab-nav";
import { COURSE_CATEGORIES } from "@/constants/category";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";

const carouselExample = "/static/carousel-example.png";

interface HomePageProps {
  promisedResponse: Usable<BaseResponseDTO<RoadResponseDTO[]>>;
}

export default function HomePage({ promisedResponse }: HomePageProps) {
  const response = use(promisedResponse);

  return (
    <main className="pb-navigation">
      <Carousel className="py-5" interval={5000}>
        <CarouselItem className="rounded-2xl p-4 shadow-lg">
          <h1 className="typo-bold">
            꿈돌이님,
            <br />
            오늘 어떤 길을
            <br /> 걸어볼까요?
          </h1>
          <p>
            지금 바로 특별한 <span className="text-main-900 typo-medium">순례길</span>에
            참여해보세요!
          </p>
        </CarouselItem>
        <CarouselItem className="relative overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={carouselExample}
            alt="carousel-example"
            fill
            className="object-cover"
            draggable={false}
          />
        </CarouselItem>
      </Carousel>
      <section className="flex items-center gap-2.5 px-5">
        <h2 className="typo-semibold">추천 순례길</h2>
        <Link href="/courses" className="flex items-center text-gray-700">
          <p className="typo-regular">자세히</p>
          <ArrowRight className="size-3" />
        </Link>
      </section>
      <QueryTabNav navKey="category" navs={COURSE_CATEGORIES} />
      <section className="px-5">
        {response.data.length > 0 ? (
          response.data.map((course) => (
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
      <section className="p-5">
        <h2 className="typo-semibold">주변 관광지 추천</h2>
        <NearbyTouristSpotList />
      </section>
    </main>
  );
}
