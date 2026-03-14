const { PrismaClient } = require('@prisma/client');

// Singleton pattern to ensure only one Prisma Client instance
const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '&statement_cache_size=0'
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;