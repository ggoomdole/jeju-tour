import { NativeType } from "@/constants/user";

import { z } from "zod";

export const signUpFormSchema = z.object({
  agreement: z.boolean().refine((value) => value === true),
  profileImage: z.instanceof(File).optional(),
  nickname: z.string().min(1).max(10),
  native: z.nativeEnum(NativeType).optional(),
});

export type SignUpForm = z.infer<typeof signUpFormSchema>;
