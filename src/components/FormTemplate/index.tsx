import { Button, Col, Form, Input, Row } from 'antd'
import { BaseFormProps } from '~/interfaces'
import FormLabel from '../FormLabel'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
}

export default function FormTemplatet({
  id = '',
  loading = false,
  initialValues = {},
  onSubmit = () => {},
}: BaseFormProps) {
  const [form] = Form.useForm()

  return (
    <>
      <div className={'rounded-[10px] bg-white p-[40px] '}>
        <div className="pb-[20px]"> form template</div>
        <Form
          layout={'vertical'}
          colon={false}
          form={form}
          initialValues={initialValues}
          onFinishFailed={(e) => console.log(e)}
          onFinish={onSubmit}
        >
          <Row gutter={20}>
            <Col xs={6} lg={6}>
              <FormLabel label={'Name'} require />
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please Enter password!' }]}
              >
                <Input placeholder={'Enter name '} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={24}>
              <Form.List
                name="names"
                rules={[
                  {
                    validator: async (_, names) => {
                      if (!names || names.length < 2) {
                        return Promise.reject(
                          new Error('At least 2 passengers'),
                        )
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0
                          ? formItemLayout
                          : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Passengers' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                "Please input passenger's name or delete this field.",
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder="passenger name"
                            style={{
                              width: '60%',
                            }}
                          />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{
                          width: '60%',
                        }}
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add('The head item', 0)
                        }}
                        style={{
                          width: '60%',
                          marginTop: '20px',
                        }}
                        icon={<PlusOutlined />}
                      >
                        Add field at head
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  )
}
