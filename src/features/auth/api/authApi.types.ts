import {
    loginArgsSchema,
    loginResponseSchema,
    meResponseSchema,
    refreshTokenArgSchema
} from "@/features/auth/model/auth.schemas.ts";
import {z} from "zod/v4";

export type MeResponse = z.infer<typeof meResponseSchema>
export type LoginArgs = z.infer<typeof loginArgsSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type RefreshTokenArg = z.infer<typeof refreshTokenArgSchema>