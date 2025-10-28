import { z } from "zod";

export const reviewLocationFormSchema = z.object({
  review: z.string().min(1, "후기를 입력해주세요."),
  images: z.instanceof(FileList).optional(),
  rating: z.number().min(1, "별점을 선택해주세요.").max(5, "별점을 선택해주세요."),
});

export type ReviewLocationForm = z.infer<typeof reviewLocationFormSchema>;
