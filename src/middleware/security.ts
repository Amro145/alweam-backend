import { cors } from 'hono/cors';

export const getCorsMiddleware = () => {
  return cors({
    origin: (origin, c) => {
      const allowed = c.env.FRONTEND_URL;
      if (allowed && origin === allowed) {
        return origin;
      }
      return null;
    },
    allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  });
};
