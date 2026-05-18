import { useLoginMutation } from '@/features/auth/api/authApi.ts'

export const LoginPage = () => {
    const [login] = useLoginMutation()

    const loginHandler = () => {
        login({
            code: '',
            redirectUri: '',
            rememberMe: false,
        })
    }

    return (
        <div>
            login page
            {/*<button type={'button'} onClick={loginHandler}>Login</button>*/}
        </div>
    )
}
