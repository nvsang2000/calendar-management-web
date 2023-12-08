import React from 'react'
import { Form, Input, Button, Row, Col, Checkbox } from 'antd'

import { useAuth } from '~/hooks'
import s from './styles.module.css'
import SplashScreen from '~/components/SplashScreen'
import Router from 'next/router'
import { useEffectOnce } from 'react-use'

const Login: React.FC = () => {
  const { login, loading, isAuthenticated } = useAuth()

  useEffectOnce(() => {
    if (isAuthenticated) Router.push('/admin')
  })
  const onFinish = (values: any) => {
    login(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return !isAuthenticated ? (
    <Row
      className={s['login-container']}
      justify={'center'}
      align={'middle'}
      style={{ height: '300px' }}
    >
      <Col span={24} style={{ textAlign: 'center' }}>
        <h2
          className={
            'text-[24px] sm:text-[26px] md:text-[36px] lg-[36px] xl:text-[36px] text-[color:var(--green)] font-semibold pt-[20px] md:pt-[40px]'
          }
        >
          Login
        </h2>
      </Col>
      <Col
        className={s['login-form']}
        lg={14}
        xs={22}
        style={{ maxWidth: 512 }}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout={'vertical'}
          colon={false}
        >
          <Form.Item
            label={
              <span
                className={
                  'text-[20px] sm:text-[24px] md:text-[30px] lg-[30px] xl:text-[20px] text-[color:var(--black)] font-medium'
                }
              >
                Email / Phone / Username
              </span>
            }
            name="username"
          >
            <Input size={'large'} />
          </Form.Item>
          <Form.Item
            label={
              <span
                className={
                  'text-[20px] sm:text-[24px] md:text-[30px] lg-[30px] xl:text-[20px] text-[color:var(--black)] font-medium'
                }
              >
                Password
              </span>
            }
            name="password"
          >
            <Input.Password size={'large'} />
          </Form.Item>
          <Col>
            <p
              style={{
                cursor: 'pointer',
                width: '8rem',
                color: 'red',
              }}
              onClick={() => Router.push('/logout')}
            >
              Forgot password ?
            </p>
          </Col>
          <Row gutter={20}>
            <Col className={'grid place-content-center'}>
              <Form.Item label={''} name={'remember'} noStyle>
                <Checkbox defaultChecked={true} />
              </Form.Item>
            </Col>
            <Col>
              <b
                className={
                  'text-[20px] sm:text-[24px] md:text-[30px] lg-[30px] xl:text-[20px] text-[color:var(--black)] font-medium'
                }
              >
                Remember for the next sign
              </b>
            </Col>
          </Row>
          <Form.Item>
            <Button
              className={
                'mt-8 w-full !border !border-[color:var(--green)] hover:!bg-[var(--green)] !text-[color:var(--green)] !font-medium  hover:!text-white'
              }
              size={'large'}
              loading={loading}
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  ) : (
    <SplashScreen />
  )
}

export default Login
