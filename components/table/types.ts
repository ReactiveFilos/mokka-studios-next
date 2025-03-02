import { ComponentType } from "react";

import { LucideIcon, Pencil, Trash2 } from "lucide-react";

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

// Type definitions
export type EntityType = "customer" | "product";
export type ActionType = "edit" | "delete";

export interface FilterableField {
  value: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
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

export interface PreviewDialogProps<T> extends BaseDialogProps {
  data: T;
}