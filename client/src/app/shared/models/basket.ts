import * as cuid from 'cuid';

export interface IBasket {
    id: string
    items: IBasketItem[],
    clientSecret?: string;
    paymentIntentId?: string;
    deliveryMethodId?: number;
    shippingPrice: number;
  }
  
  export interface IBasketItem {
    id: number
    productName: string
    price: number
    quantity: number
    pictureUrl: string
    brand: string
    type: string
  }

  export class Basket implements IBasket {
    id = cuid();
    items: IBasketItem[] = [];
    shippingPrice = 0
  }

  export interface IBasketTotals {
    shipping: number;
    subtotal: number;
    total: number;
  }