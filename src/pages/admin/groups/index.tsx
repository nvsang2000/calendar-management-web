import React, { useEffect, useState } from 'react'
import { Row, Col, Button, List, Pagination, Modal, Form, message } from 'antd'
import {
  createGroupApi,
  deleteGroupApi,
  getAllGroupApi,
  getGroupApi,
  updateGroupApi,
} from '~/services/apis'
import { useRouter } from 'next/router'
import { GetListParams } from '~/interfaces'
import { useEffectOnce, useSetState } from 'react-use'
import { numberFormat, parseSafe } from '~/helpers'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import dayjsInstance from '~/utils/dayjs'
import queryString from 'query-string'
import Head from 'next/head'
import { GroupForm } from '~/components'
import { useAuth } from '~/hooks'

const DEFAULT_PARAMS: GetListParams = {
  search: '',
  page: 1,
  limit: 10,
}
const GroupPage: React.FC = () => {
  const router = useRouter()
  const { abilities } = useAuth()
  const [form] = Form.useForm()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState<any>({})
  const [updateting, setUpdateting] = useState(false)
  const [updateId, setUpdateId] = useState<any>('create')
  const [initialValues, setInitValues] = useState()
  const [showLayoutUpdate, setShowLayoutUpdate] = useState(false)
  const [params, setParams] = useSetState<any>(
    Object.keys(router.query)?.length > 0
      ? router.query
      : { ...DEFAULT_PARAMS },
  )

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'Group')
    if (!isAccess) router.push('/403')
    return () => {
      isAccess === undefined
    }
  })

  const fetchGroups = async () => {
    setLoading(true)
    return getAllGroupApi({ ...params })
      .then((res) => {
        const { data, headers } = res || {}
        setGroups(data || [])
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
    fetchGroups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const fetchDetail = async (id: string) => {
    return await getGroupApi(id).then((res: any) => {
      const business = res?.data
      setInitValues({ ...business })
    })
  }

  const onSubmit = async (values: any) => {
    try {
      if (updateId && updateId !== 'create') {
        await updateGroupApi(updateId, values)
        message.success('Update successful!')
      } else {
        await createGroupApi(values)
        message.success('Create new successful!')
      }

      setUpdateting(false)
      setShowLayoutUpdate(false)
    } catch (error) {
      console.log(error)
    } finally {
      fetchGroups()
    }
  }

  const removeGroup = async () => {
    try {
      await deleteGroupApi(updateId).finally(() => {
        fetchGroups()
        setShowLayoutUpdate(false)
      })
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const confirmDeleteGroup = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure delete?',
      okText: 'Ok',
      cancelText: 'Cancel',
      onOk: removeGroup,
    })
  }

  const layoutForm = () => {
    return (
      <>
        <Modal
          open={showLayoutUpdate}
          onCancel={() => setShowLayoutUpdate(false)}
          footer={[
            updateId !== 'create' && (
              <Button
                danger
                loading={updateting}
                key={'delete'}
                onClick={confirmDeleteGroup}
              >
                Delete
              </Button>
            ),
            <Button
              className="bg-[var(--green)]"
              disabled={updateting}
              key={'cancel'}
              onClick={() => setShowLayoutUpdate(false)}
            >
              Cancel
            </Button>,
            <Button
              loading={updateting}
              key={'oke'}
              type={'primary'}
              onClick={() => form.submit()}
            >
              {updateId !== 'create' ? 'Update' : 'Create'}
            </Button>,
          ]}
          destroyOnClose
        >
          <GroupForm
            id={updateId !== 'create' ? updateId : undefined}
            initialValues={updateId !== 'create' ? initialValues : undefined}
            onSubmit={onSubmit}
            form={form}
          />
        </Modal>
      </>
    )
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
                onClick={() => {
                  setShowLayoutUpdate(true)
                  setUpdateId(item?.id)
                  fetchDetail(item?.id)
                }}
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
      <Head>
        <title>Groups</title>
      </Head>
      <div className={'mb-[20px] rounded-[8px] bg-white p-[20px]'}>
        {layoutForm()}
        <Row gutter={10} className={'mb-[8px]'}>
          <Col flex={1}>
            <div className={'text-[18px] font-medium'}>
              <span className={'mr-[10px] text-[color:var(--green)]'}>
                {numberFormat(meta?.totalDocs || 0)}
              </span>
              Groups
            </div>
          </Col>
          {abilities?.can('create', 'Group') && (
            <Col>
              <Button
                type={'primary'}
                onClick={() => {
                  setShowLayoutUpdate(true)
                  form.setFieldValue('name', undefined)
                  form.setFieldValue('userIds', undefined)
                  form.setFieldValue('description', undefined)
                  setUpdateId('create')
                }}
              >
                Create new
              </Button>
            </Col>
          )}
        </Row>
        <List
          grid={{ gutter: 20, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
          loading={loading}
          itemLayout="horizontal"
          dataSource={groups}
          renderItem={renderItem}
        />
        {groups?.length > 0 && (
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

export default GroupPage

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(Groups)',
      requiredRoles: [],
    },
  }
}
