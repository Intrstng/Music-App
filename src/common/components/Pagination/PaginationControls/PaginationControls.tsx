import s from '@/common/components/Pagination/PaginationControls/PaginationControls.module.css'
import { getPaginationPages } from '@/common/utils/getPaginationPages.ts'

type PaginationControlsProps = {
    currentPage: number
    pagesCount: number
    setCurrentPage: (nextPage: number) => void
}

export const PaginationControls = ({
    currentPage,
    pagesCount,
    setCurrentPage,
}: PaginationControlsProps) => {
    const pages = getPaginationPages(currentPage, pagesCount)

    return (
        <>
            {pages.map((page, idx) =>
                page === '...' ? (
                    <span className={s.ellipsis} key={`ellipsis-${idx}`}>
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        className={
                            page === currentPage
                                ? `${s.pageButton} ${s.pageButtonActive}`
                                : s.pageButton
                        }
                        onClick={() => page !== currentPage && setCurrentPage(Number(page))}
                        disabled={page === currentPage}
                        type="button">
                        {page}
                    </button>
                )
            )}
        </>
    )
}
