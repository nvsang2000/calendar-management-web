import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { getUserApi } from '~/services/apis'
import { FormTemplate } from '~/components'
import { useEffectOnce } from 'react-use'
import { useAuth } from '~/hooks'

export default function UserPage() {
  const router = useRouter()
  const { abilities } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState({})
  const id = router.query.id + ''

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'Policy')
    if (!isAccess) router.push('/403')
    return () => {
      isAccess === undefined
    }
  })

  useEffect(() => {
    if (id && id !== 'create') {
      const hideLoading = message.loading('Retrieving data.....')
      getUserApi(id)
        .then((res) => {
          const user = res?.data
          if (user) {
            setInitialValues({
              ...user,
            })
          }
        })
        .finally(() => {
          hideLoading()
        })
    }
  }, [id])

  return (
    <FormTemplate
      id={id !== 'create' ? id : undefined}
      initialValues={initialValues}
      onSubmit={() => console.log('hello')}
      //   onRemove={handleRemoveUser}
      loading={loading}
    />
  )
}

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(Forms)',
      requiredRoles: [],
    },
  }
}
