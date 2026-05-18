import { baseApi } from '@/app/baseApi.ts'
import type {LoginArgs, LoginResponse, MeResponse, RefreshTokenArg} from '@/features/auth/api/authApi.types.ts'
import {AUTH_KEYS} from "@/common/constants";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<MeResponse, void>({
            query: () => ({ url: 'auth/me' }),
            providesTags: ['Auth'],
        }),

        login: builder.mutation<LoginResponse, LoginArgs>({
            query: (body) => ({
                url: 'auth/login',
                method: 'Post',
                body: { ...body, accessTokenTTL: '3m' }, // задаем время жизни токена, т.к. нигде это больше не сетается, а задать должны сами
            }),


            async onQueryStarted(
                _args,
              { dispatch, queryFulfilled },
            ) {
                try {
                    const { data } = await queryFulfilled
                    localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
                    localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)

                    dispatch(authApi.util.invalidateTags(['Auth'])) // вызываем новый auth me с новым только что сохраненным токеном в localStorage
                } catch (error) {
                    console.error('Login failed:', error)
                }
            },
        }),

        refreshToken: builder.mutation<LoginResponse, RefreshTokenArg>({
            query: (body) => ({
                url: 'auth/refresh',
                method: 'Post',
                body,
            }),
        }),
    }),
})

export const { useGetMeQuery, useLoginMutation, useRefreshTokenMutation } = authApi
