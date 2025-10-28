import { TMapPoi } from "@/types/tmap";

export interface GetDetailPOIDTO {
  poiDetailInfo: {
    id: string;
    additionalInfo: string;
    bizCatName: string;
    bldAddr: string;
    bldNo1: string;
    bldNo2: string;
    lat: string;
    lon: string;
    name: string;
    tel: string;
  };
}

export interface IntegratedSearchDTO {
  count: string;
  page: string;
  pois: {
    poi: TMapPoi[];
  };
  totalCount: string;
}
