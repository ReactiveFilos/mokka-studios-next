import { Customer } from "@/context/types/customer.type";
import { Product } from "@/context/types/product.type";

import AddCustomerForm from "@/components/forms/customer/AddCustomerForm";
import EditCustomerForm from "@/components/forms/customer/EditCustomerForm";
import { CustomerInfo, ProductInfo } from "@/components/forms/delete/RecordInfo";
import AddProductForm from "@/components/forms/product/AddProductForm";
import EditProductForm from "@/components/forms/product/EditProductForm";
import { EntityType } from "@/components/table/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<T, "id">) => void;
  entityType: EntityType;
}

export function AddDialog<T>({
  open,
  onOpenChange,
  onSave,
  entityType
}: AddDialogProps<T>) {
  // Function to handle dialog close
  const handleClose = () => {
    onOpenChange(false);
  };

  // Function to handle form submission
  const handleSubmit = async (data: Omit<T, "id">) => {
    onSave(data);
    onOpenChange(false);
  };

  // Render the appropriate form based on entity type
  const RenderFormByEntityType = () => {
    switch (entityType) {
      case "customer":
        return (
          <AddCustomerForm
            onSubmit={handleSubmit as (data: Omit<Customer, "id">) => Promise<void>}
            onCancel={handleClose}
          />
        );
      case "product":
        return (
          <AddProductForm
            onSubmit={handleSubmit as (data: Omit<Product, "id">) => Promise<void>}
            onCancel={handleClose}
          />
        );
      case "category":
        return (<></>
          // <AddCategoryForm
          //   onSubmit={handleSubmit as (data: Omit<Category, "id">) => Promise<void>}
          //   onCancel={handleClose}
          // />
        );
      default:
        return (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">Form not available for this entity type.</p>
            <Button variant="outline" onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add new {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</DialogTitle>
          <DialogDescription>
            Enter the details for the new record.
          </DialogDescription>
        </DialogHeader>
        <RenderFormByEntityType />
      </DialogContent>
    </Dialog>
  );
}

interface EditDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: T) => void;
  data: T;
  entityType: EntityType;
}

export function EditDialog<T>({
  open,
  onOpenChange,
  onSave,
  data,
  entityType
}: EditDialogProps<T>) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (formData: T) => {
    onSave(formData);
    onOpenChange(false);
  };

  const RenderFormByEntityType = () => {
    switch (entityType) {
      case "customer":
        return (
          <EditCustomerForm
            customer={data as Customer}
            onSubmit={handleSubmit as (data: Customer) => Promise<void>}
            onCancel={handleClose}
          />
        );
      case "product":
        return (
          <EditProductForm
            product={data as Product}
            onSubmit={handleSubmit as (data: Product) => Promise<void>}
            onCancel={handleClose}
          />
        );
      case "category":
        return (<></>
          // <EditCategoryForm
          //   category={data as Category}
          //   onSubmit={handleSubmit as (data: Category) => Promise<void>}
          //   onCancel={handleClose}
          // />
        );
      default:
        return (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">Edit form not available for this entity type.</p>
            <Button variant="outline" onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</DialogTitle>
          <DialogDescription>
            Make changes to this record.
          </DialogDescription>
        </DialogHeader>
        <RenderFormByEntityType />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  data: T;
  entityType: EntityType;
}

export function DeleteDialog<T>({
  open,
  onOpenChange,
  onConfirm,
  data,
  entityType
}: DeleteDialogProps<T>) {
  const RenderInfoByEntityType = () => {
    switch (entityType) {
      case "customer":
        return <CustomerInfo customer={data as Customer} />;
      case "product":
        return <ProductInfo product={data as Product} />;
      case "category":
      // return <CategoryInfo category={data as Category} />;
      default:
        return (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">Unable to display details for this entity type.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <RenderInfoByEntityType />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}