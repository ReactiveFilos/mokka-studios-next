export type Profile = {
  id: string;
  fullName: string | null;
  avatar: string | null;
  billingAddress: string | null;
  paymentMethod: string | null;
};

export const queryProfile = `
  id,
  fullName: fullname,
  avatar,
  billingAddress: billing_address,
  paymentMethod: payment_method
`;
