# 빌드용 베이스 이미지 지정
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일(프리즈마, 소스코드), 설정들 복사
COPY apps/api/package.json ./
COPY apps/api/prisma ./prisma/
COPY apps/api/src ./src/
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY .npmrc .npmrc
COPY packages ./packages

# pnpm 설치 및 사용 설정
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install
RUN pnpm prisma generate

# 컨테이너가 실행될 때 사용할 기본 명령어
CMD ["pnpm", "dev:api"]