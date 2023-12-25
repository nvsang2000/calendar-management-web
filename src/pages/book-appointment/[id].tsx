import { Spin, message } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { BookingForm } from '~/components'
import { parseSafe } from '~/helpers'
import { createCalendarPublicApi, getFormPublicApi } from '~/services/apis'
import dayjsInstance from '~/utils/dayjs'

export default function FormViewPage() {
  const router = useRouter()
  const id = router.query.id + ''
  const [loading, setLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<any>({})

  const fetchForm = async () => {
    setLoading(true)
    await getFormPublicApi(router.query.id)
      .then((res) => {
        const data = res?.data
        const fields = parseSafe(data?.fields)
        if (!data) return router.push('/404')
        setInitialValues({ ...data, fields })
      })
      .finally(() => setLoading(false))
  }

  useEffectOnce(() => {
    fetchForm()
  })

  const handleSubmit = async (values: any) => {
    setLoading(true)
    const submitValue = {
      ...values,
      formId: initialValues?.id,
      deadline: values?.deadline ? dayjsInstance(values?.deadline) : undefined,
      owner: JSON.stringify(values?.owner),
    }
    await createCalendarPublicApi(submitValue).then((res) => {
      if (res) {
        setLoading(false)
        message.success('Booking successful!')
      }
    })
  }

  if (loading)
    return (
      <div className="flex justify-center">
        <Spin size="large" />
      </div>
    )
  else
    return (
      <BookingForm
        id={id}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={loading}
      />
    )
}
