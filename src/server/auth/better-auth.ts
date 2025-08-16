import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role } from "../../../generated/prisma/index.js";
import prisma from "./prisma.js";
import { betterAuthEmails, sendVerificationEmail } from "../email/email.js";
import {
  jwt,
  bearer,
  customSession,
  magicLink,
  twoFactor,
} from "better-auth/plugins";
import { schema } from "./config.js";
import { hooks } from "./hooks.js";

const OTP_EXPIRY = {
  minutes: {
    sixty: { value: 60 * 60 }, // 60 minutes in seconds
  },
};

const project = {
  appName: "Pick Bazar",
};

const isProd = process.env["NODE_ENV"] === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  appName: project.appName,
  baseURL: process.env["BASE_URL"] || "http://localhost:3001",

  databaseHooks: { user: hooks.user() },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      await sendVerificationEmail(user.email, url, token);
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({
      user,
      url,
      token,
    }: {
      user: { email: string };
      url: string;
      token: string;
    }) => {
      await sendVerificationEmail(user.email, url, token);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env["GOOGLE_CLIENT_ID"]!,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"]!,
    },
  },

  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      avatar: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: Role.CUSTOMER,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
    deleteUser: { enabled: true },
  },

  session: {
    ...schema.sessions,
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  verification: { ...schema.verification },
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 100, // 100 requests per minute
  },
  plugins: [
    // Magic Link Plugin
    magicLink({
      expiresIn: OTP_EXPIRY.minutes.sixty.value,
      sendMagicLink: betterAuthEmails.sendMagicLinkEmail,
    }),

    // JWT Plugin
    jwt({
      schema: {
        jwks: { ...schema.jwks },
      },
    }),

    customSession(async ({ user, session }) => {
      console.log("Custom session called:", {
        userId: user?.id,
        sessionId: session?.id,
      });
      return {
        session: session,
        user: {
          ...user,
        },
      };
    }),
    twoFactor({
      issuer: project.appName,
      otpOptions: {
        sendOTP: betterAuthEmails.sendTwoFactorAuthEmail,
      },
      schema: {
        user: schema.twoFactor.user,
        twoFactor: schema.twoFactor.core,
      },
    }),
    bearer(),
  ],

  advanced: {
    cookiePrefix: "pick-bazar",
    crossSubDomainCookies:
      isProd && process.env["BASE_URL"]
        ? { enabled: true, domain: process.env["BASE_URL"] }
        : { enabled: false },
    useSecureCookies: isProd,
  },
} satisfies BetterAuthOptions);
