import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, STORAGE_KEYS } from '../../utility/constants';
import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL + "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});


const baseQueryWithAuth = async (
  args: string | FetchArgs,
  _api: BaseQueryApi,
  extraOptions: object,
) => {
  const result = await baseQuery(args, _api, extraOptions);

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [],
  endpoints: () => ({}), // Endpoints defined in individual API files
});
