import React, { useEffect, useMemo, useState } from 'react'
import { Layout } from 'antd'
import { useAuth } from '~/hooks'
import { parseSafe } from '~/helpers'
import SplashScreen from '../SplashScreen'
import CustomSider from '../CustomSider'
import { ROLE_ADMIN } from '~/constants'
import { Header } from '..'
const { Content } = Layout

const DefaultLayout: React.FC = ({
  children,
  currentUser,
  pageProps,
  globalSettings,
}: {
  children?: JSX.Element
  currentUser?: any
  pageProps?: any
  globalSettings?: any
}) => {
  const [mounted, setMounted] = useState(false)
  const { setCurrentUser, abilities, loading } = useAuth()

  useEffect(() => {
    setCurrentUser(currentUser)
    setMounted(true)
    //eslint-disable-next-line
  }, [])

  const blacklistFeatures = useMemo(() => {
    const { blacklistFeatures } = globalSettings || {}

    return parseSafe(blacklistFeatures || '{}')
  }, [globalSettings])

  const isAccessable = () => {
    const userRole = currentUser?.role
    const requiredRoles = pageProps?.requiredRoles
    const pageKey = pageProps?.pageKey

    if (
      Object.keys(blacklistFeatures).findIndex((item) =>
        item.includes(pageKey),
      ) > 0
    ) {
      return false
    }

    if (
      !requiredRoles ||
      requiredRoles?.length === 0 ||
      ROLE_ADMIN.includes(userRole)
    ) {
      return true
    }

    return requiredRoles?.some((i: any) => abilities.can(i?.action, i?.subject))
  }

  if (!loading) {
    return mounted ? (
      <Layout className={'relative '} style={{ minHeight: '100vh' }}>
        <CustomSider />
        <Layout className="site-layout">
          <Content
            className={'mt-[10px] relative !-z-0 p-[20px]'}
          >
            {isAccessable() ? (
              children
            ) : (
              <div
                className={
                  'bg-white !text-black rounded-[8px] grid place-content-center min-h-[300px] text-[15px]'
                }
              >
                {
                  'You do not have access rights or this feature has not been  enabled!'
                }
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    ) : (
      <></>
    )
  }

  return <SplashScreen />
}

export default DefaultLayout
