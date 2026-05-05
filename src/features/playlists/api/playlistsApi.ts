import {baseApi} from '@/app/baseApi.ts'
import type {
  CreatePlaylistArgs,
  CreatePlaylistRequest,
  CreatePlaylistResponse,
  PlaylistsResponse,
  UpdatePlaylistArgs, UpdatePlaylistRequest,
} from '@/features/playlists/api/playlistsApi.types.ts'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // fetchPlaylists: builder.query<PlaylistsResponse, FetchPlaylistsArgs>({
    //     query: (args) => `playlists?pageSize=${args.pageSize}`,
    //     providesTags: ["Playlists"],
    // }),
    fetchPlaylists: builder.query<PlaylistsResponse, void>({
      query: () => 'playlists',
      providesTags: ['Playlists'],
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
      invalidatesTags: ['Playlists'],
    }),

    deletePlaylist: builder.mutation<void, string>({
      query: (playlistId) => {
        return {
          url: `playlists/${playlistId}`,
          method: 'delete',
        }
      },
      invalidatesTags: ['Playlists'],
    }),

    updatePlaylist: builder.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => {

        const requestBody: UpdatePlaylistRequest = {
          data: {
            type: "playlists",
            attributes: {
              title: body.title,
              description: body.description,
              tagIds: [...body.tagIds]
            }
          }
        }

        return {
          url: `playlists/${playlistId}`,
          method: 'put',
          body: requestBody
        }
      },
      invalidatesTags: ['Playlists'],
    }),
  }),
})

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation, useDeletePlaylistMutation, useUpdatePlaylistMutation } = playlistsApi
