import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SubjectForm } from './SubjectForm';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isAddingSubject: boolean;
  onAddingSubjectChange: (value: boolean) => void;
  onCreateSubject: (data: { name: string; description?: string }) => void;
  onSearchAction?: (value: string) => void;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  isAddingSubject,
  onAddingSubjectChange,
  onCreateSubject,
  onSearchAction
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects or competencies..."
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            onSearchAction?.(e.target.value);
          }}
          className="pl-10"
        />
      </div>

      <Dialog open={isAddingSubject} onOpenChange={onAddingSubjectChange}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subject</DialogTitle>
          </DialogHeader>
          <SubjectForm onSubmit={onCreateSubject} />
        </DialogContent>
      </Dialog>
    </div>
  );
} 