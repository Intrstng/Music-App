// import {useDeletePlaylistMutation, useFetchPlaylistsQuery,} from '@/features/playlists/api/playlistsApi.ts'
// import s from '@/features/playlists/ui/PlaylistsPage/PlaylistsPage.module.css'
// import {CreatePlaylistForm} from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx'
// import type {PlaylistData, UpdatePlaylistArgs,} from '@/features/playlists/api/playlistsApi.types.ts'
// import {type ChangeEvent, useState} from 'react'
// import {useForm} from 'react-hook-form'
// import {PlaylistItem} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx'
// import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx'
// import {useDebounceValue} from "@/common/utils/useDebounceValue.ts";
// import {Pagination} from "@/common/components/Pagination/Pagination.tsx";
//
// export const PlaylistsPage = () => {
//     const [search, setSearch] = useState('')
//     const [currentPage, setCurrentPage] = useState<number>(1)
//     const [pageSize, setPageSize] = useState(2)
//     const debounceSearch = useDebounceValue(search)
//     // const { data } = useFetchPlaylistsQuery({pageSize: 3})
//     // const { data: playlists, isLoading } = useFetchPlaylistsQuery({search: debounceSearch, pageNumber: 1, pageSize: 4})
//
//     const { data: playlists, isLoading } = useFetchPlaylistsQuery({search: debounceSearch, pageNumber: currentPage, pageSize: pageSize})
//
//     const [deletePlaylist] = useDeletePlaylistMutation()
//     const [playlistId, setPlaylistId] = useState<string | null>(null)
//     const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
//
//     const deletePlaylistHandler = (playlistId: string): void => {
//         if (confirm('Are you sure you want to delete the playlist?')) {
//             deletePlaylist(playlistId)
//         }
//     }
//
//     const editPlaylistHandler = (playlist: PlaylistData | null) => {
//         if (playlist) {
//             setPlaylistId(playlist.id)
//             reset({
//                 title: playlist.attributes.title,
//                 description: playlist.attributes.description,
//                 tagIds: playlist.attributes.tags.map((t) => t.id),
//             })
//         } else {
//             setPlaylistId(null)
//         }
//     }
//
//     const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.currentTarget.value)
//     }
//
//     const changePaginationPageHandler = (nextPage: number) => {
//         setCurrentPage(nextPage)
//     }
//
//     const changePageSizeHandler = (size: number) => {
//         setPageSize(size)
//         setCurrentPage(1)
//     }
//
//     return (
//         <div className={s.container}>
//             <h1>Playlists page</h1>
//             <CreatePlaylistForm />
//
//             <input
//                 type="search"
//                 placeholder={'Search playlist by title'}
//                 onChange={searchPlaylistHandler}
//             />
//             {!playlists?.data.length && !isLoading && <h2>Playlists not found...</h2>}
//             <div className={s.items}>
//                 {playlists?.data.map((playlist) => {
//                     return (
//                         <div className={s.item} key={playlist.id}>
//                             {playlistId === playlist.id ? (
//                                 <EditPlaylistForm
//                                     playlistId={playlistId}
//                                     handleSubmit={handleSubmit}
//                                     register={register}
//                                     editPlaylist={editPlaylistHandler}
//                                     setPlaylistId={setPlaylistId}
//                                 />
//                             ) : (
//                                 <PlaylistItem
//                                     playlist={playlist}
//                                     deletePlaylist={deletePlaylistHandler}
//                                     editPlaylist={editPlaylistHandler}
//                                 />
//                             )}
//                         </div>
//                     )
//                 })}
//             </div>
//             <Pagination
//                 currentPage={currentPage}
//                 setCurrentPage={changePaginationPageHandler}
//                 pagesCount={playlists?.meta.pagesCount || 1}
//                 pageSize={pageSize}
//                 changePageSize={changePageSizeHandler}
//             />
//         </div>
//     )
// }
//


import {useFetchPlaylistsQuery,} from '@/features/playlists/api/playlistsApi.ts'
import s from '@/features/playlists/ui/PlaylistsPage/PlaylistsPage.module.css'
import {CreatePlaylistForm} from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx'
import {type ChangeEvent, useEffect, useState} from 'react'
import {useDebounceValue} from '@/common/hooks/useDebounceValue.ts'
import {Pagination} from '@/common/components/Pagination/Pagination.tsx'
import {PlaylistsList} from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx";
import {toast} from "react-toastify";

export const PlaylistsPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1)

    const [pageSize, setPageSize] = useState(4)
    const [search, setSearch] = useState('')
    const debounceSearch = useDebounceValue(search)
    const { data: playlists, isLoading, error, isError } = useFetchPlaylistsQuery({
        search: debounceSearch,
        pageNumber: currentPage,
        pageSize: pageSize,
    },
        // {
        //     pollingInterval: 3000,  // RTK Query автоматически повторяет запросы через заданный интервал, обновляя данные на клиенте.
        //                             // RTK Query оптимизирует процесс, останавливая запрос, если компонент размонтирован или пользователь не взаимодействует с приложением
        //     skipPollingIfUnfocused: true, // прекрати делать pooling если не в фокусе
        // }
        )
    const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
        setCurrentPage(1)
    }
    const changePaginationPageHandler = (nextPage: number) => {
        setCurrentPage(nextPage)
    }
    const changePageSizeHandler = (size: number) => {
        setCurrentPage(1)
        setPageSize(size)
    }

    if (isLoading) return <h1>Skeleton loader...</h1>

    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm />
            <input
                type="search"
                placeholder={'Search playlist by title'}
                onChange={searchPlaylistHandler}
            />
            <PlaylistsList
                playlists={playlists?.data || []}
                isLoading={isLoading}
            />
            {/*{isFetching && <LinearProgress />} - т.к. теперь isFetching через хук useGlobalLoading глобально*/}
            <Pagination
                currentPage={currentPage}
                setCurrentPage={changePaginationPageHandler}
                pagesCount={playlists?.meta.pagesCount || 1}
                pageSize={pageSize}
                changePageSize={changePageSizeHandler}
            />
        </div>
    )
}
