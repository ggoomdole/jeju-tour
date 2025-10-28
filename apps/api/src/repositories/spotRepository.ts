import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class SpotRepository {
  async reqSpot(data: {
    pilgrimageId: number;
    spotId: string;
    spotInfo: {
      name: string;
      phone?: string;
      address: string;
      latitude: number;
      longitude: number;
      hours?: string;
      avgRate?: number;
    };
    introSpot: string;
    request: boolean;
  }[]) {
    const createdSpots = [];

    // 현재 최대 number 조회
    const currentMaxNumber = await prisma.pilgrimageSpot.aggregate({
      where: {
        pilgrimageId: data[0].pilgrimageId,
      },
      _max: {
        number: true,
      },
    });

    let nextNumber = (currentMaxNumber._max.number ?? 0) + 1;

    // spotId가 spot 테이블에 존재하는지 확인
    for (const spot of data) {
      let existingSpot = await prisma.spot.findUnique({
        where: { id: spot.spotId },
      });

      // spot이 없으면 새로 추가 (spotInfo 필수)
      if (!existingSpot) {
        existingSpot = await prisma.spot.create({
          data: {
            id: spot.spotId,
            name: spot.spotInfo.name,
            phone: spot.spotInfo.phone ?? null,
            address: spot.spotInfo.address,
            latitude: spot.spotInfo.latitude,
            longitude: spot.spotInfo.longitude,
            hours: spot.spotInfo.hours ?? null,
            avgRate: spot.spotInfo.avgRate ?? null,
          },
        });
      }

      // pilgrimageSpot에 (pilgrimageId, spotId) 조합 존재 여부 확인
      const pilgrimSpotExists = await prisma.pilgrimageSpot.findUnique({
        where: {
          pilgrimageId_spotId: {
            pilgrimageId: spot.pilgrimageId,
            spotId: spot.spotId,
          },
        },
      });

      // 없으면 pilgrimageSpot에 추가
      if (!pilgrimSpotExists) {
        const created = await prisma.pilgrimageSpot.create({
          data: {
            pilgrimageId: spot.pilgrimageId,
            spotId: spot.spotId,
            number: nextNumber++,
            introSpot: spot.introSpot,
            request: true,
          },
        });
        createdSpots.push(created);
      }
    }

    // request: true인 pilgrimageSpot 목록 반환
    return await prisma.pilgrimageSpot.findMany({
      where: {
        pilgrimageId: data[0].pilgrimageId,
        request: true,
      },
      include: {
        spot: true,
      },
    });
  }

  async findRequestedSpots(roadId: number) {
      return await prisma.pilgrimageSpot.findMany({
        where: { 
          pilgrimageId: roadId,
          request: true
        },
        include: {
          spot: true,
          pilgrimage: true,
        },
      });
  }
    
  async updateRequestStatus(
      pilgrimageId: number,
      spotIds: string[],
      approve: boolean
    ) {
      if (approve) {
        await prisma.pilgrimageSpot.updateMany({
          where: {
            pilgrimageId,
            spotId: { in: spotIds },
            request: true,
          },
          data: { request: false },
        });
      } else {
        await prisma.pilgrimageSpot.deleteMany({
          where: {
            pilgrimageId,
            spotId: { in: spotIds },
            request: true,
          },
        });
      }
  }
}

export default new SpotRepository();