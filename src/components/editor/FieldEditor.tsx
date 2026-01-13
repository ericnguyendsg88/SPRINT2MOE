import { useState } from 'react';
import { GripVertical, Pencil, Eye, EyeOff, Check, X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface FieldDefinition {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

interface SortableFieldItemProps {
  field: FieldDefinition;
  isEditing: boolean;
  editValue: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditValueChange: (value: string) => void;
  onToggleVisibility: () => void;
}

function SortableFieldItem({
  field,
  isEditing,
  editValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange,
  onToggleVisibility,
}: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 rounded-md border ${
        isDragging ? 'bg-muted shadow-lg' : 'bg-background'
      } ${!field.visible ? 'opacity-50' : ''}`}
    >
      <button
        className="cursor-grab hover:bg-muted p-1 rounded"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            className="h-7 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit();
              if (e.key === 'Escape') onCancelEdit();
            }}
          />
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onSaveEdit}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onCancelEdit}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <>
          <span className="flex-1 text-sm">{field.label}</span>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onStartEdit}>
            <Pencil className="h-3 w-3" />
          </Button>
        </>
      )}

      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={onToggleVisibility}
      >
        {field.visible ? (
          <Eye className="h-3 w-3" />
        ) : (
          <EyeOff className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}

interface FieldEditorProps {
  fields: FieldDefinition[];
  onFieldsChange: (fields: FieldDefinition[]) => void;
  isEditMode: boolean;
}

export function FieldEditor({ fields, onFieldsChange, isEditMode }: FieldEditorProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.key === active.id);
      const newIndex = fields.findIndex((f) => f.key === over.id);
      const newFields = arrayMove(fields, oldIndex, newIndex).map((f, idx) => ({
        ...f,
        order: idx,
      }));
      onFieldsChange(newFields);
    }
  };

  const startEdit = (field: FieldDefinition) => {
    setEditingKey(field.key);
    setEditValue(field.label);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (!editingKey || !editValue.trim()) return;
    const newFields = fields.map((f) =>
      f.key === editingKey ? { ...f, label: editValue.trim() } : f
    );
    onFieldsChange(newFields);
    setEditingKey(null);
    setEditValue('');
  };

  const toggleVisibility = (key: string) => {
    const newFields = fields.map((f) =>
      f.key === key ? { ...f, visible: !f.visible } : f
    );
    onFieldsChange(newFields);
  };

  const visibleCount = fields.filter((f) => f.visible).length;
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  if (!isEditMode) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Fields ({visibleCount}/{fields.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-3">
        <p className="text-xs text-muted-foreground mb-2">
          Drag to reorder, click pencil to rename
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedFields.map((f) => f.key)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {sortedFields.map((field) => (
                <SortableFieldItem
                  key={field.key}
                  field={field}
                  isEditing={editingKey === field.key}
                  editValue={editValue}
                  onStartEdit={() => startEdit(field)}
                  onCancelEdit={cancelEdit}
                  onSaveEdit={saveEdit}
                  onEditValueChange={setEditValue}
                  onToggleVisibility={() => toggleVisibility(field.key)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
