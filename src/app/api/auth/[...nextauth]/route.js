import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { connectToDB } from "@/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],

  session: {
    jwt: true,
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      await connectToDB();
      const mongodbUser = await User.findOne({ email: session.user.email });
      
      if (mongodbUser) {
        session.user.id = mongodbUser._id.toString();
        session.user = { ...session.user, ...mongodbUser._doc };
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id.toString();
        token.email = user.email;
      }

      return token;
    },
  },
});

export { handler as GET, handler as POST };
