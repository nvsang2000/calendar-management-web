import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Pagination,
  Row,
  Select,
} from 'antd'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useEffectOnce, useSetState } from 'react-use'
import { FormLabel } from '~/components'
import { parseSafe } from '~/helpers'
import { useAuth } from '~/hooks'
import { GetListParams } from '~/interfaces'
import { getAllFormApi } from '~/services/apis'
import dayjsInstance from '~/utils/dayjs'

const { TextArea } = Input

const DEFAULT_PARAMS: GetListParams = {
  search: '',
  page: 1,
  limit: 10,
}
const FromPage: React.FC = () => {
  const router = useRouter()
  const { abilities } = useAuth()
  const [form] = Form.useForm()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState<any>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [params, setParams] = useSetState<any>(
    Object.keys(router.query)?.length > 0
      ? router.query
      : { ...DEFAULT_PARAMS },
  )

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'Form')
    if (!isAccess) router.push('/403')
    return () => {
      isAccess === undefined
    }
  })

  const fetchForms = async () => {
    setLoading(true)
    return getAllFormApi({ ...params })
      .then((res) => {
        const { data, headers } = res || {}
        setForms(data || [])
        setMeta(parseSafe(headers?.meta + ''))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const replacePath = () => {
    router.replace(
      `${router.pathname}?${queryString.stringify({ ...params })}`,
      undefined,
      {
        shallow: true,
      },
    )
  }

  useEffect(() => {
    replacePath()
    fetchForms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onSubmit = (values: any) => {
    setIsModalOpen(false)
    router.push('/admin/forms/create')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const renderItem = (item: any) => {
    return (
      <List.Item key={item?.id}>
        <List.Item.Meta
          className={
            '!border-[1px] !border-[color:var(--@very-light-gray)] p-[10px]'
          }
          description={
            <div className={'cursor-pointer text-[color:var(--text-color)]'}>
              <div
                // onClick={() => {
                //   setShowLayoutUpdate(true)
                //   setUpdateId(item?.id)
                //   fetchDetail(item?.id)
                // }}
                className="text-[13px] capitalize sm:text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] "
              >
                <div>{item?.name}</div>
                <div
                  className={
                    'lg-[13px]  text-[12px] font-light italic text-[color:var(--primary-color)] sm:text-[13px] md:text-[13px] xl:text-[13px]'
                  }
                >
                  {dayjsInstance(item?.createdAt).format('DD/MM/YYYY')}
                </div>
              </div>
            </div>
          }
        />
      </List.Item>
    )
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
            {abilities?.can('create', 'Form') && (
              <Button type="primary" onClick={showModal}>
                Create new
              </Button>
            )}

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
        <List
          grid={{ gutter: 20, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
          loading={loading}
          itemLayout="horizontal"
          dataSource={forms}
          renderItem={renderItem}
        />
        {forms?.length > 0 && (
          <Row className="flex justify-between">
            <Col></Col>
            <Col className={'flex'}>
              <Pagination
                simple
                size="small"
                current={+(params?.page || 1)}
                total={+meta?.totalPages}
                onChange={(page) => {
                  setParams({ page })
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                }}
                showSizeChanger={true}
              />
            </Col>
          </Row>
        )}
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
