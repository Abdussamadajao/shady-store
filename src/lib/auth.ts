import type { ClientOptions } from "better-auth";
import { createAuthClient } from "better-auth/client";
import {
  customSessionClient,
  inferAdditionalFields,
  jwtClient,
  magicLinkClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";

export const auth = createAuthClient({
  plugins: [
    magicLinkClient(),
    customSessionClient(),
    jwtClient(),
    usernameClient(),
    twoFactorClient(),
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
          defaultValue: "   ",
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
    onError: (ctx) => {
      console.log("Error message", ctx.error.message, ctx.error.cause);
    },
  },
} satisfies ClientOptions);
