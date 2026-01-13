import React, { ReactNode } from 'react';
import { usePageLayout, SectionSize, LayoutItem, ColumnDefinition, CustomField, SectionType, FieldConfig } from '@/hooks/usePageLayout';
import { SortableContainer } from './SortableContainer';
import { ResizableSection } from './ResizableSection';
import { EditModeToggle } from './EditModeToggle';
import { SectionAdder, CustomSection } from './SectionAdder';
import { CustomSectionRenderer } from './CustomSectionRenderer';

export interface PageBuilderSection {
  id: string;
  title: string;
  render: (props: { isEditMode: boolean }) => ReactNode;
  // Optional: default column definitions for tables in this section
  defaultColumns?: ColumnDefinition[];
  availableFields?: { key: string; label: string }[];
}

interface PageBuilderProps {
  pageId: string;
  sections: PageBuilderSection[];
  children?: ReactNode;
  headerContent?: ReactNode;
  className?: string;
}

export function PageBuilder({ pageId, sections, children, headerContent, className = '' }: PageBuilderProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);
  
  const sectionIds = sections.map(s => s.id);
  
  const {
    layout,
    updateLayout,
    updateSectionSize,
    addSection,
    removeSection,
    updateCustomSection,
    resetLayout,
    getOrderedItems,
    isSaving,
    getTableColumns,
    updateTableColumns,
  } = usePageLayout(pageId, sectionIds);

  const handleAddSection = (section: CustomSection) => {
    addSection({
      type: section.type,
      title: section.title,
      fields: section.fields,
      tableDataSource: section.tableConfig?.dataSource,
    });
  };

  const getSectionSize = (sectionId: string): SectionSize => {
    const item = layout.find(l => l.id === sectionId);
    return item?.size || 'full';
  };

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const renderSection = (item: LayoutItem) => {
    // Check if it's a custom section
    if (item.isCustom && item.customConfig) {
      return (
        <CustomSectionRenderer
          key={item.id}
          section={item}
          isEditMode={isEditMode}
          onSizeChange={(size) => updateSectionSize(item.id, size)}
          onRemove={() => removeSection(item.id)}
          onUpdateConfig={(config) => updateCustomSection(item.id, config)}
        />
      );
    }

    // Find the matching section definition
    const sectionDef = sections.find(s => s.id === item.id);
    if (!sectionDef) return null;

    return (
      <ResizableSection
        key={item.id}
        id={item.id}
        size={getSectionSize(item.id)}
        onSizeChange={(size) => updateSectionSize(item.id, size)}
        isEditMode={isEditMode}
      >
        {sectionDef.render({ isEditMode })}
      </ResizableSection>
    );
  };

  const orderedItems = getOrderedItems();

  return (
    <div className={`space-y-6 animate-fade-in ${className}`}>
      {/* Edit Mode Toggle */}
      <EditModeToggle
        isEditMode={isEditMode}
        onToggle={toggleEditMode}
        isSaving={isSaving}
        onReset={resetLayout}
      />

      {/* Header Content */}
      {headerContent}

      {/* Main Content */}
      {children}

      {/* Sortable Sections */}
      <SortableContainer
        items={orderedItems}
        onReorder={updateLayout}
        isEditMode={isEditMode}
      >
        <div className="grid grid-cols-12 gap-6">
          {orderedItems.map(renderSection)}
        </div>
      </SortableContainer>

      {/* Section Adder */}
      {isEditMode && (
        <SectionAdder 
          isEditMode={isEditMode}
          onAddSection={handleAddSection} 
        />
      )}
    </div>
  );
}

// Context to share page builder state with child components
interface PageBuilderContextValue {
  isEditMode: boolean;
  getTableColumns: (tableId: string, defaultColumns: ColumnDefinition[]) => ColumnDefinition[];
  updateTableColumns: (tableId: string, columns: ColumnDefinition[]) => void;
}

const PageBuilderContext = React.createContext<PageBuilderContextValue | null>(null);

export function usePageBuilderContext() {
  return React.useContext(PageBuilderContext);
}

// Hook to use page builder in a simpler way - returns everything needed
export function usePageBuilder(pageId: string, sectionIds: string[]) {
  const [isEditMode, setIsEditMode] = React.useState(false);
  
  const layoutHook = usePageLayout(pageId, sectionIds);

  const handleAddSection = (section: CustomSection) => {
    layoutHook.addSection({
      type: section.type,
      title: section.title,
      fields: section.fields,
      tableDataSource: section.tableConfig?.dataSource,
    });
  };

  const getSectionSize = (sectionId: string): SectionSize => {
    const item = layoutHook.layout.find(l => l.id === sectionId);
    return item?.size || 'full';
  };

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  return {
    isEditMode,
    setIsEditMode,
    toggleEditMode,
    ...layoutHook,
    handleAddSection,
    getSectionSize,
  };
}

export type { ColumnDefinition, LayoutItem, SectionSize, CustomField, SectionType, FieldConfig };
