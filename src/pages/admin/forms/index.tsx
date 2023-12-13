import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FormLabel } from '~/components'

const { TextArea } = Input
const FromPage: React.FC = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onSubmit = (values: any) => {
    console.log('value', values)
    setIsModalOpen(false)
    router.push('/admin/forms/create')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="mb-[20px] rounded-[8px] bg-white p-[20px]">
        <Row gutter={10} className={'mb-[8px]'}>
          <Col flex={1}>
            <div className={'text-[18px] font-medium'}>
              <span className={'mr-[10px] text-[color:var(--green)]'}></span>
              Form
            </div>
          </Col>
          <Col>
            <Button type="primary" onClick={showModal}>
              Create new
            </Button>
            <Modal
              title="Create New Form"
              open={isModalOpen}
              // onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button
                  key={'cancel'}
                  // onClick={() => setShowLayoutUpdate(false)}
                >
                  Cancel
                </Button>,
                <Button
                  // loading={updateting}
                  key={'oke'}
                  type={'primary'}
                  onClick={() => form.submit()}
                >
                  {'Create'}
                </Button>,
              ]}
            >
              <Form
                layout={'vertical'}
                form={form}
                onFinish={onSubmit}
                style={{ marginTop: '30px' }}
              >
                <Row gutter={40}>
                  <Col xs={24} lg={24}>
                    <FormLabel label={'Name Form'} require />
                    <Form.Item
                      name="name"
                      rules={[
                        { required: true, message: 'Please enter name!' },
                      ]}
                    >
                      <Input placeholder={'Enter name '} />
                    </Form.Item>

                    <FormLabel label={'Meeting format'} require />
                    <Form.Item
                      name="meetingFormat"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter meeting format!',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? '').includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={[
                          {
                            value: '1',
                            label: 'Metting online',
                          },
                          {
                            value: '2',
                            label: 'Meeting face to face',
                          },
                        ]}
                      />
                    </Form.Item>
                    <FormLabel label={'Group'} require />
                    <Form.Item
                      name="group"
                      rules={[
                        { required: true, message: 'Please select group!' },
                      ]}
                    >
                      <Input placeholder={'Enter name '} />
                    </Form.Item>

                    <FormLabel label={'Description'} />
                    <Form.Item name="description">
                      <TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default FromPage

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(Forms)',
      requiredRoles: [],
    },
  }
}
