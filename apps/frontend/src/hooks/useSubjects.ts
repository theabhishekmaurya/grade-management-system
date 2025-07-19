import { useState, useEffect, useCallback } from 'react';
import { Subject } from '@/types/evaluation';
import { SubjectsService, CreateSubjectDto } from '@/services/subjects.service';
import { CompetenciesService, CreateCompetencyDto } from '@/services/competencies.service';
import { useToast } from '@/hooks/use-toast';
import { useEventTracking } from '@/hooks/useEventTracking';

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { trackSubjectAction, trackCompetencyAction } = useEventTracking();

  // Fetch all subjects
  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const subjects = await SubjectsService.getAll();
      setSubjects(subjects);
    } catch (err) {
      setError('Failed to fetch subjects');
      toast({
        title: 'Error',
        description: 'Failed to fetch subjects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Create subject
  const createSubject = async (data: CreateSubjectDto) => {
    try {
      const newSubject = await SubjectsService.create(data);
      setSubjects((prev) => [...prev, newSubject]);
      trackSubjectAction('create', data.name);
      toast({
        title: 'Success',
        description: `${data.name} has been created successfully.`,
      });
      return newSubject;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create subject',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update subject
  const updateSubject = async (id: string, data: CreateSubjectDto) => {
    try {
      const updatedSubject = await SubjectsService.update(id, data);
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === id ? updatedSubject : subject
        )
      );
      trackSubjectAction('edit', data.name);
      toast({
        title: 'Success',
        description: `${data.name} has been updated successfully.`,
      });
      return updatedSubject;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update subject',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete subject
  const deleteSubject = async (id: string) => {
    try {
      await SubjectsService.delete(id);
      const subject = subjects.find((s) => s.id === id);
      setSubjects((prev) => prev.filter((subject) => subject.id !== id));
      trackSubjectAction('delete', subject?.name);
      toast({
        title: 'Success',
        description: 'Subject has been deleted successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete subject',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Add competency
  const addCompetency = async (data: CreateCompetencyDto) => {
    try {
      const newCompetency = await CompetenciesService.create(data);
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === data.subjectId
            ? {
                ...subject,
                competencies: [...subject.competencies, newCompetency],
              }
            : subject
        )
      );
      trackCompetencyAction('create', data.name, data.marks);
      toast({
        title: 'Success',
        description: `${data.name} has been added successfully.`,
      });
      return newCompetency;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add competency',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update competency
  const updateCompetency = async (id: string, data: CreateCompetencyDto) => {
    try {
      const updatedCompetency = await CompetenciesService.update(id, data);
      setSubjects((prev) =>
        prev.map((subject) => ({
          ...subject,
          competencies: subject.competencies.map((comp) =>
            comp.id === id ? updatedCompetency : comp
          ),
        }))
      );
      trackCompetencyAction('edit', data.name, data.marks);
      toast({
        title: 'Success',
        description: `${data.name} has been updated successfully.`,
      });
      return updatedCompetency;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update competency',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete competency
  const deleteCompetency = async (id: string) => {
    try {
      await CompetenciesService.delete(id);
      const competency = subjects
        .flatMap((s) => s.competencies)
        .find((c) => c.id === id);
      setSubjects((prev) =>
        prev.map((subject) => ({
          ...subject,
          competencies: subject.competencies.filter((comp) => comp.id !== id),
        }))
      );
      trackCompetencyAction('delete', competency?.name);
      toast({
        title: 'Success',
        description: 'Competency has been deleted successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete competency',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    subjects,
    isLoading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
    addCompetency,
    updateCompetency,
    deleteCompetency,
    refreshSubjects: fetchSubjects,
  };
} 