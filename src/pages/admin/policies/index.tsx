import { Button, Col, List, Pagination, Row, Select } from 'antd'
import isEmpty from 'lodash/isEmpty'
import Head from 'next/head'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import React, { useState } from 'react'
import { useSetState, useDebounce } from 'react-use'
import { PAGE_SIZE_OPTION } from '~/constants'
import { numberFormat, parseSafe } from '~/helpers'
import { GetListParams } from '~/interfaces'
import { getPoliciesApi } from '~/services/apis'
import dayjsInstance from '~/utils/dayjs'

interface ParamsProps extends GetListParams {
  activeTab?: string
}
const DEFAULT_PARAMS: ParamsProps = {
  search: '',
  page: 1,
  limit: 10,
  activeTab: '',
}

function Policies({}) {
  const router = useRouter()
  const [policies, setPolicies] = useState([])
  const [meta, setMeta] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useSetState<any>(
    Object.keys(router.query)?.length > 0
      ? router.query
      : { ...DEFAULT_PARAMS },
  )

  const redirectPolicies = (record: any) => {
    router.push(`/admin/policies/${record.id}`)
  }

  const replacePath = () => {
    router.replace(
      `${router.pathname}?${queryString.stringify(params)}`,
      undefined,
      {
        shallow: true,
      },
    )
  }

  const fetchPolicies = () => {
    setLoading(true)
    return getPoliciesApi({
      ...params,
      isActive: !isEmpty(params.activeTab)
        ? params.activeTab === 'activated'
        : undefined,
    })
      .then((res) => {
        const { data, headers } = res || {}
        setPolicies(data || [])
        setMeta(parseSafe(headers?.meta + ''))
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useDebounce(
    async () => {
      replacePath()
      fetchPolicies()
    },
    300,
    [params],
  )

  const renderItemListForMobile = (item: any) => {
    return (
      <List.Item>
        <List.Item.Meta
          className={'!border !border-[color:var(--@very-light-gray)] p-[10px]'}
          title={
            <div className={'flex justify-between'}>
              <div
                onClick={() => redirectPolicies(item)}
                className="text-black text-[18px] capitalize cursor-pointer"
              >
                {item.name}
              </div>
            </div>
          }
          description={
            <>
              <div
                className={
                  'text-[color:var(--text-color)] font-normal text-[13px] sm:text-[14px] md:text-[16px] lg-[16px] xl:text-[16px]'
                }
              >
                Date Created:{' '}
                {dayjsInstance(item?.createdAt).format('DD/MM/YYYY')}
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
        <title>Policies</title>
      </Head>
      <div className={'bg-white p-[20px] rounded-[8px] mb-[20px]'}>
        <Row gutter={20} className={'mb-[8px]'}>
          <Col flex={1}>
            <div className={'text-[18px] font-medium'}>
              <span className={'mr-[10px] text-[color:var(--green)]'}>
                {numberFormat(meta?.totalDocs || 0)}
              </span>
              Policy
            </div>
          </Col>
          <Col>
            <Button
              type={'primary'}
              onClick={() => router.push('/admin/policies/create')}
            >
              Create new
            </Button>
          </Col>
        </Row>
        <div className={'pb-10'}>
          <List
            grid={{ gutter: 20, xs: 1, sm: 1, md: 2, lg: 4, xl: 4, xxl: 4 }}
            loading={loading}
            itemLayout="horizontal"
            dataSource={policies}
            renderItem={renderItemListForMobile}
          />
          {policies?.length > 0 && (
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
                <Select
                  size="small"
                  showArrow
                  value={params?.limit}
                  options={PAGE_SIZE_OPTION?.map((size: number) => ({
                    value: size,
                    lable: size,
                  }))}
                  onChange={(value: any) => {
                    setParams({ limit: value })
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                  }}
                />
              </Col>
            </Row>
          )}
        </div>
      </div>
    </>
  )
}

export default Policies

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(Policies)',
      requiredRoles: [],
    },
  }
}
