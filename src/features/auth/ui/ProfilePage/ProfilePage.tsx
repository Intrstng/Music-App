import {useGetMeQuery} from '@/features/auth/api/authApi.ts'
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlistsApi.ts";
import {PlaylistsList} from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx";
import {Pagination} from "@/common/components/Pagination/Pagination.tsx";
import {useEffect, useState} from "react";
import s from './ProfilePage.module.css'
import {CreatePlaylistForm} from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx";
import {Navigate} from "react-router";
import {Path} from "@/common/constants";


export const ProfilePage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState(4)

    const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery()

    const {
        data: playlists,
        isLoading,
    } = useFetchPlaylistsQuery(
        {
            userId: meResponse?.userId,
            pageNumber: currentPage,
            pageSize: pageSize,
        },
        {
            skip: !meResponse?.userId,
        },
    )

    const changePaginationPageHandler = (nextPage: number) => {
        setCurrentPage(nextPage)
    }
    const changePageSizeHandler = (size: number) => {
        setCurrentPage(1)
        setPageSize(size)
    }

    if (isLoading || isMeLoading) return <h1>Skeleton loader...</h1>
    if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />

    return (
        <div>
            <h1>Profile page</h1>
            <h2>{meResponse?.login}, welcome home!</h2>
            <CreatePlaylistForm />
            <PlaylistsList className={s.profilePlaylists} playlists={playlists?.data || []} isLoading={isLoading} />
            <Pagination
                currentPage={currentPage}
                setCurrentPage={changePaginationPageHandler}
                pagesCount={playlists?.meta.pagesCount || 1}
                pageSize={pageSize}
                changePageSize={changePageSizeHandler}
            />
        </div>
    )
}
