import { GraduationCap, CheckCircle, Clock, AlertTriangle, BookOpen, BarChart3, Plus } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { shelEducationModules } from '@data/shelbourneData';

const ShelEducationHub = () => {
  const categories = ['Safeguarding', 'Professional Standards', 'Performance Lifestyle', 'Welfare', 'Life Skills'];
  const stats = { totalModules: 8, completedModules: 5, playersFullyCompliant: 68, totalPlayers: 88, averageCompletion: 74 };

  return (
    <ShelDemoLayout role="admin" userName="Mark O'Reilly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Education Hub</h1>
        <p className="text-muted-foreground mt-1">Academy-wide education, welfare, and safeguarding compliance</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center"><BookOpen className="h-5 w-5 text-red-500" /></div><div><p className="text-2xl font-bold text-foreground">{stats.totalModules}</p><p className="text-xs text-muted-foreground">Active Modules</p></div></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-400" /></div><div><p className="text-2xl font-bold text-foreground">{stats.playersFullyCompliant}</p><p className="text-xs text-muted-foreground">Fully Compliant</p></div></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-400" /></div><div><p className="text-2xl font-bold text-foreground">14</p><p className="text-xs text-muted-foreground">In Progress</p></div></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center"><BarChart3 className="h-5 w-5 text-red-500" /></div><div><p className="text-2xl font-bold text-foreground">{stats.averageCompletion}%</p><p className="text-xs text-muted-foreground">Avg Completion</p></div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="modules">All Modules</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Report</TabsTrigger>
        </TabsList>
        <TabsContent value="modules" className="space-y-6">
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white"><Plus className="h-4 w-4 mr-2" /> Add Module</Button>
          {categories.map((category) => {
            const modules = shelEducationModules.filter(m => m.category === category);
            if (modules.length === 0) return null;
            return (
              <Card key={category} className="bg-card border-border">
                <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5 text-red-500" /> {category}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {modules.map((module) => {
                    const pct = Math.round((module.completedBy / module.totalPlayers) * 100);
                    return (
                      <div key={module.id} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{module.title}</h4>
                              {module.mandatory && <Badge variant="destructive" className="text-xs">Mandatory</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{module.duration} • {module.completedBy}/{module.totalPlayers} completed</p>
                          </div>
                          {pct === 100 ? <CheckCircle className="h-5 w-5 text-green-400" /> : pct < 70 && module.mandatory ? <AlertTriangle className="h-5 w-5 text-amber-400" /> : <Clock className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <Progress value={pct} className="h-2" />
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>{pct}% completion</span>
                          <span>{module.totalPlayers - module.completedBy} remaining</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="compliance">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Compliance by Squad</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {['U14 Boys', 'U15 Boys', 'U17 Boys', 'U19 Boys', 'U17 Girls', 'U19 Girls'].map((squad) => (
                <div key={squad} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500">{squad.split(' ')[0]}</span>
                      </div>
                      <div><h4 className="font-medium text-foreground">{squad}</h4></div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400">{Math.floor(70 + Math.random() * 25)}% compliant</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ShelDemoLayout>
  );
};
export default ShelEducationHub;
