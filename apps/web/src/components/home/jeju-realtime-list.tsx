import Image from "next/image";

import { REALTIME_CATEGORIES } from "@/constants/category";
import { JejuRealtimeLinkDataDTO, JejuRealtimeResponseDTO } from "@/models/jeju";

import { ExternalLink } from "lucide-react";

import { Carousel, CarouselItem } from "../common/carousel";
import QueryTabNav from "../query-tab-nav";

interface JejuRealtimeListProps {
  realtimeData: JejuRealtimeResponseDTO;
}

export default function JejuRealtimeList({ realtimeData }: JejuRealtimeListProps) {
  const chunkedRealtimeData = (() => {
    const chunkSize = 5;
    const chunks: JejuRealtimeLinkDataDTO[][] = [];
    for (let i = 0; i < realtimeData.linkData.length; i += chunkSize) {
      chunks.push(realtimeData.linkData.slice(i, i + chunkSize));
    }
    return chunks;
  })();

  return (
    <section className="py-5">
      <div className="mx-5 flex items-center justify-between">
        <h2 className="typo-semibold">실시간 관광객 유동인구</h2>
        <a
          target="_blank"
          href="https://data.ijto.or.kr/bigdatamap/jeju/widget/main.do"
          className="flex items-center gap-1"
        >
          <p className="typo-regular">자세히 보기</p>
          <ExternalLink className="size-4" />
        </a>
      </div>
      <QueryTabNav navKey="realtime" navs={REALTIME_CATEGORIES} />
      {realtimeData.linkData.length > 0 ? (
        <Carousel className="px-5 py-2.5" interval={0}>
          {chunkedRealtimeData.map((chunk, chunkIndex) => (
            <CarouselItem key={chunkIndex} className="px-0">
              <section className="space-y-2.5">
                {chunk.map((item, itemIndex) => {
                  const globalIndex = chunkIndex * 5 + itemIndex;
                  return (
                    <div key={item.contentsId} className="flex items-center gap-2.5">
                      <p className="typo-medium text-main-900">{globalIndex + 1}</p>
                      <div className="relative aspect-square size-14 overflow-hidden rounded-full">
                        <Image src={item.imgUrl} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="typo-semibold">{item.name}</h3>
                        <p className="typo-regular text-gray-500">
                          현재 {item.population.toLocaleString("ko-KR")}명이 방문 중이에요!
                        </p>
                      </div>
                    </div>
                  );
                })}
              </section>
            </CarouselItem>
          ))}
        </Carousel>
      ) : (
        <p className="typo-medium py-10 text-center">실시간 관광객 유동인구 데이터가 없어요.</p>
      )}
    </section>
  );
}
