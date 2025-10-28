import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Native } from "@prisma/client";
import { userInfoDTO } from "@repo/types";

import { v4 } from "uuid";

import s3 from "../config/s3-config";
import UserRepository from "../repositories/userRepository";
import { ExistsError, NotFoundError } from "../utils/customError";

class UserService {
  private BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

  async checkNicknameAvailability(nickname: string): Promise<boolean> {
    const user = await UserRepository.findUserByNickname(nickname);
    return !user;
  }

  async createNickname(userId: number, nickname: string): Promise<string> {
    const exists = await UserRepository.findUserByNickname(nickname);
    if (exists) throw new ExistsError("이미 존재하는 닉네임입니다.");
    await UserRepository.saveNickname(userId, nickname);
    return nickname;
  }

  async changeNickname(userId: number, nickname: string): Promise<string> {
    const exists = await UserRepository.findUserByNickname(nickname);
    if (exists) throw new ExistsError("이미 존재하는 닉네임입니다.");
    await UserRepository.updateNickname(userId, nickname);
    return nickname;
  }

  async uploadProfileImage(
    userId: number,
    file?: Express.Multer.File | null
  ): Promise<string | null> {
    if (!file) {
      return null;
    }

    const key = `profile-images/${v4()}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const imageUrl = `https://${this.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    await UserRepository.updateProfileImage(userId, imageUrl);

    return imageUrl;
  }

  async uploadTerm(userId: number, term?: string) {
    const nativeValue = term ? parseTermToNative(term) : Native.SHORT_TERM;
    return await UserRepository.updateUserNative(userId, nativeValue);
  }

  async userIdByInfo(userId: number): Promise<userInfoDTO> {
    const user = await UserRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError("유저를 찾을 수 없습니다.");
    }

    return {
      nickName: user.nickName,
      profileImage: user.profileImage ?? "null",
      native: user.native ?? "",
    };
  }
}

function parseTermToNative(term: string): Native {
  switch (term.toUpperCase()) {
    case "SHORT_TERM":
      return Native.SHORT_TERM;
    case "MID_TERM":
      return Native.MID_TERM;
    case "LONG_TERM":
      return Native.LONG_TERM;
    case "RESIDENT":
      return Native.RESIDENT;
    default:
      throw new Error("유효하지 않은 term 값입니다.");
  }
}

export default new UserService();
