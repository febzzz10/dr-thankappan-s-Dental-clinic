declare global {
  interface Env {
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    JWT_SECRET: string;
    KV_RATE_LIMIT?: KVNamespace;
  }
}

export {};
