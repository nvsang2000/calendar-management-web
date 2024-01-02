import { Spin, message } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { BookingForm } from '~/components'
import { parseSafe } from '~/helpers'
import { createEventCalendarApi, getFormPublicApi } from '~/services/apis'
import dayjsInstance from '~/utils/dayjs'
import Cookies from 'js-cookie'
import { useSession } from 'next-auth/react'

export default function FormViewPage() {
  const router = useRouter()
  const id = router.query.id + ''
  const [loading, setLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<any>({})
  const { data: session } = useSession()
  const formData: any = Cookies.get('formData')
  const user: any = Cookies.get('user')
  const paserUser = parseSafe(user)
  const parserData = parseSafe(formData)

  useEffectOnce(() => {
    getFormPublicApi(router.query.id).then(async (res) => {
      const data = res?.data
      const fields = parseSafe(data?.fields)
      const newFormData = {
        ...parserData,
        isAuth: paserUser ? true : undefined,
        ownerEmail: paserUser?.email,
        deadline: parserData?.deadline
          ? dayjsInstance(parserData?.deadline)
          : undefined,
      }

      if (!data) return router.push('/404')
      setInitialValues({ ...data, formData: newFormData, fields })
    })
  })

  useEffect(() => {
    if (session?.user) console.log('session?.user', session?.user)
    Cookies.set('user', JSON.stringify(session?.user), { expires: 30 })
  }, [session])

  const handleSubmit = async (values: any) => {
    const submitValue = {
      ...values,
      accessToken: paserUser?.access_token,
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
