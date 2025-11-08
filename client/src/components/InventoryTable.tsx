import { InventoryItem } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const InventoryTable = ({ 
  items, 
  onEdit, 
  onDelete,
  showActions = false 
}: InventoryTableProps) => {
  const getRowStyle = (quantity: number, threshold: number) => {
    if (quantity <= 5) return 'bg-destructive/10 border-l-4 border-l-destructive';
    if (quantity <= threshold) return 'bg-warning/10 border-l-4 border-l-warning';
    return 'bg-success/5 border-l-4 border-l-success';
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 4 : 3} className="text-center text-muted-foreground">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className={getRowStyle(item.quantity, item.reorderThreshold)}>
                <TableCell>
                  <div className="font-semibold text-base px-3 py-2 bg-primary/5 rounded-md border-l-4 border-l-primary">
                    {item.name}
                  </div>
                </TableCell>
                <TableCell className="capitalize font-medium">{item.category}</TableCell>
                <TableCell className="text-right font-bold text-lg">{item.quantity}</TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
