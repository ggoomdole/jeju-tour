import { deleteCookie, getCookie } from "@/utils/cookie";

import ky from "ky";

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const API_TIMEOUT = 10000; // 10초

// 서버측 API (Next.js 내장 fetch 사용)
export const serverApi = {
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token = await getCookie("jwtToken");
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token = await getCookie("jwtToken");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token = await getCookie("jwtToken");
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token = await getCookie("jwtToken");
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// 클라이언트측 API (ky 사용)
const clientKy = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
  retry: {
    limit: 2,
    methods: ["get", "post", "put", "delete"],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        // 클라이언트측에서 필요한 헤더 추가 (예: 인증 토큰)
        const token = await getCookie("jwtToken");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 응답 처리 로직 (예: 토큰 갱신)
        if (response.status === 401) {
          // 토큰 만료 처리
          deleteCookie("jwtToken");
          deleteCookie("accessToken");
          deleteCookie("userId");
          window.location.href = "/home";
        }
        return response;
      },
    ],
  },
});

export const clientApi = {
  async get<T>(endpoint: string, options?: Parameters<typeof clientKy.get>[1]): Promise<T> {
    return clientKy.get(endpoint, options).json<T>();
  },

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: Parameters<typeof clientKy.post>[1]
  ): Promise<T> {
    return clientKy.post(endpoint, { json: data, ...options }).json<T>();
  },

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: Parameters<typeof clientKy.put>[1]
  ): Promise<T> {
    return clientKy.put(endpoint, { json: data, ...options }).json<T>();
  },

  async delete<T>(endpoint: string, options?: Parameters<typeof clientKy.delete>[1]): Promise<T> {
    return clientKy.delete(endpoint, options).json<T>();
  },

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: Parameters<typeof clientKy.patch>[1]
  ): Promise<T> {
    return clientKy.patch(endpoint, { json: data, ...options }).json<T>();
  },
};
