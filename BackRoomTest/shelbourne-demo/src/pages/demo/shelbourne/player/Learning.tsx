import { GraduationCap } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { shelEducationModules } from '@data/shelbourneData';

const ShelLearning = () => (
  <ShelDemoLayout role="player" userName="Aaron Connolly">
    <div className="mb-8">
      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Learning</h1>
      <p className="text-muted-foreground mt-1">Education modules and resources</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {shelEducationModules.map((module, i) => {
        const status = i < 2 ? 'completed' : i < 4 ? 'in-progress' : 'not-started';
        const progress = status === 'completed' ? 100 : status === 'in-progress' ? 45 : 0;
        return (
          <Card key={module.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-red-500" />
                </div>
                {module.mandatory && <Badge variant="destructive" className="text-xs">Required</Badge>}
              </div>
              <h4 className="font-medium text-foreground mb-1">{module.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{module.category} • {module.duration}</p>
              <Progress value={progress} className="h-1.5 mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{progress}% complete</span>
                <Button size="sm" variant={status === 'completed' ? 'outline' : 'default'} className={status !== 'completed' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>
                  {status === 'completed' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </ShelDemoLayout>
);
export default ShelLearning;
