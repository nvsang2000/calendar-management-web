import { Button, Col, Form, Input, Row, Space } from 'antd'
import Head from 'next/head'
import { FormLabel } from '~/components'
import { useAuth } from '~/hooks'

export default function ProfilePage() {
  const { abilities, currentUser } = useAuth()
  const [form] = Form.useForm()
  console.log('currentUser', currentUser)
  return (
    <>
      <Head>
        <title>Profile Me</title>
      </Head>
      <div className="mb-[40px] rounded-[8px] bg-white p-[40px] sm:mb-[20px]">
        <Form
          layout={'vertical'}
          colon={false}
          form={form}
          initialValues={currentUser}
          onFinishFailed={(e) => console.log(e)}
          //onFinish={onSubmit}
        >
          <Row align={'middle'} gutter={20}>
            <Col span={24}>
              <div className="mb-[20px] text-[20px] font-medium">
                Account details Profile
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <FormLabel label={'First name'} require />
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: 'Please enter first name!' },
                ]}
              >
                <Input size="large" placeholder={'Enter first name'} />
              </Form.Item>

              <FormLabel label={'Last name'} require />
              <Form.Item
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name!' }]}
              >
                <Input size="large" placeholder={'Enter last name'} />
              </Form.Item>

              <FormLabel label={'Phone number'} require />
              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Please enter phone!' }]}
              >
                <Input size="large" disabled placeholder={'Enter phone'} />
              </Form.Item>

              <FormLabel label={'Email'} require />
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please enter email!' }]}
              >
                <Input size="large" disabled placeholder={'Enter email'} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={40} className={'py-[20px] pl-[20px]'}>
            <Space align="center">
              <Button type={'primary'} htmlType={'submit'}>
                {'Update'}
              </Button>
            </Space>
          </Row>
        </Form>
      </div>
    </>
  )
}
