import s from '@/features/playlists/ui/PlaylistsPage/PlaylistsPage.module.css'
import { EditPlaylistForm } from '@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx'
import { PlaylistItem } from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx'
import type {
    PlaylistData,
    UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useDeletePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'

type PlaylistsListProps = {
    playlists: PlaylistData[]
    isLoading: boolean
}

export const PlaylistsList = ({ playlists, isLoading }: PlaylistsListProps) => {
    const [deletePlaylist] = useDeletePlaylistMutation()
    const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
    const [playlistId, setPlaylistId] = useState<string | null>(null)

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

    const deletePlaylistHandler = (playlistId: string): void => {
        if (confirm('Are you sure you want to delete the playlist?')) {
            deletePlaylist(playlistId)
        }
    }

    return (
        <>
            {!playlists?.length && !isLoading && <h2>Playlists not found...</h2>}
            <div className={s.items}>
                {playlists?.map((playlist) => {
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
        </>
    )
}
