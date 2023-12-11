import { Divider, Image, Layout, Menu } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { parseSafe } from '~/helpers'
import { useAuth, useDevice, useSettings } from '~/hooks'
import Svg from '../Svg'
import { MenuOutlined, CloseOutlined, RightOutlined } from '@ant-design/icons'
import { ROLE_ADMIN } from '~/constants'

const { SubMenu } = Menu
const { Sider } = Layout

interface MenuItem {
  key: string
  title: string
  icon?: JSX.Element
  href?: string
  submenu?: MenuItem[]
}

const menus: MenuItem[] = [
  {
    key: '(Dashboard)',
    title: 'Dashboard',
    icon: <Svg name={'dashboard'} fill={'var(--primary-color)'} />,
    href: '/admin',
  },
  {
    key: '(User)(Policy)',
    title: 'Manager Users',
    icon: <Svg name={'users'} fill={'var(--primary-color)'} />,
    submenu: [
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
    ],
  },
  {
    key: '(Staff)(Group)',
    title: 'Manager Staffs',
    icon: <Svg name={'users'} fill={'var(--primary-color)'} />,
    submenu: [
      {
        key: '(Staff)',
        title: 'Staffs',
        href: '/admin/users',
      },
      {
        key: '(Group)',
        title: 'Groups',
        href: '/admin/policies',
      },
    ],
  },
  {
    key: '(Profile)',
    title: 'Profile Me',
    icon: <Svg name={'avatar'} fill={'var(--primary-color)'} />,
    href: '/admin/profile',
    submenu: [
      {
        key: '(Profile)(Infor)',
        title: 'Information',
        href: '/admin/profile/infor',
      },
      {
        key: '(Profile)(Logout)',
        title: 'Logout',
        href: '/admin/profile/logout',
      },
    ],
  },
]

const CustomSider = ({}) => {
  const router = useRouter()
  const currentPath = router.pathname
  const { isTablet } = useDevice()
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { settings } = useSettings()
  const isAdmin = ROLE_ADMIN.includes(currentUser?.role)

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

  const getSelectedSubmenu = useCallback(() => {
    const keys: { [key: string]: () => string } = {
      '/admin/users': function () {
        return '(User)(Policy)'
      },
      '/admin/policies': function () {
        return '(User)(Policy)'
      },
      default: function () {
        return '()'
      },
    }

    return (
      keys[currentPath] ||
      keys[`/admin${currentPath}`] ||
      keys['default']
    )()
  }, [currentPath])

  useEffect(() => {
    setOpenKeys([getSelectedSubmenu()])
  }, [currentPath, getSelectedSubmenu])

  const checkShowTab = (key: string) => {
    const values = [
      { action: 'read', subject: 'Dashboard' },
      ...(currentUser?.policy?.permissions || []),
    ]

    return (
      isAdmin ||
      values.some(
        (abl) => abl.action === 'read' && key.includes(`(${abl.subject})`),
      )
    )
  }

  const renderMenus: () => any[] = () => {
    return adminMenus.map((item: any) => {
      const showTab = checkShowTab(item.key)

      if (!isAdmin && !showTab) {
        return null
      }

      return item?.submenu
        ? {
            label: (
              <span className={`text-[14px] ml-[10px] inline-block text-black`}>
                {item.title}
              </span>
            ),
            key: item.key,
            ...(item.icon && { icon: item.icon }),
            onTitleClick: ({ key }: any) =>
              setOpenKeys([...(openKeys?.[0] === key ? [] : [key])]),
            children: item.submenu
              ?.filter((i: any) => !!i?.title)
              .map((subItem: any) => {
                const showSubItem = isAdmin ? checkShowTab(subItem.key) : true
                if (!showSubItem) {
                  return null
                } else {
                  return {
                    label: (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                          className={`hover:text-primary-color ml-[4px] text-[14px] inline-block ${
                            currentPath === subItem.href
                              ? 'text-primary-color'
                              : 'text-black'
                          }`}
                        >
                          {subItem.title}
                        </span>
                      </div>
                    ),
                    key: `${subItem.href}`,
                    onClick: () => {
                      if (subItem.key === '(Profile)(Logout)') return logout()
                      subItem.href && router.push(subItem.href)
                    },
                    className: `${
                      currentPath === subItem.href
                        ? 'selected-submenu-item'
                        : ''
                    }`,
                  }
                }
              }),
          }
        : {
            label: (
              <span
                className={`hover:text-primary-color text-[14px] ${
                  currentPath === item.href
                    ? 'text-[color:var(--primary-color)] selected-menu-item'
                    : 'text-black'
                } ml-[10px] inline-block`}
              >
                {item.title}
              </span>
            ),
            key: item.key,
            className: currentPath?.includes(item.href || '#')
              ? '!bg-[#0291471a] !text-primary-color'
              : '',
            onClick: () => item.href && router.push(item.href),
            ...(item.icon && {
              icon: item.icon,
            }),
          }
    })
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isMobileMenuOpen])

  return isAuthenticated ? (
    <>
      {!isTablet ? (
        <div className="!w-[250px] !bg-white">
          <Sider className={'!bg-white !w-full !h-full'}>
            <div
              className={
                'fixed left-0 top-0 bottom-0 hover:overflow-auto w-[250px]'
              }
            >
              <Link href="/">
                <div className={'px-5 flex cursor-pointer p-[10px]'}>
                  <Image
                    preview={false}
                    alt="img-logo"
                    src={'/assets/img/icon-azcpos.png'}
                  />
                </div>
              </Link>
              <Menu mode="inline" openKeys={openKeys} items={renderMenus()} />
            </div>
          </Sider>
        </div>
      ) : (
        <>
          <div className="flex p-[10px] !bg-white">
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
                  src={'/assets/img/icon-azcpos.png'}
                  width={150}
                  height={50}
                />
              </div>
            )}
          </div>
          <nav
            className={`fixed w-full h-full top-[70px] bottom-0 ${
              !isMobileMenuOpen ? 'left-[-1000px]' : 'left-[0px]'
            } z-20 border border-t-[1px] transition-all ease-in duration-600
            `}
          >
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className={`fixed top-[70px]  bottom-0 ${
                !isMobileMenuOpen ? 'right-[-20px]' : 'w-[20%] right-0'
              } transition-all ease-in bg-black opacity-30 z-10`}
            />
            <div className="bg-white w-[80%] h-screen">
              <Menu
                mode="inline"
                openKeys={openKeys}
                items={renderMenus()}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </nav>
        </>
      )}
    </>
  ) : (
    <></>
  )
}

CustomSider.menus = menus
export default CustomSider
