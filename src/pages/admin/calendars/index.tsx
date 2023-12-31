import React, { useEffect, useState } from 'react'
import { Row, Col, Button, List, Pagination, Modal, Form, message } from 'antd'
import {
  authGoogleApi,
  deleteCalendarApi,
  getAllCalendarApi,
} from '~/services/apis'
import { useRouter } from 'next/router'
import { GetListParams } from '~/interfaces'
import { useEffectOnce, useSetState } from 'react-use'
import { numberFormat, parseSafe } from '~/helpers'
import { ExclamationCircleOutlined, GoogleOutlined } from '@ant-design/icons'
import dayjsInstance from '~/utils/dayjs'
import queryString from 'query-string'
import Head from 'next/head'
import { useAuth } from '~/hooks'
import Cookies from 'js-cookie'
import getConfig from 'next/config'

const DEFAULT_PARAMS: GetListParams = {
  search: '',
  page: 1,
  limit: 10,
}
const CalendarPage: React.FC = () => {
  const router = useRouter()
  const { abilities, currentUser } = useAuth()
  const [form] = Form.useForm()
  const [calendars, setCalendars] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState<any>({})
  const [updateting, setUpdateting] = useState(false)
  const [updateId, setUpdateId] = useState<any>('create')
  const [showLayoutUpdate, setShowLayoutUpdate] = useState(false)
  const { publicRuntimeConfig } = getConfig()
  const baseURL = publicRuntimeConfig.NEXT_PUBLIC_ENV_API_URL
  const [showAuthGoogle, setShowAuthGoogle] = useState(
    !currentUser?.isAuthGoogle ? true : false,
  )

  const [params, setParams] = useSetState<any>(
    Object.keys(router.query)?.length > 0
      ? router.query
      : { ...DEFAULT_PARAMS },
  )

  // useEffect(() => {
  //   if (data?.refresh_token) {
  //     authGoogleApi({ refreshToken: data?.refresh_token }).finally(() =>
  //       setShowAuthGoogle(false),
  //     )
  //   }
  // }, [token])

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'Calendar')
    if (!isAccess) router.push('/403')
  })

  const fetchCalendars = async () => {
    setLoading(true)
    return getAllCalendarApi({ ...params })
      .then((res) => {
        const { data, headers } = res || {}
        setCalendars(data || [])
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
    fetchCalendars()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const removeCalendar = async () => {
    try {
      await deleteCalendarApi(updateId).finally(() => {
        fetchCalendars()
        setShowLayoutUpdate(false)
      })
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const confirmDeleteCalendar = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure delete?',
      okText: 'Ok',
      cancelText: 'Cancel',
      onOk: removeCalendar,
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
                onClick={confirmDeleteCalendar}
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
          {/* <CalendarForm
            id={updateId !== 'create' ? updateId : undefined}
            initialValues={updateId !== 'create' ? initialValues : undefined}
            onSubmit={onSubmit}
            form={form}
          /> */}
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
          title={
            <div className={'flex justify-between'}>
              <div className="cursor-pointer text-[18px] capitalize text-black">{`${item?.user?.firstName} ${item?.user?.lastName}`}</div>
              {!item?.isSync && (
                <Button type="primary" size="small">
                  Sync
                </Button>
              )}
            </div>
          }
          description={
            <div className={'cursor-pointer text-[color:var(--text-color)]'}>
              <div className="text-[13px] sm:text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] ">
                <div
                  className={
                    'lg-[16px] text-[13px] font-normal text-[color:var(--text-color)] sm:text-[14px] md:text-[16px] xl:text-[16px]'
                  }
                >
                  {`Start time: ${dayjsInstance(item?.startTime).format(
                    'YYYY/MM/DD HH:mm',
                  )}`}
                </div>
                <div
                  className={
                    'lg-[16px] text-[13px] font-normal text-[color:var(--text-color)] sm:text-[14px] md:text-[16px] xl:text-[16px]'
                  }
                >
                  {`End time: ${dayjsInstance(item?.endTime).format(
                    'YYYY/MM/DD HH:mm',
                  )}`}
                </div>

                <div
                  className={
                    'lg-[16px] text-[13px] font-normal text-[color:var(--text-color)] sm:text-[14px] md:text-[16px] xl:text-[16px]'
                  }
                >
                  {`Sync with google: ${item?.isSync ? 'Sync' : 'Not sync'}`}
                </div>

                {item?.meetLink && (
                  <div
                    className={
                      'lg-[16px] text-[13px] font-normal text-[color:var(--text-color)] sm:text-[14px] md:text-[16px] xl:text-[16px]'
                    }
                  >
                    Link:{' '}
                    <a href={item?.meetLink} target="_blank" rel="noreferrer">
                      {item?.meetLink}
                    </a>
                  </div>
                )}

                <div
                  className={
                    'lg-[13px]  text-[12px] font-light italic text-[var(--primary-color)] sm:text-[13px] md:text-[13px] xl:text-[13px]'
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
        <title>Calendars</title>
      </Head>
      <div className={'mb-[20px] rounded-[8px] bg-white p-[20px]'}>
        {layoutForm()}
        <Row gutter={10} className={'mb-[8px]'}>
          <Col flex={1}>
            <div className={'text-[18px] font-medium'}>
              <span className={'mr-[10px] text-[color:var(--green)]'}>
                {numberFormat(meta?.totalDocs || 0)}
              </span>
              Calendars
            </div>
          </Col>
          {abilities?.can('create', 'Calendar') && (
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
        {showAuthGoogle && (
          <Button
            icon={<GoogleOutlined className="text-white" />}
            style={{ backgroundColor: 'var(--dark-blue)', marginBottom: 10 }}
            onClick={() => router.push(`${baseURL}api/auth/google`)}
          >
            <span className="text-white">Connect With Google</span>
          </Button>
        )}

        <List
          grid={{ gutter: 20, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 4 }}
          loading={loading}
          itemLayout="horizontal"
          dataSource={calendars}
          renderItem={renderItem}
        />
        {calendars?.length > 0 && (
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

export default CalendarPage

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(Calendars)',
      requiredRoles: [],
    },
  }
}
