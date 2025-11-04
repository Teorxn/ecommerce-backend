export interface Product {
  id: string;
  category: string[];   
  description: string;
  discount?: number;
  name: string;
  price: number;
  rating: number;
  specs: Record<string, string>;
  images: string[];
  stock: number;
  usage?: string;
}
