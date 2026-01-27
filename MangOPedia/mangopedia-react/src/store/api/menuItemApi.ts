import { baseApi } from './baseApi';

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  specialTag: string;
  price: number;
  image: string;
  ratings: number;
};

export type MenuItemForm = {
  name: string;
  description: string;
  category: string;
  specialTag: string;
  price: string;
  image: string | null;
}

export const menuItemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create all endpoints
    getMenuItems: builder.query({
      query: () => '/MenuItem',
      providesTags: ['MenuItem'],
      transformResponse: (response) => {
        if (response && response.result && Array.isArray(response.result)) {
          return response.result as MenuItem[];
        }
        if (response && Array.isArray(response)) {
          return response as MenuItem[];
        }
        return [] as MenuItem[];
      },
    }),
  }),
});

export const { useGetMenuItemsQuery } = menuItemsApi;
