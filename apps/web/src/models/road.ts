import { NativeType } from "@/constants/user";
import type { SpotProps } from "@/types/road";
import { SpotReviewDTO } from "@repo/types";

export interface RoadResponseDTO {
  roadId: number;
  title: string;
  intro: string;
  imageUrl: string;
  categoryId: number;
  participants: number;
  native: NativeType;
  spots: SpotReviewDTO[];
  isParti: boolean;
}

export interface SearchRoadResponseDTO {
  results: RoadResponseDTO[];
}

export interface UploadRoadResponseDTO {
  roadId: number;
  title: string;
  intro: string;
  imageUrl: string | null;
  public: boolean;
  createAt: string;
  updateAt: string;
  categoryId: number;
  spots: SpotProps[];
  participants: {
    userId: number;
    type: boolean;
  }[];
}
