// import  { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {  NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

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

     
        const user = {
          name:"verochio",
          password:"?k8@vLySr!X_xQX"
        }

        if (user.password===credentials.password && credentials.name=== user.name){
          
          return { id: user.name }; // Adjust according to your user schema
        }

        return null;
      },
    }),
  ],
 
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // async redirect({url,baseUrl}){
    //   return baseUrl+"/jobs"
    // },
    async session({ session, user }) {
      if (user) {
        session.user = { name:user.name }; // Adjust according to your user schema
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.name;
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