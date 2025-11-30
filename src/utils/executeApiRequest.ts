import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';
import { signOut } from './auth';

// Set the base URL for API requests
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_EFICTA,
  // withCredentials: true,
});

// Helper function to get the current language from URL or cookie
const getCurrentLanguage = (): string => {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    // Extract language from URL path
    const pathSegments = window.location.pathname.split('/');
    // First segment after the initial '/' should be the language code
    const langFromUrl = pathSegments[1];

    // Validate language code (only accept 'en' or 'ar')
    if (langFromUrl === 'en' || langFromUrl === 'ar') {
      return langFromUrl;
    }

    // Fallback to cookie if URL doesn't contain valid language
    const langFromCookie = getCookie('NEXT_LOCALE');
    if (
      typeof langFromCookie === 'string' &&
      (langFromCookie === 'en' || langFromCookie === 'ar')
    ) {
      return langFromCookie;
    }
  }

  // Default to 'en' if no language is detected
  return 'en';
};

// Request interceptor to handle headers and tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ensure headers object is defined
    config.headers = config.headers || {};

    // Get token from cookies
    const token = getCookie('access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language header based on current selected language
    const currentLanguage = getCurrentLanguage();
    config.headers['lng'] = currentLanguage;

    const formdata = config.headers['Content-Type'];

    if (formdata) {
      if (formdata === 'application/pdf') {
        config.responseType = 'blob';
      }
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle unauthorized or forbidden responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Delete auth token
      // deleteCookie('accessToken');
      signOut();
    }
    return Promise.reject(error);
  },
);

export async function executeApiRequest<T>(
  config: AxiosRequestConfig = {},
  formdata?: 'application/pdf' | 'multipart/form-data' | 'application/json',
): Promise<T> {
  try {
    // Ensure headers object is defined
    config.headers = config.headers || {};

    // Set the Content-Type header based on formdata parameter
    if (formdata) {
      config.headers['Content-Type'] = formdata;
    }

    // Ensure the language header is included in individual requests
    if (!config.headers['lng']) {
      config.headers['lng'] = getCurrentLanguage();
    }

    const response = await apiClient(config);
    return response.data as T;
  } catch (error: any) {
    throw error;
  }
}
