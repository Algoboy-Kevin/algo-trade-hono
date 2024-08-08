import { cors } from 'hono/cors';
import { v1 } from './routes';
import * as process from 'node:process';
import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

// middleware
app.use('*', (c, next) => {
  // init env global
  if (c.env && Object.keys(c.env).length) {
    for (const key in c.env) {
      process.env[key] = (c.env as any)[key];
    }
  }
  // with cors
  return cors()(c, next);
})

app.openAPIRegistry.registerComponent('securitySchemes', 'secret', {
  "type": "apiKey",
  "name": "secret",
  "in": "header"
})

app.doc('/doc', {
  info: {
    title: 'Algotrade API',
    version: 'v1'
  },
  openapi: '3.1.0'
})

app.route('/v1', v1)

export default {
  fetch: app.fetch,
};