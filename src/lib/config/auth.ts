// import  { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {  NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import dbConnect, { User } from './mongodb';
import bcrypt from 'bcrypt';

const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID as string
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET as string
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: `${GOOGLE_CLIENT_ID}`,
      clientSecret: `${GOOGLE_CLIENT_SECRET}`,
 
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) {
          return null;
        }
        await dbConnect();
        const user = await User.findOne({ name: credentials.name });
        if (!user) {
          return null;
        }
        if (!user.password) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        if (user.status === 'banned') {
          return null;
        }
        return { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status };
      },
    }),
  ],
 
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          status: token.status,
        };
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.status = user.status;
      }
      // Google OAuth: create user if not exists
      if (account && account.provider === 'google' && profile && token.email) {
        await dbConnect();
        let dbUser = await User.findOne({ email: token.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: token.name,
            email: token.email,
            image: profile.picture,
            role: 'user',
            status: 'active',
          });
        }
        token.id = dbUser._id;
        token.role = dbUser.role;
        token.status = dbUser.status;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
// export default authOptions
export default NextAuth(authOptions);
export const {auth}=NextAuth(authOptions);