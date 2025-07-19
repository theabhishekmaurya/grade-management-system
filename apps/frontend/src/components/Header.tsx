import { BookOpen, Users, Award, BarChart3 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  totalSubjects: number;
  totalCompetencies: number;
  totalMarks: number;
  theme: 'modern' | 'academic';
  onThemeChange: (theme: 'modern' | 'academic') => void;
}

export function Header({
  totalSubjects,
  totalCompetencies,
  totalMarks,
  theme,
  onThemeChange
}: HeaderProps) {
  const headerClassName =
    theme === 'modern'
      ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
      : 'bg-card border-b-2 border-primary text-foreground';

  return (
    <header className={`${headerClassName} p-6 shadow-lg`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              Grade Management System
            </h1>
            <p className="text-lg opacity-90 mt-1">
              Manage subjects and competencies for educational assessments
            </p>
          </div>
          <ThemeToggle currentTheme={theme} onThemeChange={onThemeChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalSubjects}</div>
            <div className="text-sm opacity-90">Subjects</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalCompetencies}</div>
            <div className="text-sm opacity-90">Competencies</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalMarks}</div>
            <div className="text-sm opacity-90">Total Marks</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <BarChart3 className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round((totalMarks / Math.max(totalCompetencies, 1)) * 10) / 10}
            </div>
            <div className="text-sm opacity-90">Avg. Marks</div>
          </div>
        </div>
      </div>
    </header>
  );
} 