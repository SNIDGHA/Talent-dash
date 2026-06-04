import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as any;

let prismaInstance: PrismaClient;

// Check if we are running in an edge environment (Cloudflare Workers/Pages Functions)
const isEdge = process.env.NEXT_RUNTIME === 'edge' || typeof (globalThis as any).EdgeRuntime !== 'undefined';

if (isEdge) {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter });
} else {
  prismaInstance =
    globalForPrisma.prisma ||
    new PrismaClient();

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;

// Helper to recursively serialize BigInt values to Numbers for JSON responses
export function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return Number(obj);
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    // If it's a Decimal object (from Prisma/decimal.js), convert to number
    if (obj.constructor && obj.constructor.name === 'Decimal') {
      return Number(obj);
    }
    const serialized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        serialized[key] = serializeBigInt(obj[key]);
      }
    }
    return serialized;
  }
  return obj;
}