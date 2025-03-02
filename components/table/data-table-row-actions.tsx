import { useCallback, useState } from "react";

import { DeleteDialog, EditDialog } from "@/components/table/data-table-dialog";
import { ActionType, EntityType, STANDARD_ACTIONS } from "@/components/table/types";
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
  actions?: {
    onEdit?: (data: T) => void;
    onDelete?: (data: T) => void;
  };
}

export function RowActions<T>({
  data,
  entityType,
  actions = {},
}: RowActionsProps<T>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const handleAction = useCallback((actionType: ActionType) => {
    switch (actionType) {
      case "edit":
        setIsEditDialogOpen(true);
        break;
      case "delete":
        setIsDeleteDialogOpen(true);
        break;
    }
  }, []);

  // Get enabled standard actions
  const availableStandardActions = Object.entries({
    edit: actions.onEdit !== undefined,
    delete: actions.onDelete !== undefined,
  })
    .filter(([_, enabled]) => enabled === true)
    .map(([type]) => type as ActionType)
    .filter(type => type in STANDARD_ACTIONS);

  const handleEdit = useCallback((formData: T) => {
    if (actions.onEdit) {
      actions.onEdit(formData);
    }
    setIsEditDialogOpen(false);
  }, [actions.onEdit]);

  const handleDelete = useCallback(() => {
    if (actions.onDelete) {
      actions.onDelete(data);
    }
    setIsDeleteDialogOpen(false);
  }, [actions.onDelete, data]);

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

      <EditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEdit}
        data={data}
        entityType={entityType}
      />
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        data={data}
        entityType={entityType}
      />
    </>
  );
}