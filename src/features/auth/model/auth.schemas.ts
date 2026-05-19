import {z} from "zod/v4";

export const meResponseSchema = z.object({
    userId: z.string(),
    login: z.string(),
})

export const loginResponseSchema = z.object({
    refreshToken: z.jwt(),
    accessToken: z.jwt(),
})

export const refreshTokenArgSchema = z.object({
    accessToken: z.jwt(),
})

export const loginArgsSchema = z.object({
    code: z.string(),
    redirectUri: z.url(),
    accessTokenTTL: z.literal(['60s', '3m', '2h', '1d']).optional(),
    rememberMe: z.boolean(),
})