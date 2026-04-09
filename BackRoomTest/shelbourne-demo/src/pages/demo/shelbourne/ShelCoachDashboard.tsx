import { Users, Calendar, Target, LineChart, AlertTriangle, CheckCircle, Clock, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import ShelStatCard from '@components/demo/shelbourne/ShelStatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { shelPlayers, shelSessions } from '@data/shelbourneData';
import { useShelAcademy } from '@contexts/ShelAcademyContext';
import { COACH_CONFIG } from '@data/shelCoachConfig';
import { cn } from '@lib/utils';

const ShelCoachDashboard = () => {
  const { idpSummaries, detailedIDPs, plans, checkins, getRedFlagPlayers } = useShelAcademy();

  const squadPlayers = shelPlayers.filter(p => p.ageGroup === COACH_CONFIG.assignedAgeGroup);
  const teamIDPs = idpSummaries.filter(i => i.ageGroup === COACH_CONFIG.assignedAgeGroup);
  const teamPlans = plans.filter(p => p.ageGroup === COACH_CONFIG.assignedSessionGroup);
  const teamCheckins = checkins.filter(c => c.ageGroup === COACH_CONFIG.assignedAgeGroup);
  const redFlags = getRedFlagPlayers().filter(c => c.ageGroup === COACH_CONFIG.assignedAgeGroup);

  // Compute live stats
  const idpsToReview = teamIDPs.filter(i => i.status === 'review-due').length;
  const avgWellness = teamCheckins.length > 0
    ? (teamCheckins.reduce((sum, c) => sum + (c.wellness.sleep + c.wellness.nutrition + c.wellness.hydration + c.wellness.recovery + c.wellness.mood) / 5, 0) / teamCheckins.length).toFixed(1)
    : '4.0';
  const activePlansCount = teamPlans.filter(p => p.status === 'active').length;

  // Get top IDP goals for display
  const topGoals = teamIDPs.slice(0, 4).map(s => {
    const detail = detailedIDPs[s.id];
    const topGoal = detail?.goals?.[0];
    return { summary: s, goal: topGoal };
  }).filter(g => g.goal);

  // Current week's training theme from active plans
  const activeWeekly = teamPlans.find(p => p.type === 'weekly' && p.status === 'active');
  const weeklyTheme = activeWeekly?.weeklyPlan?.theme;

  return (
    <ShelDemoLayout role="coach" userName="Alan Quinn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Coach Dashboard</h1>
          <p className="text-muted-foreground mt-1">U17 Boys Lead Coach — Welcome back, Alan.</p>
        </div>
        <Link to="/demo/shelbourne/coach/planning">
          <Button className="w-fit bg-red-600 hover:bg-red-700 text-white"><Plus className="h-4 w-4" /> New Session</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <ShelStatCard title="Squad Size" value={squadPlayers.length} subtitle="Active players" icon={Users} />
        <ShelStatCard title="Active Plans" value={activePlansCount} subtitle="Session plans" icon={Calendar} />
        <ShelStatCard title="IDPs to Review" value={idpsToReview} subtitle="Pending updates" icon={Target} />
        <ShelStatCard title="Avg Squad Wellness" value={`${avgWellness}/5`} subtitle="Latest check-ins" icon={LineChart} trend={{ value: 2, positive: true }} />
      </div>

      {/* Weekly Theme Banner */}
      {weeklyTheme && (
        <Card className="mb-6 bg-gradient-to-r from-red-500/10 to-red-700/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">This Week's Training Theme</p>
                <p className="font-display font-medium text-foreground">{weeklyTheme}</p>
              </div>
              <Link to="/demo/shelbourne/coach/planning" className="text-sm text-red-500 hover:underline">View Plan →</Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Today's Sessions</CardTitle>
            <Link to="/demo/shelbourne/coach/planning" className="text-sm text-red-500 hover:underline flex items-center gap-1">View all <ChevronRight className="h-4 w-4" /></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shelSessions.filter(s => s.ageGroup === 'U17 Boys').slice(0, 3).map((session) => (
                <div key={session.id} className={cn('p-4 rounded-lg border transition-colors', session.status === 'completed' ? 'bg-muted/30 border-border' : 'bg-gradient-to-r from-red-500/5 to-red-700/5 border-red-500/30')}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{session.title}</h3>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', session.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500')}>{session.status === 'completed' ? 'Completed' : 'Upcoming'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Focus: {session.focus} • {session.time}</p>
                    </div>
                    {session.status !== 'completed' && <Link to="/demo/shelbourne/coach/planning"><Button variant="outline" size="sm">View Plan</Button></Link>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Attention Needed</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {/* Live wellness red flags */}
            {redFlags.length > 0 ? redFlags.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{c.playerName}</p>
                  <p className="text-xs text-muted-foreground">Wellness Red flag — {c.notes ?? 'Low scores across metrics'}</p>
                </div>
              </div>
            )) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">No Red Flags</p>
                  <p className="text-xs text-muted-foreground">All wellness check-ins are green/amber</p>
                </div>
              </div>
            )}

            {idpsToReview > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">IDP Reviews Due</p>
                  <p className="text-xs text-muted-foreground">{idpsToReview} players this week</p>
                </div>
              </div>
            )}

            {shelPlayers.filter(p => p.ageGroup === COACH_CONFIG.assignedAgeGroup && p.status === 'recovery').map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Recovery status</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">IDP Progress</CardTitle>
            <Link to="/demo/shelbourne/coach/idp" className="text-sm text-red-500 hover:underline flex items-center gap-1">View all <ChevronRight className="h-4 w-4" /></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topGoals.map(({ summary, goal }) => (
                <div key={summary.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-foreground">{summary.playerName}</span>
                      <span className="text-muted-foreground ml-2">• {goal!.category}</span>
                    </div>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', goal!.status === 'on-track' ? 'bg-green-500/20 text-green-400' : goal!.status === 'completed' ? 'bg-green-500/20 text-green-400' : goal!.status === 'at-risk' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400')}>{goal!.status.replace('-', ' ')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{goal!.title}</p>
                  <Progress value={goal!.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Squad Wellness</CardTitle>
            <Link to="/demo/shelbourne/coach/monitoring" className="text-sm text-red-500 hover:underline flex items-center gap-1">View all <ChevronRight className="h-4 w-4" /></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamCheckins.slice(0, 5).map(c => {
                const avg = ((c.wellness.sleep + c.wellness.nutrition + c.wellness.hydration + c.wellness.recovery + c.wellness.mood) / 5);
                return (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center">
                        <span className="text-xs font-semibold text-foreground">{c.playerName.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.playerName}</p>
                        <p className="text-xs text-muted-foreground">Check-in {c.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={c.overallLevel === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/30' : c.overallLevel === 'amber' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                        {avg.toFixed(1)}/5
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {teamCheckins.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No check-ins recorded yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </ShelDemoLayout>
  );
};

export default ShelCoachDashboard;
