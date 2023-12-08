import queryString from 'query-string'
import useSWRInfinite from 'swr/infinite'
import axiosInstance from '~/utils/axios'

const useGetCategories = (params: any) => {
  const fetcher = async (url: any) =>
    axiosInstance.get(url).then((res) => res?.data)
  const { data, error, size, setSize, mutate, isValidating } = useSWRInfinite(
    () => {
      const qs = queryString.stringify({
        ...params,
        limit: 10,
      })
      return `categories?${qs}`
    },
    fetcher,
  )

  const newData = data?.flat()
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const categories = newData ? [].concat(...newData) : []
  const meta = JSON.parse(newData?.[0]?.headers?.meta || '{}')
  const isRefreshing = !!(isValidating && newData && newData.length === size)

  return {
    categories,
    isLoading: isLoadingMore,
    loadMore: () => meta?.totalPages > size && setSize(size + 1),
    isNext: meta?.totalPages > size,
    mutate,
    isRefreshing,
  }
}

export default useGetCategories
