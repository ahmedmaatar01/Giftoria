// config.js
// Central place to manage API base URL for all environments

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
//export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.giftoria.me";
export const API_BASE_URL_WITH_API = `${API_BASE_URL}/api`;
export const API_STORAGE_URL = `${API_BASE_URL}/storage`;
