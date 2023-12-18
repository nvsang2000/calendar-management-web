import { Select } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import React, { useEffect, useState } from 'react'
import { getListGroupApi, getStaffListApi } from '~/services/apis'

interface PolicySelectProps {
  className?: string
  value?: any
  onChange?: (value: any) => void
  placeholder?: string
  multiple?: boolean
  size?: SizeType
  isAdmin?: boolean
}

export default function GroupsSelect({
  isAdmin = false,
  className,
  value,
  onChange = () => {},
  placeholder,
  multiple = false,
  ...selectProps
}: PolicySelectProps) {
  const [groups, setGroups] = useState<any>([])

  useEffect(() => {
    getListGroupApi({})
      .then((res) => {
        setGroups(res?.data)
      })
      .catch(console.log)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Select
      options={(groups || [])?.map((i: any) => ({
        label: `${i?.name}`,
        value: i?.id,
      }))}
      value={value}
      onChange={(value) => onChange(value || null)}
      allowClear
      showSearch
      placeholder={placeholder}
      popupClassName={'!rounded-[8px]'}
      {...(multiple && { mode: 'multiple' })}
      {...(className && { className })}
      {...selectProps}
    />
  )
}
