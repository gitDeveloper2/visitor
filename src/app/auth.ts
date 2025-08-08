import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { createBetterAuthAdapter } from "@fuma-comment/server/adapters/better-auth";
import { customSession } from "better-auth/plugins";
import { dbObject } from "../lib/mongodb";
// import { db } from "@features/shared/lib/mongodb";
// import {
//   sendResetPasswordEmail,
//   sendVerificationEmail,
//   sendWelcomeEmail,
// } from "@features/shared/utils/email";
// import { encryptVotingToken } from "@features/shared/utils/encryption";

export const auth = betterAuth({
  database: mongodbAdapter(dbObject),
  trustedOrigins: (process.env.NODE_ENV === "production")
  ? ["https://mot-better-auth-driver.vercel.app"]
  : [
      "http://localhost:3000", // dev
      process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
      "https://mot-better-auth-driver.vercel.app", // fallback
    ].filter(Boolean) as string[],
  emailAndPassword: {
    enabled: true,
    // autoSignIn: true,
    // requireEmailVerification: true,
    // sendResetPassword: async ({ user, url }, request) => {
    //   await sendResetPasswordEmail({ to: user.email, url });
    // },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: (profile) => ({
        kind:"github",
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        githubUsername: profile.login,
        socialAccounts: [
          `github:${profile.login}`,
          `url:https://github.com/${profile.login}`,
        ],
      }),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => ({
        kind: "google",
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture,
        socialAccounts: [],
      }),
    },
    
  },

  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url }, request) => {
  //     await sendVerificationEmail({ to: user.email, url });
  //   },
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  // },

  user: {
    additionalFields: {
      avatarUrl: { type: "string", input: false },
      githubUsername: { type: "string", input: false },
      kind: { type: "string", input: false },

      pro: { type: "boolean", defaultValue: false, input: false },
      role: { type: "string", defaultValue: "user", input: false },
      suspended: { type: "boolean", defaultValue: false, input: false },
      socialAccounts: {
        type: "string[]", // must be a flat string array
        defaultValue: [],
        input: false,
      },
    },  
  },

  session: {
    additionalFields: {
      voteToken: { type: "string", input: false },
    },
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 * 60, // 5 hours
    },
  },
  // events: {
  //   async onSignup({ user, provider }) {
  //   console.log("sending mail",user)
  //       await sendWelcomeEmail({
  //         to: user.email,
  //         name: user.name ?? "there",
  //       });
      
  //   },
  // },



   // Enrich only email signups
   databaseHooks: {
    user: {
      create: {
     
        before: async (user, ctx) => {
          // await sendWelcomeEmail({
          //   to: user.email,
          //   name: user.name ?? "there",
          // });
          const u = user as typeof user & { kind?: string };
        
          if (!u.kind) {
            return {
              data: {
                ...u,
                kind: "email",
                role: "user",
                pro: false,
                suspended: false,
                githubUsername: null,
                avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
                  u.name ?? "user"
                )}`,
                socialAccounts: [],
              },
            };
          }
         
          return { data: u };
        }
        
      },
    },
  },  

  
  plugins: [
    customSession(async ({ user, session }) => {
      const u = user as typeof user & {
        avatarUrl?: string;
        githubUsername?: string;
        pro?: boolean;
        role?: string;
        suspended?: boolean;
        socialAccounts?: string[];
        kind:boolean;
      };

      // const votingToken = encryptVotingToken({
      //   sub: user.id,
      // });

      const decodedSocials = (u.socialAccounts ?? []).map((entry) => {
        const [type, value] = entry.split(":", 2);
        return { type, value };
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: u.avatarUrl ?? user.image ?? null,
          githubUsername: u.githubUsername ?? null,
          pro: u.pro ?? false,
          role: u.role ?? "user",
          suspended: u.suspended ?? false,
          socialAccounts: decodedSocials,
          kind:u.kind
        },
        session: {
          ...session,
          // votingToken,
        },
      };
    }),
  ],
});

// export const commentAuth = createBetterAuthAdapter(auth);
