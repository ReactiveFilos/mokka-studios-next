import { useState } from "react";

import { Customer } from "@/context/types/customer.type";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  data: T;
}

export function DeleteDialog<T>({ open, onOpenChange, onConfirm, data }: DeleteDialogProps<T>) {
  // Render different record info based on data type
  const RecordInfo = () => {
    if (isCustomer(data)) {
      return (
        <div className="my-4 p-4 border rounded-md bg-muted/50">
          <div className="grid gap-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium text-muted-foreground">
                Name
              </Label>
              <span className="col-span-3 truncate">
                {data.firstName} {data.lastName}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium text-muted-foreground">
                Email
              </Label>
              <span className="col-span-3 truncate">
                {data.email}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium text-muted-foreground">
                Phone
              </Label>
              <span className="col-span-3 truncate">
                {data.phone}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium text-muted-foreground">
                Location
              </Label>
              <span className="col-span-3 truncate">
                {data.address.city}, {data.address.state}, {data.address.country}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Generic fallback for other data types
    return (
      <div className="my-4 p-4 border rounded-md bg-muted/50">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-medium text-muted-foreground">
            ID
          </Label>
          <span className="col-span-3 truncate">
            {(data as any).id || "Unknown"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[455px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this record?
          </DialogDescription>
        </DialogHeader>
        <RecordInfo />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: T) => void;
  data: T;
}

// Type guard for Customer
function isCustomer(data: any): data is Customer {
  return data &&
    typeof data === "object" &&
    "firstName" in data &&
    "lastName" in data &&
    "email" in data;
}

export function EditDialog<T>({ open, onOpenChange, onSave, data }: EditDialogProps<T>) {
  const [formData, setFormData] = useState<T>(data);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddressChange = (addressField: string, value: string) => {
    if (isCustomer(formData)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      } as unknown as T);
    }
  };

  // We'll need to implement different forms based on the data type
  const renderForm = () => {
    // If it's a Customer type, render the customer form
    if (isCustomer(formData)) {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              City
            </Label>
            <Input
              id="city"
              value={formData.address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">
              State
            </Label>
            <Input
              id="state"
              value={formData.address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Input
              id="country"
              value={formData.address.country}
              onChange={(e) => handleAddressChange("country", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
      );
    }

    // If it's another type, render a generic form
    return (
      <div className="py-4">
        <p className="text-center text-muted-foreground">
          Edit form for this data type is not implemented.
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
          <DialogDescription>
            Make changes to the record. Click save when you&lsquo;re done.
          </DialogDescription>
        </DialogHeader>
        {renderForm()}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}