export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  productType: string;
  productBrand: string;
}

export interface IBrand {
  id: number;
  name: string;
}

export interface IType {
  id: number;
  name: string;
}