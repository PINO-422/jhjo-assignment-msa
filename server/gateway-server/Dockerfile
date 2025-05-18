FROM node:20-alpine AS development
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; \
    fi
COPY . .
RUN npm run build

# production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=development /app/node_modules ./node_modules # development 스테이지에서 설치된 node_modules 복사
COPY --from=development /app/package.json ./package.json # package.json 복사 (dependencies 정보 등 필요)
COPY --from=development /app/dist ./dist # 컴파일된 JS 파일 복사

# 컨테이너 실행 시 실행될 명령어 (NestJS 앱 시작)
CMD [ "node", "dist/main" ] # ? production 스테이지에서는 컴파일된 main.js 직접 실행
