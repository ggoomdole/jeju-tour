import { Suspense } from "react";

import Fallback from "@/components/common/fallback";
import { ROAD } from "@/constants/road";
import { BaseResponseDTO } from "@/models";
import UploadCoursePage from "@/page/courses/upload";
import { serverApi } from "@/services/api";
import { RoadResponseDTO } from "@repo/types";

interface UploadCourseProps {
  searchParams: Promise<{
    tab: string;
    word: string;
    id: string;
    view: "private" | "duplicate";
  }>;
}

export default async function UploadCourse({ searchParams }: UploadCourseProps) {
  const resolvedSearchParams = await searchParams;

  let promisedReponse: Promise<BaseResponseDTO<RoadResponseDTO>> | undefined;

  if (resolvedSearchParams.id) {
    promisedReponse = serverApi.get<BaseResponseDTO<RoadResponseDTO>>(
      `road/${resolvedSearchParams.id}`,
      {
        next: {
          tags: [ROAD.DETAIL, resolvedSearchParams.id],
        },
      }
    );
  }

  return (
    <Suspense fallback={<Fallback text="순례길 정보를 불러오는 중..." />}>
      <UploadCoursePage {...resolvedSearchParams} promisedResponse={promisedReponse} />
    </Suspense>
  );
}
