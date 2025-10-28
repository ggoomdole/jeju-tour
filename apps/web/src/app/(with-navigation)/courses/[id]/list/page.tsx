import { Suspense } from "react";

import Fallback from "@/components/common/fallback";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import CourseDetailListPage from "@/page/courses/[id]/list";
import { serverApi } from "@/services/api";
import { getParams } from "@/utils/params";

interface CourseDetailListProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    sort: string;
  }>;
}

export default async function CourseDetailList({ params, searchParams }: CourseDetailListProps) {
  const { id } = await params;
  const { sort } = await searchParams;

  const queryParams = getParams({ sortBy: sort });

  const promisedReponse = serverApi.get<BaseResponseDTO<RoadResponseDTO>>(
    `road/${id}?${queryParams}`
  );

  return (
    <Suspense fallback={<Fallback text="순례길 목록을 불러오는 중..." />}>
      <CourseDetailListPage id={id} promisedResponse={promisedReponse} />
    </Suspense>
  );
}
