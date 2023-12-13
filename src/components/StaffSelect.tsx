import { Select } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import React, { useEffect, useState } from 'react'
import { getStaffListApi } from '~/services/apis'

interface PolicySelectProps {
  className?: string
  value?: any
  onChange?: (value: any) => void
  placeholder?: string
  multiple?: boolean
  size?: SizeType
  isAdmin?: boolean
}

export default function StaffSelect({
  isAdmin = false,
  className,
  value,
  onChange = () => {},
  placeholder,
  multiple = false,
  ...selectProps
}: PolicySelectProps) {
  const [staffs, setStaffs] = useState<any>([])

  useEffect(() => {
    getStaffListApi({})
      .then((res) => {
        setStaffs(res?.data)
      })
      .catch(console.log)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Select
      options={(staffs || [])?.map((i: any) => ({
        label: `${i?.firstName} ${i?.lastName}`,
        value: i.id,
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
