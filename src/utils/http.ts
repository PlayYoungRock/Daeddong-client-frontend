import axios from 'axios';

export const httpInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: '*/*',
  },
});

httpInstance.interceptors.request.use(
  (req) => req,
  (error) => Promise.reject(error),
);

httpInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error),
);
