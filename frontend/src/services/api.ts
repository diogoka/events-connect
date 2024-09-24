import axios, { AxiosInstance, AxiosError } from 'axios';

type APIInstanceProps = AxiosInstance;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
}) as APIInstanceProps;

export { api };
