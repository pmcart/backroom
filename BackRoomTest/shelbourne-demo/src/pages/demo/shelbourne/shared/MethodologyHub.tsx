import { useState } from 'react';
import { BookOpen, Target, Shield, Zap, RotateCcw, Flag, Users, Layers, Tag, CheckCircle } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Badge } from '@components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';

interface MethodologyHubProps {
  role: 'admin' | 'coach' | 'player';
  userName: string;
}

// ── Alignment Tag System ─────────────────────────────────
export const methodologyTags = {
  principles: [
    { id: 'mp-1', label: 'Play Out From the Back', category: 'In Possession', pillar: 'game-model' },
    { id: 'mp-2', label: 'Positional Superiority', category: 'In Possession', pillar: 'game-model' },
    { id: 'mp-3', label: 'Third-Man Runs', category: 'In Possession', pillar: 'game-model' },
    { id: 'mp-4', label: 'Width & Depth in Attack', category: 'In Possession', pillar: 'game-model' },
    { id: 'mp-5', label: 'Patient Build-Up', category: 'In Possession', pillar: 'game-model' },
    { id: 'mp-6', label: 'Press from the Front', category: 'Out of Possession', pillar: 'game-model' },
    { id: 'mp-7', label: 'Compact Defensive Shape', category: 'Out of Possession', pillar: 'game-model' },
    { id: 'mp-8', label: 'Cut Passing Lanes', category: 'Out of Possession', pillar: 'game-model' },
    { id: 'mp-9', label: 'Immediate Counter-Press', category: 'Transition (Attack → Defence)', pillar: 'game-model' },
    { id: 'mp-10', label: 'Recover Behind the Ball', category: 'Transition (Attack → Defence)', pillar: 'game-model' },
    { id: 'mp-11', label: 'Vertical Speed on Turnover', category: 'Transition (Defence → Attack)', pillar: 'game-model' },
    { id: 'mp-12', label: 'Switch Play Early', category: 'Transition (Defence → Attack)', pillar: 'game-model' },
    { id: 'mp-13', label: 'Set Piece Organisation', category: 'Set Pieces', pillar: 'game-model' },
    { id: 'mp-14', label: 'Dead Ball Delivery', category: 'Set Pieces', pillar: 'game-model' },
  ],
  developmentPillars: [
    { id: 'dp-tech', label: 'Technical', pillar: 'development' },
    { id: 'dp-tact', label: 'Tactical', pillar: 'development' },
    { id: 'dp-phys', label: 'Physical', pillar: 'development' },
    { id: 'dp-psych', label: 'Psychological', pillar: 'development' },
    { id: 'dp-life', label: 'Lifestyle & Education', pillar: 'development' },
  ],
  values: [
    { id: 'val-1', label: 'Courage on the Ball', pillar: 'identity' },
    { id: 'val-2', label: 'Work Rate & Intensity', pillar: 'identity' },
    { id: 'val-3', label: 'Respect & Discipline', pillar: 'identity' },
    { id: 'val-4', label: 'Team-First Mentality', pillar: 'identity' },
    { id: 'val-5', label: 'Continuous Improvement', pillar: 'identity' },
  ],
};

// ── Game Model Data ──────────────────────────────────────
const gameModelPhases = [
  {
    id: 'in-possession',
    title: 'In Possession',
    icon: Target,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    principles: [
      { title: 'Play Out From the Back', behaviour: 'GK and CBs build with short passes. Full-backs provide width. Midfielder drops to create a diamond.', language: 'Find the free man, Play through, not over, Show for the ball', ageNotes: { 'U14': 'Focus on comfort on the ball. Allow mistakes. Encourage bravery.', 'U15': 'Introduce positional rotations. Add pressure gradually.', 'U17': 'Expect consistent execution. Introduce opponent-specific adjustments.', 'U19': 'Full tactical flexibility. Players should recognise when to play short or go direct.' } },
      { title: 'Positional Superiority', behaviour: 'Create numerical advantages in key zones through movement and positioning. Overloads on the ball-side.', language: 'Create the extra man, Move to receive, Open passing lanes', ageNotes: { 'U14': 'Teach basic triangle shapes and support angles.', 'U15': 'Introduce zone-specific overloads. Half-space occupation.', 'U17': 'Full understanding of positional play. Autonomy expected.', 'U19': 'Game-manage possession. Adjust tempo based on game state.' } },
      { title: 'Width & Depth in Attack', behaviour: 'Wingers and full-backs stretch the pitch. Striker provides depth. Midfielders fill the half-spaces.', language: 'Stretch them, Get wide, Pin the defender', ageNotes: { 'U14': 'Focus on using the full pitch. Simple width concepts.', 'U15': 'Introduce half-space positioning. Timing of runs.', 'U17': 'Coordinated attacking movement. Combined play.', 'U19': 'Full-pitch awareness. Recognise and exploit space.' } },
    ],
  },
  {
    id: 'out-of-possession',
    title: 'Out of Possession',
    icon: Shield,
    color: 'text-red-500',
    bg: 'bg-red-500/10 border-red-500/20',
    principles: [
      { title: 'Press from the Front', behaviour: 'Striker initiates the press on the ball-side CB. Wingers curve their runs to block wide options. Midfield supports from behind.', language: 'Go!, Show them inside, Squeeze up', ageNotes: { 'U14': 'Introduce pressing triggers. Focus on effort and intent.', 'U15': 'Coordinate pressing as a unit. Cover shadows.', 'U17': 'Opponent-specific pressing traps. Read the play.', 'U19': 'Game-state awareness. Press high or mid-block based on context.' } },
      { title: 'Compact Defensive Shape', behaviour: 'Defensive block stays within 35 metres vertically. Shift as a unit. No gaps between lines.', language: 'Stay connected, Slide together, Close the gap', ageNotes: { 'U14': 'Basic defensive shape. Teach distances.', 'U15': 'Introduce shifting as a back four. Communication.', 'U17': 'Disciplined shape under pressure. Recovery positioning.', 'U19': 'Full defensive organisation. Manage tempo of opponent.' } },
      { title: 'Cut Passing Lanes', behaviour: 'Defenders and midfielders position body to block forward passes. Force opponent backwards or sideways.', language: 'Show them back, Block the line, Deny the switch', ageNotes: { 'U14': 'Body shape awareness. Angle of approach.', 'U15': 'Anticipation and interception practice.', 'U17': 'Read the game. Intercept with purpose.', 'U19': "Proactive defending. Win the ball, don't just block." } },
    ],
  },
  {
    id: 'transition-atk-def',
    title: 'Transition (Attack → Defence)',
    icon: RotateCcw,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
    principles: [
      { title: 'Immediate Counter-Press', behaviour: 'On loss of possession, nearest three players press immediately within 5 seconds. Others recover shape.', language: 'React!, Win it back now, 5-second rule', ageNotes: { 'U14': 'Introduce the concept. Reward effort and reaction.', 'U15': 'Expect a coordinated press from nearby players.', 'U17': 'Full-team counter-press. Organised and aggressive.', 'U19': 'Intelligent counter-press. Know when to press and when to drop.' } },
      { title: 'Recover Behind the Ball', behaviour: 'Players ahead of the ball sprint to recover behind it. Re-establish defensive shape within 6 seconds.', language: 'Get back!, Shape up, Behind the ball', ageNotes: { 'U14': 'Emphasis on desire and willingness to recover.', 'U15': 'Recovery runs with purpose. Get goal-side.', 'U17': 'Recovery speed and intelligence. Communication.', 'U19': 'Manage energy. Recover smartly and efficiently.' } },
    ],
  },
  {
    id: 'transition-def-atk',
    title: 'Transition (Defence → Attack)',
    icon: Zap,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    principles: [
      { title: 'Vertical Speed on Turnover', behaviour: 'First pass after winning the ball should be forward. Wide players and strikers anticipate the turnover.', language: 'Go forward!, Attack the space, Be alive', ageNotes: { 'U14': 'Encourage forward play. Celebrate positive transitions.', 'U15': 'Timing of forward runs. Anticipation.', 'U17': 'Quick combination play on turnovers.', 'U19': 'Game-state dependent. Fast break or controlled transition.' } },
      { title: 'Switch Play Early', behaviour: "After winning possession, look to switch to the weak side where space is available.", language: "Switch it!, Find the space, Change the angle", ageNotes: { 'U14': 'Scanning and awareness. Look before you receive.', 'U15': 'Weight and accuracy of longer passes.', 'U17': "Decision-making speed. Execute under pressure.", 'U19': "Full tactical awareness. Exploit opponent's shape." } },
    ],
  },
  {
    id: 'set-pieces',
    title: 'Set Pieces',
    icon: Flag,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20',
    principles: [
      { title: 'Set Piece Organisation', behaviour: 'Structured routines for corners, free kicks, and throw-ins. Assigned roles and runs. Rehearsed weekly.', language: 'Know your job, Trust the routine, Execute', ageNotes: { 'U14': 'Simple set-piece routines. 2-3 variations.', 'U15': 'Add complexity. Decoy runs and timing.', 'U17': 'Full set-piece playbook. Opponent analysis.', 'U19': 'Game-specific set pieces. In-game adjustments.' } },
      { title: 'Dead Ball Delivery', behaviour: 'Consistent delivery to target areas. Near post, far post, and short options. Quality over quantity.', language: 'Pick your spot, Match the run, Deliver it', ageNotes: { 'U14': 'Technique focus. Repetition and consistency.', 'U15': 'Introduce variety. In-swinger vs out-swinger.', 'U17': 'Match-quality delivery under pressure.', 'U19': 'Specialist deliverers. Tactical awareness.' } },
    ],
  },
];

// ── Development Framework ────────────────────────────────
const developmentFramework = [
  {
    ageGroup: 'U14',
    title: 'U14 — Technical Foundation & Tactical Awareness',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    focus: [
      { pillar: 'Technical', description: 'Master core techniques — receiving, passing, turning, finishing. Comfort on the ball under pressure. Encourage both feet.' },
      { pillar: 'Tactical', description: 'Introduce basic principles of play. Understand positions and roles. Begin to recognise game situations.' },
      { pillar: 'Physical', description: 'Develop agility, coordination, and movement literacy. No specialised conditioning. Fun and varied physical challenges.' },
      { pillar: 'Psychological', description: 'Build confidence and enjoyment. Encourage risk-taking and creativity. Develop resilience through positive reinforcement.' },
      { pillar: 'Lifestyle & Education', description: 'Introduce the importance of nutrition, sleep, and school balance. Build good habits early.' },
    ],
  },
  {
    ageGroup: 'U15',
    title: 'U15 — Positional Development',
    color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    focus: [
      { pillar: 'Technical', description: 'Refine under pressure. Position-specific technique — crossing for wingers, distribution for GKs, heading for CBs.' },
      { pillar: 'Tactical', description: "Develop understanding of the club's game model. Positional play. Unit work (defensive line, midfield triangle)." },
      { pillar: 'Physical', description: 'Introduce structured physical development. Speed, change of direction, and basic strength foundations.' },
      { pillar: 'Psychological', description: 'Develop decision-making under pressure. Introduce goal-setting through IDPs. Manage expectations.' },
      { pillar: 'Lifestyle & Education', description: 'Reinforce time management. Support academic balance. Introduce the daily check-in concept.' },
    ],
  },
  {
    ageGroup: 'U17',
    title: 'U17 — Tactical Refinement',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    focus: [
      { pillar: 'Technical', description: 'Consistency under match pressure. Position-specific mastery. Execute at speed and intensity.' },
      { pillar: 'Tactical', description: 'Full game model understanding. Read the game. Opponent analysis. In-game problem solving and adaptability.' },
      { pillar: 'Physical', description: 'Individualised physical programmes. Strength, endurance, and recovery protocols. Load management awareness.' },
      { pillar: 'Psychological', description: 'Mental resilience. Leadership development. Handle setbacks. Performance under scrutiny.' },
      { pillar: 'Lifestyle & Education', description: 'Career awareness. Life skills. Financial literacy basics. Balancing football and academics at a higher level.' },
    ],
  },
  {
    ageGroup: 'U19',
    title: 'U19 — Game Management & Physical Optimisation',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    focus: [
      { pillar: 'Technical', description: 'Elite-level execution. Perform consistently across all game states. Minimal technical errors under maximum pressure.' },
      { pillar: 'Tactical', description: 'Full tactical autonomy. Game management — tempo, territory, clock management. First-team readiness.' },
      { pillar: 'Physical', description: 'Peak physical preparation. Individualised periodisation. Injury prevention. Match-day preparation protocols.' },
      { pillar: 'Psychological', description: 'Professional mindset. Accountability. Self-driven development. Manage the transition to senior football.' },
      { pillar: 'Lifestyle & Education', description: 'Prepare for life beyond the academy. Career pathway planning. Financial awareness. Aftercare engagement.' },
    ],
  },
];

const MethodologyHub = ({ role, userName }: MethodologyHubProps) => {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleCopyTag = (tagId: string) => {
    setCopiedTag(tagId);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const allTags = [...methodologyTags.principles, ...methodologyTags.developmentPillars, ...methodologyTags.values];

  return (
    <ShelDemoLayout role={role} userName={userName}>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Club Methodology Hub</h1>
        <p className="text-muted-foreground mt-1">Shelbourne FC Academy — Football framework, playing philosophy, and development reference library</p>
      </div>

      {/* Demo notice */}
      <Card className="mb-6 bg-gradient-to-r from-red-500/10 to-red-700/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Academy Reference System</h4>
              <p className="text-sm text-muted-foreground">This is the academy's central football framework. Principles, values, and development pillars defined here can be referenced across Session Planning and Individual Development Plans using the alignment tag system. <span className="text-red-500 font-medium">Demo environment — illustrative content only.</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2">
          <TabsTrigger value="identity">Academy Identity</TabsTrigger>
          <TabsTrigger value="game-model">Game Model</TabsTrigger>
          <TabsTrigger value="development">Development Framework</TabsTrigger>
          <TabsTrigger value="tags">Alignment Tags</TabsTrigger>
        </TabsList>

        {/* ═══ 1. ACADEMY IDENTITY ═══ */}
        <TabsContent value="identity" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" /> Playing Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <p className="text-foreground leading-relaxed">Shelbourne FC Academy is committed to developing technically excellent, tactically intelligent footballers who are brave on the ball and relentless without it. We play a possession-based, attacking style built from the back, with high pressing and fast transitions. Every player, regardless of age group, learns to play the Shelbourne way.</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" /> Core Principles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'Possession with Purpose', desc: 'We keep the ball to create, not to keep it safe. Every pass should have intent.' },
                  { title: 'Press & Recover', desc: 'Win the ball back quickly and high. When we lose it, we react immediately.' },
                  { title: 'Play Through the Lines', desc: 'Build from the back. Find midfield. Arrive in the final third with numbers.' },
                  { title: 'Positional Play', desc: 'Structure creates freedom. Players must understand their position and the positions around them.' },
                  { title: 'Attack with Width & Depth', desc: 'Stretch the pitch. Create overloads. Use the full playing area.' },
                ].map((p, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/30">
                    <p className="font-medium text-foreground text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-red-500" /> Development Values
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {methodologyTags.values.map(v => (
                  <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="font-medium text-foreground text-sm">{v.label}</span>
                    <Badge variant="outline" className="ml-auto bg-red-500/10 text-red-500 border-red-500/30 text-xs cursor-pointer" onClick={() => handleCopyTag(v.id)}>
                      {copiedTag === v.id ? <CheckCircle className="h-3 w-3 mr-1" /> : <Tag className="h-3 w-3 mr-1" />}Tag
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" /> Non-Negotiables
              </CardTitle>
              <CardDescription>Standards that apply to every player, every session, every game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  'Every player plays out from the back — no long balls to avoid pressure',
                  'Counter-press within 5 seconds of losing possession',
                  'Communication is constant — on and off the ball',
                  'Respect the ball, your teammates, your opponents, and the officials',
                  'Be on time, be prepared, be coachable',
                  'Every training session is an opportunity to improve',
                  'Support your teammates — on and off the pitch',
                  'Lifestyle matters — nutrition, sleep, and education are part of development',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ 2. GAME MODEL ═══ */}
        <TabsContent value="game-model" className="space-y-6">
          <Card className="bg-gradient-to-r from-red-500/5 to-red-700/5 border-red-500/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Shelbourne FC Game Model</span> — Organised by phase of play. Each principle includes tactical behaviours, coaching language, and age-specific adaptation notes. Principles can be tagged to sessions and IDPs.
              </p>
            </CardContent>
          </Card>

          {gameModelPhases.map(phase => (
            <Card key={phase.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <phase.icon className={`h-5 w-5 ${phase.color}`} />
                  {phase.title}
                </CardTitle>
                <CardDescription>{phase.principles.length} principles defined</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-2">
                  {phase.principles.map((principle, idx) => (
                    <AccordionItem key={idx} value={`${phase.id}-${idx}`} className="border rounded-lg px-4 bg-muted/20">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${phase.color.replace('text-', 'bg-')}`} />
                          <span className="font-medium text-foreground text-sm">{principle.title}</span>
                          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs ml-2">
                            <Tag className="h-3 w-3 mr-1" />Taggable
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tactical Behaviours</h5>
                          <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">{principle.behaviour}</p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Coaching Language</h5>
                          <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg italic">{principle.language}</p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Age-Specific Adaptations</h5>
                          <div className="grid gap-2 md:grid-cols-2">
                            {Object.entries(principle.ageNotes).map(([age, note]) => (
                              <div key={age} className={`p-3 rounded-lg border ${phase.bg}`}>
                                <span className="text-xs font-bold text-foreground">{age}</span>
                                <p className="text-xs text-muted-foreground mt-1">{note as string}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ═══ 3. DEVELOPMENT FRAMEWORK ═══ */}
        <TabsContent value="development" className="space-y-6">
          <Card className="bg-gradient-to-r from-red-500/5 to-red-700/5 border-red-500/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Development Framework</span> — Age-group expectations across the five development pillars. This framework guides IDP objectives, session planning focus, and coaching priorities at each stage of the pathway.
              </p>
            </CardContent>
          </Card>

          {developmentFramework.map(ag => (
            <Card key={ag.ageGroup} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${ag.color}`}>
                    <span className="text-xs font-bold">{ag.ageGroup}</span>
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">{ag.title}</CardTitle>
                    <CardDescription>5 development pillars</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {ag.focus.map(f => (
                    <div key={f.pillar} className="p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={
                          f.pillar === 'Technical' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' :
                          f.pillar === 'Tactical' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          f.pillar === 'Physical' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          f.pillar === 'Psychological' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }>{f.pillar}</Badge>
                        <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                          <Tag className="h-3 w-3 mr-1" />Tag
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ═══ 4. ALIGNMENT TAGS ═══ */}
        <TabsContent value="tags" className="space-y-6">
          <Card className="bg-gradient-to-r from-red-500/5 to-red-700/5 border-red-500/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Alignment Tag System</span> — Every principle, pillar, and value defined in this Methodology Hub is available as a selectable tag. Tags can be applied to sessions in Session Planning and to objectives in Individual Development Plans, ensuring alignment with the academy's methodology.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-red-500" /> All Available Tags
              </CardTitle>
              <CardDescription>{allTags.length} tags available for Session Planning and IDP alignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Game Model Principles */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" /> Game Model Principles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {methodologyTags.principles.map(tag => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                      onClick={() => handleCopyTag(tag.id)}
                    >
                      {copiedTag === tag.id ? <CheckCircle className="h-3 w-3 mr-1 text-green-400" /> : <Tag className="h-3 w-3 mr-1" />}
                      {tag.label}
                      <span className="ml-1 text-muted-foreground">· {tag.category}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Development Pillars */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-red-500" /> Development Pillars
                </h4>
                <div className="flex flex-wrap gap-2">
                  {methodologyTags.developmentPillars.map(tag => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className={`cursor-pointer hover:bg-red-500/20 hover:border-red-500/30 transition-colors ${
                        tag.label === 'Technical' ? 'bg-emerald-500/10 border-emerald-500/30' :
                        tag.label === 'Tactical' ? 'bg-purple-500/10 border-purple-500/30' :
                        tag.label === 'Physical' ? 'bg-green-500/10 border-green-500/30' :
                        tag.label === 'Psychological' ? 'bg-amber-500/10 border-amber-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                      }`}
                      onClick={() => handleCopyTag(tag.id)}
                    >
                      {copiedTag === tag.id ? <CheckCircle className="h-3 w-3 mr-1 text-green-400" /> : <Tag className="h-3 w-3 mr-1" />}
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Values */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" /> Academy Values
                </h4>
                <div className="flex flex-wrap gap-2">
                  {methodologyTags.values.map(tag => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer bg-red-500/10 border-red-500/30 hover:bg-red-500/20 transition-colors"
                      onClick={() => handleCopyTag(tag.id)}
                    >
                      {copiedTag === tag.id ? <CheckCircle className="h-3 w-3 mr-1 text-green-400" /> : <Tag className="h-3 w-3 mr-1" />}
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Usage Info */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">How Tags Work</h4>
                <div className="grid gap-2 md:grid-cols-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <p><strong className="text-foreground">Session Planning</strong> When creating a session, select methodology tags to align the session with specific principles from the game model.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <p><strong className="text-foreground">IDPs</strong> When defining development objectives, tag them with relevant pillars and principles to ensure individual plans align with the academy's methodology.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ShelDemoLayout>
  );
};

export default MethodologyHub;
