import { Suspense } from "react";
import Link from "next/link";

import Search from "@/assets/search.svg";
import Fallback from "@/components/common/fallback";
import Header from "@/components/common/header";
import { ROAD } from "@/constants/road";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import ParticipationsPage from "@/page/participations";
import { serverApi } from "@/services/api";
import { getParams } from "@/utils/params";

interface ParticipationsProps {
  searchParams: Promise<{
    tab: string;
    sort: string;
  }>;
}

export default async function Participations({ searchParams }: ParticipationsProps) {
  const { tab, sort } = await searchParams;

  const isCreatTab = Boolean(tab);

  const params = getParams({
    maker: isCreatTab,
    categoryId: sort,
  });
  const promisedReponse = serverApi.get<BaseResponseDTO<RoadResponseDTO[]>>(
    `road/participation?${params}`,
    {
      next: {
        tags: [ROAD.PARTICIPATIONS, tab, sort],
      },
    }
  );

  return (
    <>
      <Header
        logoHeader
        rightElement={
          <Link href="/search">
            <Search />
          </Link>
        }
      />
      <Suspense fallback={<Fallback text="순례길을 불러오는 중..." />}>
        <ParticipationsPage isCreatTab={isCreatTab} promisedReponse={promisedReponse} />
      </Suspense>
    </>
  );
}
