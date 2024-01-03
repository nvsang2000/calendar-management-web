import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import { useEffect, useMemo } from 'react'
import { FIELD_TYPE } from '~/constants'
import { BaseFormProps } from '~/interfaces'
import getConfig from 'next/config'

export default function BookingForm({
  initialValues = {},
  onSubmit = () => {},
  loading = false,
}: BaseFormProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (Object.keys(initialValues)?.length > 0) {
      form.resetFields()
    }
  }, [form, initialValues])

  const optionStaff = useMemo(() => {
    const option = initialValues?.staff?.map((i: any) => ({
      value: i?.id,
      label: `${i?.firstName} ${i?.lastName}`,
    }))
    return option
  }, [initialValues])

  return (
    <div className="mt-[40px]">
      <Row justify={'center'} align={'middle'} style={{ height: '300px' }}>
        <Col lg={14} xs={22} style={{ maxWidth: 512 }}>
          <Form
            layout="vertical"
            initialValues={initialValues}
            form={form}
            onFinish={onSubmit}
          >
            <Form.Item className="hidden" name={'formId'} />
            <Row gutter={20}>
              <Col xs={24} lg={12}>
                <Form.Item name={['formData', 'firstName']}>
                  <Input size="large" placeholder="Enter first name" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name={['formData', 'lastName']}>
                  <Input size="large" placeholder="Enter last name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={'deadline'}
              rules={[{ required: true, message: 'Please select a date!' }]}
            >
              <DatePicker
                className="w-full"
                placeholder="Select a date"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name={'userId'}
              rules={[{ required: true, message: 'Please select staff!' }]}
            >
              <Select
                className="w-full"
                showSearch
                placeholder="Select staff"
                size="large"
                options={optionStaff}
              />
            </Form.Item>

            <Form.Item
              name={['formData', 'email']}
              rules={[{ required: true, message: 'Please enter email!' }]}
            >
              <Input
                size="large"
                disabled={initialValues?.formData?.isAuth}
                className={'font-medium'}
                placeholder={`Enter email`}
              />
            </Form.Item>

            {initialValues?.fields?.map(
              ({ label, type, required }: any, key: number) => {
                if (type === FIELD_TYPE.PHONE)
                  return (
                    <div key={key}>
                      <Form.Item
                        name={['formData', type]}
                        {...(required && {
                          rules: [
                            {
                              required: true,
                              message: `Please enter ${label}!`,
                            },
                          ],
                        })}
                      >
                        <Input
                          size="large"
                          className={'font-medium'}
                          placeholder={`Enter ${label} (${
                            required ? '*' : ''
                          })`}
                        />
                      </Form.Item>
                    </div>
                  )
              },
            )}
            <Form.Item name={['formData', 'note']}>
              <Input.TextArea size="large" rows={4} placeholder="Enter note" />
            </Form.Item>

            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Booking
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
