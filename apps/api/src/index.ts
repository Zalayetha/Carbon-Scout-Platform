import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { noteRouter } from './modules/notes/router.js';

const app = new Hono().use(cors()).route('/notes', noteRouter);

export type AppType = typeof app;

serve(
  {
    fetch: app.fetch,
    port: 8000,
    hostname: '0.0.0.0',
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
