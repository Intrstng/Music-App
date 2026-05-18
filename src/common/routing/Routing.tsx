import { Route, Routes } from 'react-router'
import { PlaylistsPage } from '@/features/playlists/ui/PlaylistsPage'
import { ProfilePage } from '@/features/auth/ui/ProfilePage'
import { PageNotFound } from '@/common/components'
import { MainPage } from '@/app/MainPage'
import { Path } from '@/common/constants'
import { TracksPage } from '@/features/tracks/ui'
import { LoginPage } from '@/features/auth/ui/LoginPage/LoginPage.tsx'
import {OAuthCallback} from "@/features/auth/ui/OAuthCallback/OAuthCallback.tsx";

export const Routing = () => (
    <Routes>
        <Route path={Path.Main} element={<MainPage />} />
        <Route path={Path.Playlists} element={<PlaylistsPage />} />
        <Route path={Path.Tracks} element={<TracksPage />} />
        <Route path={Path.Profile} element={<ProfilePage />} />
        <Route path={Path.Login} element={<LoginPage />} />
        <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
        <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
)
