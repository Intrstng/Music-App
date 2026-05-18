export const AUTH_TOKEN = 'auth-token'

export const Path = {
    Main: '/',
    Playlists: '/playlists',
    Tracks: '/tracks',
    Profile: '/profile',
    Login: '/login',
    OAuthRedirect: '/oauth/callback',
    NotFound: '*',
} as const

export const AUTH_KEYS = {
    accessToken: 'musicfun-access-token',
    refreshToken: 'musicfun-refresh-token',
} as const
