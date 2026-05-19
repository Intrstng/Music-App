import {baseApi} from '@/app/api/baseApi.ts'
import type {
    CreatePlaylistArgs,
    CreatePlaylistRequest,
    CreatePlaylistResponse,
    FetchPlaylistsArgs, PlaylistCreatedEvent,
    PlaylistsResponse, PlaylistUpdatedEvent,
    UpdatePlaylistArgs,
    UpdatePlaylistRequest,
} from '@/features/playlists/api/playlistsApi.types.ts'
import type {Images} from '@/common/types/types.ts'
import {playlistCreateResponseSchema, playlistsResponseSchema} from "@/features/playlists/model/playlists.schemas.ts";
import {imagesSchema} from "@/common/schemas/schemas.ts";
import {withZodCatch} from "@/common/utils/withZodCatch.ts";
import {io, Socket} from "socket.io-client";
import {subscribeToEvent} from "@/common/socket/subscribeToEvent.ts";
import {SOCKET_EVENTS} from "@/common/constants";

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

            // responseSchema: playlistsResponseSchema,
            // catchSchemaFailure: err => {
            //     errorToast('Zod error. Details in the console', err.issues)
            //     return { status: 'CUSTOM_ERROR', error: 'Schema validation failed' }
            // },
            ...withZodCatch(playlistsResponseSchema),

            skipSchemaValidation: process.env.NODE_ENV === 'production',
            // отключить zod валидацию на продакшене для уменьшения бандла
            // и увеличения скорости выполнения кода
            //
            //
            // Websocket
            keepUnusedDataFor: 0, // 👈 очистка сразу после размонтирования
            async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                // Ждем разрешения начального запроса перед продолжением
                await cacheDataLoaded // ждем выполнения query в fetchPlaylists


                // !!!!!!!!!! //
                // PLAYLIST_CREATED
                const unsubscribe = subscribeToEvent<PlaylistCreatedEvent>(
                    SOCKET_EVENTS.PLAYLIST_CREATED,
                    msg => {
                        const newPlaylist = msg.payload.data
                        updateCachedData(state => {
                            state.data.pop()
                            state.data.unshift(newPlaylist)
                            state.meta.totalCount = state.meta.totalCount + 1
                            state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
                        })
                    }
                )

                // !!!!!!!!!! //
                // PLAYLIST_UPDATED
                const unsubscribe2 = subscribeToEvent<PlaylistUpdatedEvent>(
                    SOCKET_EVENTS.PLAYLIST_UPDATED,
                    msg => {
                        const newPlaylist = msg.payload.data
                        updateCachedData(state => {
                            const index = state.data.findIndex(playlist => playlist.id === newPlaylist.id)
                            if (index !== -1) {
                                state.data[index] = { ...state.data[index], ...newPlaylist }
                            }
                        })
                    }
                )
                // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
                await cacheEntryRemoved // закрываем соединение
                unsubscribe()
                unsubscribe2()
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

            // responseSchema: playlistCreateResponseSchema,
            // catchSchemaFailure: err => {
            //     errorToast('Zod error. Details in the console', err.issues)
            //     return { status: 'CUSTOM_ERROR', error: 'Schema validation failed' }
            // },
            ...withZodCatch(playlistCreateResponseSchema),


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

            // responseSchema: imagesSchema,
            // catchSchemaFailure: err => {
            //     errorToast('Zod error. Details in the console', err.issues)
            //     return { status: 'CUSTOM_ERROR', error: 'Schema validation failed' }
            // },
            ...withZodCatch(imagesSchema),




            invalidatesTags: ['Playlist'],
        }),

        deletePlaylistCover: builder.mutation<void, { playlistId: string }>({
            query: ({ playlistId }) => {
                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'delete',
                }
            },

            // Если бэкенд ничего не возвращает, значит и валидировать ничего не нужно.
            // Соответственно эндпоинты deletePlaylist, updatePlaylist и deletePlaylistCover
            // оставляем как есть.

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
