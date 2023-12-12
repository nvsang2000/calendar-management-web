import { Layout, Popover } from 'antd'
import { useRouter } from 'next/router'
import { useAuth } from '~/hooks'
import Svg from './Svg'

const { Header } = Layout

const CustomHeader: React.FC = ({}) => {
  const { currentUser, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <Header
        className={'flex h-[115px] items-center !bg-[color:var(--green)]'}
      >
        <div
          onClick={() => router.push('/')}
          className={'cursor-pointer text-[36px] font-bold text-white'}
        >
          Foodmap <span className={'font-light'}>Insights</span>
        </div>
      </Header>
    )
  } else {
    return (
      <div
        className={
          'flex h-[68px] w-full justify-between rounded-br-[10px] border-[1px] bg-white p-[25px] pt-[10px]'
        }
      >
        <div></div>
        <div>
          <div className={'flex flex-row items-center gap-5'}>
            <div className={'flex flex-col text-right'}>
              <div
                className={
                  'text-[18px] font-medium leading-[21px] text-[color:var(--black)]'
                }
              >
                {currentUser?.displayName} /{' '}
                {currentUser?.role === 'admin'
                  ? 'Admin'
                  : currentUser?.policy?.name}
              </div>
              <div
                className={
                  'text-[14px] font-medium leading-[16px] text-[color:var(--light-gray)]'
                }
              >
                {currentUser?.email}
              </div>
            </div>
            <div className={'flex cursor-pointer flex-row items-center gap-3'}>
              <Popover
                placement="bottomRight"
                title={
                  <div className={'mx-[8px] text-[15px]'}>
                    Thiết lập tài khoản
                  </div>
                }
                content={
                  <div>
                    <div
                      className={
                        'mx-[8px] flex cursor-pointer items-center gap-[4px] hover:text-primary-color'
                      }
                      onClick={() => router.push('/admin/account')}
                    >
                      <div className={'flex h-[30px] w-[30px] items-center'}>
                        <Svg
                          name={'users'}
                          width={20}
                          height={20}
                          fill={'var(--black)'}
                        />
                      </div>
                      Thông tin cá nhân
                    </div>
                    <div
                      className={
                        'mx-[8px] flex cursor-pointer items-center gap-[4px] hover:text-primary-color'
                      }
                      onClick={logout}
                    >
                      <div className={'flex h-[30px] w-[30px] items-center'}>
                        <Svg
                          name={'exit'}
                          width={24}
                          height={24}
                          fill={'var(--black)'}
                        />
                      </div>
                      Đăng xuất
                    </div>
                  </div>
                }
                trigger="click"
                className={'flex cursor-pointer flex-row items-center gap-3'}
              >
                <Svg name={'avatar'} width={40} height={40} />
                <Svg name={'expand-down'} width={14} height={7} />
              </Popover>
            </div>
            <div className={'cursor-pointer'}>
              <Svg name={'notify-true'} width={24} height={24} />
            </div>
            <div className={'cursor-pointer'} onClick={logout}>
              <Svg name={'exit'} width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomHeader
