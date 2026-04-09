import { Target, Calendar, GraduationCap, Video, CheckCircle, ChevronRight, TrendingUp, Moon, Utensils, Droplets, Heart, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import ShelStatCard from '@components/demo/shelbourne/ShelStatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { shelPlayerStats, shelEducationModules, shelVideoClips } from '@data/shelbourneData';
import { useShelAcademy } from '@contexts/ShelAcademyContext';
import { cn } from '@lib/utils';

const ShelPlayerDashboard = () => {
  const { detailedIDPs, getPlayerCheckin } = useShelAcademy();

  // Aaron Connolly's IDP
  const myIDP = detailedIDPs['sidp1'];
  const myGoals = myIDP?.goals ?? [];
  const checkin = getPlayerCheckin('sb13');

  return (
    <ShelDemoLayout role="player" userName="Aaron Connolly">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">U17 Boys Striker — Welcome back, Aaron.</p>
        </div>
        <Link to="/demo/shelbourne/player/checkin">
          <Button className="w-fit bg-red-600 hover:bg-red-700 text-white">Daily Check-in<ChevronRight className="h-4 w-4" /></Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <ShelStatCard title="Goals in Progress" value={myGoals.filter(g => g.status !== 'completed').length} subtitle="Development targets" icon={Target} />
        <ShelStatCard title="Goals Completed" value={myGoals.filter(g => g.status === 'completed').length} subtitle="This cycle" icon={CheckCircle} />
        <ShelStatCard title="Education Modules" value={shelPlayerStats.educationModules} subtitle="Pending completion" icon={GraduationCap} />
        <ShelStatCard title="Check-in Streak" value={`${shelPlayerStats.wellnessStreak} days`} subtitle="Keep it up!" icon={TrendingUp} trend={{ value: 10, positive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Today's Check-in</CardTitle>
            {checkin ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}
          </CardHeader>
          <CardContent>
            {checkin ? (
              <>
                <p className="text-xs text-muted-foreground mb-4">Logged — {checkin.date}</p>
                <div className="space-y-4">
                  {[
                    { icon: Moon, color: 'text-blue-400', label: 'Sleep', value: `${checkin.wellness.sleep}/5`, pct: (checkin.wellness.sleep / 5) * 100 },
                    { icon: Utensils, color: 'text-green-400', label: 'Nutrition', value: `${checkin.wellness.nutrition}/5`, pct: (checkin.wellness.nutrition / 5) * 100 },
                    { icon: Droplets, color: 'text-cyan-400', label: 'Hydration', value: `${checkin.wellness.hydration}/5`, pct: (checkin.wellness.hydration / 5) * 100 },
                    { icon: Heart, color: 'text-red-400', label: 'Recovery', value: `${checkin.wellness.recovery}/5`, pct: (checkin.wellness.recovery / 5) * 100 },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <m.icon className={`h-4 w-4 ${m.color}`} />
                        <span className="text-sm text-muted-foreground">{m.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{m.value}</span>
                        <Progress value={m.pct} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <Badge variant="outline" className={checkin.overallLevel === 'green' ? 'bg-green-500/20 text-green-400' : checkin.overallLevel === 'amber' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}>
                    Overall {checkin.overallLevel === 'green' ? '✓ Good' : checkin.overallLevel === 'amber' ? '~ Okay' : '! Attention'}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">You haven't checked in today yet.</p>
                <Link to="/demo/shelbourne/player/checkin"><Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Check In Now</Button></Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">My Development Goals</CardTitle>
            <Link to="/demo/shelbourne/player/development" className="text-sm text-red-500 hover:underline flex items-center gap-1">View IDP <ChevronRight className="h-4 w-4" /></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', goal.category === 'technical' ? 'bg-blue-500/20 text-blue-400' : goal.category === 'tactical' ? 'bg-purple-500/20 text-purple-400' : goal.category === 'physical' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400')}>{goal.category}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', goal.status === 'on-track' ? 'bg-green-500/20 text-green-400' : goal.status === 'completed' ? 'bg-green-500/20 text-green-400' : goal.status === 'at-risk' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400')}>{goal.status.replace('-', ' ')}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{goal.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Target: {goal.targetDate}</p>
                    </div>
                    <span className="text-lg font-bold text-red-500">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Upcoming Schedule</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-red-700/10 border border-red-500/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{shelPlayerStats.nextSession}</p>
                  <p className="text-xs text-muted-foreground">Training Session</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">16:00</p>
                  <p className="text-xs text-muted-foreground">{shelPlayerStats.nextSessionDate}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">vs Bohemian FC U17</p>
                  <p className="text-xs text-muted-foreground">Academy League</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">14:00</p>
                  <p className="text-xs text-muted-foreground">2025-03-15</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">IDP Review</p>
                  <p className="text-xs text-muted-foreground">Meeting with Coach</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">16:30</p>
                  <p className="text-xs text-muted-foreground">2025-03-17</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Video Feedback</CardTitle>
            <Video className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shelVideoClips.filter(v => v.feedback).slice(0, 3).map((clip) => (
                <div key={clip.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{clip.title}</p>
                      <p className="text-xs text-muted-foreground">{clip.match} • {clip.date}</p>
                    </div>
                    <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded">{clip.duration}</span>
                  </div>
                  {clip.feedback && <p className="text-xs text-muted-foreground italic border-l-2 border-red-500/50 pl-2 mt-2">{clip.feedback}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Education & Learning</CardTitle>
          <Link to="/demo/shelbourne/player/learning" className="text-sm text-red-500 hover:underline flex items-center gap-1">View all <ChevronRight className="h-4 w-4" /></Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {shelEducationModules.slice(0, 3).map((module) => (
              <div key={module.id} className="p-4 rounded-lg bg-muted/30 border border-border hover:border-red-500/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{module.category}</span>
                  {module.mandatory && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded">Required</span>}
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{module.title}</p>
                <p className="text-xs text-muted-foreground">{module.duration}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ShelDemoLayout>
  );
};

export default ShelPlayerDashboard;
