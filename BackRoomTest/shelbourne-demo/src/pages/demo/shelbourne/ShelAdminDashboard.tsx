import { Users, Calendar, GraduationCap, Target, LineChart, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import ShelStatCard from '@components/demo/shelbourne/ShelStatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Progress } from '@components/ui/progress';
import { shelPlayers, shelSessions, shelEducationModules } from '@data/shelbourneData';
import { useShelAcademy } from '@contexts/ShelAcademyContext';

const boysSquads = ['U14 Boys', 'U15 Boys', 'U17 Boys', 'U19 Boys'];
const girlsSquads = ['U17 Girls', 'U19 Girls'];

const ShelAdminDashboard = () => {
  const { idpSummaries, plans, checkins, getRedFlagPlayers } = useShelAcademy();

  const redFlags = getRedFlagPlayers();
  const activeIDPs = idpSummaries.filter(i => i.status === 'active').length;
  const reviewDue = idpSummaries.filter(i => i.status === 'review-due').length;
  const activePlans = plans.filter(p => p.status === 'active').length;
  const avgWellness = checkins.length > 0
    ? (checkins.reduce((sum, c) => sum + (c.wellness.sleep + c.wellness.nutrition + c.wellness.hydration + c.wellness.recovery + c.wellness.mood) / 5, 0) / checkins.length).toFixed(1)
    : '4.0';

  return (
    <ShelDemoLayout role="admin" userName="Mark O'Reilly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Academy Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Mark. Here's an overview of Shelbourne FC Academy.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <ShelStatCard title="Total Players" value={shelPlayers.length} subtitle="Boys & girls squads" icon={Users} trend={{ value: 4, positive: true }} />
        <ShelStatCard title="Active IDPs" value={activeIDPs} subtitle={`${reviewDue} reviews due`} icon={Target} />
        <ShelStatCard title="Active Plans" value={activePlans} subtitle="Across all coaches" icon={Calendar} />
        <ShelStatCard title="Avg Wellness Score" value={`${avgWellness}/5`} subtitle="Latest check-ins" icon={LineChart} trend={{ value: 2, positive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Education Compliance</CardTitle>
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shelEducationModules.slice(0, 4).map((module) => {
                const pct = Math.round((module.completedBy / module.totalPlayers) * 100);
                return (
                  <div key={module.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{module.title}</span>
                        {module.mandatory && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded">Mandatory</span>}
                      </div>
                      <span className="text-muted-foreground">{module.completedBy}/{module.totalPlayers}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Quick Overview</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-foreground">IDP Completion</p>
                <p className="text-xs text-muted-foreground">{activeIDPs} active, {reviewDue} reviews due</p>
              </div>
            </div>

            {/* Live wellness alerts */}
            <div className={`flex items-center gap-3 p-3 rounded-lg ${redFlags.length > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
              <AlertTriangle className={`h-5 w-5 ${redFlags.length > 0 ? 'text-red-500' : 'text-amber-500'}`} />
              <div>
                <p className="text-sm font-medium text-foreground">Wellness Alerts</p>
                <p className="text-xs text-muted-foreground">
                  {redFlags.length > 0
                    ? `${redFlags.length} player${redFlags.length > 1 ? 's' : ''} flagged — ${redFlags.map(r => r.playerName).join(', ')}`
                    : 'No red flags currently'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-foreground">Upcoming Fixtures</p>
                <p className="text-xs text-muted-foreground">6 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Upcoming Sessions</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shelSessions.filter(s => s.status === 'scheduled').slice(0, 4).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{session.ageGroup} • {session.coach}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{session.time}</p>
                    <p className="text-xs text-muted-foreground">{session.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Squads Overview</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Boys' Academy</p>
              {boysSquads.map((squad) => {
                const count = shelPlayers.filter(p => p.ageGroup === squad).length;
                const squadIDPs = idpSummaries.filter(i => i.ageGroup === squad).length;
                return (
                  <div key={squad} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500">{squad.replace(' Boys', '')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{squad}</p>
                        <p className="text-xs text-muted-foreground">{count} players • {squadIDPs} IDPs</p>
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                );
              })}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Girls' Academy</p>
              {girlsSquads.map((squad) => {
                const count = shelPlayers.filter(p => p.ageGroup === squad).length;
                const squadIDPs = idpSummaries.filter(i => i.ageGroup === squad).length;
                return (
                  <div key={squad} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500">{squad.replace(' Girls', '')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{squad}</p>
                        <p className="text-xs text-muted-foreground">{count} players • {squadIDPs} IDPs</p>
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ShelDemoLayout>
  );
};

export default ShelAdminDashboard;
