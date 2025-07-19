import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Subject } from '@/types/evaluation';

interface SubjectFormProps {
  subject?: Subject;
  onSubmit: (subject: { name: string; description?: string }) => void;
  onCancel?: () => void;
}

export function SubjectForm({ subject, onSubmit, onCancel }: SubjectFormProps) {
  const [name, setName] = useState(subject?.name || '');
  const [description, setDescription] = useState(subject?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined
    });

    // Reset form if not editing
    if (!subject) {
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="subject-name">Subject Name</Label>
        <Input
          id="subject-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Data Structures, Cloud Computing, Networking"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="subject-description">Description (Optional)</Label>
        <Textarea
          id="subject-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the subject..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {subject ? 'Update' : 'Create'} Subject
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