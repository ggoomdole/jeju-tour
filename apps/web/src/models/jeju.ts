export interface JejuRealtimeResponseDTO {
  linkData: JejuRealtimeLinkDataDTO[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export interface JejuRealtimeLinkDataDTO {
  address: string;
  address_load: string;
  contentsId: string;
  eventEndDate: string;
  eventStartDate: string;
  imgUrl: string;
  name: string;
  population: number;
  positionX: string;
  positionY: string;
  radius: string;
  thumIImgUrl: string;
}
