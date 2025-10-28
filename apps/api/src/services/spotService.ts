import { PutObjectCommand } from '@aws-sdk/client-s3';
import { DataSpotDTO,SpotReqDTO } from '@repo/types';

import axios from "axios";

import roadRepository from '../repositories/roadRepository';
import spotRepository from '../repositories/spotRepository';
import { BadRequestError,NotFoundError, UnauthorizedError } from '../utils/customError';

class RoadService {
  async fetchNearbySpots(lat: string, lng: string): Promise<DataSpotDTO[]> {
    const url = "https://apis.data.go.kr/B551011/KorService2/locationBasedList2";

    const params = {
      serviceKey: process.env.SERVICE_KEY,
      MobileOS: "WEB",
      MobileApp: "ggoomdole-net",
      _type: "json",
      numOfRows: 10,
      pageNo: 1,
      arrange: "S",
      contentTypeId: 12,
      mapX: lng,
      mapY: lat,
      radius: 1000
    };

    const { data } = await axios.get(url, { params });
    console.log(JSON.stringify(data, null, 2));

    const items = data?.response?.body?.items?.item ?? [];
    const list = Array.isArray(items) ? items : [items];

    const results: DataSpotDTO[] = list.map((item: any) => ({
      title: item.title,
      image: item.firstimage || null,
      address: item.addr1 || "주소 정보 없음",
      rating: item.rating
    }));

    return results;
  }

  async reqAddSpot(data: SpotReqDTO, userId: number): Promise<SpotReqDTO[]> {
    const checkPilgrimager = await roadRepository.findRoadById(data.roadId);
    if (!checkPilgrimager) throw new NotFoundError('해당 순례길이 존재하지 않습니다.');

    const owner = await roadRepository.checkPilgrimageOwner(userId, data.roadId);
    if (owner) { throw new BadRequestError('자신의 순례길에는 장소 추가 요청을 할 수 없습니다.'); }
  
    const createdSpots = await spotRepository.reqSpot(
      data.spots.map((spot) => ({
        pilgrimageId: data.roadId,
        spotId: spot.spotId,
        spotInfo: spot.spotInfo,
        introSpot: spot.addReason,
        request: true,
      }))
    );
  
    return [{
      roadId: data.roadId,
      spots: createdSpots.map((spot) => ({
        spotId: spot.spotId,
        addNumber: spot.number,
        addReason: spot.introSpot,
        spotInfo: {
          name: spot.spot.name,
          phone: spot.spot.phone ?? undefined,
          address: spot.spot.address ?? undefined,
          latitude: spot.spot.latitude,
          longitude: spot.spot.longitude,
          hours: spot.spot.hours ?? undefined,
          avgRate: spot.spot.avgRate ?? undefined,
        }
      }))
    }];
  }
  
  async getRequestedSpots(userId: number, roadId: number) {
    const isAdmin = await roadRepository.checkPilgrimageOwner(userId, roadId);
    if (!isAdmin) { throw new UnauthorizedError('관리자 권한이 없습니다.'); }

    const road = await roadRepository.findRoadById(roadId);
    if (!road) throw new NotFoundError('해당 순례길이 존재하지 않습니다.');

    return await spotRepository.findRequestedSpots(roadId);
  }

  async processSpotRequests(userId: number, roadId: number,
    approve: string[],
    reject: string[]
  ) {
    const isAdmin = await roadRepository.checkPilgrimageOwner(userId, roadId);
    if (!isAdmin) { throw new UnauthorizedError('관리자 권한이 없습니다.'); }

    const road = await roadRepository.findRoadById(roadId);
    if (!road) throw new NotFoundError('해당 순례길이 존재하지 않습니다.');

    if (approve.length > 0) {
      await spotRepository.updateRequestStatus(roadId, approve, true);
    }

    if (reject.length > 0) {
      await spotRepository.updateRequestStatus(roadId, reject, false);
    }
  }
}

export default new RoadService();