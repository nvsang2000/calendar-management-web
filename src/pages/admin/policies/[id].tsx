import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { createPolicyApi, getPolicyApi, updatePolicyApi } from '~/services/apis'
import PolicyForm from '~/components/PolicyForm'
import { isNil } from 'lodash'
import { useEffectOnce } from 'react-use'
import { useAuth } from '~/hooks'

interface Permission {
  id?: number
  action: string
  subject: string
}

export default function PolicyPage() {
  const router = useRouter()
  const { abilities } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState({})
  const id = router.query.id + ''

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'Policy')
    if (!isAccess) router.push('/403')
  })

  useEffect(() => {
    if (id && id !== 'create') {
      const hideLoading = message.loading('Retrieving data.....')
      getPolicyApi(+id)
        .then((res) => {
          const policy = res?.data
          const permissions: any = {}

          res?.data?.permissions?.map((permission: Permission) => {
            permissions[`${permission.action}_${permission.subject}`] =
              permission
          })

          if (policy) {
            setInitialValues({
              ...policy,
              permissions,
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
      permissions: (Object.values(values.permissions) || []).filter(
        (i) => !isNil(i),
      ),
    }
    const hideMessage = message.loading('')
    setLoading(true)
    try {
      if (id && id !== 'create') {
        await updatePolicyApi(+id, submitValues)
        message.success('Update successful!')
      } else {
        await createPolicyApi(submitValues)
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

  return (
    <div className={'container rounded-[10px] bg-white p-10'}>
      <PolicyForm
        id={id !== 'create' ? id : undefined}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(Policies)',
      requiredRoles: [],
    },
  }
}
