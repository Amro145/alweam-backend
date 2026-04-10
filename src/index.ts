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
import { bearerAuth } from 'hono/bearer-auth';

const app = new Hono<AppEnv>();

// Global Middlewares
app.use('*', secureHeaders());
app.use('*', getCorsMiddleware());

app.use('*', async (c, next) => {
  // Inject database
  c.set('db', drizzle(c.env.DB, { schema }));
  await next();
});

// Protect all mutating endpoints
app.use('/api/products/*', async (c, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(c.req.method)) {
    const auth = bearerAuth({ token: c.env.ADMIN_SECRET });
    return auth(c, next);
  }
  await next();
});

app.use('/api/portfolio/*', async (c, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(c.req.method)) {
    const auth = bearerAuth({ token: c.env.ADMIN_SECRET });
    return auth(c, next);
  }
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

export default app;
