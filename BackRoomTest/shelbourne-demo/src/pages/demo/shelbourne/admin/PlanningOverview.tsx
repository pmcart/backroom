import { Calendar, ChevronLeft, ChevronRight, Target, Dumbbell, Heart, Users } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import type { ComponentType } from 'react';

const ShelPlanningOverview = () => {
  const calendarData = [
    { day: 'Mon', sessions: [{ type: 'recovery', title: 'Recovery', squad: 'U19 Boys' }] },
    { day: 'Tue', sessions: [{ type: 'football', title: 'Pressing Patterns', squad: 'U17 Boys' }, { type: 'football', title: 'Build-Up Play', squad: 'U15 Boys' }] },
    { day: 'Wed', sessions: [{ type: 'gym', title: 'Strength', squad: 'U19 Boys' }, { type: 'football', title: 'Speed & Agility', squad: 'U17 Girls' }] },
    { day: 'Thu', sessions: [{ type: 'football', title: 'Transition', squad: 'U17 Boys' }, { type: 'football', title: 'Set Pieces', squad: 'U19 Girls' }] },
    { day: 'Fri', sessions: [{ type: 'football', title: 'Match Prep', squad: 'U19 Boys' }, { type: 'football', title: 'Finishing', squad: 'U15 Boys' }] },
    { day: 'Sat', sessions: [{ type: 'match', title: 'vs Bohs U17', squad: 'U17 Boys' }, { type: 'match', title: 'vs Rovers U19', squad: 'U19 Girls' }] },
    { day: 'Sun', sessions: [{ type: 'rest', title: 'Rest Day', squad: 'All' }] },
  ];
  const getColor = (type: string) => {
    switch (type) {
      case 'football': return 'bg-red-500/20 border-red-500/30 text-red-500';
      case 'gym': return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'recovery': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'match': return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      default: return 'bg-muted border-border text-muted-foreground';
    }
  };
  const getIcon = (type: string): ComponentType<{ className?: string }> => {
    switch (type) {
      case 'football': return Target;
      case 'gym': return Dumbbell;
      case 'recovery': return Heart;
      case 'match': return Users;
      default: return Calendar;
    }
  };

  return (
    <ShelDemoLayout role="admin" userName="Mark O'Reilly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Planning Overview</h1>
        <p className="text-muted-foreground mt-1">Academy-wide training schedule across all squads</p>
      </div>
      <Card className="mb-6 bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Week 10 — March 2025</h3>
              <p className="text-sm text-muted-foreground">EA Sports Academy League Season</p>
            </div>
            <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">18</p><p className="text-xs text-muted-foreground">Sessions This Week</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">6</p><p className="text-xs text-muted-foreground">Squads Active</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">4</p><p className="text-xs text-muted-foreground">Match Days</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">10</p><p className="text-xs text-muted-foreground">Coaches Assigned</p></CardContent></Card>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant="outline" size="sm" className="bg-red-500/20 border-red-500/30">All Squads</Button>
        {['U14 Boys', 'U15 Boys', 'U17 Boys', 'U19 Boys', 'U17 Girls', 'U19 Girls'].map(s => (
          <Button key={s} variant="outline" size="sm">{s}</Button>
        ))}
      </div>
      <Card className="bg-card border-border mb-6">
        <CardHeader><CardTitle className="font-display text-lg">Weekly Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((day) => (
              <div key={day.day} className="min-h-[200px]">
                <div className="text-center mb-2 pb-2 border-b border-border">
                  <p className="font-medium text-foreground">{day.day}</p>
                </div>
                <div className="space-y-2">
                  {day.sessions.map((session, i) => {
                    const Icon = getIcon(session.type);
                    return (
                      <div key={i} className={`p-2 rounded-lg border text-xs ${getColor(session.type)}`}>
                        <div className="flex items-center gap-1 mb-1">
                          <Icon className="h-3 w-3" />
                          <span className="font-medium truncate">{session.squad}</span>
                        </div>
                        <p className="truncate opacity-80">{session.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-red-500/50" /><span className="text-sm text-muted-foreground">Football</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-purple-500/50" /><span className="text-sm text-muted-foreground">Gym</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-green-500/50" /><span className="text-sm text-muted-foreground">Recovery</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-amber-500/50" /><span className="text-sm text-muted-foreground">Match</span></div>
          </div>
        </CardContent>
      </Card>
    </ShelDemoLayout>
  );
};
export default ShelPlanningOverview;
