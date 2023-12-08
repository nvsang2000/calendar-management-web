import '~/styles/globals.css'
import React from 'react'
import { SWRConfig } from 'swr'
import type { AppProps } from 'next/app'
import { localStorageProvider } from '~/helpers'
import DefaultLayout from '~/components/DefaultLayout'
import nextCookies from 'next-cookies'
import { AuthProvider } from '~/contexts/auth'
import { SettingsProvider } from '~/contexts/settings'
import getConfig from 'next/config'

const routesNoNeedAuth = ['/login']
const routesNoNeedDefaultLayout = ['/admin/orders/print']

process.env.TZ = 'Asia/Ho_Chi_Minh'

function MyApp({
  Component,
  pageProps,
  currentUser,
  globalSettings,
  ...appProps
}: AppProps & any) {
  if (routesNoNeedDefaultLayout.includes(appProps.router.pathname))
    return <Component {...pageProps} />

  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <SettingsProvider>
        <AuthProvider>
          {/* @ts-ignore */}
          <DefaultLayout
            currentUser={currentUser}
            globalSettings={globalSettings}
            pageProps={pageProps}
          >
            <Component />
          </DefaultLayout>
        </AuthProvider>
      </SettingsProvider>
    </SWRConfig>
  )
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { res, pathname } = ctx
  const { accessToken } = nextCookies(ctx)
  const { publicRuntimeConfig } = getConfig()
  const baseURL = publicRuntimeConfig.NEXT_PUBLIC_ENV_API_URL

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
