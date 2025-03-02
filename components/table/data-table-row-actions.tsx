import { useState } from "react";

import { getDialogForEntity } from "@/components/table/dialog/data-table-dialog-factory";
import { EntityType } from "@/components/table/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

// Define all possible actions
interface ActionDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (data: any) => void;
}

interface RowActionsProps<T> {
  data: T;
  entityType: EntityType;
  actions?: {
    edit?: boolean | ((data: T) => void);
    delete?: boolean | ((data: T) => void);
    preview?: boolean | ((data: T) => void);
    [key: string]: boolean | ((data: T) => void) | undefined;
  };
  customActions?: ActionDefinition[];
}

export function RowActions<T>({
  data,
  entityType,
  actions = { edit: true, delete: true },
  customActions = []
}: RowActionsProps<T>) {
  const [dialogState, setDialogState] = useState<{
    type: string | null;
    open: boolean;
  }>({
    type: null,
    open: false,
  });

  const handleAction = (actionType: string) => {
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
    const actionHandler = actions[dialogState.type as string];
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
      dialogState.type as any,
      {
        open: dialogState.open,
        onOpenChange: (open: boolean) => setDialogState(prev => ({ ...prev, open })),
        onConfirm: handleDialogConfirm,
        onSave: handleDialogConfirm,
        data
      }
    );
  };

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
          {actions.edit && (
            <DropdownMenuItem onClick={() => handleAction("edit")}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}
          {actions.delete && (
            <DropdownMenuItem onClick={() => handleAction("delete")}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
          {actions.preview && (
            <DropdownMenuItem onClick={() => handleAction("preview")}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Preview</span>
            </DropdownMenuItem>
          )}
          {customActions.map(action => (
            <DropdownMenuItem key={action.id} onClick={() => action.action(data)}>
              {action.icon}
              <span>{action.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenderActiveDialog />
    </>
  );
}