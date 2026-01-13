import { useState } from 'react';
import { Settings2, Plus, Trash2, GripVertical, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export interface ColumnDefinition {
  key: string;
  header: string;
  visible: boolean;
  dataField?: string;
  format?: 'text' | 'currency' | 'date' | 'status';
  isCustom?: boolean;
}

export interface AvailableField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'status';
}

interface ColumnEditorProps {
  columns: ColumnDefinition[];
  availableFields: AvailableField[];
  onColumnsChange: (columns: ColumnDefinition[]) => void;
  isEditMode: boolean;
  tableId: string;
}

export function ColumnEditor({
  columns,
  availableFields,
  onColumnsChange,
  isEditMode,
  tableId,
}: ColumnEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<ColumnDefinition | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state
  const [header, setHeader] = useState('');
  const [dataField, setDataField] = useState('');
  const [format, setFormat] = useState<'text' | 'currency' | 'date' | 'status'>('text');

  // Column configuration is useful even when page layout edit mode is off,
  // so we keep this component available at all times.
  const isCustomizationEnabled = true || isEditMode;

  const visibleCount = columns.filter(c => c.visible).length;

  const openAddDialog = () => {
    setIsAddingNew(true);
    setEditingColumn(null);
    setHeader('');
    setDataField('');
    setFormat('text');
    setIsDialogOpen(true);
  };

  const openEditDialog = (column: ColumnDefinition) => {
    setIsAddingNew(false);
    setEditingColumn(column);
    setHeader(column.header);
    setDataField(column.dataField || column.key);
    setFormat(column.format || 'text');
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!header || !dataField) return;

    if (isAddingNew) {
      const newColumn: ColumnDefinition = {
        key: `custom_${Date.now()}`,
        header,
        visible: true,
        dataField,
        format,
        isCustom: true,
      };
      onColumnsChange([...columns, newColumn]);
    } else if (editingColumn) {
      onColumnsChange(
        columns.map(col =>
          col.key === editingColumn.key
            ? { ...col, header, dataField, format }
            : col
        )
      );
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (key: string) => {
    onColumnsChange(columns.filter(col => col.key !== key));
  };

  const handleToggleVisibility = (key: string) => {
    onColumnsChange(
      columns.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const getFieldLabel = (fieldKey: string) => {
    const field = availableFields.find(f => f.key === fieldKey);
    return field?.label || fieldKey;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2" disabled={!isCustomizationEnabled}>
            <Settings2 className="h-4 w-4" />
            Columns ({visibleCount}/{columns.length})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {columns.map((column) => (
            <div
              key={column.key}
              className="flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm"
            >
              <div className="flex items-center gap-2 flex-1">
                <Switch
                  checked={column.visible}
                  onCheckedChange={() => handleToggleVisibility(column.key)}
                  className="scale-75"
                />
                <span className="text-sm truncate">{column.header}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditDialog(column)}
                  className="p-1 hover:bg-primary/10 rounded"
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
                {column.isCustom && (
                  <button
                    onClick={() => handleDelete(column.key)}
                    className="p-1 hover:bg-destructive/10 rounded"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isAddingNew ? 'Add Column' : 'Edit Column'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="header">Column Header</Label>
              <Input
                id="header"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                placeholder="Enter column header..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dataField">Data Field</Label>
              <Select value={dataField} onValueChange={setDataField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data field..." />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="format">Display Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="currency">Currency ($)</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="status">Status Badge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!header || !dataField}>
              {isAddingNew ? 'Add Column' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
