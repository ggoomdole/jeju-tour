import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class SearchRepository {
  async searchPilgrimages(nouns: string[], categoryId?: number, sortBy?: string) {
    const order: any = sortBy === "latest" ? { createAt: 'desc' } : undefined;

    return await prisma.pilgrimage.findMany({
      where: {
        public: true,
        ...(categoryId ? { categoryId } : {}),
        OR: nouns.map((noun) => ({
          title: {
            contains: noun,
          },
          intro: {
            contains: noun,
          }
        })),
      },
      orderBy: order,
      select: {
        id: true,
        title: true,
        intro: true,
        imageUrl: true,
        categoryId: true,
        createAt: true,
        search: true,
        participants: {
          select: {
            user: {
              select: {
                native: true,
              },
            },
          },
        },
        spots: {
          select: {
            spot: {
              select: {
                avgRate: true,
              },
            },
          },
        },
      }
    });
  }

  async saveSearchKeyword(userId: number, word: string) {
    const existing = await prisma.searchKeyword.findFirst({
      where: { userId, word },
    });

    if (existing) {
      await prisma.searchKeyword.update({
        where: { id: existing.id },
        data: { updateAt: new Date() },
      });
    } else {
      await prisma.searchKeyword.create({
        data: { userId, word },
      });
    }
  }

  async deleteSearchKeyword(userId: number, word: string) {
    await prisma.searchKeyword.deleteMany({
      where: { userId, word },
    });
  }

  async deleteAllSearchKeywords(userId: number) {
    await prisma.searchKeyword.deleteMany({
      where: { userId },
    });
  }

  async getRecentSearchKeywords(userId: number) {
    return await prisma.searchKeyword.findMany({
      where: { userId },
      orderBy: { updateAt: 'desc' },
      take: 10,
    });
  }
}

export default new SearchRepository();