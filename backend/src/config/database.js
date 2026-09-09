/**
 * =========================================================
 * PRISMA CLIENT
 * =========================================================
 *
 * A single shared client for the whole process.
 *
 * Why the globalThis dance: nodemon reloads the module graph
 * on every file save. Without the guard each reload created a
 * brand new PrismaClient and a brand new connection pool,
 * which is a common cause of "too many connections" against
 * Neon and of the dashboard slowing down the longer the dev
 * server has been running.
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

const createPrismaClient = () => {
  const client = new PrismaClient({
    log: isDevelopment
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' },
        ]
      : [{ emit: 'stdout', level: 'error' }],
  });

  // Surface slow queries in development so regressions are
  // obvious while working, without spamming the console.
  if (isDevelopment) {
    const slowQueryThresholdMs = Number(process.env.SLOW_QUERY_MS || 300);

    // Wrapped: attaching a query listener asks Prisma to
    // resolve its query engine, which throws if the client was
    // generated for a different platform. That is a developer
    // environment problem and should not stop the server from
    // booting and reporting it cleanly.
    try {
      client.$on('query', (event) => {
        if (event.duration >= slowQueryThresholdMs) {
          console.warn(`[slow query] ${event.duration}ms  ${event.query.slice(0, 160)}`);
        }
      });
    } catch (error) {
      console.warn('Could not attach the slow-query logger:', error.message);
    }
  }

  return client;
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.__mmmicsPrisma ?? createPrismaClient();

if (isDevelopment) {
  globalForPrisma.__mmmicsPrisma = prisma;
}

/**
 * Opens the pool at boot instead of on the first request.
 * Without this the very first dashboard load pays the full
 * TLS + handshake cost to Neon, which is what makes the
 * first paint feel slow.
 */
export const connectDatabase = async () => {
  const startedAt = Date.now();
  await prisma.$connect();
  return Date.now() - startedAt;
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

export default prisma;
