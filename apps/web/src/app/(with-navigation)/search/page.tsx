import SearchHeader from "@/components/common/header/search-header";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import SearchPage from "@/page/search";
import SearchResultPage from "@/page/search/search-result";
import { serverApi } from "@/services/api";
import { getCookie } from "@/utils/cookie";

interface SearchProps {
  searchParams: Promise<{
    word: string;
    category: string;
    sort: string;
  }>;
}

export default async function Search({ searchParams }: SearchProps) {
  const resolvedSearchParams = await searchParams;
  const isTokenExist = !!(await getCookie("jwtToken"));

  const roadRecommendResponse = serverApi.get<BaseResponseDTO<RoadResponseDTO[]>>("road/recommend");

  return (
    <>
      <SearchHeader {...resolvedSearchParams} page="road" />
      {resolvedSearchParams.word ? (
        <SearchResultPage {...resolvedSearchParams} />
      ) : (
        <SearchPage isTokenExist={isTokenExist} roadRecommendResponse={roadRecommendResponse} />
      )}
    </>
  );
}
