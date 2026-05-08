export type Tag = {
    id: string
    name: string
}

export type User = {
    id: string
    name: string
}

export type Images = {
    main: Cover[]
}

export type Cover = {
    type: CoverType
    width: number
    height: number
    fileSize: number
    url: string
}

export type CoverType = 'original' | 'medium' | 'thumbnail'
