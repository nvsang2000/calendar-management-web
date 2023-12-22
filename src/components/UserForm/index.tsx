import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Switch,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { EMAIL_PATTERN, ROLE, ROLE_ADMIN } from '~/constants'
import { useAuth } from '~/hooks'
import { BaseFormProps } from '~/interfaces'
import FormLabel from '../FormLabel'
import Svg from '../Svg'
import PolicySelect from '../PolicySelect'

interface FormProps extends BaseFormProps {
  isStaff: boolean
}
export default function UserForm({
  id,
  loading = false,
  isStaff = true,
  initialValues = {},
  onSubmit = () => {},
  onRemove = () => {},
}: FormProps) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [displayPasswordForm, setDisplayPasswordForm] = useState(false)
  const watchRole = Form.useWatch('role', form)
  const { currentUser, abilities } = useAuth()
  const isAdmin = ROLE_ADMIN.includes(currentUser?.role)

  useEffect(() => {
    if (Object.keys(initialValues)?.length > 0) {
      form.resetFields()
    }
  }, [form, initialValues])

  const renderPasswordForm = () => {
    return (
      <>
        <FormLabel label={`${id ? 'New' : ''} Password`} require />
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please Enter password!' }]}
        >
          <Input.Password
            size="large"
            placeholder={'Enter password'}
            autoComplete={undefined}
          />
        </Form.Item>

        {id && (
          <>
            <FormLabel label={'Confirm password'} require />
            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: 'Please Enter password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }

                    return Promise.reject(new Error('Password does not match!'))
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder={'Enter password'}
                autoComplete={undefined}
              />
            </Form.Item>
          </>
        )}
      </>
    )
  }

  const handleGoBack = () => {
    return router.back()
  }

  return (
    <div className={'rounded-[10px] bg-white p-[40px]'}>
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
          {'Information'}
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
            <FormLabel label={'First name'} require />
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Please enter first name!' }]}
            >
              <Input size="large" placeholder={'Enter first name'} />
            </Form.Item>

            <FormLabel label={'Last name'} require />
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Please enter last name!' }]}
            >
              <Input size="large" placeholder={'Enter last name'} />
            </Form.Item>

            <FormLabel label={'Phone'} require />
            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please enter phone!' }]}
            >
              <Input
                disabled={
                  !!(id && id !== 'create') && !abilities.can('update', 'User')
                }
                size="large"
                placeholder={'Enter phone'}
              />
            </Form.Item>
            {id && currentUser?.role === ROLE.adminSys && (
              <div className={'mb-[20px]'}>
                <span className={'base-form-label mr-[10px]'}>
                  Change or reset password
                </span>
                <Checkbox
                  onClick={() => setDisplayPasswordForm(!displayPasswordForm)}
                />
              </div>
            )}
            {((id && displayPasswordForm) || !id) && renderPasswordForm()}
          </Col>
          <Col xs={24} lg={12}>
            <FormLabel label={'Email'} require />
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter email!' },
                {
                  pattern: EMAIL_PATTERN,
                  message: 'Please enter the correct format!',
                },
              ]}
            >
              <Input
                size="large"
                disabled={!!(id && id !== 'create')}
                placeholder={'Please enter email'}
                autoComplete={undefined}
              />
            </Form.Item>

            {!isStaff && id !== 'profile' && (
              <Form.Item noStyle shouldUpdate>
                {() =>
                  form.getFieldValue('role') !== ROLE.admin && (
                    <>
                      <FormLabel label={'Role'} require />
                      <Form.Item
                        name="policyId"
                        rules={[
                          { required: true, message: 'Please select policy!' },
                        ]}
                      >
                        <PolicySelect
                          size="large"
                          placeholder={'Please enter role'}
                        />
                      </Form.Item>
                    </>
                  )
                }
              </Form.Item>
            )}
            <Row>
              <Col xs={12} lg={12}>
                <div className={'flex'}>
                  <div className={'base-form-label mr-[20px]'}>Status</div>
                  <Form.Item
                    noStyle
                    name={'isActive'}
                    label={''}
                    valuePropName={'checked'}
                  >
                    <Checkbox />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={12} lg={12}>
                {!isStaff && isAdmin && id !== 'profile' && (
                  <div className={'!flex'}>
                    <div
                      className={`${'base-form-label'} mr-[20px] self-center`}
                    >
                      Admin
                    </div>
                    <Switch
                      checked={watchRole === ROLE.admin}
                      onChange={(checked) =>
                        form.setFieldValue(
                          'role',
                          checked ? ROLE.admin : ROLE.user,
                        )
                      }
                    />
                    <Form.Item noStyle name={'role'}>
                      <Input size="large" className="!hidden" />
                    </Form.Item>
                  </div>
                )}
              </Col>
            </Row>
          </Col>

          {id === 'profile' && (
            <Col xs={24} lg={12}>
              <Form.Item noStyle shouldUpdate>
                {() => (
                  <Form.Item
                    label={<span className={'base-form-label'}>Role</span>}
                  >
                    <Input
                      value={
                        isAdmin
                          ? ROLE.admin
                          : form.getFieldValue('policy')?.name
                      }
                      size="large"
                      disabled
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={40} className={'py-[40px] pl-[20px]'}>
          <Space align="center">
            <Button loading={loading} type={'primary'} htmlType={'submit'}>
              {!id ? 'Create' : 'Update'}
            </Button>
            {isAdmin && id && (
              <Popconfirm
                title={'Are you sure you want to delete ?'}
                onConfirm={() => id && onRemove(id)}
              >
                <Button loading={loading} type={'primary'} danger>
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Space>
        </Row>
      </Form>
    </div>
  )
}
