import { CheckCircle, Clock, Award, Users } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { shelEducationModules } from '@data/shelbourneData';

const ShelCoachEducation = () => {
  // Player / squad education modules (primary focus)
  const playerModules = [
    { id: 'pm1', title: 'Understanding the Game Model', category: 'Player Development', duration: '30 min', progress: 0, status: 'not-started', description: 'How the club plays — principles of play explained for players' },
    { id: 'pm2', title: 'Positional Roles & Responsibilities', category: 'Player Development', duration: '25 min', progress: 40, status: 'in-progress', description: 'Role clarity for each position within the team structure' },
    { id: 'pm3', title: 'Decision-Making Under Pressure', category: 'Player Development', duration: '20 min', progress: 75, status: 'in-progress', description: 'Developing game intelligence through scenario-based learning' },
    { id: 'pm4', title: 'Mental Health & Wellbeing', category: 'Welfare', duration: '40 min', progress: 100, status: 'completed', description: 'Recognising and managing mental health challenges as a young athlete' },
    { id: 'pm5', title: 'Nutrition for Training & Match Days', category: 'Performance Lifestyle', duration: '25 min', progress: 100, status: 'completed', description: 'Practical nutrition guidance for underage players' },
    { id: 'pm6', title: 'Anti-Doping Awareness', category: 'Safeguarding', duration: '45 min', progress: 60, status: 'in-progress', description: 'Understanding prohibited substances and responsibilities' },
  ];

  // Coach personal development (secondary focus)
  const coachModules = [
    { id: 'cm1', title: 'Safeguarding Level 2', category: 'Mandatory', duration: '2 hours', progress: 100, status: 'completed' },
    { id: 'cm2', title: 'Emergency First Aid', category: 'Mandatory', duration: '4 hours', progress: 100, status: 'completed' },
    { id: 'cm3', title: 'Performance Analysis for Coaches', category: 'CPD', duration: '3 hours', progress: 25, status: 'in-progress' },
    { id: 'cm4', title: 'Youth Development Psychology', category: 'CPD', duration: '2 hours', progress: 0, status: 'not-started' },
  ];

  return (
    <ShelDemoLayout role="coach" userName="Alan Quinn">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Education</h1>
        <p className="text-muted-foreground mt-1">Player education, squad learning, and coach development</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Users className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">6</p><p className="text-xs text-muted-foreground">Player Modules</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">2</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">74%</p><p className="text-xs text-muted-foreground">Squad Compliance</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Award className="h-6 w-6 text-amber-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">3</p><p className="text-xs text-muted-foreground">Coach Certificates</p></CardContent></Card>
      </div>

      <Tabs defaultValue="player-education" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2">
          <TabsTrigger value="player-education">Player Education</TabsTrigger>
          <TabsTrigger value="squad-compliance">Squad Compliance</TabsTrigger>
          <TabsTrigger value="coach-development">Coach Development</TabsTrigger>
        </TabsList>

        {/* Player Education — Primary Focus */}
        <TabsContent value="player-education" className="space-y-4">
          <Card className="bg-gradient-to-r from-red-500/5 to-red-700/5 border-red-500/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Squad Learning</span> — These modules help players develop their understanding of the game, the club's playing philosophy, and their responsibilities as young athletes. Progress is tracked collectively and individually.</p>
            </CardContent>
          </Card>

          {playerModules.map(m => (
            <Card key={m.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{m.title}</h4>
                      <Badge variant="outline" className={
                        m.category === 'Player Development' ? 'bg-red-500/20 text-red-500' :
                        m.category === 'Welfare' ? 'bg-blue-500/20 text-blue-400' :
                        m.category === 'Safeguarding' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-green-500/20 text-green-400'
                      }>{m.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.duration}</p>
                  </div>
                  <Badge variant="outline" className={
                    m.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    m.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-muted text-muted-foreground'
                  }>{m.status.replace('-', ' ')}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={m.progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-foreground">{m.progress}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Squad Compliance */}
        <TabsContent value="squad-compliance" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Module Completion — U17 Boys</CardTitle>
              <CardDescription>Monitor which players have completed required modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shelEducationModules.filter(m => m.mandatory).map(m => {
                const pct = Math.round((m.completedBy / m.totalPlayers) * 100);
                return (
                  <div key={m.id} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground text-sm">{m.title}</h4>
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    </div>
                    <Progress value={pct} className="h-1.5 mb-1" />
                    <p className="text-xs text-muted-foreground">{m.completedBy}/{m.totalPlayers} completed ({pct}%)</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coach Development — Secondary Focus */}
        <TabsContent value="coach-development" className="space-y-4">
          <Card className="bg-gradient-to-r from-red-500/5 to-red-700/5 border-red-500/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Your Development</span> — Continue building your coaching knowledge and qualifications. Complete mandatory requirements and explore CPD opportunities to support your practice.</p>
            </CardContent>
          </Card>

          {coachModules.map(m => (
            <Card key={m.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{m.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={m.category === 'Mandatory' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}>{m.category}</Badge>
                      <span className="text-sm text-muted-foreground">{m.duration}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    m.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    m.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-muted text-muted-foreground'
                  }>{m.status.replace('-', ' ')}</Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{m.progress}%</span>
                  </div>
                  <Progress value={m.progress} className="h-2" />
                </div>
                <Button variant={m.status === 'completed' ? 'outline' : 'default'} size="sm" className={m.status !== 'completed' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>
                  {m.status === 'completed' ? 'View Certificate' : m.status === 'in-progress' ? 'Continue' : 'Start'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </ShelDemoLayout>
  );
};

export default ShelCoachEducation;
