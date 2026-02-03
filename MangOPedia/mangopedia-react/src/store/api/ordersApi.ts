import { baseApi } from './baseApi';

export type OrderItem = {
  itemName: string;
  menuItemId: number;
  price: number;
  quantity: number;
};

export type OrderHeaderRequest = {
  pickUpEmail: string;
  pickUpName: string;
  pickUpPhoneNumber: string;
  applicationUserId: string;
  orderDetailsDTO: OrderItem[];
  orderTotal: number;
  totalItems: number;
};

export type ApiResponse = {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Order[];
};

export type Order = {
  orderHeaderId: number;
  pickUpName: string;
  pickUpPhoneNumber: string;
  pickUpEmail: string;
  orderDate: string;
  applicationUserId: string;
  orderTotal: number;
  status: string;
  totalItems: number;
  orderDetails: OrderDetail[];
};

export type OrderDetail = {
  orderDetailId: number;
  orderHeaderId: number;
  menuItemId: number;
  menuItem: MenuItem;
  quantity: number;
  itemName: string;
  price: number;
  rating: number;
};

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

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (userId: string = '') => ({
        url: '/OrderHeader',
        params: userId ? { userId } : {},
      }),
      providesTags: ['Order'],
      transformResponse: (response) => {
        if (response && response.result && Array.isArray(response.result)) {
          return response.result as OrderItem[];
        }
        if (response && Array.isArray(response)) {
          return response as OrderItem[];
        }
        return [] as OrderItem[];
      },
    }),

    getOrderById: builder.query({
      query: (id) => `/OrderHeader/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: 'Order', id }],
      transformResponse: (response) => {
        if (response && response.result) {
          return response.result;
        }
        return response;
      },
    }),

    createOrder: builder.mutation({
      query: (formData) => ({
        url: '/OrderHeader',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Order'],
    }),

    updateOrder: builder.mutation({
      query: ({ orderId, orderData }) => ({
        url: `/OrderHeader/${orderId}`,
        method: 'PUT',
        body: orderData,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [{ type: 'Order', id: orderId }],
    }),

    updateOrderDetails: builder.mutation({
      query: ({ orderDetailId, rating }) => ({
        url: `/OrderDetails/${orderDetailId}`,
        method: 'PUT',
        body: { orderDetailId: orderDetailId, rating: rating },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderDetailsMutation,
} = ordersApi;
