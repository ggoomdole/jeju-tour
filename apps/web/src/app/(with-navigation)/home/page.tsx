import Link from "next/link";

import Search from "@/assets/search.svg";
import FloatingNavButton from "@/components/common/button/floating-nav-button";
import Header from "@/components/common/header";
import { ROAD } from "@/constants/road";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import HomePage from "@/page/home";
import { serverApi } from "@/services/api";
import { getParams } from "@/utils/params";

interface HomeProps {
  searchParams: Promise<{
    category: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category: categoryId } = await searchParams;

  const params = getParams({ categoryId });
  const promisedResponse = serverApi.get<BaseResponseDTO<RoadResponseDTO[]>>(
    `road/recommend?${params}`,
    {
      next: {
        tags: [ROAD.RECOMMEND, categoryId],
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
        sticky
      />
      <HomePage promisedResponse={promisedResponse} />
      <FloatingNavButton />
    </>
  );
}
