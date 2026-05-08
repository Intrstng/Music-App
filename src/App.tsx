import './App.css'
import { Header } from '@/common/components/Header/Header.tsx'
import s from '@/app/App.module.css'
import { Routing } from '@/common/routing'
import { ToastContainer } from 'react-toastify'

export function App() {
    return (
        <>
            <Header />
            <div className={s.layout}>
                <Routing />
                <ToastContainer />
            </div>
        </>
    )
}
