import { useState } from 'react';
import { useShelAcademy } from '@contexts/ShelAcademyContext';
import {
  Target, Calendar, Shield, Star, User, Plus, Edit3, X, Save, Heart, GraduationCap,
  Tag, Layers, BarChart3, MessageSquare, CheckCircle, Clock, AlertTriangle, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Textarea } from '@components/ui/textarea';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Slider } from '@components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import type { IDPFull, IDPGoalFull, ReviewEntry } from '@data/idpData';
import { methodologyTags } from '@pages/demo/shelbourne/shared/MethodologyHub';

interface Props {
  idp: IDPFull;
  onChange: (idp: IDPFull) => void;
}

const getCategoryIcon = (c: string) => {
  switch (c) {
    case 'technical': return '⚽';
    case 'tactical': return '🧠';
    case 'physical': return '💪';
    case 'psychological': return '🎯';
    case 'lifestyle': return '🌙';
    default: return '📋';
  }
};

const getModeColor = (m: string) => m === 'elite'
  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

const defaultGoal = (): IDPGoalFull => ({
  id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  category: 'technical', title: '', description: '', targetDate: '', progress: 0,
  status: 'not-started', actions: [], evidence: [], coachRating: 0, playerRating: 0,
});

const IDPDetailView = ({ idp, onChange }: Props) => {
  const { getLinkedSessions } = useShelAcademy();
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<IDPGoalFull>(defaultGoal());
  const [newComment, setNewComment] = useState('');
  const [newProgressNote, setNewProgressNote] = useState('');
  const [newProgressStatus, setNewProgressStatus] = useState<'on-track' | 'needs-attention' | 'exceeding'>('on-track');
  const [selectedTags, setSelectedTags] = useState<string[]>(idp.methodologyTags ?? []);

  const isElite = idp.mode === 'elite';

  const handleUpdateGoal = (goalId: string, updates: Partial<IDPGoalFull>) => {
    onChange({ ...idp, goals: idp.goals.map(g => g.id === goalId ? { ...g, ...updates } : g) });
  };

  const handleAddGoal = () => {
    if (!newGoal.title) return;
    onChange({ ...idp, goals: [...idp.goals, { ...newGoal, id: `g-${Date.now()}` }] });
    setNewGoal(defaultGoal());
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    onChange({ ...idp, goals: idp.goals.filter(g => g.id !== goalId) });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onChange({
      ...idp,
      coachComments: [{ id: `cc-${Date.now()}`, author: 'Alan Quinn', role: 'coach' as const, date: new Date().toISOString().split('T')[0], content: newComment }, ...idp.coachComments],
    });
    setNewComment('');
  };

  const handleAddProgressNote = () => {
    if (!newProgressNote.trim()) return;
    const review: ReviewEntry = {
      id: `rn-${Date.now()}`, date: new Date().toISOString().split('T')[0], type: 'weekly',
      summary: `[${newProgressStatus.replace('-', ' ').toUpperCase()}] ${newProgressNote}`,
      objectivesEdited: [], archivedGoals: [],
    };
    onChange({ ...idp, reviewHistory: [review, ...(idp.reviewHistory ?? [])] });
    setNewProgressNote('');
  };

  const handleToggleTag = (tagId: string) => {
    const updated = selectedTags.includes(tagId) ? selectedTags.filter(t => t !== tagId) : [...selectedTags, tagId];
    setSelectedTags(updated);
    onChange({ ...idp, methodologyTags: updated });
  };

  const progressStatusIcon = (s: string) => {
    switch (s) {
      case 'on-track': return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'needs-attention': return <AlertTriangle className="h-3 w-3 text-amber-400" />;
      case 'exceeding': return <TrendingUp className="h-3 w-3 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center">
              <span className="text-lg font-medium text-foreground">{idp.playerName.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="font-display text-lg">{idp.playerName}</CardTitle>
                <Badge variant="outline" className={getModeColor(idp.mode)}>{idp.mode === 'elite' ? '★ Elite IDP' : 'Basic IDP'}</Badge>
              </div>
              <CardDescription>{idp.position} • {idp.ageGroup}</CardDescription>
            </div>
          </div>
          <Select value={idp.status} onValueChange={(v: 'active' | 'review-due' | 'completed') => onChange({ ...idp, status: v })}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review-due">Review Due</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Created {idp.createdDate}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Review {idp.nextReviewDate}</span>
          <span className="flex items-center gap-1"><Target className="h-4 w-4" /> {idp.goals.length} objectives</span>
          {idp.positionalProfile && <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> {idp.positionalProfile.primaryPosition}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="objectives" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            {isElite && <TabsTrigger value="holistic">Holistic Evaluation</TabsTrigger>}
            {isElite && <TabsTrigger value="position">Position Profile</TabsTrigger>}
            {isElite && <TabsTrigger value="support">Performance Support</TabsTrigger>}
            {isElite && <TabsTrigger value="offfield">Off-Field</TabsTrigger>}
            <TabsTrigger value="progress">Progress Notes</TabsTrigger>
            <TabsTrigger value="reflections">Reflections</TabsTrigger>
            <TabsTrigger value="comments">Coach Comments</TabsTrigger>
            {isElite && <TabsTrigger value="tags">Methodology Tags</TabsTrigger>}
          </TabsList>

          {/* OBJECTIVES */}
          <TabsContent value="objectives" className="space-y-4">
            <Button size="sm" variant="outline" onClick={() => setShowAddGoal(true)}><Plus className="h-4 w-4 mr-1" /> Add Objective</Button>

            {showAddGoal && (
              <Card className="bg-muted/30 border-red-500/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between"><h4 className="font-medium text-foreground">New Objective</h4><Button variant="ghost" size="icon" onClick={() => setShowAddGoal(false)}><X className="h-4 w-4" /></Button></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Category</Label>
                      <Select value={newGoal.category} onValueChange={(v: IDPGoalFull['category']) => setNewGoal({ ...newGoal, category: v })}>
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
                    <div><Label className="text-xs">Target Date</Label><Input type="date" value={newGoal.targetDate} onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })} className="mt-1" /></div>
                  </div>
                  <div><Label className="text-xs">Title</Label><Input value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} className="mt-1" placeholder="e.g. Improve weak foot passing" /></div>
                  <div><Label className="text-xs">Description</Label><Textarea value={newGoal.description} onChange={e => setNewGoal({ ...newGoal, description: e.target.value })} className="mt-1" placeholder="Specific, measurable, linked to match behaviours..." rows={2} /></div>
                  <div><Label className="text-xs">KPI / Measurement</Label><Input value={newGoal.actions[0] ?? ''} onChange={e => setNewGoal({ ...newGoal, actions: [e.target.value] })} className="mt-1" placeholder="e.g. Pass completion increases from 55% to 70%" /></div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddGoal(false)}>Cancel</Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleAddGoal} disabled={!newGoal.title}><Save className="h-4 w-4 mr-1" /> Add</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {idp.goals.map(goal => (
              <div key={goal.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <h4 className="font-medium text-foreground">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{goal.category} {goal.targetDate && `• Due ${goal.targetDate}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={goal.status} onValueChange={(v: IDPGoalFull['status']) => handleUpdateGoal(goal.id, { status: v })}>
                      <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-track">On Track</SelectItem>
                        <SelectItem value="at-risk">At Risk</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteGoal(goal.id)}><X className="h-3 w-3" /></Button>
                  </div>
                </div>

                {editingGoal === goal.id ? (
                  <div className="space-y-3 mb-3">
                    <div><Label className="text-xs">Title</Label><Input value={goal.title} onChange={e => handleUpdateGoal(goal.id, { title: e.target.value })} className="mt-1" /></div>
                    <div><Label className="text-xs">Description</Label><Textarea value={goal.description} onChange={e => handleUpdateGoal(goal.id, { description: e.target.value })} className="mt-1" rows={2} /></div>
                    <div><Label className="text-xs">Target Date</Label><Input type="date" value={goal.targetDate} onChange={e => handleUpdateGoal(goal.id, { targetDate: e.target.value })} className="mt-1" /></div>
                    <Button size="sm" variant="outline" onClick={() => setEditingGoal(null)}>Done Editing</Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground mb-2" onClick={() => setEditingGoal(goal.id)}><Edit3 className="h-3 w-3 mr-1" /> Edit</Button>
                  </>
                )}

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <div className="flex items-center gap-2">
                      <Input type="number" min={0} max={100} value={goal.progress}
                        onChange={e => handleUpdateGoal(goal.id, { progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-16 h-6 text-xs text-right" />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Coach</span>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s}
                          className={`h-3 w-3 cursor-pointer transition-colors ${s <= (goal.coachRating ?? 0) ? 'text-red-500 fill-red-500' : 'text-muted-foreground hover:text-red-400'}`}
                          onClick={() => handleUpdateGoal(goal.id, { coachRating: s })} />
                      ))}
                    </div>
                  </div>
                </div>

                {goal.evidence.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Evidence</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">{goal.evidence.map((e, i) => <li key={i}>✓ {e}</li>)}</ul>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          {/* HOLISTIC EVALUATION */}
          {isElite && (
            <TabsContent value="holistic" className="space-y-4">
              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2"><CardTitle className="font-display text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-red-500" /> Holistic Assessment</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {(['technical', 'tactical', 'physical', 'psychological', 'lifestyle'] as const).map(pillar => {
                    const val = idp.holisticEvaluation?.[pillar] ?? 5;
                    return (
                      <div key={pillar} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground capitalize flex items-center gap-2">{getCategoryIcon(pillar)} {pillar}</span>
                          <span className="text-sm font-bold text-foreground">{val}/10</span>
                        </div>
                        <Slider value={[val]} onValueChange={v => onChange({ ...idp, holisticEvaluation: { ...(idp.holisticEvaluation ?? { technical: 5, tactical: 5, physical: 5, psychological: 5, lifestyle: 5, notes: '', date: '' }), [pillar]: v[0] } })} min={1} max={10} step={1} className="py-1" />
                      </div>
                    );
                  })}
                  <div>
                    <Label className="text-xs">Assessment Notes</Label>
                    <Textarea value={idp.holisticEvaluation?.notes ?? ''} onChange={e => onChange({ ...idp, holisticEvaluation: { ...(idp.holisticEvaluation ?? { technical: 5, tactical: 5, physical: 5, psychological: 5, lifestyle: 5, notes: '', date: '' }), notes: e.target.value } })} className="mt-1" rows={3} placeholder="Overall assessment summary..." />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* POSITION PROFILE */}
          {isElite && (
            <TabsContent value="position" className="space-y-4">
              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2"><CardTitle className="font-display text-base flex items-center gap-2"><Shield className="h-4 w-4 text-red-500" /> Positional Customisation</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-xs">Primary Position</Label><Input value={idp.positionalProfile?.primaryPosition ?? ''} onChange={e => onChange({ ...idp, positionalProfile: { ...(idp.positionalProfile ?? { primaryPosition: '', secondaryPosition: '', demands: [] }), primaryPosition: e.target.value } })} className="mt-1" /></div>
                    <div><Label className="text-xs">Secondary Position</Label><Input value={idp.positionalProfile?.secondaryPosition ?? ''} onChange={e => onChange({ ...idp, positionalProfile: { ...(idp.positionalProfile ?? { primaryPosition: '', secondaryPosition: '', demands: [] }), secondaryPosition: e.target.value } })} className="mt-1" /></div>
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">Position-Specific Development Demands</Label>
                    {(idp.positionalProfile?.demands ?? []).map((d, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-red-500 w-5">{i + 1}.</span>
                        <Input value={d} onChange={e => { const demands = [...(idp.positionalProfile?.demands ?? [])]; demands[i] = e.target.value; onChange({ ...idp, positionalProfile: { ...(idp.positionalProfile ?? { primaryPosition: '', secondaryPosition: '', demands: [] }), demands } }); }} className="flex-1" />
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => onChange({ ...idp, positionalProfile: { ...(idp.positionalProfile ?? { primaryPosition: '', secondaryPosition: '', demands: [] }), demands: [...(idp.positionalProfile?.demands ?? []), ''] } })}><Plus className="h-3 w-3 mr-1" /> Add</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* PERFORMANCE SUPPORT */}
          {isElite && (
            <TabsContent value="support" className="space-y-4">
              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2"><CardTitle className="font-display text-base flex items-center gap-2"><Heart className="h-4 w-4 text-red-500" /> Integrated Performance Support</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {([
                    { key: 'physicalFocus' as const, label: 'Physical Conditioning Focus', icon: '💪' },
                    { key: 'nutritionHabits' as const, label: 'Nutrition Guidance Notes', icon: '🍎' },
                    { key: 'recoveryHabits' as const, label: 'Recovery Habits', icon: '😴' },
                    { key: 'psychologicalStrengthening' as const, label: 'Mental & Psychological Strategies', icon: '🧠' },
                  ]).map(({ key, label, icon }) => (
                    <div key={key}>
                      <Label className="text-xs flex items-center gap-1">{icon} {label}</Label>
                      <Textarea value={idp.performanceSupport?.[key] ?? ''} onChange={e => onChange({ ...idp, performanceSupport: { ...(idp.performanceSupport ?? { physicalFocus: '', nutritionHabits: '', recoveryHabits: '', psychologicalStrengthening: '' }), [key]: e.target.value } })} className="mt-1" rows={2} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* OFF-FIELD */}
          {isElite && (
            <TabsContent value="offfield" className="space-y-4">
              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2"><CardTitle className="font-display text-base flex items-center gap-2"><GraduationCap className="h-4 w-4 text-red-500" /> Off-Field Development</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {([
                    { key: 'leadership' as const, label: 'Leadership', icon: '👑' },
                    { key: 'communication' as const, label: 'Communication', icon: '💬' },
                    { key: 'education' as const, label: 'Education', icon: '📚' },
                    { key: 'lifeSkills' as const, label: 'Life Skills & Character', icon: '🌍' },
                  ]).map(({ key, label, icon }) => (
                    <div key={key}>
                      <Label className="text-xs flex items-center gap-1">{icon} {label}</Label>
                      <Textarea value={idp.offFieldDevelopment?.[key] ?? ''} onChange={e => onChange({ ...idp, offFieldDevelopment: { ...(idp.offFieldDevelopment ?? { leadership: '', communication: '', education: '', lifeSkills: '' }), [key]: e.target.value } })} className="mt-1" rows={2} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* PROGRESS NOTES */}
          <TabsContent value="progress" className="space-y-4">
            <Card className="bg-red-500/5 border border-red-500/20">
              <CardContent className="p-4 space-y-3">
                <h4 className="text-sm font-medium text-foreground">Log Progress Update</h4>
                <div>
                  <Label className="text-xs">Status Indicator</Label>
                  <Select value={newProgressStatus} onValueChange={(v: typeof newProgressStatus) => setNewProgressStatus(v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-track">✅ On Track</SelectItem>
                      <SelectItem value="needs-attention">⚠️ Needs Attention</SelectItem>
                      <SelectItem value="exceeding">🚀 Exceeding Target</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea value={newProgressNote} onChange={e => setNewProgressNote(e.target.value)} placeholder="Add a progress note with observations, updates, or adjustments..." rows={3} />
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleAddProgressNote} disabled={!newProgressNote.trim()}><Save className="h-4 w-4 mr-1" /> Log Update</Button>
              </CardContent>
            </Card>

            {(idp.reviewHistory ?? []).map(r => (
              <div key={r.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {r.summary.includes('[ON TRACK]') ? progressStatusIcon('on-track') : r.summary.includes('[NEEDS ATTENTION]') ? progressStatusIcon('needs-attention') : r.summary.includes('[EXCEEDING') ? progressStatusIcon('exceeding') : <Clock className="h-3 w-3 text-muted-foreground" />}
                    <Badge variant="outline" className={r.type === 'monthly' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>{r.type}</Badge>
                    <span className="text-sm text-muted-foreground">{r.date}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.summary}</p>
              </div>
            ))}
            {(!idp.reviewHistory || idp.reviewHistory.length === 0) && <p className="text-sm text-muted-foreground text-center py-6">No progress notes yet. Use the form above to log your first update.</p>}
          </TabsContent>

          {/* REFLECTIONS */}
          <TabsContent value="reflections" className="space-y-4">
            {idp.playerReflections.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No player reflections submitted yet.</p>}
            {idp.playerReflections.map(r => (
              <div key={r.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Week {r.weekNumber}</span>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div><p className="text-xs font-medium text-green-400 mb-1">What went well</p><p className="text-muted-foreground">{r.whatWentWell}</p></div>
                  <div><p className="text-xs font-medium text-amber-400 mb-1">To improve</p><p className="text-muted-foreground">{r.whatToImprove}</p></div>
                  <div><p className="text-xs font-medium text-red-500 mb-1">Focus for next week</p><p className="text-muted-foreground">{r.focusForNextWeek}</p></div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* COACH COMMENTS */}
          <TabsContent value="comments" className="space-y-4">
            <Card className="bg-red-500/5 border border-red-500/20">
              <CardContent className="p-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Add Comment</h4>
                <Textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment about this player's development..." rows={3} />
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleAddComment} disabled={!newComment.trim()}><MessageSquare className="h-4 w-4 mr-1" /> Add Comment</Button>
              </CardContent>
            </Card>
            {idp.coachComments.map(c => (
              <div key={c.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center"><span className="text-xs font-medium text-red-500">{c.author.split(' ').map(n => n[0]).join('')}</span></div>
                  <div><p className="text-sm font-medium text-foreground">{c.author}</p><p className="text-xs text-muted-foreground capitalize">{c.role.replace('-', ' ')} • {c.date}</p></div>
                </div>
                <p className="text-sm text-muted-foreground">{c.content}</p>
              </div>
            ))}
          </TabsContent>

          {/* METHODOLOGY TAGS */}
          {isElite && (
            <TabsContent value="tags" className="space-y-4">
              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base flex items-center gap-2"><Tag className="h-4 w-4 text-red-500" /> Methodology Alignment Tags</CardTitle>
                  <CardDescription>Tag this IDP to methodology principles for cross-module linking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(['Game Model Principles', 'Development Pillars', 'Academy Values'] as const).map((group, gi) => {
                      const tags = gi === 0 ? methodologyTags.principles : gi === 1 ? methodologyTags.developmentPillars : methodologyTags.values;
                      return (
                        <div key={group}>
                          <p className="text-xs font-medium text-muted-foreground mb-2">{group}</p>
                          <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                              <Badge key={tag.id} variant="outline"
                                className={`cursor-pointer transition-all ${selectedTags.includes(tag.id) ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'hover:bg-muted'}`}
                                onClick={() => handleToggleTag(tag.id)}>
                                {selectedTags.includes(tag.id) && <CheckCircle className="h-3 w-3 mr-1" />}{tag.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Layers className="h-3 w-3" /> Sessions Linked to This IDP</p>
                {idp.goals.flatMap(g => getLinkedSessions(g.id).map(s => (
                  <div key={`${g.id}-${s.id}`} className="flex items-center justify-between p-2 rounded bg-muted/30 text-xs">
                    <span className="text-foreground font-medium">{s.title}</span>
                    <Badge variant="outline" className="text-xs">{g.title}</Badge>
                  </div>
                )))}
                {idp.goals.flatMap(g => getLinkedSessions(g.id)).length === 0 && <p className="text-xs text-muted-foreground">No sessions linked yet. Link sessions from Session Planning.</p>}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IDPDetailView;
