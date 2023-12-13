import { Button, Checkbox, Col, Form, Input, Row, Select } from 'antd'
import { BaseFormProps } from '~/interfaces'
import FormLabel from '../FormLabel'
import Svg from '../Svg'
import { DatePicker } from '../DatePicker'
import { useRouter } from 'next/router'

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
  const router = useRouter()
  const [form] = Form.useForm()

  const handleGoBack = () => {
    return router.back()
  }

  return (
    <>
      <div className={'rounded-[10px] bg-white p-[40px] '}>
        <div className={'mb-[20px] flex items-center '}>
          <Svg
            onClick={handleGoBack}
            className={'!top-[-4px] cursor-pointer'}
            name={'ic_arrow_back'}
            width={24}
            height={24}
          />
          <div
            onClick={handleGoBack}
            className={
              'ml-[20px] cursor-pointer text-[18px] font-[500] sm:text-[24px] md:text-[26px] xl:text-[26px]'
            }
          >
            {' Create new Form'}
          </div>
        </div>
        <Form
          layout={'vertical'}
          colon={false}
          form={form}
          initialValues={initialValues}
          onFinishFailed={(e) => console.log(e)}
          onFinish={onSubmit}
        >
          <Row gutter={20}>
            <Col xs={24} lg={12}>
              <FormLabel label={'Meeting time'} require />
              <Form.Item
                name="meetingTime"
                rules={[{ required: true, message: 'Please Enter password!' }]}
              >
                <DatePicker format={'DD/MM/YYYY'} className="!w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} lg={12}>
              <FormLabel label={'Custom field'} />

              <div className=" p-[10px]">
                <Form.List name="customFields">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={20} key={key} className="mt-[10px]  ">
                          <Col xs={22}>
                            <Col xs={24} lg={24}>
                              <FormLabel label={'Type input'} require />
                              <Form.Item {...restField} name={[name, `type`]}>
                                <Select
                                  className="w-full"
                                  showSearch
                                  placeholder="Search to Select"
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    (option?.label ?? '').includes(input)
                                  }
                                  filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '')
                                      .toLowerCase()
                                      .localeCompare(
                                        (optionB?.label ?? '').toLowerCase(),
                                      )
                                  }
                                  options={[
                                    {
                                      value: '1',
                                      label: 'Phone number',
                                    },
                                    {
                                      value: '2',
                                      label: 'Email',
                                    },
                                    {
                                      value: '3',
                                      label: 'Text box',
                                    },
                                    {
                                      value: '4',
                                      label: 'Check box',
                                    },
                                    {
                                      value: '5',
                                      label: 'Text area',
                                    },
                                  ]}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={24}>
                              <FormLabel label={'Title input'} require />
                              <Form.Item {...restField} name={[name, `label`]}>
                                <Input
                                  className={'font-medium'}
                                  placeholder={'Enter title'}
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} lg={24}>
                              <Form.Item
                                {...restField}
                                name={[name, `value`]}
                                className={'relative top-[-6px]'}
                              >
                                <Checkbox>This question is required</Checkbox>
                              </Form.Item>
                            </Col>
                          </Col>
                          <Col xs={2} className={'mt-[10px]'}>
                            <Svg
                              className={'cursor-pointer opacity-80'}
                              name={'ic_remove'}
                              width={24}
                              height={24}
                              onClick={() => remove(name)}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block>
                          Add new field
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
