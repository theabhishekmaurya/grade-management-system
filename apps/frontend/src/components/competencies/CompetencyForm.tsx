import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Competency } from '@/types/evaluation';

interface CompetencyFormProps {
  subjectId: string;
  competency?: Competency;
  onSubmit: (competency: Omit<Competency, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

export function CompetencyForm({ subjectId, competency, onSubmit, onCancel }: CompetencyFormProps) {
  const [name, setName] = useState(competency?.name || '');
  const [marks, setMarks] = useState(competency?.marks?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const marksValue = parseInt(marks);
    if (!name || isNaN(marksValue) || marksValue < 0 || marksValue > 10) {
      return;
    }

    onSubmit({
      name,
      marks: marksValue,
      subjectId
    });

    // Reset form if not editing
    if (!competency) {
      setName('');
      setMarks('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="competency-name">Competency Name</Label>
        <Input
          id="competency-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Arrays, LinkedLists, Trees"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="competency-marks">Marks (0-10)</Label>
        <Input
          id="competency-marks"
          type="number"
          min="0"
          max="10"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          placeholder="Enter marks (0-10)"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {competency ? 'Update' : 'Add'} Competency
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}