// Embedded PostgreSQL (PGlite) exposed over TCP so Prisma can connect,
// with no Docker and no system Postgres. Data persists in ./.pglite-data.
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const PORT = Number(process.env.PGLITE_PORT || 5434);
const HOST = "127.0.0.1";
const DATA_DIR = "./.pglite-data";

const db = await PGlite.create({ dataDir: DATA_DIR });
await db.waitReady;

// maxConnections enables the multiplexer so several Prisma connections
// (e.g. parallel queries in one page render) are served concurrently.
const server = new PGLiteSocketServer({ db, port: PORT, host: HOST, maxConnections: 30 });
await server.start();

console.log(`[pglite] embedded Postgres listening on ${HOST}:${PORT} (data: ${DATA_DIR})`);

const shutdown = async () => {
  try {
    await server.stop();
    await db.close();
  } finally {
    process.exit(0);
  }
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
