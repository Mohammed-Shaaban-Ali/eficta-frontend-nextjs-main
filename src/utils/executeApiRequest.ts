import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { signOut } from './auth';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_EFICTA,
});

// ---------- Helpers ----------
const getCurrentLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const pathSegments = window.location.pathname.split('/');
    const langFromUrl = pathSegments[1];

    if (langFromUrl === 'en' || langFromUrl === 'ar') return langFromUrl;

    const langCookie = getCookie('NEXT_LOCALE');
    if (langCookie === 'en' || langCookie === 'ar') return langCookie;
  }

  return 'en';
};

// ======  API to Refresh x-api-token ======
export const refreshApiToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_EFICTA}/api/api-auth/login`,
      {
        username: process.env.NEXT_PUBLIC_APP_USERNAME,
        password: process.env.NEXT_PUBLIC_APP_PASSWORD,
      },
    );

    const newToken = res.data?.access_token;
    if (newToken) setCookie('api-token', newToken);

    return newToken;
  } catch (err) {
    return null;
  }
};

// ---------- Requests Interceptor ----------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers || {};

    const token = getCookie('access-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const apiToken = getCookie('api-token');
    if (apiToken) config.headers['x-api-token'] = apiToken;

    config.headers['lng'] = getCurrentLanguage();

    const formdata = config.headers['Content-Type'];
    if (formdata) {
      if (formdata === 'application/pdf') config.responseType = 'blob';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ---------- Response Interceptor ----------
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) promise.resolve(token);
    else promise.reject(error);
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    //  in case of 403 and jwt expired → Refresh x-api-token
    if (error.response?.data.status === 'EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['x-api-token'] = token;
          return apiClient(originalRequest);
        });
      }

      isRefreshing = true;

      const newToken = await refreshApiToken();

      if (!newToken) {
        processQueue(null, null);
        return Promise.reject(error);
      }

      processQueue(null, newToken);
      isRefreshing = false;

      originalRequest.headers['x-api-token'] = newToken;
      return apiClient(originalRequest);
    }
    //  in case of 401 or 403 → Sign Out User
    else if (error.response?.status === 401 || error.response?.status === 403) {
      signOut();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// ---------- Exported Function ----------
export async function executeApiRequest<T>(
  config: AxiosRequestConfig = {},
  formdata?: 'application/pdf' | 'multipart/form-data' | 'application/json',
): Promise<T> {
  config.headers = config.headers || {};

  if (formdata) config.headers['Content-Type'] = formdata;
  if (!config.headers['lng']) config.headers['lng'] = getCurrentLanguage();

  const response = await apiClient(config);
  return response.data as T;
}
