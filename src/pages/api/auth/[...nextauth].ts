import Cookies from 'js-cookie'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { setCookie } from 'nookies'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_ENV_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_ENV_CLIENT_SECRET as string,
      authorization: {
        request: (contex) => {
          console.log('contex', contex)
        },
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
        Cookies.set('account', account, { expires: 2 })
      }
      return { token, account }
    },
    async redirect({ url }: any) {
      return url
    },
    async session({ session, token, user }: any) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    },
  },
}
export default NextAuth(authOptions)
