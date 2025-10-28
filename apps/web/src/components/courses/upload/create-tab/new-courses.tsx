import { useState } from "react";

import Checkbox from "@/components/checkbox";
import LocationInputCard from "@/components/common/card/location-input-card";
import { useUpdateRequestSpots } from "@/lib/tanstack/mutation/spot";
import { useGetRequestSpots } from "@/lib/tanstack/query/spot";

import { Loader2 } from "lucide-react";

interface NewCoursesProps {
  id: string;
}

export default function NewCourses({ id }: NewCoursesProps) {
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const { data: requestSpots, isLoading: isLoadingRequestSpots } = useGetRequestSpots(id);
  const { mutateAsync: updateRequestSpots } = useUpdateRequestSpots({ id, setSelectedCourseIds });

  const spots = requestSpots || [];

  const isAllChecked = selectedCourseIds.length === spots.length;

  const onToggleAllCheckbox = () => {
    if (isAllChecked) {
      setSelectedCourseIds([]);
    } else {
      setSelectedCourseIds(spots.map((course) => course.spot.spotId));
    }
  };

  const onToggleCheckbox = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
    } else {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const onAddCourses = async () => {
    if (selectedCourseIds.length === 0) return;

    await updateRequestSpots({
      roadId: id,
      approve: selectedCourseIds,
      reject: [],
    });
  };

  const onRemoveCourses = async () => {
    if (selectedCourseIds.length === 0) return;
    await updateRequestSpots({
      roadId: id,
      approve: [],
      reject: selectedCourseIds,
    });
  };

  return (
    <>
      <div className="flex items-end gap-5 py-2.5">
        <h2 className="typo-semibold">NEW</h2>
        <button className="typo-regular" onClick={onToggleAllCheckbox}>
          전체 {isAllChecked ? "해제" : "선택"}
        </button>
        <button className="typo-regular" onClick={onAddCourses}>
          추가하기
        </button>
        <button className="typo-regular" onClick={onRemoveCourses}>
          삭제하기
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        {isLoadingRequestSpots ? (
          <div className="flex flex-col items-center justify-center gap-2.5 py-5">
            <Loader2 className="size-4 animate-spin text-gray-500" />
            <span className="typo-regular">요청 들어온 장소 조회중...</span>
          </div>
        ) : spots.length > 0 ? (
          spots.map((place) => (
            <div
              key={`request-item-${place.spotId}`}
              className="flex items-center gap-2.5 px-5 py-2.5"
            >
              <Checkbox
                checked={selectedCourseIds.includes(place.spotId)}
                onChange={() => onToggleCheckbox(place.spotId)}
              />
              <LocationInputCard placeName={place.spot.name} value={place.introSpot} readOnly />
            </div>
          ))
        ) : (
          <div className="my-3 flex flex-col items-center gap-2.5">
            <p className="text-6xl">🫥</p>
            <p className="typo-medium text-center text-gray-700">추가할 장소가 없어요</p>
          </div>
        )}
      </div>
    </>
  );
}
