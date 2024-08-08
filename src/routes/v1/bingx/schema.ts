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
                    alertName: "ALERT_NAME",
                    type: "OPEN_LIMIT",
                    symbol: "PEPE-USDT",
                    price: 1000,
                    quantity: 1000
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