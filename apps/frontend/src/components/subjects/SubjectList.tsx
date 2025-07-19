import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Subject, Competency } from '@/types/evaluation';
import { SubjectCard } from './SubjectCard';

interface SubjectListProps {
  subjects: Subject[];
  theme: 'modern' | 'academic';
  searchTerm: string;
  onAddSubject: () => void;
  onEditSubject: (id: string, data: { name: string; description?: string }) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddCompetency: (competency: Omit<Competency, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditCompetency: (competency: Competency) => void;
  onDeleteCompetency: (competencyId: string) => void;
  isLoading?: boolean;
}

export function SubjectList({
  subjects,
  theme,
  searchTerm,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onAddCompetency,
  onEditCompetency,
  onDeleteCompetency,
  isLoading
}: SubjectListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            theme={theme}
            onEdit={(updatedSubject) => onEditSubject(updatedSubject.id, {
              name: updatedSubject.name,
              description: updatedSubject.description
            })}
            onDelete={onDeleteSubject}
            onAddCompetency={onAddCompetency}
            onEditCompetency={onEditCompetency}
            onDeleteCompetency={onDeleteCompetency}
          />
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? 'No subjects found' : 'No subjects yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first subject to get started with evaluation management'}
          </p>
          {!searchTerm && (
            <Button onClick={onAddSubject}>
              <Plus className="h-4 w-4 mr-2" />
              Create Subject
            </Button>
          )}
        </div>
      )}
    </>
  );
} 