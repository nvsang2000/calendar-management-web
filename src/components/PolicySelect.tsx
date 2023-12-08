import { Select } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import React, { useEffect, useState } from 'react'
import { getPolicyListApi } from '~/services/apis'

interface Policy {
  id: number
  name: string
}

interface PolicySelectProps {
  className?: string
  value?: any
  onChange?: (value: any) => void
  placeholder?: string
  multiple?: boolean
  size?: SizeType
  isAdmin?: boolean
}

export default function PolicySelect({
  isAdmin = false,
  className,
  value,
  onChange = () => {},
  placeholder,
  multiple = false,
  ...selectProps
}: PolicySelectProps) {
  const [policies, setPolicies] = useState<Policy[]>([])

  useEffect(() => {
    getPolicyListApi({})
      .then((res) => {
        const admin = { id: -1, name: 'Admin' }
        setPolicies(isAdmin ? [...res?.data, admin] : res?.data)
      })
      .catch(console.log)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Select
      options={(policies || [])?.map((policy) => ({
        label: policy.name,
        value: policy.id,
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
