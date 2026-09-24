import { startMediaWorker } from "./lib/jobs/compress-worker";

console.log("[Worker] Menjalankan proses worker BullMQ untuk kompresi media...");

const worker = startMediaWorker();

const shutdown = async (signal: string) => {
  console.log(`[Worker] Menerima sinyal ${signal}, menutup worker secara graceful...`);
  await worker.close();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
