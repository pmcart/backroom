import { TrendingUp, TrendingDown, AlertTriangle, Moon, Droplets, Heart, Activity, Users } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';

const ShelMonitoring = () => {
  const wellnessAverages = { sleep: 4.0, nutrition: 3.7, hydration: 4.1, recovery: 3.8, mood: 3.9 };
  const alertPlayers = [
    { name: 'Jack Whelan', issue: 'Low sleep scores (3 days)', severity: 'high' },
    { name: 'Ellen Molloy', issue: 'Recovery concern — returning from injury', severity: 'medium' },
    { name: 'Ciarán Kilduff', issue: 'Missed check-ins (2 days)', severity: 'low' },
  ];
  const squadAverages = [
    { squad: 'U19 Boys', sleep: 4.2, nutrition: 3.9, hydration: 4.2, recovery: 4.0, mood: 4.1, compliance: 92 },
    { squad: 'U17 Boys', sleep: 3.8, nutrition: 3.6, hydration: 3.9, recovery: 3.7, mood: 3.8, compliance: 85 },
    { squad: 'U19 Girls', sleep: 4.1, nutrition: 4.0, hydration: 4.3, recovery: 4.1, mood: 4.2, compliance: 90 },
    { squad: 'U17 Girls', sleep: 3.9, nutrition: 3.5, hydration: 4.0, recovery: 3.6, mood: 3.9, compliance: 82 },
  ];
  const getScoreColor = (s: number) => s >= 4 ? 'text-green-400' : s >= 3 ? 'text-amber-400' : 'text-red-400';

  return (
    <ShelDemoLayout role="admin" userName="Mark O'Reilly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Player Monitoring</h1>
        <p className="text-muted-foreground mt-1">Academy-wide wellness and lifestyle data</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Moon className="h-6 w-6 text-blue-400 mx-auto mb-2" /><p className={`text-2xl font-bold ${getScoreColor(wellnessAverages.sleep)}`}>{wellnessAverages.sleep}</p><p className="text-xs text-muted-foreground">Avg Sleep</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Activity className="h-6 w-6 text-green-400 mx-auto mb-2" /><p className={`text-2xl font-bold ${getScoreColor(wellnessAverages.nutrition)}`}>{wellnessAverages.nutrition}</p><p className="text-xs text-muted-foreground">Avg Nutrition</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Droplets className="h-6 w-6 text-cyan-400 mx-auto mb-2" /><p className={`text-2xl font-bold ${getScoreColor(wellnessAverages.hydration)}`}>{wellnessAverages.hydration}</p><p className="text-xs text-muted-foreground">Avg Hydration</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" /><p className={`text-2xl font-bold ${getScoreColor(wellnessAverages.recovery)}`}>{wellnessAverages.recovery}</p><p className="text-xs text-muted-foreground">Avg Recovery</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Users className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">87%</p><p className="text-xs text-muted-foreground">Check-in Rate</p></CardContent></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-400" /> Attention Required</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alertPlayers.map((p, i) => (
              <div key={i} className={`p-3 rounded-lg ${p.severity === 'high' ? 'bg-red-500/10 border border-red-500/20' : p.severity === 'medium' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-muted/30'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <Badge variant="outline" className={p.severity === 'high' ? 'bg-red-500/20 text-red-400' : p.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-muted text-muted-foreground'}>{p.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{p.issue}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">View All Alerts</Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Squad Wellness Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {squadAverages.map((squad) => (
                <div key={squad.squad} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500">{squad.squad.split(' ')[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{squad.squad}</h4>
                        <p className="text-sm text-muted-foreground">{squad.compliance}% check-in compliance</p>
                      </div>
                    </div>
                    {squad.compliance >= 90 ? <TrendingUp className="h-5 w-5 text-green-400" /> : <TrendingDown className="h-5 w-5 text-amber-400" />}
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[{ l: 'Sleep', v: squad.sleep }, { l: 'Nutrition', v: squad.nutrition }, { l: 'Hydration', v: squad.hydration }, { l: 'Recovery', v: squad.recovery }, { l: 'Mood', v: squad.mood }].map(m => (
                      <div key={m.l}>
                        <p className={`text-lg font-bold ${getScoreColor(m.v)}`}>{m.v}</p>
                        <p className="text-xs text-muted-foreground">{m.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 bg-card border-border">
        <CardHeader><CardTitle className="font-display text-lg">Academy Wellness Trend (Last 7 Days)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const h = [75, 80, 72, 85, 88, 90, 82][i];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-red-500/50 to-red-700/50 rounded-t" style={{ height: `${h}%` }} />
                  <span className="text-xs text-muted-foreground">{day}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </ShelDemoLayout>
  );
};
export default ShelMonitoring;
