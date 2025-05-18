import { Controller, Get, All, Req, Res, Param, Patch, Delete, Post, HttpStatus  } from '@nestjs/common';
import { AppService } from './app.service'; // AppService 임포트 유지 (기본 라우팅용)
import { HttpService } from '@nestjs/axios'; // ? HttpService 임포트
import { Request, Response } from 'express'; // ? Express Request, Response 타입 임포트
import { catchError, lastValueFrom } from 'rxjs'; // ? RxJS 연산자 임포트
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios'; // ? Axios types 임포트

@Controller() // Gateway의 루트 경로를 처리합니다.
export class AppController {
  constructor(
    private readonly appService: AppService, // AppService 주입 유지 (기본 라우팅용)
    private readonly httpService: HttpService, // ? HttpService 주입
  ) {}

  // --- 진단용 라우트들은 이제 주석 처리하거나 삭제합니다. ---
  // @Patch('event/test-param/:id')
  // async diagnosticPatchEvent(...) { ... }

  // @Patch('reward/:id')
  // async diagnosticPatchReward(...) { ... }

  // @Delete('reward/:id')
  // async diagnosticDeleteReward(...) { ... }

  // --- User API Handlers ---

  // GET /user (전체 사용자 목록 조회)
  @Get('user')
  async handleGetUsersList(@Req() request: Request, @Res() response: Response) {
    console.log(`>>> handleGetUsersList (GET /user) called. Forwarding...`);
    const userServiceUrl = process.env.USER_API_URL || 'http://auth-server-container:3000'; // 환경 변수 또는 기본값 (auth-server-container로 수정)
    const url = `${userServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding GET request to User Server: ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = { method: 'GET', url: url, headers: headersToForward };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or User Server is down' };
          console.error(`Gateway: Error forwarding GET /user: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded GET /user response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error('Gateway: Unexpected error GET /user', e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // POST /user (새로운 사용자 생성)
  @Post('user')
  async handleCreateUser(@Req() request: Request, @Res() response: Response) {
    console.log(`>>> handleCreateUser (POST /user) called. Forwarding...`);
    const userServiceUrl = process.env.USER_API_URL || 'http://auth-server-container:3000'; // 환경 변수 또는 기본값 (auth-server-container로 수정)
    const url = `${userServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding POST request to User Server: ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers['content-type']) {
      headersToForward['Content-Type'] = request.headers['content-type'];
    }
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = { method: 'POST', url: url, data: request.body, headers: headersToForward };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or User Server is down' };
          console.error(`Gateway: Error forwarding POST /user: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded POST /user response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error('Gateway: Unexpected error POST /user', e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // GET /user/:id (특정 사용자 상세 조회)
  @Get('user/:id')
  async handleGetUserById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleGetUserById (GET /user/${id}) called. Forwarding...`);
    const userServiceUrl = process.env.USER_API_URL || 'http://auth-server-container:3000'; // 환경 변수 또는 기본값 (auth-server-container로 수정)
    const url = `${userServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding GET request to User Server: ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = { method: 'GET', url: url, headers: headersToForward };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or User Server is down' };
          console.error(`Gateway: Error forwarding GET /user/${id}: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded GET /user/${id} response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error(`Gateway: Unexpected error GET /user/${id}`, e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // PATCH /user/:id (특정 사용자 수정)
  @Patch('user/:id')
  async handleUpdateUserById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleUpdateUserById (PATCH /user/${id}) called. Forwarding...`);
    const userServiceUrl = process.env.USER_API_URL || 'http://auth-server-container:3000'; // 환경 변수 또는 기본값 (auth-server-container로 수정)
    const url = `${userServiceUrl}${request.url}`; 

    console.log(
      `Gateway: Forwarding request to User Server: ${request.method} ${url}`,
    );

    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers['content-type']) {
      headersToForward['Content-Type'] = request.headers['content-type'];
    }
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = {
        method: request.method as Method, 
        url: url, 
        data: request.body,
        headers: headersToForward, 
      };

      const serviceResponse: AxiosResponse<unknown> = await lastValueFrom<
        AxiosResponse<unknown>
      >(
        this.httpService.request<any>(config).pipe(
          catchError((error: AxiosError<unknown>) => {
            const errorStatus = error.response?.status || 500;
            const errorData = (error.response as any)?.data || {
              message: 'Internal server error or User Server is down',
            };
            console.error(
              `Gateway: Error forwarding PATCH /user/${id}: ${errorStatus} for ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
              errorData,
            );
            if (!response.headersSent) {
              response.status(errorStatus).send(errorData);
            }
            throw new Error('Forwarding error handled by catchError'); 
          }),
        ),
      );

      const { data, status, headers: responseHeaders } = serviceResponse;
      response
        .status(status)
        .set(responseHeaders as any) 
        .send(data);
      console.log(
        `Gateway: Successfully forwarded PATCH /user/${id} response: ${status}`,
      );
    } catch (e: unknown) {
      let caughtErrorMessage: string | undefined;
      if (e instanceof Error) {
        caughtErrorMessage = e.message;
      } else if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof (e as { message: unknown }).message === 'string'
      ) {
        caughtErrorMessage = (e as { message: string }).message;
      } else if (typeof e === 'string') {
        caughtErrorMessage = e;
      }

      if (caughtErrorMessage !== 'Forwarding error handled by catchError') {
        console.error(
          `Gateway: Unexpected error during PATCH /user/${id} request forwarding`,
          e,
        ); 
      }
      if (!response.headersSent) {
        response
          .status(500)
          .send({ message: `An unexpected error occurred in Gateway during PATCH /user/${id} forwarding` });
      }
    }
  }

  // DELETE /user/:id (특정 사용자 삭제)
  @Delete('user/:id')
  async handleDeleteUserById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleDeleteUserById (DELETE /user/${id}) called. Forwarding...`);
    const userServiceUrl = process.env.USER_API_URL || 'http://auth-server-container:3000'; // 환경 변수 또는 기본값 (auth-server-container로 수정)
    const url = `${userServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding DELETE request to User Server: ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = { method: 'DELETE', url: url, headers: headersToForward };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or User Server is down' };
          console.error(`Gateway: Error forwarding DELETE /user/${id}: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded DELETE /user/${id} response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error(`Gateway: Unexpected error DELETE /user/${id}`, e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // --- End of User API Handlers ---

  // --- Event API Handlers ---

  // GET /event (전체 이벤트 목록 조회)
  @Get('event')
  async handleGetEventsList(@Req() request: Request, @Res() response: Response) {
    console.log(`>>> handleGetEventsList (GET /event) called. Forwarding...`);
    const eventServiceUrl = process.env.EVENT_API_URL || 'http://event-server-container:3000'; 
    const url = `${eventServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding GET request to Event Server: ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = { method: 'GET', url: url, headers: headersToForward };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or Event Server is down' };
          console.error(`Gateway: Error forwarding GET /event: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded GET /event response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error('Gateway: Unexpected error GET /event', e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // POST /event (새로운 이벤트 생성)
  @Post('event')
  async handleCreateEvent(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleCreateEvent (POST /event) called. Forwarding...`);
    const eventServiceUrl = process.env.EVENT_API_URL || 'http://event-server-container:3000';
    const url = `${eventServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding POST request to Event Server: ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers['content-type']) {
      headersToForward['Content-Type'] = request.headers['content-type'];
    }
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = { method: 'POST', url: url, data: request.body, headers: headersToForward };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or Event Server is down' };
          console.error(`Gateway: Error forwarding POST /event: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded POST /event response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error('Gateway: Unexpected error POST /event', e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // GET /event/:id (특정 이벤트 상세 조회)
  @Get('event/:id')
  async handleGetEventById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleGetEventById (GET /event/${id}) called. Forwarding...`);
    const eventServiceUrl = process.env.EVENT_API_URL || 'http://event-server-container:3000';
    const url = `${eventServiceUrl}${request.url}`; 

    console.log(
      `Gateway: Forwarding request to Event Server (Event API): ${request.method} ${url}`,
    ); 

    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = {
        method: request.method as Method, 
        url: url, 
        data: undefined, 
        headers: headersToForward, 
      };

      const serviceResponse: AxiosResponse<unknown> = await lastValueFrom<
        AxiosResponse<unknown>
      >(
        this.httpService.request<any>(config).pipe(
          catchError((error: AxiosError<unknown>) => {
            const errorStatus = error.response?.status || 500;
            const errorData = (error.response as any)?.data || {
              message: 'Internal server error or Event Server is down',
            };
            console.error(
              `Gateway: Error forwarding GET /event/${id}: ${errorStatus} for ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
              errorData,
            );
            if (!response.headersSent) {
              response.status(errorStatus).send(errorData);
            }
            throw new Error('Forwarding error handled by catchError');
          }),
        ),
      );

      const { data, status, headers: responseHeaders } = serviceResponse;
      response
        .status(status)
        .set(responseHeaders as any)
        .send(data);
      console.log(
        `Gateway: Successfully forwarded GET /event/${id} response: ${status}`,
      );
    } catch (e: unknown) {
      let caughtErrorMessage: string | undefined;
      if (e instanceof Error) {
        caughtErrorMessage = e.message;
      } else if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof (e as { message: unknown }).message === 'string'
      ) {
        caughtErrorMessage = (e as { message: string }).message;
      } else if (typeof e === 'string') {
        caughtErrorMessage = e;
      }

      if (caughtErrorMessage !== 'Forwarding error handled by catchError') {
        console.error(
          `Gateway: Unexpected error during GET /event/${id} request forwarding`,
          e,
        );
      }
      if (!response.headersSent) {
        response
          .status(500)
          .send({ message: `An unexpected error occurred in Gateway during GET /event/${id} forwarding` });
      }
    }
  }

  // PATCH /event/:id (특정 이벤트 수정)
  @Patch('event/:id')
  async handleUpdateEventById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleUpdateEventById (PATCH /event/${id}) called. Forwarding...`);
    const eventServiceUrl = process.env.EVENT_API_URL || 'http://event-server-container:3000';
    const url = `${eventServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding PATCH request to Event Server: ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers['content-type']) {
      headersToForward['Content-Type'] = request.headers['content-type'];
    }
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = { method: 'PATCH', url: url, data: request.body, headers: headersToForward };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or Event Server is down' };
          console.error(`Gateway: Error forwarding PATCH /event/${id}: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded PATCH /event/${id} response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error(`Gateway: Unexpected error PATCH /event/${id}`, e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // DELETE /event/:id (특정 이벤트 삭제)
  @Delete('event/:id')
  async handleDeleteEventById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleDeleteEventById (DELETE /event/${id}) called. Forwarding...`);
    const eventServiceUrl = process.env.EVENT_API_URL || 'http://event-server-container:3000';
    const url = `${eventServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding DELETE request to Event Server: ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = { method: 'DELETE', url: url, headers: headersToForward };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or Event Server is down' };
          console.error(`Gateway: Error forwarding DELETE /event/${id}: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded DELETE /event/${id} response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error(`Gateway: Unexpected error DELETE /event/${id}`, e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // --- End of Event API Handlers ---

  // --- Reward API Handlers (이전과 동일, 이미 잘 작동 중) ---

  // GET /reward (전체 리워드 목록 조회)
  @Get('reward')
  async handleGetRewardsList(@Req() request: Request, @Res() response: Response) {
    console.log(`>>> handleGetRewardsList (GET /reward) called. Forwarding...`);
    const eventServiceUrl = 'http://event-server-container:3000';
    const url = `${eventServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding GET request to Event Server (Reward API): ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: url,
        headers: headersToForward,
      };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or Event Server is down' };
          console.error(`Gateway: Error forwarding GET /reward: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded GET /reward response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error('Gateway: Unexpected error GET /reward', e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // POST /reward (새로운 리워드 생성)
  @Post('reward')
  async handleCreateReward(@Req() request: Request, @Res() response: Response) {
    console.log(`>>> handleCreateReward (POST /reward) called. Forwarding...`);
    const eventServiceUrl = 'http://event-server-container:3000';
    const url = `${eventServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding POST request to Event Server (Reward API): ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers['content-type']) {
      headersToForward['Content-Type'] = request.headers['content-type'];
    }
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = {
        method: 'POST',
        url: url,
        data: request.body,
        headers: headersToForward,
      };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or Event Server is down' };
          console.error(`Gateway: Error forwarding POST /reward: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded POST /reward response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error('Gateway: Unexpected error POST /reward', e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // GET /reward/:id (특정 리워드 상세 조회)
  @Get('reward/:id')
  async handleGetRewardById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleGetRewardById (GET /reward/${id}) called. Method: ${request.method}. Forwarding...`);
    const eventServiceUrl = 'http://event-server-container:3000';
    const url = `${eventServiceUrl}${request.url}`;

    console.log(`Gateway: Forwarding GET request to Event Server (Reward API): ${request.method} ${url}`);
    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: url,
        headers: headersToForward,
      };
      const serviceResponse = await lastValueFrom(this.httpService.request<any>(config).pipe(
        catchError((error: AxiosError<unknown>) => {
          const errorStatus = error.response?.status || 500;
          const errorData = (error.response as any)?.data || { message: 'Internal server error or Event Server is down' };
          console.error(`Gateway: Error forwarding GET /reward/${id}: ${errorStatus}`, errorData);
          if (!response.headersSent) { response.status(errorStatus).send(errorData); }
          throw new Error('Forwarding error handled by catchError');
        }),
      ));
      response.status(serviceResponse.status).set(serviceResponse.headers as any).send(serviceResponse.data);
      console.log(`Gateway: Successfully forwarded GET /reward/${id} response: ${serviceResponse.status}`);
    } catch (e: unknown) {
      if (!(e instanceof Error && e.message === 'Forwarding error handled by catchError') && !response.headersSent) {
        console.error(`Gateway: Unexpected error GET /reward/${id}`, e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway' });
      }
    }
  }

  // PATCH /reward/:id (특정 리워드 수정)
  @Patch('reward/:id')
  async handleUpdateRewardById(
    @Param('id') id: string, 
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleUpdateRewardById (PATCH /reward/${id}) called. Method: ${request.method}. Forwarding...`);
    const eventServiceUrl = 'http://event-server-container:3000'; 
    const url = `${eventServiceUrl}${request.url}`; 

    console.log(
      `Gateway: Forwarding request to Event Server (Reward API): ${request.method} ${url}`,
    );

    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers['content-type']) {
      headersToForward['Content-Type'] = request.headers['content-type'];
    }
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = {
        method: request.method as Method, 
        url: url, 
        data: request.body,
        headers: headersToForward, 
      };

      const serviceResponse: AxiosResponse<unknown> = await lastValueFrom<
        AxiosResponse<unknown>
      >(
        this.httpService.request<any>(config).pipe(
          catchError((error: AxiosError<unknown>) => {
            const errorStatus = error.response?.status || 500;
            const errorData = (error.response as any)?.data || {
              message: 'Internal server error or Event Server is down',
            };
            console.error(
              `Gateway: Error forwarding PATCH /reward/${id}: ${errorStatus} for ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
              errorData,
            );
            if (!response.headersSent) {
              response.status(errorStatus).send(errorData);
            }
            throw new Error('Forwarding error handled by catchError');
          }),
        ),
      );

      const { data, status, headers: responseHeaders } = serviceResponse;
      response
        .status(status)
        .set(responseHeaders as any)
        .send(data);
      console.log(
        `Gateway: Successfully forwarded PATCH /reward/${id} response: ${status}`,
      );
    } catch (e: unknown) {
      let caughtErrorMessage: string | undefined;
      if (e instanceof Error) {
        caughtErrorMessage = e.message;
      } else if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof (e as { message: unknown }).message === 'string'
      ) {
        caughtErrorMessage = (e as { message: string }).message;
      } else if (typeof e === 'string') {
        caughtErrorMessage = e;
      }

      if (caughtErrorMessage !== 'Forwarding error handled by catchError') {
        console.error(
          `Gateway: Unexpected error during PATCH /reward/${id} request forwarding`,
          e,
        );
      }
      if (!response.headersSent) {
        response.status(500).send({
          message: `An unexpected error occurred in Gateway during PATCH /reward/${id} forwarding`,
        });
      }
    }
  }

  // DELETE /reward/:id 요청을 처리하는 전용 메소드
  @Delete('reward/:id')
  async handleDeleteRewardById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(`>>> handleDeleteRewardById for /reward/${id} called. Forwarding...`);
    const eventServiceUrl = 'http://event-server-container:3000'; 
    const url = `${eventServiceUrl}${request.url}`; 

    console.log(
      `Gateway: Forwarding DELETE request to Event Server (Reward API): ${request.method} ${url}`,
    );

    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = {
        method: 'DELETE', 
        url: url,
        headers: headersToForward,
      };

      const serviceResponse: AxiosResponse<unknown> = await lastValueFrom<
        AxiosResponse<unknown>
      >(
        this.httpService.request<any>(config).pipe(
          catchError((error: AxiosError<unknown>) => {
            const errorStatus = error.response?.status || 500;
            const errorData = (error.response as any)?.data || {
              message: 'Internal server error or Event Server is down during DELETE',
            };
            console.error(
              `Gateway: Error forwarding DELETE request to Event Server (Reward API): ${errorStatus} for ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
              errorData,
            );
            if (!response.headersSent) {
              response.status(errorStatus).send(errorData);
            }
            throw new Error('Forwarding error handled by catchError');
          }),
        ),
      );

      const { data, status, headers: responseHeaders } = serviceResponse;
      response.status(status).set(responseHeaders as any).send(data);
      console.log(
        `Gateway: Successfully forwarded DELETE response from Event Server (Reward API): ${status}`,
      );
    } catch (e: unknown) {
      if (!response.headersSent && !(e instanceof Error && e.message === 'Forwarding error handled by catchError')) {
        console.error('Gateway: Unexpected error during DELETE Reward API request forwarding', e);
        response.status(500).send({ message: 'An unexpected error occurred in Gateway during DELETE Reward API forwarding' });
      }
    }
  }

  // --- End of Reward API Handlers ---

  // ??? Reward Request API 라우팅 메서드!! ???
  // '/reward-request', '/reward-request/:id' 경로로 오는 모든 요청을 Event Server로 전달
  @All('reward-request') // ? /reward-request 경로만 처리
  @Get('reward-request/:id')
  // @Patch('reward-request/:id') // 필요시 주석 해제
  @Delete('reward-request/:id')
  @Post('reward-request/:id') 
  async handleRewardRequestApiRequests(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log('>>> handleRewardRequestApiRequests 호출됨');
    const eventServiceUrl = 'http://event-server-container:3000'; 
    const url = `${eventServiceUrl}${request.url}`;

    console.log(
      `Gateway: Forwarding request to Event Server (Reward Request API): ${request.method} ${url}`,
    ); 

    const headersToForward: Record<string, string | string[]> = {};
    if (request.headers['content-type']) {
      headersToForward['Content-Type'] = request.headers['content-type'];
    }
    if (request.headers.authorization) {
      headersToForward['Authorization'] = request.headers.authorization;
    }

    try {
      const config: AxiosRequestConfig = {
        method: request.method as Method, 
        url: url, 
        data: request.body as unknown, 
        headers: headersToForward, 
      };

      const serviceResponse: AxiosResponse<unknown> = await lastValueFrom<
        AxiosResponse<unknown>
      >(
        this.httpService.request<any>(config).pipe(
          catchError((error: AxiosError<unknown>) => {
            const errorStatus = error.response?.status || 500;
            const errorData = (error.response as any)?.data || {
              message: 'Internal server error or Event Server is down',
            };
            console.error(
              `Gateway: Error forwarding request to Event Server (Reward Request API): ${errorStatus} for ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
              errorData,
            );
            if (!response.headersSent) {
              response.status(errorStatus).send(errorData);
            }
            throw new Error('Forwarding error handled by catchError');
          }),
        ),
      );

      const { data, status, headers: responseHeaders } = serviceResponse;
      response
        .status(status)
        .set(responseHeaders as any)
        .send(data);
      console.log(
        `Gateway: Successfully forwarded response from Event Server (Reward Request API): ${status}`,
      );
    } catch (e: unknown) {
      let caughtErrorMessage: string | undefined;
      if (e instanceof Error) {
        caughtErrorMessage = e.message;
      } else if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof (e as { message: unknown }).message === 'string'
      ) {
        caughtErrorMessage = (e as { message: string }).message;
      } else if (typeof e === 'string') {
        caughtErrorMessage = e;
      }

      if (caughtErrorMessage !== 'Forwarding error handled by catchError') {
        console.error(
          'Gateway: Unexpected error during Reward Request API forwarding',
          e,
        );
      }
      if (!response.headersSent) {
        response.status(500).send({
          message:
            'An unexpected error occurred in Gateway during Reward Request API forwarding',
        });
      }
    }
  }

  // 기본 GET / 요청 (Gateway 자체의 응답)
  @Get()
  getHello(): string {
    console.log('Gateway: Received GET / request');
    return this.appService.getHello();
  }
}
