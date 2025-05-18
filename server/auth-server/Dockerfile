# 빌드 단계를 위한 Node.js 이미지 사용 (개발 환경에 필요한 도구 포함)
FROM node:20-alpine AS development

# 작업 디렉토리 설정 (컨테이너 내부에서 코드가 위치할 곳)
WORKDIR /app

# Node.js 캐시 활용을 위해 package.json과 package-lock.json(또는 yarn.lock) 먼저 복사
COPY package.json yarn.lock* package-lock.json* ./

# 패키지 설치
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi

# 현재 디렉토리의 모든 파일(소스 코드 포함)을 작업 디렉토리로 복사
COPY . .

# TypeScript 코드를 JavaScript로 컴파일
RUN npm run build

# 실제 실행 단계를 위한 Node.js 이미지 사용 (가볍고 실행에 필요한 것만 포함)
FROM node:20-alpine AS production

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션 환경에 필요한 파일만 복사
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./package.json
COPY --from=development /app/dist ./dist 

# 컨테이너 실행 시 실행될 명령어 (NestJS 앱 시작)
CMD [ "node", "dist/main" ]

# 컨테이너 외부에 노출할 포트 번호
EXPOSE 3000
