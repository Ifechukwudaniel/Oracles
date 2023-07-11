export interface PriceChange {
  ticker: string;
  reporter: string;
  price: number;
}

export interface PriceType {
  name: string;
  ticker: string;
  price: number;
  loading: boolean;
}
