const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://lunavest-ecormerce.onrender.com";

interface BaseResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export const apiFetch = async <T = BaseResponse>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
};

export const apiPost = <T = unknown, R = BaseResponse>(endpoint: string, body: T, options: RequestInit = {}): Promise<R> => {
  return apiFetch<R>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
};

export const apiFormData = async <T = BaseResponse>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<T> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    ...options,
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
};

