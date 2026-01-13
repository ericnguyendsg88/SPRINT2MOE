import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
  isEditMode: boolean;
}

export function DraggableSection({ id, children, isEditMode }: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'z-50 opacity-80',
        isEditMode && 'ring-2 ring-dashed ring-primary/30 rounded-lg'
      )}
    >
      {isEditMode && (
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}
