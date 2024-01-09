import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: AuthOptions = {
  secret: process.env.NEXT_PUBLIC_ENV_JWT_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_ENV_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_ENV_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope:
            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
        account.email = token.email
      }
      return { token, account, profile }
    },
    async session({ session, token, user }: any) {
      session.user = token?.token?.account
      return session
    },
  },
}
export default NextAuth(authOptions)
