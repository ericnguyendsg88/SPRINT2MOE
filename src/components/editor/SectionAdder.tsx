import { useState } from 'react';
import { Plus, LayoutGrid, Table, CreditCard, FileText } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type SectionType = 'info-card' | 'table' | 'stats' | 'custom';

export interface CustomSection {
  id: string;
  type: SectionType;
  title: string;
  icon?: string;
  fields?: CustomField[];
  tableConfig?: TableConfig;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'currency' | 'date' | 'status';
}

export interface TableConfig {
  columns: { key: string; header: string }[];
  dataSource: string;
}

interface SectionAdderProps {
  isEditMode: boolean;
  onAddSection: (section: CustomSection) => void;
  availableDataSources?: { key: string; label: string }[];
}

const sectionTypes = [
  {
    type: 'info-card' as SectionType,
    label: 'Information Card',
    description: 'Display key-value information like Student Information',
    icon: FileText,
  },
  {
    type: 'table' as SectionType,
    label: 'Table Module',
    description: 'Display data in a table format like Enrolled Courses',
    icon: Table,
  },
  {
    type: 'stats' as SectionType,
    label: 'Stats Cards',
    description: 'Display metrics in card format like Balance, Courses count',
    icon: LayoutGrid,
  },
];

export function SectionAdder({ isEditMode, onAddSection, availableDataSources = [] }: SectionAdderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<'select-type' | 'configure'>('select-type');
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);
  
  // Configuration state
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<CustomField[]>([
    { id: '1', label: '', value: '', type: 'text' },
  ]);
  const [dataSource, setDataSource] = useState('');

  if (!isEditMode) return null;

  const resetForm = () => {
    setStep('select-type');
    setSelectedType(null);
    setTitle('');
    setFields([{ id: '1', label: '', value: '', type: 'text' }]);
    setDataSource('');
  };

  const handleSelectType = (type: SectionType) => {
    setSelectedType(type);
    setStep('configure');
  };

  const handleAddField = () => {
    setFields([...fields, { id: Date.now().toString(), label: '', value: '', type: 'text' }]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleFieldChange = (id: string, key: keyof CustomField, value: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const handleCreate = () => {
    if (!selectedType || !title) return;

    const newSection: CustomSection = {
      id: `custom_${Date.now()}`,
      type: selectedType,
      title,
      fields: selectedType === 'info-card' ? fields.filter(f => f.label) : undefined,
      tableConfig: selectedType === 'table' ? {
        columns: [],
        dataSource,
      } : undefined,
    };

    onAddSection(newSection);
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        className="w-full border-dashed border-2 h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
      >
        <Plus className="h-6 w-6" />
        <span>Add New Section</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {step === 'select-type' ? 'Add New Section' : `Configure ${sectionTypes.find(t => t.type === selectedType)?.label}`}
            </DialogTitle>
          </DialogHeader>

          {step === 'select-type' ? (
            <div className="grid gap-3 py-4">
              {sectionTypes.map((sectionType) => (
                <Card
                  key={sectionType.type}
                  className={cn(
                    'cursor-pointer transition-all hover:border-primary hover:shadow-md',
                    selectedType === sectionType.type && 'border-primary bg-primary/5'
                  )}
                  onClick={() => handleSelectType(sectionType.type)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <sectionType.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{sectionType.label}</p>
                      <p className="text-sm text-muted-foreground">{sectionType.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Additional Information"
                />
              </div>

              {selectedType === 'info-card' && (
                <div className="grid gap-3">
                  <Label>Fields</Label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        placeholder="Label"
                        value={field.label}
                        onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Default value"
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Select
                        value={field.type}
                        onValueChange={(v) => handleFieldChange(field.id, 'type', v)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="currency">Currency</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                      </Select>
                      {fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(field.id)}
                          className="text-destructive"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddField}
                    className="w-fit"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </Button>
                </div>
              )}

              {selectedType === 'table' && (
                <div className="grid gap-2">
                  <Label>Data Source</Label>
                  <Select value={dataSource} onValueChange={setDataSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDataSources.map((source) => (
                        <SelectItem key={source.key} value={source.key}>
                          {source.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom (Empty Table)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    You can configure columns after adding the section
                  </p>
                </div>
              )}

              {selectedType === 'stats' && (
                <div className="grid gap-3">
                  <Label>Stat Cards</Label>
                  {fields.map((field) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        placeholder="Label (e.g., Total Balance)"
                        value={field.label}
                        onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value (e.g., $1,000)"
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                        className="flex-1"
                      />
                      {fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(field.id)}
                          className="text-destructive"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddField}
                    className="w-fit"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Stat Card
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {step === 'configure' && (
              <Button variant="outline" onClick={() => setStep('select-type')}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {step === 'configure' && (
              <Button onClick={handleCreate} disabled={!title}>
                Add Section
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
