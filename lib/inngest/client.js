import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "finance-platform",
  name: "Finance Platform",

  // 🔐 REQUIRED for Vercel + Inngest sync
  signingKey: process.env.INNGEST_SIGNING_KEY,

  // Optional retry logic (this is fine)
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // 1s, 2s
    maxAttempts: 2,
  }),
});
