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
import { useEffectOnce } from 'react-use'
import { useAuth } from '~/hooks'

export default function UserPage() {
  const router = useRouter()
  const { abilities } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const id = router.query.id + ''
  const [initialValues, setInitialValues] = useState({})

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'User')
    if (!isAccess) router.push('/403')
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

  const handleSubmit = async (values: any) => {
    const role = values?.policyId ? ROLE.user : values?.role
    const submitValues = {
      ...values,
      role,
      policyId: role !== ROLE.admin ? values?.policyId : undefined,
    }

    const hideMessage = message.loading('')
    setLoading(true)
    try {
      if (id && id !== 'create') {
        await updateUserApi(id, submitValues)
        message.success('Update successful!')
      } else {
        await createUserApi(submitValues)
        message.success('Create new successful!')
      }

      return router.back()
    } catch (e: any) {
      console.log(e.message)
    } finally {
      hideMessage()
      setLoading(false)
    }
  }

  const handleRemoveUser = async (id: string) => {
    try {
      await deleteUserApi(id)
      message.success('Remove user successful!')
      router.back()
    } catch (e: any) {
      console.log(e.message)
    }
  }

  return (
    <UserForm
      id={id !== 'create' ? id : undefined}
      isStaff={false}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onRemove={handleRemoveUser}
      loading={loading}
    />
  )
}

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(Users)',
      requiredRoles: [],
    },
  }
}
