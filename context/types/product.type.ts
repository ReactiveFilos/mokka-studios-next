export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string; // thumbnail in DummyJSON
  tags: string[];
  isLocal?: boolean;
};