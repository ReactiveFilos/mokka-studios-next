import { Category } from "@/context/types/category.type";
import { Customer } from "@/context/types/customer.type";
import { Product } from "@/context/types/product.type";

import { TruncatedTextWithHover } from "@/components/elements/TruncatedTextWithHover";
import { EntityType } from "@/components/table/types";

// Define field configuration by entity type
const entityFields = {
  customer: (data: Customer) => [
    { label: "Name", value: `${data.firstName} ${data.lastName}` },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    {
      label: "Location",
      value: <TruncatedTextWithHover text={`${data.address.street}, ${data.address.city}, ${data.address.state}, ${data.address.country}`} maxLength={35} />
    },
  ],

  product: (data: Product) => [
    { label: "Title", value: data.title },
    { label: "Price", value: `${data.price.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}` },
    { label: "Description", value: <TruncatedTextWithHover text={data.description} maxLength={35} /> },
    { label: "Tags", value: data.tags?.join(", ") || "None" },
  ],

  category: (data: Category) => [
    { label: "Name", value: data.name },
    { label: "Slug", value: data.slug },
  ]
};

interface RecordInfoProps {
  data: any;
  entityType: EntityType;
  className?: string;
}

function RecordInfo({ data, entityType, className = "" }: RecordInfoProps) {
  // Get the appropriate field generator function
  const getFields = entityFields[entityType];

  if (!getFields) {
    return (
      <div className={`p-4 border rounded-md bg-muted/40 text-center ${className}`}>
        No information available for this entity type.
      </div>
    );
  }

  const fields = getFields(data);

  return (
    <div className={`p-4 border rounded-md bg-muted/40 space-y-2 ${className}`}>
      {fields.map((field, index) => (
        <div key={index} className="grid grid-cols-4 items-center gap-4">
          <span className="text-right font-medium text-muted-foreground">{field.label}</span>
          <span className="col-span-3">{field.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CustomerInfo({ customer, className = "" }: { customer: Customer; className?: string }) {
  return <RecordInfo data={customer} entityType="customer" className={className} />;
}

export function ProductInfo({ product, className = "" }: { product: Product; className?: string }) {
  return <RecordInfo data={product} entityType="product" className={className} />;
}

export function CategoryInfo({ category, className = "" }: { category: Category; className?: string }) {
  return <RecordInfo data={category} entityType="category" className={className} />;
}