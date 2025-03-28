import { useCallback } from "react";

import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";

export default function ColumnMoveButtons<TData>({
  column,
  columnOrder,
  setColumnOrder,
}: {
  column: ColumnDef<TData>;
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
}) {

  const moveColumn = useCallback((direction: "left" | "right") => {
    const index = columnOrder.indexOf(column.id);
    const newOrder = [...columnOrder];

    if (direction === "left" && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === "right" && index < columnOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }

    setColumnOrder(newOrder);
  }, [columnOrder, column.id, setColumnOrder]);

  const handleMoveLeft = useCallback(() => moveColumn("left"), [moveColumn]);
  const handleMoveRight = useCallback(() => moveColumn("right"), [moveColumn]);

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        onClick={handleMoveLeft}
        disabled={columnOrder.indexOf(column.id) === 0}>
        <MoveLeftIcon className="mr-2 h-4 w-4" />
        Move left
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={handleMoveRight}
        disabled={columnOrder.indexOf(column.id) === columnOrder.length - 1}>
        <MoveRightIcon className="mr-2 h-4 w-4" />
        Move right
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}