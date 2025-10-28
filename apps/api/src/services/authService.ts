import axios from "axios";
import jwt from "jsonwebtoken";

import AuthRepository from "../repositories/authRepository";
import { KakaoError } from "../utils/customError";

class AuthService {
  async kakaoLoginService(code: string) {
    // 카카오로부터 access_token 받기
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY!,
        redirect_uri: process.env.FRONTEND_KAKAO_URL!,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      throw new KakaoError("카카오 액세스 토큰을 받지 못했습니다.");
    }

    // access_token으로 사용자 카카오id 가져오기
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const kakaoId = userResponse.data.id;
    if (!kakaoId) {
      throw new KakaoError("카카오 사용자 Id 정보를 받지 못했습니다.");
    }
    const nickname = userResponse.data.kakao_account.profile.nickname ?? "";
    if (!kakaoId) {
      throw new KakaoError("카카오 사용자 닉네임 정보를 받지 못했습니다.");
    }

    // DB에서 사용자 찾고 없으면 생성
    let user = await AuthRepository.findUserByKakaoId(String(kakaoId));
    let isFirstLogin = false;

    if (!user) {
      isFirstLogin = true;
      user = await AuthRepository.createUser({
        kakaoId: String(kakaoId),
        nickName: String(nickname),
      });
    }

    // JWT 생성
    const payload = { userId: user.id.toString() };
    const secret = process.env.JWT_SECRET!;
    const jwtToken = jwt.sign(payload, secret, { expiresIn: "7d" }); // 예: 7일 유효기간

    return {
      userId: user.id,
      accessToken,
      jwtToken,
      isFirstLogin,
    };
  }

  async kakaoUnlinkService(accessToken: string) {
    // unlink 하기 전에 사용자 정보 조회
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const kakaoId = userResponse.data.id;
    if (!kakaoId) {
      throw new KakaoError("카카오 사용자 정보를 받지 못했습니다.");
    }

    // 카카오 API에 unlink 요청(회원 탈퇴)
    const userInfo = await axios.post("https://kapi.kakao.com/v1/user/unlink", null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!userInfo) {
      throw new KakaoError("카카오 unlink 실패");
    }

    // DB에서 사용자 삭제
    const deletedUser = await AuthRepository.deleteUserByKakaoId(String(kakaoId));

    return { deletedUserId: deletedUser.id };
  }
}

export default new AuthService();
