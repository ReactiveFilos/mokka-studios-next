import { ComponentType } from "react";

import { LucideIcon, Pencil, Plus, Trash2 } from "lucide-react";

// Column configuration
export interface ColumnConfig<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (info: any) => React.ReactNode;
  meta?: Record<string, any>;
}

// Table options
export interface TableOptions<T> {
  entityType: EntityType;
  includeActions: boolean;
  actions?: {
    onEdit?: (data: T) => void;
    onDelete?: (data: T) => void;
  };
}

export interface TableActions<T = any> {
  onAdd?: (data: Omit<T, "id">) => void | Promise<void>;
  addButtonLabel?: string;
}

// Type definitions
export type EntityType = "customer" | "product" | "category";
export type ActionType = "edit" | "delete" | "add";
export type EntityFormMode = "add" | "edit";

export interface FilterableField {
  value: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  type?: "text" | "number";
}

export interface FilterType {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// Standard actions mapping for reuse
export const STANDARD_ACTIONS: Record<ActionType, {
  label: string;
  icon: LucideIcon;
}> = {
  "edit": { label: "Edit", icon: Pencil },
  "delete": { label: "Delete", icon: Trash2 },
  "add": { label: "Add", icon: Plus },
};

// Dialog props
export interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
}

export interface EditDialogProps<T> extends BaseDialogProps {
  data: T;
  onSave: (data: T) => void;
}

export interface DeleteDialogProps<T> extends BaseDialogProps {
  data: T;
  onConfirm: () => void;
}

export interface AddDialogProps<T> extends BaseDialogProps {
  onSave: (data: Omit<T, "id">) => void;
}