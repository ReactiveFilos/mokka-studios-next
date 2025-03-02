import { ActionType, dialogRegistry, EntityType } from "@/components/table/types";

// Get the appropriate dialog component for an entity and action type

export function getDialogForEntity<T>(
  entityType: EntityType,
  actionType: ActionType,
  props: T
): JSX.Element | null {
  const DialogComponent = dialogRegistry[entityType]?.[actionType];

  if (!DialogComponent) {
    console.warn(`No dialog registered for ${entityType}/${actionType}`);
    return null;
  }

  return <DialogComponent {...props} />;
}