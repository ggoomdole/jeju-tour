import { Suspense } from "react";

import Fallback from "@/components/common/fallback";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import CourseRequestPage from "@/page/courses/[id]/request";
import { serverApi } from "@/services/api";

interface CourseRequestProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tab: string;
    word: string;
  }>;
}

export default async function CourseRequest({ params, searchParams }: CourseRequestProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const promisedResponse = serverApi.get<BaseResponseDTO<RoadResponseDTO>>(`road/${id}`);

  return (
    <Suspense fallback={<Fallback text="순례길 정보를 불러오는 중..." />}>
      <CourseRequestPage id={id} {...resolvedSearchParams} promisedResponse={promisedResponse} />
    </Suspense>
  );
}
