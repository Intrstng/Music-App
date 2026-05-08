import s from './Pagination.module.css'
import { getPaginationPages } from '@/common/utils/getPaginationPages.ts'

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

    const pages = getPaginationPages(currentPage, pagesCount)

    return (
        <div className={s.pagination}>
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

            <label>
                Show
                <select value={pageSize} onChange={e => changePageSize(Number(e.target.value))}>
                    {[2, 4, 8, 16, 32].map(size => (
                        <option value={size} key={size}>
                            {size}
                        </option>
                    ))}
                </select>
                per page
            </label>
        </div>
    )
}
