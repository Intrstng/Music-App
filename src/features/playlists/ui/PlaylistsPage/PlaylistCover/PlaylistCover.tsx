import s from '@/features/playlists/ui/PlaylistsPage/PlaylistCover/PlaylistCover.module.css'
import type { ChangeEvent } from 'react'
import {
    useDeletePlaylistCoverMutation,
    useUpdatePlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi.ts'
import defaultCover from '@/assets/images/default-playlist-cover.png'
import type { Images } from '@/common/types/types.ts'
import { toast } from 'react-toastify'

type PlaylistCoverProps = {
    playlistId: string
    images: Images
}

export const PlaylistCover = ({ playlistId, images }: PlaylistCoverProps) => {
    const [uploadCover] = useUpdatePlaylistCoverMutation()
    const [deleteCover] = useDeletePlaylistCoverMutation()

    const originalCover = images.main?.find((img) => img.type === 'original')
    const src = originalCover ? originalCover.url : defaultCover

    const notifyAlert = (message: string) => toast(message, { type: 'error', theme: 'colored' })

    const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const maxSize = 1024 * 1024 // 1 MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

        const file = event.target.files?.length && event.target.files[0]
        if (!file) return

        if (!allowedTypes.includes(file.type)) {
            // alert('Only JPEG, PNG or GIF images are allowed')
            notifyAlert('Only JPEG, PNG or GIF images are allowed')
            return
        }

        if (file.size > maxSize) {
            // alert(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
            notifyAlert(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
            return
        }

        uploadCover({ playlistId: playlistId, file })
    }

    const deleteCoverHandler = () => {
        deleteCover({ playlistId: playlistId })
    }

    return (
        <div>
            <img src={src} alt={'cover'} width={'100px'} className={s.cover} />
            <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={uploadCoverHandler}
            />
            {originalCover && <button onClick={() => deleteCoverHandler()}>delete cover</button>}
        </div>
    )
}
