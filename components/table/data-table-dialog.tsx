import { useEffect, useState } from "react";

import { Customer } from "@/context/types/customer.type";

import { AddDialogProps, DeleteDialogProps, EditDialogProps, EntityType } from "@/components/table/types";
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

// Entity renderer interfaces
interface EntityRenderer<T = any> {
  /**
   * Renders the delete dialog info section
   */
  deleteInfoRenderer: (data: T) => React.ReactNode;

  /**
   * Renders the edit form for this entity
   */
  editFormRenderer: (data: T, onInputChange: (key: string, value: any) => void) => React.ReactNode;

  /**
   * Renders the add form for this entity
   */
  addFormRenderer?: (data: Omit<T, "id">, onInputChange: (key: string, value: any) => void) => React.ReactNode;

  /**
   * Handle special nested field changes (like address)
   */
  handleSpecialFieldChange?: (key: string, value: any, formData: T) => T;

  /**
   * Get initial form data for add operation
   */
  getInitialFormData?: () => Omit<T, "id">;

  /**
   * Validate form before submission
   */
  validateForm?: (data: T) => boolean;
}

// Registry of entity renderers (now with direct EntityType keys)
const entityRenderers = new Map<EntityType, EntityRenderer>();

/**
 * Register a new entity renderer
 */
export function registerEntity<T>(
  entityType: EntityType,
  renderer: EntityRenderer<T>
) {
  entityRenderers.set(entityType, renderer);
}

/**
 * Delete dialog component
 */
export function DeleteDialog<T>({
  open,
  onOpenChange,
  onConfirm,
  data,
  entityType
}: DeleteDialogProps<T>) {
  // Get the renderer directly by entity type
  const renderer = entityRenderers.get(entityType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[455px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this record?
          </DialogDescription>
        </DialogHeader>

        {renderer ? (
          renderer.deleteInfoRenderer(data)
        ) : (
          <div className="my-4 p-4 border rounded-md bg-muted/50">
            <p className="text-center text-muted-foreground">
              Unable to display record details.
            </p>
          </div>
        )}

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

/**
 * Edit dialog component
 */
export function EditDialog<T>({
  open,
  onOpenChange,
  onSave,
  data,
  entityType
}: EditDialogProps<T>) {
  const [formData, setFormData] = useState<T>(data);

  // Get the renderer directly by entity type
  const renderer = entityRenderers.get(entityType);

  const handleInputChange = (key: string, value: any) => {
    // Check if the entity has a special field handler
    if (renderer?.handleSpecialFieldChange) {
      const updatedData = renderer.handleSpecialFieldChange(key, value, formData);
      if (updatedData !== formData) {
        setFormData(updatedData);
        return;
      }
    }

    // Regular field update
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
          <DialogDescription>
            Make changes to the record. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        {renderer ? (
          renderer.editFormRenderer(formData, handleInputChange)
        ) : (
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Edit form for this data type is not implemented.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)} disabled={renderer === undefined || !renderer.validateForm?.(formData)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Add dialog component
 */
export function AddDialog<T>({
  open,
  onOpenChange,
  onSave,
  entityType
}: AddDialogProps<T>) {
  const [formData, setFormData] = useState<Omit<T, "id">>({} as Omit<T, "id">);

  // Get the renderer directly by entity type
  const renderer = entityRenderers.get(entityType);

  const handleInputChange = (key: string, value: any) => {
    // Check if the entity has a special field handler
    if (renderer?.handleSpecialFieldChange) {
      const updatedData = renderer.handleSpecialFieldChange(key, value, formData);
      if (updatedData !== formData) {
        setFormData(updatedData);
        return;
      }
    }

    // Regular field update - explicitly type the previous state
    setFormData((prev: Omit<T, "id">) => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open && renderer?.getInitialFormData) {
      setFormData(renderer.getInitialFormData());
    }
  }, [open, renderer]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</DialogTitle>
          <DialogDescription>
            Enter the details for the new record.
          </DialogDescription>
        </DialogHeader>

        {renderer?.addFormRenderer ? (
          renderer.addFormRenderer(formData, handleInputChange)
        ) : (
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Add form for this data type is not implemented.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(formData)}
            disabled={!renderer?.validateForm?.(formData)}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Register the Customer entity renderer
 */
registerEntity<Customer>("customer", {
  deleteInfoRenderer: (data) => (
    <div className="mt-2 mb-4 p-4 border rounded-md bg-muted/50">
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
  ),

  editFormRenderer: (data, onInputChange) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="firstName" className="text-right">
          First Name
        </Label>
        <Input
          id="firstName"
          value={data.firstName}
          onChange={(e) => onInputChange("firstName", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastName" className="text-right">
          Last Name
        </Label>
        <Input
          id="lastName"
          value={data.lastName}
          onChange={(e) => onInputChange("lastName", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          value={data.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <Input
          id="phone"
          value={data.phone}
          onChange={(e) => onInputChange("phone", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="city" className="text-right">
          City
        </Label>
        <Input
          id="city"
          value={data.address.city}
          onChange={(e) => onInputChange("address.city", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="state" className="text-right">
          State
        </Label>
        <Input
          id="state"
          value={data.address.state}
          onChange={(e) => onInputChange("address.state", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="country" className="text-right">
          Country
        </Label>
        <Input
          id="country"
          value={data.address.country}
          onChange={(e) => onInputChange("address.country", e.target.value)}
          className="col-span-3"
        />
      </div>
    </div>
  ),

  handleSpecialFieldChange: (key, value, formData) => {
    // Handle address fields with dot notation (address.city, address.state, address.country)
    if (key.startsWith("address.")) {
      const field = key.split(".")[1];
      return {
        ...formData,
        address: {
          ...formData.address,
          [field]: value
        }
      };
    }
    return formData;
  },

  addFormRenderer: (data, onInputChange) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="firstName" className="text-right">
          First Name
        </Label>
        <Input
          id="firstName"
          value={data.firstName || ""}
          onChange={(e) => onInputChange("firstName", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastName" className="text-right">
          Last Name
        </Label>
        <Input
          id="lastName"
          value={data.lastName || ""}
          onChange={(e) => onInputChange("lastName", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          value={data.email || ""}
          onChange={(e) => onInputChange("email", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <Input
          id="phone"
          value={data.phone || ""}
          onChange={(e) => onInputChange("phone", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="city" className="text-right">
          City
        </Label>
        <Input
          id="city"
          value={data.address?.city || ""}
          onChange={(e) => onInputChange("address.city", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="state" className="text-right">
          State
        </Label>
        <Input
          id="state"
          value={data.address?.state || ""}
          onChange={(e) => onInputChange("address.state", e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="country" className="text-right">
          Country
        </Label>
        <Input
          id="country"
          value={data.address?.country || ""}
          onChange={(e) => onInputChange("address.country", e.target.value)}
          className="col-span-3"
        />
      </div>
    </div>
  ),

  // Initial form data for new customers
  getInitialFormData: () => ({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      city: "",
      state: "",
      country: ""
    }
  }),

  // Form validation
  validateForm: (data) => {
    return !!(data.firstName && data.lastName && data.email && data.phone && data.address.city && data.address.state && data.address.country);
  }
});