import {useCallback, useEffect, useRef} from "react";


type InfiniteScrollType = {
    hasNextPage: boolean
    isFetching: boolean
    fetchNextPage: () => void
    rootMargin?: string
    threshold?: number
}

export function useInfiniteScroll({
                                      hasNextPage,
                                      isFetching,
                                      fetchNextPage,
                                      rootMargin = '100px',
                                      threshold = 0.1,
                                  }: InfiniteScrollType) {

    const observerRef = useRef<HTMLDivElement>(null)

    const loadMoreHandler = useCallback(() => {
        if (hasNextPage && !isFetching) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetching, fetchNextPage])

    useEffect(() => {
        // IntersectionObserver отслеживает элементы и сообщает, насколько они видны во viewport
        // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        const observer = new IntersectionObserver(
            entries => {
                // entries - наблюдаемый элемент (всегда массив)
                if (entries.length > 0 && entries[0].isIntersecting) {
                    loadMoreHandler()
                }
            },
            {
                root: null, // Отслеживание относительно окна браузера (viewport). null = весь экран
                rootMargin: rootMargin, // Начинать загрузку за 100px до появления элемента
                threshold: threshold, // Срабатывать когда 10% элемента становится видимым
            }
        )

        const currentObserverRef = observerRef.current
        if (currentObserverRef) {
            // начинает наблюдение за элементом
            observer.observe(currentObserverRef)
        }

        // Функция очистки - прекращает наблюдение при размонтировании компонента
        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef)
            }
        }
    }, [loadMoreHandler, rootMargin, threshold])

    return { observerRef }
}