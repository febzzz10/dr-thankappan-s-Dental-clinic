declare global {
  interface Env {
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    JWT_SECRET: string;
    KV_RATE_LIMIT?: KVNamespace;
    R2_PUBLIC_URL?: string;
  }

  interface R2Bucket {
    createSignedUrl(
      method: string,
      key: string,
      options: {
        signedExpiry: Date;
        allowedMethods?: string[];
        minBound?: { contentLength: number };
        maxBound?: { contentLength: number };
        customConditions?: Record<string, string>[];
      },
    ): Promise<string>;
  }
}

export {};
