import { NextRequest } from "next/server";

export function isVercelCron(request: NextRequest): boolean {
  const cronSecret = request.headers.get("x-vercel-cron-secret");
  const validSecret = process.env.CRON_SECRET;

  return Boolean(cronSecret && validSecret && cronSecret === validSecret);
}
