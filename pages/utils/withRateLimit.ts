import { Redis } from '@upstash/redis';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';

export const RATE_LIMIT_TIME = 60 * 1000;
export const RATE_LIMIT_REQUESTS = 10;

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

function withRateLimit(handler: NextApiHandler) {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    const now = new Date();
    const ip = requestIp.getClientIp(request);

    const userRequests = (await redis.smembers(ip)).sort();

    if (userRequests.length === RATE_LIMIT_REQUESTS) {
      const firstRequest = new Date(userRequests[0]);

      if (now.getTime() - firstRequest.getTime() > RATE_LIMIT_TIME) {
        await redis.srem(ip, userRequests[0]);
      } else {
        response.status(429).send();
        return;
      }
    }

    await redis.sadd(ip, now.toISOString());
    await handler(request, response);
  }
}

export default withRateLimit;