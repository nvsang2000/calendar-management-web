import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import UserForm from '~/components/UserForm'
import { message } from 'antd'
import {
  createUserApi,
  deleteUserApi,
  getUserApi,
  updateUserApi,
} from '~/services/apis'
import { ROLE } from '~/constants'
import { FormTemplate } from '~/components'

export default function UserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const id = router.query.id + ''
  const [initialValues, setInitialValues] = useState({})

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
