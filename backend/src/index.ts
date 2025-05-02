import { Hono } from 'hono';

import notesRoute from './modules/notes/routes';

import { cors } from 'hono/cors';

const app = new Hono();
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.route('/notes', notesRoute);

export default {
  port: 8080,
  fetch: app.fetch,
};
