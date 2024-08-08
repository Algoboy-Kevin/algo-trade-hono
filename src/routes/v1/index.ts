import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { bingx } from './bingx/bingx';

export const v1 = new OpenAPIHono();

v1.get('/doc', swaggerUI({ url: '/doc' }))

// make route for each broker
v1.route('/bingx', bingx);

v1.get('/', (c) => {
  return c.text('Hello Hono from V1', 200);
})