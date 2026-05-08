import type { CoverType, Images, Tag, User } from '@/common/types/types.ts'
import type { CurrentUserReaction } from '@/common/enums/enums.ts'

export type PlaylistsResponse = {
    data: PlaylistData[]
    meta: PlaylistMeta
}

export type PlaylistData = {
    id: string
    type: 'playlists'
    attributes: PlaylistAttributes
}

export type PlaylistMeta = {
    page: number
    pageSize: number
    totalCount: number
    pagesCount: number
}

export type PlaylistAttributes = {
    title: string
    description: string
    addedAt: string
    updatedAt: string
    order: number
    dislikesCount: number
    likesCount: number
    tags: Tag[]
    images: Images
    user: User
    currentUserReaction: CurrentUserReaction
    // Added for mutation queries
    tracksCount?: number
    duration?: number
}

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

export type CreatePlaylistArgs = Pick<PlaylistAttributes, 'title' | 'description'>

export type CreatePlaylistResponse = {
    data: PlaylistData
}

export type UpdatePlaylistArgs = Pick<PlaylistAttributes, 'title' | 'description'> & {
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
        type: CoverType
        width: number
        height: number
        fileSize: number
        url: string
    }
}
