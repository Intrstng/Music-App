import {baseApi} from "@/app/baseApi.ts";
import type {PlaylistsResponse} from "@/features/playlists/api/playlistsApi.types.ts";


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchPlaylists: builder.query<PlaylistsResponse, void>({
            query: () => 'playlists',
        }),
    }),
})


export const {
    useFetchPlaylistsQuery,
} = playlistsApi