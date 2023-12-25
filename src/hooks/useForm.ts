import useSWRInfinite from 'swr/infinite'
import axiosInstance from '~/utils/axios'

const useGetForm = (id: any) => {
  const fetcher = async (url: any) =>
    axiosInstance.get(url).then((res) => res?.data)
  const { data, size, mutate, isValidating } = useSWRInfinite(() => {
    return `/api/form/${id}`
  }, fetcher)

  const newData = data?.flat()
  const meta = JSON.parse(newData?.[0]?.headers?.meta || '{}')
  const isRefreshing = !!(isValidating && newData && newData.length === size)

  return {
    forms: newData,
    isNext: meta?.totalPages > size,
    mutate,
    isRefreshing,
  }
}

export default useGetForm
