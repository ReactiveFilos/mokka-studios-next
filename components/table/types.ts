import { ComponentType } from "react";

import { Eye, LucideIcon, Pencil, Trash2 } from "lucide-react";

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
  includeActions?: boolean;
  actionConfig?: ActionConfig<T>;
}

// Type definitions
export type EntityType = "customer" | "product";
export type ActionType = "edit" | "delete" | "preview";

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

export interface ActionConfig<T> {
  edit?: boolean | ((data: T) => void);
  delete?: boolean | ((data: T) => void);
  preview?: boolean | ((data: T) => void);
  [key: string]: boolean | ((data: T) => void) | undefined;
}

// Standard actions mapping for reuse
export const STANDARD_ACTIONS: Record<ActionType, {
  label: string;
  icon: LucideIcon;
}> = {
  "edit": { label: "Edit", icon: Pencil },
  "delete": { label: "Delete", icon: Trash2 },
  "preview": { label: "Preview", icon: Eye }
};

// Dialog props
export interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const dialogRegistry: Record<EntityType, Partial<Record<ActionType, ComponentType<any>>>> = {
  "customer": {
    "edit": null,
    "delete": null,
  },
  "product": {
    "edit": null,
    "delete": null,
    "preview": null
  },
};