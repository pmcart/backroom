import { useState } from 'react';
import { Calendar, Plus, Target, ClipboardList, BarChart3, Copy, Trash2, Archive, Search } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import PlanCreateForm from '@components/demo/shelbourne/sessionPlan/CreateForm';
import PlanDetailView from '@components/demo/shelbourne/sessionPlan/DetailView';
import { useShelAcademy } from '@contexts/ShelAcademyContext';
import { COACH_CONFIG } from '@data/shelCoachConfig';
import type { ShelPlan, PlanType } from '@data/shelbourneSessionData';

const typeLabel = (t: PlanType) => ({ single: 'Single Session', weekly: 'Weekly Plan', block: 'Multi-Week Block', season: 'Season Plan' }[t]);
const typeColor = (t: PlanType) => ({
  single: 'bg-red-500/20 text-red-400 border-red-500/30',
  weekly: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  block: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  season: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}[t]);
const statusColor = (s: string) => s === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : s === 'archived' ? 'bg-muted text-muted-foreground' : 'bg-amber-500/20 text-amber-400 border-amber-500/30';

const ShelSessionPlanning = () => {
  const { plans, addPlan, updatePlan, deletePlan } = useShelAcademy();

  // Filter plans to coach's assigned team only
  const teamPlans = plans.filter(p => p.ageGroup === COACH_CONFIG.assignedSessionGroup);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = teamPlans.filter(p => {
    if (filterPhase !== 'all' && p.competitionPhase !== filterPhase) return false;
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activePlans = filtered.filter(p => p.status !== 'archived');
  const archivedPlans = filtered.filter(p => p.status === 'archived');

  const handleCreate = (plan: ShelPlan) => {
    addPlan(plan);
    setShowCreate(false);
  };

  const handleDuplicate = (plan: ShelPlan) => {
    const dup: ShelPlan = { ...plan, id: `sp-${Date.now()}`, title: `${plan.title} (Copy)`, status: 'draft', createdDate: new Date().toISOString().split('T')[0] };
    addPlan(dup);
  };

  const handleArchive = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (plan) updatePlan({ ...plan, status: 'archived' as const });
  };

  const handleDelete = (id: string) => {
    deletePlan(id);
    if (selectedPlan === id) setSelectedPlan(null);
  };

  // If viewing a specific plan
  if (selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      return (
        <ShelDemoLayout role="coach" userName="Alan Quinn">
          <PlanDetailView plan={plan} onUpdate={updatePlan} onBack={() => setSelectedPlan(null)} />
          <p className="text-xs text-muted-foreground text-center mt-6">Demo prototype — changes are stored in this session only.</p>
        </ShelDemoLayout>
      );
    }
  }

  // If creating
  if (showCreate) {
    return (
      <ShelDemoLayout role="coach" userName="Alan Quinn">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Session Planning</h1>
          <p className="text-muted-foreground mt-1">Periodisation, organisation, and long-term planning tool</p>
        </div>
        <PlanCreateForm onSave={handleCreate} onCancel={() => setShowCreate(false)} lockedAgeGroup={COACH_CONFIG.assignedSessionGroup} lockedCoach={COACH_CONFIG.name} />
      </ShelDemoLayout>
    );
  }

  return (
    <ShelDemoLayout role="coach" userName="Alan Quinn">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Session Planning</h1>
        <p className="text-muted-foreground mt-1">Periodisation, organisation, and long-term planning aligned with the club's methodology</p>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 bg-gradient-to-r from-red-500/10 to-red-700/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ClipboardList className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Coach-Led Planning & Periodisation</h4>
              <p className="text-sm text-muted-foreground">Plan, organise, and structure training from single sessions through to full season periodisation. All plans are aligned with the Club Methodology Hub and can be linked to Individual Development Plans.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Calendar className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{teamPlans.filter(p => p.type === 'single').length}</p><p className="text-xs text-muted-foreground">Sessions</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><BarChart3 className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{teamPlans.filter(p => p.type === 'weekly').length}</p><p className="text-xs text-muted-foreground">Weekly Plans</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Target className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{teamPlans.filter(p => p.type === 'block').length}</p><p className="text-xs text-muted-foreground">Multi-Week Blocks</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><BarChart3 className="h-6 w-6 text-green-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{teamPlans.filter(p => p.status === 'active').length}</p><p className="text-xs text-muted-foreground">Active Plans</p></CardContent></Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New Plan
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 w-48 h-9" placeholder="Search plans..." />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single">Sessions</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="season">Season</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPhase} onValueChange={setFilterPhase}>
            <SelectTrigger className="w-28 h-9"><SelectValue placeholder="Phase" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="pre-season">Pre-Season</SelectItem>
              <SelectItem value="early-season">Early Season</SelectItem>
              <SelectItem value="mid-season">Mid-Season</SelectItem>
              <SelectItem value="run-in">Run-In</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Plan List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active & Drafts ({activePlans.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedPlans.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          {activePlans.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No plans match your filters.</p>}
          {activePlans.map(plan => (
            <Card key={plan.id} className="bg-card border-border hover:border-red-500/40 transition-colors cursor-pointer" onClick={() => setSelectedPlan(plan.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${typeColor(plan.type)}`}>{typeLabel(plan.type)}</Badge>
                        <Badge variant="outline" className={`text-xs ${statusColor(plan.status)}`}>{plan.status}</Badge>
                      </div>
                      <h4 className="font-display text-sm font-medium text-foreground truncate">{plan.title}</h4>
                      <p className="text-xs text-muted-foreground">{plan.ageGroup} • {plan.coach} • <span className="capitalize">{plan.competitionPhase.replace('-', ' ')}</span> • {plan.dateStart}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDuplicate(plan)} title="Duplicate"><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleArchive(plan.id)} title="Archive"><Archive className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(plan.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="archived" className="space-y-3">
          {archivedPlans.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No archived plans.</p>}
          {archivedPlans.map(plan => (
            <Card key={plan.id} className="bg-card border-border opacity-60 cursor-pointer" onClick={() => setSelectedPlan(plan.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-xs ${typeColor(plan.type)}`}>{typeLabel(plan.type)}</Badge>
                      <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">archived</Badge>
                    </div>
                    <h4 className="font-display text-sm font-medium text-foreground">{plan.title}</h4>
                    <p className="text-xs text-muted-foreground">{plan.ageGroup} • {plan.coach}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={e => { e.stopPropagation(); handleDelete(plan.id); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center mt-6">Demo prototype — changes are stored in this session only. No data is persisted.</p>
    </ShelDemoLayout>
  );
};

export default ShelSessionPlanning;
