import { Usable, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FloatingButton from "@/components/common/button/floating-button";
import LocationInputCard from "@/components/common/card/location-input-card";
import Header from "@/components/common/header";
import { useRequestSpot } from "@/lib/tanstack/mutation/spot";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import { RequestCourseForm } from "@/schemas/course";
import { getParams } from "@/utils/params";
import { errorToast, successToast } from "@/utils/toast";

import { useFieldArray, UseFormReturn } from "react-hook-form";

interface RequestTabProps {
  id: string;
  query: string;
  form: UseFormReturn<RequestCourseForm>;
  promisedResponse: Usable<BaseResponseDTO<RoadResponseDTO>>;
}

const DEFAULT_THUMBNAIL = "/static/default-thumbnail.png";

export default function RequestTab({ id, query, form, promisedResponse }: RequestTabProps) {
  const params = getParams({ query }, { tab: "find-by-map" });
  const { data } = use(promisedResponse);

  const router = useRouter();

  const { mutateAsync: requestSpot } = useRequestSpot();

  const { fields, update, remove } = useFieldArray({
    control: form.control,
    name: "places",
    keyName: "fieldId",
  });

  const { formState } = form;
  const { isValid } = formState;

  const submitDisabled = !isValid || fields.length === 0;

  const onChangeReason = (index: number, reason: string) => {
    update(index, {
      ...fields[index],
      reason,
    });
  };

  const onSubmit = async () => {
    if (!isValid) return;

    const values = form.getValues();
    const spots = values.places.map((place, idx) => ({
      spotId: place.placeId,
      addNumber: idx + 1,
      addReason: place.reason,
      spotInfo: {
        name: place.placeName,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
      },
    }));
    try {
      await requestSpot({
        roadId: +id,
        spots,
      });
      successToast("순례길 추가를 요청했어요.");
      router.push(`/courses/${id}`);
    } catch (error) {
      console.error(error);
      errorToast("순례길 추가를 요청하는데 실패했어요.");
    }
  };

  return (
    <>
      <Header>순례길 추가 요청</Header>
      <main>
        <div className="flex items-center gap-2.5 px-5 py-3">
          <Image
            src={data.imageUrl || DEFAULT_THUMBNAIL}
            alt={data.title}
            width={40}
            height={40}
            className="aspect-square shrink-0 rounded-sm"
          />
          <div className="space-y-1 text-start">
            <h1 className="typo-semibold line-clamp-1">{data.title}</h1>
            <p className="typo-regular line-clamp-1">{data.intro}</p>
          </div>
        </div>
        {fields.map((place, index) => (
          <div
            key={`${place.placeName}-${index}`}
            className="flex items-center gap-2.5 px-5 py-2.5"
          >
            <p className="bg-main-900 typo-regular flex aspect-square size-6 shrink-0 items-center justify-center rounded-full text-white">
              {index + 1}
            </p>
            <LocationInputCard
              placeName={place.placeName}
              value={place.reason}
              onChange={(e) => onChangeReason(index, e.target.value)}
              placeholder="추가 요청 사유를 작성해주세요"
              onRemove={() => remove(index)}
            />
          </div>
        ))}
        <Link
          href={`?${params}`}
          className="typo-regular mx-auto w-max py-2.5 text-center text-gray-500 underline"
        >
          순례길 요청 추가하기
        </Link>
      </main>
      <FloatingButton onClick={onSubmit} disabled={submitDisabled}>
        순례길 추가 요청 보내기
      </FloatingButton>
    </>
  );
}
