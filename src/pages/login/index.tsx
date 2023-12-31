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
    <div className="">
      <Row justify={'center'} align={'middle'} style={{ height: '300px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <h2
            className={
              'lg-[36px] pt-[20px] text-[24px] font-semibold text-[#029147] sm:text-[26px] md:pt-[40px] md:text-[36px] xl:text-[36px]'
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
                    'lg-[30px] text-[20px] font-medium !text-black sm:text-[24px] md:text-[30px] xl:text-[20px]'
                  }
                >
                  Email
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
                    'lg-[30px] text-[20px] font-medium !text-black sm:text-[24px] md:text-[30px]  xl:text-[20px]'
                  }
                >
                  Password
                </span>
              }
              name="password"
            >
              <Input.Password size={'large'} className="!bg-white" />
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
                    'lg-[30px] text-[20px] font-medium !text-black sm:text-[24px] md:text-[30px]  xl:text-[20px]'
                  }
                >
                  Remember for the next sign
                </b>
              </Col>
            </Row>
            <Form.Item>
              <Button
                className={
                  'mt-8 w-full !border !border-[#029147] !font-medium !text-[#029147] hover:!bg-[#029147]  hover:!text-white'
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
    </div>
  ) : (
    <SplashScreen />
  )
}

export default Login
