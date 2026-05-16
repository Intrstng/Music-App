import { useGetMeQuery } from '@/features/auth/api/authApi.ts'

export const MainPage = () => {
    const { data } = useGetMeQuery()

    return (
        <div>
            <h1>Main page</h1>
            <h1>{data?.login} page</h1>
        </div>
    )
}
