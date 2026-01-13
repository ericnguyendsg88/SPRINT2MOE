import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  isEditMode: boolean;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'date' | 'tel';
}

export function EditableText({
  value,
  onSave,
  isEditMode,
  className,
  inputClassName,
  placeholder = 'Enter value...',
  type = 'text',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditMode) {
    return <span className={className}>{value || '—'}</span>;
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={cn(
            'px-2 py-1 text-sm border border-primary rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary/50',
            inputClassName
          )}
          placeholder={placeholder}
        />
        <button
          onClick={handleSave}
          className="p-1 text-success hover:bg-success/10 rounded"
        >
          <Check className="h-3 w-3" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-destructive hover:bg-destructive/10 rounded"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={cn(
        'group cursor-pointer inline-flex items-center gap-1 hover:bg-primary/10 px-1 -mx-1 rounded transition-colors',
        className
      )}
    >
      {value || '—'}
      <Pencil className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </span>
  );
}
