import { MousePointer2, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EditModeToggleProps {
  isEditMode: boolean;
  onToggle: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

export function EditModeToggle({ isEditMode, onToggle, onReset, isSaving }: EditModeToggleProps) {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
      {isEditMode && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="bg-background shadow-lg"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Layout
        </Button>
      )}
      <Button
        onClick={onToggle}
        size="sm"
        className={cn(
          'shadow-lg transition-all',
          isEditMode 
            ? 'bg-success hover:bg-success/90 text-success-foreground' 
            : 'bg-primary hover:bg-primary/90'
        )}
      >
        {isEditMode ? (
          <>
            {isSaving ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Done Editing'}
          </>
        ) : (
          <>
            <MousePointer2 className="h-4 w-4 mr-2" />
            Edit Layout
          </>
        )}
      </Button>
    </div>
  );
}
