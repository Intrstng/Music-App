import { Navigate, NavLink, useLocation, useNavigate } from 'react-router'
import s from './Header.module.css'
import { Path } from '@/common/constants'
import {useGetMeQuery, useLogoutMutation} from '@/features/auth/api/authApi.ts'
import { Login } from '@/features/auth/ui/Login/Login.tsx'

const navItems = [
    { to: Path.Main, label: 'Main' },
    { to: Path.Playlists, label: 'Playlists' },
    { to: Path.Tracks, label: 'Tracks' },
]

export const Header = () => {
    // const navigate = useNavigate()
    // const location = useLocation()
    const { data } = useGetMeQuery()
    const [logout] = useLogoutMutation()

    // const isLoginPage = location.pathname === Path.Login
    //
    // const loginHandler = () => {
    //     navigate('/login')
    // }

    const logoutHandler = () => {
        logout()
        //return <Navigate to={'login'}/>
    }
    //
    // const LoginButton = !isLoginPage && (
    //     isLoggedIn
    //         ? <button type={'button'} onClick={signOutHandler}>SignOut</button>
    //         : <button type={'button'} onClick={loginHandler}>Login</button>
    // )

    return (
        <header className={s.container}>
            <nav>
                <ul className={s.list}>
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `link ${isActive ? s.activeLink : ''}`
                                }>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            {/*{LoginButton}*/}
            {data ? <div className={s.loginContainer}>
                    <NavLink
                        to={Path.Profile}
                        // className={({ isActive, isPending }) =>
                        //     isPending ? "pending" : isActive ? "active" : ""
                        // }
                    >
                        {data.login}
                    </NavLink>
                        <button onClick={logoutHandler}>logout</button>
                    </div>
                  : <Login />}
        </header>
    )
}
