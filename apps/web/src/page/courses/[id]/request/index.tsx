"use client";

import { Usable } from "react";

import FindByMapTab from "@/components/common/map/find-by-map-tab";
import RequestTab from "@/components/courses/request/request-tab";
import { BaseResponseDTO } from "@/models";
import { RoadResponseDTO } from "@/models/road";
import { RequestCourseForm, requestCourseFormSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";

interface CourseRequestPageProps {
  id: string;
  tab: string;
  word: string;
  promisedResponse: Usable<BaseResponseDTO<RoadResponseDTO>>;
}

export default function CourseRequestPage({
  id,
  tab,
  word,
  promisedResponse,
}: CourseRequestPageProps) {
  const form = useForm<RequestCourseForm>({
    mode: "onChange",
    resolver: zodResolver(requestCourseFormSchema),
    defaultValues: { places: [] },
  });

  const { append } = useFieldArray({
    control: form.control,
    name: "places",
  });

  const currentPlaces = form.getValues("places");

  switch (tab) {
    case "find-by-map":
      return (
        <FindByMapTab query={word} tab={tab} currentPlaces={currentPlaces} onSelectPlace={append} />
      );
    default:
      return <RequestTab id={id} query={word} form={form} promisedResponse={promisedResponse} />;
  }
}
