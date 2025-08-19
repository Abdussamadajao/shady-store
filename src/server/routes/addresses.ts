import { Hono } from "hono";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { requireAuth, type AuthenticatedUser } from "../middleware/auth.js";

type AddressContext = {
  Variables: {
    user: AuthenticatedUser;
  };
};

const addressesRouter = new Hono<AddressContext>();
const prisma = new PrismaClient();

// Get all addresses for current user
addressesRouter.get("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return c.json({ addresses });
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get single address by ID
addressesRouter.get("/:id", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const addressId = c.req.param("id");

    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!address) {
      return c.json({ error: "Address not found" }, 404);
    }

    return c.json({ address });
  } catch (error) {
    console.error("Error fetching address:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create new address
addressesRouter.post("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();

    // Validate required fields
    const {
      type,
      firstName,
      lastName,
      address1,
      city,
      state,
      postalCode,
      country,
      phone,
    } = body;

    if (
      !type ||
      !firstName ||
      !lastName ||
      !address1 ||
      !city ||
      !state ||
      !postalCode ||
      !country ||
      !phone
    ) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // If this is set as default, unset other default addresses of the same type
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          type: type,
        },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        type,
        firstName,
        lastName,
        company: body.company || null,
        address1,
        address2: body.address2 || null,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: body.isDefault || false,
      },
    });

    return c.json({ address: newAddress }, 201);
  } catch (error) {
    console.error("Error creating address:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update address
addressesRouter.put("/:id", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const addressId = c.req.param("id");
    const body = await c.req.json();

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return c.json({ error: "Address not found" }, 404);
    }

    // If this is set as default, unset other default addresses of the same type
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          type: existingAddress.type,
          id: { not: addressId },
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        type: body.type || existingAddress.type,
        firstName: body.firstName || existingAddress.firstName,
        lastName: body.lastName || existingAddress.lastName,
        company:
          body.company !== undefined ? body.company : existingAddress.company,
        address1: body.address1 || existingAddress.address1,
        address2:
          body.address2 !== undefined
            ? body.address2
            : existingAddress.address2,
        city: body.city || existingAddress.city,
        state: body.state || existingAddress.state,
        postalCode: body.postalCode || existingAddress.postalCode,
        country: body.country || existingAddress.country,
        phone: body.phone || existingAddress.phone,
        isDefault:
          body.isDefault !== undefined
            ? body.isDefault
            : existingAddress.isDefault,
        updatedAt: new Date(),
      },
    });

    return c.json({ address: updatedAddress });
  } catch (error) {
    console.error("Error updating address:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete address
addressesRouter.delete("/:id", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const addressId = c.req.param("id");

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return c.json({ error: "Address not found" }, 404);
    }

    // Delete the address
    await prisma.address.delete({
      where: { id: addressId },
    });

    return c.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Set address as default
addressesRouter.patch("/:id/default", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const addressId = c.req.param("id");

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return c.json({ error: "Address not found" }, 404);
    }

    // Unset other default addresses of the same type
    await prisma.address.updateMany({
      where: {
        userId: user.id,
        type: existingAddress.type,
        id: { not: addressId },
      },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        isDefault: true,
        updatedAt: new Date(),
      },
    });

    return c.json({ address: updatedAddress });
  } catch (error) {
    console.error("Error setting default address:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get addresses by type (shipping, billing, or both)
addressesRouter.get("/type/:type", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const addressType = c.req.param("type");

    // Validate address type
    const validTypes = ["SHIPPING", "BILLING", "BOTH"];
    if (!validTypes.includes(addressType.toUpperCase())) {
      return c.json({ error: "Invalid address type" }, 400);
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: user.id,
        type: addressType.toUpperCase() as any,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return c.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses by type:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default addressesRouter;
