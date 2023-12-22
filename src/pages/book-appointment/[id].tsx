import { Button, Calendar, Col, Form, Input, Row, Select, Spin } from 'antd'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { FormLabel } from '~/components'
import { getFormPublicApi } from '~/services/apis'

export default function FormViewPage() {
  const router = useRouter()
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const fetchForm = async () => {
    setLoading(true)
    getFormPublicApi(router.query.id)
      .then((res) => {
        const data = res?.data
        if (!data) return router.push('/404')
        setForm(data)
      })
      .finally(() => setLoading(false))
  }

  useEffectOnce(() => {
    fetchForm()
  })

  const onPanelChange = (value: any, mode: any) => {
    console.log(value.format('YYYY-MM-DD'), mode)
  }

  const optionStaff = useMemo(() => {
    const option = form?.staff?.map((i: any) => ({
      value: i?.email,
      label: `${i?.firstName} ${i?.lastName}`,
    }))
    return option
  }, [form])

  console.log('optionStaff', optionStaff)

  if (loading)
    return (
      <div className="flex justify-center">
        <Spin size="large" />
      </div>
    )

  return (
    <div className="  p-[40px]">
      <Row justify={'center'} align={'middle'} style={{ height: '300px' }}>
        <Col
          lg={14}
          xs={22}
          style={{ maxWidth: 512 }}
          //className="border-[1px] border-black p-[20px]"
        >
          <Calendar fullscreen={false} onPanelChange={onPanelChange} />
          <Form layout="vertical" onFinish={() => console.log('heello')}>
            <FormLabel label={'Select staff'} require />
            <Form.Item
              name="staff"
              rules={[{ required: true, message: 'Please enter staff!' }]}
            >
              <Select
                size="large"
                showSearch
                placeholder="Select meeting format"
                options={optionStaff}
              />
            </Form.Item>

            <FormLabel label={'Email'} require />
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter email!' }]}
            >
              <Input size="large" type="email" placeholder="Enter email" />
            </Form.Item>

            <FormLabel label={'Phone number'} require />
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Please enter phone number!' },
              ]}
            >
              <Input size="large" type="tel" placeholder="Enter phone number" />
            </Form.Item>

            <FormLabel label={'Note'} require />
            <Form.Item name="note">
              <Input.TextArea size="large" rows={4} placeholder="Enter note" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Booking
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
