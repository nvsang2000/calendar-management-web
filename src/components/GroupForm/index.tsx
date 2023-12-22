import { Col, Form, Input, Row } from 'antd'
import { useEffect } from 'react'
import FormLabel from '../FormLabel'
import { useDebounce } from 'react-use'
import slugify from 'slugify'
import StaffSelect from '../StaffSelect'

interface FormProps {
  initialValues: any
  id: string | undefined
  onSubmit: (value: any) => void
  form: any
}

const { TextArea } = Input
export default function GroupForm({
  initialValues = {},
  id = '',
  onSubmit = () => {},
  form,
}: FormProps) {
  const watchID = Form.useWatch('id', form)
  const watchName = Form.useWatch('name', form)

  useEffect(() => {
    if (Object.keys(initialValues)?.length > 0) {
      form.resetFields()
    }
  }, [form, initialValues])

  useDebounce(
    () => {
      !id &&
        form.setFieldValue(
          'slug',
          slugify(form.getFieldValue('name')?.toLowerCase() || ''),
        )
    },
    300,
    [watchName],
  )

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: 20,
        paddingBottom: 20,
        borderRadius: 20,
      }}
    >
      <Form
        layout="vertical"
        initialValues={initialValues}
        form={form}
        onFinish={onSubmit}
        style={{ marginTop: '30px' }}
      >
        <Row gutter={40}>
          <Col xs={24} md={24} xl={24}>
            {id && (
              <div>
                <FormLabel label={'ID'} iconCoppy valueCoppy={watchID} />
                <Form.Item name="id">
                  <Input size="large" disabled />
                </Form.Item>
              </div>
            )}

            <FormLabel label={'Name'} require />
            <Form.Item
              name={'name'}
              rules={[{ required: true, message: 'Please enter name!' }]}
            >
              <Input size="large" placeholder="Enter name!" />
            </Form.Item>

            <FormLabel label={'Staff list'} require />
            <Form.Item
              name={'userIds'}
              rules={[{ required: true, message: 'Please enter name!' }]}
            >
              <StaffSelect size="large" multiple placeholder="Enter name!" />
            </Form.Item>

            <FormLabel label={'Description'} />
            <Form.Item name="description">
              <TextArea
                size="large"
                rows={4}
                placeholder="Enter description!"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
