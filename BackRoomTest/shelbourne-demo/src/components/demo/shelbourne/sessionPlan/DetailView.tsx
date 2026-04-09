import { useState } from 'react';
import { Edit3, Save, X, Plus, Tag, Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { methodologyTags } from '@pages/demo/shelbourne/shared/MethodologyHub';
import { shelDetailedIDPs } from '@data/shelbourneIDPData';
import type { ShelPlan, Intensity, WeeklyDayEntry, SingleSessionData } from '@data/shelbourneSessionData';

interface Props {
  plan: ShelPlan;
  onUpdate: (plan: ShelPlan) => void;
  onBack: () => void;
}

const intensityColor = (i: Intensity) =>
  i === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
  i === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
  'bg-green-500/20 text-green-400 border-green-500/30';

const typeColor = (t: string) =>
  t === 'football' ? 'bg-red-500/20 border-red-500/30' :
  t === 'gym' ? 'bg-purple-500/20 border-purple-500/30' :
  t === 'recovery' ? 'bg-green-500/20 border-green-500/30' :
  t === 'match' ? 'bg-amber-500/20 border-amber-500/30' :
  'bg-muted';

const allIDPGoals = Object.values(shelDetailedIDPs).flatMap(idp =>
  idp.goals.map(g => ({ id: g.id, label: `${idp.playerName} — ${g.title}`, playerName: idp.playerName }))
);
const allPrinciples = methodologyTags.principles;

const PlanDetailView = ({ plan, onUpdate, onBack }: Props) => {
  const [editing, setEditing] = useState(false);
  const [editPlan, setEditPlan] = useState<ShelPlan>({ ...plan });

  const handleSave = () => {
    onUpdate(editPlan);
    setEditing(false);
  };

  const getPrincipleLabel = (id: string) => allPrinciples.find(p => p.id === id)?.label ?? id;

  // ── Single Session View ────────────────────────────────
  const renderSingleSession = () => {
    const s = editing ? editPlan.session! : plan.session!;

    const updateSession = (field: keyof SingleSessionData, value: unknown) => {
      setEditPlan({ ...editPlan, session: { ...editPlan.session!, [field]: value } });
    };

    const updatePhase = (phaseKey: string, field: string, value: unknown) => {
      const phases = { ...editPlan.session!.phases };
      (phases as unknown as Record<string, Record<string, unknown>>)[phaseKey] = { ...(phases as unknown as Record<string, Record<string, unknown>>)[phaseKey], [field]: value };
      setEditPlan({ ...editPlan, session: { ...editPlan.session!, phases } });
    };

    return (
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">Duration</p>
            {editing ? <Input value={s.duration} onChange={e => updateSession('duration', e.target.value)} className="mt-1 h-8 text-sm" /> : <p className="font-medium text-foreground text-sm">{s.duration}</p>}
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">Intensity</p>
            {editing ? (
              <Select value={s.intensity} onValueChange={(v: Intensity) => updateSession('intensity', v)}>
                <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
              </Select>
            ) : <Badge variant="outline" className={`mt-1 ${intensityColor(s.intensity)}`}>{s.intensity}</Badge>}
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">Match Proximity</p>
            <p className="font-medium text-foreground text-sm mt-1">{s.matchProximity}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">Methodology</p>
            {s.methodologyPrinciple ? (
              <Badge variant="outline" className="mt-1 bg-red-500/20 text-red-400 border-red-500/30 text-xs"><Tag className="h-3 w-3 mr-1" /> {getPrincipleLabel(s.methodologyPrinciple)}</Badge>
            ) : <p className="text-xs text-muted-foreground mt-1">None linked</p>}
          </div>
        </div>

        {/* Objective */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Session Objective</h4>
          {editing ? <Textarea value={s.objective} onChange={e => updateSession('objective', e.target.value)} rows={2} /> : <p className="text-sm text-muted-foreground">{s.objective}</p>}
        </div>

        {/* Tactical & Technical */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Tactical Theme</h4>
            {editing ? <Input value={s.tacticalTheme} onChange={e => updateSession('tacticalTheme', e.target.value)} /> : <p className="text-sm text-muted-foreground">{s.tacticalTheme}</p>}
            {s.subPrinciples.length > 0 && (
              <div className="mt-2">{s.subPrinciples.map((sp, i) => <p key={i} className="text-xs text-muted-foreground">• {sp}</p>)}</div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Technical Focus</h4>
            {s.technicalFocus.map((t, i) => <p key={i} className="text-xs text-muted-foreground">• {t}</p>)}
          </div>
        </div>

        {/* Psych Focus */}
        {s.psychFocus.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-2">Psychological & Game Intelligence</h4>
            <div className="flex gap-2">{s.psychFocus.map(p => <Badge key={p} variant="outline" className="capitalize">{p}</Badge>)}</div>
          </div>
        )}

        {/* Phase Breakdown */}
        <h4 className="font-display text-base text-foreground">Phase Breakdown</h4>
        {(['activation', 'technical', 'tactical', 'conditionedGame', 'reflection'] as const).map((key, idx) => {
          const phase = s.phases[key];
          const labels = ['1. Activation', '2. Technical Component', '3. Tactical Component', '4. Conditioned Game', '5. Reflection & Review'];
          return (
            <div key={key} className={`p-4 rounded-lg border ${idx === 2 || idx === 3 ? 'bg-red-500/5 border-red-500/20' : 'bg-muted/30 border-border'}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-foreground text-sm">{labels[idx]} — {phase.name}</h5>
                <Badge variant="outline">{phase.duration}</Badge>
              </div>
              {editing ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={phase.name} onChange={e => updatePhase(key, 'name', e.target.value)} className="h-8 text-sm" placeholder="Name" />
                    <Input value={phase.duration} onChange={e => updatePhase(key, 'duration', e.target.value)} className="h-8 text-sm" placeholder="Duration" />
                  </div>
                  <Textarea value={phase.description} onChange={e => updatePhase(key, 'description', e.target.value)} rows={2} className="text-sm" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Coaching Points</p>
                    {phase.coachingPoints.map((p, i) => (
                      <Input key={i} value={p} onChange={e => {
                        const pts = [...phase.coachingPoints]; pts[i] = e.target.value;
                        updatePhase(key, 'coachingPoints', pts);
                      }} className="mt-1 h-7 text-xs" />
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 text-xs mt-1" onClick={() => updatePhase(key, 'coachingPoints', [...phase.coachingPoints, ''])}><Plus className="h-3 w-3 mr-1" /> Add</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                  {phase.coachingPoints.filter(p => p).length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-500 mb-1">Coaching Points</p>
                      {phase.coachingPoints.filter(p => p).map((p, i) => <p key={i} className="text-xs text-muted-foreground">• {p}</p>)}
                    </div>
                  )}
                  {phase.equipment.filter(e => e).length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">Equipment: {phase.equipment.filter(e => e).join(', ')}</p>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Notes */}
        {(s.notes || editing) && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <h5 className="font-medium text-foreground mb-2 flex items-center gap-2"><Edit3 className="h-4 w-4 text-amber-400" /> Notes & Adjustments</h5>
            {editing ? <Textarea value={s.notes} onChange={e => updateSession('notes', e.target.value)} rows={2} className="text-sm" /> : <p className="text-sm text-muted-foreground italic">{s.notes}</p>}
          </div>
        )}

        {/* Linked IDPs */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <h5 className="font-medium text-foreground mb-2 flex items-center gap-2"><Link2 className="h-4 w-4 text-red-500" /> Linked IDP Objectives</h5>
          {editing ? (
            <div className="space-y-2">
              {allIDPGoals.map(g => (
                <label key={g.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" checked={editPlan.session!.linkedIDPObjectives.includes(g.id)}
                    onChange={e => {
                      const linked = e.target.checked
                        ? [...editPlan.session!.linkedIDPObjectives, g.id]
                        : editPlan.session!.linkedIDPObjectives.filter(id => id !== g.id);
                      updateSession('linkedIDPObjectives', linked);
                    }} className="rounded" />
                  {g.label}
                </label>
              ))}
            </div>
          ) : (
            s.linkedIDPObjectives.length > 0
              ? s.linkedIDPObjectives.map(id => {
                  const goal = allIDPGoals.find(g => g.id === id);
                  return goal ? <Badge key={id} variant="outline" className="mr-1 mb-1 text-xs">{goal.label}</Badge> : null;
                })
              : <p className="text-xs text-muted-foreground">No IDP objectives linked yet. Edit to connect.</p>
          )}
        </div>
      </div>
    );
  };

  // ── Weekly & Block View ────────────────────────────────
  const renderWeeklyTable = (days: WeeklyDayEntry[], weekIdx?: number) => {
    const updateDay = (di: number, field: keyof WeeklyDayEntry, value: unknown) => {
      if (weekIdx !== undefined && editPlan.blockPlan) {
        const weeks = [...editPlan.blockPlan.weeks];
        const updDays = [...weeks[weekIdx].days];
        (updDays[di] as unknown as Record<string, unknown>)[field as string] = value;
        weeks[weekIdx] = { ...weeks[weekIdx], days: updDays };
        setEditPlan({ ...editPlan, blockPlan: { ...editPlan.blockPlan, weeks } });
      } else if (editPlan.weeklyPlan) {
        const updDays = [...editPlan.weeklyPlan.days];
        (updDays[di] as unknown as Record<string, unknown>)[field as string] = value;
        setEditPlan({ ...editPlan, weeklyPlan: { ...editPlan.weeklyPlan, days: updDays } });
      }
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            <th className="text-left p-2 text-muted-foreground font-medium text-xs">Day</th>
            <th className="text-left p-2 text-muted-foreground font-medium text-xs">Focus</th>
            <th className="text-left p-2 text-muted-foreground font-medium text-xs">Intensity</th>
            <th className="text-left p-2 text-muted-foreground font-medium text-xs">Tactical Theme</th>
            <th className="text-left p-2 text-muted-foreground font-medium text-xs">Methodology</th>
            <th className="text-left p-2 text-muted-foreground font-medium text-xs">MD</th>
            <th className="text-left p-2 text-muted-foreground font-medium text-xs">Linked IDPs</th>
          </tr></thead>
          <tbody>{days.map((d, di) => (
            <tr key={d.day} className="border-b border-border/50">
              <td className="p-2">
                <div className={`px-2 py-1 rounded text-xs font-medium ${typeColor(d.type)} border`}>{d.day}</div>
              </td>
              <td className="p-2">
                {editing ? (
                  <div className="space-y-1">
                    <Input value={d.title} onChange={e => updateDay(di, 'title', e.target.value)} className="h-7 text-xs" />
                    <Input value={d.focus} onChange={e => updateDay(di, 'focus', e.target.value)} className="h-7 text-xs" placeholder="Focus" />
                  </div>
                ) : (
                  <div><p className="font-medium text-foreground text-xs">{d.title}</p>{d.focus && <p className="text-xs text-muted-foreground">{d.focus}</p>}</div>
                )}
              </td>
              <td className="p-2"><Badge variant="outline" className={`text-xs ${intensityColor(d.intensity)}`}>{d.intensity}</Badge></td>
              <td className="p-2">
                {editing ? <Input value={d.tacticalTheme} onChange={e => updateDay(di, 'tacticalTheme', e.target.value)} className="h-7 text-xs w-32" />
                  : d.tacticalTheme ? <span className="text-xs text-foreground">{d.tacticalTheme}</span> : <span className="text-xs text-muted-foreground">—</span>}
              </td>
              <td className="p-2">
                {d.methodologyPrinciple ? (
                  <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/30">{getPrincipleLabel(d.methodologyPrinciple)}</Badge>
                ) : <span className="text-xs text-muted-foreground">—</span>}
              </td>
              <td className="p-2"><span className="text-xs text-muted-foreground">{d.matchProximity || '—'}</span></td>
              <td className="p-2">
                {d.linkedIDPObjectives.length > 0
                  ? d.linkedIDPObjectives.map(id => { const g = allIDPGoals.find(x => x.id === id); return g ? <Badge key={id} variant="outline" className="text-xs mr-1">{g.playerName}</Badge> : null; })
                  : <span className="text-xs text-muted-foreground">—</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  };

  const renderWeekly = () => {
    const wp = editing ? editPlan.weeklyPlan! : plan.weeklyPlan!;
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-1">Theme: {wp.theme}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">{wp.objectives.map((o, i) => <li key={i}>• {o}</li>)}</ul>
        </div>
        {renderWeeklyTable(wp.days)}
      </div>
    );
  };

  const renderBlock = () => {
    const bp = editing ? editPlan.blockPlan! : plan.blockPlan!;
    return (
      <Tabs defaultValue="0" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          {bp.weeks.map((w, i) => <TabsTrigger key={i} value={String(i)} className="text-xs">Week {w.weekNumber}</TabsTrigger>)}
        </TabsList>
        {bp.weeks.map((w, i) => (
          <TabsContent key={i} value={String(i)} className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Theme: {w.theme}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">{w.objectives.map((o, j) => <li key={j}>• {o}</li>)}</ul>
            </div>
            {renderWeeklyTable(w.days, i)}
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  const renderSeason = () => {
    const sp = editing ? editPlan.seasonPlan! : plan.seasonPlan!;
    return (
      <div className="space-y-4">
        {sp.phases.map((phase, i) => (
          <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{phase.name}</h4>
              <div className="flex gap-2">
                <Badge variant="outline">{phase.weeks} weeks</Badge>
                <Badge variant="outline" className="capitalize bg-red-500/10 text-red-400 border-red-500/30">{phase.competitionPhase.replace('-', ' ')}</Badge>
              </div>
            </div>
            {editing ? (
              <div className="space-y-2">
                <Input value={phase.name} onChange={e => { const p = [...sp.phases]; p[i] = { ...p[i], name: e.target.value }; setEditPlan({ ...editPlan, seasonPlan: { phases: p } }); }} className="h-8 text-sm" />
                {phase.objectives.map((o, j) => (
                  <Input key={j} value={o} onChange={e => { const p = [...sp.phases]; const objs = [...p[i].objectives]; objs[j] = e.target.value; p[i] = { ...p[i], objectives: objs }; setEditPlan({ ...editPlan, seasonPlan: { phases: p } }); }} className="h-8 text-sm" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-1 mb-2">{phase.focus.map((f, j) => <Badge key={j} variant="secondary" className="bg-red-500/10 text-red-400 text-xs">{f}</Badge>)}</div>
                <ul className="text-sm text-muted-foreground space-y-1">{phase.objectives.map((o, j) => <li key={j}>• {o}</li>)}</ul>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-card border-red-500/30">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-display text-lg">{plan.title}</CardTitle>
            <CardDescription>
              {plan.ageGroup} • {plan.coach} • <span className="capitalize">{plan.competitionPhase.replace('-', ' ')}</span> • {plan.dateStart} to {plan.dateEnd}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onBack}><X className="h-4 w-4 mr-1" /> Back</Button>
            {editing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => { setEditPlan({ ...plan }); setEditing(false); }}>Cancel</Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Save</Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Edit3 className="h-4 w-4 mr-1" /> Edit</Button>
            )}
          </div>
        </div>
        <Badge variant="outline" className={`w-fit mt-2 ${plan.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : plan.status === 'archived' ? 'bg-muted text-muted-foreground' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
          {plan.status}
        </Badge>
      </CardHeader>
      <CardContent>
        {plan.type === 'single' && plan.session && renderSingleSession()}
        {plan.type === 'weekly' && plan.weeklyPlan && renderWeekly()}
        {plan.type === 'block' && plan.blockPlan && renderBlock()}
        {plan.type === 'season' && plan.seasonPlan && renderSeason()}
      </CardContent>
    </Card>
  );
};

export default PlanDetailView;
