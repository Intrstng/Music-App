import type { PlaylistAttributes } from '@/features/playlists/api/playlistsApi.types.ts'

type PlaylistDescription = {
    attributes: PlaylistAttributes
}

export const PlaylistDescription = ({ attributes }: PlaylistDescription) => {
    return (
        <div>
            <div>title: {attributes.title}</div>
            <div>description: {attributes.description}</div>
            <div>userName: {attributes.user.name}</div>
        </div>
    )
}
