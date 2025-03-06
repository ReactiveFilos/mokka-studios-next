import { Customer } from "@/context/types/customer.type";

import { TruncatedTextWithHover } from "@/components/elements/TruncatedTextWithHover";

// Define the record fields for customers
const customerInfoFields = [
  { label: "Name", getValue: (customer: Customer) => `${customer.firstName} ${customer.lastName}` },
  { label: "Email", getValue: (customer: Customer) => customer.email },
  { label: "Phone", getValue: (customer: Customer) => customer.phone },
  {
    label: "Location", getValue: (customer: Customer) =>
      <TruncatedTextWithHover text={`${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.country}`} maxLength={35} />
  },
];

interface CustomerInfoProps {
  customer: Customer;
  className?: string;
}

export default function CustomerInfo({ customer, className = "" }: CustomerInfoProps) {
  return (
    <div className={`p-4 border rounded-md bg-muted/40 space-y-2 ${className}`}>
      {customerInfoFields.map((field, index) => (
        <div key={index} className="grid grid-cols-4 items-center gap-4">
          <span className="text-right font-medium text-muted-foreground">{field.label}</span>
          <span className="col-span-3">{field.getValue(customer)}</span>
        </div>
      ))}
    </div>
  );
}