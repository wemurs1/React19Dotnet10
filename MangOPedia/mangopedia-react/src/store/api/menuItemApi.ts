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
};

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

    createMenuItem: builder.mutation({
      query: (formData: FormData) => ({
        url: '/MenuItem',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['MenuItem'],
    }),

    deleteMenuItem: builder.mutation({
      query: (id: number) => ({
        url: `/MenuItem/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItem'],
    }),

    updateMenuItem: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/MenuItem/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['MenuItem'],
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useUpdateMenuItemMutation,
} = menuItemsApi;
