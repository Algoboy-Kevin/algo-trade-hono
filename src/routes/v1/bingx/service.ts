import { PrismaClient } from "@prisma/client";
import { createHmac,  BinaryLike } from "node:crypto";
import * as process from 'node:process';

interface AxiosConfig {
  uri: string,
  method: string,
  payload: any,
  protocol: string
};

const getParameters = (API: any, timestamp: number, urlEncode?: boolean) => {
  let parameters = ""
  for (const key in API.payload) {
      if (urlEncode) {
          parameters += key + "=" + encodeURIComponent(API.payload[key]) + "&"
      } else {
          parameters += key + "=" + API.payload[key] + "&"
      }
  }
  if (parameters) {
      parameters = parameters.substring(0, parameters.length - 1)
      parameters = parameters + "&timestamp=" + timestamp
  } else {
      parameters = "timestamp=" + timestamp
  }
  return parameters
}

const getUrl = (payload: AxiosConfig, timestamp= new Date().getTime()) => {
  if (!process.env.BINGX_SECRET_KEY || !process.env.BINGX_SECRET_KEY) {
    throw new Error("Missing BingX API key!");
  }

  const params = getParameters(payload, timestamp);
  const encodedUrl = getParameters(payload, timestamp, true);
  const sign = createHmac('sha256', process.env.BINGX_SECRET_KEY as BinaryLike).update(params).digest('hex');
  const url = `https://open-api.bingx.com${payload.uri}?${encodedUrl}&signature=${sign}`;
  return url
};

export const createRequest = async (method: string, url: string) => {
  const config = {
    method,
    url,
    headers: {
      'X-BX-APIKEY': process.env.BINGX_API_KEY,
    },
  };
  const result = await fetch(config.url, { headers: config.headers as any, method: config.method})
  return result;
}

export const openLimitOrder = async (symbol: string, price: number, quantity: number) => {
  const config: AxiosConfig = {
    "uri": "/openApi/swap/v2/trade/order",
    "method": "POST",
    "payload": {
        "symbol": symbol,
        "side": "BUY",
        "positionSide": "LONG",
        "type": "LIMIT",
        "quantity": quantity,
        "price": price
    },
    "protocol": "https"
  };
  const url = getUrl(config);
  const res = await createRequest(config.method, url);
  return res;
}

export const cancelLimitOrder = async (symbol: string) => {
  const timestamp = new Date().getTime();
  const config = {
    "uri": "/openApi/swap/v2/trade/allOpenOrders",
    "method": "DELETE",
    "payload": {
        "recvWindow": "0",
        "symbol": symbol,
        "timestamp": timestamp.toString()
    },
    "protocol": "https"
  };
  const url = getUrl(config);
  const res = await createRequest(config.method, url);
  return res;
}

export const closeAllOrder = async (symbol: string) => {
  const timestamp = new Date().getTime();
  const config = {
    "uri": "/openApi/swap/v2/trade/closeAllPositions",
    "method": "POST",
    "payload": {
        "symbol": symbol,
        "timestamp": timestamp.toString()
    },
    "protocol": "https"
  };
  const url = getUrl(config);
  const res = await createRequest(config.method, url);
  return res;
}

export const createOrder = async (orderData: any) => {
  let response;
  let payload;
  let status = 200;

  switch (orderData.type) {
    case "OPEN_LIMIT":
      response =  await openLimitOrder(orderData.symbol, orderData.price, orderData.quantity);
      payload = await response.json();
      status = response.status
      break;

    case "CANCEL_LIMIT":
      response =  await cancelLimitOrder(orderData.symbol);
      payload = await response.json();
      status = response.status
      break;

    case "CLOSE_ALL":
      await cancelLimitOrder(orderData.symbol);
      response =  await closeAllOrder(orderData.symbol);
      payload = await response.json();
      status = response.status
      break;

    default:
      throw Error("Wrong command type! (OPEN_LIMIT, CANCEL_LIMIT, CLOSE_ALL")
  }

  return { response, payload, status };
}

export const createWebhookLog = async (
  prisma: PrismaClient, 
  txId: string,
  alertName: string,
  body: string,
) => {
  const result = await prisma.logsWebhook.create({
    data: {
      id: txId,
      alert_name: alertName,
      body: body,
    }
  });
  
  return result;
}

export const createResponseLogs = async (
  prisma: PrismaClient, 
  txId: string,
  alertName: string,
  body: string,
  message: string
) => {
  const result = await prisma.logsOrder.create({
    data: {
      id: txId,
      alert_name: alertName,
      body: body,
      message
    }
  });
  
  return result;
}