import { useGetMeQuery } from '@/features/auth/api/authApi.ts'

export const ProfilePage = () => {
    const { data } = useGetMeQuery()

    return (
        <div>
            <h1>Profile page</h1>
            <h2>{data?.login}, welcome home!</h2>
        </div>
    )
}
