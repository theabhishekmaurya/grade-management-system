export interface Competency {
  id: string;
  name: string;
  marks: number;
  subjectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  competencies: Competency[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubjectRequest {
  name: string;
  description?: string;
}

export interface CreateCompetencyRequest {
  name: string;
  marks: number;
  subjectId: string;
}

export interface UpdateSubjectRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface UpdateCompetencyRequest {
  id: string;
  name?: string;
  marks?: number;
}