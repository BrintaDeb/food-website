import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import '@/types/auth';

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET || 'curry-craft-indian-gourmet-secret-key-production-32-chars',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/admin/login'
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@currycraft.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const validEmail = process.env.ADMIN_EMAIL || 'admin@currycraft.com';
        const validPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

        // Also accept legacy admin credential for backwards compatibility
        const isLegacyAdmin =
          credentials.email === 'admin@burgers.com' && credentials.password === 'Admin@12345';

        const isStandardAdmin =
          credentials.email.toLowerCase() === validEmail.toLowerCase() &&
          credentials.password === validPassword;

        if (isStandardAdmin || isLegacyAdmin) {
          return {
            id: 'admin-curry-01',
            name: 'Master Chef Admin',
            email: credentials.email,
            role: 'ADMIN'
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as 'ADMIN' | 'CUSTOMER') || 'ADMIN';
        session.user.id = (token.id as string) || 'admin-curry-01';
      }
      return session;
    }
  }
};
