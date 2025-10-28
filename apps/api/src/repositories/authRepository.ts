import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


class AuthRepository {
  async findUserByKakaoId(kakaoId: string) {
    return prisma.user.findUnique({ where: { kakaoId } });
  }

  async createUser(data: { kakaoId: string; nickName: string; profileImage?: string }) {
    return prisma.user.create({ data });
  }

  async deleteUserByKakaoId(kakaoId: string) {
    return prisma.user.delete({
      where: { kakaoId }
    });
  }  
}

export default new AuthRepository();