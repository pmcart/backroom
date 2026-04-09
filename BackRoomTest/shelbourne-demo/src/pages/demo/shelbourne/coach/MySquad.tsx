import { Search, Filter, AlertTriangle, MessageSquare, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Badge } from '@components/ui/badge';
import { Progress } from '@components/ui/progress';
import { shelPlayers } from '@data/shelbourneData';
import { useShelAcademy } from '@contexts/ShelAcademyContext';
import { COACH_CONFIG } from '@data/shelCoachConfig';

const ShelMySquad = () => {
  const { idpSummaries, checkins, getPlayerWellnessLevel } = useShelAcademy();
  const squadPlayers = shelPlayers.filter(p => p.ageGroup === COACH_CONFIG.assignedAgeGroup);

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'injured': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'recovery': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const wellnessColor = (l: string) => l === 'green' ? 'text-green-400' : l === 'amber' ? 'text-amber-400' : l === 'red' ? 'text-red-400' : 'text-muted-foreground';

  // Build player details from live context data
  const playerDetails = squadPlayers.map(player => {
    const checkin = checkins.find(c => c.playerId === player.id);
    const idp = idpSummaries.find(i => i.playerName === player.name);
    const wellnessLevel = getPlayerWellnessLevel(player.id);
    const avg = checkin ? ((checkin.wellness.sleep + checkin.wellness.nutrition + checkin.wellness.hydration + checkin.wellness.recovery + checkin.wellness.mood) / 5) : null;
    const today = new Date().toISOString().split('T')[0];
    return {
      ...player,
      wellness: avg,
      wellnessLevel,
      idpProgress: idp?.overallProgress ?? null,
      lastCheckin: checkin ? (checkin.date === today ? 'Today' : checkin.date) : 'No check-in',
    };
  });

  const availableCount = squadPlayers.filter(p => p.status === 'active').length;
  const injuredCount = squadPlayers.filter(p => p.status === 'injured').length;
  const recoveryCount = squadPlayers.filter(p => p.status === 'recovery').length;
  const wellnessPlayers = playerDetails.filter(p => p.wellness !== null);
  const avgWellness = wellnessPlayers.length > 0
    ? (wellnessPlayers.reduce((s, p) => s + (p.wellness ?? 0), 0) / wellnessPlayers.length).toFixed(1)
    : '—';

  return (
    <ShelDemoLayout role="coach" userName="Alan Quinn">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">My Squad</h1>
        <p className="text-muted-foreground mt-1">U17 Boys • {squadPlayers.length} players</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search players..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button variant="outline" size="sm">Position</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-400">{availableCount}</p><p className="text-xs text-muted-foreground">Available</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-400">{injuredCount}</p><p className="text-xs text-muted-foreground">Injured</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-400">{recoveryCount}</p><p className="text-xs text-muted-foreground">Recovery</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{avgWellness}</p><p className="text-xs text-muted-foreground">Avg Wellness</p></CardContent></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {playerDetails.slice(0, 8).map(player => (
          <Card key={player.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">{player.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{player.name}</h4>
                    <p className="text-sm text-muted-foreground">{player.position}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(player.status)}>{player.status}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Wellness</span>
                  <div className="flex items-center gap-2">
                    {player.wellness !== null ? (
                      <>
                        <span className={`font-medium ${wellnessColor(player.wellnessLevel)}`}>{player.wellness.toFixed(1)}/5</span>
                        {player.wellnessLevel === 'red' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                      </>
                    ) : <span className="text-muted-foreground text-xs">No data</span>}
                  </div>
                </div>
                {player.idpProgress !== null && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">IDP Progress</span>
                      <span className="font-medium text-foreground">{player.idpProgress}%</span>
                    </div>
                    <Progress value={player.idpProgress} className="h-1.5" />
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Check-in</span>
                  <span className={player.lastCheckin === 'Today' ? 'text-green-400' : 'text-amber-400'}>{player.lastCheckin}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Link to="/demo/shelbourne/coach/idp" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full"><TrendingUp className="h-4 w-4 mr-1" /> IDP</Button>
                </Link>
                <Button variant="outline" size="sm" className="flex-1"><MessageSquare className="h-4 w-4 mr-1" /> Message</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ShelDemoLayout>
  );
};
export default ShelMySquad;
