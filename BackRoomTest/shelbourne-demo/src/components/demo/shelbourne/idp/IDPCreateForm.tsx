import { useState } from 'react';
import { Target, Award, Save, X } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { shelPlayers } from '@data/shelbourneData';
import type { IDPFull, IDPMode, IDPGoalFull, HolisticEvaluation, PositionalProfile, PerformanceSupport, OffFieldDevelopment } from '@data/idpData';

interface Props {
  onSave: (idp: IDPFull) => void;
  onCancel: () => void;
  lockedAgeGroup?: string;
}

const defaultGoal = (): IDPGoalFull => ({
  id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  category: 'technical', title: '', description: '', targetDate: '', progress: 0, status: 'not-started', actions: [], evidence: [],
});

const AGE_GROUPS = ['U14 Boys', 'U15 Boys', 'U17 Boys', 'U19 Boys', 'U17 Girls', 'U19 Girls'];

const IDPCreateForm = ({ onSave, onCancel, lockedAgeGroup }: Props) => {
  const [mode, setMode] = useState<IDPMode>('basic');
  const [playerId, setPlayerId] = useState('');
  const [ageGroup, setAgeGroup] = useState(lockedAgeGroup || '');
  const [reviewDate, setReviewDate] = useState('');
  const [goals, setGoals] = useState<IDPGoalFull[]>([defaultGoal()]);

  // Elite fields
  const [holistic, setHolistic] = useState<HolisticEvaluation>({ technical: 5, tactical: 5, physical: 5, psychological: 5, lifestyle: 5, notes: '', date: new Date().toISOString().split('T')[0] });
  const [positional, setPositional] = useState<PositionalProfile>({ primaryPosition: '', secondaryPosition: '', demands: [''] });
  const [support, setSupport] = useState<PerformanceSupport>({ physicalFocus: '', nutritionHabits: '', recoveryHabits: '', psychologicalStrengthening: '' });
  const [offField, setOffField] = useState<OffFieldDevelopment>({ leadership: '', communication: '', education: '', lifeSkills: '' });

  const player = shelPlayers.find(p => p.id === playerId);
  const filteredPlayers = ageGroup ? shelPlayers.filter(p => p.ageGroup === ageGroup) : shelPlayers;

  const addGoal = () => setGoals([...goals, defaultGoal()]);
  const updateGoal = (i: number, updates: Partial<IDPGoalFull>) => {
    const updated = [...goals];
    updated[i] = { ...updated[i], ...updates };
    setGoals(updated);
  };
  const removeGoal = (i: number) => setGoals(goals.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!player) return;
    const idp: IDPFull = {
      id: `sidp-${Date.now()}`,
      playerId: player.id,
      playerName: player.name,
      position: player.position,
      ageGroup: player.ageGroup,
      mode,
      createdDate: new Date().toISOString().split('T')[0],
      lastReviewDate: new Date().toISOString().split('T')[0],
      nextReviewDate: reviewDate || '2025-05-01',
      status: 'active',
      overallProgress: 0,
      goals: goals.filter(g => g.title.trim()),
      coachComments: [],
      playerReflections: [],
      ...(mode === 'elite' ? { holisticEvaluation: holistic, positionalProfile: positional, performanceSupport: support, offFieldDevelopment: offField, reviewHistory: [], methodologyTags: [] } : {}),
    };
    onSave(idp);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl">Create New IDP</CardTitle>
            <CardDescription>Build a structured Individual Development Plan</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-5 w-5" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="info">Player Info</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            {mode === 'elite' && <TabsTrigger value="holistic">Holistic Evaluation</TabsTrigger>}
            {mode === 'elite' && <TabsTrigger value="positional">Positional</TabsTrigger>}
            {mode === 'elite' && <TabsTrigger value="support">Performance Support</TabsTrigger>}
            {mode === 'elite' && <TabsTrigger value="offfield">Off-Field</TabsTrigger>}
          </TabsList>

          {/* ═══ PLAYER INFO ═══ */}
          <TabsContent value="info" className="space-y-5">
            {/* Mode Selection */}
            <div>
              <Label className="mb-2 block font-medium">IDP Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <div onClick={() => setMode('basic')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'basic' ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-muted-foreground'}`}>
                  <div className="flex items-center gap-2 mb-1"><Target className="h-5 w-5 text-blue-400" /><span className="font-medium text-foreground">Basic IDP</span></div>
                  <p className="text-xs text-muted-foreground">2–3 development pillars, 3–5 goals, review date, coach comments, player reflections.</p>
                </div>
                <div onClick={() => setMode('elite')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'elite' ? 'border-amber-500 bg-amber-500/10' : 'border-border hover:border-muted-foreground'}`}>
                  <div className="flex items-center gap-2 mb-1"><Award className="h-5 w-5 text-amber-400" /><span className="font-medium text-foreground">Elite IDP</span></div>
                  <p className="text-xs text-muted-foreground">Living document: holistic evaluation, positional customisation, performance support, off-field development.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age Group</Label>
                {lockedAgeGroup ? (
                  <Input value={lockedAgeGroup} disabled className="mt-1" />
                ) : (
                  <Select value={ageGroup} onValueChange={v => { setAgeGroup(v); setPlayerId(''); }}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select age group" /></SelectTrigger>
                    <SelectContent>{AGE_GROUPS.map(ag => <SelectItem key={ag} value={ag}>{ag}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label>Player</Label>
                <Select value={playerId} onValueChange={setPlayerId} disabled={!ageGroup}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select player" /></SelectTrigger>
                  <SelectContent>{filteredPlayers.map(p => <SelectItem key={p.id} value={p.id}>{p.name} — {p.position}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {player && (
              <div className="p-3 rounded-lg bg-muted/30 text-sm">
                <span className="font-medium text-foreground">{player.name}</span> — {player.position} • {player.ageGroup}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date Created</Label>
                <Input type="date" value={new Date().toISOString().split('T')[0]} disabled className="mt-1" />
              </div>
              <div>
                <Label>Review Date</Label>
                <Input type="date" value={reviewDate} onChange={e => setReviewDate(e.target.value)} className="mt-1" />
              </div>
            </div>
          </TabsContent>

          {/* ═══ OBJECTIVES ═══ */}
          <TabsContent value="objectives" className="space-y-4">
            <p className="text-sm text-muted-foreground">Add 3–5 measurable objectives. Each should be specific, time-bound, and linked to match behaviours where possible.</p>
            {goals.map((goal, i) => (
              <Card key={goal.id} className="bg-muted/20 border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Objective {i + 1}</span>
                    {goals.length > 1 && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeGoal(i)}><X className="h-3 w-3" /></Button>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Category</Label>
                      <Select value={goal.category} onValueChange={(v: IDPGoalFull['category']) => updateGoal(i, { category: v })}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="tactical">Tactical</SelectItem>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="psychological">Psychological</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle & Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Target Date</Label>
                      <Input type="date" value={goal.targetDate} onChange={e => updateGoal(i, { targetDate: e.target.value })} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input value={goal.title} onChange={e => updateGoal(i, { title: e.target.value })} className="mt-1" placeholder="e.g. Improve weak foot passing accuracy" />
                  </div>
                  <div>
                    <Label className="text-xs">Description — specific, measurable, time-bound</Label>
                    <Textarea value={goal.description} onChange={e => updateGoal(i, { description: e.target.value })} className="mt-1" placeholder="Describe the objective, how it will be measured, and link to match behaviours..." rows={3} />
                  </div>
                  <div>
                    <Label className="text-xs">KPI / Measurement Indicator</Label>
                    <Input value={goal.actions[0] || ''} onChange={e => updateGoal(i, { actions: [e.target.value, ...(goal.actions.slice(1) || [])] })} className="mt-1" placeholder="e.g. Pass completion rate increases from 55% to 70%" />
                  </div>
                </CardContent>
              </Card>
            ))}
            {goals.length < 5 && (
              <Button variant="outline" size="sm" onClick={addGoal} className="w-full">+ Add Objective</Button>
            )}
          </TabsContent>

          {/* ═══ HOLISTIC EVALUATION (Elite) ═══ */}
          {mode === 'elite' && (
            <TabsContent value="holistic" className="space-y-4">
              <p className="text-sm text-muted-foreground">Rate the player across all five development pillars (1–10).</p>
              {(['technical', 'tactical', 'physical', 'psychological', 'lifestyle'] as const).map(pillar => (
                <div key={pillar} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="capitalize">{pillar}</Label>
                    <span className="text-sm font-bold text-foreground">{holistic[pillar]}/10</span>
                  </div>
                  <Input type="range" min={1} max={10} value={holistic[pillar]} onChange={e => setHolistic({ ...holistic, [pillar]: parseInt(e.target.value) })} className="w-full" />
                </div>
              ))}
              <div>
                <Label className="text-xs">Assessment Notes</Label>
                <Textarea value={holistic.notes} onChange={e => setHolistic({ ...holistic, notes: e.target.value })} className="mt-1" rows={3} placeholder="Overall assessment summary..." />
              </div>
            </TabsContent>
          )}

          {/* ═══ POSITIONAL (Elite) ═══ */}
          {mode === 'elite' && (
            <TabsContent value="positional" className="space-y-4">
              <p className="text-sm text-muted-foreground">Define position-specific development demands and tactical responsibilities.</p>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Primary Position</Label><Input value={positional.primaryPosition} onChange={e => setPositional({ ...positional, primaryPosition: e.target.value })} className="mt-1" placeholder="e.g. Striker" /></div>
                <div><Label>Secondary Position</Label><Input value={positional.secondaryPosition} onChange={e => setPositional({ ...positional, secondaryPosition: e.target.value })} className="mt-1" placeholder="e.g. Inside Forward" /></div>
              </div>
              <div>
                <Label className="text-xs mb-2 block">Position-Specific Training Focus</Label>
                {positional.demands.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                    <Input value={d} onChange={e => { const demands = [...positional.demands]; demands[i] = e.target.value; setPositional({ ...positional, demands }); }} className="flex-1" placeholder="e.g. Hold-up play and link with midfield runners" />
                    {positional.demands.length > 1 && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPositional({ ...positional, demands: positional.demands.filter((_, idx) => idx !== i) })}><X className="h-3 w-3" /></Button>}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setPositional({ ...positional, demands: [...positional.demands, ''] })}>+ Add Demand</Button>
              </div>
            </TabsContent>
          )}

          {/* ═══ PERFORMANCE SUPPORT (Elite) ═══ */}
          {mode === 'elite' && (
            <TabsContent value="support" className="space-y-4">
              <p className="text-sm text-muted-foreground">Integrated performance support covering physical, nutrition, recovery, and mental strategies.</p>
              {([
                { key: 'physicalFocus' as const, label: 'Physical Conditioning Focus', placeholder: 'e.g. Upper body strength and explosive power for hold-up play.' },
                { key: 'nutritionHabits' as const, label: 'Nutrition Guidance Notes', placeholder: 'e.g. Increase protein on training days. Improve post-training fuelling.' },
                { key: 'recoveryHabits' as const, label: 'Recovery Habits', placeholder: 'e.g. Consistent sleep routine. Foam rolling post-session. Ice baths after matches.' },
                { key: 'psychologicalStrengthening' as const, label: 'Mental & Psychological Strategies', placeholder: 'e.g. Composure under pressure. Positive self-talk techniques.' },
              ]).map(({ key, label, placeholder }) => (
                <div key={key}>
                  <Label className="text-xs">{label}</Label>
                  <Textarea value={support[key]} onChange={e => setSupport({ ...support, [key]: e.target.value })} className="mt-1" rows={2} placeholder={placeholder} />
                </div>
              ))}
            </TabsContent>
          )}

          {/* ═══ OFF-FIELD (Elite) ═══ */}
          {mode === 'elite' && (
            <TabsContent value="offfield" className="space-y-4">
              <p className="text-sm text-muted-foreground">Off-field development areas: education, lifestyle, leadership, and character.</p>
              {([
                { key: 'leadership' as const, label: 'Leadership', placeholder: 'e.g. Developing vocal leadership qualities. Captaincy opportunities.' },
                { key: 'communication' as const, label: 'Communication', placeholder: 'e.g. Confidence in group settings. Positive influence on teammates.' },
                { key: 'education' as const, label: 'Education', placeholder: 'e.g. Leaving Certificate preparation. Balancing academic and football demands.' },
                { key: 'lifeSkills' as const, label: 'Life Skills & Character', placeholder: 'e.g. Financial literacy awareness. Time management. Maturity.' },
              ]).map(({ key, label, placeholder }) => (
                <div key={key}>
                  <Label className="text-xs">{label}</Label>
                  <Textarea value={offField[key]} onChange={e => setOffField({ ...offField, [key]: e.target.value })} className="mt-1" rows={2} placeholder={placeholder} />
                </div>
              ))}
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end gap-2 pt-6 border-t border-border mt-6">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSave} disabled={!playerId}>
            <Save className="h-4 w-4 mr-1" /> Save IDP
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">Demo prototype — data is stored in this session only.</p>
      </CardContent>
    </Card>
  );
};

export default IDPCreateForm;
