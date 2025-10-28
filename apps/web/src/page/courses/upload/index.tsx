"use client";

import { Usable, use, useEffect, useState } from "react";

import FindByMapTab from "@/components/common/map/find-by-map-tab";
import CreateTab from "@/components/courses/upload/create-tab";
import { BaseResponseDTO } from "@/models";
import { UploadCourseForm, uploadCourseFormSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoadResponseDTO } from "@repo/types";

import { useFieldArray, useForm } from "react-hook-form";

interface UploadCoursePageProps {
  tab: string;
  word: string;
  id: string;
  view: "private" | "duplicate";
  promisedResponse: Usable<BaseResponseDTO<RoadResponseDTO>> | undefined;
}

const DEFAULT_VALUES = {
  title: "",
  imageUrl: null,
  categoryId: 0,
  intro: "",
  spots: [],
  removeCourseIds: [],
};

export default function UploadCoursePage({
  tab,
  word,
  id,
  view,
  promisedResponse,
}: UploadCoursePageProps) {
  const isEditCourse = !!id;
  const isPrivate = view === "private";

  const defaultValues = (() => {
    if (promisedResponse) {
      const { data } = use(promisedResponse);
      return {
        ...data,
        imageUrl: data.imageUrl ? new File([], data.imageUrl) : null,
        spots: data.spots.map((spot) => ({
          placeId: spot.spotId,
          placeName: spot.name,
          reason: spot.introSpot,
          address: spot.address,
          latitude: spot.latitude,
          longitude: spot.longitude,
        })),
      };
    }
    return DEFAULT_VALUES;
  })();

  const form = useForm<UploadCourseForm>({
    resolver: zodResolver(uploadCourseFormSchema),
    defaultValues,
  });

  const thumbnail = form.watch("imageUrl");
  const initialDuplicateStatus = Boolean(id) && view !== "duplicate";
  const initialTitle = promisedResponse ? use(promisedResponse).data.title : "";

  const [isNameAvailable, setIsNameAvailable] = useState(initialDuplicateStatus);
  const [previewImage, setPreviewImage] = useState<string | null>(() => {
    if (!thumbnail) return null;
    return thumbnail.name;
  });

  const { append } = useFieldArray({
    control: form.control,
    name: "spots",
  });

  const currentPlaces = form.getValues("spots");

  useEffect(() => {
    if (!isPrivate) {
      form.setValue("spots", defaultValues.spots);
    }
  }, [promisedResponse]);

  switch (tab) {
    case "find-by-map":
      return (
        <FindByMapTab
          query={word}
          tab={tab}
          currentPlaces={currentPlaces}
          id={id}
          view={view}
          onSelectPlace={append}
        />
      );
    default:
      return (
        <CreateTab
          id={id}
          form={form}
          isEditCourse={isEditCourse}
          isPrivate={isPrivate}
          view={view}
          previewImage={previewImage}
          initialTitle={initialTitle}
          isNameAvailable={isNameAvailable}
          setPreviewImage={setPreviewImage}
          setIsNameAvailable={setIsNameAvailable}
        />
      );
  }
}
