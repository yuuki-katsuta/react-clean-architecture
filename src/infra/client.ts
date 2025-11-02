import { createHTTPClient } from '../libs/http';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const httpClient = createHTTPClient(BASE_URL);
