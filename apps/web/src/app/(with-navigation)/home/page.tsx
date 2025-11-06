import Link from "next/link";

import Search from "@/assets/search.svg";
import FloatingNavButton from "@/components/common/button/floating-nav-button";
import Header from "@/components/common/header";
import { JEJU } from "@/constants/jeju";
import { ROAD } from "@/constants/road";
import { BaseResponseDTO } from "@/models";
import { JejuRealtimeResponseDTO } from "@/models/jeju";
import { RoadResponseDTO } from "@/models/road";
import HomePage from "@/page/home";
import { serverApi } from "@/services/api";
import { getParams } from "@/utils/params";

import ky from "ky";

interface HomeProps {
  searchParams: Promise<{
    category: string;
    realtime: string;
  }>;
}

const JEJU_DATA_API_URL = process.env.JEJU_DATA_API_URL!;

export default async function Home({ searchParams }: HomeProps) {
  const { category: categoryId, realtime } = await searchParams;

  const realtimeType = realtime ?? "tour";

  const params = getParams({ categoryId });
  const promisedResponse = serverApi.get<BaseResponseDTO<RoadResponseDTO[]>>(
    `road/recommend?${params}`,
    {
      next: {
        tags: [ROAD.RECOMMEND, categoryId],
      },
    }
  );

  const realtimeResponse = ky
    .get<JejuRealtimeResponseDTO>(`${JEJU_DATA_API_URL}/kor/${realtimeType}/ranking.do`, {
      next: {
        tags: [JEJU.REALTIME, realtimeType],
        revalidate: 60 * 1000,
      },
    })
    .json();

  return (
    <>
      <Header
        logoHeader
        rightElement={
          <Link href="/search">
            <Search />
          </Link>
        }
        sticky
      />
      <HomePage promisedResponse={promisedResponse} realtimeResponse={realtimeResponse} />
      <FloatingNavButton />
    </>
  );
}
