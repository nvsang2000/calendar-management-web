import { Spin, message } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { BookingForm } from '~/components'
import { parseSafe } from '~/helpers'
import { createEventCalendarApi, getFormPublicApi } from '~/services/apis'
import dayjsInstance from '~/utils/dayjs'

export default function FormViewPage() {
  const router = useRouter()
  const id = router.query.id + ''
  const [loading, setLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<any>({})

  useEffectOnce(() => {
    getFormPublicApi(router.query.id).then(async (res) => {
      const data = res?.data
      const fields = parseSafe(data?.fields)

      if (!data) return router.push('/404')
      setInitialValues({ ...data, fields })
    })
  })

  const handleSubmit = async (values: any) => {
    const submitValue = {
      ...values,
      endTime: dayjsInstance(values?.startDay).add(30, 'minutes')
    }

    await createEventCalendarApi(submitValue)
    return message.success('Booking successful!')
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
