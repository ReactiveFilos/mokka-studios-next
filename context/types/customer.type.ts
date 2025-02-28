export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
};