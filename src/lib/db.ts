import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg-worker';

// Lazy singleton — one client per isolate (Edge) or process (Node.js)
let _prisma: PrismaClient | undefined;

function createPrismaClient(): PrismaClient {
  // @prisma/adapter-pg-worker uses cloudflare:sockets (TCP) — works in Edge runtime
  // and also falls back correctly in Node.js for local dev.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = createPrismaClient();
  }
  return _prisma;
}

// Default export for backward-compat with existing `import { prisma } from '@/lib/db'` usage
export const prisma = (() => {
  // Use a Proxy so the client is instantiated lazily on first property access
  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      return (getPrisma() as any)[prop];
    },
  });
})();

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