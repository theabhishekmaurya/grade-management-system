import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

type Theme = 'modern' | 'academic';

interface ThemeToggleProps {
  onThemeChange: (theme: Theme) => void;
  currentTheme: Theme;
}

export function ThemeToggle({ onThemeChange, currentTheme }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Palette className="h-4 w-4" />
      <Button
        variant={currentTheme === 'modern' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onThemeChange('modern')}
      >
        Modern Dashboard
      </Button>
      <Button
        variant={currentTheme === 'academic' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onThemeChange('academic')}
      >
        Academic Portal
      </Button>
    </div>
  );
}