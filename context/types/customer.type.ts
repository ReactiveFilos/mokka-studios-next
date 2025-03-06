export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  isLocal?: boolean;
};

/**
 * Maps DummyJSON user data to our Customer type
 */
export function mapToCustomer(user: any): Customer {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: {
      street: user.address?.address || user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      country: user.address?.country || ""
    }
  };
}

/**
 * Maps an array of DummyJSON users to our Customer type
 */
export function mapToCustomers(users: any[]): Customer[] {
  return users.map(mapToCustomer);
}