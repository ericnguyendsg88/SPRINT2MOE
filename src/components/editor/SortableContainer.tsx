import { ReactNode, useMemo } from 'react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { LayoutItem } from '@/hooks/usePageLayout';

interface SortableContainerProps {
  items: LayoutItem[];
  onReorder: (items: LayoutItem[]) => void;
  isEditMode: boolean;
  children: ReactNode;
}

export function SortableContainer({ 
  items, 
  onReorder, 
  isEditMode, 
  children 
}: SortableContainerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedIds = useMemo(
    () => [...items].sort((a, b) => a.order - b.order).map(item => item.id),
    [items]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedIds.indexOf(active.id as string);
      const newIndex = sortedIds.indexOf(over.id as string);
      
      const newSortedIds = arrayMove(sortedIds, oldIndex, newIndex);
      const newItems = newSortedIds.map((id, index) => ({
        id,
        order: index,
      }));
      
      onReorder(newItems);
    }
  };

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
