import type {Cover} from '@/common/types/types.ts'
import {
    createPlaylistSchema, fetchPlaylistsArgsSchema,
    playlistAttributesSchema, playlistDataSchema,
    playlistMetaSchema, playlistsResponseSchema
} from "@/features/playlists/model/playlists.schemas.ts";
import {z} from "zod/v4";

export type PlaylistsResponse = z.infer<typeof playlistsResponseSchema>
export type PlaylistData = z.infer<typeof playlistDataSchema>
export type PlaylistMeta = z.infer<typeof playlistMetaSchema>
export type PlaylistAttributes = z.infer<typeof playlistAttributesSchema>
// export type FetchPlaylistsArgs = z.infer<typeof fetchPlaylistsArgsSchema>

// Arguments
export type FetchPlaylistsArgs = {
    pageNumber?: number
    pageSize?: number
    search?: string
    sortBy?: 'addedAt' | 'likesCount'
    sortDirection?: 'asc' | 'desc'
    tagsIds?: string[]
    userId?: string
    trackId?: string
}

export type CreatePlaylistRequest = {
    data: {
        type: 'playlists'
        attributes: Pick<PlaylistAttributes, 'title' | 'description'>
    }
}

// export type CreatePlaylistArgs = Pick<PlaylistAttributes, 'title' | 'description'>
export type CreatePlaylistArgs = z.infer<typeof createPlaylistSchema>

export type CreatePlaylistResponse = {
    data: PlaylistData
}

// export type UpdatePlaylistArgs = Pick<PlaylistAttributes, 'title' | 'description'> & {
//     tagIds: string[]
// }
export type UpdatePlaylistArgs = {
    title: string
    description: string
    tagIds: string[]
}

export type UpdatePlaylistRequest = {
    data: {
        type: 'playlists'
        attributes: Pick<PlaylistAttributes, 'title' | 'description'> & {
            tagIds: string[]
        }
    }
}

export type UpdatePlaylistCoverRequest = {
    main: {
        type: Cover
        width: number
        height: number
        fileSize: number
        url: string
    }
}






export type CreatePlaylist = z.infer<typeof createPlaylistSchema>