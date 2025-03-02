import { ComponentType } from "react";

import { ActionType, EntityType } from "@/components/table/types";

// import { DeleteDialog } from "@/components/table/dialogs/data-table-dialog";
// import { CustomerEditDialog } from "@/components/table/dialogs/edit-dialogs/customer-edit";
// import { ProductEditDialog } from "@/components/table/dialogs/edit-dialogs/product-edit";
// import { ProductPreviewDialog } from "@/components/table/dialogs/preview-dialogs/product-preview";

interface DialogConfig<T> {
  component: ComponentType<any>;
  defaultProps?: Partial<T>;
}

// Dialog registry
const dialogRegistry: Record<EntityType, Record<ActionType, DialogConfig<any> | null>> = {
  "customer": {
    "edit": { component: null },
    "delete": { component: null },
    "preview": null
  },
  "product": {
    "edit": { component: null },
    "delete": { component: null },
    "preview": { component: null }
  },
};

export function getDialogForEntity<T>(
  entityType: EntityType,
  actionType: ActionType,
  props: T
): JSX.Element | null {
  const config = dialogRegistry[entityType]?.[actionType];

  if (!config) {
    console.warn(`No dialog registered for ${entityType}/${actionType}`);
    return null;
  }

  const DialogComponent = config.component;
  return <DialogComponent {...config.defaultProps} {...props} />;
}