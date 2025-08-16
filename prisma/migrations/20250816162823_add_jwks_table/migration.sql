-- CreateTable
CREATE TABLE "public"."jwks" (
    "id" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jwks_pkey" PRIMARY KEY ("id")
);
