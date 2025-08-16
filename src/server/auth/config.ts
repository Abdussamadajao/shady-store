// lib/better-auth-schema.ts
import { z } from "zod";

export const schema = {
  jwks: {
    modelName: "jwks",
    fields: {
      publicKey: "publicKey",
      privateKey: "privateKey",
      createdAt: "createdAt",
    },
  },

  // Two-Factor Authentication schemas
  twoFactor: {
    user: {
      modelName: "two_factors",
      fields: {
        twoFactorEnabled: "two_factor_enabled",
        backupCodes: "backup_codes",
        userId: "user_id",
      },
    },
    core: {
      modelName: "two_factors",
      fields: {
        backupCodes: "backup_codes",
        userId: "user_id",
        twoFactorEnabled: "two_factor_enabled",
      },
    },
  },

  // Magic Link schema

  // Custom session extensions
  sessions: {
    modelName: "sessions",
    fields: {
      token: "sessionToken",
      expiresAt: "expires",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
      userId: "userId",
    },
  },

  // User profile extensions

  // Rate limiting schema
  rateLimit: {
    window: z.number().default(900), // 15 minutes
    maxAttempts: z.number().default(5),
    blockDuration: z.number().default(900), // 15 minutes
  },

  // OAuth provider schemas
  oauth: {
    github: {
      clientId: z.string(),
      clientSecret: z.string(),
      scope: z.array(z.string()).default(["user:email"]),
    },

    google: {
      clientId: z.string(),
      clientSecret: z.string(),
      scope: z.array(z.string()).default(["openid", "email", "profile"]),
    },
  },

  verification: {
    modelName: "verificationtoken",
    fields: {
      expiresAt: "expiresAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      token: "token",
      identifier: "identifier",
    },
  },
};

// Export individual schemas for easy access
export const {
  jwks: jwksSchema,
  twoFactor: twoFactorSchema,
  sessions: sessionSchema,
  rateLimit: rateLimitSchema,
  oauth: oauthSchema,
  verification: verificationSchema,
} = schema;
