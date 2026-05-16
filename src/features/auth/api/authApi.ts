import { baseApi } from '@/app/baseApi.ts'
import type { MeResponse } from '@/features/auth/api/authApi.types.ts'

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<MeResponse, void>({
            query: () => ({ url: 'auth/me' }),
        }),
    }),
})

export const { useGetMeQuery } = authApi
