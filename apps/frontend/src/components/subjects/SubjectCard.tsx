import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Plus, BookOpen, Award } from 'lucide-react';
import { Subject, Competency } from '@/types/evaluation';
import { CompetencyForm } from '../competencies/CompetencyForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
  onAddCompetency: (competency: Omit<Competency, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditCompetency: (competency: Competency) => void;
  onDeleteCompetency: (competencyId: string) => void;
  theme: 'modern' | 'academic';
}

export function SubjectCard({
  subject,
  onEdit,
  onDelete,
  onAddCompetency,
  onEditCompetency,
  onDeleteCompetency,
  theme
}: SubjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subject.name);
  const [editDescription, setEditDescription] = useState(subject.description || '');

  const handleSave = () => {
    onEdit({
      ...subject,
      name: editName,
      description: editDescription
    });
    setIsEditing(false);
  };

  const totalMarks = subject.competencies.reduce((sum, comp) => sum + comp.marks, 0);

  const cardClassName = theme === 'modern' 
    ? "bg-gradient-to-br from-card to-accent/10 border-2 hover:shadow-lg transition-all duration-300"
    : "bg-card border border-border hover:border-primary/50 transition-colors";

  return (
    <TooltipProvider>
      <Card className={cardClassName}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
              {isEditing ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="font-semibold"
                />
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardTitle className="text-lg truncate">{subject.name}</CardTitle>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    {subject.name}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                {totalMarks} marks
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(subject.id)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Subject description..."
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">Save</Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)} 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <CardDescription className="line-clamp-2">
                  {subject.description || 'No description'}
                </CardDescription>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="max-w-sm">
                {subject.description || 'No description'}
              </TooltipContent>
            </Tooltip>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Competencies ({subject.competencies.length})</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-3 w-3" />
                    Add Competency
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Competency</DialogTitle>
                  </DialogHeader>
                  <CompetencyForm
                    subjectId={subject.id}
                    onSubmit={(competency) => onAddCompetency(competency)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-2 max-h-40 overflow-y-auto pr-2">
              {subject.competencies.map((competency) => (
                <div
                  key={competency.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 gap-2"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium truncate min-w-0">{competency.name}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                      {competency.name}
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline">{competency.marks} pts</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCompetency(competency)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCompetency(competency.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {subject.competencies.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No competencies added yet
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}