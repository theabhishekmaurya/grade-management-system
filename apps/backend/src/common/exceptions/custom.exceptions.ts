import { HttpException, HttpStatus } from '@nestjs/common';

export class SubjectNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Subject with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class SubjectAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Subject with name '${name}' already exists`, HttpStatus.CONFLICT);
  }
}

export class CompetencyNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Competency with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class CompetencyAlreadyExistsException extends HttpException {
  constructor(name: string, subjectName: string) {
    super(
      `Competency with name '${name}' already exists in subject '${subjectName}'`,
      HttpStatus.CONFLICT,
    );
  }
}
