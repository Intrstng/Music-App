export type MeResponse = {
    userId: string
    login: string
}

export type LoginArgs = {
    code: string
    redirectUri: string
    accessTokenTTL?: '60s' | '3m' | '2h' | '1d'
    rememberMe: boolean
}

export type LoginResponse = {
    refreshToken: string
    accessToken: string
}


export type RefreshTokenArg = {
    refreshToken: string
}