import api from './api';
import { Competency } from '@/types/evaluation';
import { toast } from 'sonner';

export interface CreateCompetencyDto {
  name: string;
  marks: number;
  subjectId: string;
}

export interface UpdateCompetencyDto {
  name?: string;
  marks?: number;
}

export const CompetenciesService = {
  // Get all competencies for a subject
  getAllBySubject: async (subjectId: string): Promise<Competency[]> => {
    try {
      const response = await api.get(`/subjects/${subjectId}/competencies`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch competencies for this subject');
      throw error;
    }
  },

  // Get a single competency
  getById: async (id: string): Promise<Competency> => {
    try {
      const response = await api.get(`/competencies/${id}`);
      return response.data;
    } catch (error) {
      toast.error(`Failed to fetch competency details`);
      throw error;
    }
  },

  // Create a new competency
  create: async (data: CreateCompetencyDto): Promise<Competency> => {
    try {
      const response = await api.post(`/subjects/${data.subjectId}/competencies`, {
        name: data.name,
        marks: data.marks,
      });
      toast.success(`Competency "${data.name}" created successfully`);
      return response.data;
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Failed to create competency';
      toast.error(`Failed to create competency: ${data.name} ${errorMessage}`);
      throw error;
    }
  },

  // Update a competency
  update: async (id: string, data: UpdateCompetencyDto): Promise<Competency> => {
    try {
      const response = await api.patch(`/competencies/${id}`, data);
      toast.success(`Competency ${data.name ? `"${data.name}"` : ''} updated successfully`);
      return response.data;
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Failed to update competency';
      toast.error(`Failed to update competency: ${errorMessage}`);
      throw error;
    }
  },

  // Delete a competency
  delete: async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/competencies/${id}`);
      toast.success('Competency deleted successfully');
      return response.data;
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete competency';
      toast.error(`Failed to delete competency: ${errorMessage}`);
      throw error;
    }
  },
}; 