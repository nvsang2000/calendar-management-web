import { Select } from 'antd'
import { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { getCategoryListApi } from '~/services/apis'

interface BrandSelectProps {
  size?: 'small' | 'middle' | 'large' | undefined
  value?: any
  onChange?: any
  filterOptions?: () => boolean
  disabled?: any
  placeholder?: string
  multiple?: boolean
  className?: string
  maxTagCount?: number | 'responsive'
  maxTagTextLength?: number
  excludes?: any[]
  defaultValue?: any
}
export default function ProducerSelect({
  size = 'large',
  value,
  onChange,
  filterOptions = () => true,
  disabled = false,
  placeholder = '',
  multiple = false,
  className,
  maxTagCount = 'responsive',
  maxTagTextLength,
  excludes = [],
  defaultValue,
}: BrandSelectProps) {
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])

  useEffectOnce(() => {
    if (!data.length) {
      getCategoryListApi()
        .then((data) => setData(data?.data))
        .catch(console.log)
    }
  })
  return (
    <>
      <Select
        showArrow
        defaultValue={defaultValue}
        maxTagTextLength={maxTagTextLength}
        maxTagCount={maxTagCount}
        className={className}
        disabled={disabled}
        size={size}
        options={data
          ?.map((value: any) => ({
            label: value?.name,
            value: value?.name,
          }))
          ?.filter((option: any) => !(excludes || []).includes(option.value))
          ?.filter(filterOptions)}
        searchValue={search}
        onSearch={setSearch}
        value={value}
        onChange={(value) => onChange(value || null)}
        showSearch
        allowClear
        filterOption={(input, option: any) =>
          option?.label?.toLowerCase?.()?.includes(input?.toLowerCase?.())
        }
        popupClassName={'!rounded-[8px]'}
        placeholder={placeholder}
        {...(multiple && { mode: 'multiple' })}
      />
    </>
  )
}
