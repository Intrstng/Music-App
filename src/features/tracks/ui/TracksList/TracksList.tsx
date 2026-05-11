import s from "@/features/tracks/ui/TracksList/TracksList.module.css";
import type {TrackData} from "@/features/tracks/api/tracksApi.types.ts";

type TracksListProps = {
    tracks: TrackData[]
}

export const TracksList = ({tracks}: TracksListProps) => {
    return (
        <div className={s.list}>
            {tracks.map(track => {
                const { title, user, attachments } = track.attributes

                return (
                    <div key={track.id} className={s.item}>
                        <div>
                            <p>Title: {title}</p>
                            <p>Name: {user.name}</p>
                        </div>
                        {attachments.length ? <audio controls src={attachments[0].url} /> : 'no file'}
                    </div>
                )
            })}
        </div>
    );
};
