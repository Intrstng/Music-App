import {useDeletePlaylistMutation, useFetchPlaylistsQuery,} from '@/features/playlists/api/playlistsApi.ts'
import s from '@/features/playlists/ui/PlaylistsPage/PlaylistsPage.module.css'
import {CreatePlaylistForm} from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx'
import type {PlaylistData, UpdatePlaylistArgs,} from '@/features/playlists/api/playlistsApi.types.ts'
import {type ChangeEvent, useState} from 'react'
import {useForm} from 'react-hook-form'
import {PlaylistItem} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx'
import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx'
import {useDebounceValue} from "@/common/utils/useDebounceValue.ts";
import {Pagination} from "@/common/components/Pagination/Pagination.tsx";

export const PlaylistsPage = () => {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const debounceSearch = useDebounceValue(search)
    const pageSize = 4
    // const { data } = useFetchPlaylistsQuery({pageSize: 3})
    // const { data: playlists, isLoading } = useFetchPlaylistsQuery({search: debounceSearch, pageNumber: 1, pageSize: 4})

    const { data: playlists, isLoading } = useFetchPlaylistsQuery({search: debounceSearch, pageNumber: currentPage, pageSize: pageSize})

    const [deletePlaylist] = useDeletePlaylistMutation()
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

    const deletePlaylistHandler = (playlistId: string): void => {
        if (confirm('Are you sure you want to delete the playlist?')) {
            deletePlaylist(playlistId)
        }
    }

    const editPlaylistHandler = (playlist: PlaylistData | null) => {
        if (playlist) {
            setPlaylistId(playlist.id)
            reset({
                title: playlist.attributes.title,
                description: playlist.attributes.description,
                tagIds: playlist.attributes.tags.map((t) => t.id),
            })
        } else {
            setPlaylistId(null)
        }
    }

    const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
    }

    const changePaginationPageHandler = (nextPage: number) => {
        setCurrentPage(nextPage)
    }

    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm />

            <input
                type="search"
                placeholder={'Search playlist by title'}
                onChange={searchPlaylistHandler}
            />
            {!playlists?.data.length && !isLoading && <h2>Playlists not found...</h2>}
            <div className={s.items}>
                {playlists?.data.map((playlist) => {
                    return (
                        <div className={s.item} key={playlist.id}>
                            {playlistId === playlist.id ? (
                                <EditPlaylistForm
                                    playlistId={playlistId}
                                    handleSubmit={handleSubmit}
                                    register={register}
                                    editPlaylist={editPlaylistHandler}
                                    setPlaylistId={setPlaylistId}
                                />
                            ) : (
                                <PlaylistItem
                                    playlist={playlist}
                                    deletePlaylist={deletePlaylistHandler}
                                    editPlaylist={editPlaylistHandler}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
            <Pagination currentPage={currentPage} setCurrentPage={changePaginationPageHandler} pagesCount={playlists?.meta.pagesCount || 1} />
        </div>
    )
}
