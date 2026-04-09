// ── Alignment Tag System ─────────────────────────────────────────────────────
// Exported so session planning and IDP modules can reference these tags.

export const METHODOLOGY_TAGS = {
  principles: [
    { id: 'mp-1',  label: 'Play Out From the Back',    category: 'In Possession',               pillar: 'game-model' },
    { id: 'mp-2',  label: 'Positional Superiority',    category: 'In Possession',               pillar: 'game-model' },
    { id: 'mp-3',  label: 'Third-Man Runs',            category: 'In Possession',               pillar: 'game-model' },
    { id: 'mp-4',  label: 'Width & Depth in Attack',   category: 'In Possession',               pillar: 'game-model' },
    { id: 'mp-5',  label: 'Patient Build-Up',          category: 'In Possession',               pillar: 'game-model' },
    { id: 'mp-6',  label: 'Press from the Front',      category: 'Out of Possession',           pillar: 'game-model' },
    { id: 'mp-7',  label: 'Compact Defensive Shape',   category: 'Out of Possession',           pillar: 'game-model' },
    { id: 'mp-8',  label: 'Cut Passing Lanes',         category: 'Out of Possession',           pillar: 'game-model' },
    { id: 'mp-9',  label: 'Immediate Counter-Press',   category: 'Transition (Attack→Defence)', pillar: 'game-model' },
    { id: 'mp-10', label: 'Recover Behind the Ball',   category: 'Transition (Attack→Defence)', pillar: 'game-model' },
    { id: 'mp-11', label: 'Vertical Speed on Turnover',category: 'Transition (Defence→Attack)', pillar: 'game-model' },
    { id: 'mp-12', label: 'Switch Play Early',         category: 'Transition (Defence→Attack)', pillar: 'game-model' },
    { id: 'mp-13', label: 'Set Piece Organisation',    category: 'Set Pieces',                  pillar: 'game-model' },
    { id: 'mp-14', label: 'Dead Ball Delivery',        category: 'Set Pieces',                  pillar: 'game-model' },
  ],
  developmentPillars: [
    { id: 'dp-tech',  label: 'Technical',           pillar: 'development' },
    { id: 'dp-tact',  label: 'Tactical',            pillar: 'development' },
    { id: 'dp-phys',  label: 'Physical',            pillar: 'development' },
    { id: 'dp-psych', label: 'Psychological',       pillar: 'development' },
    { id: 'dp-life',  label: 'Lifestyle & Education', pillar: 'development' },
  ],
  values: [
    { id: 'val-1', label: 'Courage on the Ball',      pillar: 'identity' },
    { id: 'val-2', label: 'Work Rate & Intensity',    pillar: 'identity' },
    { id: 'val-3', label: 'Respect & Discipline',     pillar: 'identity' },
    { id: 'val-4', label: 'Team-First Mentality',     pillar: 'identity' },
    { id: 'val-5', label: 'Continuous Improvement',   pillar: 'identity' },
  ],
};

// ── Game Model Phases ─────────────────────────────────────────────────────────

export interface AgeNotes { U14: string; U15: string; U17: string; U19: string; }

export interface GamePrinciple {
  title: string;
  behaviour: string;
  language: string;
  ageNotes: AgeNotes;
}

export interface GameModelPhase {
  id: string;
  title: string;
  iconClass: string;
  colorClass: string;
  bgClass: string;
  principles: GamePrinciple[];
}

export const GAME_MODEL_PHASES: GameModelPhase[] = [
  {
    id: 'in-possession',
    title: 'In Possession',
    iconClass: 'bi-bullseye',
    colorClass: 'text-success',
    bgClass: 'bg-success',
    principles: [
      {
        title: 'Play Out From the Back',
        behaviour: 'GK and CBs build with short passes. Full-backs provide width. Midfielder drops to create a diamond.',
        language: 'Find the free man · Play through, not over · Show for the ball',
        ageNotes: {
          U14: 'Focus on comfort on the ball. Allow mistakes. Encourage bravery.',
          U15: 'Introduce positional rotations. Add pressure gradually.',
          U17: 'Expect consistent execution. Introduce opponent-specific adjustments.',
          U19: 'Full tactical flexibility. Players should recognise when to play short or go direct.',
        },
      },
      {
        title: 'Positional Superiority',
        behaviour: 'Create numerical advantages in key zones through movement and positioning. Overloads on the ball-side.',
        language: 'Create the extra man · Move to receive · Open passing lanes',
        ageNotes: {
          U14: 'Teach basic triangle shapes and support angles.',
          U15: 'Introduce zone-specific overloads. Half-space occupation.',
          U17: 'Full understanding of positional play. Autonomy expected.',
          U19: 'Game-manage possession. Adjust tempo based on game state.',
        },
      },
      {
        title: 'Width & Depth in Attack',
        behaviour: 'Wingers and full-backs stretch the pitch. Striker provides depth. Midfielders fill the half-spaces.',
        language: 'Stretch them · Get wide · Pin the defender',
        ageNotes: {
          U14: 'Focus on using the full pitch. Simple width concepts.',
          U15: 'Introduce half-space positioning. Timing of runs.',
          U17: 'Coordinated attacking movement. Combined play.',
          U19: 'Full-pitch awareness. Recognise and exploit space.',
        },
      },
    ],
  },
  {
    id: 'out-of-possession',
    title: 'Out of Possession',
    iconClass: 'bi-shield-fill',
    colorClass: 'text-danger',
    bgClass: 'bg-danger',
    principles: [
      {
        title: 'Press from the Front',
        behaviour: 'Striker initiates the press on the ball-side CB. Wingers curve their runs to block wide options. Midfield supports from behind.',
        language: 'Go! · Show them inside · Squeeze up',
        ageNotes: {
          U14: 'Introduce pressing triggers. Focus on effort and intent.',
          U15: 'Coordinate pressing as a unit. Cover shadows.',
          U17: 'Opponent-specific pressing traps. Read the play.',
          U19: 'Game-state awareness. Press high or mid-block based on context.',
        },
      },
      {
        title: 'Compact Defensive Shape',
        behaviour: 'Defensive block stays within 35 metres vertically. Shift as a unit. No gaps between lines.',
        language: 'Stay connected · Slide together · Close the gap',
        ageNotes: {
          U14: 'Basic defensive shape. Teach distances.',
          U15: 'Introduce shifting as a back four. Communication.',
          U17: 'Disciplined shape under pressure. Recovery positioning.',
          U19: 'Full defensive organisation. Manage tempo of opponent.',
        },
      },
      {
        title: 'Cut Passing Lanes',
        behaviour: 'Defenders and midfielders position body to block forward passes. Force opponent backwards or sideways.',
        language: 'Show them back · Block the line · Deny the switch',
        ageNotes: {
          U14: 'Body shape awareness. Angle of approach.',
          U15: 'Anticipation and interception practice.',
          U17: 'Read the game. Intercept with purpose.',
          U19: "Proactive defending. Win the ball, don't just block.",
        },
      },
    ],
  },
  {
    id: 'transition-atk-def',
    title: 'Transition (Attack → Defence)',
    iconClass: 'bi-arrow-repeat',
    colorClass: 'text-warning',
    bgClass: 'bg-warning',
    principles: [
      {
        title: 'Immediate Counter-Press',
        behaviour: 'On loss of possession, nearest three players press immediately within 5 seconds. Others recover shape.',
        language: 'React! · Win it back now · 5-second rule',
        ageNotes: {
          U14: 'Introduce the concept. Reward effort and reaction.',
          U15: 'Expect a coordinated press from nearby players.',
          U17: 'Full-team counter-press. Organised and aggressive.',
          U19: 'Intelligent counter-press. Know when to press and when to drop.',
        },
      },
      {
        title: 'Recover Behind the Ball',
        behaviour: 'Players ahead of the ball sprint to recover behind it. Re-establish defensive shape within 6 seconds.',
        language: 'Get back! · Shape up · Behind the ball',
        ageNotes: {
          U14: 'Emphasis on desire and willingness to recover.',
          U15: 'Recovery runs with purpose. Get goal-side.',
          U17: 'Recovery speed and intelligence. Communication.',
          U19: 'Manage energy. Recover smartly and efficiently.',
        },
      },
    ],
  },
  {
    id: 'transition-def-atk',
    title: 'Transition (Defence → Attack)',
    iconClass: 'bi-lightning-fill',
    colorClass: 'text-primary',
    bgClass: 'bg-primary',
    principles: [
      {
        title: 'Vertical Speed on Turnover',
        behaviour: 'First pass after winning the ball should be forward. Wide players and strikers anticipate the turnover.',
        language: 'Go forward! · Attack the space · Be alive',
        ageNotes: {
          U14: 'Encourage forward play. Celebrate positive transitions.',
          U15: 'Timing of forward runs. Anticipation.',
          U17: 'Quick combination play on turnovers.',
          U19: 'Game-state dependent. Fast break or controlled transition.',
        },
      },
      {
        title: 'Switch Play Early',
        behaviour: 'After winning possession, look to switch to the weak side where space is available.',
        language: 'Switch it! · Find the space · Change the angle',
        ageNotes: {
          U14: 'Scanning and awareness. Look before you receive.',
          U15: 'Weight and accuracy of longer passes.',
          U17: 'Decision-making speed. Execute under pressure.',
          U19: "Full tactical awareness. Exploit opponent's shape.",
        },
      },
    ],
  },
  {
    id: 'set-pieces',
    title: 'Set Pieces',
    iconClass: 'bi-flag-fill',
    colorClass: 'text-info',
    bgClass: 'bg-info',
    principles: [
      {
        title: 'Set Piece Organisation',
        behaviour: 'Structured routines for corners, free kicks, and throw-ins. Assigned roles and runs. Rehearsed weekly.',
        language: 'Know your job · Trust the routine · Execute',
        ageNotes: {
          U14: 'Simple set-piece routines. 2–3 variations.',
          U15: 'Add complexity. Decoy runs and timing.',
          U17: 'Full set-piece playbook. Opponent analysis.',
          U19: 'Game-specific set pieces. In-game adjustments.',
        },
      },
      {
        title: 'Dead Ball Delivery',
        behaviour: 'Consistent delivery to target areas. Near post, far post, and short options. Quality over quantity.',
        language: 'Pick your spot · Match the run · Deliver it',
        ageNotes: {
          U14: 'Technique focus. Repetition and consistency.',
          U15: 'Introduce variety. In-swinger vs out-swinger.',
          U17: 'Match-quality delivery under pressure.',
          U19: 'Specialist deliverers. Tactical awareness.',
        },
      },
    ],
  },
];

// ── Development Framework ─────────────────────────────────────────────────────

export interface DevelopmentPillar { pillar: string; description: string; }

export interface AgeGroupFramework {
  ageGroup: string;
  title: string;
  badgeClass: string;
  focus: DevelopmentPillar[];
}

export const DEVELOPMENT_FRAMEWORK: AgeGroupFramework[] = [
  {
    ageGroup: 'U14',
    title: 'U14 — Technical Foundation & Tactical Awareness',
    badgeClass: 'text-bg-success',
    focus: [
      { pillar: 'Technical',            description: 'Master core techniques — receiving, passing, turning, finishing. Comfort on the ball under pressure. Encourage both feet.' },
      { pillar: 'Tactical',             description: 'Introduce basic principles of play. Understand positions and roles. Begin to recognise game situations.' },
      { pillar: 'Physical',             description: 'Develop agility, coordination, and movement literacy. No specialised conditioning. Fun and varied physical challenges.' },
      { pillar: 'Psychological',        description: 'Build confidence and enjoyment. Encourage risk-taking and creativity. Develop resilience through positive reinforcement.' },
      { pillar: 'Lifestyle & Education',description: 'Introduce the importance of nutrition, sleep, and school balance. Build good habits early.' },
    ],
  },
  {
    ageGroup: 'U15',
    title: 'U15 — Positional Development',
    badgeClass: 'text-bg-primary',
    focus: [
      { pillar: 'Technical',            description: 'Refine under pressure. Position-specific technique — crossing for wingers, distribution for GKs, heading for CBs.' },
      { pillar: 'Tactical',             description: "Develop understanding of the club's game model. Positional play. Unit work (defensive line, midfield triangle)." },
      { pillar: 'Physical',             description: 'Introduce structured physical development. Speed, change of direction, and basic strength foundations.' },
      { pillar: 'Psychological',        description: 'Develop decision-making under pressure. Introduce goal-setting through IDPs. Manage expectations.' },
      { pillar: 'Lifestyle & Education',description: 'Reinforce time management. Support academic balance. Introduce the daily check-in concept.' },
    ],
  },
  {
    ageGroup: 'U17',
    title: 'U17 — Tactical Refinement',
    badgeClass: 'text-bg-danger',
    focus: [
      { pillar: 'Technical',            description: 'Consistency under match pressure. Position-specific mastery. Execute at speed and intensity.' },
      { pillar: 'Tactical',             description: 'Full game model understanding. Read the game. Opponent analysis. In-game problem solving and adaptability.' },
      { pillar: 'Physical',             description: 'Individualised physical programmes. Strength, endurance, and recovery protocols. Load management awareness.' },
      { pillar: 'Psychological',        description: 'Mental resilience. Leadership development. Handle setbacks. Performance under scrutiny.' },
      { pillar: 'Lifestyle & Education',description: 'Career awareness. Life skills. Financial literacy basics. Balancing football and academics at a higher level.' },
    ],
  },
  {
    ageGroup: 'U19',
    title: 'U19 — Game Management & Physical Optimisation',
    badgeClass: 'text-bg-warning',
    focus: [
      { pillar: 'Technical',            description: 'Elite-level execution. Perform consistently across all game states. Minimal technical errors under maximum pressure.' },
      { pillar: 'Tactical',             description: 'Full tactical autonomy. Game management — tempo, territory, clock management. First-team readiness.' },
      { pillar: 'Physical',             description: 'Peak physical preparation. Individualised periodisation. Injury prevention. Match-day preparation protocols.' },
      { pillar: 'Psychological',        description: 'Professional mindset. Accountability. Self-driven development. Manage the transition to senior football.' },
      { pillar: 'Lifestyle & Education',description: 'Prepare for life beyond the academy. Career pathway planning. Financial awareness. Aftercare engagement.' },
    ],
  },
];
