export interface GetListParams {
  search: string
  page: number
  limit: number
}
export interface BaseFormProps {
  id?: string | undefined
  loading?: boolean
  initialValues?: any
  isReuse?: boolean
  excludes?: string[]
  onSubmit: (values: any) => Promise<void> | void | any
  onRemove?: (id: string) => Promise<void> | void | any
}
