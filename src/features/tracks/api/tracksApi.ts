import {baseApi} from '@/app/api/baseApi.ts'
import type {FetchTracksResponse} from '@/features/tracks/api/tracksApi.types.ts'
import {withZodCatch} from "@/common/utils/withZodCatch.ts";
import {fetchTracksResponseSchema} from "@/features/tracks/model/tracks.schemas.ts";

export const tracksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchTracks: builder.infiniteQuery<FetchTracksResponse, void, string | undefined>({
            // fetchTracks: builder.infiniteQuery<FetchTracksResponse, void, string | undefined>  <-- void это параметры которые передаем, string | undefined это значение initialPageParam
            infiniteQueryOptions: {
                initialPageParam: undefined, // т.к. при курсорной пагинации при первой загрузке вернет undefined
                getNextPageParam: (lastPage) => {
                    return lastPage.meta.nextCursor || undefined // ссылка на следующий курсор (на след. страницу)
                },
            },
            query: ({ pageParam, queryArg }) => {
                // в pageParam будет попадать значение nextCursor
                // в queryArg будут попадать то что будем передавать вместо void в   fetchTracks: builder.infiniteQuery<FetchTracksResponse, void, string | undefined>
                return {
                    url: 'playlists/tracks',
                    params: { cursor: pageParam, pageSize: 5, paginationType: 'cursor' },
                }
            },

            ...withZodCatch(fetchTracksResponseSchema),

        }),
    }),
})

export const { useFetchTracksInfiniteQuery } = tracksApi

//////////////////////
// Offset Pagination//
//////////////////////
// export const tracksApi = baseApi.injectEndpoints({
//     endpoints: build => ({
//         fetchTracks: build.infiniteQuery<FetchTracksResponse, void, number>({
//             infiniteQueryOptions: {
//                 initialPageParam: 1,
//                 getNextPageParam: (lastPage, _allPages, lastPageParam) => {
//                     return lastPageParam < (lastPage.meta as { pagesCount: number }).pagesCount
//                         ? lastPageParam + 1
//                         : undefined
//                 },
//             },
//             query: ({ pageParam }) => {
//                 return {
//                     url: 'playlists/tracks',
//                     params: { pageNumber: pageParam, pageSize: 10, paginationType: 'offset' },
//                 }
//             },
//         }),
//     }),
// })
//
// export const { useFetchTracksInfiniteQuery } = tracksApi
