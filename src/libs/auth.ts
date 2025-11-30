import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { userTypes } from '@/types/app/userTypes';
import type { NextAuthOptions } from 'next-auth';

const baseUrl = process.env.NEXT_PUBLIC_APP_EFICTA;
interface UserResponse {
  token: string;
  user: userTypes;
  expireAt: string;
}

/**
 * NextAuth configuration with enhanced error handling and token management
 *
 * Features:
 * - Friendly error messages for CredentialsSignin errors
 * - Access token storage in session and client-side cookies
 * - Proper error handling with translated messages
 *
 * The access token from the login API response is:
 * 1. Stored in the JWT token for server-side access
 * 2. Included in the session for client-side access
 * 3. Saved as 'access-token' cookie on successful login (handled in LoginForm)
 * 4. Cleared on logout (handled in custom signOut utility)
 */

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw new Error(
              'Invalid email or password. Please check your credentials and try again.',
            );
          }

          const data = (await response.json()) as UserResponse;
          return data;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error(
            'Invalid email or password. Please check your credentials and try again.',
          );
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // 1 hour
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // For credentials provider, user contains the API response
        if ('token' in user) {
          // Save the token in the JWT token
          token.accessToken = user.token;

          // Save user data
          token.user = user.user;
        } else {
          // For OAuth providers
          token.user = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Save user data in session
      session.user = token.user;
      // Save token in session so it can be accessed in client
      session.accessToken = token.accessToken;

      return session;
    },
  },
};
