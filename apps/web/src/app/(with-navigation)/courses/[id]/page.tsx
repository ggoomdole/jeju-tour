import { Suspense } from "react";

import Fallback from "@/components/common/fallback";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import CourseDetailPage from "@/page/courses/[id]";
import { serverApi } from "@/services/api";

interface CourseDetailProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    start: string;
    end: string;
  }>;
}

export default async function CourseDetail({ params, searchParams }: CourseDetailProps) {
  const { id } = await params;
  const { start, end } = await searchParams;

  const promisedReponse = serverApi.get<BaseResponseDTO<RoadResponseDTO>>(`road/${id}`);

  return (
    <Suspense fallback={<Fallback text="순례길 정보를 불러오는 중..." />}>
      <CourseDetailPage id={id} start={start} end={end} promisedResponse={promisedReponse} />
    </Suspense>
  );
}
