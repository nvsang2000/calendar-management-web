import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
} from 'antd'
import { BaseFormProps } from '~/interfaces'
import FormLabel from '../FormLabel'
import Svg from '../Svg'
import { useRouter } from 'next/router'
import GroupsSelect from '../GroupSelect'
import { FIELD_OPTION, MEETING_FORMAT } from '~/constants'
import { useEffect, useState } from 'react'
import { generateScriptForm } from '~/helpers'
import getConfig from 'next/config'

const { TextArea } = Input

export default function FormTemplatet({
  id = '',
  loading = false,
  initialValues = {},
  onSubmit = () => {},
}: BaseFormProps) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [showFormLayout, setShowFormLayout] = useState(false)
  const watchCustomField = Form.useWatch('customFields', form)
  const watchFormLink = Form.useWatch('formLink', form)
  const watchGenerateScript = Form.useWatch('generateScript', form)
  const { publicRuntimeConfig } = getConfig()
  const clientUrl = publicRuntimeConfig.NEXT_PUBLIC_ENV_CLIENT_URL

  const handleGoBack = () => {
    return router.back()
  }

  useEffect(() => {
    if (Object.keys(initialValues)?.length > 0) {
      form.resetFields()
    }
  }, [form, initialValues])

  const layoutForm = () => {
    const formLink = `${clientUrl}book-appointment/${initialValues?.slug}`
    const generateHtml = generateScriptForm(formLink)
    form.setFieldValue('formLink', formLink)
    form.setFieldValue('generateScript', generateHtml)
    return (
      <>
        <Modal
          bodyStyle={{ padding: 0 }}
          open={showFormLayout}
          onCancel={() => setShowFormLayout(false)}
          footer={[
            <Button
              className="bg-[var(--green)]"
              key={'cancel'}
              onClick={() => setShowFormLayout(false)}
            >
              Cancel
            </Button>,
            <Button key={'oke'} type={'primary'} onClick={() => form.submit()}>
              Ok
            </Button>,
          ]}
          destroyOnClose
        >
          <div className="mt-[20px] p-[10px]">
            <FormLabel
              label={'Link form'}
              iconCoppy
              valueCoppy={watchFormLink}
            />
            <Form.Item name="formLink">
              <Input placeholder={'Link form'} />
            </Form.Item>

            <FormLabel
              label={'Generate script'}
              iconCoppy
              valueCoppy={watchGenerateScript}
            />
            <Form.Item name="generateScript">
              <TextArea rows={10} placeholder="Enter description" />
            </Form.Item>
          </div>
        </Modal>
      </>
    )
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
            {id ? initialValues?.name : 'Create new Form'}
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
          <Row gutter={40}>
            {layoutForm()}
            <Col xs={24} lg={12}>
              <FormLabel label={'Name Form'} require />
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please enter name!' }]}
              >
                <Input size="large" placeholder={'Enter name '} />
              </Form.Item>

              {id && (
                <>
                  <FormLabel label={'Slug'} require />
                  <Form.Item
                    name="slug"
                    rules={[{ required: true, message: 'Please enter slug!' }]}
                  >
                    <Input size="large" placeholder={'Enter slug '} />
                  </Form.Item>
                </>
              )}

              <FormLabel label={'Meeting format'} require />
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: 'Please enter meeting format!',
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select meeting format"
                  size="large"
                  options={MEETING_FORMAT}
                />
              </Form.Item>
              <FormLabel label={'Group'} require />
              <Form.Item
                name="groupIds"
                rules={[{ required: true, message: 'Please select group!' }]}
              >
                <GroupsSelect size="large" multiple placeholder="Enter group" />
              </Form.Item>

              <FormLabel label={'Description'} />
              <Form.Item name="description">
                <TextArea
                  size="large"
                  rows={4}
                  placeholder="Enter description"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <FormLabel label={'Custom field'} />
              <Form.List name="fields">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={20} key={key} className="mt-[10px]  ">
                        <Col xs={22}>
                          <Col xs={24} lg={24}>
                            <FormLabel label={'Type input'} require />
                            <Form.Item {...restField} name={[name, 'type']}>
                              <Select
                                className="w-full"
                                showSearch
                                placeholder="Search to Select"
                                size="large"
                                options={FIELD_OPTION}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} lg={24}>
                            <FormLabel label={'Title input'} require />
                            <Form.Item {...restField} name={[name, 'label']}>
                              <Input
                                size="large"
                                className={'font-medium'}
                                placeholder={'Enter title'}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} lg={24}>
                            <Form.Item
                              {...restField}
                              name={[name, 'required']}
                              className={'relative top-[-6px]'}
                              valuePropName="checked"
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
            </Col>
          </Row>
          <Row gutter={40} className={'py-[40px] pl-[20px]'}>
            <Space align="center">
              <Button loading={loading} type={'primary'} htmlType={'submit'}>
                {!id ? 'Create' : 'Update'}
              </Button>
              <Button type={'primary'} onClick={() => setShowFormLayout(true)}>
                Share
              </Button>
            </Space>
          </Row>
        </Form>
      </div>
    </>
  )
}
