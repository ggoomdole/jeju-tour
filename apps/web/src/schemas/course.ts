import { z } from "zod";

const courseSchema = z.object({
  placeName: z.string().min(1),
  reason: z.string().min(1),
  placeId: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export const requestCourseFormSchema = z.object({
  places: z.array(courseSchema).min(1),
});

export type RequestCourseForm = z.infer<typeof requestCourseFormSchema>;

export const uploadCourseFormSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.instanceof(File).nullable().optional(),
  categoryId: z.number(),
  intro: z.string().min(1),
  spots: z.array(courseSchema).min(3),
});

export type UploadCourseForm = z.infer<typeof uploadCourseFormSchema>;
