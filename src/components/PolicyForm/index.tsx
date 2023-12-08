import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  List,
  Popconfirm,
  Row,
  Table,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getPermissionSubjectsApi, removePolicyApi } from '~/services/apis'
import { BaseFormProps } from '~/interfaces'
import Svg from '../Svg'

const actions = {
  read: 'Read',
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
}

export default function PolicyForm({
  id = '',
  loading = false,
  initialValues = {},
  onSubmit = () => {},
}: BaseFormProps) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [permissionSubjects, setPermissionSubjects] = useState<any>([])
  const [permissionTree, setPermissionTree] = useState<any>({})
  const watchPermissions = Form.useWatch('permissions', form)

  useEffect(() => {
    getPermissionSubjectsApi()
      .then((res: any) => {
        const permissionSubjects: any[] = []
        const permissionTree: any = {}

        Object.entries(res?.data || []).map(([subject, translate]) => {
          permissionSubjects.push({
            subject,
            translate,
          })

          Object.keys(actions).map((action: string) => {
            permissionTree[`${action}_${subject}`] = {
              action,
              subject,
              active: true,
            }
          })
        })

        setPermissionSubjects(permissionSubjects)
        setPermissionTree(permissionTree)
      })
      .catch(console.log)
  }, [])

  useEffect(() => {
    if (Object.keys(initialValues)?.length > 0) {
      form.resetFields()
    }
  }, [form, initialValues])

  const removePolicies = async () => {
    try {
      await removePolicyApi(+id)
      return router.back
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const renderItem = (item: any) => {
    const checked = Object.keys(actions).every(
      (action) => !!watchPermissions?.[`${action}_${item.subject}`],
    )

    const indeterminate = Object.keys(actions).some(
      (action) => !!watchPermissions?.[`${action}_${item.subject}`],
    )
    return (
      <List.Item>
        <List.Item.Meta
          className={'!border !border-[color:var(--@very-light-gray)] p-[10px]'}
          title={
            <div>
              <div className="text-black text-[18px] capitalize cursor-pointer">
                {item?.subject}
              </div>
            </div>
          }
          description={
            <>
              {Object.entries(actions).map(([key, title]) => {
                return (
                  <div key={key}>
                    <Row gutter={40}>
                      <Col xs={12} md={12} xl={12}>
                        <span className={'text-black text-[16px] '}>
                          {title}
                        </span>
                      </Col>
                      <Col
                        xs={12}
                        md={12}
                        xl={12}
                        className={'!flex justify-between'}
                      >
                        <div
                          className={`${
                            !permissionTree?.[`${key}_${item.subject}`]
                              ? 'hidden'
                              : ''
                          }`}
                        >
                          <Checkbox
                            checked={
                              !!watchPermissions?.[`${key}_${item.subject}`]
                            }
                            onChange={(e) => {
                              const oldPermissions =
                                form.getFieldValue('permissions')

                              form.setFieldValue('permissions', {
                                ...oldPermissions,
                                [`${key}_${item.subject}`]: e.target.checked
                                  ? permissionTree[`${key}_${item.subject}`]
                                  : undefined,
                              })
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              })}
              <Row gutter={40}>
                <Col xs={12} md={12} xl={12}>
                  <span className={'text-black text-[16px]'}>All</span>
                </Col>
                <Col xs={12} md={12} xl={12}>
                  <Checkbox
                    checked={checked}
                    {...(!checked && { indeterminate })}
                    onChange={(e) => {
                      const newPermissions = { ...watchPermissions }

                      if (e.target.checked) {
                        Object.keys(actions).forEach(
                          (key) =>
                            (newPermissions[`${key}_${item?.subject}`] =
                              permissionTree[`${key}_${item?.subject}`]),
                        )
                      } else {
                        Object.keys(actions).map(
                          (key) =>
                            delete newPermissions[`${key}_${item?.subject}`],
                        )
                      }

                      form.setFieldValue('permissions', newPermissions)
                    }}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </List.Item>
    )
  }
  const handleGoBack = () => {
    if (window?.history?.length <= 2) {
      router.push('/admin/policies')
    }

    return router.back()
  }

  return (
    <div className={'policy-form'}>
      <div className={'flex items-center mb-[10px] '}>
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
            'text-[18px] sm:text-[24px] md:text-[26px] xl:text-[26px] font-[500] ml-[20px] cursor-pointer'
          }
        >
          {'Policy Information'}
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
        <Row>
          <Col xs={24}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={<span className={'base-form-label'}>Name policy</span>}
                name="name"
                rules={[
                  { required: true, message: 'Please enter name policy!' },
                ]}
              >
                <Input placeholder={'Enter name policy'} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <span className={'base-form-label mr-10'}>Status</span>
              <Form.Item
                labelAlign={'left'}
                label={''}
                name="isActive"
                valuePropName={'checked'}
                noStyle
              >
                <Checkbox>Activated</Checkbox>
              </Form.Item>
            </Col>
            <div className={'mb-[20px]'} />
          </Col>
          <span className={'base-form-label py-[10px]'}>Feature</span>
          <Col xs={24} md={24} xl={24}>
            <Form.Item noStyle name={'permissions'}>
              <Table className={'!hidden'} />
              <List
                grid={{ gutter: 20, xs: 1, sm: 1, md: 2, lg: 4, xl: 4, xxl: 4 }}
                loading={loading}
                itemLayout="horizontal"
                dataSource={permissionSubjects}
                renderItem={renderItem}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className={'mb-5'} />
        <Row style={{ alignItems: 'center' }} justify="space-between">
          <div className={'mb-[40px]'}>
            <Button
              loading={loading}
              type={'primary'}
              htmlType={'submit'}
              className={'mr-[16px]'}
            >
              Update
            </Button>
            <Popconfirm
              title={'Are you sure you want to delete ?'}
              onConfirm={removePolicies}
            >
              <Button loading={loading} type={'primary'} danger>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </Row>
      </Form>
    </div>
  )
}
