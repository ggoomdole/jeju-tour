export interface RoadRequestDTO {
  title: string;
  intro: string;
  categoryId: number;
  spots: SpotDTO[];
}

export interface RoadResponseDTO {
  roadId: number;
  title: string;
  intro: string;
  imageUrl: string | null;
  public: boolean;
  categoryId: number;

  spots: SpotDTO[];
  participants: ParticipantDTO[];

  createAt: Date;
  updateAt: Date;
}

export interface SpotDTO {
  spotId: string;
  number: number;
  introSpot: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  hours?: string;
  avgRate?: number;
}

export interface ParticipantDTO {
  userId: number;
  type: boolean;
}

export interface RoadListResponseDTO {
  roadId: number;
  title: string;
  intro: string;
  imageUrl: string | null;
  categoryId: number;
  participants: number;
  native?: Native | null;
}

export type Native = "SHORT_TERM" | "MID_TERM" | "LONG_TERM" | "RESIDENT";

export interface OneRoadResponseDTO {
  isParti: boolean;
  roadId: number;
  title: string;
  intro: string;
  imageUrl: string | null;
  categoryId: number;
  spots: SpotReviewDTO[];
}

export interface SpotReviewDTO {
  spotId: string;
  name: string;
  number: number;
  introSpot: string;
  avgReview: string;
  numReview: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface ReviewCreateDTO {
  spotId: string;
  content: string;
  rate: number;
  imageUrls?: string[];
}

export interface ReviewCheckDTO {
  reviewId: number;
  userId: number | null;
  nickname: string;
  profileImage: string | null;
  spotId: string;
  content: string;
  rate: number;
  imageUrls: string[] | null;
}

export interface AllReviewCheckDTO {
  spotId: string;
  reviewId: number;
  content: string;
  rate: number;
  imageUrls: string[];
  userId: number | null;
  nickname: string;
  profileImage: string | null;
}

export interface SpotReqDTO {
  roadId: number;
  spots: addSpotDTO[];
}

export interface addSpotDTO {
  spotId: string;
  addNumber: number;
  addReason: string;
  spotInfo: {
    name: string;
    phone?: string;
    address: string;
    latitude: number;
    longitude: number;
    hours?: string;
    avgRate?: number;
  };
}

export interface DataSpotDTO {
  title: string;
  image: string | null;
  address: string;
  rating: number;
}

export interface userInfoDTO {
  nickName: string;
  profileImage: string;
  native: string;
}
