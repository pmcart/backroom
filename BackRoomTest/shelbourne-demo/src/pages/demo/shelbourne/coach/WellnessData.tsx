import { Moon, Droplets, Heart, Activity, TrendingUp, TrendingDown, AlertTriangle, Users } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { useShelAcademy } from '@contexts/ShelAcademyContext';
import { COACH_CONFIG } from '@data/shelCoachConfig';
import { shelWellnessData } from '@data/shelbourneData';

const ShelWellnessData = () => {
  const { checkins } = useShelAcademy();
  const teamCheckins = checkins.filter(c => c.ageGroup === COACH_CONFIG.assignedAgeGroup);

  const getScoreColor = (s: number) => s >= 4 ? 'text-green-400' : s >= 3 ? 'text-amber-400' : 'text-red-400';
  const getScoreBg = (s: number) => s >= 4 ? 'bg-green-500' : s >= 3 ? 'bg-amber-500' : 'bg-red-500';

  // Compute averages from live check-in data
  const avgSleep = teamCheckins.length > 0 ? (teamCheckins.reduce((s, c) => s + c.wellness.sleep, 0) / teamCheckins.length) : 3.8;
  const avgNutrition = teamCheckins.length > 0 ? (teamCheckins.reduce((s, c) => s + c.wellness.nutrition, 0) / teamCheckins.length) : 3.8;
  const avgHydration = teamCheckins.length > 0 ? (teamCheckins.reduce((s, c) => s + c.wellness.hydration, 0) / teamCheckins.length) : 4.0;
  const avgRecovery = teamCheckins.length > 0 ? (teamCheckins.reduce((s, c) => s + c.wellness.recovery, 0) / teamCheckins.length) : 3.6;
  const checkinRate = Math.round((teamCheckins.length / 19) * 100);

  // Attention needed
  const redCheckins = teamCheckins.filter(c => c.overallLevel === 'red');
  const amberCheckins = teamCheckins.filter(c => c.overallLevel === 'amber');

  return (
    <ShelDemoLayout role="coach" userName="Alan Quinn">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Wellness Data</h1>
        <p className="text-muted-foreground mt-1">U17 Boys — wellness monitoring and lifestyle tracking</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Moon className="h-6 w-6 text-blue-400 mx-auto mb-2" /><p className={`text-2xl font-bold ${getScoreColor(avgSleep)}`}>{avgSleep.toFixed(1)}</p><p className="text-xs text-muted-foreground">Avg Sleep</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Activity className="h-6 w-6 text-green-400 mx-auto mb-2" /><p className={`text-2xl font-bold ${getScoreColor(avgNutrition)}`}>{avgNutrition.toFixed(1)}</p><p className="text-xs text-muted-foreground">Avg Nutrition</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Droplets className="h-6 w-6 text-cyan-400 mx-auto mb-2" /><p className={`text-2xl font-bold ${getScoreColor(avgHydration)}`}>{avgHydration.toFixed(1)}</p><p className="text-xs text-muted-foreground">Avg Hydration</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" /><p className={`text-2xl font-bold ${getScoreColor(avgRecovery)}`}>{avgRecovery.toFixed(1)}</p><p className="text-xs text-muted-foreground">Avg Recovery</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Users className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{checkinRate}%</p><p className="text-xs text-muted-foreground">Check-in Rate</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-400" /> Attention Required</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {redCheckins.map(c => (
              <div key={c.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{c.playerName}</span>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400">Critical</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.notes ?? 'Multiple low scores — review needed'}</p>
                <p className="text-xs text-muted-foreground mt-1">Check-in: {c.date}</p>
              </div>
            ))}
            {amberCheckins.map(c => (
              <div key={c.id} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{c.playerName}</span>
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-400">Monitor</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.notes ?? 'Some areas below threshold'}</p>
              </div>
            ))}
            {redCheckins.length === 0 && amberCheckins.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">All players within healthy ranges.</p>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Squad Wellness Overview</CardTitle>
            <CardDescription>Latest check-in data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamCheckins.map(c => {
                const avg = (c.wellness.sleep + c.wellness.nutrition + c.wellness.hydration + c.wellness.recovery + c.wellness.mood) / 5;
                return (
                  <div key={c.id} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center">
                          <span className="text-sm font-medium text-foreground">{c.playerName.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{c.playerName}</p>
                          <p className="text-xs text-muted-foreground">Check-in: {c.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.overallLevel === 'green' ? <TrendingUp className="h-4 w-4 text-green-400" /> : c.overallLevel === 'red' ? <TrendingDown className="h-4 w-4 text-red-400" /> : <div className="h-4 w-4 border-t-2 border-muted-foreground" />}
                        <span className={`text-lg font-bold ${getScoreColor(avg)}`}>{avg.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[{ l: 'Sleep', v: c.wellness.sleep }, { l: 'Nutrition', v: c.wellness.nutrition }, { l: 'Hydration', v: c.wellness.hydration }, { l: 'Recovery', v: c.wellness.recovery }, { l: 'Mood', v: c.wellness.mood }].map(m => (
                        <div key={m.l} className="text-center">
                          <div className="h-16 bg-muted rounded relative overflow-hidden mb-1">
                            <div className={`absolute bottom-0 w-full ${getScoreBg(m.v)} transition-all`} style={{ height: `${(m.v / 5) * 100}%` }} />
                          </div>
                          <p className={`text-sm font-medium ${getScoreColor(m.v)}`}>{m.v}</p>
                          <p className="text-xs text-muted-foreground">{m.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {teamCheckins.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No check-ins recorded yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-card border-border">
        <CardHeader><CardTitle className="font-display text-lg">Squad Wellness Trend (Last 7 Days)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-4">
            {shelWellnessData.map((day) => {
              const avg = (day.sleep + day.nutrition + day.hydration + day.recovery + day.mood) / 5;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-full rounded-t transition-all ${getScoreBg(avg)}`} style={{ height: `${(avg / 5) * 100}%` }} />
                  <span className="text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString('en-IE', { weekday: 'short' })}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </ShelDemoLayout>
  );
};
export default ShelWellnessData;
