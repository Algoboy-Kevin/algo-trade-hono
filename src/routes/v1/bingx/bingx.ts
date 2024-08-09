import { randomUUID } from "node:crypto";
import { OpenAPIHono } from "@hono/zod-openapi";
import { prismaMiddleware } from "../../../middlewares";
import { createOrder, createResponseLogs, createWebhookLog } from "./service";
import { PostCreateOrder } from "./schema";
import { Context, Env } from "hono";

export const bingx = new OpenAPIHono();

bingx.use(prismaMiddleware);

bingx.openapi(PostCreateOrder, async (c: Context<Env>) => {
  const txId = randomUUID();
  const body = await c.req.json() as OrderDTOType;
  const prisma = c.get('prisma');

  let payload: any = "";

  try {
    // Create webhook logs
    await createWebhookLog(prisma, txId, body.alertName, JSON.stringify(body));

    // Create order and stringify json, D1 can only store json string
    const orderResponse  = await createOrder(body) as any;
    payload = JSON.stringify(orderResponse.payload);

    // Check the response status and throws error if 
    const isSuccess = orderResponse.status == 200 && orderResponse?.payload?.code == 0
    if (!isSuccess) {
      throw Error("Order is not successful");
    };

    // Create reponse log
    await createResponseLogs(
      prisma, 
      txId, 
      body.alertName, 
      payload,
      "Success!"
    );

    return c.text("Success", 201);
  } catch (err) {
    const error = err as Error
    
    //Capture error log
    await createResponseLogs(
      prisma, 
      txId, 
      body.alertName ?? "", 
      payload ?? "",
      error.message ?? ""
    );

    return c.text(error.message, 500);
  }
})