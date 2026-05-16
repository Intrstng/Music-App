import { useFetchTracksInfiniteQuery } from '@/features/tracks/api/tracksApi.ts'
import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll.ts'
import { TracksList } from '@/features/tracks/ui'
import { LoadingTrigger } from '@/features/tracks/ui/LoadingTrigger/LoadingTrigger.tsx'

export const TracksPage = () => {
    const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useFetchTracksInfiniteQuery()

    // Создает ссылку на DOM элемент, который будет "триггером" для автозагрузки
    const { observerRef } = useInfiniteScroll({
        hasNextPage,
        isFetching,
        fetchNextPage,
    })

    // const pages = data?.pages.map(page => page.data).flat() || []
    const pages = data?.pages.flatMap((page) => page.data) || []

    return (
        <div>
            <h1>Tracks page</h1>
            <TracksList tracks={pages} />

            {hasNextPage && (
                <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage} />
            )}

            {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
        </div>
    )
}
