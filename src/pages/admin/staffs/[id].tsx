import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import UserForm from '~/components/UserForm'
import { message } from 'antd'
import {
  createStaffApi,
  deleteUserApi,
  getStaffApi,
  updateStaffApi,
} from '~/services/apis'
import { ROLE } from '~/constants'
import { useEffectOnce } from 'react-use'
import { useAuth } from '~/hooks'

export default function StaffPage() {
  const router = useRouter()
  const { abilities } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const id = router.query.id + ''
  const [initialValues, setInitialValues] = useState({})

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'Staff')
    if (!isAccess) router.push('/403')
    return () => {
      isAccess === undefined
    }
  })

  useEffect(() => {
    if (id && id !== 'create') {
      const hideLoading = message.loading('Retrieving data.....')
      getStaffApi(id)
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
    const submitValues = {
      ...values,
      role: ROLE.user,
      policyId: 2,
    }

    const hideMessage = message.loading('')
    setLoading(true)
    try {
      if (id && id !== 'create') {
        await updateStaffApi(id, submitValues)
        message.success('Update successful!')
      } else {
        await createStaffApi(submitValues)
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
      message.success('Remove staff successful!')
      router.back()
    } catch (e: any) {
      console.log(e.message)
    }
  }

  return (
    <UserForm
      id={id !== 'create' ? id : undefined}
      isStaff={true}
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
      pageKey: '(Staff)',
      requiredRoles: [],
    },
  }
}
