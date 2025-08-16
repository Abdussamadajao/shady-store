import {
  GenericEndpointContext,
  User as BetterAuthUser,
  Session,
} from "better-auth";
import { Role } from "../../../generated/prisma";

type UserWithAddedFields = BetterAuthUser & {
  firstName?: string;
  lastName?: string;
  role?: Role;
  isActive?: boolean;
};

export const hooks = {
  user: () => ({
    create: {
      before: async (
        user: UserWithAddedFields,
        ctx?: GenericEndpointContext
      ) => {
        // Extract first and last name from the full name
        const nameParts = user?.name?.split(" ") || [];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        return {
          data: {
            ...user,
            firstName,
            lastName,
            role: ctx?.body?.role || Role.CUSTOMER,
            isActive: true,
          },
        };
      },
      after: async (user: UserWithAddedFields) => {
        // Any post-creation logic can go here
        console.log("User created:", user.id);
      },
    },
    update: {
      before: async (
        user: Partial<BetterAuthUser> & Record<string, unknown>
      ) => {
        // Ensure required fields are present
        return {
          data: {
            ...user,
            isActive: (user as any).isActive ?? true,
          },
        };
      },
      after: async (user: UserWithAddedFields) => {
        // Any post-update logic can go here
        console.log("User updated:", user.id);
      },
    },
  }),
};

export function plugins(repo?: any) {
  async function customSession({
    user,
    session,
  }: {
    user: BetterAuthUser;
    session: Session;
  }) {
    if (repo?.user?.get) {
      const customUser = await repo.user.get({ id: user.id });
      return { user: { ...customUser, ...user }, session };
    }
    return { user, session };
  }

  return { customSession };
}
