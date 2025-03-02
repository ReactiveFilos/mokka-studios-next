// Type definitions
export type EntityType = "customer" | "product";
export type ActionType = "edit" | "delete" | "preview";

// Action definition
export interface ActionDefinition<T> {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (data: T) => void;
}
export interface ActionConfig<T> {
  edit?: boolean | ((data: T) => void);
  delete?: boolean | ((data: T) => void);
  preview?: boolean | ((data: T) => void);
  [key: string]: boolean | ((data: T) => void) | undefined;
}

// Dialog definition
export interface DialogDefinition {
  id: string;
  component: React.ComponentType<any>;
}

// Dialog registry
const dialogRegistry: Record<EntityType, Record<ActionType, DialogDefinition | null>> = {
  "customer": {
    "edit": { id: "customer-edit", component: null },
    "delete": { id: "customer-delete", component: null },
    "preview": null
  },
  "product": {
    "edit": { id: "product-edit", component: null },
    "delete": { id: "product-delete", component: null },
    "preview": { id: "product-preview", component: null }
  },
};

// Dialog factory
export function getDialogForEntity(
  entityType: EntityType,
  actionType: ActionType
): React.ComponentType<any> | null {
  const dialog = dialogRegistry[entityType]?.[actionType];

  if (!dialog) {
    console.warn(`No dialog registered for ${entityType}/${actionType}`);
    return null;
  }

  return dialog.component;
}