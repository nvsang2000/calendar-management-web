import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import { useEffect, useMemo } from 'react'
import { FIELD_TYPE } from '~/constants'
import { BaseFormProps } from '~/interfaces'

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
    <div className="mt-[20px]">
      <Row justify={'center'} align={'middle'} style={{ height: '300px' }}>
        <Col lg={14} xs={22} style={{ maxWidth: 512 }}>
          <div className="my-[10px] text-center text-[16px] font-medium capitalize text-[var(--green)] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[26px]">
            Contact us to schedule an appointment
          </div>
          <Form
            layout="vertical"
            initialValues={initialValues}
            form={form}
            onFinish={onSubmit}
          >
            <Row gutter={20}>
              <Col xs={24} lg={12}>
                <Form.Item name={['owner', 'firstName']}>
                  <Input size="large" placeholder="Enter first name" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name={['owner', 'lastName']}>
                  <Input size="large" placeholder="Enter last name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="deadline"
              rules={[{ required: true, message: 'Please select a date!' }]}
            >
              <DatePicker
                className="w-full"
                placeholder="Select a date"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="userId"
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

            {initialValues?.fields?.map(
              ({ label, type, required }: any, key: number) => {
                if (type === FIELD_TYPE.PHONE)
                  return (
                    <div key={key}>
                      <Form.Item
                        name={['owner', type]}
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
                if (type === FIELD_TYPE.EMAIL)
                  return (
                    <div key={key}>
                      <Form.Item
                        name={['owner', type]}
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
                          placeholder={`Enter ${label}`}
                        />
                      </Form.Item>
                    </div>
                  )
              },
            )}
            <Form.Item name="note">
              <Input.TextArea size="large" rows={4} placeholder="Enter note" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Booking
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
