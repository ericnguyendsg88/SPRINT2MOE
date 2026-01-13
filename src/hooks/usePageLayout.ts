import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SectionSize = 'full' | 'half' | 'third' | 'quarter';
export type SectionType = 'info-card' | 'table' | 'stats' | 'custom' | 'builtin';

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'currency' | 'date' | 'status';
}

export interface LayoutItem {
  id: string;
  order: number;
  size?: SectionSize;
  isCustom?: boolean;
  customConfig?: {
    type: SectionType;
    title: string;
    fields?: CustomField[];
    tableDataSource?: string;
  };
}

export interface ColumnDefinition {
  key: string;
  header: string;
  visible: boolean;
  dataField?: string;
  format?: 'text' | 'currency' | 'date' | 'status';
  isCustom?: boolean;
}

export interface FieldConfig {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface FieldsConfig {
  [sectionId: string]: FieldConfig[];
}

export interface TableColumnsConfig {
  [tableId: string]: ColumnDefinition[];
}

export interface PageLayout {
  items: LayoutItem[];
  tableColumns?: TableColumnsConfig;
  fieldConfigs?: FieldsConfig;
}

// Generate or retrieve session ID for anonymous users
const getSessionId = (): string => {
  const storageKey = 'page_layout_session_id';
  let sessionId = localStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(storageKey, sessionId);
  }
  return sessionId;
};

export function usePageLayout(pageId: string, defaultItems: string[]) {
  const [layout, setLayout] = useState<LayoutItem[]>(() => 
    defaultItems.map((id, index) => ({ id, order: index, size: 'full' as SectionSize }))
  );
  const [tableColumns, setTableColumns] = useState<TableColumnsConfig>({});
  const [fieldConfigs, setFieldConfigs] = useState<FieldsConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const sessionId = getSessionId();

  // Load layout from database
  useEffect(() => {
    const loadLayout = async () => {
      try {
        const { data, error } = await supabase
          .from('page_layouts')
          .select('layout')
          .eq('page_id', pageId)
          .eq('session_id', sessionId)
          .maybeSingle();

        if (error) {
          console.error('Error loading layout:', error);
          return;
        }

        if (data?.layout) {
          const savedLayout = data.layout as unknown as PageLayout;
          if (savedLayout.items && Array.isArray(savedLayout.items)) {
            // Merge saved layout with default items (in case new items were added)
            const savedIds = new Set(savedLayout.items.map(item => item.id));
            const missingItems = defaultItems
              .filter(id => !savedIds.has(id))
              .map((id, index) => ({ id, order: savedLayout.items.length + index, size: 'full' as SectionSize }));
            
            setLayout([...savedLayout.items, ...missingItems]);
          }
          if (savedLayout.tableColumns) {
            setTableColumns(savedLayout.tableColumns);
          }
          if (savedLayout.fieldConfigs) {
            setFieldConfigs(savedLayout.fieldConfigs);
          }
        }
      } catch (err) {
        console.error('Error loading layout:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayout();
  }, [pageId, sessionId, defaultItems]);

  // Save layout to database
  const saveLayoutData = async (newLayout: LayoutItem[], newTableColumns: TableColumnsConfig, newFieldConfigs: FieldsConfig) => {
    setIsSaving(true);
    try {
      const layoutData: PageLayout = { items: newLayout, tableColumns: newTableColumns, fieldConfigs: newFieldConfigs };
      
      const { error } = await supabase
        .from('page_layouts')
        .upsert({
          page_id: pageId,
          session_id: sessionId,
          layout: layoutData as any,
        }, {
          onConflict: 'page_id,session_id',
        });

      if (error) {
        console.error('Error saving layout:', error);
      }
    } catch (err) {
      console.error('Error saving layout:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateLayout = (newLayout: LayoutItem[]) => {
    setLayout(newLayout);
    saveLayoutData(newLayout, tableColumns, fieldConfigs);
  };

  const updateSectionSize = (sectionId: string, size: SectionSize) => {
    const newLayout = layout.map(item => 
      item.id === sectionId ? { ...item, size } : item
    );
    setLayout(newLayout);
    saveLayoutData(newLayout, tableColumns, fieldConfigs);
  };

  const getTableColumns = (tableId: string, defaultColumns: ColumnDefinition[]): ColumnDefinition[] => {
    return tableColumns[tableId] || defaultColumns;
  };

  const updateTableColumns = (tableId: string, columns: ColumnDefinition[]) => {
    const newTableColumns = {
      ...tableColumns,
      [tableId]: columns,
    };
    setTableColumns(newTableColumns);
    saveLayoutData(layout, newTableColumns, fieldConfigs);
  };

  const getFieldConfig = (sectionId: string, defaultFields: FieldConfig[]): FieldConfig[] => {
    const saved = fieldConfigs[sectionId];
    if (!saved) return defaultFields;
    
    // Merge saved config with defaults to include any new fields added
    const savedKeys = new Set(saved.map(f => f.key));
    const missingFields = defaultFields.filter(f => !savedKeys.has(f.key));
    
    if (missingFields.length > 0) {
      // Add missing fields with their default visibility and order at the end
      const maxOrder = Math.max(...saved.map(f => f.order), 0);
      const newFields = missingFields.map((f, i) => ({
        ...f,
        order: maxOrder + 1 + i,
      }));
      return [...saved, ...newFields];
    }
    
    return saved;
  };

  const updateFieldConfig = (sectionId: string, fields: FieldConfig[]) => {
    const newFieldConfigs = {
      ...fieldConfigs,
      [sectionId]: fields,
    };
    setFieldConfigs(newFieldConfigs);
    saveLayoutData(layout, tableColumns, newFieldConfigs);
  };

  const addSection = (config: {
    type: SectionType;
    title: string;
    fields?: CustomField[];
    tableDataSource?: string;
  }) => {
    const newSection: LayoutItem = {
      id: `custom_${Date.now()}`,
      order: layout.length,
      size: 'full',
      isCustom: true,
      customConfig: config,
    };
    const newLayout = [...layout, newSection];
    setLayout(newLayout);
    saveLayoutData(newLayout, tableColumns, fieldConfigs);
  };

  const removeSection = (sectionId: string) => {
    const newLayout = layout.filter(item => item.id !== sectionId);
    // Re-order remaining items
    const reorderedLayout = newLayout.map((item, index) => ({ ...item, order: index }));
    setLayout(reorderedLayout);
    saveLayoutData(reorderedLayout, tableColumns, fieldConfigs);
  };

  const updateCustomSection = (sectionId: string, config: Partial<LayoutItem['customConfig']>) => {
    const newLayout = layout.map(item => 
      item.id === sectionId && item.customConfig
        ? { ...item, customConfig: { ...item.customConfig, ...config } }
        : item
    );
    setLayout(newLayout);
    saveLayoutData(newLayout, tableColumns, fieldConfigs);
  };

  const resetLayout = async () => {
    const defaultLayout = defaultItems.map((id, index) => ({ id, order: index, size: 'full' as SectionSize }));
    setLayout(defaultLayout);
    setTableColumns({});
    setFieldConfigs({});
    await saveLayoutData(defaultLayout, {}, {});
  };

  const getOrderedItems = () => {
    return [...layout].sort((a, b) => a.order - b.order);
  };

  return {
    layout,
    updateLayout,
    updateSectionSize,
    addSection,
    removeSection,
    updateCustomSection,
    resetLayout,
    getOrderedItems,
    isLoading,
    isSaving,
    tableColumns,
    getTableColumns,
    updateTableColumns,
    fieldConfigs,
    getFieldConfig,
    updateFieldConfig,
  };
}
