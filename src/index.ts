import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema';
import { AppEnv } from './core/types';
import { globalErrorHandler } from './middleware/error';
import { getCorsMiddleware } from './middleware/security';

import productRoutes from './routes/products';
import portfolioRoutes from './routes/portfolio';
import uploadRoutes from './routes/upload';
import authRoutes from './routes/auth';
import { bearerAuth } from 'hono/bearer-auth';
import { jwt } from 'hono/jwt';

const app = new Hono<AppEnv>();

// Global Middlewares
app.use('*', secureHeaders());
app.use('*', getCorsMiddleware());

app.use('*', async (c, next) => {
  // Inject database
  c.set('db', drizzle(c.env.DB, { schema }));
  await next();
});

// Unified Authentication Middleware
const adminAuth = (c: any, next: any) => {
  return jwt({ secret: c.env.JWT_SECRET, alg: 'HS256' })(c, next);
};

// Protect all mutating endpoints
app.use('/api/products/*', async (c, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(c.req.method)) return adminAuth(c, next);
  await next();
});

app.use('/api/portfolio/*', async (c, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(c.req.method)) return adminAuth(c, next);
  await next();
});

app.use('/api/upload-gift/*', async (c, next) => {
  // Protect all upload-gift routes if it's the admin listing or signature
  const isSignature = c.req.path.endsWith('/signature');
  const isOrdersList = c.req.method === 'GET' && c.req.path === '/api/upload-gift';
  if (isSignature || isOrdersList) return adminAuth(c, next);
  await next();
});

// Error handling
app.onError(globalErrorHandler);

// Health check
app.get('/', (c) => {
  return c.json({ status: 'ok', api: 'Al-Wiam Gift Store API', version: '1.0.0' });
});

// Register routers
app.route('/api/products', productRoutes);
app.route('/api/portfolio', portfolioRoutes);
app.route('/api/upload-gift', uploadRoutes);
app.route('/api/auth', authRoutes);

export default app;
