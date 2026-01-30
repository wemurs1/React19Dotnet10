import { baseApi } from './baseApi';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  email: string;
  token: string;
  role: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
  role?: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create all endpoints
    loginUser: builder.mutation({
      query: (formData: LoginRequest) => ({
        url: '/auth/login',
        method: 'POST',
        body: formData,
      }),
    }),

    registerUser: builder.mutation({
      query: (formData: RegisterRequest) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;
