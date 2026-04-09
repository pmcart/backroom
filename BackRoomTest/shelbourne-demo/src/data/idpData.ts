// Individual Development Plan data for The Backroom Team demo

export type IDPMode = 'basic' | 'elite';

// ── Elite IDP Types ──────────────────────────────────────
export interface HolisticEvaluation {
  technical: number;    // 1-10
  tactical: number;
  physical: number;
  psychological: number;
  lifestyle: number;
  notes: string;
  date: string;
}

export interface PositionalProfile {
  primaryPosition: string;
  secondaryPosition: string;
  demands: string[];   // position-specific development demands
}

export interface PerformanceSupport {
  physicalFocus: string;
  nutritionHabits: string;
  recoveryHabits: string;
  psychologicalStrengthening: string;
}

export interface OffFieldDevelopment {
  leadership: string;
  communication: string;
  education: string;
  lifeSkills: string;
}

export interface ReviewEntry {
  id: string;
  date: string;
  type: 'weekly' | 'monthly';
  summary: string;
  objectivesEdited: string[];
  archivedGoals: string[];
}


export interface IDPFull {
  id: string;
  playerId: string;
  playerName: string;
  position: string;
  ageGroup: string;
  createdDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  status: 'active' | 'review-due' | 'completed';
  overallProgress: number;
  mode: IDPMode;
  goals: IDPGoalFull[];
  coachComments: Comment[];
  playerReflections: PlayerReflection[];
  // Elite-only fields
  holisticEvaluation?: HolisticEvaluation;
  positionalProfile?: PositionalProfile;
  performanceSupport?: PerformanceSupport;
  offFieldDevelopment?: OffFieldDevelopment;
  reviewHistory?: ReviewEntry[];
  methodologyTags?: string[];  // IDs from methodology hub
}

export interface IDPGoalFull {
  id: string;
  category: 'technical' | 'tactical' | 'physical' | 'psychological' | 'lifestyle';
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'on-track' | 'at-risk' | 'completed';
  actions: string[];
  evidence: string[];
  coachRating?: number;
  playerRating?: number;
}

export interface Comment {
  id: string;
  author: string;
  role: 'coach' | 'player' | 'head-of-academy';
  date: string;
  content: string;
}

export interface PlayerReflection {
  id: string;
  date: string;
  weekNumber: number;
  whatWentWell: string;
  whatToImprove: string;
  focusForNextWeek: string;
  mood: 1 | 2 | 3 | 4 | 5;
}

// Example IDP - Marcus Johnson (Striker)
export const marcusIDP: IDPFull = {
  id: 'idp1',
  playerId: 'p1',
  playerName: 'Marcus Johnson',
  position: 'Striker',
  ageGroup: 'U18',
  mode: 'basic',
  createdDate: '2024-09-01',
  lastReviewDate: '2024-01-10',
  nextReviewDate: '2024-02-10',
  status: 'active',
  overallProgress: 62,
  goals: [
    {
      id: 'g1',
      category: 'technical',
      title: 'Improve Weak Foot Finishing',
      description: 'Develop left foot finishing to become a more unpredictable striker. Aim to score at least 3 goals with left foot by end of season.',
      targetDate: '2024-05-01',
      progress: 65,
      status: 'on-track',
      actions: [
        'Extra finishing practice - 20 mins after training (3x week)',
        'Video analysis of left-footed finishers',
        'Focus on technique not power initially',
      ],
      evidence: [
        'Scored first left-foot goal vs Chelsea U18 (Jan 10)',
        'Coach noted improved confidence on left side',
      ],
      coachRating: 4,
      playerRating: 3,
    },
    {
      id: 'g2',
      category: 'tactical',
      title: 'Movement in the Box',
      description: 'Improve timing and variety of runs in the penalty area. Create more space for teammates and find better positions for tap-ins.',
      targetDate: '2024-03-15',
      progress: 40,
      status: 'at-risk',
      actions: [
        'Study video of movement patterns from elite strikers',
        'Work with assistant coach on specific movement drills',
        'Practice near-post/far-post runs in crossing sessions',
      ],
      evidence: [
        'Identified key patterns to work on from video session',
      ],
      coachRating: 2,
      playerRating: 3,
    },
    {
      id: 'g3',
      category: 'physical',
      title: 'Upper Body Strength',
      description: 'Develop strength to hold off defenders and win more aerial duels. Target 10% increase in upper body lifts.',
      targetDate: '2024-04-01',
      progress: 70,
      status: 'on-track',
      actions: [
        'Additional gym sessions focusing on pushing/pulling',
        'Specific exercises bench press, rows, shoulder press',
        'Nutrition plan to support muscle growth',
      ],
      evidence: [
        'Bench press increased from 60kg to 70kg',
        'Won 3 more aerial duels in last 4 matches',
      ],
      coachRating: 4,
      playerRating: 4,
    },
    {
      id: 'g4',
      category: 'psychological',
      title: 'Resilience After Missing Chances',
      description: "Maintain positive body language and continue making runs after missed opportunities. Don't let frustration affect performance.",
      targetDate: '2024-03-01',
      progress: 55,
      status: 'in-progress',
      actions: [
        'Work with sport psychologist on mental reset techniques',
        'Practice positive self-talk routines',
        'Review video of response to missed chances',
      ],
      evidence: [
        'Psychologist noted improvement in training scenarios',
        'Scored winning goal after missing penalty vs Arsenal',
      ],
      coachRating: 3,
      playerRating: 3,
    },
    {
      id: 'g5',
      category: 'lifestyle',
      title: 'Sleep Routine Consistency',
      description: 'Establish consistent sleep pattern to aid recovery. Aim for 8+ hours sleep, in bed by 1030pm on training nights.',
      targetDate: '2024-02-01',
      progress: 80,
      status: 'on-track',
      actions: [
        'No screens 1 hour before bed',
        'Same bedtime routine each night',
        'Track sleep in monitoring app',
      ],
      evidence: [
        'Average sleep increased from 6.5 to 7.8 hours',
        'Reported feeling more energetic in training',
      ],
      coachRating: 4,
      playerRating: 5,
    },
  ],
  coachComments: [
    {
      id: 'cc1',
      author: 'David Mitchell',
      role: 'coach',
      date: '2024-01-10',
      content: "Good progress this month Marcus. Your left foot is looking much more confident - keep up the extra practice. The main area to focus on is your movement in the box. Let's work on this together in the coming weeks. I've scheduled some 1-on-1 sessions with the assistant coach.",
    },
    {
      id: 'cc2',
      author: 'David Mitchell',
      role: 'coach',
      date: '2023-12-15',
      content: 'Solid start to the IDP. Physical gains are clear to see. Need to see more application of tactical concepts in matches though. The mental side is improving - your reaction to the missed penalty showed real maturity.',
    },
    {
      id: 'cc3',
      author: 'James Harrison',
      role: 'head-of-academy',
      date: '2023-11-20',
      content: "Marcus is showing great commitment to his development. The balance of his IDP across all pillars is exactly what we want to see. Keep pushing on the weaker areas - that's where the breakthrough will come.",
    },
  ],
  playerReflections: [
    {
      id: 'pr1',
      date: '2024-01-12',
      weekNumber: 18,
      whatWentWell: 'Scored my first left foot goal in a competitive match! All the extra practice is paying off. Also felt stronger in the air during the Chelsea game.',
      whatToImprove: 'Still getting frustrated when I miss chances. Need to use the techniques from psychology sessions more consistently in games.',
      focusForNextWeek: 'Box movement - going to watch more video of Kane and Haaland to understand their movement patterns.',
      mood: 4,
    },
    {
      id: 'pr2',
      date: '2024-01-05',
      weekNumber: 17,
      whatWentWell: "Sleep routine is now consistent. Feeling more recovered and sharper in training. Upper body strength is noticeably better.",
      whatToImprove: "Missed two clear chances on Saturday. Both were with my right foot so technique isn't the issue - need to be calmer in front of goal.",
      focusForNextWeek: 'Left foot finishing - want to try shooting with left when I would normally go right.',
      mood: 3,
    },
    {
      id: 'pr3',
      date: '2023-12-22',
      weekNumber: 15,
      whatWentWell: "Gym numbers are improving. Bench press at 70kg now. Team win helped my confidence going into the break.",
      whatToImprove: "Christmas break needs to be managed - don't want to lose all my progress on sleep and nutrition.",
      focusForNextWeek: 'Maintain routines during the holiday period. Light training at home.',
      mood: 4,
    },
  ],
};

// Example IDP - Oliver Thompson (Midfielder)
export const oliverIDP: IDPFull = {
  id: 'idp2',
  playerId: 'p2',
  playerName: 'Oliver Thompson',
  position: 'Midfielder',
  ageGroup: 'U18',
  mode: 'basic',
  createdDate: '2024-09-01',
  lastReviewDate: '2024-01-08',
  nextReviewDate: '2024-02-08',
  status: 'active',
  overallProgress: 71,
  goals: [
    {
      id: 'g6',
      category: 'physical',
      title: 'Increase Sprint Speed',
      description: 'Improve 10m and 30m sprint times by 5%. Currently limiting ability to break away from markers.',
      targetDate: '2024-02-28',
      progress: 80,
      status: 'on-track',
      actions: [
        'Sprint training 2x per week with S&C',
        'Plyometric work for explosive power',
        'Technique work on sprint mechanics',
      ],
      evidence: [
        '10m sprint improved from 1.85s to 1.78s',
        '30m sprint improved from 4.2s to 4.0s',
      ],
      coachRating: 5,
      playerRating: 4,
    },
    {
      id: 'g7',
      category: 'psychological',
      title: 'Leadership Development',
      description: 'Develop vocal leadership qualities on the pitch. Become a player others look to in difficult moments.',
      targetDate: '2024-05-01',
      progress: 55,
      status: 'on-track',
      actions: [
        'Captaincy in youth team matches',
        'Leadership workshop attendance',
        'Mentor from first team (senior player shadowing)',
      ],
      evidence: [
        'Appointed vice-captain for U18s',
        'Positive feedback from teammates on communication',
      ],
      coachRating: 3,
      playerRating: 3,
    },
    {
      id: 'g8',
      category: 'technical',
      title: 'Long-Range Passing',
      description: 'Develop ability to switch play and find teammates with accurate long passes. Expand passing range.',
      targetDate: '2024-04-01',
      progress: 60,
      status: 'in-progress',
      actions: [
        'Focused passing sessions 2x per week',
        'Video study of Kroos/Modric passing technique',
        'In-game target 2 successful switches per match',
      ],
      evidence: [
        'Switch pass completion up from 45% to 58%',
        'Assist from 40-yard pass vs Arsenal',
      ],
      coachRating: 3,
      playerRating: 4,
    },
  ],
  coachComments: [
    {
      id: 'cc4',
      author: 'David Mitchell',
      role: 'coach',
      date: '2024-01-08',
      content: 'Oli, your physical development has been outstanding. The sprint numbers are exactly where we wanted them. Leadership is growing naturally - keep being vocal. The long passing is coming along but needs more match practice.',
    },
  ],
  playerReflections: [
    {
      id: 'pr4',
      date: '2024-01-07',
      weekNumber: 18,
      whatWentWell: 'Sprint times hit my target! Feeling much sharper in transition. The leadership is becoming more natural - less forced.',
      whatToImprove: 'Passing still inconsistent under pressure. Need to practice with defenders closing down.',
      focusForNextWeek: 'Long passing under pressure - ask coach for specific drill.',
      mood: 5,
    },
  ],
};

// Collection of all demo IDPs
export const demoIDPs: IDPFull[] = [marcusIDP, oliverIDP];

// IDP Summary for list views
export interface IDPSummary {
  id: string;
  playerName: string;
  position: string;
  ageGroup: string;
  overallProgress: number;
  status: 'active' | 'review-due' | 'completed';
  nextReviewDate: string;
  goalsAtRisk: number;
  goalsOnTrack: number;
  mode?: IDPMode;
}

export const idpSummaries: IDPSummary[] = [
  {
    id: 'idp1',
    playerName: 'Marcus Johnson',
    position: 'Striker',
    ageGroup: 'U18',
    overallProgress: 62,
    status: 'active',
    nextReviewDate: '2024-02-10',
    goalsAtRisk: 1,
    goalsOnTrack: 4,
  },
  {
    id: 'idp2',
    playerName: 'Oliver Thompson',
    position: 'Midfielder',
    ageGroup: 'U18',
    overallProgress: 71,
    status: 'active',
    nextReviewDate: '2024-02-08',
    goalsAtRisk: 0,
    goalsOnTrack: 3,
  },
  {
    id: 'idp3',
    playerName: 'James Williams',
    position: 'Defender',
    ageGroup: 'U18',
    overallProgress: 45,
    status: 'review-due',
    nextReviewDate: '2024-01-15',
    goalsAtRisk: 2,
    goalsOnTrack: 1,
  },
  {
    id: 'idp4',
    playerName: 'Ethan Brown',
    position: 'Goalkeeper',
    ageGroup: 'U18',
    overallProgress: 78,
    status: 'active',
    nextReviewDate: '2024-02-20',
    goalsAtRisk: 0,
    goalsOnTrack: 4,
  },
  {
    id: 'idp5',
    playerName: 'Noah Davies',
    position: 'Winger',
    ageGroup: 'U16',
    overallProgress: 55,
    status: 'active',
    nextReviewDate: '2024-02-05',
    goalsAtRisk: 1,
    goalsOnTrack: 2,
  },
];
