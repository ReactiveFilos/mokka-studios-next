import { Customer } from "@/context/types/customer.type";
import { Profile } from "@/context/types/profile.type";

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

/**
 * Maps DummyJSON user data to our Profile type
 */
export function mapToProfile(user: any): Profile {
  return {
    id: user.id,
    fullname: `${user.firstName} ${user.lastName}`,
    email: user.email,
    username: user.username,
    avatar: user.image || null,
  };
}