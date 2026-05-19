import {type SubmitHandler, useForm} from 'react-hook-form'
import {useCreatePlaylistMutation} from '@/features/playlists/api/playlistsApi.ts'
import {type CreatePlaylist, createPlaylistSchema} from "@/features/playlists/model/playlists.schemas.ts";
import FormGroup from "@mui/material/FormGroup"
import {Button, TextField} from "@mui/material";
import s from './CreatePlaylistForm.module.css'
import {zodResolver} from "@hookform/resolvers/zod";

export const CreatePlaylistForm = () => {
    const [createPlaylist] = useCreatePlaylistMutation()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreatePlaylist>({
        resolver: zodResolver(createPlaylistSchema),
        defaultValues: { title: "", description: ""},
    })

    const onSubmit: SubmitHandler<CreatePlaylist> = (data) => {
        createPlaylist(data)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Create new playlist</h2>
            <FormGroup className={s.form}>
                <TextField label="Title" margin="normal" error={!!errors.title} {...register("title")} />
                {errors.title && <span className={s.errorMessage}>{errors.title.message}</span>}

                <TextField label="Description" margin="normal" error={!!errors.description} {...register("description")} />
                {errors.description && <span className={s.errorMessage}>{errors.description.message}</span>}
                <Button type="submit" variant="contained" color="primary">
                    Create playlist
                </Button>
            </FormGroup>
        </form>
    )
}
