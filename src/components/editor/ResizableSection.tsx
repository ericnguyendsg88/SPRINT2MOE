import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type SectionSize = 'full' | 'half' | 'third' | 'quarter';

interface ResizableSectionProps {
  id: string;
  children: React.ReactNode;
  isEditMode: boolean;
  size?: SectionSize;
  onSizeChange?: (size: SectionSize) => void;
}

const sizeLabels: Record<SectionSize, string> = {
  full: 'Full Width',
  half: 'Half Width',
  third: 'One Third',
  quarter: 'One Quarter',
};

const sizeClasses: Record<SectionSize, string> = {
  full: 'col-span-12',
  half: 'col-span-12 md:col-span-6',
  third: 'col-span-12 md:col-span-4',
  quarter: 'col-span-12 md:col-span-3',
};

export function ResizableSection({
  id,
  children,
  isEditMode,
  size = 'full',
  onSizeChange,
}: ResizableSectionProps) {
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
        isEditMode && 'ring-2 ring-dashed ring-primary/30 rounded-lg',
        sizeClasses[size]
      )}
    >
      {isEditMode && (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            {...attributes}
            {...listeners}
            className="p-2 rounded-lg bg-primary text-primary-foreground cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          {onSizeChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  aria-label="Resize section"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {(Object.keys(sizeLabels) as SectionSize[]).map((sizeOption) => (
                  <DropdownMenuItem
                    key={sizeOption}
                    onClick={() => onSizeChange(sizeOption)}
                    className={cn(size === sizeOption && 'bg-primary/10')}
                  >
                    {sizeLabels[sizeOption]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
