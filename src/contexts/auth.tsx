import { useState, createContext } from 'react'
import { Ability } from '@casl/ability'
import { loginApi, logoutApi, whoAmI } from '~/services/apis'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import { setToken } from '~/utils/axios'
import Cookies from 'js-cookie'
import { parseSafe } from '~/helpers'
import { ROLE_ADMIN } from '~/constants'

interface LoginCredential {
  username: string
  password: string
  remember?: boolean
}

interface CurrentUser {
  id: number
  role?: string
  policy?: {
    permissions?: any[]
  }
}

interface AuthContextInterface {
  isAuthenticated: boolean
  accessToken?: string
  currentUser?: CurrentUser | any
  loading: boolean
  abilities?: any
  isCurrentUserA: (roleName: string) => boolean
  login: (payload: LoginCredential) => void
  logout: () => void
  setCurrentUser: (currentUser: CurrentUser) => void
}

const defaultContext: AuthContextInterface = {
  isAuthenticated: false,
  accessToken: '',
  currentUser: undefined,
  loading: false,
  abilities: new Ability(),
  isCurrentUserA: () => false,
  login: (payload: LoginCredential) => payload,
  logout: () => {},
  setCurrentUser: (currentUser: any) => currentUser,
}

export const AuthContext = createContext(defaultContext)

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)

  const login = async (payload: LoginCredential) => {
    setLoading(true)
    try {
      const result = await loginApi(payload)
      const accessToken: string = result?.data || {}
      Cookies.set('accessToken', accessToken, { expires: 2 })
      await getProfile()
    } catch (e: any) {
      console.log(e.message)
      setLoading(false)
    }
  }

  const getProfile = async () => {
    setLoading(true)
    const accessToken = Cookies.get('accessToken')

    try {
      setToken(accessToken)
      const { data } = await whoAmI()

      if (data) {
        if (data?.policy?.permissions) {
          data.policy.permisisions = data.policy.permisisions?.map((i: any) => {
            const parsed = parseSafe(i)
            if (parsed?.fields?.length === 0) {
              delete parsed.fields
            }

            return parsed
          })
        }

        setCurrentUser(data)
        router.push('/')
      }
    } catch (e: any) {
      console.log(e.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage?.clear?.()
    router.push('/login')
    setLoading(true)
    return logoutApi()
      .then((res: any) => res)
      .catch((err: any) => err)
      .finally(() => {
        setCurrentUser(undefined)
        Cookies.remove('accessToken', { path: '' })
        setLoading(false)
      })
  }

  const abilities = new Ability(
    ROLE_ADMIN.includes(currentUser?.role)
      ? [{ action: 'manage', subject: 'all' }]
      : currentUser?.policy?.permissions.map((per: any) => ({
          ...per,
          fields: per?.fields?.length > 0 ? per.fields : undefined,
        })),
  )

  const isCurrentUserA = (roleName: string) => {
    return (
      currentUser?.policy?.name === roleName ||
      ROLE_ADMIN.includes(currentUser?.role)
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !isEmpty(currentUser),
        abilities,
        currentUser,
        setCurrentUser: (data: any) => {
          setCurrentUser(data)
        },
        isCurrentUserA,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
