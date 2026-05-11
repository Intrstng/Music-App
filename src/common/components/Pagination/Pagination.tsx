import s from './Pagination.module.css'
import {PaginationControls} from "@/common/components/Pagination/PaginationControls/PaginationControls.tsx";
import {PageSizeSelector} from "@/common/components/Pagination/PageSizeSelector/PageSizeSelector.tsx";

type Props = {
    currentPage: number
    setCurrentPage: (nextPage: number) => void
    changePageSize: (pageSize: number) => void
    pageSize: number
    pagesCount: number
}

export const Pagination = ({
                               currentPage,
                               setCurrentPage,
                               changePageSize,
                               pagesCount,
                               pageSize
}: Props) => {
    if (pagesCount <= 1) return null

    return (
        <div className={s.pagination}>
            <PaginationControls
                currentPage={currentPage}
                pagesCount={pagesCount}
                setCurrentPage={setCurrentPage} />
            <PageSizeSelector pageSize={pageSize} changePageSize={changePageSize}/>
        </div>
    )
}
