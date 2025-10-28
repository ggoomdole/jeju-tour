import { Suspense } from "react";

import Fallback from "@/components/common/fallback";
import Header from "@/components/common/header";
import { ROAD } from "@/constants/road";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import MyCoursesPage from "@/page/mypage/courses";
import { serverApi } from "@/services/api";
import { getParams } from "@/utils/params";

interface MyCoursesProps {
  searchParams: Promise<{
    category: string;
  }>;
}

export default async function MyCourses({ searchParams }: MyCoursesProps) {
  const { category } = await searchParams;

  const params = getParams({ categoryId: category });
  const promisedReponse = serverApi.get<BaseResponseDTO<RoadResponseDTO[]>>(
    `road/custom?${params}`,
    {
      next: {
        tags: [ROAD.MY_CUSTOM_ROADS, category],
      },
    }
  );

  return (
    <>
      <Header>나만의 순례길</Header>
      <Suspense fallback={<Fallback text="나만의 순례길을 불러오는 중..." />}>
        <MyCoursesPage promisedReponse={promisedReponse} />
      </Suspense>
    </>
  );
}
