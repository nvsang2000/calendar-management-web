import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth, useDevice, useSettings } from '~/hooks'
import { MenuOutlined, CloseOutlined, RightOutlined } from '@ant-design/icons'
import { Divider, Dropdown, Image, MenuProps } from 'antd'
import { useRouter } from 'next/router'
import Svg from '../Svg'
import { parseSafe } from '~/helpers'
import { ROLE_ADMIN } from '~/constants'
interface MenuItem {
  key: string
  title: string
  icon?: JSX.Element
  href?: string
  submenu?: MenuItem[]
}

const menus: MenuItem[] = [
  {
    key: '(User)',
    title: 'Users',
    href: '/admin/users',
  },
  {
    key: '(Policy)',
    title: 'Policies',
    href: '/admin/policies',
  },
]

// const listMenuAdmin = [
//   {
//     key: '(Setting)',
//     title: 'Setting',
//     href: '/admin/settings',
//   },
// ]

const CustomSider = ({}) => {
  const router = useRouter()
  const { currentUser, isAuthenticated, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAdmin = ROLE_ADMIN.includes(currentUser?.role)
  const { settings } = useSettings()
  const { isTablet } = useDevice()

  const blacklistFeatures = useMemo(() => {
    const { blacklistFeatures } = settings || {}

    return parseSafe(blacklistFeatures || '{}')
  }, [settings])

  const adminMenus: any[] = [
    ...menus,
    // ...(isAdmin ? listMenuAdmin : []),
  ].filter(
    (i: any) =>
      i &&
      Object.keys(blacklistFeatures).findIndex((item) =>
        item.includes(i?.key),
      ) < 0,
  ) as MenuItem[]

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isMobileMenuOpen])

  const checkShowTab = (key: string) => {
    const values = [
      { action: 'read', subject: 'Dashboard' },
      ...(currentUser?.policy?.permissions || []),
    ]

    return (
      ROLE_ADMIN.includes(currentUser?.role) ||
      values.some(
        (abl) => abl.action === 'read' && key.includes(`(${abl.subject})`),
      )
    )
  }

  const itemsDropdown: MenuProps['items'] = [
    {
      label: <div className={'hover:text-primary-color'}>Profile</div>,
      key: '0',
    },
    {
      label: (
        <div
          className={'hover:text-primary-color'}
          onClick={() => router.push('/admin/profile/assets')}
        >
          Assets
        </div>
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div className={'hover:text-primary-color'} onClick={logout}>
          Sign out
        </div>
      ),
      key: '3',
    },
  ]
  return isAuthenticated ? (
    <>
      <nav className="pt-[10px] !w-full bg-white !font-normal">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {!isTablet ? (
            <div>
              <div className="mt-[10px] mb-[10px]">
                <Image
                  preview={false}
                  alt="img-logo"
                  src={'/assets/img/AZCPOS-WORD-LOGO-SCRAPT.jpg'}
                  width={200}
                  height={30}
                />
              </div>
              <div className="flex justify-between">
                <div className="flex mb-[10px]">
                  {adminMenus?.map((menu: any) => {
                    const showTab = checkShowTab(menu.key)

                    if (!isAdmin && !showTab) return null
                    return (
                      <div key={menu.key}>
                        <Link
                          className={
                            'flex  mr-[40px] text-[color:var(--text-color)] text-[18px]'
                          }
                          href={menu.href}
                        >
                          <div className={'flex content-center items-center'}>
                            <span>{menu.title}</span>
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </div>
                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <div
                      className={
                        'flex flex-row items-center gap-3 cursor-pointer  text-[color:var(--text-color)]'
                      }
                    >
                      <Svg name={'icon_avatar'} />
                      {currentUser?.displayName}
                      <Svg name={'expand-down'} width={14} height={7} />
                    </div>
                  </a>
                </Dropdown>
              </div>
            </div>
          ) : (
            <div className="flex mb-[10px]">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <CloseOutlined className="text-xl" />
                ) : (
                  <MenuOutlined className="text-xl" />
                )}
              </button>
              {isTablet && (
                <div className="flex justify-center ml-[20px]">
                  <Image
                    preview={false}
                    alt="img-logo"
                    src={'/assets/img/AZCPOS-Logo-Web.png'}
                    width={150}
                    height={50}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <nav className="fixed w-full h-full left-0 top-[70px] bottom-0 z-20 border border-t-[1px]">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed top-[70px] right-0 bottom-0 w-[60%] bg-black opacity-30 z-10"
          />
          <div className="bg-white h-screen w-[40%]">
            {adminMenus.map((menu: any) => {
              const showTab = checkShowTab(menu.key)
              if (!isAdmin && !showTab) return null
              return (
                <div key={menu.key}>
                  <Link
                    onClick={() => setIsMobileMenuOpen(false)}
                    href={menu.href}
                    className={
                      'flex justify-between p-3 text-[color:var(--text-color)] text-[16px]'
                    }
                  >
                    <span>{menu.title}</span>
                    <span className={'!mt-[-2px]'}>
                      <RightOutlined />
                    </span>
                  </Link>
                </div>
              )
            })}
            <Divider className={'m-x-[4px]'} />
            <Link
              onClick={() => setIsMobileMenuOpen(false)}
              href={'/admin/profile/assets'}
              className={
                'flex justify-between p-3 text-[color:var(--text-color)] text-[16px]'
              }
            >
              <span>Assets</span>
              <span className={'!mt-[-2px]'}>
                <RightOutlined />
              </span>
            </Link>
            <div
              className={
                'cursor-pointer hover:text-primary-color text-[16px] ml-[10px]'
              }
              onClick={logout}
            >
              Sign out
            </div>
          </div>
        </nav>
      )}
    </>
  ) : (
    <div
      className={`flex ${isTablet ? 'justify-center' : 'pl-[60px]'}  bg-white`}
    >
      <div onClick={() => router.push('/')} className={'my-[10px]'}>
        <Image
          preview={false}
          className="mb-[10px]"
          alt="img-logo"
          src={'/assets/img/AZCPOS-Logo-Web.png'}
          width={isTablet ? 150 : 350}
          height={isTablet ? 50 : 100}
        />
      </div>
    </div>
  )
}

CustomSider.menus = menus
export default CustomSider
