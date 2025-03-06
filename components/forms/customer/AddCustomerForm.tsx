import { Customer } from "@/context/types/customer.type";

import CustomerFormBase, { CustomerFormValues } from "@/components/forms/customer/BaseCustomerForm";

interface AddCustomerFormProps {
  onSubmit: (data: Omit<Customer, "id">) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export default function AddCustomerForm({ onSubmit, onCancel, className = "" }: AddCustomerFormProps) {
  const defaultValues: CustomerFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
  };

  const handleSubmit = async (values: CustomerFormValues) => {
    const customerData: Omit<Customer, "id"> = {
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

    await onSubmit(customerData);
  };

  return (
    <CustomerFormBase
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      mode="add"
      className={className}
    />
  );
}