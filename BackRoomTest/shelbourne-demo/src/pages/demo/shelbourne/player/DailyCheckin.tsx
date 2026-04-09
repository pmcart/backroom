import { useState } from 'react';
import { Moon, Droplets, Heart, Activity, Send, CheckCircle, Utensils, Clock, GlassWater, Sun } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Slider } from '@components/ui/slider';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { useShelAcademy } from '@contexts/ShelAcademyContext';
import type { WellnessCheckin } from '@contexts/ShelAcademyContext';

type FeedbackLevel = 'green' | 'amber' | 'red';
interface FeedbackItem { label: string; level: FeedbackLevel; message: string; }

const getLevel = (value: number, thresholds: [number, number]): FeedbackLevel => value >= thresholds[1] ? 'green' : value >= thresholds[0] ? 'amber' : 'red';
const getLevelColor = (l: FeedbackLevel) => l === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/20' : l === 'amber' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20';

type CheckinStep = 'wellness' | 'nutrition' | 'sleep' | 'review';

const ShelDailyCheckin = () => {
  const { addCheckin } = useShelAcademy();
  const [step, setStep] = useState<CheckinStep>('wellness');
  const [submitted, setSubmitted] = useState(false);

  const [wellness, setWellness] = useState({ sleep: 4, nutrition: 4, hydration: 4, recovery: 4, mood: 4 });
  const [meals, setMeals] = useState({ breakfast: 'yes', lunch: 'yes', dinner: 'yes', snacks: 'healthy' });
  const [waterLitres, setWaterLitres] = useState('2.0');
  const [sleepDetail, setSleepDetail] = useState({ hours: '8', bedtime: '22:30', wakeTime: '06:30' });
  const [notes, setNotes] = useState('');

  const wellnessMetrics = [
    { key: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'text-blue-400', description: 'How well did you sleep last night?' },
    { key: 'nutrition', label: 'Nutrition', icon: Activity, color: 'text-green-400', description: 'How well did you eat yesterday?' },
    { key: 'hydration', label: 'Hydration', icon: Droplets, color: 'text-cyan-400', description: 'How hydrated do you feel?' },
    { key: 'recovery', label: 'Recovery', icon: Heart, color: 'text-pink-400', description: 'How recovered does your body feel?' },
    { key: 'mood', label: 'Mood', icon: Heart, color: 'text-amber-400', description: 'How are you feeling mentally today?' },
  ];

  const generateFeedback = (): FeedbackItem[] => {
    const items: FeedbackItem[] = [];
    const sleepH = parseFloat(sleepDetail.hours) || 0;
    const water = parseFloat(waterLitres) || 0;
    const mealsEaten = [meals.breakfast, meals.lunch, meals.dinner].filter(m => m === 'yes').length;

    const sleepLevel = getLevel(sleepH, [7, 8]);
    items.push({ label: 'Sleep', level: sleepLevel, message: sleepLevel === 'green' ? `${sleepH}h — great rest. Keep this routine going.` : sleepLevel === 'amber' ? `${sleepH}h — could do with a little more. Aim for 8+ hours on training nights.` : `${sleepH}h — this is below what you need to recover well. Chat with your coach if something is affecting your sleep.` });

    const hydLevel = getLevel(water, [1.5, 2]);
    items.push({ label: 'Water Intake', level: hydLevel, message: hydLevel === 'green' ? `${water}L — good hydration. Keep sipping throughout the day.` : hydLevel === 'amber' ? `${water}L — try to get closer to 2L+ on training days.` : `${water}L — this is low. Small sips throughout the day can help.` });

    const mealLevel: FeedbackLevel = mealsEaten >= 3 ? 'green' : mealsEaten >= 2 ? 'amber' : 'red';
    items.push({ label: 'Meals', level: mealLevel, message: mealLevel === 'green' ? `${mealsEaten}/3 meals — great consistency. Fuelling your body well.` : mealLevel === 'amber' ? `${mealsEaten}/3 meals — try not to skip meals, especially before training.` : `${mealsEaten}/3 meals — eating regularly helps energy, concentration, and recovery.` });

    const snackLevel: FeedbackLevel = meals.snacks === 'healthy' ? 'green' : meals.snacks === 'mixed' ? 'amber' : 'red';
    items.push({ label: 'Snacks', level: snackLevel, message: snackLevel === 'green' ? 'Healthy snacking — good choices for energy and recovery.' : snackLevel === 'amber' ? 'Mixed snacks — try to include more fruit, nuts, or yoghurt.' : 'Mostly processed snacks — these can affect energy levels. Small swaps make a big difference.' });

    const recLevel = getLevel(wellness.recovery, [3, 4]);
    items.push({ label: 'Recovery', level: recLevel, message: recLevel === 'green' ? 'Feeling well recovered — you should be ready to train.' : recLevel === 'amber' ? 'Moderate recovery — take extra care in warm-up today.' : 'Low recovery — let your coach know so training load can be adjusted.' });

    const moodLevel = getLevel(wellness.mood, [3, 4]);
    items.push({ label: 'Mood', level: moodLevel, message: moodLevel === 'green' ? 'Positive mood — great headspace for training.' : moodLevel === 'amber' ? "Okay mood — remember it's normal to have quieter days." : "Low mood — it's okay to not feel 100%. Talk to someone you trust if you need support." });

    return items;
  };

  const handleSubmit = () => {
    const feedback = generateFeedback();
    const greenCount = feedback.filter(f => f.level === 'green').length;
    const overallLevel: FeedbackLevel = greenCount >= 5 ? 'green' : greenCount >= 3 ? 'amber' : 'red';

    // Save to shared context
    const checkin: WellnessCheckin = {
      id: `wc-${Date.now()}`,
      playerId: 'sb13', // Aaron Connolly
      playerName: 'Aaron Connolly',
      ageGroup: 'U17 Boys',
      date: new Date().toISOString().split('T')[0],
      wellness,
      meals,
      waterLitres,
      sleepDetail,
      notes,
      overallLevel,
    };
    addCheckin(checkin);
    setSubmitted(true);
  };

  if (submitted) {
    const feedback = generateFeedback();
    const overallScore = feedback.filter(f => f.level === 'green').length;
    const overallLevel: FeedbackLevel = overallScore >= 5 ? 'green' : overallScore >= 3 ? 'amber' : 'red';

    return (
      <ShelDemoLayout role="player" userName="Aaron Connolly">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-foreground mb-1">Check-in Complete!</h2>
              <p className="text-muted-foreground mb-3">Your data has been recorded and is now visible to your coach. Here's a summary to help guide your day.</p>
              <Badge className="bg-red-600 text-white">5 Day Streak 🔥</Badge>
            </CardContent>
          </Card>

          <Card className="bg-card border-border mb-4">
            <CardHeader><CardTitle className="font-display text-lg">Your Guidance Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground mb-4">These indicators are based on the information you provided. They're here to support conversations with your coach — not to evaluate your performance.</p>
              {feedback.map(f => (
                <div key={f.label} className={`p-3 rounded-lg border ${getLevelColor(f.level)}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{f.label}</span>
                    <Badge variant="outline" className={getLevelColor(f.level)}>{f.level === 'green' ? '✓ Good' : f.level === 'amber' ? '~ Okay' : '! Low'}</Badge>
                  </div>
                  <p className="text-sm opacity-90">{f.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={`border ${overallLevel === 'green' ? 'bg-green-500/5 border-green-500/20' : overallLevel === 'amber' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{overallLevel === 'green' ? 'Overall, you\'re in a good place today. Keep up the great work.' : overallLevel === 'amber' ? 'A few areas to keep an eye on. Small improvements in sleep or nutrition can make a big difference over time.' : 'A few things to be aware of today. Consider chatting with your coach or welfare officer if anything is on your mind.'}</p>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground text-center mt-4">Demo prototype — guidance is illustrative only.</p>
        </div>
      </ShelDemoLayout>
    );
  }

  const steps: CheckinStep[] = ['wellness', 'nutrition', 'sleep', 'review'];

  return (
    <ShelDemoLayout role="player" userName="Aaron Connolly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Daily Check-in</h1>
        <p className="text-muted-foreground mt-1">How are you feeling today?</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? 'bg-red-600 text-white' : i < steps.indexOf(step) ? 'bg-green-500/30 text-green-400' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
            {i < 3 && <div className="w-8 h-0.5 bg-border" />}
          </div>
        ))}
      </div>

      <Card className="max-w-2xl mx-auto bg-card border-border">
        <CardContent className="p-6 space-y-6">
          {step === 'wellness' && (
            <>
              <h3 className="font-display text-lg font-semibold text-foreground">Wellness & Readiness</h3>
              {wellnessMetrics.map(m => (
                <div key={m.key} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <m.icon className={`h-5 w-5 ${m.color}`} />
                    <span className="font-medium text-foreground">{m.label}</span>
                    <span className="ml-auto text-lg font-bold text-foreground">{wellness[m.key as keyof typeof wellness]}/5</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                  <Slider value={[wellness[m.key as keyof typeof wellness]]} onValueChange={v => setWellness({ ...wellness, [m.key]: v[0] })} min={1} max={5} step={1} className="py-2" />
                </div>
              ))}
              <Button onClick={() => setStep('nutrition')} className="w-full bg-red-600 hover:bg-red-700 text-white">Next — Nutrition</Button>
            </>
          )}

          {step === 'nutrition' && (
            <>
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2"><Utensils className="h-5 w-5 text-green-400" /> Nutrition</h3>
              <p className="text-sm text-muted-foreground">Tell us about your meals yesterday. This helps your coach understand your fuelling.</p>
              {[{ key: 'breakfast', label: 'Breakfast', icon: Sun }, { key: 'lunch', label: 'Lunch', icon: Clock }, { key: 'dinner', label: 'Dinner', icon: Utensils }].map(meal => (
                <div key={meal.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <meal.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{meal.label}</span>
                  </div>
                  <Select value={meals[meal.key as keyof typeof meals]} onValueChange={v => setMeals({ ...meals, [meal.key]: v })}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, ate</SelectItem>
                      <SelectItem value="no">Skipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Snacks</span>
                </div>
                <Select value={meals.snacks} onValueChange={v => setMeals({ ...meals, snacks: v })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="processed">Mostly processed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-2"><GlassWater className="h-4 w-4 text-cyan-400" /> Water Intake (litres)</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider value={[parseFloat(waterLitres) || 0]} onValueChange={v => setWaterLitres(v[0].toFixed(1))} min={0} max={4} step={0.5} className="flex-1" />
                  <span className="text-lg font-bold text-foreground w-12 text-right">{waterLitres}L</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('wellness')} className="flex-1">Back</Button>
                <Button onClick={() => setStep('sleep')} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Next — Sleep</Button>
              </div>
            </>
          )}

          {step === 'sleep' && (
            <>
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2"><Moon className="h-5 w-5 text-blue-400" /> Sleep Detail</h3>
              <p className="text-sm text-muted-foreground">Help us understand your sleep patterns. This information supports recovery planning.</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Hours Slept</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider value={[parseFloat(sleepDetail.hours) || 0]} onValueChange={v => setSleepDetail({ ...sleepDetail, hours: v[0].toFixed(1) })} min={3} max={12} step={0.5} className="flex-1" />
                    <span className="text-lg font-bold text-foreground w-10 text-right">{sleepDetail.hours}h</span>
                  </div>
                </div>
                <div>
                  <Label>Bedtime</Label>
                  <Input type="time" value={sleepDetail.bedtime} onChange={e => setSleepDetail({ ...sleepDetail, bedtime: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Wake Time</Label>
                  <Input type="time" value={sleepDetail.wakeTime} onChange={e => setSleepDetail({ ...sleepDetail, wakeTime: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Any notes for your coach?</Label>
                <Textarea placeholder="Optional: Share how you're feeling, anything on your mind..." className="mt-2" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('nutrition')} className="flex-1">Back</Button>
                <Button onClick={() => setStep('review')} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Review & Submit</Button>
              </div>
            </>
          )}

          {step === 'review' && (
            <>
              <h3 className="font-display text-lg font-semibold text-foreground">Review Your Check-in</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <h4 className="text-sm font-medium text-foreground mb-2">Wellness</h4>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {wellnessMetrics.map(m => (
                      <div key={m.key}>
                        <p className={`text-lg font-bold ${wellness[m.key as keyof typeof wellness] >= 4 ? 'text-green-400' : wellness[m.key as keyof typeof wellness] >= 3 ? 'text-amber-400' : 'text-red-400'}`}>{wellness[m.key as keyof typeof wellness]}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <h4 className="text-sm font-medium text-foreground mb-2">Nutrition & Hydration</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Breakfast</span> <span className="text-foreground">{meals.breakfast === 'yes' ? '✓' : '✗'}</span></div>
                    <div><span className="text-muted-foreground">Lunch</span> <span className="text-foreground">{meals.lunch === 'yes' ? '✓' : '✗'}</span></div>
                    <div><span className="text-muted-foreground">Dinner</span> <span className="text-foreground">{meals.dinner === 'yes' ? '✓' : '✗'}</span></div>
                    <div><span className="text-muted-foreground">Snacks</span> <span className="text-foreground capitalize">{meals.snacks}</span></div>
                    <div><span className="text-muted-foreground">Water</span> <span className="text-foreground">{waterLitres}L</span></div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <h4 className="text-sm font-medium text-foreground mb-2">Sleep</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Hours</span> <span className="text-foreground">{sleepDetail.hours}h</span></div>
                    <div><span className="text-muted-foreground">Bed</span> <span className="text-foreground">{sleepDetail.bedtime}</span></div>
                    <div><span className="text-muted-foreground">Wake</span> <span className="text-foreground">{sleepDetail.wakeTime}</span></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('sleep')} className="flex-1">Back</Button>
                <Button onClick={handleSubmit} className="flex-1 bg-red-600 hover:bg-red-700 text-white"><Send className="h-4 w-4 mr-2" /> Submit Check-in</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center mt-4">Demo prototype — no data is persisted. Guidance is illustrative only.</p>
    </ShelDemoLayout>
  );
};
export default ShelDailyCheckin;
