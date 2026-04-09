import { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { methodologyTags } from '@pages/demo/shelbourne/shared/MethodologyHub';
import type {
  ShelPlan, PlanType, CompetitionPhase, Intensity, MatchDay,
  WeeklyDayEntry, BlockWeek,
} from '@data/shelbourneSessionData';
import { blankDay } from '@data/shelbourneSessionData';

interface Props {
  onSave: (plan: ShelPlan) => void;
  onCancel: () => void;
  lockedAgeGroup?: string;
  lockedCoach?: string;
}

const defaultPhase = (name: string) => ({
  name, duration: '', description: '', coachingPoints: [''], equipment: [''],
});

const defaultDays = (): WeeklyDayEntry[] => [
  { ...blankDay('Monday'), type: 'recovery' as const, title: 'Recovery', matchProximity: 'MD+1' },
  { ...blankDay('Tuesday'), type: 'football' as const, title: 'Training', matchProximity: 'MD-4' },
  { ...blankDay('Wednesday'), type: 'gym' as const, title: 'Gym & S&C', matchProximity: 'MD-3' },
  { ...blankDay('Thursday'), type: 'football' as const, title: 'Training', matchProximity: 'MD-2' },
  { ...blankDay('Friday'), type: 'football' as const, title: 'Match Prep', matchProximity: 'MD-1' },
  { ...blankDay('Saturday'), type: 'match' as const, title: 'Match Day', matchProximity: 'MD' },
  { ...blankDay('Sunday'), type: 'rest' as const, title: 'Rest Day', matchProximity: '' },
];

const PlanCreateForm = ({ onSave, onCancel, lockedAgeGroup, lockedCoach }: Props) => {
  const [planType, setPlanType] = useState<PlanType>('single');
  const [title, setTitle] = useState('');
  const [ageGroup, setAgeGroup] = useState(lockedAgeGroup ?? 'U17');
  const [coach, setCoach] = useState(lockedCoach ?? '');
  const [phase, setPhase] = useState<CompetitionPhase>('mid-season');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // Single session state
  const [sessionObj, setSessionObj] = useState('');
  const [duration, setDuration] = useState('90 min');
  const [tacticalTheme, setTacticalTheme] = useState('');
  const [methPrinciple, setMethPrinciple] = useState('');
  const [subPrinciples, setSubPrinciples] = useState(['']);
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [physObj, setPhysObj] = useState('');
  const [matchProx, setMatchProx] = useState<MatchDay>('MD-2');
  const [techFocus, setTechFocus] = useState(['']);
  const [psychFocus, setPsychFocus] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [activation, setActivation] = useState(defaultPhase('Activation'));
  const [technical, setTechnical] = useState(defaultPhase('Technical Component'));
  const [tactical, setTactical] = useState(defaultPhase('Tactical Component'));
  const [conditioned, setConditioned] = useState(defaultPhase('Conditioned Game'));
  const [reflection, setReflection] = useState(defaultPhase('Reflection & Review'));

  // Weekly state
  const [weekTheme, setWeekTheme] = useState('');
  const [weekObjectives, setWeekObjectives] = useState(['', '']);
  const [weekDays, setWeekDays] = useState<WeeklyDayEntry[]>(defaultDays());

  // Block state
  const [blockTitle, setBlockTitle] = useState('');
  const [blockWeeks, setBlockWeeks] = useState<BlockWeek[]>([
    { weekNumber: 1, theme: '', objectives: [''], days: defaultDays() },
  ]);

  // Season state
  const [seasonPhases, setSeasonPhases] = useState([
    { name: 'Pre-Season', weeks: 5, focus: [''], objectives: [''], competitionPhase: 'pre-season' as CompetitionPhase },
  ]);

  const psychOptions = ['Decision-making', 'Communication', 'Leadership', 'Resilience'];

  const handleSave = () => {
    const plan: ShelPlan = {
      id: `sp-${Date.now()}`,
      type: planType,
      title,
      ageGroup,
      coach,
      competitionPhase: phase,
      dateStart,
      dateEnd,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
    };

    if (planType === 'single') {
      plan.session = {
        objective: sessionObj, duration, tacticalTheme, methodologyPrinciple: methPrinciple,
        subPrinciples: subPrinciples.filter(s => s.trim()),
        intensity, physicalObjective: physObj, matchProximity: matchProx,
        technicalFocus: techFocus.filter(t => t.trim()),
        psychFocus,
        linkedIDPObjectives: [],
        phases: { activation, technical, tactical, conditionedGame: conditioned, reflection },
        notes: sessionNotes,
      };
    } else if (planType === 'weekly') {
      plan.weeklyPlan = { theme: weekTheme, objectives: weekObjectives.filter(o => o.trim()), days: weekDays };
    } else if (planType === 'block') {
      plan.blockPlan = { blockTitle, weeks: blockWeeks };
    } else if (planType === 'season') {
      plan.seasonPlan = { phases: seasonPhases };
    }

    onSave(plan);
  };

  const updateWeekDay = (idx: number, field: keyof WeeklyDayEntry, value: unknown) => {
    const updated = [...weekDays];
    (updated[idx] as unknown as Record<string, unknown>)[field as string] = value;
    setWeekDays(updated);
  };

  const renderPhaseEditor = (phaseData: typeof activation, setter: typeof setActivation, label: string) => (
    <div className="p-4 rounded-lg bg-muted/30 space-y-3">
      <h5 className="font-medium text-foreground text-sm">{label}</h5>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Name</Label><Input value={phaseData.name} onChange={e => setter({ ...phaseData, name: e.target.value })} className="mt-1 h-8 text-sm" /></div>
        <div><Label className="text-xs">Duration</Label><Input value={phaseData.duration} onChange={e => setter({ ...phaseData, duration: e.target.value })} className="mt-1 h-8 text-sm" placeholder="e.g. 15 min" /></div>
      </div>
      <div><Label className="text-xs">Description</Label><Textarea value={phaseData.description} onChange={e => setter({ ...phaseData, description: e.target.value })} className="mt-1 text-sm" rows={2} /></div>
      <div>
        <Label className="text-xs">Coaching Points</Label>
        {phaseData.coachingPoints.map((p, i) => (
          <Input key={i} value={p} onChange={e => { const pts = [...phaseData.coachingPoints]; pts[i] = e.target.value; setter({ ...phaseData, coachingPoints: pts }); }} className="mt-1 h-8 text-sm" placeholder={`Point ${i + 1}`} />
        ))}
        <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs" onClick={() => setter({ ...phaseData, coachingPoints: [...phaseData.coachingPoints, ''] })}><Plus className="h-3 w-3 mr-1" /> Add Point</Button>
      </div>
      <div>
        <Label className="text-xs">Equipment</Label>
        <Input value={phaseData.equipment.join(', ')} onChange={e => setter({ ...phaseData, equipment: e.target.value.split(',').map(s => s.trim()) })} className="mt-1 h-8 text-sm" placeholder="Cones, Footballs, Bibs" />
      </div>
    </div>
  );

  return (
    <Card className="bg-card border-red-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg">Create New Plan</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Plan Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label>Plan Type</Label>
              <Select value={planType} onValueChange={(v: PlanType) => setPlanType(v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Session</SelectItem>
                  <SelectItem value="weekly">Weekly Plan</SelectItem>
                  <SelectItem value="block">Multi-Week Block</SelectItem>
                  <SelectItem value="season">Season Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Age Group</Label>
              {lockedAgeGroup ? (
                <Input value={lockedAgeGroup} disabled className="mt-1" />
              ) : (
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="U14">U14</SelectItem>
                    <SelectItem value="U15">U15</SelectItem>
                    <SelectItem value="U17">U17</SelectItem>
                    <SelectItem value="U19">U19</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <Label>Competition Phase</Label>
              <Select value={phase} onValueChange={(v: CompetitionPhase) => setPhase(v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-season">Pre-Season</SelectItem>
                  <SelectItem value="early-season">Early Season</SelectItem>
                  <SelectItem value="mid-season">Mid-Season</SelectItem>
                  <SelectItem value="run-in">Run-In Phase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Coach</Label><Input value={coach} onChange={e => !lockedCoach && setCoach(e.target.value)} disabled={!!lockedCoach} className="mt-1" placeholder="e.g. Paul Doolin" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1" placeholder="e.g. U17 Week 3 — Pressing" /></div>
            <div><Label>Start Date</Label><Input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="mt-1" /></div>
            <div><Label>End Date</Label><Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="mt-1" /></div>
          </div>
        </div>

        {/* Single Session */}
        {planType === 'single' && (
          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="font-display text-base text-foreground">Session Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Session Objective</Label><Textarea value={sessionObj} onChange={e => setSessionObj(e.target.value)} className="mt-1" rows={2} /></div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Duration</Label><Input value={duration} onChange={e => setDuration(e.target.value)} className="mt-1" placeholder="90 min" /></div>
                  <div>
                    <Label>Intensity</Label>
                    <Select value={intensity} onValueChange={(v: Intensity) => setIntensity(v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Match Proximity</Label>
                  <Select value={matchProx} onValueChange={(v: MatchDay) => setMatchProx(v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{['MD-4','MD-3','MD-2','MD-1','MD','MD+1','MD+2'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tactical Theme</Label><Input value={tacticalTheme} onChange={e => setTacticalTheme(e.target.value)} className="mt-1" placeholder="e.g. Press from the Front" /></div>
              <div>
                <Label>Methodology Principle</Label>
                <Select value={methPrinciple} onValueChange={setMethPrinciple}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select principle..." /></SelectTrigger>
                  <SelectContent>{methodologyTags.principles.map(p => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Sub-Principles</Label>
              {subPrinciples.map((s, i) => (
                <Input key={i} value={s} onChange={e => { const arr = [...subPrinciples]; arr[i] = e.target.value; setSubPrinciples(arr); }} className="mt-1" placeholder={`Sub-principle ${i + 1}`} />
              ))}
              <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs" onClick={() => setSubPrinciples([...subPrinciples, ''])}><Plus className="h-3 w-3 mr-1" /> Add</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Physical Objective</Label><Input value={physObj} onChange={e => setPhysObj(e.target.value)} className="mt-1" placeholder="e.g. High-intensity repeated sprints" /></div>
              <div>
                <Label>Technical Focus</Label>
                {techFocus.map((t, i) => (
                  <Input key={i} value={t} onChange={e => { const arr = [...techFocus]; arr[i] = e.target.value; setTechFocus(arr); }} className="mt-1" placeholder={`Focus ${i + 1}`} />
                ))}
                <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs" onClick={() => setTechFocus([...techFocus, ''])}><Plus className="h-3 w-3 mr-1" /> Add</Button>
              </div>
            </div>
            <div>
              <Label>Psychological & Game Intelligence Focus</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {psychOptions.map(opt => (
                  <Badge key={opt} variant={psychFocus.includes(opt.toLowerCase()) ? 'default' : 'outline'}
                    className={`cursor-pointer ${psychFocus.includes(opt.toLowerCase()) ? 'bg-red-600 text-white' : ''}`}
                    onClick={() => setPsychFocus(prev => prev.includes(opt.toLowerCase()) ? prev.filter(p => p !== opt.toLowerCase()) : [...prev, opt.toLowerCase()])}>
                    {opt}
                  </Badge>
                ))}
              </div>
            </div>

            <h4 className="font-display text-base text-foreground pt-2">Phase Breakdown</h4>
            {renderPhaseEditor(activation, setActivation, '1. Activation')}
            {renderPhaseEditor(technical, setTechnical, '2. Technical Component')}
            {renderPhaseEditor(tactical, setTactical, '3. Tactical Component')}
            {renderPhaseEditor(conditioned, setConditioned, '4. Conditioned Game')}
            {renderPhaseEditor(reflection, setReflection, '5. Reflection & Review')}

            <div><Label>Session Notes & Adjustments</Label><Textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} className="mt-1" rows={2} /></div>
          </div>
        )}

        {/* Weekly Plan */}
        {planType === 'weekly' && (
          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="font-display text-base text-foreground">Weekly Plan</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Weekly Theme</Label><Input value={weekTheme} onChange={e => setWeekTheme(e.target.value)} className="mt-1" placeholder="e.g. Pressing & Transition" /></div>
              <div>
                <Label>Objectives</Label>
                {weekObjectives.map((o, i) => (
                  <Input key={i} value={o} onChange={e => { const arr = [...weekObjectives]; arr[i] = e.target.value; setWeekObjectives(arr); }} className="mt-1" placeholder={`Objective ${i + 1}`} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Daily Schedule</Label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left p-2 text-muted-foreground font-medium">Day</th>
                    <th className="text-left p-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left p-2 text-muted-foreground font-medium">Title</th>
                    <th className="text-left p-2 text-muted-foreground font-medium">Focus</th>
                    <th className="text-left p-2 text-muted-foreground font-medium">Intensity</th>
                    <th className="text-left p-2 text-muted-foreground font-medium">Tactical Theme</th>
                    <th className="text-left p-2 text-muted-foreground font-medium">MD</th>
                  </tr></thead>
                  <tbody>{weekDays.map((d, i) => (
                    <tr key={d.day} className="border-b border-border/50">
                      <td className="p-2 font-medium text-foreground">{d.day}</td>
                      <td className="p-1">
                        <Select value={d.type} onValueChange={(v: WeeklyDayEntry['type']) => updateWeekDay(i, 'type', v)}>
                          <SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="football">Football</SelectItem><SelectItem value="gym">Gym</SelectItem><SelectItem value="recovery">Recovery</SelectItem><SelectItem value="match">Match</SelectItem><SelectItem value="rest">Rest</SelectItem></SelectContent>
                        </Select>
                      </td>
                      <td className="p-1"><Input value={d.title} onChange={e => updateWeekDay(i, 'title', e.target.value)} className="h-8 text-xs" /></td>
                      <td className="p-1"><Input value={d.focus} onChange={e => updateWeekDay(i, 'focus', e.target.value)} className="h-8 text-xs" /></td>
                      <td className="p-1">
                        <Select value={d.intensity} onValueChange={(v: Intensity) => updateWeekDay(i, 'intensity', v)}>
                          <SelectTrigger className="h-8 text-xs w-20"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Med</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                        </Select>
                      </td>
                      <td className="p-1"><Input value={d.tacticalTheme} onChange={e => updateWeekDay(i, 'tacticalTheme', e.target.value)} className="h-8 text-xs" /></td>
                      <td className="p-1"><Input value={d.matchProximity} onChange={e => updateWeekDay(i, 'matchProximity', e.target.value)} className="h-8 text-xs w-16" /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Block Plan */}
        {planType === 'block' && (
          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="font-display text-base text-foreground">Multi-Week Block</h4>
            <div><Label>Block Title</Label><Input value={blockTitle} onChange={e => setBlockTitle(e.target.value)} className="mt-1" placeholder="e.g. Defensive Organisation Focus" /></div>
            {blockWeeks.map((week, wi) => (
              <div key={wi} className="p-4 rounded-lg bg-muted/20 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-foreground">Week {week.weekNumber}</h5>
                  {blockWeeks.length > 1 && <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => setBlockWeeks(blockWeeks.filter((_, i) => i !== wi))}><Trash2 className="h-3 w-3" /></Button>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Theme</Label><Input value={week.theme} onChange={e => { const w = [...blockWeeks]; w[wi] = { ...w[wi], theme: e.target.value }; setBlockWeeks(w); }} className="mt-1 h-8 text-sm" /></div>
                  <div><Label className="text-xs">Objectives</Label>{week.objectives.map((o, oi) => <Input key={oi} value={o} onChange={e => { const w = [...blockWeeks]; const objs = [...w[wi].objectives]; objs[oi] = e.target.value; w[wi] = { ...w[wi], objectives: objs }; setBlockWeeks(w); }} className="mt-1 h-8 text-sm" placeholder={`Obj ${oi + 1}`} />)}</div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setBlockWeeks([...blockWeeks, { weekNumber: blockWeeks.length + 1, theme: '', objectives: [''], days: defaultDays() }])}><Plus className="h-4 w-4 mr-1" /> Add Week</Button>
          </div>
        )}

        {/* Season Plan */}
        {planType === 'season' && (
          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="font-display text-base text-foreground">Season Phases</h4>
            {seasonPhases.map((sp, si) => (
              <div key={si} className="p-4 rounded-lg bg-muted/20 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-foreground">Phase {si + 1}</h5>
                  {seasonPhases.length > 1 && <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => setSeasonPhases(seasonPhases.filter((_, i) => i !== si))}><Trash2 className="h-3 w-3" /></Button>}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label className="text-xs">Name</Label><Input value={sp.name} onChange={e => { const arr = [...seasonPhases]; arr[si] = { ...arr[si], name: e.target.value }; setSeasonPhases(arr); }} className="mt-1 h-8 text-sm" /></div>
                  <div><Label className="text-xs">Weeks</Label><Input type="number" value={sp.weeks} onChange={e => { const arr = [...seasonPhases]; arr[si] = { ...arr[si], weeks: parseInt(e.target.value) || 1 }; setSeasonPhases(arr); }} className="mt-1 h-8 text-sm" /></div>
                  <div><Label className="text-xs">Phase</Label>
                    <Select value={sp.competitionPhase} onValueChange={(v: CompetitionPhase) => { const arr = [...seasonPhases]; arr[si] = { ...arr[si], competitionPhase: v }; setSeasonPhases(arr); }}>
                      <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="pre-season">Pre-Season</SelectItem><SelectItem value="early-season">Early Season</SelectItem><SelectItem value="mid-season">Mid-Season</SelectItem><SelectItem value="run-in">Run-In</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Objectives</Label>
                  {sp.objectives.map((o, oi) => <Input key={oi} value={o} onChange={e => { const arr = [...seasonPhases]; const objs = [...arr[si].objectives]; objs[oi] = e.target.value; arr[si] = { ...arr[si], objectives: objs }; setSeasonPhases(arr); }} className="mt-1 h-8 text-sm" placeholder={`Objective ${oi + 1}`} />)}
                  <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs" onClick={() => { const arr = [...seasonPhases]; arr[si] = { ...arr[si], objectives: [...arr[si].objectives, ''] }; setSeasonPhases(arr); }}><Plus className="h-3 w-3 mr-1" /> Add Objective</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setSeasonPhases([...seasonPhases, { name: '', weeks: 4, focus: [''], objectives: [''], competitionPhase: 'mid-season' }])}><Plus className="h-4 w-4 mr-1" /> Add Phase</Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSave} disabled={!title}>
            <Save className="h-4 w-4 mr-1" /> Create Plan
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Demo prototype — data is stored in this session only.</p>
      </CardContent>
    </Card>
  );
};

export default PlanCreateForm;
