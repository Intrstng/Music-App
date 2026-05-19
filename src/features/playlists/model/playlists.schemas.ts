import {z} from "zod/v4"
import {currentUserReactionSchema, imagesSchema, tagSchema, userSchema} from "@/common/schemas/schemas.ts";

export const createPlaylistSchema = z.object({
    title: z
        .string()
        .min(1, 'The title length must be more than 1 character')
        .max(100, 'The title length must be less than 100 characters'),
    description: z
        .string()
        .max(1000, 'The description length must be less than 1000 characters.'),
})

export const playlistMetaSchema = z.object({
    page: z.int().positive(),
    pageSize: z.int().positive(),
    totalCount: z.int().positive(),
    pagesCount: z.int().positive(),
})

export const playlistAttributesSchema = z.object({
    title: z.any(),
    description: z.string().optional(), // текущая API не соответствует варианту из урока
    addedAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    order: z.int(),
    dislikesCount: z.int().nonnegative(),
    likesCount: z.int().nonnegative(),
    tags: z.array(tagSchema),
    images: imagesSchema,
    user: userSchema,
    currentUserReaction: currentUserReactionSchema,
    // Added for mutation queries
    tracksCount: z.int().optional(),
    duration: z.number().optional(),
})

export const playlistDataSchema = z.object({
    id: z.string(),
    type: z.literal('playlists'),
    attributes: playlistAttributesSchema
})

export const playlistsResponseSchema = z.object({
    data: z.array(playlistDataSchema),
    meta: playlistMetaSchema
})

export const fetchPlaylistsArgsSchema = z.object({
    pageNumber: z.int().positive().optional(),
    pageSize: z.int().positive().optional(),
    search: z.string().optional(),
    sortBy: z.literal(['addedAt', 'likesCount']).optional(),
    sortDirection: z.literal(['asc', 'desc']).optional(),
    tagsIds: z.array(z.string()).optional(),
    userId: z.string().optional(),
    trackId: z.string().optional(),
})

export const playlistCreateResponseSchema = z.object({
    data: playlistDataSchema
})