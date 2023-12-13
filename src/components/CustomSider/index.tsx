import { Image, Layout, Menu } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useState, useEffect } from 'react'
import { useAuth, useDevice } from '~/hooks'
import Svg from '../Svg'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { ROLE_ADMIN } from '~/constants'

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
    icon: <Svg name={'ic_dashboard'} fill={'var(--primary-color)'} />,
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
    icon: <Svg name={'ic_group'} fill={'var(--primary-color)'} />,
    submenu: [
      {
        key: '(Staff)',
        title: 'Staffs',
        href: '/admin/staffs',
      },
      {
        key: '(Group)',
        title: 'Groups',
        href: '/admin/groups',
      },
    ],
  },
  {
    key: '(Form)',
    title: 'Manager Forms',
    icon: <Svg name={'ic_form'} fill={'var(--primary-color)'} />,
    href: '/admin/forms',
  },
  {
    key: '(Calendar)',
    title: 'Manager Calendars',
    icon: <Svg name={'ic_calendar'} fill={'var(--primary-color)'} />,
    href: '/admin/calendars',
  },
  {
    key: '(Profile)',
    title: 'Profile Me',
    icon: <Svg name={'ic_avatar'} fill={'var(--primary-color)'} />,
    href: '/admin/profile',
    submenu: [
      {
        key: '(Profile)(Infor)',
        title: 'Information',
        href: '/admin/profile',
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAdmin = ROLE_ADMIN.includes(currentUser?.role)

  const adminMenus: any[] = [
    ...menus,
    // ...(isAdmin ? listMenuAdmin : []),
  ].filter((i: any) => i) as MenuItem[]

  const getSelectedSubmenu = useCallback(() => {
    const keys: { [key: string]: () => string } = {
      '/admin/users': function () {
        return '(User)(Policy)'
      },
      '/admin/policies': function () {
        return '(User)(Policy)'
      },
      '/admin/staffs': function () {
        return '(Staff)(Group)'
      },
      '/admin/groups': function () {
        return '(Staff)(Group)'
      },
      '/admin/profile': function () {
        return '(Profile)(Infor)'
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
              <span className={`ml-[10px] inline-block text-[14px] text-black`}>
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
                          className={`ml-[4px] inline-block text-[14px] hover:text-primary-color ${
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
                className={`text-[14px] hover:text-primary-color ${
                  currentPath === item.href
                    ? 'selected-menu-item text-[color:var(--primary-color)]'
                    : 'text-black'
                } ml-[10px] inline-block`}
              >
                {item.title}
              </span>
            ),
            key: item.key,
            className: currentPath?.includes(item.href || '#')
              ? '!text-primary-color'
              : '',
            onClick: () => item.href && router.push(item.href),
            ...(item.icon && {
              icon: item.icon,
            }),
          }
    })
  }

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
          <Sider className={'!h-full !w-full !bg-white'}>
            <div
              className={'fixed inset-y-0 left-0 w-[250px] hover:overflow-auto'}
            >
              <Link href="/">
                <div className={'flex cursor-pointer p-[10px] px-5'}>
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
          <div className="flex !bg-white p-[10px]">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <CloseOutlined className="text-xl" />
              ) : (
                <MenuOutlined className="text-xl" />
              )}
            </button>
            {isTablet && (
              <div className="ml-[20px] flex justify-center">
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
            className={`fixed bottom-0 top-[70px] h-full w-full ${
              !isMobileMenuOpen ? 'left-[-1000px]' : 'left-[0px]'
            } duration-600 z-20 border border-t-[1px] transition-all ease-in
            `}
          >
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className={`fixed bottom-0  top-[70px] ${
                !isMobileMenuOpen ? 'right-[-20px]' : 'right-0 w-[30%]'
              } z-10 bg-black opacity-30 transition-all ease-in`}
            />
            <div className="h-screen w-[70%] bg-white">
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
