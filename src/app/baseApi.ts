import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: ['Auth', 'Playlist', 'Track'],

    // keepUnusedDataFor: 5, // время жизни кэша в секундах
    // refetchOnFocus: true, // обновление кэша, т.е. потворный запрос данных при активности вкладки (используется для актуальности данных при переходе между открытыми вкладками с одними  и теме же данными)
                             // т.е. открыто два тудулиста, в одном добавим новый тудулист, откроем вторую вкладку и увидим что тудулисты везде обновились.
                             // Но теперь запросы будут идти всегда при переходе между страницами, а не браться из кэша (тогда его надо делать точечно в компонентах в вызове usePlaylistsQuery)
                             // !!! Но для refetchOnFocus надо добавить setupListeners в store
    // refetchOnReconnect: true, // повторный запрос данных, когда приложение или браузер восстанавливает соединение с интернетом после его потери

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
            'API-KEY': import.meta.env.VITE_API_KEY,
        },
        prepareHeaders: (headers) => {
            headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
            return headers
        },
    }),
    endpoints: () => ({}),
})
