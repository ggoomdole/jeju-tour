import Link from "next/link";

import LocationInputCard from "@/components/common/card/location-input-card";
import { CoursePlaceProps } from "@/types/course";
import { getParams } from "@/utils/params";

interface DefaultModeProps {
  id?: string;
  fields: CoursePlaceProps[];
  view: "private" | "duplicate";
  onChangeReason: (index: number, reason: string) => void;
  remove: (index: number) => void;
}

export default function DefaultMode({
  id,
  fields,
  view,
  onChangeReason,
  remove,
}: DefaultModeProps) {
  const params = getParams({ tab: "find-by-map", id, view });

  return (
    <>
      {fields.length > 0 ? (
        fields.map((place, index) => (
          <div key={place.placeName} className="flex items-center gap-2.5 px-5 py-2.5">
            <p className="bg-main-900 typo-regular flex aspect-square size-6 shrink-0 items-center justify-center rounded-full text-white">
              {index + 1}
            </p>
            <LocationInputCard
              placeName={place.placeName}
              value={place.reason}
              onChange={(e) => onChangeReason(index, e.target.value)}
              placeholder="장소에 대해 설명해주세요"
              onRemove={() => remove(index)}
            />
          </div>
        ))
      ) : (
        <div className="my-3 flex flex-col items-center gap-2.5">
          <p className="text-6xl">🫥</p>
          <p className="typo-medium text-center text-gray-700">최소 3개의 장소를 추가해주세요</p>
        </div>
      )}
      <Link
        href={`?${params}`}
        className="typo-regular mx-auto mb-2.5 w-max py-2.5 text-center text-gray-500 underline"
      >
        순례길 추가하기
      </Link>
    </>
  );
}
