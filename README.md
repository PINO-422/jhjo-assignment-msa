# [프로젝트 제목] 이벤트/보상 관리 과제

## 프로젝트 개요

사용자에게 이벤트를 제공하고, 이벤트 참여에 따른 보상 요청 및 관리를 처리하기 위한 백엔드 시스템입니다. 

## 아키텍처

이 프로젝트는 다음과 같은 마이크로서비스로 구성되어 있습니다.
- **Gateway Server :** 클라이언트 요청의 단일 진입점. 각 백엔드 서비스로 요청을 라우팅하는 API Gateway 역할을 합니다. 클라이언트와 백엔드 서비스 간의 중개자 역할을 수행합니다.
- **Auth Server :** 사용자 회원가입, 로그인, 인증(JWT 발급/검증) 및 사용자 정보 관리를 담당합니다.
- **Event Server :** 이벤트 생성/관리, 보상 생성/관리, 사용자의 보상 요청 처리 및 보상 요청 내역 관리 등 핵심 비즈니스 로직을 담당합니다.
- **MongoDB:** 각 서비스의 데이터를 저장하는 NoSQL 데이터베이스입니다. Docker Compose를 통해 독립된 컨테이너로 실행됩니다.

각 서비스는 Docker 컨테이너로 격리되어 있으며, Docker 네트워크를 통해 서로 통신합니다. Docker Compose 파일 하나로 전체 시스템을 쉽게 배포하고 관리할 수 있습니다.

## 기술 스택

(프로젝트 구현에 사용한 주요 기술 목록을 작성합니다.)

- 백엔드: Node.js, NestJS, TypeScript
- 데이터베이스: MongoDB (Mongoose)
- 인증/인가: JWT (JSON Web Token), Passport.js
- 컨테이너화: Docker, Docker Compose
- 개발 도구: VS Code, Postman, GitHub, Gemini

## 과제 실행 방법 (Docker Compose 사용)

1.  **필수 설치 요소:**
    *   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (또는 Docker Engine 및 Docker Compose) 설치
    *   [Node.js 및 npm](https://nodejs.org/) 설치 (프로젝트 빌드 및 스크립트 실행에 필요)
    *   [Git](https://git-scm.com/) 설치

2.  **프로젝트 클론:**
    GitHub에서 이 저장소를 클론합니다.
    ```bash
    git clone https://github.com/PINO-422/jhjo-assignment-msa.git 
    cd jhjo-assignment-msa 
    ```

3.  **환경 변수 설정 (.env 파일):**
    각 서비스 폴더 (`server/auth-server`, `server/event-server`, `server/gateway-server`)에 `.env` 파일이 존재해야 합니다. 필요하다면 예시 `.env` 파일을 제공하거나, 포함된 `.env` 파일에 필수 환경 변수(예: `MONGODB_URI`, `JWT_SECRET`)가 설정되어 있는지 명시합니다.
    *   `JWT_SECRET`: Auth Server와 Event Server에서 **반드시 동일한 값**을 사용해야 합니다.
    *   `MONGODB_URI`: Docker 네트워크 상의 MongoDB 컨테이너 주소를 사용합니다 (예: `mongodb://mongodb:27017/[DB_NAME]`).

4.  **Docker Compose 실행:**
    프로젝트 최상위 폴더에서 터미널을 열고 아래 명령어를 실행하여 모든 서비스를 빌드하고 컨테이너를 실행합니다.
    ```bash
    docker compose up -d --build # 백그라운드로 실행하며 빌드 포함
    ```
    또는 컨테이너 실행 로그를 실시간으로 확인하면서 실행하려면:
     ```bash
    docker compose up --build
    ```

5.  **컨테이너 상태 확인:**
    모든 서비스 컨테이너 (auth, event, gateway, mongodb)가 정상적으로 실행 중인지 확인합니다.
    ```bash
    docker compose ps
    ```
    모든 컨테이너의 상태가 `Up` 이어야 합니다.

6.  **서비스 접근:**
    - API Gateway (클라이언트 요청): `http://localhost:3000`
    - MongoDB: Docker 네트워크 내부에서 서비스 이름 `mongodb` 및 포트 `27017`로 접근 가능 (로컬 PC에서 Compass 등으로 접속 시 `mongodb://localhost:27017` 사용)
    - 개별 서비스 (Auth, Event): Docker 네트워크 내부에서 서비스 이름 및 해당 포트로 접근 가능 (예: `http://auth-server-container:3000`, `http://event-server-container:3000`). 일반적으로 클라이언트는 Gateway를 통해서만 접근합니다.

## 설계 의도

- **마이크로서비스 선택:** 시스템의 기능별 분리, 독립적인 개발/배포 용이성, 특정 기능 부하 시 해당 서비스만 확장 가능하도록 설계했습니다.
- **서비스 역할 분담:** 사용자 인증 및 관리는 Auth Server에서, 이벤트 및 보상 관련 핵심 비즈니스 로직은 Event Server에서 담당하도록 역할을 명확히 나누었습니다. Gateway Server는 클라이언트 요청의 단일 창구 역할을 합니다.
- **인증 (JWT):** 확장성과 Stateless한 특성 때문에 마이크로서비스 환경에 적합한 JWT를 인증 토큰으로 사용했습니다.

## 구현 시 고민했던 부분 및 해결 과정

- **Gateway Server 라우팅 문제:**
  - 초기 `docker compose up --watch` 모드 사용 시 코드 변경사항이 제대로 반영되지 않거나 예상치 못한 문제가 발생했습니다. `--watch` 모드 대신 프로덕션 빌드 후 `node dist/main` 명령으로 실행하도록 Docker Compose 설정을 변경하여 해결했습니다.
  - NestJS `@All()` 데코레이터와 경로 매개변수(`/:id`)를 함께 사용할 때 특정 Docker 환경에서 라우팅이 제대로 인식되지 않는 문제가 있었습니다. Gateway 로그에서 `Mapped` 라우팅 메시지가 누락되는 것을 확인하고, `@All()` 대신 `@Get`, `@Post`, `@Patch`, `@Delete` 등 **명시적인 HTTP 메서드 데코레이터**를 사용하여 라우팅을 정의함으로써 문제를 해결했습니다. 진단용 라우터(`@Patch('reward/:id')` 등)를 추가하여 특정 라우팅 패턴 인식이 문제의 핵심임을 파악하는 데 도움을 받았습니다.
- **Docker Volumes 마운트 관련 문제:**
  - 개발 초기 로컬 코드를 컨테이너에 실시간 반영하기 위해 volumes 마운트를 시도했으나, `node_modules` 폴더 마운트 충돌 등 여러 어려움이 있었습니다. 최종적으로 volumes 마운트 없이 Dockerfile의 2단계 빌드를 통해 개발 환경에서 패키지 설치 및 빌드 후, production 스테이지에서 빌드 결과(`dist` 폴더)와 `node_modules`만 복사하여 이미지를 생성하고, 컨테이너 실행 시에는 `node dist/main` 명령으로 빌드된 코드를 실행하는 방식으로 문제를 우회하고 안정화했습니다. `--no-cache` 옵션을 사용하여 변경된 코드 반영을 강제했습니다.
- **API 요청 데이터 형식 문제 (JSON):**
  - API 테스트 중 `400 Bad Request` 에러와 함께 "Expected double-quoted property name in JSON" 메시지가 발생하는 경우가 있었습니다. 이는 요청 Body에 포함된 JSON 데이터의 마지막 요소 뒤에 불필요한 쉼표(`,`)가 포함되어 JSON 문법 오류가 발생한 것이었습니다. Postman 요청 Body에서 해당 쉼표를 삭제하여 문제를 해결했습니다. 사소하지만 디버깅에 중요한 경험이었습니다.
- **인코딩 문제:**
  - Docker 컨테이너 로그 출력 시 한글(`호출됨` 등)이 깨져 보이는 현상이 있었습니다. 컨테이너의 언어/지역 설정(Locale)이 UTF-8로 명시되지 않아 발생한 문제였습니다. `docker-compose.yml` 파일의 `environment` 섹션에 `LANG=C.UTF-8` 및 `LC_ALL=C.UTF-8` 환경 변수를 추가하여 로그 출력의 인코딩 문제를 해결했습니다. (이것이 라우팅 문제와 직접적인 관련은 없었지만, 환경 설정의 중요성을 다시 한번 알게 되었습니다.)
- **Git 사용 중 발생한 에러:**
  - `git add .` 명령어 실행 시 `.git/` 오류나 `fatal: adding files failed` 와 같은 로컬 Git 저장소 손상 문제가 발생했습니다. 이는 여러 번의 Git 명령어 시도와 실패 과정에서 `.git` 폴더 상태가 불안정해졌기 때문으로 추정됩니다. (이 부분은 해결 후 정상적인 `git push`에 성공했음을 명시하면 좋습니다.)

## 추가 구현 예정 또는 개선점

- **완벽한 인증/인가 시스템 및 권한 기반 접근 제어:**
  - Event Server에서 JWT 토큰을 활용하여 요청 사용자의 ID와 권한을 정확히 식별하고, `@UseGuards`, Custom Decorator 등을 사용하여 각 API 엔드포인트에 대한 권한 제어 로직을 완벽하게 구현하고 테스트하는 작업이 필요합니다.
  - 보상 요청 내역 조회 API(`GET /reward-request`, `GET /reward-request/user/:userId`)에 요청 사용자의 권한에 따른 데이터 필터링 로직을 적용해야 합니다.
- **보상 지급 로직 고도화:** 보상 요청이 승인될 경우, 사용자의 포인트 잔고를 실제로 증가시키거나 아이템 인벤토리에 추가하는 등 실제 보상 지급 로직을 구현해야 합니다.
- **이벤트 참여 조건 검증:** 보상 요청 시 해당 유저가 특정 이벤트를 완료했는지 등 구체적인 이벤트 참여 조건을 확인하는 검증 로직을 추가해야 합니다.
- **API 문서 자동 생성:** Swagger 등을 연동하여 API 문서를 자동으로 생성하고 공유할 수 있도록 개선할 예정입니다.
- **테스트 코드:** 단위 테스트, 통합 테스트 등 자동화된 테스트 코드를 작성하여 코드 품질과 안정성을 확보할 예정입니다.
- **로깅 및 모니터링:** 각 서비스의 상세 로그를 수집하고 모니터링할 수 있는 시스템 구축을 고려하고 있습니다.
- **API 유효성 검사 강화:** Class-validator, Class-transformer를 활용한 DTO 기반 유효성 검사 로직을 서비스 전체에 걸쳐 적용할 예정입니다.
- **프론트엔드 개발:** 백엔드 API와 연동되는 사용자 친화적인 웹 또는 모바일 프론트엔드를 개발할 예정입니다.
