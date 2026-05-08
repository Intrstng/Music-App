import {useDeletePlaylistMutation, useFetchPlaylistsQuery,} from '@/features/playlists/api/playlistsApi.ts'
import s from '@/features/playlists/ui/PlaylistsPage/PlaylistsPage.module.css'
import {CreatePlaylistForm} from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx'
import type {PlaylistData, UpdatePlaylistArgs,} from '@/features/playlists/api/playlistsApi.types.ts'
import {type ChangeEvent, useState} from 'react'
import {useForm} from 'react-hook-form'
import {PlaylistItem} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx'
import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx'
import {useDebounceValue} from "@/common/utils/useDebounceValue.ts";

export const PlaylistsPage = () => {
    // const { data } = useFetchPlaylistsQuery({pageSize: 3})
    const [search, setSearch] = useState('')
    const debounceSearch = useDebounceValue(search)
    const { data: playlists, isLoading } = useFetchPlaylistsQuery({search: debounceSearch})
    const [deletePlaylist] = useDeletePlaylistMutation()
    // const [updatePlaylist] = useUpdatePlaylistMutation()
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
console.log(playlists?.data.length)
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
        </div>
    )
}
