import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  OneRoadResponseDTO,
  ParticipantDTO,
  RoadListResponseDTO,
  RoadRequestDTO,
  RoadResponseDTO,
  SpotDTO,
} from "@repo/types";

import { v4 } from "uuid";

import s3 from "../config/s3-config";
import roadRepository from "../repositories/roadRepository";
import { ExistsError, NotFoundError, UnauthorizedError } from "../utils/customError";

class RoadService {
  private BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

  async loadAllRoad(
    categoryId?: number,
    sortBy: string = "popular"
  ): Promise<RoadListResponseDTO[]> {
    const rawPilgrimages = await roadRepository.allRoadList(categoryId, sortBy);
    if (!rawPilgrimages || rawPilgrimages.length === 0) return [];

    // 후처리 정렬
    const sortedPilgrimages = [...rawPilgrimages];

    switch (sortBy) {
      case "views":
        sortedPilgrimages.sort((a, b) => b.search - a.search);
        break;
      case "participants":
        sortedPilgrimages.sort((a, b) => b.participants.length - a.participants.length);
        break;
      case "popular":
      default:
        sortedPilgrimages.sort((a, b) => {
          const avgA = pilgrimageAverageRate(a.spots);
          const avgB = pilgrimageAverageRate(b.spots);
          return avgB - avgA;
        });
        break;
    }

    return sortedPilgrimages.map(
      (p): RoadListResponseDTO => ({
        roadId: p.id,
        title: p.title,
        intro: p.intro,
        imageUrl: p.imageUrl ?? null,
        categoryId: p.categoryId,
        participants: p.participants.length,
        native: p.participants[0]?.user.native ?? null,
      })
    );
  }

  async getPopularRoads(categoryId?: number): Promise<RoadListResponseDTO[]> {
    const pilgrimages = await roadRepository.allRoadList(categoryId);

    if (!pilgrimages || pilgrimages.length === 0) return [];

    // 조회수 기준 내림차순 정렬
    pilgrimages.sort((a, b) => b.search - a.search);

    // 상위 3개씩만 필터링
    const top3Roads = categoryId ? pilgrimages.slice(0, 3) : pilgrimages.slice(0, 3);

    return top3Roads.map((p) => ({
      roadId: p.id,
      title: p.title,
      intro: p.intro,
      imageUrl: p.imageUrl ?? null,
      categoryId: p.categoryId,
      participants: p.participants.length,
      native: p.participants[0]?.user.native ?? null,
    }));
  }

  async createRoad(
    data: RoadRequestDTO,
    userId: number,
    imageFile?: Express.Multer.File
  ): Promise<RoadResponseDTO> {
    const exists = await roadRepository.findRoadByTitle(data.title);
    if (exists) throw new ExistsError("이미 존재하는 순례길 이름입니다.");

    let imageUrl: string | null = null;
    if (imageFile) {
      const fileExt = imageFile.originalname.split(".").pop();
      const key = `road-image/${v4()}.${fileExt}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: this.BUCKET_NAME,
          Key: key,
          Body: imageFile.buffer,
          ContentType: imageFile.mimetype,
          ACL: "public-read",
        })
      );

      imageUrl = `https://${this.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const newRoad = await roadRepository.createRoad({
      title: data.title,
      intro: data.intro,
      categoryId: data.categoryId,
      spots: data.spots,
      public: true,
      imageUrl,
      userId,
    });

    return {
      roadId: newRoad.id,
      title: newRoad.title,
      intro: newRoad.intro,
      imageUrl: newRoad.imageUrl ?? null,
      public: newRoad.public,
      createAt: newRoad.createAt,
      updateAt: newRoad.updateAt,
      categoryId: newRoad.categoryId,
      spots: newRoad.spots.map(
        (ps): SpotDTO => ({
          spotId: ps.spotId,
          name: ps.spot.name,
          number: ps.number,
          introSpot: ps.introSpot,
          address: ps.spot.address,
          latitude: ps.spot.latitude,
          longitude: ps.spot.longitude,
        })
      ),
      participants: newRoad.participants.map(
        (part): ParticipantDTO => ({
          userId: part.userId,
          type: part.type,
        })
      ),
    };
  }

  async createMyRoad(
    data: RoadRequestDTO,
    userId: number,
    imageFile?: Express.Multer.File
  ): Promise<RoadResponseDTO> {
    const exists = await roadRepository.findRoadByTitle(data.title);
    if (exists) throw new ExistsError("이미 존재하는 순례길 이름입니다.");

    let imageUrl: string | null = null;
    if (imageFile) {
      const fileExt = imageFile.originalname.split(".").pop();
      const key = `road-image/${v4()}.${fileExt}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: this.BUCKET_NAME,
          Key: key,
          Body: imageFile.buffer,
          ContentType: imageFile.mimetype,
          ACL: "public-read",
        })
      );

      imageUrl = `https://${this.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const newRoad = await roadRepository.createRoad({
      title: data.title,
      intro: data.intro,
      categoryId: data.categoryId,
      spots: data.spots,
      public: false,
      imageUrl,
      userId,
    });

    return {
      roadId: newRoad.id,
      title: newRoad.title,
      intro: newRoad.intro,
      imageUrl: newRoad.imageUrl ?? null,
      public: newRoad.public,
      createAt: newRoad.createAt,
      updateAt: newRoad.updateAt,
      categoryId: newRoad.categoryId,
      spots: newRoad.spots.map(
        (ps): SpotDTO => ({
          spotId: ps.spotId,
          name: ps.spot.name,
          number: ps.number,
          introSpot: ps.introSpot,
          address: ps.spot.address,
          latitude: ps.spot.latitude,
          longitude: ps.spot.longitude,
        })
      ),
      participants: newRoad.participants.map(
        (part): ParticipantDTO => ({
          userId: part.userId,
          type: part.type,
        })
      ),
    };
  }

  async updateRoad(
    roadId: number,
    userId: number,
    data: Partial<RoadRequestDTO>,
    imageFile?: Express.Multer.File
  ): Promise<RoadResponseDTO> {
    const isAdmin = await roadRepository.checkPilgrimageOwner(userId, roadId);
    if (!isAdmin) {
      throw new UnauthorizedError("관리자 권한이 없습니다.");
    }

    const road = await roadRepository.findRoadById(roadId);
    if (!road) throw new NotFoundError("해당 순례길이 존재하지 않습니다.");

    let imageUrl: string | undefined;

    if (imageFile) {
      const fileExt = imageFile.originalname.split(".").pop();
      const key = `road-image/${roadId}.${fileExt}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: this.BUCKET_NAME,
          Key: key,
          Body: imageFile.buffer,
          ContentType: imageFile.mimetype,
          ACL: "public-read",
        })
      );

      imageUrl = `https://${this.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const updatedRoad = await roadRepository.updateRoad(roadId, {
      ...data,
      ...(imageUrl && { imageUrl }),
    });

    return {
      roadId: updatedRoad.id,
      title: updatedRoad.title,
      intro: updatedRoad.intro,
      imageUrl: updatedRoad.imageUrl ?? null,
      public: updatedRoad.public ?? true,
      createAt: updatedRoad.createAt,
      updateAt: updatedRoad.updateAt,
      categoryId: updatedRoad.categoryId,
      spots: updatedRoad.spots.map(
        (ps): SpotDTO => ({
          spotId: ps.spotId,
          name: ps.spot.name,
          number: ps.number,
          introSpot: ps.introSpot,
          address: ps.spot.address,
          latitude: ps.spot.latitude,
          longitude: ps.spot.longitude,
        })
      ),
      participants: updatedRoad.participants.map(
        (part): ParticipantDTO => ({
          userId: part.userId,
          type: part.type,
        })
      ),
    };
  }

  async checkDuplicateName(title: string): Promise<boolean> {
    const exists = await roadRepository.existsPilgrimageName(title);
    return !exists;
  }

  async getOneRoadWithSpots(
    userId: number | undefined,
    roadId: number,
    sortBy: string
  ): Promise<OneRoadResponseDTO> {
    const road = await roadRepository.findRoadWithSpots(roadId);
    if (!road) throw new NotFoundError("순례길이 존재하지 않습니다.");

    // 조회수 증가
    await roadRepository.incrementSearchCount(roadId);

    const isParti =
      userId !== undefined ? await roadRepository.isParticipateByUserId(userId, roadId) : false;

    let spots = road.spots;

    // 스팟 정렬 (기본: number 순서)
    if (sortBy === "popular") {
      // 인기순: 스팟별 평균 평점 내림차순
      spots = spots.sort((a, b) => {
        const avgA = averageRate(a);
        const avgB = averageRate(b);
        return avgB - avgA;
      });
    } else if (sortBy === "review") {
      // 후기순: 스팟별 리뷰 개수 내림차순
      spots = spots.sort((a, b) => b.spot.reviews.length - a.spot.reviews.length);
    } else {
      // 기본: number 오름차순
      spots = spots.sort((a, b) => a.number - b.number);
    }

    return {
      isParti: isParti,
      roadId: road.id,
      title: road.title,
      intro: road.intro,
      imageUrl: road.imageUrl ?? null,
      categoryId: road.categoryId,
      spots: spots.map((spot) => ({
        spotId: spot.spotId,
        name: spot.spot.name,
        number: spot.number,
        introSpot: spot.introSpot,
        avgReview: averageRateStr(spot),
        numReview: spot.spot.reviews.length.toString(),
        latitude: spot.spot.latitude,
        longitude: spot.spot.longitude,
        address: spot.spot.address,
      })),
    };
  }

  async getParticipatedRoads(
    userId: number,
    maker: boolean,
    categoryId?: number
  ): Promise<RoadListResponseDTO[]> {
    const roads = await roadRepository.findRoadsByParticipation(userId, maker, categoryId);
    if (!roads || roads.length === 0) return [];

    return roads.map(
      (p): RoadListResponseDTO => ({
        roadId: p.id,
        title: p.title,
        intro: p.intro,
        imageUrl: p.imageUrl ?? null,
        categoryId: p.categoryId,
        participants: p.participants.length,
        native: p.participants[0]?.user.native ?? null,
      })
    );
  }

  async loadCustomRoad(userId: number, categoryId?: number): Promise<RoadListResponseDTO[]> {
    const rawPilgrimages = await roadRepository.findMyPrivateRoads(userId, categoryId);

    if (!rawPilgrimages || rawPilgrimages.length === 0) return [];

    return rawPilgrimages.map(
      (p): RoadListResponseDTO => ({
        roadId: p.id,
        title: p.title,
        intro: p.intro,
        imageUrl: p.imageUrl ?? null,
        categoryId: p.categoryId,
        participants: p.participants.length,
        native: p.participants[0]?.user.native ?? null,
      })
    );
  }

  async participateByRoadId(
    userId: number,
    roadId: number
  ): Promise<{ userId: number; pilgrimageId: number; message: string }> {
    const road = await roadRepository.findRoadWithSpots(roadId);
    if (!road) throw new NotFoundError("순례길이 존재하지 않습니다.");

    const owner = await roadRepository.checkPilgrimageOwner(userId, roadId);
    if (owner) {
      return {
        userId,
        pilgrimageId: roadId,
        message: "본인이 만든 순례길에는 참여할 수 없습니다.",
      };
    }

    const exist = await roadRepository.findParticipation(userId, roadId);
    if (exist) {
      return {
        userId: exist.userId,
        pilgrimageId: exist.pilgrimageId,
        message: "이미 참여중인 순례길입니다.",
      };
    }

    const participation = await roadRepository.upsertParticipation(userId, roadId);
    return {
      userId: participation.userId,
      pilgrimageId: participation.pilgrimageId,
      message: "순례길 참여 완료",
    };
  }

  async deleteRoad(userId: number, roadId: number): Promise<Number> {
    const road = await roadRepository.findRoadById(roadId);
    if (!road) {
      throw new NotFoundError("해당 순례길이 존재하지 않습니다.");
    }

    const isAdmin = await roadRepository.checkPilgrimageOwner(userId, roadId);
    if (!isAdmin) {
      throw new UnauthorizedError("관리자 권한이 없습니다.");
    }

    await roadRepository.deleteRoad(roadId);
    return roadId;
  }

  async outByRoadId(userId: number, roadId: number): Promise<Number> {
    const road = await roadRepository.findRoadById(roadId);
    if (!road) {
      throw new NotFoundError("해당 순례길이 존재하지 않습니다.");
    }

    const isAdmin = await roadRepository.isParticipateByUserId(userId, roadId);
    if (!isAdmin) {
      throw new UnauthorizedError("순례길에 참여하고 있지 않습니다.");
    }

    const owner = await roadRepository.checkPilgrimageOwner(userId, roadId);
    if (owner) {
      throw new UnauthorizedError("본인의 순례길을 나갈 수 없습니다.");
    }

    await roadRepository.deleteRoadById(roadId, userId);
    return roadId;
  }
}

// 평균 평점 숫자 조정
function averageRateStr(spot: any): string {
  const avg = averageRate(spot);
  return (avg ?? 0).toFixed(1);
}

// 평균 평점 계산
export function averageRate(spot: any): number {
  const reviews = spot?.spot?.reviews ?? [];
  const rates = reviews
    .filter((r: any) => r.rate !== null && r.rate !== undefined)
    .map((r: any) => r.rate);

  if (rates.length === 0) return 0;
  return parseFloat((rates.reduce((a: number, b: number) => a + b, 0) / rates.length).toFixed(1));
}

// 장소 전체 평균 평점 계산
export function pilgrimageAverageRate(pilgrimage: any): number {
  const allRates = (pilgrimage.spots ?? []).flatMap((s: any) => {
    const rates = (s.spot?.reviews ?? [])
      .filter((r: any) => r.rate !== null && r.rate !== undefined)
      .map((r: any) => r.rate);
    return rates.length > 0 ? rates : [];
  });

  if (allRates.length === 0) return 0;

  const sum = allRates.reduce((a: number, b: number) => a + b, 0);
  return parseFloat((sum / allRates.length).toFixed(1));
}

export default new RoadService();
