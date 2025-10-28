"use client";

import { Usable, use } from "react";

import CourseCard from "@/components/common/card/course-card";
import QueryTabNav from "@/components/query-tab-nav";
import { COURSE_CATEGORIES } from "@/constants/category";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";

interface MyCoursesPageProps {
  promisedReponse: Usable<BaseResponseDTO<RoadResponseDTO[]>>;
}

export default function MyCoursesPage({ promisedReponse }: MyCoursesPageProps) {
  const { data } = use(promisedReponse);

  return (
    <main>
      <QueryTabNav navKey="category" navs={COURSE_CATEGORIES} />
      <section className="px-5">
        {data.length > 0 ? (
          data.map((course) => (
            <CourseCard
              key={`course-item-${course.roadId}`}
              href={`/courses/upload?id=${course.roadId}&view=private`}
              isMyCourse
              {...course}
            />
          ))
        ) : (
          <p className="typo-medium py-10 text-center">등록된 순례길이 없어요.</p>
        )}
      </section>
    </main>
  );
}
