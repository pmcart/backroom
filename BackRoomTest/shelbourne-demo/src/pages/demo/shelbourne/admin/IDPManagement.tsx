import { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Search, BarChart3, Users, Eye } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { shelIDPSummaries } from '@data/shelbourneData';

const ShelIDPManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSquad, setFilterSquad] = useState<string | null>(null);
  const stats = {
    totalIDPs: shelIDPSummaries.length,
    onTrack: shelIDPSummaries.filter(i => i.goalsAtRisk === 0).length,
    atRisk: shelIDPSummaries.filter(i => i.goalsAtRisk > 0).length,
    reviewsDue: shelIDPSummaries.filter(i => i.status === 'review-due').length,
    avgProgress: Math.round(shelIDPSummaries.reduce((a, i) => a + i.overallProgress, 0) / shelIDPSummaries.length),
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'review-due': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const allSquads = Array.from(new Set(shelIDPSummaries.map(i => i.ageGroup)));
  const filteredIDPs = shelIDPSummaries.filter(i => {
    const matchesSearch = !searchTerm || i.playerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSquad = !filterSquad || i.ageGroup === filterSquad;
    return matchesSearch && matchesSquad;
  });

  return (
    <ShelDemoLayout role="admin" userName="Mark O'Reilly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">IDP Management</h1>
        <p className="text-muted-foreground mt-1">Academy-wide Individual Development Plan oversight</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Target className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.totalIDPs}</p><p className="text-xs text-muted-foreground">Active IDPs</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.onTrack}</p><p className="text-xs text-muted-foreground">On Track</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><AlertTriangle className="h-6 w-6 text-amber-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.atRisk}</p><p className="text-xs text-muted-foreground">At Risk</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><CheckCircle className="h-6 w-6 text-blue-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.reviewsDue}</p><p className="text-xs text-muted-foreground">Reviews Due</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><BarChart3 className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.avgProgress}%</p><p className="text-xs text-muted-foreground">Avg Progress</p></CardContent></Card>
      </div>

      <Tabs defaultValue="by-squad" className="space-y-6">
        <TabsList>
          <TabsTrigger value="by-squad">By Squad</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="by-squad">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search players..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant={!filterSquad ? 'default' : 'outline'} size="sm" onClick={() => setFilterSquad(null)} className={!filterSquad ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>All Squads</Button>
              {allSquads.slice(0, 4).map(sq => (
                <Button key={sq} variant={filterSquad === sq ? 'default' : 'outline'} size="sm" onClick={() => setFilterSquad(filterSquad === sq ? null : sq)} className={filterSquad === sq ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>{sq.split(' ')[0]}</Button>
              ))}
            </div>
          </div>

          {allSquads.filter(sq => !filterSquad || sq === filterSquad).map(ageGroup => {
            const groupIDPs = filteredIDPs.filter(i => i.ageGroup === ageGroup);
            if (groupIDPs.length === 0) return null;
            const groupAvg = Math.round(groupIDPs.reduce((a, i) => a + i.overallProgress, 0) / groupIDPs.length);
            return (
              <Card key={ageGroup} className="mb-6 bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-red-500">{ageGroup.split(' ')[0]}</span>
                    </div>
                    <div>
                      <CardTitle className="font-display text-lg">{ageGroup}</CardTitle>
                      <p className="text-sm text-muted-foreground">Avg progress: {groupAvg}%</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-muted">{groupIDPs.length} players</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groupIDPs.map(idp => (
                      <div key={idp.id} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center">
                              <span className="text-sm font-medium text-foreground">{idp.playerName.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{idp.playerName}</h4>
                              <p className="text-sm text-muted-foreground">{idp.position}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={idp.mode === 'elite' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]' : 'bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]'}>{idp.mode === 'elite' ? 'Elite' : 'Basic'}</Badge>
                            <Badge variant="outline" className={getStatusColor(idp.status)}>{idp.status === 'review-due' ? 'Review Due' : idp.status}</Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className="font-medium text-foreground">{idp.overallProgress}%</span>
                          </div>
                          <Progress value={idp.overallProgress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex gap-4">
                            <span className="text-green-400"><TrendingUp className="h-3 w-3 inline mr-1" />{idp.goalsOnTrack} on track</span>
                            {idp.goalsAtRisk > 0 && <span className="text-amber-400"><AlertTriangle className="h-3 w-3 inline mr-1" />{idp.goalsAtRisk} at risk</span>}
                          </div>
                          <span className="text-xs text-muted-foreground">Review: {idp.nextReviewDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="engagement">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Users className="h-5 w-5 text-red-500" /> Squad Engagement</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {allSquads.map(sq => {
                  const group = shelIDPSummaries.filter(i => i.ageGroup === sq);
                  const avg = Math.round(group.reduce((a, i) => a + i.overallProgress, 0) / group.length);
                  const atRisk = group.filter(i => i.goalsAtRisk > 0).length;
                  return (
                    <div key={sq} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-red-500">{sq.split(' ')[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{sq}</p>
                            <p className="text-xs text-muted-foreground">{group.length} IDPs</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${avg >= 60 ? 'text-green-400' : avg >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{avg}%</p>
                          {atRisk > 0 && <p className="text-xs text-amber-400">{atRisk} at risk</p>}
                        </div>
                      </div>
                      <Progress value={avg} className="h-1.5" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Eye className="h-5 w-5 text-red-500" /> Completion Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"><p className="text-2xl font-bold text-green-400">{shelIDPSummaries.filter(i => i.overallProgress >= 70).length}</p><p className="text-xs text-muted-foreground">Strong (70%+)</p></div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"><p className="text-2xl font-bold text-amber-400">{shelIDPSummaries.filter(i => i.overallProgress >= 40 && i.overallProgress < 70).length}</p><p className="text-xs text-muted-foreground">Progressing</p></div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"><p className="text-2xl font-bold text-red-400">{shelIDPSummaries.filter(i => i.overallProgress < 40).length}</p><p className="text-xs text-muted-foreground">Needs Focus</p></div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"><p className="text-2xl font-bold text-amber-400">{shelIDPSummaries.filter(i => i.mode === 'elite').length}</p><p className="text-xs text-muted-foreground">Elite IDPs</p></div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Players Needing Attention</h4>
                  <div className="space-y-2">
                    {shelIDPSummaries.filter(i => i.goalsAtRisk > 0 || i.overallProgress < 45).map(i => (
                      <div key={i.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center">
                            <span className="text-xs text-foreground">{i.playerName.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{i.playerName}</p>
                            <p className="text-xs text-muted-foreground">{i.ageGroup}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{i.overallProgress}%</p>
                          {i.goalsAtRisk > 0 && <p className="text-xs text-amber-400">{i.goalsAtRisk} at risk</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground text-center mt-6">Demo prototype — illustrative data only.</p>
    </ShelDemoLayout>
  );
};
export default ShelIDPManagement;
