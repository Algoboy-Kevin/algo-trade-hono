import { createRoute, z } from "@hono/zod-openapi";

export const PostCreateOrder = createRoute({
  tags: ["queue"],
  method: 'post',
  path: '/',
  summary: "create order request",
  request: {
      body: {
          content: {
              "application/json": {
                  schema: z.any(),
                  example: {
                    type: "OPEN_LIMIT",
                    price: 0.0079828,
                    symbol: "1000PEPE-USDT",
                    quantity: 8413,
                    alertName: "DEFAULT"
                  }
              }
          },
          description: "data sync game"
      }
  },
  responses: {
      201: {
        content: {
          'text/plain': {
            schema: z.string(),
            example: "sucess"
          },
        },
        description: 'Retrieve the user',
      },
      400: {
          content: {
              "text/plain": {
                  schema: z.string()
              }
          },
          description: "error message"
      }
  },
  security: [
      {
          Bearer: []
      },
      {
          hx_secret: []
      },
      {
          'app-pub-key': []
      }
  ]
})