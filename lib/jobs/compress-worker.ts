import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";

export const MEDIA_QUEUE_NAME = "media-processing";

export function getRedisConnection(): IORedis {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
  });
}

export function createMediaQueue(): Queue {
  const connection = getRedisConnection();
  return new Queue(MEDIA_QUEUE_NAME, { connection });
}

export interface MediaProcessingJobData {
  mediaId: string;
  type: "photo" | "video";
  url: string;
}

export function startMediaWorker(): Worker {
  const connection = getRedisConnection();

  const worker = new Worker<MediaProcessingJobData>(
    MEDIA_QUEUE_NAME,
    async (job) => {
      console.log(`[Worker] Memproses job ${job.id} (${job.name}) untuk media:`, job.data);
      
      const { mediaId, type, url } = job.data;
      
      if (type === "photo") {
        console.log(`[Worker] Mengompresi foto ID: ${mediaId} (${url})...`);
        // Simulasi kompresi foto / generate thumbnail
      } else if (type === "video") {
        console.log(`[Worker] Mengompresi/transcoding video ID: ${mediaId} (${url})...`);
        // Simulasi kompresi video / transcoding ffmpeg
      }

      return { status: "completed", mediaId, timestamp: new Date().toISOString() };
    },
    { connection }
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} (Media ID: ${job.data.mediaId}) telah selesai.`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} gagal:`, err.message);
  });

  return worker;
}
