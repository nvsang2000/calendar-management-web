import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { createFormApi, getFormApi, updateFormApi } from '~/services/apis'
import { FormTemplate } from '~/components'
import { useEffectOnce } from 'react-use'
import { useAuth } from '~/hooks'
import { parseSafe } from '~/helpers'

export default function UserPage() {
  const router = useRouter()
  const { abilities } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState({})
  const id = router.query.id + ''

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'Form')
    if (!isAccess) router.push('/403')
    return () => {
      isAccess === undefined
    }
  })

  useEffect(() => {
    if (id && id !== 'create') {
      const hideLoading = message.loading('Retrieving data.....')
      getFormApi(id)
        .then((res) => {
          const form = res?.data
          console.log('form', form)
          if (form) {
            setInitialValues({ ...form, fields: parseSafe(form?.fields) })
          }
        })
        .finally(() => {
          hideLoading()
        })
    }
  }, [id])

  const handleSubmit = async (values: any) => {
    const hideMessage = message.loading('')
    setLoading(true)
    const valuesSubmit = {
      ...values,
      type: +values?.type,
      fields: JSON.stringify(values?.fields),
    }

    try {
      if (id && id !== 'create') {
        await updateFormApi(id, valuesSubmit)
        message.success('Update successful!')
      } else {
        await createFormApi(valuesSubmit)
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
    <FormTemplate
      id={id !== 'create' ? id : undefined}
      initialValues={initialValues}
      onSubmit={handleSubmit}
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
