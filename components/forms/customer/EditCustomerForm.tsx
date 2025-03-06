import { Customer } from "@/context/types/customer.type";

import BaseCustomerForm, { CustomerFormValues } from "@/components/forms/customer/BaseCustomerForm";

interface EditCustomerFormProps {
  customer: Customer;
  onSubmit: (data: Customer) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export default function EditCustomerForm({ customer, onSubmit, onCancel, className = "" }: EditCustomerFormProps) {
  const defaultValues: CustomerFormValues = {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    street: customer.address.street,
    city: customer.address.city,
    state: customer.address.state,
    country: customer.address.country,
  };

  const handleSubmit = async (values: CustomerFormValues) => {
    const updatedCustomer: Customer = {
      ...customer,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        country: values.country,
      },
    };

    await onSubmit(updatedCustomer);
  };

  return (
    <BaseCustomerForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      mode="edit"
      className={className}
    />
  );
}