"use server";

import { revalidatePath as nextRevalidatePath, revalidateTag } from "next/cache";

export const revalidateTags = async (tags: string[]) => {
  tags.forEach((tag) => revalidateTag(tag));
};

export const revalidatePath = async (path: string) => {
  nextRevalidatePath(path);
};
