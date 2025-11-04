import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 *
 * Creates a single shared PrismaClient instance to prevent connection pool exhaustion
 * in serverless environments like Vercel.
 *
 * Why this matters:
 * - Each PrismaClient instance creates its own connection pool
 * - In serverless, functions are frequently instantiated
 * - Multiple instances can exhaust database connections
 * - A singleton ensures all code shares one connection pool
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
