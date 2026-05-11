import './App.css'
import { Header } from '@/common/components/Header/Header.tsx'
import s from '@/app/App.module.css'
import { Routing } from '@/common/routing'
import { ToastContainer } from 'react-toastify'
import {useGlobalLoading} from "@/common/hooks/useGlobalLoading.ts";
import {LinearProgress} from "@/common/components/LinearProgress/LinearProgress.tsx";

export function App() {
    const isGlobalLoading = useGlobalLoading()

    return (
        <>
            <Header />
            {isGlobalLoading && <LinearProgress />}
            <div className={s.layout}>
                <Routing />
                <ToastContainer />
            </div>
        </>
    )
}
