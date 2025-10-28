import { SpotDTO } from "@repo/types";

export interface NearbyTouristSpotResponseDTO {
  title: string;
  image: string;
  address: string;
  rating: number;
}

export interface RequestSpotResponseDTO {
  spot: SpotDTO;
  spotId: string;
  introSpot: string;
}
