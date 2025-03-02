import { useState } from "react";

import { getDialogForEntity } from "@/components/table/dialog/data-table-dialog-factory";
import {
  ActionConfig,
  ActionType,
  EntityType,
  STANDARD_ACTIONS
} from "@/components/table/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";

interface RowActionsProps<T> {
  data: T;
  entityType: EntityType;
  actions?: ActionConfig<T>;
}

export function RowActions<T>({
  data,
  entityType,
  actions = { edit: true, delete: true },
}: RowActionsProps<T>) {
  const [dialogState, setDialogState] = useState<{
    type: ActionType | null;
    open: boolean;
  }>({
    type: null,
    open: false,
  });

  const handleAction = (actionType: ActionType) => {
    const actionHandler = actions[actionType];

    if (typeof actionHandler === "function") {
      actionHandler(data);
    } else {
      setDialogState({ type: actionType, open: true });
    }
  };

  const handleDialogClose = () => {
    setDialogState({ type: null, open: false });
  };

  const handleDialogConfirm = () => {
    // Handle confirmation logic
    const actionHandler = actions[dialogState.type as ActionType];
    if (typeof actionHandler === "function") {
      actionHandler(data);
    }
    handleDialogClose();
  };

  // Render the active dialog
  const RenderActiveDialog = () => {
    if (!dialogState.open || !dialogState.type) return null;

    return getDialogForEntity(
      entityType,
      dialogState.type,
      {
        open: dialogState.open,
        onOpenChange: (open: boolean) => setDialogState(prev => ({ ...prev, open })),
        onConfirm: handleDialogConfirm,
        onSave: handleDialogConfirm,
        data
      }
    );
  };

  // Get all available standard actions based on the props
  const availableStandardActions = Object.entries(actions)
    .filter(([_, enabled]) => enabled) // Filter only enabled actions
    .map(([type]) => type as ActionType)
    .filter(type => type in STANDARD_ACTIONS); // Ensure it's a standard action

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {availableStandardActions.map(actionType => {
            const { icon: Icon, label } = STANDARD_ACTIONS[actionType];
            return (
              <DropdownMenuItem key={actionType} onClick={() => handleAction(actionType)}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenderActiveDialog />
    </>
  );
}