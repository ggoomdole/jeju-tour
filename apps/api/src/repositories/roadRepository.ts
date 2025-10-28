import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { RoadRequestDTO, SpotDTO } from "@repo/types";

class RoadRepository {
  async allRoadList(categoryId?: number, sortBy?: string) {
    const order: any = sortBy === "latest" ? { createAt: 'desc' } : undefined;

    return await prisma.pilgrimage.findMany({
      where: {
        public: true,
        ...(categoryId && { categoryId })
      },
      orderBy: order,
      include: {
        spots: {
          select: {
            spot: {
              select: {
                avgRate: true,
              },
            },
          },
        },
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async createRoad(data: {
    title: string;
    intro: string;
    categoryId: number;
    spots: SpotDTO[];
    public: boolean;
    imageUrl: string | null;
    userId: number;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Pilgrimage 생성
      const newRoad = await tx.pilgrimage.create({
        data: {
          title: data.title,
          intro: data.intro,
          imageUrl: data.imageUrl,
          search: 0,
          public: data.public,
          createAt: new Date(),
          updateAt: new Date(),
          category: {
            connect: { id: data.categoryId },
          },
        },
      });

      // spots 순회하며 Spot 없으면 생성, PilgrimageSpot 연결
      for (const spot of data.spots) {
        const existingSpot = await tx.spot.findUnique({
          where: { id: spot.spotId },
        });

        if (!existingSpot) {
          await tx.spot.create({
            data: {
              id: spot.spotId,
              name: spot.name,
              address: spot.address,
              latitude: spot.latitude,
              longitude: spot.longitude,
              phone: spot.phone ?? null,
              hours: spot.hours ?? null,
              avgRate: spot.avgRate ?? 0,
            },
          });
        }

        // PilgrimageSpot 생성
        await tx.pilgrimageSpot.create({
          data: {
            pilgrimageId: newRoad.id,
            spotId: spot.spotId,
            number: spot.number,
            introSpot: spot.introSpot,
            request: false,
            createAt: new Date(),
            updateAt: new Date(),
          },
        });
      }

      // 참가자 생성 (관리자)
      await tx.pilgrimageUser.create({
        data: {
          pilgrimageId: newRoad.id,
          userId: data.userId,
          type: true,
          createAt: new Date(),
          updateAt: new Date(),
        },
      });

      // 전체 정보 다시 조회하여 반환
      const fullPilgrimage = await tx.pilgrimage.findUnique({
        where: { id: newRoad.id },
        include: {
          spots: {
            include: {
              spot: true,
            },
          },
          participants: true,
        },
      });

      return fullPilgrimage!;
    });
  }

  async isParticipateByUserId(userId: number, roadId: number) {
    const isParti = await prisma.pilgrimageUser.findUnique({
      where: {
        userId_pilgrimageId: {
          userId,
          pilgrimageId: roadId
        },
      },
    })

    return !!isParti;
  }

  async findRoadByTitle(title: string) {
    return await prisma.pilgrimage.findFirst({
      where: { title },
      select: { id: true },
    });
  }

  async updateRoad(roadId: number, data: Partial<RoadRequestDTO & { imageUrl?: string }>) {
    return await prisma.$transaction(async (tx) => {
      // 기존 데이터 업데이트
      const updated = await tx.pilgrimage.update({
        where: { id: roadId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.intro && { intro: data.intro }),
          ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
          ...(data.imageUrl && { imageUrl: data.imageUrl }),
          updateAt: new Date(),
        },
      });

      // spots 업데이트 (기존 삭제 후 새로 삽입)
      if (data.spots && Array.isArray(data.spots)) {
        await tx.pilgrimageSpot.deleteMany({ where: { pilgrimageId: roadId } });

        await tx.pilgrimageSpot.createMany({
          data: data.spots.map((spot) => ({
            pilgrimageId: roadId,
            spotId: spot.spotId,
            number: spot.number,
            introSpot: spot.introSpot,
            request: false,
            createAt: new Date(),
            updateAt: new Date(),
          })),
        });
      }

      const final = await tx.pilgrimage.findUnique({
        where: { id: roadId },
        include: {
          spots: {
            include: {
              spot: true,
            },
          },
          participants: true,
        },
      });

      return final!;
    });
  }

  async findRoadById(roadId: number) {
    return prisma.pilgrimage.findUnique({
      where: { id: roadId },
      include: {
        spots: {
          orderBy: { number: "asc" },
        },
        participants: {
          include: {
            user: true,
          },
        },
        category: true,
      },
    });
  }

  async checkPilgrimageOwner(userId: number, pilgrimageId: number): Promise<boolean> {
    const record = await prisma.pilgrimageUser.findUnique({
      where: {
        userId_pilgrimageId: {
          userId,
          pilgrimageId,
        },
      },
      select: {
        type: true,
      },
    });

    return record?.type === true;
  }

  async existsPilgrimageName(title: string): Promise<boolean> {
    const existing = await prisma.pilgrimage.findUnique({
      where: { title },
    });
    return existing !== null;
  }

  async findRoadWithSpots(roadId: number) {
    return prisma.pilgrimage.findUnique({
      where: { id: roadId },
      include: {
        spots: {
          where: {
            request: false,
          },
          include: {
            spot: {
              include: {
                reviews: true,
              },
            },
          },
        },
      },
    });
  }

  async incrementSearchCount(roadId: number): Promise<void> {
    await prisma.pilgrimage.update({
      where: { id: roadId },
      data: { search: { increment: 1 } },
    });
  }

  async findRoadsByParticipation(userId: number, maker: boolean, categoryId?: number) {
    const whereClause: any = {
      public: true,
      ...(categoryId && { categoryId }),
    };

    if (maker) {
      // 내가 만든 순례길만 조회
      whereClause.participants = {
        some: {
          userId,
          type: true, // 제작자 표시로 가정
        },
      };
    } else {
      // 내가 참여했고, 내가 만든 순례길은 제외
      whereClause.AND = [
        {
          participants: {
            some: { userId },
          },
        },
        {
          NOT: {
            participants: {
              some: {
                userId,
                type: true, // 내가 만든 순례길 제외
              },
            },
          },
        },
      ];
    }

    return await prisma.pilgrimage.findMany({
      where: whereClause,
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findMyPrivateRoads(userId: number, categoryId?: number) {
    const whereClause: any = {
      public: false,
      ...(categoryId && { categoryId }),
      participants: {
        some: {
          userId: userId,
          type: true,
        },
      },
    };

    return await prisma.pilgrimage.findMany({
      where: whereClause,
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findParticipation(userId: number, roadId: number) {
    return prisma.pilgrimageUser.findUnique({
      where: {
        userId_pilgrimageId: { userId, pilgrimageId: roadId },
      },
    });
  }

  async upsertParticipation(userId: number, roadId: number) {
    return prisma.pilgrimageUser.upsert({
      where: {
        userId_pilgrimageId: {
          userId: userId,
          pilgrimageId: roadId,
        },
      },
      update: {},
      create: {
        userId: userId,
        pilgrimageId: roadId,
      },
    });
  }

  async deleteRoad(roadId: number) {
    return prisma.pilgrimage.delete({
      where: { id: roadId }
    });
  }

  async deleteRoadById(roadId: number, userId: number) {
    return prisma.pilgrimageUser.delete({
      where: {
        userId_pilgrimageId: {
          userId,
          pilgrimageId: roadId
        }
      }
    })
  }
}

export default new RoadRepository();
