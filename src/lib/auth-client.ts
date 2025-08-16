import type { ClientOptions } from "better-auth";
import {
  customSessionClient,
  inferAdditionalFields,
  jwtClient,
  twoFactorClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    customSessionClient(),
    jwtClient(),
    twoFactorClient(),
    magicLinkClient(),
    inferAdditionalFields({
      user: {
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
          defaultValue: "CUSTOMER",
        },
        isActive: {
          type: "boolean",
          required: false,
          defaultValue: true,
        },
      },
    }),
  ],
  fetchOptions: {
    credentials: "include",
    onError: (ctx) => {
      console.log("Error message", ctx.error.message, ctx.error.cause);
    },
  },
} satisfies ClientOptions);
