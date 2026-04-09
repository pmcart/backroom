import { UserPlus, Filter, Search, MoreVertical, Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Badge } from '@components/ui/badge';
import { shelPlayers, shelCoaches } from '@data/shelbourneData';

const ShelSquadManagement = () => {
  const boysGroups = ['U14 Boys', 'U15 Boys', 'U17 Boys', 'U19 Boys'];
  const girlsGroups = ['U17 Girls', 'U19 Girls'];
  const allGroups = [...boysGroups, ...girlsGroups];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'injured': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'recovery': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ShelDemoLayout role="admin" userName="Mark O'Reilly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Squad Management</h1>
        <p className="text-muted-foreground mt-1">Manage players and staff across boys' and girls' academy squads</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search players or staff..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white"><UserPlus className="h-4 w-4 mr-2" /> Add Player</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-400" /></div><div><p className="text-2xl font-bold text-foreground">{shelPlayers.filter(p => p.status === 'active').length}</p><p className="text-xs text-muted-foreground">Active Players</p></div></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-red-400" /></div><div><p className="text-2xl font-bold text-foreground">{shelPlayers.filter(p => p.status === 'injured').length}</p><p className="text-xs text-muted-foreground">Injured</p></div></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><Activity className="h-5 w-5 text-amber-400" /></div><div><p className="text-2xl font-bold text-foreground">{shelPlayers.filter(p => p.status === 'recovery').length}</p><p className="text-xs text-muted-foreground">In Recovery</p></div></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center"><Shield className="h-5 w-5 text-red-500" /></div><div><p className="text-2xl font-bold text-foreground">{shelCoaches.length}</p><p className="text-xs text-muted-foreground">Coaching Staff</p></div></div></CardContent></Card>
      </div>
      {allGroups.map((ageGroup) => {
        const players = shelPlayers.filter(p => p.ageGroup === ageGroup);
        const coaches = shelCoaches.filter(c => c.ageGroups.includes(ageGroup));
        if (players.length === 0) return null;
        return (
          <Card key={ageGroup} className="mb-6 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-500">{ageGroup.split(' ')[0]}</span>
                </div>
                <div>
                  <CardTitle className="font-display text-lg">{ageGroup}</CardTitle>
                  <p className="text-sm text-muted-foreground">{players.length} players • {coaches.length} coaches</p>
                </div>
              </div>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center">
                        <span className="text-sm font-medium text-foreground">{player.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{player.name}</p>
                        <p className="text-sm text-muted-foreground">{player.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getStatusColor(player.status)}>{player.status}</Badge>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-3">Coaching Staff</p>
                <div className="flex flex-wrap gap-2">
                  {coaches.map((coach) => (
                    <Badge key={coach.id} variant="secondary" className="bg-red-500/10 text-foreground">{coach.name} • {coach.role}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </ShelDemoLayout>
  );
};
export default ShelSquadManagement;
