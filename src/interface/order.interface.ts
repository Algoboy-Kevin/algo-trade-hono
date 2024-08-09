type OrderCommandType = "OPEN_LIMIT" | "CANCEL_LIMIT" | "CLOSE_ALL";

interface OrderDTOType {
  type: string
  price: number
  symbol: string
  quantity: number
  alertName: string
}