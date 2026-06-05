import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testWithSslAdapter() {
  console.log('Testing connection with adapter and SSL...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.company.count();
    console.log('Success with SSL adapter! Company count:', count);
  } catch (err) {
    console.error('Failed with SSL adapter:', err);
  } finally {
    await pool.end();
  }
}

testWithSslAdapter();
