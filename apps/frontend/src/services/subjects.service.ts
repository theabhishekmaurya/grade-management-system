import api from './api';
import { Subject } from '@/types/evaluation';
import { toast } from 'sonner';

export interface CreateSubjectDto {
  name: string;
  description?: string;
}

export interface UpdateSubjectDto extends CreateSubjectDto {
  id: string;
}

export const SubjectsService = {
  // Get all subjects
  getAll: async (): Promise<Subject[]> => {
    try {
      const response = await api.get('/subjects');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch subjects');
      throw error;
    }
  },

  // Get a single subject by ID
  getById: async (id: string): Promise<Subject> => {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      toast.error(`Failed to fetch subject with ID: ${id}`);
      throw error;
    }
  },

  // Create a new subject
  create: async (data: CreateSubjectDto): Promise<Subject> => {
    try {
      const response = await api.post('/subjects', data);
      toast.success(`Subject "${data.name}" created successfully`);
      return response.data;
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Failed to create subject';
      toast.error(`Failed to create subject: ${data.name} ${errorMessage}`);
      throw error;
    }
  },

  // Update a subject
  update: async (id: string, data: CreateSubjectDto): Promise<Subject> => {
    try {
      const response = await api.patch(`/subjects/${id}`, data);
      toast.success(`Subject "${data.name}" updated successfully`);
      return response.data;
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Failed to update subject';
      toast.error(`Failed to update subject: ${data.name} ${errorMessage}`);
      throw error;
    }
  },

  // Delete a subject
  delete: async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/subjects/${id}`);
      toast.success('Subject deleted successfully');
      return response.data;
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete subject';
      toast.error(`Failed to delete subject: ${errorMessage}`);
      throw error;
    }
  },
}; 