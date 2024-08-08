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

export const commandSwitch = async (body: any) => {
  let res;
  let payload;
  let text = "";
  let status = 200;

  switch (body.type) {
    case "OPEN_LIMIT":
      res =  await openLimitOrder(body.symbol, body.price, body.quantity);
      payload = await res.json();
      status = res.status
      text = `STATUS-${status} | OPEN-LIMIT | ${body.symbol} | @${body.price} USDT`;
      break;

    case "CANCEL_LIMIT":
      res =  await cancelLimitOrder(body.symbol);
      payload = await res.json();
      status = res.status
      text = `STATUS-${res.status} | CANCEL-LIMIT | ${body.symbol} | @${body.price} USDT`;
      break;

    case "CLOSE_ALL":
      await cancelLimitOrder(body.symbol);
      res =  await closeAllOrder(body.symbol);
      payload = await res.json();
      status = res.status
      text = `STATUS-${res.status} | CLOSE-ALL | ${body.symbol} | @${body.price} USDT`;
      break;
  }

  return { status, text, payload };
}