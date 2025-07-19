"use client";
import { useState } from 'react';
import { Competency } from '@/types/evaluation';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/subjects/SearchBar';
import { SubjectList } from '@/components/subjects/SubjectList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CompetencyForm } from '@/components/competencies/CompetencyForm';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useSubjects } from '@/hooks/useSubjects';

type Theme = 'modern' | 'academic';

export function SubjectsContainer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<Theme>('modern');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<Competency | null>(null);

  const { trackUIAction } = useEventTracking();
  const {
    subjects,
    isLoading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
    addCompetency,
    updateCompetency,
    deleteCompetency,
  } = useSubjects();

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.competencies.some((comp) =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const stats = {
    totalSubjects: subjects.length,
    totalCompetencies: subjects.reduce((sum, subject) => sum + subject.competencies.length, 0),
    totalMarks: subjects.reduce(
      (sum, subject) =>
        sum + subject.competencies.reduce((compSum, comp) => compSum + comp.marks, 0),
      0
    ),
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    trackUIAction('theme_change', newTheme);

    // Apply theme-specific CSS variables
    if (newTheme === 'academic') {
      document.documentElement.style.setProperty('--primary', '142 76% 36%');
      document.documentElement.style.setProperty('--accent', '38 92% 50%');
      document.documentElement.style.setProperty('--background', '0 0% 100%');
      document.documentElement.style.setProperty('--border', '214 31% 91%');
    } else {
      document.documentElement.style.setProperty('--primary', '217 91% 60%');
      document.documentElement.style.setProperty('--accent', '210 100% 88%');
      document.documentElement.style.setProperty('--background', '240 10% 98%');
      document.documentElement.style.setProperty('--border', '240 6% 90%');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        {...stats}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      <main className="max-w-7xl mx-auto py-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isAddingSubject={isAddingSubject}
          onAddingSubjectChange={setIsAddingSubject}
          onCreateSubject={createSubject}
          onSearchAction={(value) => trackUIAction('search', value)}
        />

        <SubjectList
          subjects={filteredSubjects}
          theme={theme}
          searchTerm={searchTerm}
          onAddSubject={() => setIsAddingSubject(true)}
          onEditSubject={updateSubject}
          onDeleteSubject={deleteSubject}
          onAddCompetency={addCompetency}
          onEditCompetency={setEditingCompetency}
          onDeleteCompetency={deleteCompetency}
          isLoading={isLoading}
        />

        {editingCompetency && (
          <Dialog
            open={!!editingCompetency}
            onOpenChange={() => setEditingCompetency(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Competency</DialogTitle>
              </DialogHeader>
              <CompetencyForm
                subjectId={editingCompetency.subjectId}
                competency={editingCompetency}
                onSubmit={(updatedData) => {
                  updateCompetency(editingCompetency.id, {
                    ...updatedData,
                    subjectId: editingCompetency.subjectId,
                  });
                  setEditingCompetency(null);
                }}
                onCancel={() => setEditingCompetency(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
} 