import '~/styles/globals.css'
import '~/styles/index.css'
import React from 'react'
import { SWRConfig } from 'swr'
import type { AppProps } from 'next/app'
import { localStorageProvider } from '~/helpers'
import DefaultLayout from '~/components/DefaultLayout'
import nextCookies from 'next-cookies'
import { AuthProvider } from '~/contexts/auth'
import getConfig from 'next/config'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { THEME_DEFAULT } from '~/constants'
import Cookies from 'js-cookie'

const routesNoNeedAuth = ['/login']
const routesNoNeedDefaultLayout = [
  '/admin/orders/print',
  '/booking/[id]',
  '/404',
  '/403',
]

function MyApp({
  Component,
  pageProps,
  currentUser,
  globalSettings,
  ...appProps
}: AppProps & any) {
  if (routesNoNeedDefaultLayout.includes(appProps.router.pathname))
    return (
      <StyleProvider hashPriority="high">
        <ConfigProvider theme={{ ...THEME_DEFAULT }}>
          <Component {...pageProps} />
        </ConfigProvider>
      </StyleProvider>
    )

  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <AuthProvider>
        {/* @ts-ignore */}

        <DefaultLayout
          currentUser={currentUser}
          globalSettings={globalSettings}
          pageProps={pageProps}
        >
          <StyleProvider hashPriority="high">
            <ConfigProvider theme={{ ...THEME_DEFAULT }}>
              <Component />
            </ConfigProvider>
          </StyleProvider>
        </DefaultLayout>
      </AuthProvider>
    </SWRConfig>
  )
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { res, pathname } = ctx
  const { accessToken, token } = nextCookies(ctx)

  const testtoken = Cookies.get('token')
  console.log('token', token, testtoken)
  const { publicRuntimeConfig } = getConfig()
  const baseURL = publicRuntimeConfig.NEXT_PUBLIC_ENV_API_URL

  if (routesNoNeedDefaultLayout.includes(pathname)) return {}
  const redirectOnError = () =>
    res && !routesNoNeedAuth.includes(pathname)
      ? res.writeHead(302, { Location: '/login' }).end()
      : {}

  try {
    const getUserResponse = await fetch(`${baseURL}auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (getUserResponse.ok) {
      return {
        currentUser: await getUserResponse.json(),
      }
    } else {
      return await redirectOnError()
    }
  } catch (err) {
    return redirectOnError()
  }
}

export default MyApp
