import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Switch, List, Pagination, Select } from 'antd'
import { getAllUserApi, updateUserApi } from '~/services/apis'
import { useRouter } from 'next/router'
import { GetListParams } from '~/interfaces'
import { useEffectOnce, useSetState } from 'react-use'
import { numberFormat, parseSafe } from '~/helpers'
import dayjsInstance from '~/utils/dayjs'
import queryString from 'query-string'
import { ROLE, ROLE_ADMIN } from '~/constants'
import Head from 'next/head'
import { useAuth } from '~/hooks'

const DEFAULT_PARAMS: GetListParams = {
  search: '',
  page: 1,
  limit: 10,
}
const Users: React.FC = () => {
  const router = useRouter()
  const { currentUser, abilities } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState<any>({})
  const [params, setParams] = useSetState<any>(
    Object.keys(router.query)?.length > 0
      ? router.query
      : { ...DEFAULT_PARAMS },
  )

  useEffectOnce(() => {
    const isAccess = abilities?.can('read', 'User')
    if (!isAccess) router.push('/403')
    return () => {
      isAccess === undefined
    }
  })

  const onActiveChange = async (isActive: boolean, record: any) => {
    try {
      await updateUserApi(record.id, { isActive })
      fetchUsers()
    } catch (e: any) {
      console.log(e.message)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    return getAllUserApi({ ...params })
      .then((res) => {
        const { data, headers } = res || {}
        setUsers(data || [])
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
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const redirectUsers = async (record: any) => {
    return router.push(`/admin/users/${record?.id}`)
  }

  const renderItem = (item: any) => {
    const adminSys = item?.role === ROLE.adminSys

    return (
      <List.Item>
        <List.Item.Meta
          className={
            '!h-[140px] !border !border-[color:var(--@very-light-gray)] p-[10px] sm:!h-[140px] md:!h-[160px] lg:!h-[160px] xl:!h-[160px]'
          }
          title={
            <div className={'flex justify-between'}>
              <div
                onClick={() => redirectUsers(item)}
                className="cursor-pointer text-[18px] capitalize text-black"
              >
                {`${item?.firstName} ${item?.lastName}`}
              </div>
              {item?.id !== currentUser?.id && !adminSys && (
                <div className={'pl-[20px]'}>
                  <Switch
                    size="small"
                    checked={item.isActive}
                    onChange={(checked) => onActiveChange(checked, item)}
                  />
                </div>
              )}
            </div>
          }
          description={
            <>
              <div
                className={
                  'lg-[16px] text-[13px] font-normal text-[color:var(--text-color)] sm:text-[14px] md:text-[16px] xl:text-[16px] '
                }
              >
                {!adminSys && `Email: ${item?.email}`}
              </div>
              <div
                className={
                  'lg-[16px] text-[13px] font-normal text-[color:var(--text-color)] sm:text-[14px] md:text-[16px] xl:text-[16px]'
                }
              >
                {!adminSys && `Phone: ${item?.phone}`}
              </div>
              <div
                className={
                  'lg-[16px] text-[13px] font-normal capitalize text-[color:var(--text-color)] sm:text-[14px] md:text-[16px] xl:text-[16px]'
                }
              >
                Role:{' '}
                {ROLE_ADMIN.includes(item?.role)
                  ? item?.role
                  : item?.policy?.name}
              </div>
              <div
                className={
                  'lg-[13px]  text-[12px] font-light italic text-[color:var(--primary-color)] sm:text-[13px] md:text-[13px] xl:text-[13px]'
                }
              >
                {dayjsInstance(item.lastSeen).fromNow()}
              </div>
            </>
          }
        />
      </List.Item>
    )
  }
  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <div className={'mb-[20px] rounded-[8px] bg-white p-[20px]'}>
        <Row gutter={10} className={'mb-[8px]'}>
          <Col flex={1}>
            <div className={'text-[18px] font-medium'}>
              <span className={'mr-[10px] text-[color:var(--green)]'}>
                {numberFormat(meta?.totalDocs || 0)}
              </span>
              Users
            </div>
          </Col>
          {abilities?.can('create', 'User') && (
            <Col>
              <Button
                type={'primary'}
                onClick={() => router.push('/admin/users/create')}
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
          dataSource={users}
          renderItem={renderItem}
        />
        {users?.length > 0 && (
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

export default Users

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(User)',
      requiredRoles: [],
    },
  }
}
