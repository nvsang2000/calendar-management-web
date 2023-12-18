import { Button, Col, List, Pagination, Row, Table } from 'antd'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useEffectOnce, useSetState } from 'react-use'
import { MEETING_FORMAT } from '~/constants'
import { parseSafe } from '~/helpers'
import { useAuth, useDevice } from '~/hooks'
import { GetListParams } from '~/interfaces'
import { getAllFormApi } from '~/services/apis'
import dayjsInstance from '~/utils/dayjs'

const DEFAULT_PARAMS: GetListParams = {
  search: '',
  page: 1,
  limit: 10,
}
const FromPage: React.FC = () => {
  const router = useRouter()
  const { abilities } = useAuth()
  const { isTablet } = useDevice()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState<any>({})
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

  const renderItemForMobile = (item: any) => {
    return (
      <List.Item key={item?.id}>
        <List.Item.Meta
          className={
            '!border-[1px] !border-[color:var(--@very-light-gray)] p-[10px]'
          }
          description={
            <div className={'cursor-pointer text-[color:var(--text-color)]'}>
              <div className="text-[13px] capitalize sm:text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] ">
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

  const redirectForm = (record: any) => {
    return router.push(`/admin/forms/${record?.id}`)
  }

  const renderColumns = [
    {
      title: <div className={'base-table-cell-label'}>Name</div>,
      key: 'name',
      dataIndex: 'name',
      width: 150,
      render: (_: any, record: any) => (
        <div onClick={() => redirectForm(record)} className={'cursor-pointer'}>
          <div className={'text-[16px] font-medium'}>{record?.name}</div>
        </div>
      ),
    },
    {
      title: <div className={'base-table-cell-label'}>Meeting format</div>,
      key: 'type',
      dataIndex: 'type',
      width: 250,
      render: (_: any, record: any) => {
        const type = MEETING_FORMAT?.filter((i) => +i?.value === record?.type)
        return (
          <div
            onClick={() => redirectForm(record)}
            className={'cursor-pointer'}
          >
            <div className={'text-[16px] font-medium'}>{type?.[0]?.label}</div>
          </div>
        )
      },
    },
    {
      title: <div className={'base-table-cell-label'}>Description</div>,
      key: 'description',
      dataIndex: 'description',
      width: 350,
      render: (_: any, record: any) => (
        <div onClick={() => redirectForm(record)} className={'cursor-pointer'}>
          <div className={'text-[14px] font-normal'}>{record?.description}</div>
        </div>
      ),
    },
    {
      title: <div className={'base-table-cell-label '}>Created date</div>,
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 100,
      render: (_: any, record: any) => {
        return (
          <div
            onClick={() => redirectForm(record)}
            className={'cursor-pointer text-[14px] font-normal'}
          >
            <span className={'!inline-block min-w-[100px]'}>
              {dayjsInstance(record?.createdAt).format('DD/MM/YYYY')}
            </span>
          </div>
        )
      },
    },
    {
      title: <div className={'base-table-cell-label'}>Link</div>,
      key: 'slug',
      dataIndex: 'slug',
      width: 200,
      render: (_: any, record: any) => {
        return (
          <div
            className={'cursor-pointer text-[14px] font-normal'}
            onClick={() => redirectForm(record)}
          >
            {record?.slug}
          </div>
        )
      },
    },
  ]

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
              <Button
                type="primary"
                onClick={() => router.push('/admin/forms/create')}
              >
                Create new
              </Button>
            )}
          </Col>
        </Row>
        {isTablet ? (
          <>
            <List
              grid={{ gutter: 20, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
              loading={loading}
              itemLayout="horizontal"
              dataSource={forms}
              renderItem={renderItemForMobile}
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
          </>
        ) : (
          <Table
            dataSource={forms}
            rowKey={(record) => record?.id + ''}
            columns={renderColumns}
            pagination={{
              total: meta?.totalDocs,
              pageSize: params?.limit,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100, 200],
              onShowSizeChange(current, size) {
                setParams({ limit: size })
              },
              hideOnSinglePage: true,
              onChange: (page) => setParams({ page }),
              current: +(params?.page || 1),
            }}
            loading={loading}
            locale={{ emptyText: 'Not fund data!' }}
          />
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
