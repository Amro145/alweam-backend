import { ErrorHandler } from 'hono';
import { AppEnv } from '../core/types';
import { ZodError } from 'zod';

export const globalErrorHandler: ErrorHandler<AppEnv> = (err, c) => {
  console.error(`[Error] ${c.req.method} ${c.req.url} - ${err.message}`);
  
  if (err instanceof ZodError) {
    return c.json({ error: 'Validation Error', details: err.issues }, 400);
  }
  
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
};
