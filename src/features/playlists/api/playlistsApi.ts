import { baseApi } from '@/app/baseApi.ts'
import type {
    CreatePlaylistArgs,
    CreatePlaylistRequest,
    CreatePlaylistResponse,
    FetchPlaylistsArgs,
    PlaylistsResponse,
    UpdatePlaylistArgs,
    UpdatePlaylistRequest,
} from '@/features/playlists/api/playlistsApi.types.ts'
import type { Images } from '@/common/types/types.ts'

export const playlistsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // fetchPlaylists: builder.query<PlaylistsResponse, FetchPlaylistsArgs>({
        //     query: (args) => `playlists?pageSize=${args.pageSize}`,
        //     providesTags: ["Playlists"],
        // }),
        fetchPlaylists: builder.query<PlaylistsResponse, FetchPlaylistsArgs>({
            query: (parameters) => {
                return {
                    url: 'playlists',
                    params: parameters,
                }
            },
            providesTags: ['Playlist'],
        }),

        createPlaylist: builder.mutation<CreatePlaylistResponse, CreatePlaylistArgs>({
            query: ({ title, description }) => {
                const body: CreatePlaylistRequest = {
                    data: {
                        type: 'playlists',
                        attributes: {
                            title,
                            description,
                        },
                    },
                }

                return {
                    url: 'playlists',
                    method: 'post',
                    body,
                }
            },
            invalidatesTags: ['Playlist'],
        }),

        updatePlaylistCover: builder.mutation<Images, { playlistId: string; file: File }>({
            query: ({ playlistId, file }) => {
                const formData = new FormData()
                formData.append('file', file)

                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'post',
                    body: formData,
                }
            },
            invalidatesTags: ['Playlist'],
        }),

        deletePlaylistCover: builder.mutation<void, { playlistId: string }>({
            query: ({ playlistId }) => {
                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'delete',
                }
            },
            invalidatesTags: ['Playlist'],
        }),

        deletePlaylist: builder.mutation<void, string>({
            query: (playlistId) => {
                return {
                    url: `playlists/${playlistId}`,
                    method: 'delete',
                }
            },
            invalidatesTags: ['Playlist'],
        }),

        updatePlaylist: builder.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
            query: ({ playlistId, body }) => {
                const requestBody: UpdatePlaylistRequest = {
                    data: {
                        type: 'playlists',
                        attributes: {
                            title: body.title,
                            description: body.description,
                            tagIds: [...body.tagIds],
                        },
                    },
                }
                return {
                    url: `playlists/${playlistId}`,
                    method: 'put',
                    body: requestBody,
                }
            },

            async onQueryStarted(
                { playlistId, body }: { playlistId: string; body: UpdatePlaylistArgs },
                { queryFulfilled, dispatch, getState }
            ) {
                // В args получаем все queryParameters
                const args = playlistsApi.util.selectCachedArgsForQuery(
                    getState(),
                    'fetchPlaylists'
                )

                const patchResults: any[] = []

                args.forEach((arg) => {
                    patchResults.push(
                        dispatch(
                            playlistsApi.util.updateQueryData(
                                'fetchPlaylists',
                                {
                                    pageNumber: arg.pageNumber,
                                    pageSize: arg.pageSize,
                                    search: arg.search,
                                },
                                (state) => {
                                    const index = state.data.findIndex(
                                        (playlist) => playlist.id === playlistId
                                    )
                                    if (index !== -1) {
                                        state.data[index].attributes = {
                                            ...state.data[index].attributes,
                                            ...body,
                                        }
                                    }
                                }
                            )
                        )
                    )
                })

                try {
                    await queryFulfilled
                } catch {
                    patchResults.forEach((patchResult) => {
                        patchResult.undo()
                    })
                }
            },

            invalidatesTags: ['Playlist'],
        }),
    }),
})

export const {
    useFetchPlaylistsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
    useUpdatePlaylistMutation,
    useUpdatePlaylistCoverMutation,
    useDeletePlaylistCoverMutation,
} = playlistsApi
