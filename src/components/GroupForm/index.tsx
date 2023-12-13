import { Col, Form, Input, Row } from 'antd'
import { useEffect } from 'react'
import FormLabel from '../FormLabel'
import { useDebounce } from 'react-use'
import slugify from 'slugify'
interface FormProps {
  initialValues: any
  id: string | undefined
  onSubmit: (value: any) => void
  form: any
}
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
                  <Input disabled />
                </Form.Item>
              </div>
            )}

            <FormLabel label={'Name'} require />
            <Form.Item
              name={'name'}
              rules={[{ required: true, message: 'Please enter name!' }]}
            >
              <Input placeholder="Enter name!" />
            </Form.Item>

            <FormLabel label={'Slug'} require />
            <Form.Item
              name={'slug'}
              rules={[{ required: true, message: 'Please enter slug!' }]}
            >
              <Input placeholder="Enter slug!" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
